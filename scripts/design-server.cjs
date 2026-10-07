// Local preview + narrowly scoped H theme persistence. No arbitrary file writes.
const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const schema = require('../jll-remix-theme-schema.js');
const ROOT = path.resolve(__dirname, '..');
const byToken = new Map(schema.map(field => [field.token, field]));

function validateValues(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('변경값 형식을 확인해 주세요.');
  const result = {};
  for (const [token, value] of Object.entries(input)) {
    const field = byToken.get(token);
    if (!field) throw new Error('지원하지 않는 항목입니다: ' + token);
    if (value === null) { result[token] = null; continue; }
    if (field.type === 'color') {
      if (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value)) throw new Error(field.label + ': 6자리 HEX 색상을 입력해 주세요.');
      result[token] = value.toLowerCase();
    } else {
      if (typeof value !== 'number' || !Number.isFinite(value) || value < field.min || value > field.max) throw new Error(field.label + ': ' + field.min + '–' + field.max + ' 범위로 입력해 주세요.');
      result[token] = Math.round(value * 100) / 100;
    }
  }
  return result;
}

function createDesignServer({root = ROOT, statePath = path.join(ROOT,'design/jll-remix/theme.json'), origins = ['http://127.0.0.1:3000','http://localhost:3000','http://127.0.0.1:3001','http://localhost:3001']} = {}) {
  const clients = new Set();
  let writeQueue = Promise.resolve();
  const base = {version:1,revision:0,updatedAt:null,values:{}};
  async function readState() {
    try {
      const state = JSON.parse(await fsp.readFile(statePath, 'utf8'));
      if (state.version !== 1 || !Number.isSafeInteger(state.revision) || state.revision < 0) throw new Error('저장된 설정의 형식이 올바르지 않습니다.');
      return {...base,...state,values:validateValues(state.values)};
    } catch (error) { if (error.code === 'ENOENT') return {...base,values:{}}; throw error; }
  }
  function json(res, status, body) { res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(body)); }
  async function body(req) {
    let data = '';
    for await (const chunk of req) { data += chunk; if (Buffer.byteLength(data) > 16384) throw new Error('변경 내용이 너무 큽니다.'); }
    return JSON.parse(data);
  }
  function notify(state) {
    const event = 'data: ' + JSON.stringify(state) + '\n\n';
    for (const res of clients) res.write(event);
  }
  const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.mp4':'video/mp4','.webm':'video/webm','.woff2':'font/woff2','.woff':'font/woff','.pdf':'application/pdf'};
  async function staticFile(req,res,pathname) {
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405);res.end();return;}
    const decoded = decodeURIComponent(pathname);
    if (decoded.includes('\0') || decoded.includes('\\') || decoded.split('/').some(part => part.startsWith('.')) || decoded.startsWith('/node_modules/')) {res.writeHead(403);res.end();return;}
    const target = path.resolve(root, '.' + (decoded === '/' ? '/index.html' : decoded));
    if (!target.startsWith(root + path.sep)) {res.writeHead(403);res.end();return;}
    let stat;
    try {stat = await fsp.stat(target);} catch {res.writeHead(404);res.end('Not found');return;}
    if (!stat.isFile()) {res.writeHead(404);res.end('Not found');return;}
    const real = await fsp.realpath(target);
    if (!real.startsWith(root + path.sep)) {res.writeHead(403);res.end();return;}
    const headers = {'Content-Type':mime[path.extname(target).toLowerCase()]||'application/octet-stream','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
    let start=0,end=stat.size-1,status=200;
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1] && !match[2])) {res.writeHead(416,{'Content-Range':'bytes */'+stat.size});res.end();return;}
      if (!match[1]) start=Math.max(0,stat.size-Number(match[2]));
      else {start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}
      if (start>end || start>=stat.size) {res.writeHead(416,{'Content-Range':'bytes */'+stat.size});res.end();return;}
      status=206;headers['Content-Range']='bytes '+start+'-'+end+'/'+stat.size;
    }
    headers['Content-Length']=Math.max(0,end-start+1);
    res.writeHead(status,headers);
    if(req.method==='HEAD'||!stat.size){res.end();return;}
    const stream=fs.createReadStream(target,{start,end});stream.on('error',()=>res.destroy());stream.pipe(res);
  }
  const server = http.createServer(async (req,res) => {
    try {
      const url = new URL(req.url,'http://127.0.0.1');
      if (!url.pathname.startsWith('/__design/')) {await staticFile(req,res,url.pathname);return;}
      const origin=req.headers.origin;
      if (origin && !origins.includes(origin)) {json(res,403,{error:'허용되지 않은 출처입니다.'});return;}
      if (origin) {res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');}
      if (req.method==='OPTIONS') {res.writeHead(204,{'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'});res.end();return;}
      if(url.pathname==='/__design/events'&&req.method==='GET'){
        const state=await readState();
        res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});
        res.write('data: '+JSON.stringify(state)+'\n\n');clients.add(res);
        const heartbeat=setInterval(()=>res.write(': keepalive\n\n'),20000);
        req.on('close',()=>{clearInterval(heartbeat);clients.delete(res);});return;
      }
      if(url.pathname!=='/__design/theme'){json(res,404,{error:'Not found'});return;}
      if(req.method==='GET'){json(res,200,await readState());return;}
      if(req.method!=='POST'){json(res,405,{error:'Method not allowed'});return;}
      if(!req.headers['content-type']?.startsWith('application/json')){json(res,415,{error:'JSON 형식만 저장할 수 있습니다.'});return;}
      let input,patch;
      try {
        input=await body(req);
        if (!input || typeof input!=='object' || Array.isArray(input) || Object.keys(input).some(k=>!['values','reset'].includes(k)) || (input.reset!==undefined&&input.reset!==true)) throw new Error('변경 요청 형식이 올바르지 않습니다.');
        patch=validateValues(input.values||{});
      } catch(error){json(res,400,{error:error.message});return;}
      const save=writeQueue.then(async()=>{
        const state=await readState();
        const values=input.reset?{}:{...state.values};
        for(const [key,value] of Object.entries(patch)){
          if(value===null || value===byToken.get(key).value) delete values[key];else values[key]=value;
        }
        const next={version:1,revision:state.revision+1,updatedAt:new Date().toISOString(),values};
        await fsp.mkdir(path.dirname(statePath),{recursive:true});
        const temp=statePath+'.tmp';
        await fsp.writeFile(temp,JSON.stringify(next,null,2)+'\n','utf8');
        await fsp.rename(temp,statePath);
        notify(next);return next;
      });
      writeQueue=save.catch(()=>{});
      json(res,200,await save);
    } catch(error){if(!res.headersSent)json(res,500,{error:'설정을 읽거나 저장하지 못했습니다. 파일과 서버 상태를 확인해 주세요.'});else res.end();console.error(error.message);}
  });
  server.on('close',()=>{for(const res of clients)res.end();clients.clear();});
  return server;
}
if(require.main===module){
  const api=createDesignServer();
  api.on('error',error=>{console.error('디자인 편집 서버:',error.message);process.exitCode=1;});
  api.listen(3001,'127.0.0.1',()=>{
    console.log('H 디자인 자동 저장: http://127.0.0.1:3001');
    const preview=createDesignServer();
    preview.on('error',error=>{if(error.code==='EADDRINUSE')console.log('기존 3000 미리보기를 유지합니다.');else console.error(error.message);});
    preview.listen(3000,'127.0.0.1',()=>console.log('미리보기: http://127.0.0.1:3000'));
  });
}
module.exports={createDesignServer,validateValues};
