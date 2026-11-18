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
function cellDraw(c,r,st,lvl,t,bs){const{x,y}=CELL[r];c.save();c.globalAlpha=st==='lock'?.4:1;
  if(lvl>=1||lvl<=0||lvl*6===Math.round(lvl*6))drawRoomAt(c,r,x,y,MW,MH,Math.round(lvl*6),0);else{c.drawImage(L.rl[r],x,y,MW,MH);const yy=y+MH*(1-lvl);c.beginPath();c.rect(x,yy,MW,y+MH-yy);c.clip();c.drawImage(L.rr[r],x,y,MW,MH)}c.restore();
  if(st==='lock'){const sh=G.lockSh&&G.lockSh.r===r&&G.lockSh.t<.25?Math.sin(G.lockSh.t*70)*5:0;c.save();c.translate(x+MW/2+sh,y+MH/2);c.fillStyle='#12346c';c.strokeStyle='#ffd66b';c.lineWidth=3;c.beginPath();rr(c,-17,-6,34,26,5);c.fill();c.stroke();c.beginPath();c.arc(0,-6,11,Math.PI,0);c.stroke();c.restore()}
  if(st==='cur'){c.save();c.strokeStyle='#ffd66b';c.lineWidth=4;c.setLineDash([12,8]);c.lineDashOffset=-t*26;c.strokeRect(x+2,y+2,MW-4,MH-4);c.restore();c.save();c.translate(x+MW/2,y-2+Math.sin(t*4)*3);panel(c,-88,-20,176,40,{fill:'#12346c',col:'#ffd66b'});T(c,ROOMS[r].name+'  '+roomDone(r)+' / 6',0,1,21,'SunB','#ffe9a8','center');c.restore()}
  if(st==='done')badge(c,x+MW-26,y+26,true,bs===undefined?1:bs)}
/* ── 범례(열이 이동하는 방식) ── */
function legend(c,x,y){panel(c,x,y,282,214);T(c,'범례',x+16,y+22,22,'SunB','#ffd66b');c.strokeStyle=WH;c.lineWidth=1.2;c.beginPath();c.moveTo(x+10,y+40);c.lineTo(x+272,y+40);c.stroke();
  const rows=['전도','대류','복사','단열'];rows.forEach((s,i)=>{const yy=y+68+i*40,ix=x+28;T(c,s,x+130,yy+1,22,'SunB',WH);
    if(i===0){c.fillStyle=CU;c.fillRect(ix-12,yy-6,80,12);arrowHead(c,ix+76,yy,0,8,'#ffd66b');bl(c,[[ix-6,yy],[ix+64,yy]],{w:2,col:'#ffd66b',over:0})}
    if(i===1){c.save();c.strokeStyle='#ff8a5a';c.lineWidth=3;c.beginPath();c.ellipse(ix+30,yy,34,12,0,Math.PI,Math.PI*2);c.stroke();c.strokeStyle='#7fc4ff';c.beginPath();c.ellipse(ix+30,yy,34,12,0,0,Math.PI);c.stroke();arrowHead(c,ix+64,yy+2,Math.PI/2,7,'#ff8a5a');arrowHead(c,ix-4,yy-2,-Math.PI/2,7,'#7fc4ff');c.restore()}
    if(i===2){c.save();c.strokeStyle='#ffe27a';c.lineWidth=2.5;c.beginPath();for(let q=0;q<=20;q++)c.lineTo(ix-8+q*3.6,yy+Math.sin(q*1.3)*5);c.stroke();arrowHead(c,ix+66,yy,0,7,'#ffe27a');c.restore()}
    if(i===3){bl(c,[[ix-10,yy-12],[ix+70,yy-12],[ix+70,yy+12],[ix-10,yy+12],[ix-10,yy-12]],{w:1.5,over:0});zig(c,ix-8,yy-10,76,20,false)}})}
function houseReal(c,a,t){if(a<=0)return;c.save();c.globalAlpha=a;
  cel(c,k=>{k.moveTo(330,246);k.lineTo(648,152);k.lineTo(966,246);k.closePath()},'#c8584a',{s:8,h:5});c.save();c.beginPath();c.moveTo(330,246);c.lineTo(648,152);c.lineTo(966,246);c.closePath();c.clip();c.strokeStyle='rgba(120,30,40,.45)';c.lineWidth=2;for(let yy=170;yy<246;yy+=13){c.beginPath();c.moveTo(300,yy);c.lineTo(1000,yy);c.stroke()}c.fillStyle='rgba(255,220,180,.25)';c.beginPath();c.moveTo(648,152);c.lineTo(330,246);c.lineTo(420,246);c.closePath();c.fill();c.fillStyle='rgba(70,30,90,.3)';c.fillRect(300,236,700,10);c.restore();[[239,384,374,330,374,384],[1057,384,922,330,922,384]].forEach(([a,b,d,e,f,h2])=>cel(c,k=>{k.moveTo(a-12,b);k.lineTo(d,e);k.lineTo(f,h2);k.closePath()},'#b54d42',{s:5,h:3}));c.fillStyle='#f4f8ff';c.beginPath();c.moveTo(372,232);c.lineTo(648,154);c.lineTo(924,232);c.lineTo(900,236);c.lineTo(648,166);c.lineTo(396,236);c.closePath();c.fill();
  cel(c,k=>rr(k,772,138,64,70,3),'#b8584a',{s:4,h:3});cel(c,k=>rr(k,764,128,80,14,3),'#8a3f3a',{s:2,h:1});
  for(let i=0;i<4;i++){const p=(t*.25+i/4)%1;c.save();c.globalAlpha=a*(1-p)*.8;c.fillStyle='#ffffff';c.beginPath();c.arc(804+Math.sin(p*7)*12+p*30,120-p*80,8+p*16,0,7);c.fill();c.restore()}
  c.strokeStyle='#8a5a3c';c.lineWidth=9;c.lineJoin='round';c.strokeRect(239,384,818,147);c.strokeRect(374,237,548,147);
  [[150,510,34],[96,518,24],[1130,508,38],[1196,516,26]].forEach(([x,y,s])=>{cel(c,k=>rr(k,x-4,y-6,8,s*.6,2),'#6a4630',{s:1,h:0,ow:2});for(let i=0;i<3;i++)cel(c,k=>{k.moveTo(x-s*(1-i*.22),y-i*s*.7);k.lineTo(x,y-s*1.1-i*s*.7);k.lineTo(x+s*(1-i*.22),y-i*s*.7);k.closePath()},'#3f8a5a',{s:3,h:2});c.fillStyle='#f4f8ff';c.beginPath();c.moveTo(x-s*.25,y-s*2.25);c.lineTo(x,y-s*2.5);c.lineTo(x+s*.25,y-s*2.25);c.fill()});
  c.fillStyle='#eef4ff';c.beginPath();c.moveTo(120,534);c.quadraticCurveTo(640,524,1180,534);c.lineTo(1180,552);c.lineTo(120,552);c.closePath();c.fill();c.restore()}
/* ── 타이틀 ── */
const TB={x:690,y:20,w:430,h:150},NEWB={x:60,y:630,w:170,h:60};let newAsk=0;
function drawTitle(c){const t=G.tt,[bx,by]=bgDraw(c,L.paperMap),sv=G.sv;c.save();c.translate(bx*.6,by*.6);houseLines(c,t/2.2);
  if(t>.2&&t<2.3){const px=200+clamp(t/2.2)*900;c.save();c.translate(px,300+Math.sin(t*9)*40);c.rotate(.5);cel(c,k=>rr(k,-6,-110,12,110,4),'#ffcf3f',{s:2,h:1});cel(c,k=>{k.moveTo(-6,0);k.lineTo(6,0);k.lineTo(0,16);k.closePath()},'#f1d2a4',{s:1,h:0,ow:2});c.restore()}
  const a=clamp((t-1.6)/.8);if(a>0){c.save();c.globalAlpha=a;for(let r=0;r<5;r++){const own=sv?roomItems(r).filter(it=>sv.done[it.no]).length/6:0;cellDraw(c,r,'free',r===3?Math.max(own,clamp((t-2.4)/1)):own,G.t)}c.restore()}
  if(t>2.4&&t<3.5){const cc=CELL[3],p=clamp((t-2.4)/1),yy=cc.y+MH*(1-p);if(p<1){c.fillStyle='#fff';c.fillRect(cc.x,yy-1.5,MW,3)}}
  if(t>2.2){c.save();c.globalAlpha=clamp((t-2.2)/.4);c.globalCompositeOperation='screen';const gl=c.createRadialGradient(150,60,20,320,260,700);gl.addColorStop(0,'rgba(255,214,140,.32)');gl.addColorStop(1,'rgba(255,214,140,0)');c.fillStyle=gl;c.fillRect(0,0,W,600);c.restore()}
  legend(c,968,192);
  // 로고(왼쪽 위, 기울여서): 선 글자 → 귤색이 차오름
  const lp=clamp((t-.3)/1.2);c.save();c.translate(226,74);c.rotate(-.03);c.scale(.84,.84);c.globalAlpha=lp;for(let i=7;i>0;i--)T(c,'따끈 설계소',0,i,92,'SunB','#0a1f4a','left',{st:'#0a1f4a',sw:16});T(c,'따끈 설계소',0,0,92,'SunB','#ffb23c','left',{st:WH,sw:14});T(c,'따끈 설계소',0,0,92,'SunB','#ffb23c');c.save();c.beginPath();c.rect(0,-56,560,60);c.clip();T(c,'따끈 설계소',0,0,92,'SunB','#ffd66b');c.restore();
  T(c,'5학년 2학기 과학 · 열과 우리 생활',6,74,26,'SunB',WH,'left',{st:NAVY,sw:6});c.restore();
  // 표제란: 설계사 이름
  panel(c,TB.x,TB.y,TB.w,TB.h);c.strokeStyle=WH;c.lineWidth=1.5;c.beginPath();c.moveTo(TB.x,TB.y+50);c.lineTo(TB.x+TB.w,TB.y+50);c.moveTo(TB.x+124,TB.y+50);c.lineTo(TB.x+124,TB.y+108);c.moveTo(TB.x,TB.y+108);c.lineTo(TB.x+TB.w,TB.y+108);c.stroke();
  T(c,'도면 표제란',TB.x+16,TB.y+26,22,'SunB','#dbe8ff');T(c,'도면 30장',TB.x+TB.w-16,TB.y+26,20,'Orbit',WH,'right');T(c,'설계사',TB.x+16,TB.y+80,24,'SunB','#ffd66b');
  c.save();c.setLineDash([6,5]);c.strokeStyle='rgba(255,214,107,.8)';c.lineWidth=1.5;c.beginPath();c.moveTo(TB.x+140,TB.y+98);c.lineTo(TB.x+TB.w-16,TB.y+98);c.stroke();c.restore();
  T(c,sv&&sv.name?(sv.name+' 설계사 · '+Object.keys(sv.done).length+' / 30장 그림'):'이름을 쓰고 레버를 당겨요',TB.x+16,TB.y+130,21,'SunB',WH);
  c.restore();soundPause(c);
  c.save();c.translate(bx*.9,by*.9);trayBox(c);T(c,'책상의 레버를 당기면 설계를 시작해요!',TRAY.x+TRAY.w/2,TRAY.y+40,26,'SunB','#ffe9a8','center');T(c,sv&&sv.name?'같은 이름이면 이어서, 다른 이름이면 처음부터':'부품을 놓고 불을 켜면 열이 움직이는 모습이 보여요',TRAY.x+TRAY.w/2,TRAY.y+76,20,'SunB','#dbe8ff','center');
  leverBox(c,t>2.3,false,sv&&sv.name?'이어 하기':'설계 시작');mole(c,1056,712,.98,t>2.3?'happy':'idle',G.t,G.pull);
  if(sv&&sv.name){panel(c,NEWB.x,NEWB.y,NEWB.w,NEWB.h,{fill:'#12346c',col:newAsk>0?'#ff9d8a':WH});T(c,newAsk>0?'정말 지울까요?':'새로 시작',NEWB.x+NEWB.w/2,NEWB.y+NEWB.h/2+1,22,'SunB',newAsk>0?'#ffb3a0':WH,'center')}
  c.restore();foreDraw(c,bx,by);fxDraw(c)}
function titleDown(p){if(G.tt<2.3&&!TEST)return;if(G.sv&&G.sv.name&&inR(p,NEWB.x,NEWB.y,NEWB.w,NEWB.h)){if(newAsk>0){try{localStorage.removeItem(KEY)}catch(e){}G.sv=null;newAsk=0;nick.value='';sfx.back()}else{newAsk=3;sfx.tick()}return}
  if(inR(p,SW.x-10,SW.y-10,SW.w+20,SW.h+20))startGame(nick.value)}
function startGame(nm){const name=(nm||'').trim().slice(0,8)||(G.sv&&G.sv.name)||'꼬마',sv=G.sv;G.name=name;if(sv&&sv.name===name){G.done=sv.done||{};G.wrongs=sv.wrongs||[];G.time=sv.time||0}else{G.done={};G.wrongs=[];G.time=0}G.best=(sv&&sv.best)||0;G.pull=1;sfx.lever();nick.blur();nick.style.display='none';save();if(doneCount()>=30)goResult();else{G.scene='select';G.tt=0}}
/* ── 방 고르기 ── */
function drawSelect(c){const t=G.t,[bx,by]=bgDraw(c,L.paperMap),cur=curRoom();c.save();c.translate(bx*.6,by*.6);
  const z=G.zoom>0&&G.toRoom>=0?ease(clamp(G.zoom)):0;if(z>0){const cc=CELL[G.toRoom],s=1+z*1.6,ox=cc.x+MW/2,oy=cc.y+MH/2;c.translate(ox*(1-z)+640*z-ox*s,oy*(1-z)+360*z-oy*s);c.scale(s,s)}
  houseLines(c,1);for(let i=0;i<4;i++){const p=(t*.2+i/4)%1;c.save();c.globalAlpha=(1-p)*.7;c.strokeStyle=WH;c.lineWidth=2;c.beginPath();c.arc(804+Math.sin(p*9)*10+p*26,128-p*30,5+p*10,0,7);c.stroke();c.restore()}
  const U=G.unl;for(let r=0;r<5;r++){let st=roomDone(r)>=6?'done':r===cur?'cur':r<cur?'done':'lock',bs=1;if(U&&r===U.r)bs=clamp(U.t*5);if(U&&r===cur&&U.t<.5){st='lock';c.save();const cc=CELL[r];c.translate(cc.x+MW/2,cc.y+MH/2);c.rotate(U.t>.2?Math.sin(U.t*60)*.03:0);c.translate(-cc.x-MW/2,-cc.y-MH/2);cellDraw(c,r,st,0,t);c.restore();continue}cellDraw(c,r,st,roomDone(r)/6,t,bs);if(r===cur&&z===0)client(c,cur,CELL[cur].x+MW*.3,CELL[cur].y+MH-4,.46,'idle',t,Math.abs(Math.sin(t*3))*6)}
  c.restore();if(z===0){c.save();c.translate(bx*.6,by*.6);note(c,256,16,530,128,-.012,2);T(c,G.name+' 설계사님께',22,22,20,'SunB','#2f66ad');c.strokeStyle='#2f66ad';c.lineWidth=2;c.beginPath();c.moveTo(18,37);c.lineTo(512,36);c.stroke();
    fitT(c,cur<5?'반짝이는 방을 눌러 도면을 그려 주세요.':'집이 모두 완성되었어요!',22,66,28,'SunB','#14295a',486);fitT(c,cur<5?('이번 의뢰: '+ROOMS[cur].home):'',22,102,28,'SunB','#14295a',486);c.restore();
    titleBlock(c,'도면 '+doneCount()+' / 30','방 '+Math.min(cur+1,5)+' / 5',cur);c.restore()}
  c.save();c.translate(bx*.9,by*.9);trayBox(c);T(c,'방을 하나씩 실물로 바꿔요',TRAY.x+TRAY.w/2,TRAY.y+38,26,'SunB','#ffe9a8','center');for(let r=0;r<5;r++){const xx=TRAY.x+70+r*105;c.fillStyle=roomDone(r)>=6?'#9a6a1c':'#0a2250';c.fillRect(xx-40,TRAY.y+66,80,26);c.fillStyle=roomDone(r)>=6?'#ffb23c':'#1a4690';c.fillRect(xx-40,TRAY.y+62,80,26);c.strokeStyle=WH;c.lineWidth=1.5;c.strokeRect(xx-40,TRAY.y+62,80,26);T(c,ROOMS[r].name,xx,TRAY.y+76,20,'SunB',roomDone(r)>=6?'#2b2350':WH,'center')}
  btn(c,SW,'도면첩',true,0,0,'book');mole(c,1056,712,.98,'idle',t,0);c.restore();foreDraw(c,bx,by);fxDraw(c)}
function selectDown(p){if(G.unl){G.unl.t=.8;return}if(G.zoom>0||G.tt<.35)return;if(inR(p,SW.x,SW.y,SW.w,SW.h)){openAlbum();return}const cur=curRoom();if(cur>=5){goResult();return}for(let r=0;r<5;r++){const cc=CELL[r];if(inR(p,cc.x,cc.y,MW,MH)){if(r===cur){G.toRoom=r;G.zoom=.001;sfx.pick()}else{sfx.tick();G.lockSh={r,t:0}}return}}}
/* ── 방 완성 ── */
function drawRoomDone(c){const r=G.room,t=G.t,[bx,by]=bgDraw(c,L.paper);c.save();c.translate(bx*.6,by*.6);c.save();c.beginPath();c.rect(PX0,0,PX1-PX0,598);c.clip();for(const s of snow){c.fillStyle='rgba(234,243,255,.9)';c.beginPath();c.arc(s.x,s.y,s.r,0,7);c.fill()}c.restore();
  c.drawImage(L.rr[r],RX,RY,RW,RH);c.strokeStyle=OL;c.lineWidth=4;c.strokeRect(RX,RY,RW,RH);client(c,r,560,542,1.05,'happy',t,Math.abs(Math.sin(t*7))*16);bigText(c,ROOMS[r].name+' 완성!',640,190,76,G.tt*2);
  note(c,256,16,530,128,-.012,2);T(c,ROOMS[r].who+'의 말',22,22,20,'SunB','#2f66ad');c.strokeStyle='#2f66ad';c.lineWidth=2;c.beginPath();c.moveTo(18,37);c.lineTo(512,36);c.stroke();fitT(c,'고마워요! 덕분에 '+ROOMS[r].name+'이 딱 좋아졌어요.',22,66,28,'SunB','#14295a',486);fitT(c,doneCount()>=30?'이제 집 전체를 보러 가요!':'다음 방도 부탁해요!',22,102,28,'SunB','#14295a',486);c.restore();
  titleBlock(c,'도면 '+doneCount()+' / 30',ROOMS[r].topic,r);c.restore();c.save();c.translate(bx*.9,by*.9);trayBox(c);T(c,G.tt>.3?'화면을 누르면 집 단면도로 돌아가요':'',TRAY.x+TRAY.w/2,TRAY.y+54,24,'SunB','#ffe9a8','center');mole(c,1056,712,.98,'happy',t,0);c.restore();foreDraw(c,bx,by);fxDraw(c)}
function leaveRoomDone(){if(doneCount()>=30)goResult();else{G.unl={r:G.room,t:0,snd:false};G.scene='select';G.tt=0}}
/* ── 결과 ── */
const RBTN=[{x:1076,y:284,w:176,h:70,label:'오답 노트'},{x:1076,y:366,w:176,h:70,label:'도면첩'},{x:1076,y:448,w:176,h:70,label:'처음부터'}];
function fmtTime(s){s=Math.round(s);return Math.floor(s/60)+'분 '+String(s%60).padStart(2,'0')+'초'}
function drawResult(c){const t=G.t,tt=G.tt,[bx,by]=bgDraw(c,L.paperMap),f=firstCount(),grade=f>=27?3:f>=21?2:1;c.save();c.translate(bx*.6,by*.6);houseLines(c,1);
  for(let i=0;i<4;i++){const p=(t*.2+i/4)%1;c.save();c.globalAlpha=(1-p)*.7;c.strokeStyle=WH;c.lineWidth=2;c.beginPath();c.arc(804+Math.sin(p*9)*10+p*26,128-p*30,5+p*10,0,7);c.stroke();c.restore()}
  const F=G.rfx||(G.rfx={});houseReal(c,ease(clamp((tt-2.7)/.6)),t);
  [0,1,2,3,4].forEach((r,i)=>{const lv=clamp((tt-.3-i*.45)/.6);cellDraw(c,r,'free',ease(lv),t);if(lv>=1){if(!F['r'+i]){F['r'+i]=1;if(!G.quiet)sfx.fill(i)}const cc=CELL[r];client(c,r,cc.x+MW/2+(r%2?30:-30),cc.y+MH-4,.46,'happy',t,Math.abs(Math.sin(t*6+r))*8)}});
  if(tt>3.3){if(!F.h){F.h=1;if(!G.quiet){sfx.room();star(648,200,50,CONF)}}bigText(c,'집 완성!',648,170,84,(tt-3.3)*2)}
  note(c,24,196,300,150,-.015,2);T(c,'완공 도면',22,24,20,'SunB','#2f66ad');c.strokeStyle='#2f66ad';c.lineWidth=2;c.beginPath();c.moveTo(18,39);c.lineTo(282,38);c.stroke();fitT(c,G.name+' 설계사',22,62,26,'SunB','#14295a',256);
  for(let i=0;i<3;i++){const on=i<grade&&tt>3.8+i*.3,s2=on?back(clamp((tt-3.8-i*.3)*3)):1;if(on&&!F['s'+i]){F['s'+i]=1;if(!G.quiet)sfx.chime(i)}c.save();c.translate(36+i*42,98);c.scale(s2*.72,s2*.72);c.fillStyle=on?'#ffb23c':'rgba(20,41,90,.15)';c.strokeStyle='#14295a';c.lineWidth=2.5;c.beginPath();for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,rr2=k%2?10:23;c.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2)}c.closePath();c.fill();c.stroke();c.restore()}
  T(c,['','새내기 설계사','든든한 설계사','으뜸 설계사'][grade],22,130,22,'SunB','#2f66ad');c.restore();
  soundPause(c);if(tt>5.5)RBTN.forEach((b,i)=>{const p=back(clamp((tt-5.5-i*.08)*4));c.save();c.translate(b.x+b.w/2,b.y+b.h/2);c.scale(p,p);btn(c,{x:-b.w/2,y:-b.h/2,w:b.w,h:b.h},b.label,i===0,b.x+b.w/2,b.y+b.h/2,['note','book','home'][i]);c.restore()});c.restore();
  // 아래 표제란 띠: 기록
  c.save();c.translate(bx*.9,by*.9);trayBox(c);const cols=[['한 번에 그림',f+' / 30'],['다시 고침',(30-f)+'장'],['걸린 시간',fmtTime(G.time)],['최고 기록',Math.max(G.best,f)+' / 30']];cols.forEach(([a,b],i)=>{const x=TRAY.x+18+i*138,ap=clamp((tt-4.8-i*.15)/.2);if(ap<=0)return;c.save();c.globalAlpha=ap;if(i){c.strokeStyle='rgba(234,243,255,.4)';c.lineWidth=1.2;c.beginPath();c.moveTo(x-9,TRAY.y+14);c.lineTo(x-9,TRAY.y+92);c.stroke()}T(c,a,x,TRAY.y+34,20,'SunB','#dbe8ff');fitT2(c,b,x,TRAY.y+72,27,'SunB','#ffd66b',122);c.restore()});
  mole(c,1056,712,.98,'happy',t,0);c.restore();
  foreDraw(c,bx,by);fxDraw(c)}
function resultDown(p){if(G.tt<5.5){G.tt=5.5;const F=G.rfx||(G.rfx={});['r0','r1','r2','r3','r4','h','s0','s1','s2'].forEach(k=>F[k]=1);return}const hit=b=>inR(p,b.x,b.y,b.w,b.h);if(hit(RBTN[0])){openNote();sfx.pick()}else if(hit(RBTN[1]))openAlbum();else if(hit(RBTN[2])){if(newAsk>0){G.done={};G.wrongs=[];G.time=0;save();newAsk=0;RBTN[2].label='처음부터';G.scene='select';G.tt=0}else{newAsk=3;RBTN[2].label='정말 다시?';sfx.tick()}}}
/* ── 도면첩: 방마다 물건 6개를 모은다 ── */
let albumFrom='result';function openAlbum(){albumFrom=G.scene;G.scene='album';G.tt=0;sfx.pick()}
const ABACK={x:SW.x,y:SW.y,w:SW.w,h:SW.h};
function drawAlbum(c){const t=G.t,[bx,by]=bgDraw(c,L.paperMap);c.save();c.translate(bx*.6,by*.6);
  note(c,256,16,530,128,-.012,2);T(c,'완공 도면첩',22,22,20,'SunB','#2f66ad');c.strokeStyle='#2f66ad';c.lineWidth=2;c.beginPath();c.moveTo(18,37);c.lineTo(512,36);c.stroke();fitT(c,'정답을 맞힐 때마다 물건이 실물이 되어 모여요.',22,66,26,'SunB','#14295a',486);fitT(c,'모은 물건 '+doneCount()+' / 30 · 별은 한 번에 맞힌 물건',22,102,26,'SunB','#14295a',486);c.restore();soundPause(c);
  for(let r=0;r<5;r++){const y=176+r*84;client(c,r,72,y+80,.3,'idle',t,0);T(c,ROOMS[r].name,108,y+40,22,'SunB',WH,'left',{st:NAVY,sw:5});
    roomItems(r).forEach((it,i)=>{let o=OBJ[r][i];const x=226+i*132,cw=122,ch=72;if(o[2]/o[3]>2.4){const nw=o[3]*cw/ch*1.3,nh=nw*ch/cw;o=[o[0]+o[2]/2-nw/2,o[1]+o[3]-nh,nw,nh]}else{const m=Math.max(o[2],o[3])*.08;o=[o[0]-m,o[1]-m,o[2]+2*m,o[3]+2*m]}const d=G.done[it.no],sc=Math.min(cw/o[2],ch/o[3]),dw=o[2]*sc,dh=o[3]*sc,ox=x+(cw-dw)/2,oy=y+6+(ch-dh)/2,a=clamp((G.tt-.1-r*.08-i*.03)*5);c.save();c.globalAlpha=a;
      c.fillStyle=d?'rgba(240,246,255,.95)':'rgba(13,40,88,.85)';c.fillRect(x-4,y+2,cw+8,ch+8);c.strokeStyle=d?'#ffd66b':'rgba(234,243,255,.5)';c.lineWidth=2;c.setLineDash(d?[]:[6,5]);c.strokeRect(x-4,y+2,cw+8,ch+8);c.setLineDash([]);
      c.beginPath();c.rect(x,y+6,cw,ch);c.clip();c.drawImage(d?L.rr[r]:L.rl[r],(o[0]-RX)*DPR,(o[1]-RY)*DPR,o[2]*DPR,o[3]*DPR,ox,oy,dw,dh);c.restore();
      if(d&&d.first){c.save();c.translate(x+cw-6,y+12);c.fillStyle='#ffb23c';c.strokeStyle=OL;c.lineWidth=2;c.beginPath();for(let k=0;k<10;k++){const q=k*Math.PI/5-Math.PI/2,rr2=k%2?5:12;c.lineTo(Math.cos(q)*rr2,Math.sin(q)*rr2)}c.closePath();c.fill();c.stroke();c.restore()}
      if(!d){c.save();c.translate(x+cw/2,y+42);c.strokeStyle='rgba(255,214,107,.8)';c.lineWidth=2.5;c.beginPath();rr(c,-10,-4,20,16,3);c.stroke();c.beginPath();c.arc(0,-4,7,Math.PI,0);c.stroke();c.restore()}})}
  c.save();c.translate(bx*.9,by*.9);trayBox(c);T(c,'모은 물건 '+doneCount()+' / 30',TRAY.x+TRAY.w/2,TRAY.y+40,28,'SunB','#ffe9a8','center');T(c,'한 번에 맞힌 물건 '+firstCount()+'개',TRAY.x+TRAY.w/2,TRAY.y+76,22,'SunB','#dbe8ff','center');btn(c,ABACK,'돌아가기',true,0,0,'back');mole(c,1056,712,.98,'happy',t,0);c.restore();foreDraw(c,bx,by);fxDraw(c)}
function albumDown(p){if(G.tt<.3)return;if(inR(p,ABACK.x,ABACK.y,ABACK.w,ABACK.h)){sfx.back();G.scene=albumFrom;if(albumFrom==='result'){G.tt=9;const F=G.rfx||(G.rfx={});['r0','r1','r2','r3','r4','h','s0','s1','s2'].forEach(k=>F[k]=1)}else G.tt=1}}
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
cv.addEventListener('pointerdown',e=>{e.preventDefault();if(G.paused)return;const p=pos(e);G.press={x:p.x,y:p.y,t:G.t};try{cv.setPointerCapture(e.pointerId)}catch(_){}
  if(G.scene==='album')albumDown(p);else if(G.scene==='title')titleDown(p);else if(G.scene==='select')selectDown(p);else if(G.scene==='play')playDown(p);else if(G.scene==='roomdone'){if(G.tt>.3)leaveRoomDone()}else if(G.scene==='result')resultDown(p)});
cv.addEventListener('pointermove',e=>{if(G.scene==='play'&&Q)playMove(pos(e))});
const upH=()=>{if(G.scene==='play')playUp()};cv.addEventListener('pointerup',upH);cv.addEventListener('pointercancel',upH);
document.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{if(e.target===nick){if(e.key==='Enter'&&G.scene==='title'&&(G.tt>=2.3||TEST))startGame(nick.value);return}if(e.key==='Escape'){setPause(!G.paused);return}if(e.key==='m'||e.key==='M'){$('bSound').click();return}if(G.paused)return;
  if(G.scene==='title'&&e.key==='Enter'&&G.tt>=2.3)startGame(nick.value);else if(G.scene==='select'&&e.key==='Enter')selectDown({x:CELL[Math.min(curRoom(),4)].x+10,y:CELL[Math.min(curRoom(),4)].y+10});else if(G.scene==='roomdone'&&e.key==='Enter'&&G.tt>.3)leaveRoomDone();
  else if(G.scene==='play'&&Q){if(Q.phase==='ok'){if(e.key==='Enter'&&Q.okT>nextAt()&&!Q.ff)goNext();return}if(Q.phase!=='ask'||Q.cool>0||Q.pend>0||G.t-Q.born<.35)return;const n=+e.key;
    if(n>=1&&n<=9){if(Q.it.kind==='pick'){if(n<=Q.slots.length)choose(n-1)}else if(Q.it.kind==='place'){if(n<=2)put(0,n-1)}else{if(Q.sel>=0&&n<=Q.slots.length)put(Q.sel,n-1);else if(n<=Q.toks.length)Q.sel=n-1}}
    else if(e.key==='Enter'&&Q.it.kind!=='pick')pullLever()}});
function update(dt){G.t+=dt;G.tt+=dt;if(newAsk>0){newAsk-=dt;if(newAsk<=0)RBTN[2].label='처음부터'}updateFx(dt);
  if(G.scene==='play')updatePlay(dt);else if(G.scene==='select'&&G.zoom>0){G.zoom+=dt/.5;if(G.zoom>=1){G.zoom=0;enterRoom(G.toRoom);G.toRoom=-1}}}
function draw(){const c=g;c.setTransform(DPR,0,0,DPR,0,0);if(G.scene==='title')drawTitle(c);else if(G.scene==='select')drawSelect(c);else if(G.scene==='play'&&Q)drawPlay(c);else if(G.scene==='roomdone')drawRoomDone(c);else if(G.scene==='album')drawAlbum(c);else drawResult(c);
  nick.style.display=G.scene==='title'?'block':'none'}
let last=0;function frame(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;if(!G.paused)update(dt);draw();requestAnimationFrame(frame)}
(async()=>{for(const f of['SunB','SunB','Pen','Orbit','DoHyeon']){try{await document.fonts.load('30px '+f,'가1°A')}catch(e){}}buildLayers();G.sv=load();if(G.sv&&G.sv.name)nick.value=G.sv.name;if(TEST)G.tt=3;window.READY=true;requestAnimationFrame(frame)})();
/* 자동 점검 창구 (.claude/skills/game-verify) — 게임 진행에는 쓰지 않는다 */
window.__test={version:1,stageSize:[W,H],
  ui:{stage:'#game',name:'#nick',start:{x:SW.x+SW.w/2,y:SW.y+SW.h/2},pause:'#bPause',resume:'#bResume',mute:'#bSound',rotate:'#rot',rotateOk:'#rotOk'},
  isReady(){return!!window.READY&&G.scene==='title'&&(G.tt>=2.3||TEST)},quiet(){G.quiet=true},
  items(){return ITEMS.map(it=>({no:it.no,group:ROOMS[it.room].name,src:it.src?('학습지 '+it.src+'번'):'바꾼 문항',hint:it.hint.join(' '),exp:it.exp.join(' '),steps:[{kind:it.kind==='pick'?'pick':it.kind==='place'?'lever-place':'lever-sort',ask:it.ask.join(' ')+(it.text?' ['+it.text+']':'')+(it.rows?' ['+it.rows.join(' / ')+']':'')+(it.slots?' ['+it.slots.join(' / ')+']':''),opts:it.kind==='sort'?it.tokens:it.opts,ans:it.kind==='sort'?it.ans:it.opts[it.ans]}]}))},
  goto(no){$('note').classList.remove('on');setPause(false);G.zoom=0;G.stars=[];if(!G.name)G.name='봇';openItem(no);draw()},
  state(){const sc={title:'title',select:'select',play:'play',roomdone:'play',result:'result',album:albumFrom==='result'?'result':'select'}[G.scene];return{scene:sc,no:Q&&G.scene==='play'?Q.no:0,step:0,phase:!Q?'ask':Q.phase==='ok'||Q.phase==='reveal'?'ok':Q.phase==='hint'?'hint':'ask',tries:Q?Q.tries:0,cool:Q?(Q.phase==='hint'?Math.max(Q.cool,.01):Q.cool+Q.pend+(Q.phase==='sim'?1:0)):0,paused:G.paused,muted:G.muted}},
  targets(){if(!Q)return[];const out=Q.slots.map(s=>({label:s.label,correct:Q.it.kind==='sort'?true:!!s.correct,x:Math.round(s.cx!==undefined?s.cx:s.x+s.w/2),y:Math.round(s.cy!==undefined?s.cy:s.y+s.h/2)}));if(Q.it.kind!=='pick')out.push({label:'불 켜기',confirm:true,x:SW.x+SW.w/2,y:SW.y+SW.h/2});return out},
  start(nm){G.quiet=true;startGame(nm||'봇')},
  botStep(mode){if(G.scene==='result')return;if(G.scene==='album'){G.scene=albumFrom;return}if(G.scene==='title'){startGame('봇');return}if(G.scene==='roomdone'){leaveRoomDone();G.unl=null;return}if(G.scene==='select'){G.unl=null;const r=curRoom();if(r>=5)goResult();else enterRoom(r);return}
    if(Q.phase==='ok'||Q.phase==='reveal'){Q.phase='ok';nextItem(true);return}const it=Q.it,miss=Q.tries===0&&(mode==='weak'||(mode==='mixed'&&Q.no%3===0));
    if(it.kind==='pick'){Q.choice=Q.slots.findIndex(s=>miss?!s.correct:s.correct);Q.toks[0].slot=Q.choice}else if(it.kind==='place'){const si=Q.slots.findIndex(s=>miss?!s.correct:s.correct);Q.toks[0].slot=si;Q.slots[si].tok=0}
    else{Q.slots.forEach((s,i)=>{const want=miss?Q.toks.findIndex(k=>k.label!==s.need):Q.toks.findIndex(k=>k.label===s.need);s.tok=want;Q.toks[want].slot=i})}
    judge(evalAns());G.stars=[];if(Q.phase==='hint'){Q.cool=0;Q.toks.forEach(k=>{k.slot=-1});Q.slots.forEach(s=>{s.tok=-1});clearTry()}},
  result(){return{score:doneCount(),firstTry:firstCount(),wrongNote:G.wrongs.length,time:Math.round(G.time),best:G.best}}};
