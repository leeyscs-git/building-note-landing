const {test}=require('node:test');
const assert=require('node:assert/strict');
const {sceneState,futureState,keywordState,heroOffset}=require('../jll-remix-hanwha.js');

test('film covers the transparent header without an initial parallax gap; study offset stays unchanged',()=>{
  for(const headerHeight of [76,137,153]){
    assert.equal(heroOffset(0,0,headerHeight,true),0);
    assert.equal(heroOffset(0,headerHeight-50,headerHeight,true),0);
    assert.equal(heroOffset(0,headerHeight,headerHeight,false),0);
    for(const scroll of [50,250,600]){
      assert.ok(heroOffset(scroll,0,headerHeight,true)-scroll<=0);
      assert.equal(heroOffset(scroll,0,headerHeight,true),heroOffset(scroll,headerHeight,headerHeight,false));
      assert.equal(heroOffset(scroll,headerHeight-50,headerHeight,true),scroll*.5);
    }
  }
});
test('three films enter full size, hold, then leave in order',()=>{
  for(let i=0;i<3;i++){
    const start=1.6+i*2;
    assert.equal(sceneState(start-1,i).visible,false);
    assert.equal(sceneState(start-.5,i).size,83);
    assert.equal(sceneState(start,i).size,100);
    assert.equal(sceneState(start+.5,i).y,0);
    assert.equal(sceneState(start+2,i).visible,false);
    assert.equal(sceneState(start+2,i).size,i<2?66:100);
  }
});
test('scroll boundaries are continuous with no snap in frame size or offset',()=>{
  for(let i=0;i<3;i++){
    for(const t of [1.6+i*2,2.6+i*2]){
      const a=sceneState(t-1e-6,i),b=sceneState(t+1e-6,i);
      assert.ok(Math.abs(a.size-b.size)<.001);
      assert.ok(Math.abs(a.y-b.y)<.001);
      assert.ok(Math.abs(a.innerY-b.innerY)<.001);
    }
  }
});
test('reverse scrolling restores the same scene state; images never overshoot',()=>{
  const sample=[];
  for(let t=-1;t<10;t+=.037){
    const states=[0,1,2].map(i=>sceneState(t,i));
    states.forEach(s=>{
      assert.ok(s.size>=66 && s.size<=100);
      assert.ok(s.radius>=0 && s.radius<=4.25);
      assert.ok(s.text>=0 && s.text<=1);
      assert.ok(Number.isFinite(s.innerY));
    });
    sample.push([t,states]);
  }
  sample.reverse().forEach(([t,s])=>assert.deepEqual([0,1,2].map(i=>sceneState(t,i)),s));
});
test('at least one scene stays visible throughout the moving-picture sequence',()=>{
  for(let t=.61;t<7.59;t+=.02)
    assert.ok([0,1,2].some(i=>sceneState(t,i).visible),'gap at '+t);
});
test('final photo fills the stage before the closing message appears',()=>{
  assert.equal(futureState(0).expand,0);
  assert.equal(futureState(0).bottom,0);
  assert.equal(futureState(1.2).expand,1);
  assert.equal(futureState(1.2).bottom,0);
  assert.equal(futureState(2.4).bottom,1);
});


test('sentence suffixes disappear before their original keywords start travelling',()=>{
  for(let t=-.6;t<=2;t+=.013){
    const state=keywordState(t);
    if(state.restOpacity>0){
      assert.equal(state.moveX,0,'horizontal movement while sentence remains at '+t);
      assert.equal(state.moveY,0,'vertical movement while sentence remains at '+t);
    }
    if(state.moveY>0) assert.equal(state.moveX,1);
    if(state.list){
      assert.equal(state.moveX,1);
      assert.equal(state.moveY,1);
      assert.equal(state.restOpacity,0);
    }
    assert.ok(state.reveal>=0 && state.reveal<=1);
    assert.ok(state.restOpacity>=0 && state.restOpacity<=1);
    if(state.moveX>0 || state.moveY>0) assert.equal(state.travel,true);
  }
});

test('keyword motion is continuous at fade and movement boundaries in both directions',()=>{
  for(const t of [-.4,0,.1,.5,.6,1,1.1,1.6]){
    const before=keywordState(t-1e-6),after=keywordState(t+1e-6);
    for(const key of ['reveal','restOpacity','moveX','moveY','baseWeight']){
      assert.ok(Math.abs(before[key]-after[key])<.00001,key+' snaps at '+t);
    }
  }
  const sample=[-.5,-.1,0,.2,.6,1,1.3,1.6,3].map(t=>[t,keywordState(t)]);
  sample.reverse().forEach(([t,state])=>assert.deepEqual(keywordState(t),state));
  assert.equal(keywordState(0).restOpacity,1);
  assert.equal(keywordState(0).moveX,0);
  assert.equal(keywordState(0).baseWeight,1,'the full slogan keeps its selected palette');
  assert.equal(keywordState(.6).baseWeight,0,'the dark film palette is ready before the first film enters');
});
