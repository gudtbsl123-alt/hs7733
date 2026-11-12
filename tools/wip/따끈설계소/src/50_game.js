/* ── 상태·저장 ── */
const TRAY={x:250,y:606,w:560,h:106},SW={x:846,y:604,w:128,h:110},NEXT={x:1092,y:318,w:160,h:84},KEY='ddakkeun_v1';
const G={scene:'title',t:0,tt:0,name:'',done:{},wrongs:[],time:0,room:0,stars:[],puffs:[],pull:0,hop:0,paused:false,muted:false,best:0,zoom:0,toRoom:-1,quiet:false};
let Q=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify({name:G.name,done:G.done,wrongs:G.wrongs,time:G.time,best:G.best}))}catch(e){}}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
const doneCount=()=>Object.keys(G.done).length,firstCount=()=>Object.values(G.done).filter(d=>d.first).length,roomDone=r=>roomItems(r).filter(it=>G.done[it.no]).length;
const curRoom=()=>{for(let r=0;r<5;r++)if(roomDone(r)<6)return r;return 5};
const snow=[];for(let i=0;i<46;i++)snow.push({x:SR(1056,1280),y:SR(0,590),v:SR(14,34),r:SR(1.5,3.2),p:SR(0,6)});
function star(x,y,n,cols){for(let i=0;i<n;i++){const a=SR(0,6.28),v=SR(120,420);G.stars.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-160,l:SR(.6,1.2),t:0,r:SR(5,11),c:cols[i%cols.length],sp:SR(-6,6),k:i%3})}}
function puff(x,y,n){for(let i=0;i<n;i++)G.puffs.push({x,y,vx:SR(-70,70),vy:SR(-60,10),t:0,l:SR(.3,.6),r:SR(4,9)})}
const CONF=['#ffd23f','#ff8a5a','#ffffff','#7fe0d0'];
/* ── 문항 열기·자리 잡기 ── */
function shuf(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function wrap(c,str,maxW){const out=[];let ln='';for(const w of str.split(' ')){const t=ln?ln+' '+w:w;if(c.measureText(t).width>maxW&&ln){out.push(ln);ln=w}else ln=t}if(ln)out.push(ln);return out}
function mkTok(kind,label,i,n){let w=60,h=70;if(kind==='word'){g.font='24px SunB';w=Math.max(104,g.measureText(label).width+44);h=54}if(kind==='part'){w=116;h=62}
  const hx=TRAY.x+TRAY.w*(i+.5)/n,hy=TRAY.y+(kind==='word'?53:46);return{kind,label,x:hx,y:hy,tx:hx,ty:hy,hx,hy,w,h,slot:-1,wob:0,sc:1}}
function openItem(no){const it=ITEMS[no-1];Q={it,no,phase:'ask',tries:0,cool:0,pend:0,simT:0,okT:0,hintT:0,rv:0,born:G.t,toks:[],slots:[],perm:[],sel:-1,drag:-1,choice:-1,simOK:true,figR:null,words:[],rows:[]};G.room=it.room;G.scene='play';layout(Q)}
function layout(Q){const it=Q.it,n=it.opts?it.opts.length:0,gp=10;
  if(it.kind==='pick'){Q.perm=[...Array(n).keys()];if(it.lay==='cards'||it.shuffle)shuf(Q.perm);let rects;
    if(it.lay==='cards'){if(n===3)rects=[0,1,2].map(i=>({x:SHT.x+8,y:SHT.y+8+i*120,w:SHT.w-16,h:110}));
      else if(n===4){const w=(SHT.w-16-gp)/2,h=(SHT.h-16-gp)/2;rects=[0,1,2,3].map(i=>({x:SHT.x+8+(i%2)*(w+gp),y:SHT.y+8+Math.floor(i/2)*(h+gp),w,h}))}
      else{const w=(SHT.w-16-gp)/2,h=(SHT.h-16-2*gp)/3,cells=[0,1,2,3,4,5].map(i=>({x:SHT.x+8+(i%2)*(w+gp),y:SHT.y+8+Math.floor(i/2)*(h+gp),w,h}));Q.figR=cells[0];rects=cells.slice(1)}}
    else rects=FIGS[it.fig].slots(Q);
    rects.forEach((r,i)=>Q.slots.push({...r,opt:Q.perm[i],label:it.opts[Q.perm[i]],correct:Q.perm[i]===it.ans,tok:-1,shake:0}));Q.toks.push(mkTok('pin','핀',0,1))}
  else if(it.kind==='sort'){const order=shuf(it.tokens.slice());order.forEach((s,i)=>Q.toks.push(mkTok('word',s,i,order.length)));
    if(it.lay==='blank'){g.font='30px SunB';const maxW=SHT.w-90,sp=11,bw=156,lines=[[]];let x=0;
      for(const w of it.text.split(' ')){const m=/^\{(\d)\}$/.exec(w),ww=m?bw:g.measureText(w).width;if(x+ww>maxW&&lines[lines.length-1].length){lines.push([]);x=0}lines[lines.length-1].push({s:w,ww,m:m?+m[1]:-1,x});x+=ww+sp}
      const lh=66,y0=SHT.y+SHT.h/2-(lines.length-1)*lh/2;lines.forEach((ln,li)=>{const last=ln[ln.length-1],ox=SHT.x+(SHT.w-(last.x+last.ww))/2;ln.forEach(o=>{const X=ox+o.x,Y=y0+li*lh;if(o.m>=0)Q.slots[o.m]={x:X,y:Y-29,w:bw,h:58,need:it.ans[o.m],tok:-1,shake:0,label:'빈칸'};else Q.words.push({s:o.s,x:X,y:Y})})})}
    else if(it.lay==='rows'){g.font='26px SunB';it.rows.forEach((s,i)=>{const y=SHT.y+12+i*118;Q.rows.push({lines:wrap(g,s,470),x:SHT.x+64,y,h:106});Q.slots.push({x:SHT.x+SHT.w-212,y:y+24,w:178,h:58,need:it.ans[i],tok:-1,shake:0,label:s})})}
    else FIGS[it.fig].slots(Q).forEach((r,i)=>Q.slots.push({...r,need:it.ans[i],tok:-1,shake:0,label:it.slots[i]}))}
  else{[{x:292,y:204,w:124,h:66},{x:292,y:454,w:124,h:66}].forEach((r,i)=>Q.slots.push({...r,label:it.opts[i],correct:i===it.ans,tok:-1,shake:0}));Q.toks.push(mkTok('part',it.part==='heater'?'난방기':'냉방기',0,1));Q.tTop=Q.tBot=it.part==='heater'?8:31}}
/* ── 조작 ── */
function pos(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}}
const inR=(p,x,y,w,h)=>p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h;
function slotAt(p,pad){for(let i=0;i<Q.slots.length;i++){const s=Q.slots[i];if(inR(p,s.x-pad,s.y-pad,s.w+pad*2,s.h+pad*2))return i}return-1}
function tokAt(p){for(let i=Q.toks.length-1;i>=0;i--){const k=Q.toks[i];if(Math.abs(p.x-k.x)<k.w/2+8&&Math.abs(p.y-k.y)<k.h/2+8)return i}return-1}
function goHome(i){const k=Q.toks[i];if(k.slot>=0){Q.slots[k.slot].tok=-1;k.slot=-1}k.tx=k.hx;k.ty=k.hy}
function put(ti,si){const s=Q.slots[si],k=Q.toks[ti];if(s.tok>=0&&s.tok!==ti)goHome(s.tok);if(k.slot>=0)Q.slots[k.slot].tok=-1;k.slot=si;s.tok=ti;k.tx=s.x+s.w/2;k.ty=s.y+s.h/2;k.wob=1;Q.sel=-1;sfx.snap();puff(k.tx,k.ty+s.h/2,6)}
function choose(si){const s=Q.slots[si],k=Q.toks[0];Q.choice=si;k.slot=si;k.tx=s.cx!==undefined?s.cx+30:s.x+30;k.ty=s.cy!==undefined?s.cy-34:s.y+12;k.wob=1;Q.pend=.35;sfx.snap()}
const filled=()=>Q.it.kind==='place'?Q.toks[0].slot>=0:Q.slots.every(s=>s.tok>=0);
function evalAns(){const it=Q.it;if(it.kind==='pick')return Q.slots[Q.choice].correct;if(it.kind==='place')return Q.slots[Q.toks[0].slot].correct;return Q.slots.every(s=>s.tok>=0&&Q.toks[s.tok].label===s.need)}
function myAnswer(){const it=Q.it;if(it.kind==='pick')return Q.slots[Q.choice].label;if(it.kind==='place')return Q.slots[Q.toks[0].slot].label;return Q.slots.map(s=>s.tok>=0?Q.toks[s.tok].label:'(빈칸)').join(' / ')}
function pullLever(){if(!filled()){Q.toks.forEach(k=>{if(k.slot<0)k.wob=1});sfx.tick();return}Q.phase='sim';Q.simT=0;G.pull=1;Q.simOK=evalAns();Q.simDur=Q.it.lay==='room'?3.2:Q.it.lay==='two'?1.6:.7;sfx.lever()}
function judge(ok){if(ok){Q.phase=Q.it.lay==='room'?'reveal':'ok';Q.okT=0;Q.rv=0;if(!G.done[Q.no])G.done[Q.no]={first:Q.tries===0};save();sfx.ok();G.hop=1;if(Q.it.lay!=='room')star(640,360,22,CONF)}
  else{Q.phase='hint';Q.tries++;Q.cool=1.6;Q.hintT=0;if(Q.tries===1&&!G.done[Q.no])G.wrongs.push({no:Q.no,my:myAnswer()});save();sfx.no();Q.slots.forEach((s,i)=>{if(s.tok>=0||i===Q.choice)s.shake=1})}}
function clearTry(){Q.toks.forEach((k,i)=>goHome(i));Q.choice=-1;Q.sel=-1;Q.phase='ask';if(Q.it.lay==='room')Q.tTop=Q.tBot=Q.it.part==='heater'?8:31}
function nextItem(skip){const r=G.room,nx=roomItems(r).find(it=>!G.done[it.no]);if(nx){openItem(nx.no);return}
  if(skip){if(doneCount()>=30)goResult();else{G.scene='select';G.tt=0}return}G.scene='roomdone';G.tt=0;sfx.ok();star(640,300,40,CONF)}
function enterRoom(r){const nx=roomItems(r).find(it=>!G.done[it.no]);if(nx)openItem(nx.no)}
function goResult(){G.scene='result';G.tt=0;const f=firstCount();if(f>G.best)G.best=f;save();if(!G.quiet)star(640,300,50,CONF)}
function playDown(p){if(Q.phase==='ok'){if(Q.okT>.9&&inR(p,NEXT.x-10,NEXT.y-10,NEXT.w+20,NEXT.h+20)){sfx.pick();nextItem()}return}
  if(Q.phase!=='ask'||Q.cool>0||Q.pend>0||G.t-Q.born<.35)return;const pick=Q.it.kind==='pick';
  const ti=tokAt(p);if(ti>=0){const k=Q.toks[ti];Q.drag=ti;k.moved=false;k.ox=p.x-k.x;k.oy=p.y-k.y;k.px=p.x;k.py=p.y;sfx.pick();return}
  const si=slotAt(p,pick?0:8);if(si>=0){if(pick){choose(si);return}const s=Q.slots[si];if(Q.sel>=0){put(Q.sel,si);return}if(s.tok>=0){goHome(s.tok);sfx.back();return}const free=Q.toks.map((k,i)=>k.slot<0?i:-1).filter(i=>i>=0);if(Q.toks.length===1||free.length===1){put(free.length?free[0]:0,si)}return}
  if(!pick&&inR(p,SW.x-6,SW.y-6,SW.w+12,SW.h+12))pullLever()}
function playMove(p){if(Q.drag<0)return;const k=Q.toks[Q.drag];if(Math.hypot(p.x-k.px,p.y-k.py)>8)k.moved=true;k.x=p.x-k.ox;k.y=p.y-k.oy;k.tx=k.x;k.ty=k.y}
function playUp(){if(!Q||Q.drag<0)return;const ti=Q.drag,k=Q.toks[ti];Q.drag=-1;const pick=Q.it.kind==='pick';
  if(!k.moved){if(pick){k.tx=k.hx;k.ty=k.hy;k.wob=1}else if(k.slot>=0){goHome(ti);sfx.back()}else{Q.sel=Q.sel===ti?-1:ti;k.tx=k.hx;k.ty=k.hy}return}
  const si=slotAt({x:k.x,y:k.y},pick?6:34);if(si<0){goHome(ti);sfx.back();return}if(pick)choose(si);else put(ti,si)}
/* ── 방 실험(난방기·냉방기)의 온도 모형: 게임 속 본보기 값 ── */
function fLoop(u,v,p){const along=v<.5?u*.5+(1-v)*.2:(1-u)*.5+.5+(v-.5)*.2,near=Math.max(0,1-Math.hypot(u-.13,(v-.82)*.6)/.3);return clamp(p*1.5-along*.55)*(.74-.2*along)+near*.3*Math.min(1,p*3)}
function fBand(u,v,p){const near=Math.max(0,1-Math.hypot(u-.13,(v-.17)*.6)/.26);return clamp(p*1.35-u*.3)*clamp(1-(v-.14)/.26)*.8+near*.2*Math.min(1,p*3)}
function roomHeat(u,v,p){const heat=Q.it.part==='heater',si=Q.toks[0].slot,right=Q.slots[si]&&Q.slots[si].correct;if(heat)return right?fLoop(u,v,p):fBand(u,v,p);const cool=right?fLoop(u,1-v,p):fBand(u,1-v,p);return .7-cool*.72}
const mirrorP=P=>P.map(([x,y])=>[x,RY+FY-y]);PATH.Bm=mirrorP(PATH.B);PATH.Am=mirrorP(PATH.A);
/* ── 한 걸음 ── */
function updatePlay(dt){if(!Q)return;G.time+=dt;
  Q.toks.forEach((k,i)=>{if(Q.drag!==i){k.x=lerp(k.x,k.tx,1-Math.pow(.0005,dt));k.y=lerp(k.y,k.ty,1-Math.pow(.0005,dt))}k.wob=Math.max(0,k.wob-dt*3);k.sc=lerp(k.sc,Q.drag===i?1.12:1,1-Math.pow(.001,dt))});
  Q.slots.forEach(s=>{s.shake=Math.max(0,s.shake-dt*2)});if(Q.cool>0)Q.cool=Math.max(0,Q.cool-dt);
  if(Q.pend>0){Q.pend-=dt;if(Q.pend<=0){Q.pend=0;judge(evalAns())}}
  if(Q.phase==='sim'){Q.simT+=dt;if(Q.it.lay==='room'){const p=ease(clamp(Q.simT/Q.simDur)),pb=clamp(p*1.5-.5),h=Q.it.part==='heater';
      if(h){Q.tTop=Q.simOK?8+13*clamp(p*1.25-.15):8+16*clamp(p*1.3-.2);Q.tBot=Q.simOK?8+12*pb:8+.6*p}else{Q.tBot=Q.simOK?31-6*clamp(p*1.25-.15):31-9*clamp(p*1.3-.2);Q.tTop=Q.simOK?31-5*pb:31-.6*p}}
    if(Q.simT>=Q.simDur+.3)judge(Q.simOK)}
  else if(Q.phase==='hint'){Q.hintT+=dt;if(Q.cool<=0&&Q.hintT>1.7)clearTry()}
  else if(Q.phase==='reveal'){Q.rv+=dt/.9;if(Q.rv>=1){Q.rv=1;Q.phase='ok';Q.okT=0;star(640,360,26,CONF)}}
  else if(Q.phase==='ok')Q.okT+=dt}
function updateFx(dt){G.pull=Math.max(0,G.pull-dt*2.2);G.hop=Math.max(0,G.hop-dt*1.6);
  for(const s of snow){s.y+=s.v*dt;s.x+=Math.sin(G.t*1.3+s.p)*8*dt;if(s.y>592){s.y=-4;s.x=SR(1056,1280)}}
  G.stars=G.stars.filter(s=>(s.t+=dt)<s.l);for(const s of G.stars){s.vy+=520*dt;s.x+=s.vx*dt;s.y+=s.vy*dt}
  G.puffs=G.puffs.filter(s=>(s.t+=dt)<s.l);for(const s of G.puffs){s.x+=s.vx*dt;s.y+=s.vy*dt}}
