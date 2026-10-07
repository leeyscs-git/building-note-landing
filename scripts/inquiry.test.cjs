const test = require('node:test');
const assert = require('node:assert/strict');
const inquiry = require('../jll-remix-contact.js');
const valid = {name:'테스트 담당자',method:'phone',contact:'02 2247 5799',service:'management',location:'',message:'관리 범위를 상담하고 싶습니다.'};
test('inquiry accepts a spaced phone number and optional unknown building location',()=>{
  assert.deepEqual(inquiry.validate(valid),{});
  assert.equal(inquiry.rows(valid).find(([key])=>key==='건물 위치')[1],'상담 시 확인');
});
test('blank required values and malformed contact details cannot reach review',()=>{
  assert.deepEqual(Object.keys(inquiry.validate({...valid,name:'  ',contact:'abc',message:' \n '})),['name','contact','message']);
  assert.ok(inquiry.validate({...valid,method:'email',contact:'name@example'}).contact);
  assert.deepEqual(inquiry.validate({...valid,method:'email',contact:'name@example.com'}),{});
});
test('copied inquiry is explicitly an unsubmitted draft and contains the chosen topic',()=>{
  const text=inquiry.summarize({...valid,service:'documents'});
  assert.match(text,/아직 접수되지 않은/);
  assert.match(text,/등록·면허 자료 문의/);
  assert.match(text,/주식회사 신의프라퍼티솔루션/);
});
