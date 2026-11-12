/* ── 집 단면도(방 고르기·타이틀·결과가 함께 쓰는 그림) ── */
const MW=262,MH=131,CELL=[{x:247,y:392},{x:517,y:392},{x:787,y:392},{x:382,y:245},{x:652,y:245}];
function houseLines(c,prog){const p=clamp(prog);c.save();if(p<1){c.beginPath();c.rect(0,0,200+p*900,600);c.clip()}
  bl(c,[[239,384],[1057,384],[1057,531],[239,531],[239,384]],{w:3.5});bl(c,[[374,237],[922,237],[922,384]],{w:3.5});bl(c,[[374,237],[374,384]],{w:3.5});
  bl(c,[[509,384],[509,531]],{w:3});bl(c,[[779,384],[779,531]],{w:3});bl(c,[[644,237],[644,384]],{w:3});
  bl(c,[[340,243],[648,156],[956,243]],{w:3.5});bl(c,[[364,243],[648,170],[932,243]],{w:1.5});for(let i=0;i<7;i++)bl(c,[[410+i*36,226-i*10],[424+i*36,212-i*10]],{w:1.2,a:.5});
  bl(c,[[239,384],[374,330]],{w:2.5});bl(c,[[1057,384],[922,330]],{w:2.5});bl(c,[[780,194],[780,150],[828,150],[828,206]],{w:2.5});bl(c,[[772,150],[836,150],[836,138],[772,138],[772,150]],{w:2});
  bl(c,[[120,531],[1180,531]],{w:2});for(let x=130;x<1180;x+=20)bl(c,[[x,534],[x-8,546]],{a:.4,w:1});hatch(c,239,531,818,14,10,{a:.45});
  const pine=(x,y,s,a)=>{for(let i=0;i<3;i++)bl(c,[[x-s*(1-i*.22),y-i*s*.7],[x,y-s*1.1-i*s*.7],[x+s*(1-i*.22),y-i*s*.7],[x-s*(1-i*.22),y-i*s*.7]],{a,w:1.6});bl(c,[[x,y],[x,y+s*.5]],{a,w:2})};
  pine(150,510,34,.7);pine(96,518,24,.5);pine(1130,508,38,.7);pine(1196,516,26,.5);bl(c,[[40,470],[110,400],[170,440],[230,372]],{a:.3,w:1.5,dash:[7,5]});bl(c,[[1070,440],[1130,380],[1190,420],[1250,360]],{a:.3,w:1.5,dash:[7,5]});
  dim(c,239,566,1057,566,'집 단면도');c.restore()}
function cellDraw(c,r,st,lvl,t){const{x,y}=CELL[r];c.save();c.globalAlpha=st==='lock'?.4:1;c.drawImage(L.rl[r],x,y,MW,MH);c.globalAlpha=1;
  if(lvl>0){const yy=y+MH*(1-lvl);c.beginPath();c.rect(x,yy,MW,y+MH-yy);c.clip();c.drawImage(L.rr[r],x,y,MW,MH)}c.restore();
  if(st==='lock'){c.save();c.translate(x+MW/2,y+MH/2);c.fillStyle='#12346c';c.strokeStyle='#ffd66b';c.lineWidth=3;c.beginPath();rr(c,-17,-6,34,26,5);c.fill();c.stroke();c.beginPath();c.arc(0,-6,11,Math.PI,0);c.stroke();c.restore()}
  if(st==='cur'){c.save();c.strokeStyle='#ffd66b';c.lineWidth=4;c.setLineDash([12,8]);c.lineDashOffset=-t*26;c.strokeRect(x+2,y+2,MW-4,MH-4);c.restore();c.save();c.translate(x+MW/2,y-2+Math.sin(t*4)*3);panel(c,-88,-20,176,40,{fill:'#12346c',col:'#ffd66b'});T(c,ROOMS[r].name+'  '+roomDone(r)+' / 6',0,1,21,'SunB','#ffe9a8','center');c.restore()}
  if(st==='done')badge(c,x+MW-26,y+26,true,1)}
/* ── 타이틀 ── */
const TB={x:806,y:20,w:430,h:150},NEWB={x:60,y:630,w:170,h:60};let newAsk=0;
function drawTitle(c){const t=G.tt,[bx,by]=bgDraw(c,L.paperMap),sv=G.sv;c.save();c.translate(bx*.6,by*.6);houseLines(c,t/2.2);
  if(t>.2&&t<2.3){const px=200+clamp(t/2.2)*900;c.save();c.translate(px,300+Math.sin(t*9)*40);c.rotate(.5);cel(c,k=>rr(k,-6,-110,12,110,4),'#ffcf3f',{s:2,h:1});cel(c,k=>{k.moveTo(-6,0);k.lineTo(6,0);k.lineTo(0,16);k.closePath()},'#f1d2a4',{s:1,h:0,ow:2});c.restore()}
  const a=clamp((t-1.6)/.8);if(a>0){c.save();c.globalAlpha=a;for(let r=0;r<5;r++)cellDraw(c,r,'free',sv?roomItems(r).filter(it=>sv.done[it.no]).length/6:0,G.t);c.restore()}
  // 로고(왼쪽 위, 기울여서): 선 글자 → 귤색이 차오름
  const lp=clamp((t-.3)/1.2);c.save();c.translate(226,74);c.rotate(-.03);c.scale(.84,.84);c.globalAlpha=lp;for(let i=7;i>0;i--)T(c,'따끈 설계소',0,i,92,'SunB','#0a1f4a','left',{st:'#0a1f4a',sw:16});T(c,'따끈 설계소',0,0,92,'SunB','#ffb23c','left',{st:WH,sw:14});T(c,'따끈 설계소',0,0,92,'SunB','#ffb23c');c.save();c.beginPath();c.rect(0,-56,560,60);c.clip();T(c,'따끈 설계소',0,0,92,'SunB','#ffd66b');c.restore();
  T(c,'5학년 2학기 과학 · 열과 우리 생활',6,74,26,'SunB',WH,'left',{st:NAVY,sw:6});c.restore();
  // 표제란: 설계사 이름
  panel(c,TB.x,TB.y,TB.w,TB.h);c.strokeStyle=WH;c.lineWidth=1.5;c.beginPath();c.moveTo(TB.x,TB.y+50);c.lineTo(TB.x+TB.w,TB.y+50);c.moveTo(TB.x+124,TB.y+50);c.lineTo(TB.x+124,TB.y+108);c.moveTo(TB.x,TB.y+108);c.lineTo(TB.x+TB.w,TB.y+108);c.stroke();
  T(c,'도면 표제란',TB.x+16,TB.y+26,22,'SunB','#dbe8ff');T(c,'도면 30장',TB.x+TB.w-16,TB.y+26,20,'Orbit',WH,'right');T(c,'설계사',TB.x+16,TB.y+80,24,'SunB','#ffd66b');
  c.save();c.setLineDash([6,5]);c.strokeStyle='rgba(255,214,107,.8)';c.lineWidth=1.5;c.beginPath();c.moveTo(TB.x+140,TB.y+98);c.lineTo(TB.x+TB.w-16,TB.y+98);c.stroke();c.restore();
  T(c,sv&&sv.name?(sv.name+' 설계사 · '+Object.keys(sv.done).length+' / 30장 그림'):'이름을 쓰고 레버를 당겨요',TB.x+16,TB.y+130,21,'SunB',WH);
  c.restore();
  c.save();c.translate(bx*.9,by*.9);trayBox(c);T(c,'책상의 레버를 당기면 설계를 시작해요!',TRAY.x+TRAY.w/2,TRAY.y+40,26,'SunB','#ffe9a8','center');T(c,sv&&sv.name?'같은 이름이면 이어서, 다른 이름이면 처음부터':'부품을 놓고 불을 켜면 열이 움직이는 모습이 보여요',TRAY.x+TRAY.w/2,TRAY.y+76,20,'SunB','#dbe8ff','center');
  leverBox(c,t>2.3,false,sv&&sv.name?'이어 하기':'설계 시작');mole(c,1056,712,.98,t>2.3?'happy':'idle',G.t,G.pull);
  if(sv&&sv.name){panel(c,NEWB.x,NEWB.y,NEWB.w,NEWB.h,{fill:'#12346c',col:newAsk>0?'#ff9d8a':WH});T(c,newAsk>0?'정말 지울까요?':'새로 시작',NEWB.x+NEWB.w/2,NEWB.y+NEWB.h/2+1,22,'SunB',newAsk>0?'#ffb3a0':WH,'center')}
  c.restore();foreDraw(c,bx,by);fxDraw(c)}
function titleDown(p){if(G.tt<2.3&&!TEST)return;if(G.sv&&G.sv.name&&inR(p,NEWB.x,NEWB.y,NEWB.w,NEWB.h)){if(newAsk>0){try{localStorage.removeItem(KEY)}catch(e){}G.sv=null;newAsk=0;nick.value='';sfx.back()}else{newAsk=3;sfx.tick()}return}
  if(inR(p,SW.x-10,SW.y-10,SW.w+20,SW.h+20))startGame(nick.value)}
function startGame(nm){const name=(nm||'').trim().slice(0,8)||(G.sv&&G.sv.name)||'꼬마',sv=G.sv;G.name=name;if(sv&&sv.name===name){G.done=sv.done||{};G.wrongs=sv.wrongs||[];G.time=sv.time||0}else{G.done={};G.wrongs=[];G.time=0}G.best=(sv&&sv.best)||0;G.pull=1;sfx.lever();nick.blur();nick.style.display='none';save();if(doneCount()>=30)goResult();else{G.scene='select';G.tt=0}}
/* ── 방 고르기 ── */
function drawSelect(c){const t=G.t,[bx,by]=bgDraw(c,L.paperMap),cur=curRoom();c.save();c.translate(bx*.6,by*.6);
  const z=G.zoom>0&&G.toRoom>=0?ease(clamp(G.zoom)):0;if(z>0){const cc=CELL[G.toRoom],s=1+z*1.6,ox=cc.x+MW/2,oy=cc.y+MH/2;c.translate(640+(ox-640)*(1-z)*0-ox*s+ (ox*(1-z)+640*z),360-oy*s+(oy*(1-z)+360*z));c.scale(s,s)}
  houseLines(c,1);for(let i=0;i<4;i++){const p=(t*.2+i/4)%1;c.save();c.globalAlpha=(1-p)*.7;c.strokeStyle=WH;c.lineWidth=2;c.beginPath();c.arc(804+Math.sin(p*9)*10+p*26,128-p*30,5+p*10,0,7);c.stroke();c.restore()}
  for(let r=0;r<5;r++)cellDraw(c,r,roomDone(r)>=6?'done':r===cur?'cur':r<cur?'done':'lock',roomDone(r)/6,t);
  if(cur<5&&z===0)client(c,cur,CELL[cur].x+MW/2,CELL[cur].y+MH-4,.5,'idle',t,Math.abs(Math.sin(t*3))*6);
  c.restore();if(z===0){c.save();c.translate(bx*.6,by*.6);note(c,256,16,530,128,-.012,2);T(c,G.name+' 설계사님께',22,22,20,'SunB','#2f66ad');c.strokeStyle='#2f66ad';c.lineWidth=2;c.beginPath();c.moveTo(18,37);c.lineTo(512,36);c.stroke();
    fitT(c,cur<5?'반짝이는 방을 눌러 도면을 그려 주세요.':'집이 모두 완성되었어요!',22,66,28,'SunB','#14295a',486);fitT(c,cur<5?('이번 의뢰: '+ROOMS[cur].home):'',22,102,28,'SunB','#14295a',486);c.restore();
    titleBlock(c,'도면 '+doneCount()+' / 30','방 '+Math.min(cur+1,5)+' / 5',cur);c.restore()}
  c.save();c.translate(bx*.9,by*.9);trayBox(c);T(c,'방을 하나씩 실물로 바꿔요',TRAY.x+TRAY.w/2,TRAY.y+38,26,'SunB','#ffe9a8','center');for(let r=0;r<5;r++){const xx=TRAY.x+70+r*105;c.fillStyle=roomDone(r)>=6?'#ffb23c':'rgba(234,243,255,.15)';c.fillRect(xx-40,TRAY.y+62,80,26);c.strokeStyle=WH;c.lineWidth=1.5;c.strokeRect(xx-40,TRAY.y+62,80,26);T(c,ROOMS[r].name,xx,TRAY.y+76,20,'SunB',roomDone(r)>=6?'#2b2350':WH,'center')}
  mole(c,1056,712,.98,'idle',t,0);c.restore();foreDraw(c,bx,by);fxDraw(c)}
function selectDown(p){if(G.zoom>0||G.tt<.35)return;const cur=curRoom();if(cur>=5){goResult();return}for(let r=0;r<5;r++){const cc=CELL[r];if(inR(p,cc.x,cc.y,MW,MH)){if(r===cur){G.toRoom=r;G.zoom=.001;sfx.pick()}else sfx.tick();return}}}
/* ── 방 완성 ── */
function drawRoomDone(c){const r=G.room,t=G.t,[bx,by]=bgDraw(c,L.paper);c.save();c.translate(bx*.6,by*.6);c.save();c.beginPath();c.rect(PX0,0,PX1-PX0,598);c.clip();for(const s of snow){c.fillStyle='rgba(234,243,255,.9)';c.beginPath();c.arc(s.x,s.y,s.r,0,7);c.fill()}c.restore();
  c.drawImage(L.rr[r],RX,RY,RW,RH);c.strokeStyle=OL;c.lineWidth=4;c.strokeRect(RX,RY,RW,RH);client(c,r,560,542,1.05,'happy',t,Math.abs(Math.sin(t*7))*16);bigText(c,ROOMS[r].name+' 완성!',640,236,80,G.tt*2);
  note(c,256,16,530,128,-.012,2);T(c,ROOMS[r].who+'의 말',22,22,20,'SunB','#2f66ad');c.strokeStyle='#2f66ad';c.lineWidth=2;c.beginPath();c.moveTo(18,37);c.lineTo(512,36);c.stroke();fitT(c,'고마워요! 덕분에 '+ROOMS[r].name+'이 딱 좋아졌어요.',22,66,28,'SunB','#14295a',486);fitT(c,doneCount()>=30?'이제 집 전체를 보러 가요!':'다음 방도 부탁해요!',22,102,28,'SunB','#14295a',486);c.restore();
  titleBlock(c,'도면 '+doneCount()+' / 30',ROOMS[r].topic,r);c.restore();c.save();c.translate(bx*.9,by*.9);trayBox(c);T(c,G.tt>1?'화면을 누르면 집 단면도로 돌아가요':'',TRAY.x+TRAY.w/2,TRAY.y+54,24,'SunB','#ffe9a8','center');mole(c,1056,712,.98,'happy',t,0);c.restore();foreDraw(c,bx,by);fxDraw(c)}
function leaveRoomDone(){if(doneCount()>=30)goResult();else{G.scene='select';G.tt=0}}
/* ── 결과 ── */
const RBTN=[{x:1076,y:300,w:176,h:76,label:'오답 노트'},{x:1076,y:396,w:176,h:76,label:'처음부터'}];
function fmtTime(s){s=Math.round(s);return Math.floor(s/60)+'분 '+String(s%60).padStart(2,'0')+'초'}
function drawResult(c){const t=G.t,tt=G.tt,[bx,by]=bgDraw(c,L.paperMap),f=firstCount(),grade=f>=27?3:f>=21?2:1;c.save();c.translate(bx*.6,by*.6);houseLines(c,1);
  for(let i=0;i<4;i++){const p=(t*.2+i/4)%1;c.save();c.globalAlpha=(1-p)*.7;c.strokeStyle=WH;c.lineWidth=2;c.beginPath();c.arc(804+Math.sin(p*9)*10+p*26,128-p*30,5+p*10,0,7);c.stroke();c.restore()}
  [0,1,2,3,4].forEach((r,i)=>{const lv=clamp((tt-.3-i*.45)/.6);cellDraw(c,r,lv>=1?'free':'free',ease(lv),t);if(lv>=1){const cc=CELL[r];client(c,r,cc.x+MW/2+(r%2?30:-30),cc.y+MH-4,.46,'happy',t,Math.abs(Math.sin(t*6+r))*8)}});
  if(tt>2.6)bigText(c,'집 완성!',648,180,84,(tt-2.6)*2);
  note(c,870,24,360,150,.015,2);T(c,'완공 도면',22,24,20,'SunB','#2f66ad');c.strokeStyle='#2f66ad';c.lineWidth=2;c.beginPath();c.moveTo(18,39);c.lineTo(342,38);c.stroke();fitT(c,G.name+' 설계사',22,70,30,'SunB','#14295a',316);
  for(let i=0;i<3;i++){const on=i<grade&&tt>3+i*.3,s2=on?back(clamp((tt-3-i*.3)*3)):1;c.save();c.translate(60+i*56,116);c.scale(s2,s2);c.fillStyle=on?'#ffb23c':'rgba(20,41,90,.15)';c.strokeStyle='#14295a';c.lineWidth=2.5;c.beginPath();for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,rr2=k%2?10:23;c.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2)}c.closePath();c.fill();c.stroke();c.restore()}
  T(c,['','새내기 설계사','든든한 설계사','으뜸 설계사'][grade],222,118,24,'SunB','#14295a');c.restore();
  RBTN.forEach((b,i)=>{panel(c,b.x,b.y,b.w,b.h,{fill:'#12346c',col:i?WH:'#ffd66b'});T(c,b.label,b.x+b.w/2,b.y+b.h/2+1,24,'SunB',i?WH:'#ffe9a8','center')});c.restore();
  // 아래 표제란 띠: 기록
  c.save();c.translate(bx*.9,by*.9);trayBox(c);const cols=[['한 번에 그림',f+' / 30'],['다시 고침',(30-f)+'장'],['걸린 시간',fmtTime(G.time)],['최고 기록',Math.max(G.best,f)+' / 30']];cols.forEach(([a,b],i)=>{const x=TRAY.x+18+i*138;if(i){c.strokeStyle='rgba(234,243,255,.4)';c.lineWidth=1.2;c.beginPath();c.moveTo(x-9,TRAY.y+14);c.lineTo(x-9,TRAY.y+92);c.stroke()}T(c,a,x,TRAY.y+34,20,'SunB','#dbe8ff');fitT2(c,b,x,TRAY.y+72,27,'SunB','#ffd66b',122)});
  mole(c,1056,712,.98,'happy',t,0);c.restore();
  foreDraw(c,bx,by);fxDraw(c)}
function resultDown(p){if(G.tt<1)return;if(inR(p,RBTN[0].x,RBTN[0].y,RBTN[0].w,RBTN[0].h)){openNote();sfx.pick()}else if(inR(p,RBTN[1].x,RBTN[1].y,RBTN[1].w,RBTN[1].h)){if(newAsk>0){G.done={};G.wrongs=[];G.time=0;save();newAsk=0;G.scene='select';G.tt=0}else{newAsk=3;RBTN[1].label='정말 다시?';sfx.tick()}}}
/* ── 오답 노트(DOM) ── */
const $=id=>document.getElementById(id),nick=$('nick');
function ansText(it){if(it.kind==='pick')return it.opts[it.ans];if(it.kind==='place')return it.opts[it.ans];return it.ans.join(' / ')}
function esc(s){return String(s).replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}
function openNote(){const W2=G.wrongs.slice().sort((a,b)=>a.no-b.no);$('noteBody').innerHTML=W2.length?W2.map(w=>{const it=ITEMS[w.no-1];return'<div class="row"><div class="q"><b>도면 '+String(w.no).padStart(2,'0')+'</b> '+esc(it.lay==='blank'?it.text.replace(/\{\d\}/g,'(   )'):it.ask.join(' '))+'</div><div class="a"><span class="my">내 답</span> '+esc(w.my)+'</div><div class="a"><span class="ok">정답</span> '+esc(ansText(it))+'</div><div class="e">'+esc(it.exp.join(' '))+'</div></div>'}).join(''):'<div class="row"><div class="q">틀린 도면이 없어요. 모두 한 번에 그렸어요!</div></div>';$('note').classList.add('on')}
$('noteClose').addEventListener('click',()=>$('note').classList.remove('on'));
/* ── 멈춤·소리·세로 안내 ── */
function setPause(v){G.paused=v;$('pauseBox').classList.toggle('on',v)}
$('bPause').addEventListener('click',()=>setPause(true));$('bResume').addEventListener('click',()=>setPause(false));
$('bSound').addEventListener('click',()=>{G.muted=!G.muted;muted=G.muted});
$('bLow').addEventListener('click',()=>{try{localStorage.setItem('ddakkeun_low',LOW?'0':'1')}catch(e){}location.reload()});$('bLow').textContent=LOW?'가벼운 화면 끄기':'가벼운 화면 켜기';
$('bHome').addEventListener('click',()=>{setPause(false);if(G.scene!=='title'){G.scene='select';G.tt=0;G.zoom=0;Q=null}});
let rotOk=false;function checkRot(){const touch=('ontouchstart' in window)||navigator.maxTouchPoints>0;$('rot').classList.toggle('on',touch&&innerHeight>innerWidth&&!rotOk)}
$('rotOk').addEventListener('click',()=>{rotOk=true;checkRot()});window.rotReady=true;checkRot();
/* ── 입력 나누기·한 장·루프 ── */
cv.addEventListener('pointerdown',e=>{e.preventDefault();if(G.paused)return;const p=pos(e);try{cv.setPointerCapture(e.pointerId)}catch(_){}
  if(G.scene==='title')titleDown(p);else if(G.scene==='select')selectDown(p);else if(G.scene==='play')playDown(p);else if(G.scene==='roomdone'){if(G.tt>1)leaveRoomDone()}else if(G.scene==='result')resultDown(p)});
cv.addEventListener('pointermove',e=>{if(G.scene==='play'&&Q)playMove(pos(e))});
const upH=()=>{if(G.scene==='play')playUp()};cv.addEventListener('pointerup',upH);cv.addEventListener('pointercancel',upH);
document.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{if(e.target===nick){if(e.key==='Enter'&&G.scene==='title'&&(G.tt>=2.3||TEST))startGame(nick.value);return}if(e.key==='Escape'){setPause(!G.paused);return}if(e.key==='m'||e.key==='M'){$('bSound').click();return}if(G.paused)return;
  if(G.scene==='title'&&e.key==='Enter'&&G.tt>=2.3)startGame(nick.value);else if(G.scene==='select'&&e.key==='Enter')selectDown({x:CELL[Math.min(curRoom(),4)].x+10,y:CELL[Math.min(curRoom(),4)].y+10});else if(G.scene==='roomdone'&&e.key==='Enter'&&G.tt>1)leaveRoomDone();
  else if(G.scene==='play'&&Q){if(Q.phase==='ok'){if(e.key==='Enter'&&Q.okT>.9)nextItem();return}if(Q.phase!=='ask'||Q.cool>0||Q.pend>0||G.t-Q.born<.35)return;const n=+e.key;
    if(n>=1&&n<=9){if(Q.it.kind==='pick'){if(n<=Q.slots.length)choose(n-1)}else if(Q.it.kind==='place'){if(n<=2)put(0,n-1)}else{if(Q.sel>=0&&n<=Q.slots.length)put(Q.sel,n-1);else if(n<=Q.toks.length)Q.sel=n-1}}
    else if(e.key==='Enter'&&Q.it.kind!=='pick')pullLever()}});
function update(dt){G.t+=dt;G.tt+=dt;if(newAsk>0){newAsk-=dt;if(newAsk<=0)RBTN[1].label='처음부터'}updateFx(dt);
  if(G.scene==='play')updatePlay(dt);else if(G.scene==='select'&&G.zoom>0){G.zoom+=dt/.5;if(G.zoom>=1){G.zoom=0;enterRoom(G.toRoom);G.toRoom=-1}}}
function draw(){const c=g;c.setTransform(DPR,0,0,DPR,0,0);if(G.scene==='title')drawTitle(c);else if(G.scene==='select')drawSelect(c);else if(G.scene==='play'&&Q)drawPlay(c);else if(G.scene==='roomdone')drawRoomDone(c);else drawResult(c);
  nick.style.display=G.scene==='title'?'block':'none'}
let last=0;function frame(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;if(!G.paused)update(dt);draw();requestAnimationFrame(frame)}
(async()=>{for(const f of['SunB','SunB','Pen','Orbit','DoHyeon']){try{await document.fonts.load('30px '+f,'가1°A')}catch(e){}}buildLayers();G.sv=load();if(G.sv&&G.sv.name)nick.value=G.sv.name;if(TEST)G.tt=3;window.READY=true;requestAnimationFrame(frame)})();
/* 자동 점검 창구 (.claude/skills/game-verify) — 게임 진행에는 쓰지 않는다 */
window.__test={version:1,stageSize:[W,H],
  ui:{stage:'#game',name:'#nick',start:{x:SW.x+SW.w/2,y:SW.y+SW.h/2},pause:'#bPause',resume:'#bResume',mute:'#bSound',rotate:'#rot',rotateOk:'#rotOk'},
  isReady(){return!!window.READY&&G.scene==='title'&&(G.tt>=2.3||TEST)},quiet(){G.quiet=true},
  items(){return ITEMS.map(it=>({no:it.no,group:ROOMS[it.room].name,src:it.src?('학습지 '+it.src+'번'):'바꾼 문항',hint:it.hint.join(' '),exp:it.exp.join(' '),steps:[{kind:it.kind==='pick'?'pick':it.kind==='place'?'lever-place':'lever-sort',ask:it.ask.join(' ')+(it.text?' ['+it.text+']':'')+(it.rows?' ['+it.rows.join(' / ')+']':'')+(it.slots?' ['+it.slots.join(' / ')+']':''),opts:it.kind==='sort'?it.tokens:it.opts,ans:it.kind==='sort'?it.ans:it.opts[it.ans]}]}))},
  goto(no){$('note').classList.remove('on');setPause(false);G.zoom=0;G.stars=[];if(!G.name)G.name='봇';openItem(no);draw()},
  state(){const sc={title:'title',select:'select',play:'play',roomdone:'play',result:'result'}[G.scene];return{scene:sc,no:Q&&G.scene==='play'?Q.no:0,step:0,phase:!Q?'ask':Q.phase==='ok'||Q.phase==='reveal'?'ok':Q.phase==='hint'?'hint':'ask',tries:Q?Q.tries:0,cool:Q?(Q.phase==='hint'?Math.max(Q.cool,.01):Q.cool+Q.pend+(Q.phase==='sim'?1:0)):0,paused:G.paused,muted:G.muted}},
  targets(){if(!Q)return[];const out=Q.slots.map(s=>({label:s.label,correct:Q.it.kind==='sort'?true:!!s.correct,x:Math.round(s.cx!==undefined?s.cx:s.x+s.w/2),y:Math.round(s.cy!==undefined?s.cy:s.y+s.h/2)}));if(Q.it.kind!=='pick')out.push({label:'불 켜기',confirm:true,x:SW.x+SW.w/2,y:SW.y+SW.h/2});return out},
  start(nm){G.quiet=true;startGame(nm||'봇')},
  botStep(mode){if(G.scene==='result')return;if(G.scene==='title'){startGame('봇');return}if(G.scene==='roomdone'){leaveRoomDone();return}if(G.scene==='select'){const r=curRoom();if(r>=5)goResult();else enterRoom(r);return}
    if(Q.phase==='ok'||Q.phase==='reveal'){Q.phase='ok';nextItem(true);return}const it=Q.it,miss=Q.tries===0&&(mode==='weak'||(mode==='mixed'&&Q.no%3===0));
    if(it.kind==='pick'){Q.choice=Q.slots.findIndex(s=>miss?!s.correct:s.correct);Q.toks[0].slot=Q.choice}else if(it.kind==='place'){const si=Q.slots.findIndex(s=>miss?!s.correct:s.correct);Q.toks[0].slot=si;Q.slots[si].tok=0}
    else{Q.slots.forEach((s,i)=>{const want=miss?Q.toks.findIndex(k=>k.label!==s.need):Q.toks.findIndex(k=>k.label===s.need);s.tok=want;Q.toks[want].slot=i})}
    judge(evalAns());G.stars=[];if(Q.phase==='hint'){Q.cool=0;Q.toks.forEach(k=>{k.slot=-1});Q.slots.forEach(s=>{s.tok=-1});clearTry()}},
  result(){return{score:doneCount(),firstTry:firstCount(),wrongNote:G.wrongs.length,time:Math.round(G.time),best:G.best}}};
