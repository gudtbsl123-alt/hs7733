// 교실 TV용 "이것만 기억해요" 안내판 이미지 만들기 (1920×1080 PNG)
// 사용법: node make_tv_guide.js <안내.json> <저장할 PNG 경로>
//
// 안내.json 예시 (release/<게임이름>/tv_guide.json 으로 저장해 두면 다음에 고쳐서 다시 만들 수 있다)
// {
//   "badge":   "5학년 2학기 국어 · 2단원",
//   "title":   "말이 되는 섬",
//   "accent":  "#f59e0b",                                  // 게임 대표 색 (선택)
//   "background": "screenshots/02_초반_문제.png",           // 흐리게 깔 게임 화면 (선택, json 파일 기준 경로)
//   "items": [ "...", "...", "...", "...", "..." ],          // 정확히 5개, 각각 한 문장
//   "footer":  "📖 글이 긴 문제는 '크게 보기'로 읽어요"       // 맨 아래 한 줄 (선택)
// }
//
// 문장 안에서 쓸 수 있는 표시
//   [[스페이스]]  → 키보드 키 모양          **정답 문**  → 강조 색(빨강)
//   {파랑:위 문} {초록:가운데} {주황:아래} {보라:…} {빨강:…}  → 그 색 글자

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const jsonPath = path.resolve(process.argv[2] || 'tv_guide.json');
const outPath = path.resolve(process.argv[3] || 'tv_guide.png');
const G = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const COLORS = { 파랑:'#1d4ed8', 초록:'#15803d', 주황:'#c2410c', 보라:'#7e22ce', 빨강:'#dc2626' };
function mark(s){
  return esc(s)
    .replace(/\[\[(.+?)\]\]/g, '<span class="key">$1</span>')
    .replace(/\*\*(.+?)\*\*/g, '<b class="hi">$1</b>')
    .replace(/\{(파랑|초록|주황|보라|빨강):(.+?)\}/g, (m, c, t) => `<b style="color:${COLORS[c]}">${t}</b>`);
}
function dataUrl(p){
  if(!p) return '';
  const f = path.resolve(path.dirname(jsonPath), p);
  if(!fs.existsSync(f)){ console.log('⚠ 배경 그림이 없어 단색 배경으로 만듭니다:', p); return ''; }
  const ext = path.extname(f).slice(1).toLowerCase().replace('jpg', 'jpeg');
  return `data:image/${ext};base64,` + fs.readFileSync(f).toString('base64');
}

if(!Array.isArray(G.items) || G.items.length !== 5) { console.error('items는 정확히 5개여야 합니다.'); process.exit(1); }
const accent = G.accent || '#f59e0b';
const bg = dataUrl(G.background);
const NUM_COL = ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6'];

const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><style>
*{ box-sizing:border-box; margin:0; }
:root{ --fs:48px; --rowh:132px; --gap:20px; }
body{ width:1920px; height:1080px; overflow:hidden; font-family:"Pretendard","Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR","Noto Sans CJK KR",sans-serif; color:#2a1a0c;
  background:${bg ? '#1e293b' : 'linear-gradient(180deg,#bfe6fb,#fdf6e3)'}; }
.bg{ position:absolute; inset:-30px; background:url('${bg}') center/cover; filter:blur(10px) saturate(1.1); opacity:.9; }
.veil{ position:absolute; inset:0; background:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,.35)); }
.wrap{ position:absolute; inset:0; padding:56px 80px 48px; display:flex; flex-direction:column; }
.head{ display:flex; align-items:center; gap:26px; margin-bottom:28px; }
.badge{ flex:none; padding:12px 26px; border-radius:40px; background:#1e293b; color:#fff; font-weight:900; font-size:30px; }
h1{ font-size:76px; font-weight:900; line-height:1.1; color:#fff; letter-spacing:-1px;
  text-shadow:4px 0 0 #3b2412,-4px 0 0 #3b2412,0 4px 0 #3b2412,0 -4px 0 #3b2412,3px 3px 0 #3b2412,-3px 3px 0 #3b2412,3px -3px 0 #3b2412,-3px -3px 0 #3b2412,0 9px 0 #3b2412,0 16px 22px rgba(0,0,0,.3); }
h1 em{ font-style:normal; color:${accent}; }
.rows{ display:flex; flex-direction:column; gap:var(--gap); flex:1; justify-content:center; min-height:0; }
.row{ display:flex; align-items:center; gap:30px; min-height:var(--rowh); padding:14px 40px 14px 26px; background:#fffdf7; border:6px solid #3b2412; border-radius:30px; box-shadow:0 10px 0 #3b2412, 0 18px 30px rgba(0,0,0,.18); }
.num{ flex:none; width:92px; height:92px; border-radius:22px; border:6px solid #3b2412; color:#fff; font-size:56px; font-weight:900; display:flex; align-items:center; justify-content:center; text-shadow:0 3px 0 rgba(0,0,0,.25); }
.txt{ flex:1; font-size:var(--fs); font-weight:800; line-height:1.3; word-break:keep-all; }
.txt .hi{ color:#dc2626; }
.key{ display:inline-block; padding:2px 18px; margin:0 4px; border-radius:14px; background:#1e293b; color:#fff; font-weight:900; font-size:.86em; box-shadow:0 5px 0 #0f172a; vertical-align:.08em; }
.foot{ align-self:center; margin-top:26px; padding:14px 36px; border-radius:40px; background:#1e293b; color:#fff; font-size:34px; font-weight:800; }
</style></head><body>
${bg ? '<div class="bg"></div><div class="veil"></div>' : ''}
<div class="wrap">
  <div class="head">${G.badge ? `<span class="badge">${esc(G.badge)}</span>` : ''}<h1><em>${esc(G.title)}</em> — 이것만 기억해요</h1></div>
  <div class="rows">${G.items.map((t, i) => `<div class="row"><div class="num" style="background:${NUM_COL[i]}">${i + 1}</div><div class="txt">${mark(t)}</div></div>`).join('')}</div>
  ${G.footer ? `<div class="foot">${mark(G.footer)}</div>` : ''}
</div></body></html>`;

(async () => {
  const preinstalled = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled } : {});
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.setContent(html);
  await page.waitForTimeout(300);
  /* 뒷자리에서도 읽히게: 글자는 48px부터 시작해 넘치면 42px까지만 줄인다. 그래도 넘치면 문장을 줄이라고 알린다 */
  const measure = () => page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.txt').forEach((el, i) => {
      const lh = parseFloat(getComputedStyle(el).lineHeight), lines = Math.round(el.getBoundingClientRect().height / lh);
      if(lines > 1) out.push(`${i + 1}번 문장이 ${lines}줄이에요. 한 줄로 줄이면 더 잘 보여요.`);
    });
    const w = document.querySelector('.wrap'), last = w.lastElementChild.getBoundingClientRect();
    const over = w.scrollHeight > 1080 + 2 || last.bottom > 1080 - 20;
    return { out, over };
  });
  let m, size;
  for(size of [48, 46, 44, 42]){
    await page.evaluate(sz => { const r=document.documentElement.style; r.setProperty('--fs', sz+'px'); r.setProperty('--rowh', Math.round(sz*2.7)+'px'); r.setProperty('--gap', Math.round(sz*.4)+'px'); }, size);
    m = await measure();
    if(!m.over && !m.out.length) break;
  }
  const check = m.out.slice(); if(m.over) check.push('전체가 화면 밖으로 넘쳐요. 문장이나 아래 한 줄을 줄여 주세요.');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath });
  await browser.close();
  console.log('저장:', outPath);
  console.log(`글자 크기 ${size}px`);
  if(check.length) console.log('⚠ ' + check.join('\n⚠ ')); else console.log('✅ 모든 문장이 한 줄 · 화면 안에 들어감');
})();
