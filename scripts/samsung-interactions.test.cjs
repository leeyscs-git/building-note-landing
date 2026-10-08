const {test}=require('node:test');
const assert=require('node:assert/strict');
const {nextHeaderState,activeTabOffset}=require('../jll-remix-samsung.js');
const initial={anchor:0,direction:1,hidden:false};

test('header stays visible near the top, hides on downward travel, and returns on upward travel',()=>{
  let s=nextHeaderState(initial,{y:500,height:900});
  assert.equal(s.hidden,false);
  s=nextHeaderState(s,{y:680,height:900});
  assert.equal(s.hidden,true);
  s=nextHeaderState(s,{y:660,height:900});
  assert.equal(s.hidden,false);
});
test('small scroll steps accumulate so slow reverse scrolling also reveals the header',()=>{
  let s=nextHeaderState(initial,{y:900,height:900});
  for (const y of [897,894,891,888]) s=nextHeaderState(s,{y,height:900});
  assert.equal(s.direction,-1);
  assert.equal(s.hidden,false);
});
test('an open menu, dialog, focused header or motion preference keeps navigation visible',()=>{
  const s=nextHeaderState(initial,{y:1000,height:800});
  assert.equal(s.hidden,true);
  assert.equal(nextHeaderState(s,{y:1100,height:800,blocked:true}).hidden,false);
  assert.equal(nextHeaderState(s,{y:1100,height:800,reduced:true}).hidden,false);
  assert.equal(nextHeaderState(s,{y:-20,height:800}).hidden,false);
});
test('horizontal tabs reveal the selected item without scrolling beyond the list',()=>{
  assert.equal(activeTabOffset({left:0,width:40,viewport:350,scroll:0,max:90}),0);
  assert.equal(activeTabOffset({left:380,width:70,viewport:350,scroll:0,max:100}),100);
  assert.equal(activeTabOffset({left:20,width:70,viewport:350,scroll:100,max:100}),0);
});
