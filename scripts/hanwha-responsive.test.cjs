const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../jll-remix-hanwha.js'),'utf8');

test('compact service cards keep every detail reachable through selection and rotation',()=>{
  const panels=Array.from({length:4},()=>{
    const button={setAttribute(name,value){this[name]=value;}},detail={inert:true};
    return {button,detail,classList:{toggle(){}},querySelector:s=>s==='button'?button:detail};
  });
  const context={panels,compactPanels:{matches:true},reduced:{matches:false}};
  vm.runInNewContext(source.slice(source.indexOf('  function choosePanel('),source.indexOf('  let aligning'))+';this.choose=choosePanel;',context);
  context.choose(null);
  assert.ok(panels.every(p=>!p.detail.inert&&p.button['aria-expanded']==='true'));
  context.choose(panels[1]);
  assert.ok(panels.every(p=>!p.detail.inert));
  context.compactPanels.matches=false;context.choose(null);
  assert.ok(panels.every(p=>p.detail.inert&&p.button['aria-expanded']==='false'));
  context.choose(panels[2]);
  assert.deepEqual(panels.map(p=>p.detail.inert),[true,true,false,true]);
  context.reduced.matches=true;context.choose(null);
  assert.ok(panels.every(p=>!p.detail.inert&&p.button['aria-expanded']==='true'));
});

test('short landscape view releases sticky scenes and restores motion without losing the media preference',()=>{
  const element=()=>({cleared:0,removeAttribute(){this.cleared++;},classList:{remove(){},add(){}}});
  const animated=Array.from({length:14},element);
  let starts=0,stops=0,desktop=false;
  const context={mode:true,userPaused:false,reduced:{matches:false},shortViewport:{matches:false},
    root:{Lenis:class{constructor(){starts++;}destroy(){stops++;}}},lenis:null,
    doc:{documentElement:{hasAttribute:()=>desktop,classList:{toggle(){}}},querySelectorAll:()=>[]},
    vision:{style:{removeProperty(){}}},slogan:{classList:{remove(){}}},
    sloganLines:[],sloganInner:[],sloganRest:[],from:[],scenes:[],mountains:[],
    setPauseLabel(){},wake(){},layoutPending:false,paintPending:false
  };
  ['heroMedia','keyList','rocket','smoke','sky','rocketWorld','futurePicture','futureImage','futureHeading','futureTop','futureBottom'].forEach((key,index)=>context[key]=animated[index]);
  vm.runInNewContext(source.slice(source.indexOf('  function configure()'),source.indexOf('  function setPauseLabel()'))+';this.configure=configure;',context);
  context.configure();assert.equal(context.mode,true);assert.equal(starts,1);
  context.shortViewport.matches=true;context.configure();
  assert.equal(context.mode,false);assert.equal(stops,1);assert.equal(context.lenis,null);
  assert.ok(animated.slice(0,11).every(node=>node.cleared===1));
  assert.equal(context.userPaused,false,'rotation does not overwrite the user media choice');
  context.shortViewport.matches=false;context.configure();
  assert.equal(context.mode,true);assert.equal(starts,2);
  desktop=true;context.shortViewport.matches=true;context.configure();
  assert.equal(context.mode,true,'explicit desktop composition remains available');
  context.reduced.matches=true;context.configure();
  assert.equal(context.mode,false);assert.equal(context.userPaused,true);
});
