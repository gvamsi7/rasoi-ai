const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3100'],{stdio:['ignore','pipe','inherit'],env:{...process.env,OPENAI_API_KEY:'',DATABASE_URL:'',SESSION_SECRET:''}});
let started=false;
const timeout=setTimeout(()=>{server.kill();console.error('Server startup timed out');process.exitCode=1},30000);
server.stdout.on('data',async chunk=>{if(started || !chunk.toString().includes('Ready'))return;started=true;clearTimeout(timeout);
try{const base='http://127.0.0.1:3100';
for(const path of ['/','/favorites','/shopping-list','/cook','/recipes/rajma-rice-bowl','/not-a-recipe','/api/recipes?q=rajma']){const r=await fetch(base+path);assert.equal(r.status,path==='/not-a-recipe'?404:200,path)}
for(const [path,body,status] of [['/api/generate',{ingredients:[1]},400],['/api/generate',{ingredients:[]},400],['/api/generate',{ingredients:['rice']},503],['/api/recipes',{ingredients:['paneer']},200]]){const r=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(r.status,status,path);if(path==='/api/recipes')assert.equal((await r.json()).recipes.length,2);}
const spoof=await fetch(base+'/api/favorites',{headers:{'x-user-email':'someone@example.com'}});assert.equal(spoof.status,401);
const cross=await fetch(base+'/api/generate',{method:'POST',headers:{Origin:'https://untrusted.example','Content-Type':'application/json'},body:JSON.stringify({ingredients:['rice']})});assert.equal(cross.status,403);
console.log('PASS: 7 routes, search results, invalid/empty AI inputs, missing key, forged email and cross-origin rejection.');
}catch(e){console.error(e);process.exitCode=1}finally{server.kill()}});
