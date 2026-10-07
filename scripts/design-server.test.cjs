const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const {createDesignServer,validateValues}=require('./design-server.cjs');

test('only declared, bounded style values are accepted',()=>{
  assert.deepEqual(validateValues({'--rose-soft':'#AABBCC','--radius-control':12}),{'--rose-soft':'#aabbcc','--radius-control':12});
  for(const bad of [{'--unknown':'x'},{'--rose-soft':'url(https://example.com)'},{'--hero-title-size':999},{'--hero-title-size':'59px'}])assert.throws(()=>validateValues(bad));
});

test('file persistence, concurrent patches, rejection, reset, and static ranges',async t=>{
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'sps-theme-test-'));
  const statePath=path.join(directory,'theme.json');
  await fs.writeFile(path.join(directory,'index.html'),'0123456789');
  const server=createDesignServer({root:directory,statePath});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  t.after(async()=>{
    server.closeAllConnections();
    await new Promise(resolve=>server.close(resolve));
    for(const name of ['index.html','theme.json','theme.json.tmp'])await fs.unlink(path.join(directory,name)).catch(e=>{if(e.code!=='ENOENT')throw e;});
    await fs.rmdir(directory);
  });
  const post=(data,origin='http://127.0.0.1:3000')=>fetch(base+'/__design/theme',{method:'POST',headers:{'Content-Type':'application/json','Origin':origin},body:JSON.stringify(data)});
  const initial=await (await fetch(base+'/__design/theme')).json();
  assert.deepEqual(initial.values,{});
  const results=await Promise.all([post({values:{'--rose-soft':'#ffeedd'}}),post({values:{'--radius-control':12}})]);
  assert(results.every(res=>res.status===200));
  const saved=JSON.parse(await fs.readFile(statePath,'utf8'));
  assert.deepEqual(saved.values,{'--rose-soft':'#ffeedd','--radius-control':12});
  assert.equal(saved.revision,2);
  assert.equal((await post({values:{'--radius-control':99}})).status,400);
  assert.equal((await post({values:{'--radius-control':8}},'https://example.com')).status,403);
  assert.equal(JSON.parse(await fs.readFile(statePath,'utf8')).revision,2);
  const response=await fetch(base+'/',{headers:{Range:'bytes=2-5'}});
  assert.equal(response.status,206);assert.equal(await response.text(),'2345');
  const restored=await (await post({values:{'--radius-control':null}})).json();
  assert.deepEqual(restored.values,{'--rose-soft':'#ffeedd'});
  const reset=await (await post({reset:true})).json();
  assert.deepEqual(reset.values,{});
  assert.equal(reset.revision,4);
});
