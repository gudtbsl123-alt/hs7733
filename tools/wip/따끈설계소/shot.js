const {chromium}=require('playwright');const D=__dirname;(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CON',m.text())});
await p.goto('file://'+D+'/index.html'+(process.argv[2]||''));await p.waitForFunction('window.READY===true');const w=ms=>p.waitForTimeout(ms),s=n=>p.screenshot({path:D+'/'+n+'.png'});
await w(700);await s('k1_idle0');await w(500);await s('k1_idle1');await w(500);await s('k1_idle2');
await p.mouse.move(330,660);await p.mouse.down();await p.mouse.move(360,560,{steps:6});await p.mouse.move(380,300,{steps:8});await w(150);await s('k2_drag');await p.mouse.move(354,238,{steps:4});await p.mouse.up();await w(500);await s('k3_placedA');
await p.mouse.click(910,660);await w(2600);await s('k4_simA');await w(1700);await s('k5_hint');await w(3200);
await p.mouse.move(330,660);await p.mouse.down();await p.mouse.move(350,520,{steps:8});await p.mouse.up();await w(400);await p.mouse.click(910,660);await w(2400);await s('k6_simB');await p.waitForFunction("G.phase==='reveal'&&G.reveal>.45");await s('k7_reveal');await w(2600);await s('k8_ok');
console.log(await p.evaluate('JSON.stringify({ph:G.phase,pl:G.placed,tr:G.tries})'));await b.close()})();
