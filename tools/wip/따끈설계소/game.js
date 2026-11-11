/* 스타일 카드 — 따끈 설계소
세계:       겨울 산골 마을 집을 고쳐 주는 설계 사무소의 제도 책상(5-2 과학 3. 열과 우리 생활: 청사진에 부품을 놓고 불을 켜면 열이 움직이는 모습이 보인다)
계열·스타일: 그래픽·공예 G2 청사진(선 그림이 정답이면 실물로 솟는다)
6축:        모양 각지고 기하학(선 도면) + 실물은 둥근 가구 / 렌더링 G2 / 팔레트 청사진 파랑·흰 선 + 실물 살구·귤색 / 빛 책상 스탠드(왼쪽 위 따뜻한 빛, 도면 자체는 빛 없음) / 시점 단면도(책상 위 도면을 정면으로) / UI 청사진 선 판
최근 3개와 다른 축: 코스터 v4 6/6 · 블록 항구 6/6 · 골목 민원 6/6
같은 과목 최근 3개 계열: H·H·T(열기구·울림 밴드·관제사) → 이번 계열 G(겹침 없음, 최근 3개 P·B·P와도 겹침 없음)
과목 조건(2장): 보이지 않는 열을 보이게 → 공기 온도 색 칸 + 흐름 화살, 온도계 두 개의 숫자
탐험 칸 여부: 아니오(G2는 저장소에서 처음 쓰는 스타일)

아트 바이블 — 따끈 설계소
1. 장르·시점·카메라: 설계·실험 퍼즐 · 제도 책상 위 단면도를 정면으로 · 카메라 숨쉬기(책상·도면·앞 도구가 다른 시차)
2. 렌더링 방식·기준작: G2 청사진 · 공학 도면의 선 + 정답이면 색이 차오르는 실물(셀음영)
3. 빛: 화면 밖 왼쪽 위 책상 스탠드. 도면 선은 빛 없음, 실물과 책상 위 물건만 왼쪽 위 따뜻한 빛·오른쪽 아래 남보라 그늘
4. 외곽선: 도면은 흰 선 2px(보조선 점선 1px), 실물과 캐릭터는 남색 #2b2350 3px
5. 음영: 실물은 바탕·그늘·빛 3단 + 바닥 그림자, 도면 선 그림은 바닥선·빗금으로 땅에 붙임
6. 팔레트: 주조 청사진 파랑 #1f4e8c·흰 선 #eaf3ff, 강조 귤색 #ffb23c·난방 빨강 #f26a4b, 실물 살구·호두·청록, 그늘 남보라
7. 질감·디테일: 16px 격자·종이 알갱이·접힌 자국·치수 화살표·빗금, 책상은 커팅 매트 눈금
8. 깊이(이웃 방은 일부러 눌러 흐리게, 지금 방이 초점): 커팅 매트 → 도면 종이 → 먼 산 선(연하게) → 집 구조 선 → 실물 방 → 주민·부품 → 책상 위 부품함·다람쥐 → 흐린 앞 도구(연필·컵·스탠드 갓)
9. 글꼴·UI 재질: 제목 Sunflower Bold, 본문 Sunflower Medium, 손메모 Nanum Pen Script, 계기 숫자 Orbit(HUD 20px 이상, 도면 장식 치수 15px는 예외) / 청사진 선 판(남색 판 + 흰 선 + 모서리 눈금)
10. 캐릭터: 의뢰인 양 할머니 2등신·화면 높이 1/4(표정 추움·보통·기쁨·아쉬움·놀람), 다람쥐 설계사 화면 높이 1/5(레버 당기기·기쁨·갸웃, 말하지 않음), 숨쉬기·깜빡임

화면 틀 — 따끈 설계소
타이틀:        제도 펜이 빈 도면에 집과 로고를 선으로 그려 나가고, 스탠드가 켜지며 색이 차오름
스테이지 선택:  마을 단면도 — 집의 방이 하나씩 실물로 열림(선 그림 방은 아직)
문제 제시:      도면에 마스킹테이프로 붙인 트레이싱지 의뢰 쪽지(글만. 의뢰인은 방 안에서 직접 반응)
답 입력:        부품함의 부품·꼬리표를 도면의 점선 자리에 끌어 놓고 레버로 불 켜기
결과:          카메라가 물러나며 선 그림 집 전체가 방마다 차례로 색이 차오름(점수판·도감을 옆에 붙이지 않고, 기록은 도면 표제란에 적힘) → 다음 장 오답 노트(청사진 선 판)
*/
'use strict';
const W=1280,H=720,LOW=/[?&]low=1/.test(location.search);
const stage=document.getElementById('game'),cv=document.getElementById('cv'),g=cv.getContext('2d');
let DPR=LOW?1:Math.min(2,window.devicePixelRatio||1);
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);stage.style.width=W*s+'px';stage.style.height=H*s+'px'}
addEventListener('resize',fit);fit();cv.width=W*DPR;cv.height=H*DPR;
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w*DPR;c.height=h*DPR;const x=c.getContext('2d');x.scale(DPR,DPR);return{c,g:x}};
let seed=11;const S=()=>{seed=(seed*16807)%2147483647;return seed/2147483647},SR=(a,b)=>a+S()*(b-a);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,back=t=>{const c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const hex=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]};
const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const LX=-.62,LY=-.78,OL='#2b2350',WH='#eaf3ff',BL='#1f4e8c',NAVY='#0d2858',AMB='#ffb23c';
const SH=c=>mix(mix(c,'#1c1030',.28),'#5a3d8a',.18),HL=c=>mix(mix(c,'#ffffff',.32),'#ffe7a0',.25);
function cel(c,shape,base,o={}){const s=o.s??6,h=o.h??4,ow=o.ow??3;c.save();
  if(ow>0){c.beginPath();shape(c);c.lineWidth=ow*2;c.strokeStyle=o.ol||OL;c.lineJoin='round';c.stroke()}
  c.beginPath();shape(c);c.clip();c.fillStyle=o.sh||SH(base);c.fill();
  c.save();c.translate(LX*s,LY*s);c.beginPath();shape(c);c.restore();c.fillStyle=base;c.fill();
  if(h>0){c.beginPath();shape(c);c.save();c.translate(-LX*h,-LY*h);shape(c);c.restore();c.globalAlpha=.8;c.fillStyle=o.hl||HL(base);c.fill('evenodd');c.globalAlpha=1}
  c.restore()}
const rr=(c,x,y,w,h,r)=>c.roundRect(x,y,w,h,r),el=(c,x,y,a,b,rot)=>c.ellipse(x,y,a,b,rot||0,0,Math.PI*2);
function blob(c,cx,cy,rx,ry,n){for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,x=cx+Math.cos(a)*rx,y=cy+Math.sin(a)*ry;if(!i)c.moveTo(x,y);else{const m=(i-.5)/n*Math.PI*2;c.quadraticCurveTo(cx+Math.cos(m)*rx*1.24,cy+Math.sin(m)*ry*1.24,x,y)}}c.closePath()}
// 도면 선(손으로 그은 맛: 가운데가 살짝 휘고 끝이 넘침)
function bl(c,pts,o={}){c.save();c.strokeStyle=o.col||WH;c.lineWidth=o.w||2;c.lineCap='round';c.lineJoin='round';if(o.dash)c.setLineDash(o.dash);c.globalAlpha=o.a??1;c.beginPath();
  for(let i=0;i<pts.length-1;i++){const[x1,y1]=pts[i],[x2,y2]=pts[i+1],dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ov=o.over??2,k=(S()-.5)*Math.min(2,L*.012);
    c.moveTo(x1-dx/L*ov,y1-dy/L*ov);c.quadraticCurveTo((x1+x2)/2-dy/L*k,(y1+y2)/2+dx/L*k,x2+dx/L*ov,y2+dy/L*ov)}c.stroke();c.restore()}
function hatch(c,x,y,w,h,step,o={}){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.strokeStyle=o.col||WH;c.globalAlpha=o.a??.55;c.lineWidth=1.2;c.beginPath();for(let i=-h;i<w+h;i+=step){c.moveTo(x+i,y+h);c.lineTo(x+i+h,y)}c.stroke();c.restore()}
function zig(c,x,y,w,h,vert){c.save();c.strokeStyle=WH;c.globalAlpha=.6;c.lineWidth=1.3;c.beginPath();if(vert){for(let i=0,yy=y;yy<y+h;yy+=9,i++){c.lineTo(x+(i%2?w-3:3),yy)}}else{for(let i=0,xx=x;xx<x+w;xx+=9,i++){c.lineTo(xx,y+(i%2?h-3:3))}}c.stroke();c.restore()}
function T(c,s,x,y,sz,font,col,al,o={}){c.save();c.font=sz+'px '+font+',DoHyeon,sans-serif';c.textAlign=al||'left';c.textBaseline='middle';c.lineJoin='round';if(o.st){c.strokeStyle=o.st;c.lineWidth=o.sw||sz*.18;c.strokeText(s,x,y)}c.fillStyle=col;c.fillText(s,x,y);c.restore()}
function arrowHead(c,x,y,a,sz,col){c.save();c.translate(x,y);c.rotate(a);c.fillStyle=col;c.beginPath();c.moveTo(sz,0);c.lineTo(-sz*.7,sz*.62);c.lineTo(-sz*.7,-sz*.62);c.closePath();c.fill();c.restore()}
function dim(c,x1,y1,x2,y2,label){bl(c,[[x1,y1],[x2,y2]],{w:1.2,a:.8,over:0});arrowHead(c,x1,y1,Math.atan2(y1-y2,x1-x2),5,WH);arrowHead(c,x2,y2,Math.atan2(y2-y1,x2-x1),5,WH);
  const mx=(x1+x2)/2,my=(y1+y2)/2;c.font='15px Orbit';const w=c.measureText(label).width+14;c.fillStyle=BL;c.fillRect(mx-w/2,my-10,w,20);T(c,label,mx,my+1,15,'Orbit',WH,'center')}
function panel(c,x,y,w,h,o={}){c.save();c.fillStyle=o.fill||'rgba(13,40,88,.92)';c.fillRect(x,y,w,h);c.strokeStyle=o.col||WH;c.lineWidth=2;c.strokeRect(x,y,w,h);c.lineWidth=1;c.globalAlpha=.5;c.strokeRect(x+5,y+5,w-10,h-10);c.globalAlpha=1;
  c.lineWidth=3;[[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]].forEach(([a,b,sx,sy])=>{c.beginPath();c.moveTo(a+sx*14,b-sy*4);c.lineTo(a-sx*4,b-sy*4);c.lineTo(a-sx*4,b+sy*14);c.stroke()});c.restore()}
/* ── 방 자리 ── */
const RX=250,RY=170,RW=780,RH=390,FY=520,RB=RY+RH;
const SLOT={A:{x:292,y:204,w:124,h:66,name:'위쪽'},B:{x:292,y:454,w:124,h:66,name:'아래쪽'}};
const HOME={x:330,y:646},PX0=14,PX1=1266;
/* ── 가구(선·실물 두 가지로 그린다) ── */
function P(c,mode,shape,col,o){if(mode==='line'||mode==='lineT'){c.save();c.beginPath();shape(c);if(mode==='line'){c.fillStyle='#255a9f';c.fill()}c.fillStyle=mode==='line'?'rgba(234,243,255,.06)':'rgba(20,50,110,.16)';c.fill();c.strokeStyle=WH;c.lineWidth=2;c.lineJoin='round';c.stroke();c.restore()}else cel(c,shape,col,o)}
function furniture(c,m){
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
/* ── 미리 그려 두는 층 ── */
let L={};
function grain(c,w,h,n,al){for(let i=0;i<n;i++){c.fillStyle=S()<.5?`rgba(0,0,30,${al})`:`rgba(255,255,255,${al})`;c.fillRect(S()*w,S()*h,SR(1,2.5),SR(1,2.5))}}
function buildLayers(){
  // 1 책상(커팅 매트)
  let o=mk(W+40,H+40),c=o.g;const q=c.createLinearGradient(0,0,0,H);q.addColorStop(0,'#123c44');q.addColorStop(1,'#0b2a33');c.fillStyle=q;c.fillRect(0,0,W+40,H+40);
  c.strokeStyle='rgba(190,240,230,.10)';c.lineWidth=1;for(let x=0;x<W+40;x+=20){c.beginPath();c.moveTo(x,560);c.lineTo(x,H+40);c.stroke()}for(let y=560;y<H+40;y+=20){c.beginPath();c.moveTo(0,y);c.lineTo(W+40,y);c.stroke()}
  c.strokeStyle='rgba(190,240,230,.22)';for(let x=0;x<W+40;x+=100){c.beginPath();c.moveTo(x,560);c.lineTo(x,H+40);c.stroke()}
  for(let x=20;x<W+40;x+=20){c.fillStyle='rgba(190,240,230,.35)';c.fillRect(x,H+12,1.5,x%100==0?12:6)}grain(c,W+40,H+40,2500,.03);L.desk=o.c;
  // 2 도면 종이
  o=mk(W+40,620);c=o.g;c.translate(20,0);c.save();c.beginPath();c.rect(PX0,0,PX1-PX0,598);c.clip();c.fillStyle=BL;c.fillRect(-20,0,W+40,600);
  let rg=c.createRadialGradient(120,40,40,300,200,900);rg.addColorStop(0,'rgba(120,170,235,.55)');rg.addColorStop(.5,'rgba(60,110,190,.12)');rg.addColorStop(1,'rgba(6,20,56,.42)');c.fillStyle=rg;c.fillRect(-20,0,W+40,600);
  c.save();c.globalCompositeOperation='screen';let wp=c.createRadialGradient(150,70,20,230,170,560);wp.addColorStop(0,'rgba(255,214,140,.5)');wp.addColorStop(.55,'rgba(255,200,120,.12)');wp.addColorStop(1,'rgba(255,200,120,0)');c.fillStyle=wp;c.fillRect(-20,0,W+40,600);c.restore();
  for(let x=-16;x<W+20;x+=16){c.strokeStyle=(x%80)?'rgba(255,255,255,.085)':'rgba(255,255,255,.2)';c.lineWidth=1;c.beginPath();c.moveTo(x,0);c.lineTo(x,600);c.stroke()}
  for(let y=0;y<600;y+=16){c.strokeStyle=(y%80)?'rgba(255,255,255,.085)':'rgba(255,255,255,.2)';c.beginPath();c.moveTo(-20,y);c.lineTo(W+20,y);c.stroke()}
  // 접힌 자국
  [[430,0,446,600],[-20,300,W+20,292]].forEach(([a,b,d,e])=>{c.strokeStyle='rgba(255,255,255,.10)';c.lineWidth=3;c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.stroke();c.strokeStyle='rgba(0,10,50,.18)';c.beginPath();c.moveTo(a+3,b+2);c.lineTo(d+3,e+2);c.stroke()});
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
  dim(c,RX,RB+17,RX+RW,RB+17,'거실 7800');dim(c,1066,RY,1066,RB,'2600');
  T(c,'단면 A–A′',RX+8,RY-36,15,'Orbit','rgba(234,243,255,.75)');
  // 왼쪽 이웃 방(이미 완성한 부엌 = 실물)
  c.save();c.beginPath();c.rect(-20,RY,RX-22+20,RH);c.clip();c.fillStyle='rgba(8,20,60,.5)';c.fillRect(-14,RY+8,RX,RH);
  c.fillStyle='#f3cfa0';c.fillRect(-20,RY,RX,RH);c.fillStyle='#e9b98a';for(let y=RY+10;y<FY;y+=28)for(let x=-10+(y%56?14:0);x<RX;x+=28){c.beginPath();c.arc(x,y,3,0,7);c.fill()}
  c.fillStyle='#8fc7c2';c.fillRect(-20,400,RX,120);c.fillStyle='#b9743c';c.fillRect(-20,FY,RX,40);c.fillStyle='rgba(60,20,70,.25)';for(let x=0;x<RX;x+=44)c.fillRect(x,FY,2,40);
  cel(c,k=>rr(k,20,430,170,92,8),'#f4efe6');cel(c,k=>rr(k,14,418,182,16,5),'#6a4630');cel(c,k=>rr(k,60,452,90,60,6),'#3d3a55');
  c.fillStyle='#d98a4a';c.fillRect(70,462,70,40);c.fillStyle='#f2c98a';c.beginPath();c.moveTo(82,500);c.lineTo(96,470);c.lineTo(106,490);c.lineTo(116,466);c.lineTo(130,500);c.fill();
  cel(c,k=>rr(k,70,384,76,36,10),'#e9596a');cel(c,k=>rr(k,60,378,96,10,5),'#c23f55');
  cel(c,k=>rr(k,-6,250,220,12,4),'#6a4630');[[30,'#58a8dc'],[80,'#ffcf5e'],[130,'#4fae78'],[178,'#f28a6a']].forEach(([x,col])=>cel(c,k=>rr(k,x-14,220,28,30,6),col,{s:3,h:2}));
  c.fillStyle='rgba(60,110,120,.35)';for(let x=6;x<RX;x+=30)c.fillRect(x,400,2,120);for(let y=400;y<520;y+=30)c.fillRect(-20,y,RX,2);[[40,300,'#6a6f8a'],[96,306,'#8a5a3c'],[150,300,'#6a6f8a']].forEach(([x,y,col],i)=>{c.strokeStyle=OL;c.lineWidth=3;c.beginPath();c.moveTo(x,262);c.lineTo(x,y-16);c.stroke();cel(c,k=>k.arc(x,y,17+i%2*3,0,7),col,{s:4,h:3})});cel(c,k=>rr(k,150,470,36,50,6),'#58a8dc',{s:3,h:2});cel(c,k=>el(k,168,468,22,7),'#3d7fb0',{s:2,h:0});
  const wl=c.createRadialGradient(100,470,10,100,470,220);wl.addColorStop(0,'rgba(255,200,110,.3)');wl.addColorStop(1,'rgba(255,200,110,0)');c.fillStyle=wl;c.fillRect(-20,RY,RX,RH);
  const sd=c.createLinearGradient(RX-120,0,RX-22,0);sd.addColorStop(0,'rgba(50,20,90,0)');sd.addColorStop(1,'rgba(50,20,90,.35)');c.fillStyle=sd;c.fillRect(-20,RY,RX,RH);c.fillStyle='rgba(24,44,110,.3)';c.fillRect(-20,RY,RX,RH);c.restore();
  c.fillStyle='rgba(13,40,88,.85)';c.fillRect(20,RY-50,122,28);T(c,'부엌 · 완성',28,RY-35,20,'SunB','#ffd66b');
  // 다락 서까래와 위층 창(집 단면이 더 읽히게)
  for(let i=0;i<6;i++)bl(c,[[300+i*96,RY-22],[300+i*96+70,RY-70-i*2]],{w:1.2,a:.35});bl(c,[[RX-22,RY-74],[1010,RY-74]],{w:1.2,a:.35,dash:[8,6]});
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
  L.paper=o.c;
  // 3 방(선) / 4 방(실물)
  o=mk(W,H);c=o.g;c.fillStyle='rgba(234,243,255,.035)';c.fillRect(RX,RY,RW,RH);bl(c,[[RX,FY],[RX+RW,FY]],{w:1.5,dash:[9,6]});for(let x=RX+30;x<RX+RW;x+=60)bl(c,[[x,FY],[x-16,RB]],{w:1,a:.35});furniture(c,'line');L.roomLine=o.c;
  o=mk(W,H);c=o.g;bl(c,[[RX,FY],[RX+RW,FY]],{w:1.5,dash:[9,6]});furniture(c,'lineT');L.roomLineT=o.c;
  o=mk(W,H);c=o.g;c.save();c.beginPath();c.rect(RX,RY,RW,RH);c.clip();c.fillStyle='#f6dfc0';c.fillRect(RX,RY,RW,RH);
  c.fillStyle='#efcfa6';for(let y=RY+14;y<430;y+=30)for(let x=RX+(Math.round((y-RY)/30)%2?16:0);x<RX+RW;x+=32){c.beginPath();c.moveTo(x,y-6);c.lineTo(x+5,y);c.lineTo(x,y+6);c.lineTo(x-5,y);c.fill()}
  c.fillStyle='#d9a877';c.fillRect(RX,430,RW,90);c.fillStyle='#c48f5e';for(let x=RX;x<RX+RW;x+=52)c.fillRect(x,436,3,84);c.fillStyle='#8a5a3c';c.fillRect(RX,426,RW,7);
  const fg=c.createLinearGradient(0,FY,0,RB);fg.addColorStop(0,'#c98a52');fg.addColorStop(1,'#a8693a');c.fillStyle=fg;c.fillRect(RX,FY,RW,40);c.fillStyle='rgba(70,30,60,.3)';for(let x=RX+20;x<RX+RW;x+=64){c.beginPath();c.moveTo(x,FY);c.lineTo(x-14,RB);c.lineTo(x-11,RB);c.lineTo(x+3,FY);c.fill()}c.fillStyle='rgba(255,240,200,.35)';c.fillRect(RX,FY,RW,3);c.fillStyle='#8a5a3c';c.fillRect(RX,FY-9,RW,9);c.fillStyle='rgba(190,215,255,.33)';c.beginPath();c.moveTo(566,FY);c.lineTo(754,FY);c.lineTo(700,RB);c.lineTo(470,RB);c.fill();c.beginPath();c.moveTo(566,406);c.lineTo(754,406);c.lineTo(754,FY-9);c.lineTo(566,FY-9);c.fill();
  // 빛(왼쪽 위 따뜻함)과 그늘(오른쪽 아래 남보라)
  let hg=c.createRadialGradient(354,480,10,354,470,240);hg.addColorStop(0,'rgba(255,150,90,.42)');hg.addColorStop(1,'rgba(255,150,90,0)');c.fillStyle=hg;c.fillRect(RX,RY,RW,RH);
  let lg2=c.createRadialGradient(RX+60,RY+20,20,RX+200,RY+120,620);lg2.addColorStop(0,'rgba(255,236,170,.5)');lg2.addColorStop(1,'rgba(255,236,170,0)');c.fillStyle=lg2;c.fillRect(RX,RY,RW,RH);
  let sg=c.createLinearGradient(RX+RW-240,RY,RX+RW,RB);sg.addColorStop(0,'rgba(70,40,120,0)');sg.addColorStop(1,'rgba(70,40,120,.28)');c.fillStyle=sg;c.fillRect(RX,RY,RW,RH);
  c.fillStyle='rgba(60,30,90,.22)';[[664,536,250],[950,546,60]].forEach(([x,y,w])=>{c.beginPath();el(c,x+w/2+10,y+4,w/2,7);c.fill()});
  furniture(c,'real');
  let lc=c.createLinearGradient(0,252,0,520);lc.addColorStop(0,'rgba(255,240,170,.18)');lc.addColorStop(1,'rgba(255,240,170,0)');c.fillStyle=lc;c.beginPath();c.moveTo(830,256);c.lineTo(890,256);c.lineTo(990,520);c.lineTo(730,520);c.fill();
  c.restore();L.roomReal=o.c;
  // 5 흐린 앞 도구(연필·컵·스탠드 갓)
  o=mk(W,H);c=o.g;
  c.save();c.translate(-150,770);c.rotate(-.36);cel(c,k=>rr(k,0,-26,300,52,6),'#ffcf3f',{s:9,h:6});cel(c,k=>rr(k,-46,-26,50,52,10),'#f28a9a',{s:6});cel(c,k=>rr(k,-6,-27,22,54,3),'#c9ccd8',{s:4});cel(c,k=>{k.moveTo(300,-26);k.lineTo(366,0);k.lineTo(300,26);k.closePath()},'#f1d2a4',{s:6});c.restore();
  cel(c,k=>rr(k,1168,612,150,150,22),'#e9596a',{s:12,h:8});cel(c,k=>el(k,1243,614,75,20),'#5a2f2a',{s:4,h:0});
  c.save();c.translate(-6,-10);c.rotate(-.16);cel(c,k=>rr(k,60,-60,26,70,6),'#3a4466',{s:5,h:3});cel(c,k=>{k.moveTo(34,0);k.lineTo(112,0);k.lineTo(196,96);k.lineTo(-44,96);k.closePath()},'#1f8a80',{s:12,h:8});cel(c,k=>el(k,76,98,120,20),'#fff3b0',{s:3,h:0});c.fillStyle='#ffe08a';c.beginPath();el(c,76,100,70,10);c.fill();c.restore();const lgw=c.createRadialGradient(80,96,10,110,150,260);lgw.addColorStop(0,'rgba(255,232,150,.5)');lgw.addColorStop(1,'rgba(255,232,150,0)');c.fillStyle=lgw;c.fillRect(0,60,400,300);
  const b=mk(W/4,H/4);b.g.imageSmoothingEnabled=true;b.g.drawImage(o.c,0,0,W/4,H/4);const b2=mk(W,H);b2.g.imageSmoothingEnabled=true;b2.g.drawImage(b.c,0,0,W/4*DPR,H/4*DPR,0,0,W,H);b2.g.globalAlpha=.5;b2.g.drawImage(o.c,0,0,W,H);L.fore=LOW?o.c:b2.c;
  // 6 스탠드 빛·비네트
  o=mk(W,H);c=o.g;let v=c.createRadialGradient(180,120,60,640,360,820);v.addColorStop(0,'rgba(255,226,150,.26)');v.addColorStop(.45,'rgba(255,226,150,0)');v.addColorStop(1,'rgba(4,8,40,.5)');c.fillStyle=v;c.fillRect(0,0,W,H);L.vig=o.c;
}
/* ── 소리 ── */
let AC=null,muted=false;function beep(f,d,type='sine',v=.12,slide=0,delay=0){if(muted)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();const t0=AC.currentTime+delay,o=AC.createOscillator(),ga=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t0+d);ga.gain.setValueAtTime(0,t0);ga.gain.linearRampToValueAtTime(v,t0+.012);ga.gain.exponentialRampToValueAtTime(.0008,t0+d);o.connect(ga).connect(AC.destination);o.start(t0);o.stop(t0+d+.03)}catch(e){}}
const sfx={pick:()=>beep(520,.08,'triangle',.1,180),snap:()=>{beep(190,.1,'square',.08,-90);beep(760,.07,'triangle',.08,0,.03)},back:()=>beep(300,.14,'sine',.07,-140),lever:()=>{beep(140,.16,'sawtooth',.08,-60);beep(880,.5,'sine',.05,300,.1)},no:()=>{beep(260,.16,'sine',.1,-70);beep(200,.22,'sine',.09,-60,.14)},ok:()=>[523,659,784,1047].forEach((f,i)=>beep(f,.22,'triangle',.1,0,i*.09)),tick:()=>beep(1200,.03,'square',.03)};
/* ── 상태 ── */
const G={t:0,phase:'ask',placed:null,part:{x:HOME.x,y:HOME.y,tx:HOME.x,ty:HOME.y,sc:1,drag:false,sel:false,wob:0},simT:0,simDur:3.2,reveal:0,cool:0,tries:0,pull:0,hop:0,stars:[],puffs:[],tempTop:8,tempBot:8,hintT:0,okT:0,pressT:0,flow:[]};
for(let i=0;i<54;i++)G.flow.push({s:i/54,j:SR(-1,1),k:SR(.8,1.2)});
const snow=[];for(let i=0;i<46;i++)snow.push({x:SR(1056,1280),y:SR(0,590),v:SR(14,34),r:SR(1.5,3.2),p:SR(0,6)});
const smoke=[];for(let i=0;i<5;i++)smoke.push({p:i/5});
function star(x,y,n,cols){for(let i=0;i<n;i++){const a=SR(0,6.28),v=SR(120,420);G.stars.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-160,l:SR(.6,1.2),t:0,r:SR(5,11),c:cols[i%cols.length],sp:SR(-6,6),k:i%3})}}
function puff(x,y,n){for(let i=0;i<n;i++)G.puffs.push({x,y,vx:SR(-70,70),vy:SR(-60,10),t:0,l:SR(.3,.6),r:SR(4,9)})}
/* ── 입력 ── */
function pos(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}}
const inR=(p,x,y,w,h)=>p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h;
const SW={x:846,y:604,w:128,h:110},NEXT={x:1092,y:318,w:160,h:84};
function slotAt(p,pad=26){for(const k in SLOT){const s=SLOT[k];if(inR(p,s.x-pad,s.y-pad,s.w+pad*2,s.h+pad*2))return k}return null}
function place(k){const s=SLOT[k];G.placed=k;G.part.tx=s.x+s.w/2;G.part.ty=s.y+s.h/2;G.part.sel=false;G.part.wob=1;sfx.snap();puff(s.x+s.w/2,s.y+s.h,8)}
function unplace(){G.placed=null;G.part.tx=HOME.x;G.part.ty=HOME.y;sfx.back()}
cv.addEventListener('pointerdown',e=>{e.preventDefault();const p=pos(e);
  if(inR(p,1150,104,44,44)){muted=!muted;return}
  if(G.phase==='ok'){if(G.okT>1.2&&inR(p,NEXT.x,NEXT.y,NEXT.w,NEXT.h)){reset();sfx.pick()}return}
  if(G.phase!=='ask'||G.cool>0)return;
  if(Math.abs(p.x-G.part.x)<70&&Math.abs(p.y-G.part.y)<48){G.part.drag=true;G.part.moved=false;G.part.ox=p.x-G.part.x;G.part.oy=p.y-G.part.y;G.part.px=p.x;G.part.py=p.y;sfx.pick();try{cv.setPointerCapture(e.pointerId)}catch(_){}return}
  const k=slotAt(p,6);if(k&&G.part.sel){place(k);return}
  if(inR(p,SW.x,SW.y,SW.w,SW.h)){if(G.placed){G.phase='sim';G.simT=0;G.pull=1;G.pressT=G.t;sfx.lever()}else{G.part.wob=1;sfx.tick();G.nudge=G.t}}});
cv.addEventListener('pointermove',e=>{if(!G.part.drag)return;const p=pos(e);if(Math.hypot(p.x-G.part.px,p.y-G.part.py)>8)G.part.moved=true;G.part.x=p.x-G.part.ox;G.part.y=p.y-G.part.oy;G.part.tx=G.part.x;G.part.ty=G.part.y});
function up(e){if(!G.part.drag)return;G.part.drag=false;const p={x:G.part.x,y:G.part.y};
  if(!G.part.moved){if(G.placed){unplace()}else{G.part.sel=!G.part.sel;G.part.tx=HOME.x;G.part.ty=HOME.y}return}
  const k=slotAt(p,40);if(k)place(k);else unplace()}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{if(G.phase==='ask'&&G.cool<=0){if(e.key==='1')place('A');if(e.key==='2')place('B');if(e.key==='Enter'&&G.placed){G.phase='sim';G.simT=0;G.pull=1;sfx.lever()}}else if(G.phase==='ok'&&e.key==='Enter'&&G.okT>1.2)reset()});
function reset(){Object.assign(G,{phase:'ask',placed:null,simT:0,reveal:0,cool:0,tries:0,tempTop:8,tempBot:8,hintT:0,okT:0});G.part.tx=HOME.x;G.part.ty=HOME.y}
/* ── 온도 모형(게임 속 본보기 값): 아래에 두면 공기가 돌아 방 전체, 위에 두면 위쪽만 ── */
function heatAt(u,v,p){ // u,v: 0~1(왼→오, 위→아래), p: 진행
  if(G.placed==='B'){const along=v<.5?u*.5+(1-v)*.2:(1-u)*.5+.5+(v-.5)*.2,near=Math.max(0,1-Math.hypot(u-.13,(v-.82)*.6)/.3);return clamp(p*1.5-along*.55)*(.74-.2*along)+near*.3*Math.min(1,p*3)}
  const near=Math.max(0,1-Math.hypot(u-.13,(v-.17)*.6)/.26);return clamp(p*1.35-u*.3)*clamp(1-(v-.14)/.26)*.8+near*.2*Math.min(1,p*3)}
const TC=['#17397c','#1f7fa8','#4cc0ae','#ffe9a8','#ffc98a','#f58f6c'],FC=['#2f7df0','#22b4d4','#ff8a2c','#e8452f'];
const TM=document.createElement('canvas');TM.width=26;TM.height=13;const tg=TM.getContext('2d');
const fcol=h=>{const x=clamp(h)*(FC.length-1),i=Math.min(FC.length-2,Math.floor(x));return mix(FC[i],FC[i+1],x-i)};
function tcol(h){const x=clamp(h)*(TC.length-1),i=Math.min(TC.length-2,Math.floor(x));return mix(TC[i],TC[i+1],x-i)}
function mkPath(x0,x1,y0,y1,r){const P=[],seg=(ax,ay,bx,by,n)=>{for(let i=0;i<n;i++)P.push([lerp(ax,bx,i/n),lerp(ay,by,i/n)])},arc=(cx,cy,a0,a1,n)=>{for(let i=0;i<n;i++){const a=lerp(a0,a1,i/n);P.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}};
  const nv=Math.round((y1-y0-2*r)/11),nh=Math.round((x1-x0-2*r)/11);
  seg(x0,y1-r,x0,y0+r,nv);arc(x0+r,y0+r,Math.PI,Math.PI*1.5,7);seg(x0+r,y0,x1-r,y0,nh);arc(x1-r,y0+r,-Math.PI/2,0,7);seg(x1,y0+r,x1,y1-r,nv);arc(x1-r,y1-r,0,Math.PI/2,7);seg(x1-r,y1,x0+r,y1,nh);arc(x0+r,y1-r,Math.PI/2,Math.PI,7);return P}
const PATH={B:mkPath(RX+82,RX+RW-74,RY+50,FY-14,48),A:mkPath(RX+150,RX+RW*.8,RY+34,RY+118,30)};
function ribbon(c,P,t,spd,prog,hf,al){const N=P.length,lim=Math.floor(N*clamp(prog));c.save();c.lineCap='round';c.globalAlpha=al;
  for(const lane of[-13,0,13]){for(let pass=0;pass<2;pass++){c.beginPath();c.strokeStyle=pass?null:'#2b2350';c.lineWidth=pass?5:10;
    for(let i=0;i<lim;i++){if((((i-t*spd+lane*.4)%12)+12)%12>=7)continue;const a=P[i],b=P[(i+1)%N],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L*lane,ny=dx/L*lane;
      if(pass){c.beginPath();c.strokeStyle=fcol(hf(i/N));c.moveTo(a[0]+nx,a[1]+ny);c.lineTo(b[0]+nx,b[1]+ny);c.stroke()}else{c.moveTo(a[0]+nx,a[1]+ny);c.lineTo(b[0]+nx,b[1]+ny)}}
    if(!pass)c.stroke()}}
  for(let k=0;k<9;k++){const f=((k/9+t*spd/N)%1+1)%1,i=Math.floor(f*N);if(i>=lim)continue;const a=P[i],b=P[(i+1)%N],ang=Math.atan2(b[1]-a[1],b[0]-a[0]);arrowHead(c,a[0],a[1],ang,20,'#2b2350');arrowHead(c,a[0],a[1],ang,14,fcol(hf(f)))}
  c.restore()}
/* ── 한 장 그리기 ── */
function update(dt){G.t+=dt;const pt=G.part;
  if(!pt.drag){pt.x=lerp(pt.x,pt.tx,1-Math.pow(.0005,dt));pt.y=lerp(pt.y,pt.ty,1-Math.pow(.0005,dt))}pt.wob=Math.max(0,pt.wob-dt*3);pt.sc=lerp(pt.sc,pt.drag?1.14:1,1-Math.pow(.001,dt));
  G.pull=Math.max(0,G.pull-dt*2.2);if(G.cool>0)G.cool=Math.max(0,G.cool-dt);
  if(G.phase==='sim'){G.simT+=dt;const p=ease(clamp(G.simT/G.simDur));const pb=clamp(p*1.5-.5);G.tempTop=G.placed==='B'?8+13*clamp(p*1.25-.15):8+16*clamp(p*1.3-.2);G.tempBot=G.placed==='B'?8+12*pb:8+.6*p;
    if(G.simT>=G.simDur+.35){if(G.placed==='B'){G.phase='reveal';G.reveal=0;sfx.ok()}else{G.phase='hint';G.tries++;G.cool=1.6;G.hintT=0;sfx.no()}}}
  else if(G.phase==='hint'){G.hintT+=dt;if(G.cool<=0&&G.placed){unplace();G.placed=null}if(!G.placed&&G.hintT>1.7){G.phase='ask';G.tempTop=G.tempBot=8}}
  else if(G.phase==='reveal'){G.reveal+=dt/.9;if(G.reveal>=1){G.reveal=1;G.phase='ok';G.okT=0;star(640,360,26,['#ffd23f','#ff8a5a','#ffffff','#7fe0d0']);G.hop=1}}
  else if(G.phase==='ok'){G.okT+=dt}
  G.hop=Math.max(0,G.hop-dt*1.6);
  for(const s of snow){s.y+=s.v*dt;s.x+=Math.sin(G.t*1.3+s.p)*8*dt;if(s.y>592){s.y=-4;s.x=SR(1056,1280)}}
  for(const s of smoke)s.p=(s.p+dt*.16)%1;
  G.stars=G.stars.filter(s=>(s.t+=dt)<s.l);for(const s of G.stars){s.vy+=520*dt;s.x+=s.vx*dt;s.y+=s.vy*dt}
  G.puffs=G.puffs.filter(s=>(s.t+=dt)<s.l);for(const s of G.puffs){s.x+=s.vx*dt;s.y+=s.vy*dt}
  for(const f of G.flow)f.s=(f.s+dt*.11*f.k)%1}
function drawSlots(c){if(G.phase==='reveal'||G.phase==='ok')return;const ask=G.phase==='ask';for(const k in SLOT){if(G.placed===k)continue;const s=SLOT[k],near=G.part.drag&&slotAt({x:G.part.x,y:G.part.y},40)===k,hot=near||G.part.sel;
  c.save();c.globalAlpha=ask?1:.45;c.fillStyle=near?'rgba(255,178,60,.34)':'rgba(255,214,107,'+(.10+(hot?.08:0)+Math.sin(G.t*3)*.04)+')';c.fillRect(s.x,s.y,s.w,s.h);c.strokeStyle=near?'#fff':'#ffd66b';c.lineWidth=near?4:3;c.setLineDash([10,7]);c.lineDashOffset=-G.t*(ask?22:0);c.strokeRect(s.x,s.y,s.w,s.h);c.restore();
  if(ask)T(c,s.name,s.x+s.w/2,s.y+s.h/2+1,26,'SunB','#ffe9a8','center',{st:NAVY,sw:6});}}
function thermo(c,x,y,label,val,ring){c.save();bl(c,[[RX+RW-36,y],[RX+RW+22,y],[x,y]],{w:1.5,dash:[5,4],over:0});
  c.fillStyle='#e8f0ff';c.strokeStyle=OL;c.lineWidth=2.5;c.beginPath();rr(c,RX+RW-56,y-5,58,10,5);c.fill();c.stroke();c.fillStyle='#ff6a5a';c.beginPath();c.arc(RX+RW-56,y,6,0,7);c.fill();c.stroke();
  panel(c,x,y-36,176,72);T(c,label,x+12,y-17,20,'SunB','#dbe8ff');const hot=val>=20;T(c,val.toFixed(1),x+116,y+13,32,'Orbit',hot?'#ffd66b':'#9fd0ff','right');T(c,'°C',x+124,y+14,21,'Orbit',hot?'#ffd66b':'#9fd0ff');
  if(ring>0){c.strokeStyle='#ff9d8a';c.lineWidth=3.5;c.lineCap='round';c.globalAlpha=.95;c.beginPath();c.ellipse(x+88,y,106,46,-.05,-.3,-.3+Math.PI*2.05*clamp(ring));c.stroke()}c.restore()}
function fitT(c,str,x,y,sz,font,col,maxW){c.font=sz+'px '+font;const w=c.measureText(str).width;T(c,str,x,y,w>maxW?Math.max(24,Math.floor(sz*maxW/w)):sz,font,col)}
function memo(c){const x=256,y=16,w=530,h=128;c.save();c.translate(x+w/2,y+h/2);c.rotate(-.012);c.translate(-w/2,-h/2);
  c.fillStyle='rgba(0,8,40,.35)';c.fillRect(6,8,w,h);c.fillStyle='rgba(240,246,255,.96)';c.fillRect(0,0,w,h);
  c.strokeStyle='rgba(60,110,190,.16)';c.lineWidth=1;for(let i=16;i<w;i+=16){c.beginPath();c.moveTo(i,0);c.lineTo(i,h);c.stroke()}for(let j=16;j<h;j+=16){c.beginPath();c.moveTo(0,j);c.lineTo(w,j);c.stroke()}
  const tp=(tx,ty,r,col)=>{c.save();c.translate(tx,ty);c.rotate(r);c.fillStyle=col;c.fillRect(-36,-11,72,22);c.fillStyle='rgba(255,255,255,.4)';for(let i=-30;i<36;i+=12)c.fillRect(i,-11,5,22);c.restore()};tp(16,2,-.5,'rgba(88,196,186,.92)');tp(w-16,2,.5,'rgba(255,196,84,.95)');
  T(c,'의뢰 07',22,22,20,'SunB','#2f66ad');T(c,'솜이 할머니 댁 거실',w-22,22,20,'SunB','#2f66ad','right');c.strokeStyle='#2f66ad';c.lineWidth=2;c.beginPath();c.moveTo(18,37);c.lineTo(w-18,36);c.stroke();
  let a,b,band=null;if(G.phase==='hint'||(G.phase==='ask'&&G.tries>0)){a='따뜻해진 공기는 어디로 움직일까요?';b='위쪽과 아래쪽 온도계를 비교해 봐요.';band='rgba(255,196,84,.55)'}
  else if(G.phase==='ok'||G.phase==='reveal'){a='따뜻해진 공기는 위로, 차가운 공기는';b='아래로 움직여 방 전체가 따뜻해져요!';band='rgba(110,220,170,.5)'}
  else{a='난방기를 위쪽과 아래쪽 중 어디에';b='놓아야 방 전체가 따뜻해질까요?'}
  if(band){c.fillStyle=band;c.fillRect(16,50,w-32,30);c.fillRect(16,86,w-32,30)}
  fitT(c,a,22,66,28,'SunB','#14295a',w-44);fitT(c,b,22,102,28,'SunB','#14295a',w-44);c.restore();
  bl(c,[[x+w-40,y+h],[RX+RW-190,RY+2]],{w:1.2,dash:[5,5],a:.6,over:0});}
function titleBlock(c){const x=806,y=16,w=444,h=78;panel(c,x,y,w,h);c.strokeStyle=WH;c.lineWidth=1.5;c.beginPath();c.moveTo(x,y+40);c.lineTo(x+w-96,y+40);c.moveTo(x+166,y+40);c.lineTo(x+166,y+h);c.moveTo(x+w-96,y);c.lineTo(x+w-96,y+h);c.stroke();
  T(c,'따끈 설계소',x+14,y+21,27,'SunB','#fff');T(c,'도면 07 / 30',x+14,y+59,20,'Orbit',WH);T(c,'목표 20 °C',x+178,y+59,21,'SunB','#ffd66b');
  // 집 단면 약도: 완성한 방은 귤색, 지금 방은 깜빡임
  const mx=x+w-84,my=y+12;c.strokeStyle=WH;c.lineWidth=1.8;c.beginPath();c.moveTo(mx-4,my+22);c.lineTo(mx+36,my);c.lineTo(mx+76,my+22);c.stroke();
  for(let i=0;i<6;i++){const cx=mx+4+(i%3)*23,cy=my+24+Math.floor(i/3)*16;c.fillStyle=i===3?'#ffb23c':i===4?'rgba(255,233,168,'+(.35+Math.sin(G.t*5)*.3)+')':'rgba(234,243,255,.12)';c.fillRect(cx,cy,21,14);c.strokeRect(cx,cy,21,14)}
  [[1172,126,0],[1222,126,1]].forEach(([ix,iy,k])=>{c.save();c.fillStyle='rgba(13,40,88,.92)';c.strokeStyle=WH;c.lineWidth=2;c.beginPath();c.arc(ix,iy,21,0,7);c.fill();c.stroke();c.lineCap='round';c.lineWidth=2.5;
    if(k===0){c.beginPath();c.moveTo(ix-10,iy-4);c.lineTo(ix-4,iy-4);c.lineTo(ix+2,iy-9);c.lineTo(ix+2,iy+9);c.lineTo(ix-4,iy+4);c.lineTo(ix-10,iy+4);c.closePath();c.stroke();if(muted){c.beginPath();c.moveTo(ix+6,iy-5);c.lineTo(ix+13,iy+5);c.moveTo(ix+13,iy-5);c.lineTo(ix+6,iy+5);c.stroke()}else{c.beginPath();c.arc(ix+3,iy,6,-.8,.8);c.stroke();c.beginPath();c.arc(ix+3,iy,11,-.8,.8);c.stroke()}}
    else{c.lineWidth=4;c.beginPath();c.moveTo(ix-5,iy-7);c.lineTo(ix-5,iy+7);c.moveTo(ix+5,iy-7);c.lineTo(ix+5,iy+7);c.stroke()}c.restore()})}
function tray(c){const x=250,y=606,w=560,h=106;c.save();c.fillStyle='rgba(0,8,20,.4)';c.fillRect(x+8,y+10,w,h);c.restore();panel(c,x,y,w,h,{fill:'#0f2f5e'});
  const names=['난방기','구리판','단열재','온도계'];for(let i=0;i<4;i++){const cx=x+80+i*134;if(i){c.strokeStyle='rgba(234,243,255,.35)';c.lineWidth=1.2;c.beginPath();c.moveTo(cx-67,y+12);c.lineTo(cx-67,y+h-12);c.stroke()}
    T(c,names[i],cx,y+h-17,21,'SunB',i?'rgba(234,243,255,.78)':'#ffe9a8','center');
    if(i){c.save();c.strokeStyle='#ffd66b';c.fillStyle='#12346c';c.lineWidth=2;c.beginPath();rr(c,cx+38,y+12,18,14,3);c.fill();c.stroke();c.beginPath();c.arc(cx+47,y+12,6,Math.PI,0);c.stroke();c.restore()}
    if(i===1){c.save();c.globalAlpha=.75;for(let k=0;k<5;k++)bl(c,[[cx-30+k*14,y+47],[cx-22+k*14,y+33]],{w:1.2,over:0});c.restore()}if(i===3){c.save();c.globalAlpha=.75;for(let k=0;k<6;k++)bl(c,[[cx-30+k*8,y+34],[cx-30+k*8,y+(k%2?38:36)]],{w:1.2,over:0});c.restore()}
    c.save();c.globalAlpha=.75;if(i===1){bl(c,[[cx-40,y+30],[cx+40,y+30],[cx+40,y+50],[cx-40,y+50],[cx-40,y+30]],{w:1.5})}if(i===2){bl(c,[[cx-40,y+24],[cx+40,y+24],[cx+40,y+56],[cx-40,y+56],[cx-40,y+24]],{w:1.5});zig(c,cx-38,y+28,76,24,false)}if(i===3){bl(c,[[cx-36,y+40],[cx+20,y+40]],{w:5});c.strokeStyle=WH;c.lineWidth=1.5;c.beginPath();c.arc(cx+28,y+40,10,0,7);c.stroke()}c.restore()}
  if(G.placed||G.part.drag){c.save();c.globalAlpha=.5;radiator(c,'line',HOME.x,HOME.y,1,false);c.restore()}}
function lever(c){const x=SW.x,y=SW.y,ready=G.placed&&G.phase==='ask',on=G.phase!=='ask';c.save();c.fillStyle='rgba(0,8,20,.45)';c.beginPath();rr(c,x+8,y+16,SW.w,SW.h-8,14);c.fill();c.restore();
  cel(c,k=>rr(k,x,y+12,SW.w,SW.h-12,14),'#6a4630',{s:3,h:0});cel(c,k=>rr(k,x,y+2,SW.w,SW.h-14,14),ready?'#ffb23c':on?'#f26a4b':'#b9804f',{s:6,h:4});
  [[x+12,y+14],[x+SW.w-12,y+14],[x+12,y+SW.h-24],[x+SW.w-12,y+SW.h-24]].forEach(([sx,sy])=>{c.fillStyle='#e8ecf5';c.strokeStyle=OL;c.lineWidth=2;c.beginPath();c.arc(sx,sy,4.5,0,7);c.fill();c.stroke();c.beginPath();c.moveTo(sx-3,sy);c.lineTo(sx+3,sy);c.stroke()});
  cel(c,k=>rr(k,x+SW.w/2-13,y+16,26,50,13),'#2b2350',{s:0,h:0,ow:0});
  const a=on?.75:-.75+G.pull*.2+(ready?Math.sin(G.t*6)*.06:0);c.save();c.translate(x+SW.w/2,y+56);c.rotate(a);cel(c,k=>rr(k,-7,-50,14,54,7),'#e8ecf5',{s:3,h:2});cel(c,k=>k.arc(0,-52,14,0,7),ready||on?'#e9596a':'#c9d3e8',{s:4,h:3});c.restore();
  T(c,'불 켜기',x+SW.w/2,y+SW.h-27,24,'SunB','#2b2350','center');
  if(ready){c.save();c.strokeStyle='#ffe9a8';c.lineWidth=3;c.globalAlpha=.5+Math.sin(G.t*6)*.4;c.beginPath();rr(c,x-6,y-4,SW.w+12,SW.h+4,18);c.stroke();c.restore()}}
function draw(){const c=g,t=G.t;c.setTransform(DPR,0,0,DPR,0,0);const bx=LOW?0:Math.sin(t*.5)*4,by=LOW?0:Math.cos(t*.37)*3;
  c.drawImage(L.desk,-20+bx*.3,-20+by*.3,W+40,H+40);
  // 종이 그림자 + 종이
  c.fillStyle='rgba(0,8,20,.5)';c.fillRect(PX0+bx*.6+6,598+by*.6,PX1-PX0-80,12);c.drawImage(L.paper,-20+bx*.6,by*.6,W+40,620);
  c.save();c.translate(bx*.6,by*.6);c.save();c.beginPath();c.rect(PX0,0,PX1-PX0,598);c.clip();
  // 굴뚝 연기(선)
  for(const s of smoke){c.save();c.globalAlpha=(1-s.p)*.55;c.fillStyle='#fff6e8';c.beginPath();c.arc(108+Math.sin(s.p*9)*8,372-s.p*70,5+s.p*11,0,7);c.fill();c.restore()}
  for(const s of snow){c.fillStyle='rgba(234,243,255,.9)';c.beginPath();c.arc(s.x,s.y,s.r,0,7);c.fill()}c.restore();
  // 방: 선 → (실험 중) 온도 색 → 실물이 아래에서 차오름
  const simP=G.phase==='sim'?ease(clamp(G.simT/G.simDur)):G.phase==='hint'?clamp(1-G.hintT/1.6):0, rv=G.phase==='ok'?1:G.phase==='reveal'?ease(G.reveal):0;
  if(simP>0&&rv<1){const pp=G.phase==='hint'?1:simP,fade=G.phase==='hint'?simP:Math.min(1,simP*5);for(let i=0;i<26;i++)for(let j=0;j<13;j++){tg.fillStyle=tcol(heatAt((i+.5)/26,(j+.5)/13,pp));tg.fillRect(i,j,1,1)}
    c.save();c.beginPath();c.rect(RX,RY,RW,RH);c.clip();c.globalAlpha=.7*fade;c.imageSmoothingEnabled=true;c.drawImage(TM,RX-RW/52,RY-RH/26,RW+RW/26,RH+RH/13);c.restore()}
  if(simP>0&&rv<1){const f2=G.phase==='hint'?simP:Math.min(1,simP*5);c.save();c.globalAlpha=1-f2;c.drawImage(L.roomLine,0,0,W,H);c.globalAlpha=f2;c.drawImage(L.roomLineT,0,0,W,H);c.restore()}else c.drawImage(L.roomLine,0,0,W,H);
  if(rv>0){const yy=RB-RH*rv;c.save();c.beginPath();c.rect(RX,yy,RW,RB-yy);c.clip();c.drawImage(L.roomReal,0,0,W,H);c.restore();
    if(rv<1){c.save();const gl=c.createLinearGradient(0,yy-26,0,yy+6);gl.addColorStop(0,'rgba(255,230,150,0)');gl.addColorStop(1,'rgba(255,240,190,.85)');c.fillStyle=gl;c.fillRect(RX,yy-26,RW,32);c.fillStyle='#fff';c.fillRect(RX,yy-1.5,RW,3);c.restore()}
    else{c.strokeStyle=OL;c.lineWidth=4;c.strokeRect(RX,RY,RW,RH)}}
  drawSlots(c);
  // 놓인 난방기(도면 안)
  const pt=G.part,inRoom=pt.y<590;
  // 주민(양 할머니)
  const ex=G.phase==='ok'||G.phase==='reveal'?'happy':G.phase==='hint'?'sad':G.phase==='sim'?(G.placed==='B'&&G.simT>1.6?'idle':'wow'):'cold';
  sheep(c,520,542,1,ex,t,(G.phase==='ok'?Math.abs(Math.sin(t*7))*12*Math.max(.25,1-G.okT*.25):0));
  if(inRoom&&!pt.drag){c.save();c.fillStyle='rgba(20,10,60,.3)';c.beginPath();if(pt.y>400)el(c,pt.x+6,pt.y+36,56,6);else rr(c,pt.x-50,pt.y-21,112,58,10);c.fill();c.restore();c.save();c.translate(pt.x,pt.y);c.rotate(Math.sin(pt.wob*18)*pt.wob*.12);radiator(c,'real',0,0,1+pt.wob*.08,G.phase!=='ask'&&G.phase!=='hint'||G.phase==='hint'&&G.cool>0);c.restore();
    if(G.phase==='sim'||G.phase==='reveal'||G.phase==='ok'){for(let i=0;i<3;i++){const p=(t*.9+i/3)%1;c.save();c.globalAlpha=(1-p)*.8;c.strokeStyle='#ffb27a';c.lineWidth=3;c.lineCap='round';c.beginPath();const x0=pt.x-30+i*30;for(let k=0;k<=8;k++)c.lineTo(x0+Math.sin(k*1.1+t*5)*5,pt.y-34-p*40-k*3);c.stroke();c.restore()}}}
  if((G.phase==='sim'||G.phase==='reveal'||G.phase==='ok')&&G.placed){const al=G.phase==='sim'?1:G.phase==='reveal'?1:Math.max(.55,1-G.okT*.3),B=G.placed==='B';
    ribbon(c,PATH[G.placed],t,B?34:16,G.phase==='sim'?G.simT/(B?2.2:1.4):1,B?(f=>1-clamp((f-.1)/.72)):(f=>1-f*.45),al)}
  thermo(c,1076,RY+52,'위쪽 온도계',G.tempTop,G.phase==='hint'?G.hintT*1.6:0);thermo(c,1076,FY-30,'아래쪽 온도계',G.tempBot,G.phase==='hint'?G.hintT*1.6-.5:0);
  // 오답: 빨간 색연필 메모(세계 안의 실마리)
  if(G.phase==='hint'){const p=clamp(G.hintT*1.4-.6);c.save();c.globalAlpha=p;c.translate(768,296);c.rotate(-.05);c.fillStyle='rgba(20,56,116,.9)';c.fillRect(-170,-26,340,96);T(c,'위쪽만 따뜻해졌네…',0,0,46,'Pen','#ffb3a0','center',{st:'rgba(13,40,88,.85)',sw:7});T(c,'바닥은 아직 차가워요!',0,44,46,'Pen','#ffb3a0','center',{st:'rgba(13,40,88,.85)',sw:7});c.restore();
    c.save();c.strokeStyle='#ff9d8a';c.lineWidth=3.5;c.lineCap='round';c.globalAlpha=p;c.beginPath();c.moveTo(944,284);c.quadraticCurveTo(1000,250,1060,232);c.stroke();arrowHead(c,1064,231,-.2,9,'#ff9d8a');c.beginPath();c.moveTo(944,356);c.quadraticCurveTo(1000,430,1060,470);c.stroke();arrowHead(c,1064,473,.5,9,'#ff9d8a');c.restore()}
  memo(c);titleBlock(c);
  if(G.phase==='ok'&&G.okT>1.2){const pp=back(clamp((G.okT-1.2)*3));c.save();c.translate(NEXT.x+NEXT.w/2,NEXT.y+NEXT.h/2);c.scale(pp,pp);panel(c,-NEXT.w/2,-NEXT.h/2,NEXT.w,NEXT.h,{fill:'#12346c',col:'#ffd66b'});T(c,'다시 해 보기',0,1,24,'SunB','#ffe9a8','center');c.restore()}
  if(G.phase==='ok'){const p=back(clamp(G.okT*2.2));c.save();c.translate(640,214);c.rotate(-.05);c.scale(p,p);T(c,'도면 완성!',0,0,72,'SunB','#ffd23f','center',{st:OL,sw:16});T(c,'도면 완성!',0,-4,72,'SunB','#fff3b0','center');c.restore()}
  c.restore();
  // 책상 위: 부품함·레버·두더지
  c.save();c.translate(bx*.9,by*.9);tray(c);lever(c);
  mole(c,1056,712,.98,G.phase==='ok'||G.phase==='reveal'?'happy':G.phase==='hint'?'think':'idle',t,G.pull);
  if(!inRoom||pt.drag){c.save();const lift=pt.drag?14:0;c.fillStyle='rgba(0,8,20,'+(pt.drag?.3:.4)+')';c.beginPath();el(c,pt.x+6+lift*.6,pt.y+34+lift,56*pt.sc,7);c.fill();c.translate(pt.x,pt.y-lift*.3);c.rotate(pt.drag?-.06:Math.sin(pt.wob*18)*pt.wob*.12+(pt.sel?Math.sin(t*10)*.05:0));
    if(pt.sel){c.strokeStyle='#ffe9a8';c.lineWidth=3;c.setLineDash([8,6]);c.lineDashOffset=-t*30;c.strokeRect(-66,-40,132,80);c.setLineDash([])}
    radiator(c,'real',0,0,pt.sc,false);c.restore()}
  if(G.phase==='ask'&&!G.placed&&!pt.drag&&G.tries===0){const p=(t%2.4)/2.4,hx=lerp(HOME.x+20,SLOT.B.x+70,ease(clamp(p*1.4))),hy=lerp(HOME.y+10,SLOT.B.y+80,ease(clamp(p*1.4)))-Math.sin(clamp(p*1.4)*Math.PI)*60;c.save();c.globalAlpha=p<.8?.9:(1-p)*4.5;c.translate(hx,hy);c.fillStyle='#fff';c.strokeStyle=OL;c.lineWidth=3;c.lineJoin='round';c.beginPath();c.moveTo(0,0);c.lineTo(22,30);c.lineTo(10,30);c.lineTo(15,48);c.lineTo(6,50);c.lineTo(1,33);c.lineTo(-9,40);c.closePath();c.fill();c.stroke();c.restore()}
  c.restore();
  c.drawImage(L.fore,bx*1.8-6,by*1.8+4,W+12,H+8);
  // 컵 김
  for(let i=0;i<3;i++){const p=(t*.25+i/3)%1;c.save();c.globalAlpha=(1-p)*.35;c.strokeStyle='#fff';c.lineWidth=7;c.lineCap='round';c.beginPath();for(let k=0;k<=10;k++)c.lineTo(1226+i*22+Math.sin(k*.9+t*2+i)*8,612-p*70-k*5);c.stroke();c.restore()}
  c.drawImage(L.vig,0,0,W,H);
  for(const s of G.puffs){c.save();c.globalAlpha=1-s.t/s.l;c.fillStyle='#eaf3ff';c.beginPath();c.arc(s.x,s.y,s.r*(1+s.t*2),0,7);c.fill();c.restore()}
  for(const s of G.stars){c.save();c.globalAlpha=clamp((s.l-s.t)*3);c.translate(s.x,s.y);c.rotate(s.t*s.sp);c.fillStyle=s.c;c.strokeStyle=OL;c.lineWidth=2;c.beginPath();if(s.k===0){for(let i=0;i<10;i++){const a=i*Math.PI/5,r=i%2?s.r*.45:s.r;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath()}else if(s.k===1)c.rect(-s.r*.7,-s.r*.4,s.r*1.4,s.r*.8);else{c.moveTo(-s.r,0);c.lineTo(s.r,-s.r*.5);c.lineTo(s.r*.4,s.r*.7);c.closePath()}c.fill();c.stroke();c.restore()}}
let last=0;function frame(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;update(dt);draw();requestAnimationFrame(frame)}
(async()=>{for(const f of['SunB','SunM','Pen','Orbit','DoHyeon']){try{await document.fonts.load('30px '+f,'가1°A')}catch(e){}}buildLayers();window.G=G;window.KA={place,reset,go(){G.phase='sim';G.simT=0;G.pull=1}};window.READY=true;requestAnimationFrame(frame)})();
