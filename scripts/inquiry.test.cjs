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

test('situation entry maps to the service without overwriting a written draft',()=>{
  const initial={...valid,type:'consultation',situation:'operation',scale:'5층'};
  const next=inquiry.applyEntry(initial,{situation:'vacancy',example:true});
  assert.equal(next.service,'marketing');
  assert.equal(next.situation,'vacancy');
  assert.equal(next.message,initial.message);
  assert.equal(next.name,initial.name);
  assert.equal(next.contact,initial.contact);
  assert.equal(next.scale,'5층');
  assert.equal(initial.service,'management');
});
test('all situation entries lead to the intended service',()=>{
  for(const [situation,service] of Object.entries({operation:'management',arrears:'management',vacancy:'marketing',interior:'interior'})){
    const next=inquiry.applyEntry({...valid,message:''},{situation});
    assert.equal(next.service,service);
    assert.equal(next.message,'');
    assert.equal(next.type,'consultation');
  }
});
test('an illustrative question fills only an empty message',()=>{
  const next=inquiry.applyEntry({...valid,message:'  '},{situation:'interior',example:true});
  assert.match(next.message,/공용부/);
  assert.equal(next.service,'interior');
});
test('quotation supports unknown details and copies supplied property details accurately',()=>{
  const unknown={...valid,type:'quote'};
  assert.deepEqual(inquiry.validate(unknown),{});
  const rows=Object.fromEntries(inquiry.rows(unknown));
  assert.equal(rows['문의 유형'],'견적 문의');
  assert.equal(rows['건물 용도'],'상담 시 확인');
  assert.equal(rows['대략적인 규모'],'상담 시 확인');
  const complete={...unknown,usage:'mixed',scale:'지상 5층, 연면적 약 300평',scope:'시설 점검'};
  const text=inquiry.summarize(complete);
  assert.match(text,/복합용도/);
  assert.match(text,/지상 5층, 연면적 약 300평/);
  assert.match(text,/시설 점검/);
  assert.match(text,/아직 접수되지 않은/);
});
test('switching to consultation omits quote-only details from review without destroying them',()=>{
  const quote={...valid,type:'quote',usage:'office',scale:'5층',scope:'점검'};
  const next=inquiry.applyEntry(quote,{type:'consultation'});
  const rows=Object.fromEntries(inquiry.rows(next));
  assert.equal(next.scale,'5층');
  assert.equal(next.scope,'점검');
  assert.equal(rows['문의 유형'],'상담 문의');
  assert.ok(!('건물 용도' in rows));
  assert.ok(!('대략적인 규모' in rows));
});
test('changing to an undecided service clears stale situation context and retains the message',()=>{
  const next=inquiry.applyEntry({...valid,situation:'arrears'},{service:'undecided'});
  assert.equal(next.situation,'');
  assert.equal(next.message,valid.message);
  assert.ok(!inquiry.rows(next).some(([label])=>label==='선택한 상황'));
});
