/* Layout samples requested for the service archive. These are fictional examples,
   with existing illustrative photos, not published client work or results. */
(function(root,factory){
  const items=factory();
  if(typeof module==='object'&&module.exports)module.exports=items;
  else root.SPSCaseSamples=items;
})(typeof window==='undefined'?null:window,function(){
  return [
    {
      id:'sample-management-office',category:'management',sample:true,
      title:'오피스 A, 흩어진 운영 기록을 하나로.',
      image:'assets/landing/architecture.jpg',alt:'샘플 사례를 위한 도심 업무시설 외관 이미지'
    },
    {
      id:'sample-management-retail',category:'management',sample:true,
      title:'상가 B, 정기 점검부터 월간 보고까지.',
      image:'assets/landing/workplace.jpg',alt:'샘플 사례를 위한 건물 공용 공간 이미지'
    },
    {
      id:'sample-marketing-office',category:'marketing',sample:true,
      title:'오피스 C, 공간의 장점을 담은 임대 안내.',
      image:'assets/landing/interior.jpg',alt:'샘플 사례를 위한 밝은 업무 공간 내부 이미지'
    },
    {
      id:'sample-marketing-retail',category:'marketing',sample:true,
      title:'근린상가 D, 임대 조건과 소개 자료 정리.',
      image:'assets/landing/city.jpg',alt:'샘플 사례를 위한 도심 건물 전경 이미지'
    }
  ];
});
