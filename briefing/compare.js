'use strict';
const comparison = document.querySelector('.comparison');
const panels = [...document.querySelectorAll('.version-panel')];
let device = 'desktop';
let state = 's1';
const stateNotes = {
  s1:'첫 화면에서 보고 예시를 찾아 읽어보세요. 각 화면은 안쪽에서 독립적으로 스크롤할 수 있습니다.',
  s2:'같은 R-01 근거를 열었습니다. 닫기 또는 Escape로 돌아간 뒤 F-01도 확인해 보세요. 자료는 바뀌지 않습니다.',
  s3:'같은 비용 FAQ를 펼쳤습니다. 범위와 추가 비용을 읽고, 앱 제공 상태도 확인해 보세요.',
  s4:'같은 상담 절차 안내를 열었습니다. 실접수·예약·저장 없이 닫으면 이전 CTA로 돌아갑니다.'
};
function resizePreviews(){
  const width = device === 'mobile' ? 390 : 1280;
  const height = device === 'mobile' ? 844 : 900;
  panels.forEach(panel => {
    if (panel.hidden) return;
    const container = panel.querySelector('.preview-window');
    const frame = container.querySelector('iframe');
    const scale = Math.min(1,container.clientWidth / width);
    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
    frame.style.transform = `scale(${scale})`;
    frame.style.left = `${Math.max(0,(container.clientWidth-width*scale)/2)}px`;
    container.style.height = `${Math.ceil(height*scale)}px`;
  });
}
function sendState(frame){frame.contentWindow.postMessage({type:'sps-preview-state',state},location.origin);}
document.querySelectorAll('[data-view]').forEach(button => {
  if (button.tagName !== 'BUTTON') return;
  button.addEventListener('click',() => {
    comparison.dataset.view = button.dataset.view;
    panels.forEach(panel => panel.hidden = button.dataset.view !== 'both' && button.dataset.view !== panel.dataset.version);
    document.querySelectorAll('button[data-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    resizePreviews();
  });
});
document.querySelectorAll('[data-device]').forEach(button=>button.addEventListener('click',()=>{
  device = button.dataset.device;
  document.querySelectorAll('[data-device]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  resizePreviews();
  // A resize starts a fresh observation of the selected state in both frames.
  panels.forEach(panel=>sendState(panel.querySelector('iframe')));
}));
document.querySelectorAll('[data-state]').forEach(button=>button.addEventListener('click',()=>{
  state = button.dataset.state;
  document.querySelectorAll('[data-state]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  document.getElementById('state-note').textContent = stateNotes[state];
  panels.forEach(panel=>sendState(panel.querySelector('iframe')));
}));
panels.forEach(panel=>panel.querySelector('iframe').addEventListener('load',()=>sendState(panel.querySelector('iframe'))));
new ResizeObserver(resizePreviews).observe(comparison);
resizePreviews();
