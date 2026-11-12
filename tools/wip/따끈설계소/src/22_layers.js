/* ── 미리 그려 두는 층 ── */
let L={rl:[],rr:[]};
function grain(c,w,h,n,al){for(let i=0;i<n;i++){c.fillStyle=S()<.5?`rgba(0,0,30,${al})`:`rgba(255,255,255,${al})`;c.fillRect(S()*w,S()*h,SR(1,2.5),SR(1,2.5))}}
function mkPaper(play){let o,c;
  // 2 도면 종이
  o=mk(W+40,620);c=o.g;c.translate(20,0);c.save();c.beginPath();c.rect(PX0,0,PX1-PX0,598);c.clip();c.fillStyle=BL;c.fillRect(-20,0,W+40,600);
  let rg=c.createRadialGradient(120,40,40,300,200,900);rg.addColorStop(0,'rgba(120,170,235,.55)');rg.addColorStop(.5,'rgba(60,110,190,.12)');rg.addColorStop(1,'rgba(6,20,56,.42)');c.fillStyle=rg;c.fillRect(-20,0,W+40,600);
  c.save();c.globalCompositeOperation='screen';let wp=c.createRadialGradient(150,70,20,230,170,560);wp.addColorStop(0,'rgba(255,214,140,.5)');wp.addColorStop(.55,'rgba(255,200,120,.12)');wp.addColorStop(1,'rgba(255,200,120,0)');c.fillStyle=wp;c.fillRect(-20,0,W+40,600);c.restore();
  for(let x=-16;x<W+20;x+=16){c.strokeStyle=(x%80)?'rgba(255,255,255,.085)':'rgba(255,255,255,.2)';c.lineWidth=1;c.beginPath();c.moveTo(x,0);c.lineTo(x,600);c.stroke()}
  for(let y=0;y<600;y+=16){c.strokeStyle=(y%80)?'rgba(255,255,255,.085)':'rgba(255,255,255,.2)';c.beginPath();c.moveTo(-20,y);c.lineTo(W+20,y);c.stroke()}
  // 접힌 자국
  [[430,0,446,600],[-20,300,W+20,292]].forEach(([a,b,d,e])=>{c.strokeStyle='rgba(255,255,255,.10)';c.lineWidth=3;c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.stroke();c.strokeStyle='rgba(0,10,50,.18)';c.beginPath();c.moveTo(a+3,b+2);c.lineTo(d+3,e+2);c.stroke()});
  if(play){
  // 먼 산·나무(연한 선 = 공기 원근)
  bl(c,[[1052,440],[1100,372],[1140,410],[1196,340],[1250,400],[1300,360]],{a:.28,w:1.5,dash:[7,5]});bl(c,[[1052,470],[1120,430],[1180,452],[1260,420],[1300,440]],{a:.4,w:1.5});
  const pine=(x,y,s,a)=>{for(let i=0;i<3;i++)bl(c,[[x-s*(1-i*.22),y-i*s*.7],[x,y-s*1.1-i*s*.7],[x+s*(1-i*.22),y-i*s*.7],[x-s*(1-i*.22),y-i*s*.7]],{a,w:1.6});bl(c,[[x,y],[x,y+s*.5]],{a,w:2})};
  pine(1110,520,26,.55);pine(1236,512,34,.7);pine(1176,538,20,.45);
  bl(c,[[1052,590],[1100,572],[1150,580],[1210,564],[1300,578]],{w:2});for(let x=1060;x<1290;x+=18)bl(c,[[x,596],[x-8,606]],{a:.4,w:1});
  // 울타리
  for(let x=1070;x<1280;x+=34){bl(c,[[x,548],[x,584]],{a:.6,w:1.5})}bl(c,[[1060,558],[1290,556]],{a:.6,w:1.5});
  // 집 구조: 벽(단열 지그재그)·천장 슬래브·바닥 슬래브·지붕
  bl(c,[[RX-22,RY-22],[RX+RW+22,RY-22]],{w:3});bl(c,[[RX-22,RB+30],[RX+RW+22,RB+30]],{w:3});bl(c,[[RX,RY],[RX+RW,RY],[RX+RW,RB],[RX,RB],[RX,RY]],{w:3});
  bl(c,[[RX-22,RY-22],[RX-22,RB+30]],{w:3});bl(c,[[RX+RW+22,RY-22],[RX+RW+22,RB+30]],{w:3});
  zig(c,RX-20,RY,18,RH,true);zig(c,RX+RW+2,RY,18,RH,true);hatch(c,RX,RY-20,RW,18,10,{a:.4});hatch(c,RX,RB+2,RW,26,12,{a:.5});
  bl(c,[[-20,RY-22],[RX-22,RY-22]],{w:3});bl(c,[[-20,RB+30],[RX-22,RB+30]],{w:3});
  bl(c,[[1262,222],[1110,166],[1052,148]],{w:3});bl(c,[[1262,206],[1128,158]],{w:1.5});for(let i=0;i<4;i++)bl(c,[[1140+i*34,178+i*12],[1150+i*34,160+i*12]],{w:1.2,a:.6});
  dim(c,RX,RB+17,RX+RW,RB+17,'7800');dim(c,1066,RY,1066,RB,'2600');
  
  // 다락 서까래와 위층 창(집 단면이 더 읽히게)
  for(let i=0;i<6;i++)bl(c,[[300+i*96,RY-22],[300+i*96+70,RY-70-i*2]],{w:1.2,a:.35});bl(c,[[RX-22,RY-74],[1010,RY-74]],{w:1.2,a:.35,dash:[8,6]});
  // 왼쪽 복도(의뢰인이 기다리는 곳): 계단과 문 선 그림
  bl(c,[[PX0,RB],[RX-22,RB]],{w:2});for(let i=0;i<6;i++){bl(c,[[40+i*30,RB-i*26],[40+i*30,RB-(i+1)*26],[70+i*30,RB-(i+1)*26]],{w:1.4,a:.5})}bl(c,[[40,RB],[220,RB-156]],{w:1.2,a:.35,dash:[6,5]});
  bl(c,[[150,RY+40],[214,RY+40],[214,RB],[150,RB],[150,RY+40]],{w:1.4,a:.45});c.save();c.globalAlpha=.45;c.strokeStyle=WH;c.lineWidth=1.4;c.beginPath();c.arc(204,RY+220,4,0,7);c.stroke();c.restore();hatch(c,PX0,RB+2,RX-22-PX0,26,12,{a:.4});
  }
  // 종이 아래 가장자리
  const eg=c.createLinearGradient(0,584,0,598);eg.addColorStop(0,'rgba(255,255,255,0)');eg.addColorStop(1,'rgba(255,255,255,.22)');c.fillStyle=eg;c.fillRect(-20,584,W+40,14);grain(c,W+20,600,6000,.03);c.restore();
  // 종이 두께·옆 가장자리
  c.fillStyle='#dbe8fa';c.fillRect(PX0,596,PX1-PX0,3);c.fillStyle='rgba(255,255,255,.5)';c.fillRect(PX0,0,2,598);c.fillRect(PX1-2,0,2,598);
  // 말린 오른쪽 아래 모서리
  c.save();c.globalCompositeOperation='destination-out';c.beginPath();c.moveTo(PX1-86,600);c.lineTo(PX1+2,600);c.lineTo(PX1+2,516);c.closePath();c.fill();c.restore();
  c.fillStyle='rgba(0,8,30,.35)';c.beginPath();c.moveTo(PX1-92,600);c.lineTo(PX1-4,512);c.lineTo(PX1-58,522);c.closePath();c.fill();
  const cg=c.createLinearGradient(PX1-86,598,PX1-40,540);cg.addColorStop(0,'#c9daf2');cg.addColorStop(1,'#f4f8ff');c.fillStyle=cg;c.beginPath();c.moveTo(PX1-86,598);c.lineTo(PX1,516);c.quadraticCurveTo(PX1-50,520,PX1-66,540);c.closePath();c.fill();
  // 마스킹테이프
  const tape=(x,y,w,h,r,col)=>{c.save();c.translate(x,y);c.rotate(r);c.fillStyle='rgba(0,8,30,.25)';c.fillRect(-w/2+2,-h/2+3,w,h);c.fillStyle=col;c.fillRect(-w/2,-h/2,w,h);c.fillStyle='rgba(255,255,255,.35)';for(let i=-w/2+6;i<w/2;i+=12)c.fillRect(i,-h/2,5,h);c.restore()};
  tape(PX0+8,586,92,26,-.7,'rgba(255,196,84,.92)');tape(700,598,110,24,.04,'rgba(88,196,186,.9)');
  return o.c}
function buildLayers(){let o,c;
  // 1 책상(커팅 매트)
  o=mk(W+40,H+40);c=o.g;const q=c.createLinearGradient(0,0,0,H);q.addColorStop(0,'#123c44');q.addColorStop(1,'#0b2a33');c.fillStyle=q;c.fillRect(0,0,W+40,H+40);
  c.strokeStyle='rgba(190,240,230,.10)';c.lineWidth=1;for(let x=0;x<W+40;x+=20){c.beginPath();c.moveTo(x,560);c.lineTo(x,H+40);c.stroke()}for(let y=560;y<H+40;y+=20){c.beginPath();c.moveTo(0,y);c.lineTo(W+40,y);c.stroke()}
  c.strokeStyle='rgba(190,240,230,.22)';for(let x=0;x<W+40;x+=100){c.beginPath();c.moveTo(x,560);c.lineTo(x,H+40);c.stroke()}
  for(let x=20;x<W+40;x+=20){c.fillStyle='rgba(190,240,230,.35)';c.fillRect(x,H+12,1.5,x%100==0?12:6)}grain(c,W+40,H+40,2500,.03);L.desk=o.c;
  L.paper=mkPaper(true);L.paperMap=mkPaper(false);
  for(let r=0;r<5;r++){o=mk(RW,RH);c=o.g;c.translate(-RX,-RY);roomLine(c,r,'line');L.rl[r]=o.c;o=mk(RW,RH);c=o.g;c.translate(-RX,-RY);roomReal(c,r);L.rr[r]=o.c}
  o=mk(RW,RH);c=o.g;c.translate(-RX,-RY);roomLine(c,3,'lineT');L.rlT=o.c;
  // 5 흐린 앞 도구(연필·컵·스탠드 갓)
  o=mk(W,H);c=o.g;
  c.save();c.translate(-150,770);c.rotate(-.36);cel(c,k=>rr(k,0,-26,300,52,6),'#ffcf3f',{s:9,h:6});cel(c,k=>rr(k,-46,-26,50,52,10),'#f28a9a',{s:6});cel(c,k=>rr(k,-6,-27,22,54,3),'#c9ccd8',{s:4});cel(c,k=>{k.moveTo(300,-26);k.lineTo(366,0);k.lineTo(300,26);k.closePath()},'#f1d2a4',{s:6});c.restore();
  cel(c,k=>rr(k,1168,612,150,150,22),'#e9596a',{s:12,h:8});cel(c,k=>el(k,1243,614,75,20),'#5a2f2a',{s:4,h:0});
  c.save();c.translate(-6,-10);c.rotate(-.16);cel(c,k=>rr(k,60,-60,26,70,6),'#3a4466',{s:5,h:3});cel(c,k=>{k.moveTo(34,0);k.lineTo(112,0);k.lineTo(196,96);k.lineTo(-44,96);k.closePath()},'#1f8a80',{s:12,h:8});cel(c,k=>el(k,76,98,120,20),'#fff3b0',{s:3,h:0});c.fillStyle='#ffe08a';c.beginPath();el(c,76,100,70,10);c.fill();c.restore();const lgw=c.createRadialGradient(80,96,10,110,150,260);lgw.addColorStop(0,'rgba(255,232,150,.5)');lgw.addColorStop(1,'rgba(255,232,150,0)');c.fillStyle=lgw;c.fillRect(0,60,400,300);
  const b=mk(W/4,H/4);b.g.imageSmoothingEnabled=true;b.g.drawImage(o.c,0,0,W/4,H/4);const b2=mk(W,H);b2.g.imageSmoothingEnabled=true;b2.g.drawImage(b.c,0,0,W/4*DPR,H/4*DPR,0,0,W,H);b2.g.globalAlpha=.5;b2.g.drawImage(o.c,0,0,W,H);L.fore=LOW?o.c:b2.c;
  // 6 스탠드 빛·비네트
  o=mk(W,H);c=o.g;let v=c.createRadialGradient(180,120,60,640,360,820);v.addColorStop(0,'rgba(255,226,150,.26)');v.addColorStop(.45,'rgba(255,226,150,0)');v.addColorStop(1,'rgba(4,8,40,.5)');c.fillStyle=v;c.fillRect(0,0,W,H);L.vig=o.c;
}
