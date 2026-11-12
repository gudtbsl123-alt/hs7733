'use strict';
const W=1280,H=720,TEST=/[?&]test=1/.test(location.search);let LOW=/[?&]low=1/.test(location.search);try{if(localStorage.getItem('ddakkeun_low')==='1')LOW=true}catch(e){}
const stage=document.getElementById('game'),cv=document.getElementById('cv'),g=cv.getContext('2d');
let DPR=LOW?1:Math.min(2,window.devicePixelRatio||1);
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);stage.style.width=W*s+'px';stage.style.height=H*s+'px';stage.style.fontSize=16*s+'px';if(window.rotReady)checkRot()}
addEventListener('resize',fit);fit();cv.width=W*DPR;cv.height=H*DPR;
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w*DPR;c.height=h*DPR;const x=c.getContext('2d');x.scale(DPR,DPR);return{c,g:x}};
let seed=11;const S=()=>{seed=(seed*16807)%2147483647;return seed/2147483647},SR=(a,b)=>a+S()*(b-a);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,back=t=>{const c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const hex=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]};
const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const RX=250,RY=170,RW=780,RH=390,FY=520,RB=RY+RH,PX0=14,PX1=1266;
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
