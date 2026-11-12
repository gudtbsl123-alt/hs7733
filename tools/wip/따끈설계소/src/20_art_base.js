/* ── 가구(선·실물 두 가지로 그린다) ── */
function P(c,mode,shape,col,o){if(mode==='line'||mode==='lineT'){c.save();c.beginPath();shape(c);if(mode==='line'){c.fillStyle='#255a9f';c.fill()}c.fillStyle=mode==='line'?'rgba(234,243,255,.06)':'rgba(20,50,110,.16)';c.fill();c.strokeStyle=WH;c.lineWidth=2;c.lineJoin='round';c.stroke();c.restore()}else cel(c,shape,col,o)}
function F3(c,m){
  // 깔개
  P(c,m,k=>el(k,640,548,210,11),'#e9596a',{s:3,h:2});if(m==='real'){c.save();c.strokeStyle='#ffd9a8';c.lineWidth=2;c.setLineDash([8,7]);c.beginPath();el(c,640,547,186,7);c.stroke();c.restore()}
  // 창문
  if(m==='real'){cel(c,k=>rr(k,552,226,216,180,8),'#8a5a3c');const q=c.createLinearGradient(0,238,0,394);q.addColorStop(0,'#29407e');q.addColorStop(1,'#6f8fd0');c.fillStyle=q;c.fillRect(566,240,188,152);
    c.fillStyle='#e8f2ff';c.beginPath();c.moveTo(566,392);c.quadraticCurveTo(620,356,680,376);c.quadraticCurveTo(720,350,754,368);c.lineTo(754,392);c.closePath();c.fill();
    c.fillStyle='#2f5a54';[[600,370,18],[716,362,22]].forEach(([x,y,s])=>{c.beginPath();c.moveTo(x,y-s*2.2);c.lineTo(x+s,y);c.lineTo(x-s,y);c.closePath();c.fill()});
    c.fillStyle='#8a5a3c';c.fillRect(656,240,8,152);c.fillRect(566,312,188,7);c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.moveTo(572,246);c.lineTo(610,246);c.lineTo(580,306);c.lineTo(572,306);c.fill();
    cel(c,k=>{k.moveTo(540,220);k.lineTo(600,220);k.quadraticCurveTo(596,320,566,404);k.lineTo(540,404);k.closePath()},'#3aa89a',{s:5});cel(c,k=>{k.moveTo(780,220);k.lineTo(720,220);k.quadraticCurveTo(724,320,754,404);k.lineTo(780,404);k.closePath()},'#3aa89a',{s:5});
    cel(c,k=>rr(k,528,212,264,14,7),'#6a4630');cel(c,k=>rr(k,544,402,232,14,5),'#a8744c')}
  else{bl(c,[[552,226],[768,226],[768,406],[552,406],[552,226]]);bl(c,[[566,240],[754,240],[754,392],[566,392],[566,240]],{w:1.2});bl(c,[[660,240],[660,392]],{w:1.2});bl(c,[[566,316],[754,316]],{w:1.2});bl(c,[[540,220],[540,404]],{w:1.2,dash:[5,4]});bl(c,[[780,220],[780,404]],{w:1.2,dash:[5,4]});bl(c,[[528,212],[792,212],[792,224],[528,224],[528,212]],{w:1.4});bl(c,[[544,404],[776,404],[776,416],[544,416],[544,404]],{w:1.4})}
  // 액자
  P(c,m,k=>rr(k,440,266,86,70,5),'#c98a4e');if(m==='real'){c.fillStyle='#fff3d6';c.fillRect(450,276,66,50);c.fillStyle='#f29b4c';c.beginPath();c.arc(470,296,9,0,7);c.fill();c.fillStyle='#6fae7a';c.beginPath();c.moveTo(450,326);c.lineTo(480,302);c.lineTo(500,318);c.lineTo(516,306);c.lineTo(516,326);c.fill()}else{bl(c,[[450,276],[516,276],[516,326],[450,326],[450,276]],{w:1.2});bl(c,[[450,326],[480,302],[500,318],[516,306]],{w:1.2})}
  // 천장등
  if(m==='real'){c.strokeStyle=OL;c.lineWidth=3;c.beginPath();c.moveTo(860,170);c.lineTo(860,214);c.stroke();cel(c,k=>{k.moveTo(832,212);k.lineTo(888,212);k.lineTo(908,252);k.lineTo(812,252);k.closePath()},'#f2c14e');cel(c,k=>el(k,860,254,22,9),'#fff6c8',{s:2,h:0})}
  else{bl(c,[[860,170],[860,212]],{w:1.4});bl(c,[[832,212],[888,212],[908,252],[812,252],[832,212]]);bl(c,[[838,254],[882,254]],{w:1.2})}
  // 소파
  P(c,m,k=>rr(k,664,424,236,96,30),'#3f8fc4',{s:8});P(c,m,k=>rr(k,646,470,272,56,22),'#58a8dc',{s:7});P(c,m,k=>rr(k,634,452,48,82,22),'#3f8fc4');P(c,m,k=>rr(k,882,452,48,82,22),'#3f8fc4');
  P(c,m,k=>rr(k,700,440,70,54,16),'#ffcf5e',{s:5});P(c,m,k=>rr(k,800,444,62,50,16),'#f28a6a',{s:5});
  P(c,m,k=>rr(k,656,530,14,16,3),'#6a4630',{s:2,h:0});P(c,m,k=>rr(k,894,530,14,16,3),'#6a4630',{s:2,h:0});
  // 화분
  P(c,m,k=>{k.moveTo(950,496);k.lineTo(1002,496);k.lineTo(994,544);k.lineTo(958,544);k.closePath()},'#d9764a');
  [[962,462,-.5],[990,458,.5],[976,440,0],[952,482,-1],[1000,480,1]].forEach(([x,y,r])=>P(c,m,k=>el(k,x,y,13,27,r),'#4fae78',{s:4,h:3}));
  // 벽시계
  P(c,m,k=>k.arc(482,218,23,0,7),'#fff6e0');if(m==='real'){c.strokeStyle=OL;c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(482,218);c.lineTo(482,204);c.moveTo(482,218);c.lineTo(493,223);c.stroke();c.fillStyle='#e9596a';for(let i=0;i<12;i++){c.beginPath();c.arc(482+Math.cos(i*Math.PI/6)*17,218+Math.sin(i*Math.PI/6)*17,i%3?1.3:2.4,0,7);c.fill()}}else{bl(c,[[482,218],[482,204]],{w:1.4,over:0});bl(c,[[482,218],[493,223]],{w:1.4,over:0})}
  // 위쪽 자리 까치발(벽 받침)
  [[306,272],[392,272]].forEach(([x,y])=>P(c,m,k=>{k.moveTo(x,y);k.lineTo(x+18,y);k.lineTo(x,y+20);k.closePath()},'#8a5a3c',{s:2,h:0,ow:2}));P(c,m,k=>rr(k,290,268,128,6,3),'#a8744c',{s:2,h:1,ow:2});
  // 옷걸이와 겉옷(두 자리 사이 벽)
  P(c,m,k=>rr(k,312,318,84,8,4),'#8a5a3c',{s:2,h:1,ow:2});P(c,m,k=>{k.moveTo(322,326);k.lineTo(362,326);k.lineTo(370,404);k.lineTo(316,404);k.closePath()},'#7a6ac8',{s:5});P(c,m,k=>{k.moveTo(324,330);k.lineTo(306,376);k.lineTo(318,382);k.lineTo(330,352);k.closePath()},'#6a5ab8',{s:3,h:2});P(c,m,k=>{k.moveTo(360,330);k.lineTo(378,376);k.lineTo(366,382);k.lineTo(354,352);k.closePath()},'#6a5ab8',{s:3,h:2});P(c,m,k=>{k.moveTo(334,326);k.lineTo(342,340);k.lineTo(350,326);k.closePath()},'#fff6e0',{s:1,h:0,ow:2});P(c,m,k=>{k.moveTo(380,326);k.quadraticCurveTo(398,332,392,372);k.lineTo(380,372);k.closePath()},'#ffcf5e',{s:3,h:2});
  // 콘센트
  P(c,m,k=>rr(k,436,470,20,26,4),'#fff6e0',{s:2,h:0,ow:2});if(m==='real'){c.fillStyle=OL;c.fillRect(442,478,3,7);c.fillRect(448,478,3,7)}
  // 책 선반(오른쪽 벽)
  P(c,m,k=>rr(k,904,330,96,8,3),'#8a5a3c',{s:2,h:1,ow:2});[[910,'#e9596a',34],[924,'#ffcf5e',28],[938,'#3aa89a',38],[952,'#7a6ac8',30]].forEach(([x,col,h])=>P(c,m,k=>rr(k,x,330-h,12,h,2),col,{s:2,h:1,ow:2}));P(c,m,k=>rr(k,974,312,18,18,5),'#d9764a',{s:2,h:1,ow:2});P(c,m,k=>el(k,983,302,7,12),'#4fae78',{s:2,h:1,ow:2});
  // 둥근 걸상과 찻잔
  P(c,m,k=>rr(k,590,488,44,10,5),'#a8744c',{s:2,h:1});P(c,m,k=>rr(k,596,498,7,42,3),'#8a5a3c',{s:2,h:0,ow:2});P(c,m,k=>rr(k,621,498,7,42,3),'#8a5a3c',{s:2,h:0,ow:2});P(c,m,k=>{k.moveTo(600,472);k.lineTo(624,472);k.lineTo(620,488);k.lineTo(604,488);k.closePath()},'#fff6e0',{s:2,h:1,ow:2});
  // 실내화
  P(c,m,k=>el(k,444,548,15,6),'#3aa89a',{s:2,h:1,ow:2});P(c,m,k=>el(k,474,551,15,6),'#3aa89a',{s:2,h:1,ow:2});
  // 고양이(깔개 위에서 잠)
  P(c,m,k=>el(k,868,538,34,15),'#f2a04a',{s:5,h:3});P(c,m,k=>k.arc(842,530,13,0,7),'#f2a04a',{s:3,h:2});P(c,m,k=>{k.moveTo(832,522);k.lineTo(836,508);k.lineTo(844,520);k.closePath()},'#f2a04a',{s:1,h:0,ow:2});P(c,m,k=>{k.moveTo(846,520);k.lineTo(854,508);k.lineTo(856,524);k.closePath()},'#f2a04a',{s:1,h:0,ow:2});
  if(m==='real'){c.strokeStyle=OL;c.lineWidth=2;c.lineCap='round';c.beginPath();c.arc(837,531,3,.2,Math.PI-.2);c.moveTo(851,531);c.arc(848,531,3,.2,Math.PI-.2);c.stroke();c.strokeStyle='#c9742a';c.lineWidth=3;[[868,526],[880,528],[892,532]].forEach(([x,y])=>{c.beginPath();c.moveTo(x,y);c.lineTo(x+3,y+9);c.stroke()})}
  // 커튼 주름
  if(m==='real'){c.strokeStyle='rgba(20,70,80,.45)';c.lineWidth=2;[[556,230,552,398],[574,230,562,398],[764,230,768,398],[746,230,758,398]].forEach(([a,b,d,e])=>{c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.stroke()})}
}
function radiator(c,m,x,y,sc,hot){c.save();c.translate(x,y);c.scale(sc,sc);const w=112,h=58;
  if(m==='line'){bl(c,[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2],[-w/2,-h/2]]);for(let i=0;i<6;i++)bl(c,[[-w/2+12+i*18,-h/2+7],[-w/2+12+i*18,h/2-7]],{w:1.4})}
  else{cel(c,k=>rr(k,-w/2,-h/2,w,h,10),hot?'#f26a4b':'#e88a6a',{s:5});for(let i=0;i<6;i++){c.fillStyle=hot?'#ffd27a':'#f7c2a4';c.beginPath();rr(c,-w/2+9+i*17,-h/2+8,9,h-16,4.5);c.fill();c.fillStyle='rgba(60,20,60,.25)';c.fillRect(-w/2+16+i*17,-h/2+10,2,h-20)}
    cel(c,k=>rr(k,-w/2+8,h/2-2,12,9,2),'#5a546e',{s:1,h:0,ow:2});cel(c,k=>rr(k,w/2-20,h/2-2,12,9,2),'#5a546e',{s:1,h:0,ow:2});cel(c,k=>k.arc(w/2+2,-h/2+14,7,0,7),'#ffd23f',{s:2,h:1,ow:2})}
  c.restore()}
/* ── 캐릭터 ── */
function sheep(c,x,y,s,ex,t,hop){c.save();c.translate(x,y);c.fillStyle='rgba(30,20,70,.26)';c.beginPath();el(c,0,2,64*s,9*s);c.fill();
  const br=1+Math.sin(t*2.2)*.014,shv=ex==='cold'?Math.sin(t*40)*1.5:0;c.translate(shv,-hop);c.scale(s,s*br);
  cel(c,k=>rr(k,-36,-40,18,40,7),'#4a4460',{s:3,h:2});cel(c,k=>rr(k,18,-40,18,40,7),'#4a4460',{s:3,h:2});
  cel(c,k=>blob(k,0,-88,62,50,11),ex==='cold'?'#e6eefc':'#fff6e8',{s:10,h:6});
  const arm=ex==='happy'?2.5:ex==='wow'?1.2:ex==='cold'?-.55:ex==='sad'?.1:.3;[[-50,1],[50,-1]].forEach(([ax,d])=>{c.save();c.translate(ax,-104);c.rotate(arm*d+(ex==='happy'?Math.sin(t*9)*.18*d:0));cel(c,k=>rr(k,-8,0,16,42,8),'#f2c9a0',{s:3,h:2});c.restore()});
  cel(c,k=>rr(k,-42,-136,84,20,10),'#e9596a',{s:3});cel(c,k=>rr(k,16,-130,20,44,8),'#e9596a',{s:3});
  [[-46,-.5],[46,.5]].forEach(([ex2,r])=>cel(c,k=>el(k,ex2,-170,16,9,r),'#f2c9a0',{s:2,h:1}));
  cel(c,k=>el(k,0,-166,42,38),ex==='cold'?'#e4c4b4':'#f6d2ac',{s:8,h:5});
  cel(c,k=>blob(k,0,-200,34,19,7),ex==='cold'?'#e6eefc':'#fff6e8',{s:5,h:4});
  const blink=(t%3.6)<.13;c.fillStyle=OL;c.strokeStyle=OL;c.lineWidth=3.5;c.lineCap='round';
  if(ex==='happy'){[-16,16].forEach(dx=>{c.beginPath();c.arc(dx,-168,8,Math.PI*1.1,Math.PI*1.9);c.stroke()})}
  else if(blink||ex==='sad'){[-16,16].forEach(dx=>{c.beginPath();c.moveTo(dx-7,-168+(ex==='sad'?-2:0));c.lineTo(dx+7,-168+(ex==='sad'?2*Math.sign(dx):0));c.stroke()})}
  else{const r=ex==='wow'?10:8;[-16,16].forEach(dx=>{c.beginPath();el(c,dx,-170,r*.82,r);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(dx-2.5,-173,2.8,0,7);c.fill();c.beginPath();c.arc(dx+2.5,-166,1.4,0,7);c.fill();c.fillStyle=OL})}
  c.fillStyle=ex==='cold'?'rgba(110,150,240,.55)':'rgba(255,120,130,.55)';[-28,28].forEach(dx=>{c.beginPath();el(c,dx,-155,9,5.5);c.fill()});
  c.fillStyle='#d9806a';c.beginPath();el(c,0,-158,5,3.5);c.fill();c.strokeStyle=OL;c.lineWidth=3;c.beginPath();
  if(ex==='happy'){c.fillStyle='#b8404e';c.arc(0,-151,11,.1,Math.PI-.1);c.closePath();c.fill();c.stroke()}
  else if(ex==='cold'){for(let i=0;i<=6;i++)c.lineTo(-12+i*4,-146+(i%2?3:-3));c.stroke()}
  else if(ex==='sad'){c.arc(0,-140,9,Math.PI*1.2,Math.PI*1.8);c.stroke()}
  else if(ex==='wow'){c.fillStyle='#b8404e';el(c,0,-146,6,8);c.fill();c.stroke()}
  else{c.arc(0,-152,8,.3,Math.PI-.3);c.stroke()}
  // 안경
  c.strokeStyle='#6a4a8a';c.lineWidth=2.5;[-16,16].forEach(dx=>{c.beginPath();c.arc(dx,-169,13,0,7);c.stroke()});c.beginPath();c.moveTo(-3,-169);c.lineTo(3,-169);c.stroke();
  c.restore();
  if(ex==='cold'){for(let i=0;i<3;i++){const p=((t*.5+i/3)%1);c.save();c.globalAlpha=(1-p)*.8;c.strokeStyle='#dfeaff';c.lineWidth=2.5;c.beginPath();c.arc(x+48+p*40,y-150*s-p*26,6+p*9,0,7);c.stroke();c.restore()}}}
function mole(c,x,y,s,ex,t,pull){c.save();c.translate(x,y);c.fillStyle='rgba(0,10,20,.35)';c.beginPath();el(c,0,2,48*s,8*s);c.fill();c.scale(s,s*(1+Math.sin(t*2.6+1)*.015));
  const hop=ex==='happy'?Math.abs(Math.sin(t*8))*10:0;c.translate(0,-hop);const F='#e8813f',F2='#f4a45e';
  c.save();c.translate(40,-52);c.rotate(.35+Math.sin(t*2.2)*.08);cel(c,k=>{k.moveTo(-6,40);k.quadraticCurveTo(46,30,40,-34);k.quadraticCurveTo(34,-74,-4,-60);k.quadraticCurveTo(22,-44,14,-10);k.quadraticCurveTo(8,18,-14,26);k.closePath()},F,{s:8,h:5});c.strokeStyle='#fff0d8';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(24,14);c.quadraticCurveTo(34,-18,22,-48);c.stroke();c.restore();
  cel(c,k=>rr(k,-26,-14,20,14,6),'#b8582a',{s:2,h:0});cel(c,k=>rr(k,8,-14,20,14,6),'#b8582a',{s:2,h:0});
  cel(c,k=>el(k,0,-50,36,42),F,{s:8,h:5});cel(c,k=>el(k,0,-44,22,28),'#fff0d8',{s:4,h:0,ow:0});cel(c,k=>rr(k,-30,-34,60,12,5),'#34407a',{s:2,h:1,ow:2});cel(c,k=>rr(k,8,-32,12,16,3),'#58c0cc',{s:1,h:1,ow:2});
  c.save();c.translate(-32,-64);c.rotate(pull?-1.9-pull*.5:.5+Math.sin(t*2)*.06);cel(c,k=>rr(k,-7,0,14,34,7),F,{s:3,h:2});cel(c,k=>el(k,0,36,9,8),'#fff0d8',{s:2,h:1});c.restore();
  c.save();c.translate(32,-64);c.rotate(ex==='happy'?-2.4:ex==='think'?-2.1:-.5);cel(c,k=>rr(k,-7,0,14,34,7),F,{s:3,h:2});cel(c,k=>el(k,0,36,9,8),'#fff0d8',{s:2,h:1});c.restore();
  [[-26,-1],[26,1]].forEach(([dx,d])=>cel(c,k=>{k.moveTo(dx-10,-122);k.lineTo(dx+d*6,-152);k.lineTo(dx+12,-124);k.closePath()},F,{s:2,h:1}));
  cel(c,k=>el(k,0,-102,36,31),F2,{s:7,h:5});cel(c,k=>el(k,0,-92,22,15),'#fff0d8',{s:3,h:0,ow:0});
  cel(c,k=>el(k,-4,-132,32,11,-.12),'#34407a',{s:4,h:3});cel(c,k=>k.arc(-2,-143,4,0,7),'#34407a',{s:1,h:1,ow:2});
  c.save();c.translate(30,-124);c.rotate(-.5);cel(c,k=>rr(k,-3,-20,6,30,2),'#ffcf3f',{s:1,h:1,ow:2});c.restore();
  const blink=((t+1.3)%4.1)<.13;c.fillStyle=OL;c.strokeStyle=OL;c.lineWidth=3;c.lineCap='round';
  if(ex==='happy'){[-14,14].forEach(d=>{c.beginPath();c.arc(d,-103,6,Math.PI*1.1,Math.PI*1.9);c.stroke()})}else if(blink){[-14,14].forEach(d=>{c.beginPath();c.moveTo(d-5,-104);c.lineTo(d+5,-104);c.stroke()})}
  else[-14,14].forEach(d=>{c.beginPath();el(c,d,-104,5,6.5);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(d-1.5,-106.5,2,0,7);c.fill();c.fillStyle=OL});
  cel(c,k=>el(k,0,-95,5,4),'#6a3a2a',{s:1,h:1,ow:0});c.beginPath();if(ex==='happy'){c.fillStyle='#b8404e';c.arc(0,-88,7,.1,Math.PI-.1);c.closePath();c.fill();c.stroke()}else if(ex==='think'){c.moveTo(-5,-86);c.lineTo(6,-88);c.stroke()}else{c.arc(0,-90,5,.3,Math.PI-.3);c.stroke()}
  c.fillStyle='rgba(255,120,130,.5)';[-24,24].forEach(d=>{c.beginPath();el(c,d,-95,6,4);c.fill()});c.restore()}
