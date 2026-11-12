/* ── 그리기: 공통 부품 ── */
function aircon(c,m,x,y,sc,on){c.save();c.translate(x,y);c.scale(sc,sc);const w=116,h=50;
  if(m==='line'){bl(c,[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2],[-w/2,-h/2]]);for(let i=0;i<3;i++)bl(c,[[-w/2+10,h/2-8-i*7],[w/2-10,h/2-8-i*7]],{w:1.4})}
  else{cel(c,k=>rr(k,-w/2,-h/2,w,h,12),'#f4f8ff',{s:5});c.fillStyle=on?'#58c8f0':'#b9c6dc';for(let i=0;i<3;i++){c.beginPath();rr(c,-w/2+10,h/2-11-i*8,w-20,4,2);c.fill()}cel(c,k=>k.arc(w/2-14,-h/2+13,5,0,7),on?'#58e0a0':'#c9ccd8',{s:1,h:1,ow:2});cel(c,k=>rr(k,-w/2+10,-h/2+8,40,10,4),'#58a8dc',{s:1,h:1,ow:2})}c.restore()}
const partArt=(c,it,m,x,y,sc,on)=>it.part==='heater'?radiator(c,m,x,y,sc,on):aircon(c,m,x,y,sc,on);
function thermo(c,x,y,label,val,good,ring){c.save();bl(c,[[RX+RW-36,y],[RX+RW+22,y],[x,y]],{w:1.5,dash:[5,4],over:0});
  c.fillStyle='#e8f0ff';c.strokeStyle=OL;c.lineWidth=2.5;c.beginPath();rr(c,RX+RW-56,y-5,58,10,5);c.fill();c.stroke();c.fillStyle='#ff6a5a';c.beginPath();c.arc(RX+RW-56,y,6,0,7);c.fill();c.stroke();
  panel(c,x,y-36,176,72);T(c,label,x+12,y-17,20,'SunB','#dbe8ff');T(c,val.toFixed(1),x+116,y+13,32,'Orbit',good?'#ffd66b':'#9fd0ff','right');T(c,'°C',x+124,y+14,21,'Orbit',good?'#ffd66b':'#9fd0ff');
  if(ring>0){c.strokeStyle='#ff9d8a';c.lineWidth=3.5;c.lineCap='round';c.globalAlpha=.95;c.beginPath();c.ellipse(x+88,y,106,46,-.05,-.3,-.3+Math.PI*2.05*clamp(ring));c.stroke()}c.restore()}
function note(c,x,y,w,h,rot,tapes){c.save();c.translate(x+w/2,y+h/2);c.rotate(rot);c.translate(-w/2,-h/2);c.fillStyle='rgba(0,8,40,.35)';c.fillRect(5,7,w,h);c.fillStyle='rgba(240,246,255,.97)';c.fillRect(0,0,w,h);
  c.strokeStyle='rgba(60,110,190,.14)';c.lineWidth=1;c.beginPath();for(let i=16;i<w;i+=16){c.moveTo(i,0);c.lineTo(i,h)}for(let j=16;j<h;j+=16){c.moveTo(0,j);c.lineTo(w,j)}c.stroke();
  const tp=(tx,ty,r,col)=>{c.save();c.translate(tx,ty);c.rotate(r);c.fillStyle=col;c.fillRect(-32,-10,64,20);c.fillStyle='rgba(255,255,255,.4)';for(let i=-26;i<32;i+=12)c.fillRect(i,-10,5,20);c.restore()};
  if(tapes>0)tp(14,2,-.5,'rgba(88,196,186,.92)');if(tapes>1)tp(w-14,2,.5,'rgba(255,196,84,.95)');if(tapes===-1)tp(w/2,0,.03,'rgba(255,196,84,.95)')}
function memo(c){const it=Q.it,R=ROOMS[it.room],x=256,y=16,w=530,h=128;note(c,x,y,w,h,-.012,2);
  T(c,'의뢰 '+String(Q.no).padStart(2,'0'),22,22,20,'SunB','#2f66ad');T(c,R.home,w-22,22,20,'SunB','#2f66ad','right');c.strokeStyle='#2f66ad';c.lineWidth=2;c.beginPath();c.moveTo(18,37);c.lineTo(w-18,36);c.stroke();
  let L2=it.ask,band=null;if(Q.phase==='hint'||(Q.phase==='ask'&&Q.tries>0)||(Q.phase==='sim'&&Q.tries>0)){L2=it.hint;band='rgba(255,196,84,.55)'}else if(Q.phase==='ok'||Q.phase==='reveal'){L2=it.exp;band='rgba(110,220,170,.5)'}
  if(band){c.fillStyle=band;c.fillRect(16,50,w-32,30);c.fillRect(16,86,w-32,30)}fitT(c,L2[0],22,66,28,'SunB','#14295a',w-44);fitT(c,L2[1],22,102,28,'SunB','#14295a',w-44);c.restore()}
function miniMap(c,mx,my,cur){c.strokeStyle=WH;c.lineWidth=1.8;c.beginPath();c.moveTo(mx-4,my+20);c.lineTo(mx+36,my);c.lineTo(mx+76,my+20);c.stroke();
  [[3,10,22,26],[4,38,22,26],[0,4,38,21],[1,27,38,21],[2,50,38,21]].forEach(([r,dx,dy,cw])=>{const d=roomDone(r);c.fillStyle=d>=6?'#ffb23c':r===cur?'rgba(255,233,168,'+(.35+Math.sin(G.t*5)*.3)+')':'rgba(234,243,255,.12)';c.fillRect(mx+dx,my+dy,cw,14);c.strokeRect(mx+dx,my+dy,cw,14)})}
function titleBlock(c,line2,goal,cur){const x=806,y=16,w=444,h=78;panel(c,x,y,w,h);c.strokeStyle=WH;c.lineWidth=1.5;c.beginPath();c.moveTo(x,y+40);c.lineTo(x+w-96,y+40);c.moveTo(x+166,y+40);c.lineTo(x+166,y+h);c.moveTo(x+w-96,y);c.lineTo(x+w-96,y+h);c.stroke();
  T(c,'따끈 설계소',x+14,y+21,27,'SunB','#fff');T(c,line2,x+14,y+59,20,'Orbit',WH);fitT2(c,goal,x+178,y+59,21,'SunB','#ffd66b',162);miniMap(c,x+w-84,y+12,cur);
  [[1172,126,0],[1222,126,1]].forEach(([ix,iy,k])=>{c.save();c.fillStyle='rgba(13,40,88,.92)';c.strokeStyle=WH;c.lineWidth=2;c.beginPath();c.arc(ix,iy,21,0,7);c.fill();c.stroke();c.lineCap='round';c.lineWidth=2.5;
    if(k===0){c.beginPath();c.moveTo(ix-10,iy-4);c.lineTo(ix-4,iy-4);c.lineTo(ix+2,iy-9);c.lineTo(ix+2,iy+9);c.lineTo(ix-4,iy+4);c.lineTo(ix-10,iy+4);c.closePath();c.stroke();if(G.muted){c.beginPath();c.moveTo(ix+6,iy-5);c.lineTo(ix+13,iy+5);c.moveTo(ix+13,iy-5);c.lineTo(ix+6,iy+5);c.stroke()}else{c.beginPath();c.arc(ix+3,iy,6,-.8,.8);c.stroke();c.beginPath();c.arc(ix+3,iy,11,-.8,.8);c.stroke()}}
    else{c.lineWidth=4;c.beginPath();c.moveTo(ix-5,iy-7);c.lineTo(ix-5,iy+7);c.moveTo(ix+5,iy-7);c.lineTo(ix+5,iy+7);c.stroke()}c.restore()})}
function fitT2(c,str,x,y,sz,font,col,maxW){c.font=sz+'px '+font;const w=c.measureText(str).width;T(c,str,x,y,w>maxW?Math.floor(sz*maxW/w):sz,font,col)}
function leverBox(c,ready,on,label){const x=SW.x,y=SW.y;c.save();c.fillStyle='rgba(0,8,20,.45)';c.beginPath();rr(c,x+8,y+16,SW.w,SW.h-8,14);c.fill();c.restore();
  cel(c,k=>rr(k,x,y+12,SW.w,SW.h-12,14),'#6a4630',{s:3,h:0});cel(c,k=>rr(k,x,y+2,SW.w,SW.h-14,14),ready?'#ffb23c':on?'#f26a4b':'#b9804f',{s:6,h:4});
  [[x+12,y+14],[x+SW.w-12,y+14],[x+12,y+SW.h-24],[x+SW.w-12,y+SW.h-24]].forEach(([sx,sy])=>{c.fillStyle='#e8ecf5';c.strokeStyle=OL;c.lineWidth=2;c.beginPath();c.arc(sx,sy,4.5,0,7);c.fill();c.stroke();c.beginPath();c.moveTo(sx-3,sy);c.lineTo(sx+3,sy);c.stroke()});
  cel(c,k=>rr(k,x+SW.w/2-13,y+16,26,50,13),'#2b2350',{s:0,h:0,ow:0});const a=on?.75:-.75+G.pull*.2+(ready?Math.sin(G.t*6)*.06:0);c.save();c.translate(x+SW.w/2,y+56);c.rotate(a);cel(c,k=>rr(k,-7,-50,14,54,7),'#e8ecf5',{s:3,h:2});cel(c,k=>k.arc(0,-52,14,0,7),ready||on?'#e9596a':'#c9d3e8',{s:4,h:3});c.restore();
  T(c,label||'불 켜기',x+SW.w/2,y+SW.h-27,24,'SunB','#2b2350','center');if(ready){c.save();c.strokeStyle='#ffe9a8';c.lineWidth=3;c.globalAlpha=.5+Math.sin(G.t*6)*.4;c.beginPath();rr(c,x-6,y-4,SW.w+12,SW.h+4,18);c.stroke();c.restore()}}
function trayBox(c){const{x,y,w,h}=TRAY;c.save();c.fillStyle='rgba(0,8,20,.4)';c.fillRect(x+8,y+10,w,h);c.restore();panel(c,x,y,w,h,{fill:'#0f2f5e'});
  // 책상 위 작은 소품(지우개·자·연필밥)
  cel(c,k=>rr(k,150,650,56,26,6),'#f2f0ea',{s:3,h:2});cel(c,k=>rr(k,150,650,22,26,6),'#58a8dc',{s:2,h:1,ow:2});c.fillStyle='rgba(240,236,220,.7)';[[214,690],[226,682],[206,700],[236,698]].forEach(([a,b])=>{c.beginPath();el(c,a,b,5,2,a);c.fill()})}
function tokDraw(c,k,i){const drag=Q.drag===i,sel=Q.sel===i,lift=drag?12:0;c.save();c.translate(k.x,k.y-lift*.3);c.rotate(drag?-.05:Math.sin(k.wob*18)*k.wob*.1+(sel?Math.sin(G.t*10)*.04:0));c.scale(k.sc,k.sc);
  if(k.kind==='word'){c.fillStyle='rgba(0,8,20,.4)';c.fillRect(-k.w/2+4+lift*.5,-k.h/2+6+lift,k.w,k.h);c.fillStyle=k.slot>=0?'#ffb23c':'#12346c';c.fillRect(-k.w/2,-k.h/2,k.w,k.h);c.strokeStyle=sel?'#fff':'#ffd66b';c.lineWidth=sel?4:2.5;c.strokeRect(-k.w/2,-k.h/2,k.w,k.h);c.fillStyle=k.slot>=0?'#2b2350':'#ffd66b';c.beginPath();c.arc(-k.w/2+13,0,4,0,7);c.fill();T(c,k.label,8,2,24,'SunB',k.slot>=0?'#2b2350':'#ffe9a8','center')}
  else if(k.kind==='pin'){c.fillStyle='rgba(0,8,20,.3)';c.beginPath();el(c,6,30+lift,16,5);c.fill();pinArt(c,0,0,1.7,k.slot>=0?.25:0)}
  else{c.fillStyle='rgba(0,8,20,.35)';c.beginPath();if(k.slot===0)rr(c,-50,-21,112,58,10);else el(c,6,34+lift,56,7);c.fill();partArt(c,Q.it,'real',0,0,1,k.slot>=0&&Q.phase!=='ask'&&!(Q.phase==='hint'&&Q.cool<=0));if(sel){c.strokeStyle='#ffe9a8';c.lineWidth=3;c.setLineDash([8,6]);c.lineDashOffset=-G.t*30;c.strokeRect(-66,-40,132,80)}}
  c.restore()}
function badge(c,x,y,ok,p){c.save();c.translate(x,y);const s=back(clamp(p));c.scale(s,s);c.lineCap='round';c.lineJoin='round';if(ok){cel(c,k=>k.arc(0,0,24,0,7),'#4fd08a',{s:3,h:2});c.strokeStyle='#fff';c.lineWidth=7;c.beginPath();c.moveTo(-11,1);c.lineTo(-3,10);c.lineTo(12,-9);c.stroke()}else{c.strokeStyle=NAVY;c.lineWidth=12;c.beginPath();c.moveTo(-14,-14);c.lineTo(14,14);c.moveTo(14,-14);c.lineTo(-14,14);c.stroke();c.strokeStyle='#ff8f7a';c.lineWidth=7;c.stroke()}c.restore()}
function slotDraw(c,s,i){const it=Q.it,ask=Q.phase==='ask',drag=Q.drag>=0,near=drag&&slotAt({x:Q.toks[Q.drag].x,y:Q.toks[Q.drag].y},it.kind==='pick'?6:34)===i,sx=Math.sin(s.shake*30)*s.shake*8;c.save();c.translate(sx,0);
  if(it.lay==='cards'){note(c,s.x,s.y,s.w,s.h,(i%2?1:-1)*.007,-1);if(near){c.fillStyle='rgba(255,196,84,.4)';c.fillRect(0,0,s.w,s.h)}if(Q.phase==='ok'&&s.correct){c.fillStyle='rgba(110,220,170,.45)';c.fillRect(0,0,s.w,s.h)}
    c.fillStyle='#2f66ad';c.beginPath();c.arc(30,s.h/2,17,0,7);c.fill();T(c,String(i+1),30,s.h/2+1,22,'SunB','#fff','center');c.font='25px SunB';const ln=wrap(c,s.label,s.w-74),lh=31,y0=s.h/2-(ln.length-1)*lh/2+1;ln.forEach((t2,k)=>T(c,t2,58,y0+k*lh,25,'SunB','#14295a'));c.restore();c.restore()}
  else if(s.cx!==undefined){mark(c,s.cx,s.cy,'ㄱㄴㄷ'[i],44,near)}
  else if(it.kind==='pick'){c.fillStyle=near?'rgba(255,196,84,.3)':'rgba(255,214,107,'+(.07+Math.sin(G.t*3+i)*.03)+')';c.fillRect(s.x,s.y,s.w,s.h);c.strokeStyle=near?'#fff':'#ffd66b';c.lineWidth=near?4:2.5;c.setLineDash([10,7]);c.lineDashOffset=-G.t*(ask?22:0);c.strokeRect(s.x,s.y,s.w,s.h);c.setLineDash([])}
  else{c.globalAlpha=it.lay==='room'&&!ask?.45:1;c.fillStyle=near?'rgba(255,178,60,.34)':'rgba(255,214,107,'+(.10+Math.sin(G.t*3+i)*.04)+')';c.fillRect(s.x,s.y,s.w,s.h);c.strokeStyle=near?'#fff':'#ffd66b';c.lineWidth=near?4:3;c.setLineDash([10,7]);c.lineDashOffset=-G.t*(ask?22:0);c.strokeRect(s.x,s.y,s.w,s.h);c.setLineDash([]);if(it.lay==='room'&&ask&&s.tok<0)T(c,s.label,s.x+s.w/2,s.y+s.h/2+1,26,'SunB','#ffe9a8','center',{st:NAVY,sw:6});else if(s.tok<0&&it.lay!=='room')T(c,'?',s.x+s.w/2,s.y+s.h/2+2,28,'SunB','rgba(255,233,168,.7)','center')}
  if(it.lay!=='cards')c.restore();
  const bx=s.cx!==undefined?s.cx+34:s.x+s.w-18,by=s.cy!==undefined?s.cy+30:s.y+s.h-16;
  if(Q.phase==='ok'&&it.lay!=='room'&&(it.kind==='pick'?s.correct:true))badge(c,bx,by,true,Q.okT*3);if(Q.phase==='hint'&&s.shake>0&&it.lay!=='room')badge(c,bx,by,false,Q.hintT*4)}
function fxDraw(c){for(const s of G.puffs){c.save();c.globalAlpha=1-s.t/s.l;c.fillStyle='#eaf3ff';c.beginPath();c.arc(s.x,s.y,s.r*(1+s.t*2),0,7);c.fill();c.restore()}
  for(const s of G.stars){c.save();c.globalAlpha=clamp((s.l-s.t)*3);c.translate(s.x,s.y);c.rotate(s.t*s.sp);c.fillStyle=s.c;c.strokeStyle=OL;c.lineWidth=2;c.beginPath();if(s.k===0){for(let i=0;i<10;i++){const a=i*Math.PI/5,r=i%2?s.r*.45:s.r;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath()}else if(s.k===1)c.rect(-s.r*.7,-s.r*.4,s.r*1.4,s.r*.8);else{c.moveTo(-s.r,0);c.lineTo(s.r,-s.r*.5);c.lineTo(s.r*.4,s.r*.7);c.closePath()}c.fill();c.stroke();c.restore()}}
function bgDraw(c,paper){const t=G.t,bx=LOW?0:Math.sin(t*.5)*4,by=LOW?0:Math.cos(t*.37)*3;c.drawImage(L.desk,-20+bx*.3,-20+by*.3,W+40,H+40);c.fillStyle='rgba(0,8,20,.5)';c.fillRect(PX0+bx*.6+6,598+by*.6,PX1-PX0-80,12);c.drawImage(paper,-20+bx*.6,by*.6,W+40,620);return[bx,by]}
function foreDraw(c,bx,by){c.drawImage(L.fore,bx*1.8-6,by*1.8+4,W+12,H+8);for(let i=0;i<3;i++){const p=(G.t*.25+i/3)%1;c.save();c.globalAlpha=(1-p)*.35;c.strokeStyle='#fff';c.lineWidth=7;c.lineCap='round';c.beginPath();for(let k=0;k<=10;k++)c.lineTo(1226+i*22+Math.sin(k*.9+G.t*2+i)*8,612-p*70-k*5);c.stroke();c.restore()}c.drawImage(L.vig,0,0,W,H)}
function bigText(c,s,x,y,sz,p){c.save();c.translate(x,y);c.rotate(-.04);const q=back(clamp(p));c.scale(q,q);for(let i=6;i>0;i--)T(c,s,0,i,sz,'SunB','#b8642a','center',{st:OL,sw:sz*.2});T(c,s,0,0,sz,'SunB','#ffd23f','center',{st:OL,sw:sz*.2});T(c,s,0,-3,sz,'SunB','#fff3b0','center');c.restore()}
/* ── 그리기: 문제 화면 ── */
function drawPlay(c){const it=Q.it,r=it.room,t=G.t,room=it.lay==='room',[bx,by]=bgDraw(c,L.paper);c.save();c.translate(bx*.6,by*.6);
  c.save();c.beginPath();c.rect(PX0,0,PX1-PX0,598);c.clip();for(const s of snow){c.fillStyle='rgba(234,243,255,.9)';c.beginPath();c.arc(s.x,s.y,s.r,0,7);c.fill()}c.restore();
  const k=roomDone(r),okLike=Q.phase==='ok'||Q.phase==='reveal',cex=okLike?'happy':Q.phase==='hint'?'sad':(Q.phase==='sim'||Q.pend>0)?'wow':(room&&it.part==='heater'?'cold':'idle'),hop=Q.phase==='ok'?Math.abs(Math.sin(t*7))*12*Math.max(.25,1-Q.okT*.25):0;
  if(room){const simP=Q.phase==='sim'?ease(clamp(Q.simT/Q.simDur)):Q.phase==='hint'?clamp(1-Q.hintT/1.6):0,rv=Q.phase==='ok'?1:Q.phase==='reveal'?ease(Q.rv):0,base=(k-(G.done[Q.no]?1:0))/6;
    if(simP>0&&rv<1){const pp=Q.phase==='hint'?1:simP,fade=Q.phase==='hint'?simP:Math.min(1,simP*5);for(let i=0;i<26;i++)for(let j=0;j<13;j++){tg.fillStyle=tcol(roomHeat((i+.5)/26,(j+.5)/13,pp));tg.fillRect(i,j,1,1)}
      c.save();c.beginPath();c.rect(RX,RY,RW,RH);c.clip();c.globalAlpha=.7*fade;c.imageSmoothingEnabled=true;c.drawImage(TM,RX-RW/52,RY-RH/26,RW+RW/26,RH+RH/13);c.restore();c.save();c.globalAlpha=1-fade;c.drawImage(L.rl[r],RX,RY,RW,RH);c.globalAlpha=fade;c.drawImage(L.rlT,RX,RY,RW,RH);c.restore()}
    else c.drawImage(L.rl[r],RX,RY,RW,RH);
    const lvl=Math.max(base,rv);if(lvl>0){const yy=RB-RH*lvl;c.save();c.beginPath();c.rect(RX,yy,RW,RB-yy);c.clip();c.drawImage(L.rr[r],RX,RY,RW,RH);c.restore();if(rv>0&&rv<1){const gl=c.createLinearGradient(0,yy-26,0,yy+6);gl.addColorStop(0,'rgba(255,230,150,0)');gl.addColorStop(1,'rgba(255,240,190,.85)');c.fillStyle=gl;c.fillRect(RX,yy-26,RW,32);c.fillStyle='#fff';c.fillRect(RX,yy-1.5,RW,3)}}
    if(!okLike)Q.slots.forEach((s,i)=>{if(s.tok<0)slotDraw(c,s,i)});
    client(c,r,520,542,1,cex,t,hop);const pk=Q.toks[0];if(pk.slot>=0&&Q.drag<0){tokDraw(c,pk,0);if(Q.phase!=='ask'&&!(Q.phase==='hint'&&Q.cool<=0)){const heat=it.part==='heater';for(let i=0;i<3;i++){const p=(t*.9+i/3)%1;c.save();c.globalAlpha=(1-p)*.8;c.strokeStyle=heat?'#ffb27a':'#9fe0ff';c.lineWidth=3;c.lineCap='round';c.beginPath();const x0=pk.x-30+i*30;for(let q=0;q<=8;q++)c.lineTo(x0+Math.sin(q*1.1+t*5)*5,pk.y+(heat?-34-p*40-q*3:30+p*40+q*3));c.stroke();c.restore()}}}
    if((Q.phase==='sim'||(okLike&&(Q.phase==='reveal'||Q.okT<.8)))&&pk.slot>=0){const heat=it.part==='heater',right=Q.slots[pk.slot].correct,P=heat?(right?PATH.B:PATH.A):(right?PATH.Bm:PATH.Am),al=Q.phase==='ok'?1-Q.okT/.8:1;
      ribbon(c,P,t,right?34:16,Q.phase==='sim'?Q.simT/(right?2.2:1.4):1,heat?(right?(f=>1-clamp((f-.1)/.72)):(f=>1-f*.45)):(right?(f=>clamp((f-.1)/.72)):(f=>f*.3)),al)}
    const heat=it.part==='heater';thermo(c,1076,RY+52,'위쪽 온도계',Q.tTop,heat?Q.tTop>=20:Q.tTop<=26,Q.phase==='hint'?Q.hintT*1.6:0);thermo(c,1076,FY-30,'아래쪽 온도계',Q.tBot,heat?Q.tBot>=20:Q.tBot<=26,Q.phase==='hint'?Q.hintT*1.6-.5:0);
    if(Q.phase==='hint'){const p=clamp(Q.hintT*1.4-.6),A=heat?['위쪽만 따뜻해졌네…','바닥은 아직 차가워요!']:['아래쪽만 시원해졌네…','위쪽은 아직 더워요!'];c.save();c.globalAlpha=p;c.translate(768,296);c.rotate(-.05);c.fillStyle='rgba(20,56,116,.9)';c.fillRect(-176,-26,352,96);T(c,A[0],0,0,46,'Pen','#ffb3a0','center');T(c,A[1],0,44,46,'Pen','#ffb3a0','center');c.restore()}
    if(Q.phase==='ok')bigText(c,'도면 완성!',640,214,72,Q.okT*2.2)}
  else{// 작업 도면: 방은 뒤에 연하게, 정답이면 도면이 걷히며 방이 한 칸 더 차오름
    const fadeOut=Q.phase==='ok'?clamp((Q.okT-1.0)/.5):0,kPrev=k-(G.done[Q.no]?1:0),lvl=(kPrev+(Q.phase==='ok'?ease(clamp((Q.okT-1.1)/.8)):0))/6;
    c.drawImage(L.rl[r],RX,RY,RW,RH);if(lvl>0){const yy=RB-RH*lvl;c.save();c.beginPath();c.rect(RX,yy,RW,RB-yy);c.clip();c.drawImage(L.rr[r],RX,RY,RW,RH);c.restore();if(fadeOut>0&&lvl<k/6){c.fillStyle='#fff';c.fillRect(RX,yy-1.5,RW,3)}}
    client(c,r,122,RB+2,.92,cex,t,hop);
    if(fadeOut<1){c.save();c.globalAlpha=1-fadeOut;c.fillStyle='rgba(22,62,126,.93)';c.fillRect(SHT.x-8,SHT.y-6,SHT.w+16,SHT.h+12);c.strokeStyle='rgba(234,243,255,.10)';c.lineWidth=1;c.beginPath();for(let x=SHT.x;x<SHT.x+SHT.w;x+=16){c.moveTo(x,SHT.y-6);c.lineTo(x,SHT.y+SHT.h+6)}for(let y=SHT.y;y<SHT.y+SHT.h;y+=16){c.moveTo(SHT.x-8,y);c.lineTo(SHT.x+SHT.w+8,y)}c.stroke();
      c.strokeStyle='rgba(234,243,255,.6)';c.lineWidth=1.5;c.setLineDash([8,6]);c.strokeRect(SHT.x-8,SHT.y-6,SHT.w+16,SHT.h+12);c.setLineDash([]);
      if(it.lay==='cards'){if(Q.figR)FIGS[it.fig||'pin'].draw(c,Q,t,Q.figR)}else if(it.fig)FIGS[it.fig].draw(c,Q,t);
      if(it.lay==='blank')Q.words.forEach(w=>T(c,w.s,w.x,w.y+2,30,'SunB','#fff'));
      if(it.lay==='rows')Q.rows.forEach((rw,i)=>{note(c,SHT.x+10,rw.y,SHT.w-232,rw.h,(i%2?1:-1)*.005,-1);c.fillStyle='#2f66ad';c.beginPath();c.arc(30,rw.h/2,17,0,7);c.fill();T(c,'('+(i+1)+')',30,rw.h/2+1,19,'SunB','#fff','center');const lh=33,y0=rw.h/2-(rw.lines.length-1)*lh/2+1;rw.lines.forEach((s2,q)=>T(c,s2,58,y0+q*lh,26,'SunB','#14295a'));c.restore();bl(c,[[SHT.x+SHT.w-220,rw.y+rw.h/2],[SHT.x+SHT.w-212,rw.y+rw.h/2]],{w:2,over:0})});
      Q.slots.forEach((s,i)=>slotDraw(c,s,i));Q.toks.forEach((tk,i)=>{if(tk.slot>=0&&Q.drag!==i)tokDraw(c,tk,i)});c.restore()}
    // 오른쪽 여백: 이 방 도면 진행
    panel(c,1076,RY+16,176,72);T(c,ROOMS[r].name+' 도면',1088,RY+35,20,'SunB','#dbe8ff');for(let i=0;i<6;i++){c.fillStyle=i<k?'#ffb23c':'rgba(234,243,255,.22)';c.fillRect(1090+i*26,RY+56,20,18);c.strokeStyle=WH;c.lineWidth=1.2;c.strokeRect(1090+i*26,RY+56,20,18)}}
  memo(c);titleBlock(c,'도면 '+String(Q.no).padStart(2,'0')+' / 30',room?(it.part==='heater'?'목표 20 °C 이상':'목표 26 °C 이하'):ROOMS[r].topic,r);
  if(Q.phase==='ok'&&Q.okT>.9){const pp=back(clamp((Q.okT-.9)*3));c.save();c.translate(NEXT.x+NEXT.w/2,NEXT.y+NEXT.h/2);c.scale(pp,pp);panel(c,-NEXT.w/2,-NEXT.h/2,NEXT.w,NEXT.h,{fill:'#12346c',col:'#ffd66b'});T(c,roomDone(r)>=6?'방 완성!':'다음 도면',0,1,26,'SunB','#ffe9a8','center');c.restore()}
  c.restore();
  // 책상 위
  c.save();c.translate(bx*.9,by*.9);trayBox(c);const lev=it.kind!=='pick';if(lev)leverBox(c,Q.phase==='ask'&&filled(),Q.phase!=='ask');
  else{panel(c,SW.x,SW.y+8,SW.w,SW.h-14,{fill:'#0f2f5e'});T(c,'핀을 꽂으면',SW.x+SW.w/2,SW.y+44,20,'SunB','#dbe8ff','center');T(c,'바로 확인!',SW.x+SW.w/2,SW.y+74,20,'SunB','#ffd66b','center')}
  mole(c,1056,712,.98,okLike?'happy':Q.phase==='hint'?'think':'idle',t,lev?G.pull:0);
  if(Q.toks.some(tk=>tk.slot>=0)||Q.drag>=0){c.save();c.globalAlpha=.4;Q.toks.forEach(tk=>{if(tk.slot>=0||Q.drag>=0){c.setLineDash([6,6]);c.strokeStyle=WH;c.lineWidth=1.5;c.strokeRect(tk.hx-tk.w/2,tk.hy-tk.h/2,tk.w,tk.h)}});c.restore()}
  Q.toks.forEach((tk,i)=>{if(tk.slot<0&&Q.drag!==i)tokDraw(c,tk,i)});
  if(it.kind==='pick'&&Q.toks[0].slot<0)T(c,'핀',Q.toks[0].hx+70,Q.toks[0].hy+4,24,'SunB','#ffe9a8','center');
  // 처음 한 번: 손가락 안내
  if(Q.phase==='ask'&&Q.tries===0&&Q.drag<0&&Q.toks[0].slot<0&&doneCount()===0&&G.t-Q.born>1){const s0=Q.slots[0],tk=Q.toks[0],p=((t-Q.born)%2.4)/2.4,e=ease(clamp(p*1.4)),hx=lerp(tk.hx+16,(s0.cx||s0.x+s0.w/2)+10,e),hy=lerp(tk.hy+10,(s0.cy||s0.y+s0.h/2)+20,e)-Math.sin(e*Math.PI)*60;c.save();c.globalAlpha=p<.8?.9:(1-p)*4.5;c.translate(hx,hy);c.fillStyle='#fff';c.strokeStyle=OL;c.lineWidth=3;c.lineJoin='round';c.beginPath();c.moveTo(0,0);c.lineTo(22,30);c.lineTo(10,30);c.lineTo(15,48);c.lineTo(6,50);c.lineTo(1,33);c.lineTo(-9,40);c.closePath();c.fill();c.stroke();c.restore()}
  c.restore();foreDraw(c,bx,by);if(Q.drag>=0)tokDraw(c,Q.toks[Q.drag],Q.drag);fxDraw(c)}
