const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {start}=require('../jll-remix-main-v4-tweaks.js');
const schema=require('../jll-remix-theme-schema.js');

test('corner tweaks paint above the shared opaque header while leaving skip navigation on top',()=>{
  const layer=(file,selector)=>{
    const css=fs.readFileSync(require.resolve('../'+file),'utf8');
    const rule=css.slice(css.indexOf(selector+' {')+selector.length).split('}')[0];
    return Number(rule.match(/z-index:\s*(\d+)/)[1]);
  };
  const header=layer('jll-remix-hanwha.css','.hw-page .nav-shell');
  const tweak=layer('jll-remix-main-v4.css','.main-v4-tweaks');
  assert.ok(tweak>header,'a control placed over the header cannot be behind its white background');
  assert.ok(tweak<100,'the shared skip link must remain reachable above the preview controls');
});

function fixture({saved=null,storageBlocked=false,search=''}={}){
  const events={},docEvents={},observers=[],styles={},attributes={};
  const control=()=>({events:{},addEventListener(name,fn){this.events[name]=fn;},setAttribute(name,value){this[name]=value;}});
  const toggle=control(),slider=control(),reset=control(),output={},insetSlider=control(),insetOutput={};
  const fontSelect={...control(),options:[],append(option){this.options.push(option);}};
  const storySelect={...control(),options:[],append(option){this.options.push(option);}},numberSelect={...control(),options:[],append(option){this.options.push(option);}};
  const foundationValues={},dispatched=[];
  const summary={focus(){this.focused=true;}};
  const panel={...control(),hidden:true,open:false,contains(target){return target===slider;},querySelector:selector=>({
    '#main-v4-nav-toggle':toggle,'#main-v4-story-font':storySelect,'#main-v4-number-font':numberSelect,'#main-v4-bar-inset':insetSlider,'#main-v4-bar-value':insetOutput,'#main-v4-title-position':slider,'#main-v4-title-value':output,
    '#main-v4-tweaks-reset':reset,'#main-v4-title-font':fontSelect,summary
  })[selector]};
  const copy={offsetHeight:230},bar={offsetHeight:138,bottom:null};
  const nav={toggleAttribute(name,value){attributes[name]=value;}};
  const hero={offsetHeight:700,style:{setProperty(name,value){styles[name]=value;}},
    querySelector:selector=>({'.hw-hero-copy':copy,'.main-v4-stories':bar})[selector]};
  let stored=saved;
  const win={location:{search},SPSThemeSchema:schema,SPSTheme:{value:token=>foundationValues[token]??schema.find(field=>field.token===token)?.value},
    getComputedStyle:element=>({bottom:element===bar?(bar.bottom??parseFloat(styles['--main-bar-inset'])??24)+'px':'auto',getPropertyValue:token=>foundationValues[token]===undefined?'':foundationValues[token]+'px'}),
    document:{createElement:()=>({}),querySelector:selector=>({'.main-v4-tweaks':panel,'#hw-intro':hero,'.main-v4-page-nav':nav})[selector],
    addEventListener(name,fn){docEvents[name]=fn;}},
    localStorage:{getItem(){if(storageBlocked)throw Error('blocked');return stored;},setItem(key,value){if(storageBlocked)throw Error('blocked');stored=value;}},
    addEventListener(name,fn){events[name]=fn;},dispatchEvent(event){dispatched.push(event.type);},CustomEvent:class{constructor(type){this.type=type;}},
    ResizeObserver:class{constructor(fn){this.fn=fn;}observe(element){observers.push({element,fn:this.fn});}}
  };
  start(win);
  return {panel,toggle,insetSlider,insetOutput,storySelect,numberSelect,dispatched,slider,reset,output,summary,fontSelect,foundationValues,copy,bar,hero,styles,attributes,events,docEvents,observers,
    stored:()=>JSON.parse(stored),move(value){slider.value=String(value);slider.events.input();}};
}

test('V4 opens with a collapsed layout panel, supports hiding the rail, and restores saved choices',()=>{
  const h=fixture();
  assert.equal(h.panel.hidden,false);assert.equal(h.panel.open,false);
  assert.equal(h.toggle.checked,true);assert.equal(h.output.value,'기본');
  h.toggle.checked=false;h.toggle.events.change();
  assert.equal(h.attributes['data-tweak-hidden'],true);
  h.move(100);assert.equal(h.styles['--main-title-offset'],'100px');
  assert.equal(h.output.value,'위 100px');assert.equal(h.slider['aria-valuetext'],'위 100px');
  const restored=fixture({saved:JSON.stringify(h.stored())});
  assert.equal(restored.panel.open,false);assert.equal(restored.toggle.checked,false);
  assert.equal(restored.styles['--main-title-offset'],'100px');
});

test('headline movement stays between the hero top and story bar after wrapping, resizing and theme changes',()=>{
  const h=fixture();
  assert.equal(h.slider.max,'252');
  h.move(-20);assert.equal(h.output.value,'아래 20px');
  h.move(240);assert.equal(h.styles['--main-title-offset'],'240px');
  h.hero.offsetHeight=520;h.events.resize();
  assert.equal(h.styles['--main-title-offset'],'72px');assert.equal(h.slider.value,'72');
  h.hero.offsetHeight=700;h.events.resize();
  assert.equal(h.styles['--main-title-offset'],'240px');
  h.copy.offsetHeight=330;h.observers.find(item=>item.element===h.copy).fn();
  assert.equal(h.styles['--main-title-offset'],'152px');
  h.bar.offsetHeight=220;h.events['sps-theme-change']();
  assert.equal(h.styles['--main-title-offset'],'70px');
  const bottom=h.bar.offsetHeight+32+Number.parseFloat(h.styles['--main-title-offset']);
  assert.ok(bottom>=h.bar.offsetHeight+12);
  assert.ok(h.hero.offsetHeight-bottom-h.copy.offsetHeight>=24);
});

test('reset restores the original layout and dismissal leaves focus accessible',()=>{
  const h=fixture({saved:JSON.stringify({showNav:false,offset:200})});
  h.reset.events.click();
  assert.equal(h.toggle.checked,true);assert.equal(h.attributes['data-tweak-hidden'],false);
  assert.equal(h.styles['--main-title-offset'],'0px');
  assert.deepEqual(h.stored(),{version:2,showNav:true,offset:0,fontToken:'--display-title-size',storyToken:'--body-size',numberToken:'--field-font-size',barInset:24});
  h.panel.open=true;h.docEvents.pointerdown({target:h.slider});assert.equal(h.panel.open,true);
  h.docEvents.pointerdown({target:{}});assert.equal(h.panel.open,false);
  h.panel.open=true;let prevented=false;
  h.panel.events.keydown({key:'Escape',preventDefault(){prevented=true;}});
  assert.equal(h.panel.open,false);assert.equal(h.summary.focused,true);assert.equal(prevented,true);
});

test('headline choices come from foundation title styles and stay linked to live foundation edits',()=>{
  const h=fixture();
  const expected=schema.filter(field=>field.section==='type'&&field.group==='content'&&field.token.includes('title'));
  assert.equal(h.fontSelect.options.length,6);
  assert.deepEqual(h.fontSelect.options.map(option=>option.value),expected.map(field=>field.token));
  assert.equal(h.fontSelect.value,'--display-title-size');
  h.fontSelect.value='--hero-title-size';h.fontSelect.events.change();
  assert.equal(h.styles['--main-title-size'],'var(--hero-title-size,59px)');
  assert.equal(h.stored().fontToken,'--hero-title-size');
  h.foundationValues['--hero-title-size']=64;h.events['sps-theme-change']();
  assert.match(h.fontSelect.options.find(option=>option.value==='--hero-title-size').textContent,/64px$/);
  assert.equal(h.styles['--main-title-size'],'var(--hero-title-size,59px)','keep the token reference rather than freezing a pixel value');
  const restored=fixture({saved:JSON.stringify(h.stored())});
  assert.equal(restored.fontSelect.value,'--hero-title-size');
  assert.equal(restored.styles['--main-title-size'],'var(--hero-title-size,59px)');
  restored.reset.events.click();assert.equal(restored.fontSelect.value,'--display-title-size');
});

test('arbitrary font values are rejected and changing size recalculates safe headline placement',()=>{
  const h=fixture({saved:'{"offset":240,"fontToken":"100px"}'});
  assert.equal(h.fontSelect.value,'--display-title-size');
  h.fontSelect.value='calc(100vw)';h.fontSelect.events.change();
  assert.equal(h.styles['--main-title-size'],'var(--display-title-size,72px)');
  h.copy.offsetHeight=390;
  h.fontSelect.value='--hero-title-size';h.fontSelect.events.change();
  assert.equal(h.styles['--main-title-offset'],'92px');
  assert.equal(h.slider.max,'92');
  assert.equal(h.styles['--main-title-size'],'var(--hero-title-size,59px)');
});

test('unavailable or malformed storage fails open; embedded comparison previews get no controls',()=>{
  for(const options of [{storageBlocked:true},{saved:'broken'},{saved:'{"showNav":"false","showDown":"false","offset":"300"}'}]){
    const h=fixture(options);assert.equal(h.toggle.checked,true);assert.equal(h.output.value,'기본');
    assert.doesNotThrow(()=>h.move(40));
  }
  const embedded=fixture({search:'?embed=1',saved:'{"showNav":false,"offset":200}'});
  assert.equal(embedded.panel.hidden,true);assert.deepEqual(embedded.styles,{});
  assert.equal(embedded.observers.length,0);
});

test('floating inset and story font choices persist, reject arbitrary values, notify layout and reset independently',()=>{
  const h=fixture({saved:'{"showNav":false,"offset":100,"fontToken":"--hero-title-size","showDown":false}'});
  assert.equal(h.fontSelect.value,'--display-title-size','old typography migrates to the approved display scale');
  assert.equal(h.toggle.checked,false);assert.equal(h.styles['--main-title-offset'],'100px');
  assert.equal(h.styles['--main-bar-inset'],'24px');
  h.insetSlider.value='40';h.insetSlider.events.input();
  assert.equal(h.styles['--main-bar-inset'],'40px');assert.equal(h.insetOutput.value,'40px');
  assert.ok(h.dispatched.includes('sps-main-layout-change'));
  h.storySelect.value='--field-font-size';h.storySelect.events.change();
  h.numberSelect.value='--body-size';h.numberSelect.events.change();
  assert.equal(h.styles['--main-story-size'],'var(--field-font-size,14px)');
  assert.equal(h.styles['--main-number-size'],'var(--body-size,16px)');
  const restored=fixture({saved:JSON.stringify(h.stored())});
  assert.equal(restored.insetSlider.value,'40');assert.equal(restored.storySelect.value,'--field-font-size');
  assert.equal(restored.numberSelect.value,'--body-size');assert.equal(restored.toggle.checked,false);
  restored.insetSlider.value='1000';restored.insetSlider.events.input();assert.equal(restored.styles['--main-bar-inset'],'64px');
  restored.storySelect.value='99px';restored.storySelect.events.change();assert.equal(restored.storySelect.value,'--body-size');
  restored.numberSelect.value='99px';restored.numberSelect.events.change();assert.equal(restored.numberSelect.value,'--field-font-size');
  restored.reset.events.click();assert.equal(restored.styles['--main-bar-inset'],'24px');
  assert.equal(restored.stored().showDown,undefined,'retired down preference is removed from storage');
});

test('saved title offsets stay above the mobile stories and restore on a larger viewport',()=>{
  const h=fixture();h.move(240);
  h.hero.offsetHeight=680;h.bar.offsetHeight=210;h.bar.bottom=0;h.copy.offsetHeight=240;
  h.events.resize();
  const offset=Number.parseFloat(h.styles['--main-title-offset']);
  assert.equal(offset,174);
  const bottom=h.bar.offsetHeight+h.bar.bottom+32+offset;
  assert.equal(h.hero.offsetHeight-bottom-h.copy.offsetHeight,24);
  assert.equal(h.stored().offset,240,'responsive clamping does not overwrite the desktop preference');
  h.hero.offsetHeight=900;h.bar.bottom=0;h.events.resize();
  assert.equal(h.styles['--main-title-offset'],'240px');
});
