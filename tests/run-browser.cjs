const {spawn}=require('node:child_process');
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3101'],{stdio:['ignore','pipe','inherit'],env:{...process.env,OPENAI_API_KEY:'',DATABASE_URL:'',SESSION_SECRET:''}});
let started=false;
const timeout=setTimeout(()=>{server.kill();process.exitCode=1;console.error('Server startup timed out')},30000);
server.stdout.on('data',chunk=>{if(started || !chunk.toString().includes('Ready'))return;started=true;clearTimeout(timeout);const test=spawn(process.execPath,['tests/smoke.cjs'],{stdio:'inherit',env:{...process.env,TEST_BASE_URL:'http://127.0.0.1:3101'}});test.on('exit',code=>{process.exitCode=code||0;server.kill()});});
