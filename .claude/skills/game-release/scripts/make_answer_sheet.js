// 게시판 올리기용 "정답표" 그림 만들기 (세로형, 폭 900px, 높이는 문항 수에 맞춰 늘어남)
// 휴대폰으로 게시글을 볼 때 표가 잘리지 않도록 정답을 그림 한 장으로 준다.
// 사용법: node make_answer_sheet.js <answers.json> <저장할 PNG 경로>
//
// answers.json 예시 (release/<게임이름>/answers.json 으로 두면 고쳐서 다시 만들 수 있다)
// {
//   "badge":  "4학년 2학기 사회 · 2단원",
//   "title":  "골목 민원 해결단",
//   "accent": "#ffd04a",                         // 게임 대표 색 (선택)
//   "groups": [                                   // 구역·스테이지·난이도별 묶음 (1개 이상)
//     { "name": "큰길 골목", "sub": "(1) 지역문제의 해결",   // sub는 선택
//       "items": [ { "no": 1, "q": "문제를 짧게 줄인 말", "a": "정답" }, ... ] }
//   ],
//   "footer": "카드 순서는 할 때마다 바뀌어요"     // 맨 아래 한 줄 (선택)
// }
// 정답(a)은 게임 파일의 정답 문구를 그대로 쓴다. 여러 개면 " / ", 순서는 " → "로 잇는다.

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const jsonPath = path.resolve(process.argv[2] || 'answers.json');
const outPath = path.resolve(process.argv[3] || 'answer_sheet.png');
const A = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

if (!Array.isArray(A.groups) || !A.groups.length) { console.error('groups가 비어 있어요.'); process.exit(1); }
const accent = A.accent || '#f59e0b';
const GCOL = ['#2563eb', '#16a34a', '#9333ea', '#ea580c', '#db2777', '#0d9488', '#ca8a04', '#4f46e5'];
/* 정답이 여러 개(" / ")면 한 줄에 하나씩 · 를, 순서(" → ")면 ①②③을 붙여 보여 준다 */
const ansHtml = a => { const t = String(a), seq = t.split(' → '), parts = t.split(' / ');
  if (seq.length > 1) return seq.map((p, i) => `<div class="multi">${'①②③④⑤⑥⑦⑧⑨'[i] || (i + 1) + '.'} ${esc(p)}</div>`).join('');   /* 순서 문제는 ①②③ 줄로 */
  return parts.length > 1 ? parts.map(p => `<div class="multi">· ${esc(p)}</div>`).join('') : esc(t); };
const total = A.groups.reduce((n, g) => n + g.items.length, 0);

const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><style>
*{ box-sizing:border-box; margin:0; }
body{ width:900px; font-family:"Pretendard","Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR","Noto Sans CJK KR",sans-serif; color:#1f2937; background:#f8fafc; }
.wrap{ padding:44px 40px 40px; }
.head{ text-align:center; margin-bottom:30px; }
.badge{ display:inline-block; padding:8px 22px; border-radius:30px; background:#1e293b; color:#fff; font-weight:800; font-size:26px; }
h1{ margin-top:14px; font-size:56px; font-weight:900; letter-spacing:-1px; color:#1e293b; }
h1 em{ font-style:normal; color:#1e293b; background:linear-gradient(transparent 58%, ${accent} 58%); padding:0 6px; }
.count{ margin-top:8px; font-size:26px; color:#64748b; font-weight:700; }
.grp{ background:#fff; border:3px solid #1e293b; border-radius:24px; margin-bottom:26px; overflow:hidden; box-shadow:0 6px 0 #1e293b; }
.gh{ display:flex; align-items:baseline; gap:14px; padding:14px 26px; color:#fff; }
.gh b{ font-size:34px; font-weight:900; }
.gh span{ font-size:24px; font-weight:700; opacity:.9; }
.row{ display:flex; gap:18px; padding:16px 26px; border-top:2px solid #e2e8f0; align-items:flex-start; }
.row:first-of-type{ border-top:0; }
.no{ flex:none; width:52px; height:52px; border-radius:50%; color:#fff; font-size:28px; font-weight:900; display:flex; align-items:center; justify-content:center; margin-top:2px; }
.txt{ flex:1; min-width:0; word-break:keep-all; overflow-wrap:anywhere; }
.q{ font-size:25px; color:#64748b; font-weight:600; line-height:1.35; }
.a{ margin-top:4px; font-size:34px; font-weight:900; line-height:1.3; color:#111827; }
.multi{ padding-left:36px; text-indent:-36px; }
.foot{ text-align:center; margin-top:8px; font-size:24px; color:#475569; font-weight:700; }
</style></head><body><div class="wrap">
  <div class="head">${A.badge ? `<span class="badge">${esc(A.badge)}</span>` : ''}<h1><em>${esc(A.title)}</em> 정답표</h1><div class="count">모두 ${total}문항</div></div>
  ${A.groups.map((g, gi) => `<div class="grp"><div class="gh" style="background:${GCOL[gi % GCOL.length]}"><b>${esc(g.name)}</b>${g.sub ? `<span>${esc(g.sub)}</span>` : ''}</div>
    ${g.items.map(it => `<div class="row"><div class="no" style="background:${GCOL[gi % GCOL.length]}">${esc(it.no)}</div><div class="txt">${it.q ? `<div class="q">${esc(it.q)}</div>` : ''}<div class="a">${ansHtml(it.a)}</div></div></div>`).join('')}</div>`).join('')}
  ${A.footer ? `<div class="foot">${esc(A.footer)}</div>` : ''}
</div></body></html>`;

(async () => {
  const preinstalled = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled } : {});
  const page = await browser.newPage({ viewport: { width: 900, height: 800 } });
  await page.setContent(html);
  await page.waitForTimeout(300);
  /* 점검: 정답이 너무 길면(휴대폰에서 한눈에 안 들어옴) 알린다 */
  const warn = await page.evaluate(() => [...document.querySelectorAll('.row')].map(r => {
    const a = r.querySelector('.a'), lines = Math.round(a.getBoundingClientRect().height / parseFloat(getComputedStyle(a).lineHeight));
    const parts = Math.max(1, a.querySelectorAll('.multi').length), limit = parts > 1 ? parts * 2 : 3;   /* 정답 하나는 3줄, 여러 개면 하나에 2줄까지 */
    return lines > limit ? `${r.querySelector('.no').textContent}번 정답이 ${lines}줄이에요. 짧게 줄일 수 있는지 보세요.` : null;
  }).filter(Boolean));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath, fullPage: true });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  await browser.close();
  console.log('저장:', outPath, `(900×${h})`);
  console.log(`문항 ${total}개`);
  if (warn.length) console.log('⚠ ' + warn.join('\n⚠ ')); else console.log('✅ 모든 정답이 짧게 들어감');
})();
