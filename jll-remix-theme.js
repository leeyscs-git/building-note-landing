/* Apply saved H edits and synchronize open local previews without reloading. */
(() => {
  'use strict';
  const schema = window.SPSThemeSchema;
  const fields = new Map(schema.map(field => [field.token,field]));
  // The introduction shares header styling while keeping its own body design.
  const themeTarget = document.body.dataset.themeScope === 'header'
    ? document.querySelector('[data-sps-header]') : document.documentElement;
  const local = ['localhost','127.0.0.1'].includes(location.hostname);
  const api = local ? location.protocol + '//' + location.hostname + ':3001/__design' : null;
  const cacheKey = 'sps-h-saved-theme-v1';
  let state = {version:1,revision:-1,values:{},updatedAt:null};
  let pending = {};
  let connected = false;
  let saving = false;
  let error = '';
  let timer;
  let resetRequested = false;
  let queuedSave = false;
  let draftSequence = 0;
  const channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel('sps-h-theme-preview') : null;
  const clientId = crypto.randomUUID();
  const remoteDrafts = new Map();
  const remoteSequences = new Map();
  function validPatch(patch) {
    const result = {};
    for (const [token,value] of Object.entries(patch || {})) {
      const field = fields.get(token);
      if (!field) continue;
      if (value === null) {result[token]=null;continue;}
      if (field.type==='color' && typeof value==='string' && /^#[0-9a-f]{6}$/i.test(value)) result[token]=value.toLowerCase();
      if (field.type==='number' && typeof value==='number' && Number.isFinite(value) && value>=field.min && value<=field.max) result[token]=value;
    }
    return result;
  }
  function currentValues() {
    const values = {...state.values};
    for(const patch of remoteDrafts.values()) Object.assign(values,patch);
    if(resetRequested) for(const key of fields.keys()) values[key]=null;
    Object.assign(values,pending);
    return values;
  }
  function apply() {
    const values=currentValues();
    for(const field of schema){
      const value=values[field.token];
      if(value===undefined||value===null) themeTarget.style.removeProperty(field.token);
      else themeTarget.style.setProperty(field.token,field.type==='number'?value+field.unit:value);
    }
    window.dispatchEvent(new CustomEvent('sps-theme-change',{detail:{...state,values,connected,saving,pending:Object.keys(pending).length>0||resetRequested,error}}));
  }
  function accept(next, live = true) {
    if(next.version!==1 || !Number.isSafeInteger(next.revision) || next.revision<state.revision) return;
    state={...next,values:validPatch(next.values)};
    // Only cache confirmed values. Drafts stay in the editor/broadcast channel.
    try { sessionStorage.setItem(cacheKey, JSON.stringify(state)); } catch {}
    if(live){connected=true;error='';}apply();
  }
  async function refresh() {
    if(!api) return;
    try {const res=await fetch(api+'/theme',{cache:'no-store'});if(!res.ok)throw new Error();accept(await res.json());}
    catch {connected=false;error='자동 저장 연결이 끊겼습니다. 입력값을 유지하고 재연결을 기다립니다.';apply();}
  }
  async function save() {
    clearTimeout(timer);
    if(saving){queuedSave=true;return;}
    if(!api){error='자동 저장은 로컬 미리보기에서 사용할 수 있습니다.';apply();return;}
    if(!Object.keys(pending).length&&!resetRequested)return;
    const patch={...pending}, reset=resetRequested, sentSequence=draftSequence;
    pending={};resetRequested=false;saving=true;error='';
    // Keep the optimistic values until persistence acknowledges them.
    remoteDrafts.set(clientId, reset ? Object.fromEntries(schema.map(f=>[f.token,patch[f.token]??null])) : patch);
    apply();
    try {
      const res=await fetch(api+'/theme',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({values:patch,...(reset?{reset:true}:{})})});
      const next=await res.json();
      if(!res.ok)throw new Error(next.error||'저장하지 못했습니다.');
      remoteDrafts.delete(clientId);accept(next);
      channel?.postMessage({type:'saved',sender:clientId,state:next,sequence:sentSequence});
    } catch(e) {
      pending={...patch,...pending};resetRequested=resetRequested||reset;remoteDrafts.delete(clientId);
      connected=false;error=e.message==='Failed to fetch'?'저장 서버에 연결하지 못했습니다. 변경값은 화면에 유지됩니다.':e.message;
    } finally {
      saving=false;apply();
      if(queuedSave){queuedSave=false;timer=setTimeout(save,350);}
    }
  }
  function edit(token,value) {
    const patch=validPatch({[token]:value});
    if(!(token in patch)) return false;
    pending[token]=patch[token];error='';
    channel?.postMessage({type:'draft',sender:clientId,values:patch,sequence:++draftSequence});
    apply();clearTimeout(timer);timer=setTimeout(save,450);return true;
  }
  function reset() {
    pending={};resetRequested=true;error='';
    const values=Object.fromEntries(schema.map(f=>[f.token,null]));
    channel?.postMessage({type:'draft',sender:clientId,values,sequence:++draftSequence});apply();clearTimeout(timer);timer=setTimeout(save,50);
  }
  channel?.addEventListener('message',event=>{
    const message=event.data;
    if(message.sender===clientId)return;
    if(message.type==='draft'){remoteSequences.set(message.sender,message.sequence);remoteDrafts.set(message.sender,{...(remoteDrafts.get(message.sender)||{}),...validPatch(message.values)});apply();}
    if(message.type==='saved'){if((remoteSequences.get(message.sender)||0)<=message.sequence){remoteDrafts.delete(message.sender);remoteSequences.delete(message.sender);}accept(message.state);}
    if(message.type==='discard'){remoteDrafts.delete(message.sender);remoteSequences.delete(message.sender);apply();}
  });
  window.addEventListener('pagehide',()=>{
    channel?.postMessage({type:'discard',sender:clientId});
    // Persist the last edit even if the editor is closed before the debounce ends.
    if(api&&(Object.keys(pending).length||resetRequested))fetch(api+'/theme',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({values:pending,...(resetRequested?{reset:true}:{})}),keepalive:true}).catch(()=>{});
  });
  window.addEventListener('beforeunload',event=>{if(document.body?.classList.contains('ds-page')&&(saving||Object.keys(pending).length||resetRequested)){event.preventDefault();event.returnValue='';}});
  window.addEventListener('focus',refresh);
  window.SPSTheme={
    schema,edit,reset,retry:()=>{refresh().then(save);},
    snapshot:()=>({...state,values:currentValues(),connected,saving,error,pending:Object.keys(pending).length>0||resetRequested}),
    value:token=>currentValues()[token]??fields.get(token)?.value
  };
  // Paint the last confirmed theme synchronously on page-to-page navigation.
  // Keep revision -1 so the file/API remains authoritative, including restores.
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey));
    if(cached?.version===1) state.values=validPatch(cached.values);
  } catch {}
  apply();
  // Saved styling still renders when only a static preview server is running.
  fetch('design/jll-remix/theme.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(next=>accept(next,false)).catch(()=>{});
  if(api){
    refresh();
    const events=new EventSource(api+'/events');
    events.onmessage=event=>{
      try{accept(JSON.parse(event.data));if(!saving&&(Object.keys(pending).length||resetRequested))save();}catch{}
    };
    events.onerror=()=>{connected=false;error='자동 저장 연결이 끊겼습니다. 다시 연결되면 저장을 재시도합니다.';apply();};
  }
})();
