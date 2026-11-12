/* ── 온도 색·흐름 띠 ── */
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
function fitT(c,str,x,y,sz,font,col,maxW){c.font=sz+'px '+font;const w=c.measureText(str).width;T(c,str,x,y,w>maxW?Math.max(24,Math.floor(sz*maxW/w)):sz,font,col)}
