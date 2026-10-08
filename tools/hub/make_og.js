// 허브 링크 미리보기 그림(og.png, 1200×630)을 만든다. 카카오톡·인디스쿨·밴드에 주소를 붙이면 이 그림이 뜬다.
// 사용법(저장소 맨 위에서): NODE_PATH=/opt/node22/lib/node_modules node tools/hub/make_og.js
// 글꼴은 docs/fonts의 OFL 글꼴, 게임 화면은 release/ 캡처를 쓴다. 게임 개수는 바뀌므로 그림에 넣지 않는다.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'og.png');
const SHOTS = [                                   // 뒤 → 앞 순서
  'release/빛줄기 서커스/screenshots/02_초반_문제.png',
  'release/지구 궤도 관제사/screenshots/01_시작화면_이름쓰기.png',
  'release/골목 민원 해결단/screenshots/02_초반_문제.png',
];
const b64 = f => fs.readFileSync(path.join(ROOT, f)).toString('base64');
const font = (name, file) => `@font-face{font-family:'${name}';src:url(data:font/ttf;base64,${b64('docs/fonts/' + file)}) format('truetype')}`;

const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><style>
${font('BHS', 'BlackHanSans-Regular.ttf')}
${font('DH', 'DoHyeon-Regular.ttf')}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;position:relative;background:#f3ffe3;font-family:'DH',sans-serif;color:#000}
.grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(0,0,0,.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,.06) 1px,transparent 1px);
  background-size:34px 34px}
.frame{position:absolute;inset:0;box-shadow:inset 0 0 0 6px #000}
.left{position:absolute;left:64px;top:58px;width:560px;z-index:5}
.brand{display:flex;align-items:center;gap:14px;font-size:31px}
.brand svg{width:46px;height:58px;transform:rotate(-4deg)}
h1{margin-top:26px;font-family:'BHS',sans-serif;font-weight:400;font-size:82px;line-height:1.06;letter-spacing:-1px}
h1 em{font-style:normal;background:linear-gradient(transparent 60%,#d4ff5b 60%);padding:0 4px}
.sub{margin-top:22px;font-size:32px;color:#222}
.pills{display:flex;gap:14px;margin-top:26px}
.pill{padding:9px 20px 7px;border-radius:100px;background:#fff;box-shadow:inset 0 0 0 3px #000,5px 5px 0 0 #000;font-size:26px}
.shot{position:absolute;width:480px;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:#000;
  box-shadow:0 0 0 5px #000,12px 12px 0 5px #000}
.shot img{width:100%;height:100%;object-fit:cover;display:block}
.s0{left:690px;top:30px;transform:rotate(6deg)}
.s1{left:740px;top:212px;transform:rotate(-4deg)}
.s2{left:650px;top:378px;transform:rotate(2.5deg)}
</style></head><body><div class="grid"></div>
<div class="left">
  <div class="brand"><svg viewBox="0 0 132 168"><rect x="4" y="4" width="124" height="160" rx="16" fill="#fff" stroke="#000" stroke-width="8"/>
    <rect x="18" y="18" width="96" height="70" rx="6" fill="#699bf7" stroke="#000" stroke-width="8"/><rect x="28" y="66" width="76" height="6"/>
    <rect x="34" y="34" width="10" height="10"/><rect x="82" y="30" width="10" height="10"/><rect x="24" y="112" width="14" height="38" rx="3"/>
    <rect x="12" y="124" width="38" height="14" rx="3"/><circle cx="96" cy="118" r="9"/><circle cx="78" cy="136" r="9"/></svg>에듀테크 게임 저장소</div>
  <h1>링크 하나로<br>바로 하는<br><em>수업 게임</em></h1>
  <p class="sub">초등 3~6학년 · 교과서 단원별로 골라 쓰기</p>
  <div class="pills"><span class="pill">설치 없음</span><span class="pill">로그인 없음</span><span class="pill">광고 없음</span></div>
</div>
${SHOTS.map((f, i) => `<div class="shot s${i}"><img src="data:image/png;base64,${b64(f)}"></div>`).join('')}
<div class="frame"></div>
</body></html>`;

(async () => {
  const preinstalled = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled } : {});
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({ path: OUT });
  await browser.close();
  console.log('저장:', OUT, (fs.statSync(OUT).size / 1024).toFixed(0) + 'KB');
})();
