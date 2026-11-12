/* ── 방 4개 더(선·실물 두 벌) + 방 정보 ── */
function winBox(c,m,x,y,w,h,sun){ // 창: 실물은 겨울 하늘(+해), 선은 틀
  if(m==='real'){cel(c,k=>rr(k,x-14,y-14,w+28,h+28,8),'#8a5a3c');const q=c.createLinearGradient(0,y,0,y+h);q.addColorStop(0,sun?'#8fd0ff':'#29407e');q.addColorStop(1,sun?'#e6f6ff':'#6f8fd0');c.fillStyle=q;c.fillRect(x,y,w,h);
    if(sun){c.fillStyle='#fff3a0';c.beginPath();c.arc(x+w*.72,y+h*.3,26,0,7);c.fill();c.fillStyle='rgba(255,243,160,.35)';c.beginPath();c.arc(x+w*.72,y+h*.3,40,0,7);c.fill()}
    c.fillStyle='#e8f2ff';c.beginPath();c.moveTo(x,y+h);c.quadraticCurveTo(x+w*.3,y+h*.74,x+w*.6,y+h*.88);c.quadraticCurveTo(x+w*.8,y+h*.72,x+w,y+h*.82);c.lineTo(x+w,y+h);c.closePath();c.fill();
    c.fillStyle='#8a5a3c';c.fillRect(x+w/2-4,y,8,h);c.fillRect(x,y+h/2-3,w,7);c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.moveTo(x+6,y+6);c.lineTo(x+40,y+6);c.lineTo(x+14,y+h*.4);c.lineTo(x+6,y+h*.4);c.fill()}
  else{bl(c,[[x-14,y-14],[x+w+14,y-14],[x+w+14,y+h+14],[x-14,y+h+14],[x-14,y-14]]);bl(c,[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]],{w:1.2});bl(c,[[x+w/2,y],[x+w/2,y+h]],{w:1.2});bl(c,[[x,y+h/2],[x+w,y+h/2]],{w:1.2})}}
function potPlant(c,m,x,y,s,col){P(c,m,k=>{k.moveTo(x-26*s,y-48*s);k.lineTo(x+26*s,y-48*s);k.lineTo(x+18*s,y);k.lineTo(x-18*s,y);k.closePath()},col||'#d9764a');[[-14,-82,-.5],[14,-86,.5],[0,-104,0]].forEach(([dx,dy,r])=>P(c,m,k=>el(k,x+dx*s,y+dy*s,12*s,26*s,r),'#4fae78',{s:4,h:3}))}
function F0(c,m){ // 관측실
  P(c,m,k=>el(k,620,548,200,10),'#58a8dc',{s:3,h:2});
  // 큰 벽 온도계
  P(c,m,k=>rr(k,296,206,56,230,12),'#fff6e0');P(c,m,k=>rr(k,316,226,16,170,8),'#e8f0ff',{s:2,h:0,ow:2});P(c,m,k=>k.arc(324,410,17,0,7),'#f26a4b',{s:3,h:2});
  if(m==='real'){c.fillStyle='#f26a4b';c.fillRect(319,300,10,100);c.strokeStyle=OL;c.lineWidth=2;for(let i=0;i<9;i++){c.beginPath();c.moveTo(336,236+i*19);c.lineTo(i%2?342:346,236+i*19);c.stroke()}}else for(let i=0;i<9;i++)bl(c,[[336,236+i*19],[i%2?342:346,236+i*19]],{w:1.2,over:0});
  winBox(c,m,744,236,190,150,false);
  // 달력·시계
  P(c,m,k=>rr(k,420,222,80,92,5),'#fff6e0');P(c,m,k=>rr(k,420,222,80,24,5),'#e9596a',{s:2,h:1,ow:2});if(m==='real'){c.fillStyle='#8a94b8';for(let i=0;i<4;i++)for(let j=0;j<3;j++)c.fillRect(430+i*17,256+j*17,9,9)}
  P(c,m,k=>k.arc(580,246,26,0,7),'#fff6e0');if(m==='real'){c.strokeStyle=OL;c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(580,246);c.lineTo(580,230);c.moveTo(580,246);c.lineTo(592,252);c.stroke()}else{bl(c,[[580,246],[580,230]],{w:1.4,over:0});bl(c,[[580,246],[592,252]],{w:1.4,over:0})}
  // 책상·지구본·공책·의자
  P(c,m,k=>rr(k,404,428,320,16,5),'#a8744c');P(c,m,k=>rr(k,416,444,14,78,3),'#8a5a3c',{s:2,h:0});P(c,m,k=>rr(k,698,444,14,78,3),'#8a5a3c',{s:2,h:0});P(c,m,k=>rr(k,560,444,150,44,4),'#c98a52',{s:3,h:2});
  P(c,m,k=>k.arc(470,388,30,0,7),'#58a8dc',{s:6,h:4});P(c,m,k=>rr(k,462,418,16,10,2),'#8a5a3c',{s:1,h:0,ow:2});if(m==='real'){c.fillStyle='#6fce8a';c.beginPath();el(c,462,380,12,9,.4);c.fill();c.beginPath();el(c,484,396,9,6,-.3);c.fill()}
  P(c,m,k=>rr(k,560,412,74,16,3),'#ffcf5e',{s:2,h:1});P(c,m,k=>rr(k,650,396,12,32,4),'#3aa89a',{s:2,h:1,ow:2});
  P(c,m,k=>rr(k,470,470,64,12,5),'#3f8fc4');P(c,m,k=>rr(k,476,482,8,40,3),'#6a4630',{s:2,h:0,ow:2});P(c,m,k=>rr(k,520,482,8,40,3),'#6a4630',{s:2,h:0,ow:2});P(c,m,k=>rr(k,470,424,10,50,4),'#3f8fc4',{s:2,h:1});
  // 신발장·우산꽂이·화분
  P(c,m,k=>rr(k,880,452,130,70,6),'#c98a52');P(c,m,k=>rr(k,890,462,50,24,3),'#a8693a',{s:2,h:0,ow:2});P(c,m,k=>rr(k,950,462,50,24,3),'#a8693a',{s:2,h:0,ow:2});P(c,m,k=>rr(k,890,492,110,22,3),'#a8693a',{s:2,h:0,ow:2});
  potPlant(c,m,944,452,.7);P(c,m,k=>rr(k,808,470,36,52,6),'#7a6ac8');P(c,m,k=>rr(k,822,430,6,44,3),'#e9596a',{s:1,h:0,ow:2});P(c,m,k=>rr(k,832,440,6,34,3),'#ffcf5e',{s:1,h:0,ow:2});
  P(c,m,k=>el(k,380,548,15,6),'#e9596a',{s:2,h:1,ow:2});P(c,m,k=>el(k,410,551,15,6),'#e9596a',{s:2,h:1,ow:2})}
function F1(c,m){ // 부엌
  P(c,m,k=>el(k,650,548,180,10),'#6fce8a',{s:3,h:2});
  // 화덕·냄비
  P(c,m,k=>rr(k,290,430,170,92,8),'#f4efe6');P(c,m,k=>rr(k,284,418,182,16,5),'#6a4630');P(c,m,k=>rr(k,330,452,90,58,6),'#3d3a55');
  if(m==='real'){c.fillStyle='#ff9a3c';c.fillRect(340,462,70,40);c.fillStyle='#ffe27a';c.beginPath();c.moveTo(352,500);c.lineTo(366,470);c.lineTo(376,490);c.lineTo(386,466);c.lineTo(400,500);c.fill()}
  P(c,m,k=>rr(k,338,384,80,36,10),'#e9596a');P(c,m,k=>rr(k,328,378,100,10,5),'#c23f55',{s:2,h:1});
  // 걸린 냄비들
  P(c,m,k=>rr(k,290,210,180,10,4),'#6a4630',{s:2,h:1});[[320,262,'#6a6f8a',18],[376,270,'#8a5a3c',22],[432,262,'#6a6f8a',18]].forEach(([x,y,col,r])=>{if(m==='real'){c.strokeStyle=OL;c.lineWidth=3;c.beginPath();c.moveTo(x,220);c.lineTo(x,y-r);c.stroke()}else bl(c,[[x,220],[x,y-r]],{w:1.2,over:0});P(c,m,k=>k.arc(x,y,r,0,7),col,{s:4,h:3})});
  // 조리대·개수대·수도꼭지
  P(c,m,k=>rr(k,480,440,250,82,6),'#f4efe6');P(c,m,k=>rr(k,474,428,262,16,5),'#8fc7c2');P(c,m,k=>rr(k,494,456,104,56,4),'#dfd6c6',{s:3,h:2,ow:2});P(c,m,k=>rr(k,612,456,104,56,4),'#dfd6c6',{s:3,h:2,ow:2});
  P(c,m,k=>{k.moveTo(634,428);k.lineTo(634,396);k.quadraticCurveTo(634,380,652,380);k.lineTo(668,380);k.lineTo(668,392);k.lineTo(650,392);k.lineTo(646,428);k.closePath()},'#c9ccd8',{s:3,h:2});
  P(c,m,k=>rr(k,520,398,44,30,8),'#58a8dc');P(c,m,k=>rr(k,566,404,16,6,3),'#3d7fb0',{s:1,h:0,ow:2});
  // 선반과 병
  P(c,m,k=>rr(k,490,300,230,10,4),'#6a4630',{s:2,h:1});[[510,'#58a8dc'],[556,'#ffcf5e'],[602,'#4fae78'],[648,'#f28a6a'],[694,'#7a6ac8']].forEach(([x,col])=>{P(c,m,k=>rr(k,x-15,264,30,36,6),col,{s:3,h:2});P(c,m,k=>rr(k,x-10,256,20,10,3),'#fff6e0',{s:1,h:0,ow:2})});
  winBox(c,m,768,236,110,120,false);
  // 냉장고
  P(c,m,k=>rr(k,900,292,112,230,10),'#8fd8c8',{s:8});P(c,m,k=>rr(k,908,300,96,74,6),'#b4eadc',{s:3,h:2,ow:2});P(c,m,k=>rr(k,908,382,96,132,6),'#b4eadc',{s:3,h:2,ow:2});P(c,m,k=>rr(k,916,330,8,34,4),'#5a546e',{s:1,h:0,ow:2});P(c,m,k=>rr(k,916,394,8,50,4),'#5a546e',{s:1,h:0,ow:2});
  P(c,m,k=>rr(k,770,470,70,10,4),'#a8744c',{s:2,h:1});P(c,m,k=>rr(k,778,480,8,42,3),'#8a5a3c',{s:2,h:0,ow:2});P(c,m,k=>rr(k,824,480,8,42,3),'#8a5a3c',{s:2,h:0,ow:2});P(c,m,k=>el(k,805,462,22,9),'#fff6e0',{s:2,h:1,ow:2})}
function F2(c,m){ // 공방
  P(c,m,k=>el(k,640,548,200,10),'#ffcf5e',{s:3,h:2});
  // 구리 관(천장 아래)
  P(c,m,k=>rr(k,270,196,740,14,7),'#e98a5a',{s:3,h:2});[[380,'#c9ccd8'],[640,'#c9ccd8'],[900,'#c9ccd8']].forEach(([x,col])=>P(c,m,k=>rr(k,x,192,16,22,3),col,{s:1,h:1,ow:2}));
  // 공구 걸이판
  P(c,m,k=>rr(k,292,232,280,150,6),'#d9b98a');if(m==='real'){c.fillStyle='rgba(90,60,40,.35)';for(let y=246;y<376;y+=16)for(let x=304;x<566;x+=16){c.beginPath();c.arc(x,y,1.6,0,7);c.fill()}}
  P(c,m,k=>rr(k,316,250,12,90,4),'#8a5a3c',{s:2,h:1,ow:2});P(c,m,k=>rr(k,300,244,44,22,5),'#8a94b8',{s:3,h:2,ow:2});
  P(c,m,k=>rr(k,376,262,12,96,4),'#c9ccd8',{s:2,h:1,ow:2});P(c,m,k=>{k.arc(382,256,15,.6,Math.PI*2-.6);k.closePath()},'#c9ccd8',{s:2,h:1,ow:2});
  P(c,m,k=>{k.moveTo(430,250);k.lineTo(520,250);k.lineTo(520,286);k.lineTo(430,270);k.closePath()},'#c9ccd8',{s:3,h:2,ow:2});P(c,m,k=>rr(k,424,244,22,32,5),'#e9596a',{s:2,h:1,ow:2});
  P(c,m,k=>rr(k,440,310,90,12,6),'#ffcf5e',{s:2,h:1,ow:2});P(c,m,k=>rr(k,440,334,70,10,5),'#3aa89a',{s:2,h:1,ow:2});
  // 작업대·바이스·구리판
  P(c,m,k=>rr(k,284,430,380,18,5),'#a8744c');P(c,m,k=>rr(k,298,448,16,74,3),'#8a5a3c',{s:2,h:0});P(c,m,k=>rr(k,634,448,16,74,3),'#8a5a3c',{s:2,h:0});P(c,m,k=>rr(k,320,470,300,12,4),'#8a5a3c',{s:2,h:1,ow:2});
  P(c,m,k=>rr(k,310,396,54,36,6),'#5a6f9a');P(c,m,k=>rr(k,356,404,40,10,4),'#c9ccd8',{s:1,h:1,ow:2});
  P(c,m,k=>rr(k,440,412,120,12,3),'#e98a5a',{s:2,h:2});P(c,m,k=>rr(k,584,398,40,32,5),'#e9596a',{s:3,h:2});P(c,m,k=>rr(k,594,388,20,12,4),'#c9ccd8',{s:1,h:1,ow:2});
  // 선반·상자·등
  P(c,m,k=>rr(k,700,300,220,10,4),'#6a4630',{s:2,h:1});[[720,44,'#58a8dc'],[776,56,'#f28a6a'],[844,40,'#7a6ac8']].forEach(([x,h,col])=>P(c,m,k=>rr(k,x,300-h,48,h,5),col,{s:4,h:3}));
  winBox(c,m,748,340,120,96,false);
  if(m==='real'){c.strokeStyle=OL;c.lineWidth=3;c.beginPath();c.moveTo(960,196);c.lineTo(960,250);c.stroke()}else bl(c,[[960,196],[960,250]],{w:1.4});P(c,m,k=>{k.moveTo(934,250);k.lineTo(986,250);k.lineTo(1004,288);k.lineTo(916,288);k.closePath()},'#3aa89a');
  // 걸상·공구함
  P(c,m,k=>rr(k,700,476,70,12,6),'#e9596a');P(c,m,k=>rr(k,708,488,8,34,3),'#6a4630',{s:2,h:0,ow:2});P(c,m,k=>rr(k,754,488,8,34,3),'#6a4630',{s:2,h:0,ow:2});
  P(c,m,k=>rr(k,890,470,116,52,8),'#f26a4b');P(c,m,k=>rr(k,890,470,116,16,6),'#c94a3c',{s:2,h:1,ow:2});P(c,m,k=>rr(k,930,456,36,16,6),'#5a546e',{s:2,h:1,ow:2})}
function F4(c,m){ // 햇빛 방
  P(c,m,k=>el(k,600,548,220,10),'#ffb23c',{s:3,h:2});
  winBox(c,m,300,220,170,190,true);winBox(c,m,510,220,170,190,true);
  // 식물 선반
  P(c,m,k=>rr(k,740,290,270,10,4),'#8a5a3c',{s:2,h:1});P(c,m,k=>rr(k,740,400,270,10,4),'#8a5a3c',{s:2,h:1});P(c,m,k=>rr(k,748,300,8,222,3),'#6a4630',{s:2,h:0,ow:2});P(c,m,k=>rr(k,994,300,8,222,3),'#6a4630',{s:2,h:0,ow:2});
  potPlant(c,m,800,290,.6,'#58a8dc');potPlant(c,m,880,290,.72,'#ffcf5e');potPlant(c,m,956,290,.56,'#e9596a');potPlant(c,m,820,400,.74,'#d9764a');potPlant(c,m,930,400,.64,'#7a6ac8');
  P(c,m,k=>rr(k,790,470,60,50,10),'#3aa89a');P(c,m,k=>{k.moveTo(850,484);k.lineTo(884,470);k.lineTo(888,478);k.lineTo(850,498);k.closePath()},'#3aa89a',{s:2,h:1});P(c,m,k=>rr(k,900,486,90,36,8),'#c98a52');
  // 흔들의자
  P(c,m,k=>rr(k,456,440,120,16,8),'#f28a6a');P(c,m,k=>rr(k,548,376,18,76,8),'#f28a6a');P(c,m,k=>rr(k,464,456,8,52,3),'#6a4630',{s:2,h:0,ow:2});P(c,m,k=>rr(k,556,456,8,52,3),'#6a4630',{s:2,h:0,ow:2});
  P(c,m,k=>{k.moveTo(440,512);k.quadraticCurveTo(520,536,600,512);k.lineTo(600,522);k.quadraticCurveTo(520,546,440,522);k.closePath()},'#8a5a3c',{s:2,h:1});
  // 매단 화분·밀짚모자
  if(m==='real'){c.strokeStyle=OL;c.lineWidth=2;c.beginPath();c.moveTo(700,170);c.lineTo(686,230);c.moveTo(700,170);c.lineTo(714,230);c.stroke()}else{bl(c,[[700,170],[686,230]],{w:1.2});bl(c,[[700,170],[714,230]],{w:1.2})}
  P(c,m,k=>{k.moveTo(676,230);k.lineTo(724,230);k.lineTo(716,256);k.lineTo(684,256);k.closePath()},'#d9764a');[[-16,.6],[0,0],[16,-.6]].forEach(([dx,r])=>P(c,m,k=>el(k,700+dx,270,8,20,r),'#4fae78',{s:3,h:2,ow:2}));
  P(c,m,k=>el(k,360,470,44,10),'#e8c98a',{s:2,h:1});P(c,m,k=>el(k,360,462,24,14),'#f2d9a0',{s:3,h:2});P(c,m,k=>rr(k,330,480,60,40,6),'#a8744c')}
const ROOMS=[
 {name:'관측실',who:'재기',home:'재기네 관측실',topic:'온도와 온도계',wall:'#d7ecdf',pat:'#c2dfcf',wain:'#9fc7b4',wain2:'#86b39e',F:F0},
 {name:'부엌',who:'국자 아저씨',home:'국자 아저씨네 부엌',topic:'두 물체의 온도',wall:'#f7e3b0',pat:'#efd398',wain:'#8fc7c2',wain2:'#74b0aa',F:F1},
 {name:'공방',who:'또각이',home:'또각이네 공방',topic:'고체와 열',wall:'#dfe3ee',pat:'#cfd5e4',wain:'#b9a88f',wain2:'#a39078',F:F2},
 {name:'거실',who:'솜이 할머니',home:'솜이 할머니 댁 거실',topic:'액체·기체와 열',wall:'#f6dfc0',pat:'#efcfa6',wain:'#d9a877',wain2:'#c48f5e',F:F3},
 {name:'햇빛 방',who:'볕이',home:'볕이네 햇빛 방',topic:'열의 이동과 단열',wall:'#fff0c4',pat:'#f7e0a0',wain:'#f2b98a',wain2:'#e0a070',F:F4}];
function roomReal(c,r){const R=ROOMS[r];c.save();c.beginPath();c.rect(RX,RY,RW,RH);c.clip();c.fillStyle=R.wall;c.fillRect(RX,RY,RW,RH);
  c.fillStyle=R.pat;for(let y=RY+14;y<430;y+=30)for(let x=RX+(Math.round((y-RY)/30)%2?16:0);x<RX+RW;x+=32){c.beginPath();c.moveTo(x,y-6);c.lineTo(x+5,y);c.lineTo(x,y+6);c.lineTo(x-5,y);c.fill()}
  c.fillStyle=R.wain;c.fillRect(RX,430,RW,90);c.fillStyle=R.wain2;for(let x=RX;x<RX+RW;x+=52)c.fillRect(x,436,3,84);c.fillStyle='#8a5a3c';c.fillRect(RX,426,RW,7);
  const fg=c.createLinearGradient(0,FY,0,RB);fg.addColorStop(0,'#c98a52');fg.addColorStop(1,'#a8693a');c.fillStyle=fg;c.fillRect(RX,FY,RW,40);c.fillStyle='rgba(70,30,60,.3)';for(let x=RX+20;x<RX+RW;x+=64){c.beginPath();c.moveTo(x,FY);c.lineTo(x-14,RB);c.lineTo(x-11,RB);c.lineTo(x+3,FY);c.fill()}
  c.fillStyle='rgba(255,240,200,.35)';c.fillRect(RX,FY,RW,3);c.fillStyle='#8a5a3c';c.fillRect(RX,FY-9,RW,9);
  let lg2=c.createRadialGradient(RX+60,RY+20,20,RX+200,RY+120,620);lg2.addColorStop(0,'rgba(255,236,170,.5)');lg2.addColorStop(1,'rgba(255,236,170,0)');c.fillStyle=lg2;c.fillRect(RX,RY,RW,RH);
  let sg=c.createLinearGradient(RX+RW-240,RY,RX+RW,RB);sg.addColorStop(0,'rgba(70,40,120,0)');sg.addColorStop(1,'rgba(70,40,120,.28)');c.fillStyle=sg;c.fillRect(RX,RY,RW,RH);
  R.F(c,'real');c.restore()}
function roomLine(c,r,mode){if(mode==='line'){c.fillStyle='rgba(234,243,255,.035)';c.fillRect(RX,RY,RW,RH);for(let x=RX+30;x<RX+RW;x+=60)bl(c,[[x,FY],[x-16,RB]],{w:1,a:.35})}bl(c,[[RX,FY],[RX+RW,FY]],{w:1.5,dash:[9,6]});ROOMS[r].F(c,mode)}
/* ── 의뢰인(양은 sheep 함수, 나머지는 여기) ── */
const CL=[{fur:'#f4f1ea',muz:'#ffffff',cloth:'#4f8fd8',leg:'#3a4a7a',ear:'rabbit'},{fur:'#a8744c',muz:'#f1dcc8',cloth:'#fff6e8',leg:'#5a3e36',ear:'bear',hat:'chef'},{fur:'#8f9ab8',muz:'#eef2fb',cloth:'#f28a3c',leg:'#4a4460',ear:'cat',hat:'goggles'},null,{fur:'#f2cf8a',muz:'#fff3d6',cloth:'#4fae78',leg:'#6a4630',ear:'dog',hat:'straw'}];
function client(c,r,x,y,s,ex,t,hop){if(r===3)return sheep(c,x,y,s,ex,t,hop);const K=CL[r];c.save();c.translate(x,y);c.fillStyle='rgba(30,20,70,.26)';c.beginPath();el(c,0,2,58*s,9*s);c.fill();
  c.translate(0,-hop);c.scale(s,s*(1+Math.sin(t*2.2+r)*.014));
  cel(c,k=>rr(k,-34,-40,18,40,7),K.leg,{s:3,h:2});cel(c,k=>rr(k,16,-40,18,40,7),K.leg,{s:3,h:2});
  if(K.ear==='dog'||K.ear==='cat'){c.save();c.translate(44,-70);c.rotate(.5+Math.sin(t*3)*.12);cel(c,k=>rr(k,-7,-44,14,50,7),K.fur,{s:3,h:2});c.restore()}
  cel(c,k=>el(k,0,-88,54,50),K.cloth,{s:10,h:6});if(K.hat==='chef')cel(c,k=>rr(k,-30,-112,60,62,10),'#f2d9c2',{s:4,h:2,ow:2});
  const arm=ex==='happy'?2.5:ex==='wow'?1.2:ex==='sad'?.1:.3;[[-48,1],[48,-1]].forEach(([ax,d])=>{c.save();c.translate(ax,-106);c.rotate(arm*d+(ex==='happy'?Math.sin(t*9)*.18*d:0));cel(c,k=>rr(k,-8,0,16,42,8),K.fur,{s:3,h:2});c.restore()});
  if(K.ear==='rabbit')[[-18,-.12],[18,.12]].forEach(([dx,rt])=>{c.save();c.translate(dx,-196);c.rotate(rt+Math.sin(t*2.4)*.04);cel(c,k=>el(k,0,-30,11,34),K.fur,{s:3,h:2});c.fillStyle='#f6b4c0';c.beginPath();el(c,0,-28,5,22);c.fill();c.restore()});
  if(K.ear==='bear')[-34,34].forEach(dx=>cel(c,k=>k.arc(dx,-196,14,0,7),K.fur,{s:3,h:2}));
  if(K.ear==='cat')[[-30,-1],[30,1]].forEach(([dx,d])=>cel(c,k=>{k.moveTo(dx-14,-190);k.lineTo(dx+d*8,-224);k.lineTo(dx+14,-192);k.closePath()},K.fur,{s:2,h:1}));
  cel(c,k=>el(k,0,-166,44,40),K.fur,{s:8,h:5});
  if(K.ear==='dog')[[-42,.3],[42,-.3]].forEach(([dx,rt])=>{c.save();c.translate(dx,-176);c.rotate(rt);cel(c,k=>el(k,0,14,12,26),mix(K.fur,'#8a5a3c',.45),{s:3,h:2});c.restore()});
  cel(c,k=>el(k,0,-154,22,16),K.muz,{s:3,h:0,ow:0});
  const blink=((t+r)%3.6)<.13;c.fillStyle=OL;c.strokeStyle=OL;c.lineWidth=3.5;c.lineCap='round';
  if(ex==='happy'){[-17,17].forEach(dx=>{c.beginPath();c.arc(dx,-170,8,Math.PI*1.1,Math.PI*1.9);c.stroke()})}
  else if(blink||ex==='sad'){[-17,17].forEach(dx=>{c.beginPath();c.moveTo(dx-7,-170+(ex==='sad'?-2:0));c.lineTo(dx+7,-170+(ex==='sad'?2*Math.sign(dx):0));c.stroke()})}
  else{const q=ex==='wow'?10:8;[-17,17].forEach(dx=>{c.beginPath();el(c,dx,-172,q*.82,q);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(dx-2.5,-175,2.8,0,7);c.fill();c.beginPath();c.arc(dx+2.5,-168,1.4,0,7);c.fill();c.fillStyle=OL})}
  c.fillStyle='rgba(255,120,130,.5)';[-30,30].forEach(dx=>{c.beginPath();el(c,dx,-156,9,5.5);c.fill()});
  c.fillStyle='#5a3a3a';c.beginPath();el(c,0,-160,6,4.5);c.fill();c.strokeStyle=OL;c.lineWidth=3;c.beginPath();
  if(ex==='happy'){c.fillStyle='#b8404e';c.arc(0,-152,10,.1,Math.PI-.1);c.closePath();c.fill();c.stroke()}else if(ex==='sad'){c.arc(0,-142,8,Math.PI*1.2,Math.PI*1.8);c.stroke()}else if(ex==='wow'){c.fillStyle='#b8404e';el(c,0,-147,5,7);c.fill();c.stroke()}else{c.arc(0,-153,7,.3,Math.PI-.3);c.stroke()}
  if(K.hat==='chef'){cel(c,k=>rr(k,-34,-214,68,22,6),'#ffffff',{s:3,h:0});cel(c,k=>blob(k,0,-232,40,22,7),'#ffffff',{s:5,h:0})}
  if(K.hat==='goggles'){cel(c,k=>rr(k,-40,-200,80,12,6),'#5a3e36',{s:1,h:0,ow:2});[-18,18].forEach(dx=>cel(c,k=>k.arc(dx,-198,13,0,7),'#9fe0f0',{s:3,h:3,ow:3}))}
  if(K.hat==='straw'){cel(c,k=>el(k,0,-200,64,13),'#f2d9a0',{s:4,h:3});cel(c,k=>{k.moveTo(-32,-202);k.quadraticCurveTo(-30,-240,0,-240);k.quadraticCurveTo(30,-240,32,-202);k.closePath()},'#f2d9a0',{s:5,h:4});cel(c,k=>rr(k,-33,-212,66,10,3),'#e9596a',{s:1,h:0,ow:2})}
  c.restore()}
