// 「고려 활자 인쇄소」 스크린샷 8장 자동 캡처 (보스전 없음)
// 사용법: node capture.js <게임 HTML 경로> <저장 폴더>

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const gameFile = path.resolve(process.argv[2] || 'index.html');
const outDir = path.resolve(process.argv[3] || 'screenshots');
const NICKNAME = '장도초 사회천재';

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const preinstalled = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto(pathToFileURL(gameFile).href);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload();
  await page.waitForTimeout(600);

  let count = 0;
  const shot = async (label, wait = 700) => {
    await page.waitForTimeout(wait);
    count += 1;
    const file = path.join(outDir, `${String(count).padStart(2, '0')}_${label}.png`);
    await page.screenshot({ path: file });
    console.log('저장:', path.basename(file));
  };

  // 게임 안에서 실제 조작 함수(pickPlate·doPress·goNext)로 한 쪽씩 푼다
  await page.evaluate(() => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const right = q => q.type === 'spell' ? q.plates.map((_, i) => i) : q.type === 'one' ? [q.ans] : q.ans;
    const wrong = q => {
      const L = LAYOUT[q.no];
      if (q.type === 'one') return [L.find(v => v !== q.ans)];
      if (q.type === 'ox') return [q.ans[0] === 'O' ? 'X' : 'O', q.ans[1]];
      if (q.type === 'order') return q.ans.slice().reverse();
      if (q.type === 'spell') { const a = q.plates.map((_, i) => i); a[0] = q.plates.length; return a; }
      if (q.type === 'two') return [q.ans[0], L.find(v => !q.ans.includes(v))];
      return q.ans.slice(0, 1);
    };
    window.__fill = async (ok) => { const q = S.cur.q; for (const v of (ok ? right(q) : wrong(q))) { pickPlate(v); await sleep(120); } };
    window.__press = async () => { doPress(); await sleep(1400); };
    window.__solve = async () => { await __fill(true); await __press(); await sleep(800); goNext(); await sleep(1000); };
    window.__solveUntil = async (no) => { while (S.cur.q.no !== no) await __solve(); };
    window.__waitLock = async () => { while (S.cur.locked > 0) await sleep(100); };
    window.__nextChapter = async () => { await sleep(1200); document.getElementById('bChNext').click(); await sleep(900); };
  });

  // 1. 시작화면 (제목 인쇄 연출이 끝난 뒤)
  await page.fill('#nick', NICKNAME);
  await shot('시작화면', 2600);

  await page.click('#bStart'); await page.waitForTimeout(300);
  await page.click('#bHowOk'); await page.waitForTimeout(300);
  await page.click('#books .book >> nth=0'); await page.waitForTimeout(800);

  // 2~3. 초반: 1장 「고려를 세우다」
  await page.evaluate(() => __solveUntil(2));
  await shot('초반_문제');                           // 2번: 알맞지 않은 것 고르기
  await page.evaluate(() => __solveUntil(3));
  await page.evaluate(async () => { await __fill(false); await __press(); });
  await shot('초반_오답힌트', 300);                  // 3번 훈요 10조: 번진 인쇄 + 힌트
  await page.evaluate(async () => { await __waitLock(); await __solve(); await __solveUntil(5); await __solve(); await __nextChapter(); });

  // 4~5. 중반: 2장 → 3장 「나라를 지키고 세계와 만나다」
  await page.evaluate(async () => { for (let i = 0; i < 3; i++) await __solve(); await __nextChapter(); });
  await page.evaluate(() => __solveUntil(10));
  await shot('중반_문제');                           // 10번: 두 가지 고르기
  await page.evaluate(async () => { await __fill(true); await __press(); await new Promise(r => setTimeout(r, 800)); goNext(); await new Promise(r => setTimeout(r, 1000)); });
  await page.evaluate(async () => { await __fill(false); await __press(); });
  await shot('중반_오답힌트', 300);                  // 11번 귀주 대첩: 녹슨 활자 + 힌트
  await page.evaluate(async () => { await __waitLock(); await __solve(); await __solveUntil(14); await __solve(); await __nextChapter(); });

  // 6~7. 후반: 4장 「고려의 보물」
  await page.evaluate(async () => { await __solveUntil(16); await __fill(true); });
  await shot('후반_문제');                           // 16번: 거꾸로 새긴 낱글자 활자로 팔만대장경 조판
  await page.evaluate(async () => { await __press(); await new Promise(r => setTimeout(r, 800)); goNext(); await new Promise(r => setTimeout(r, 1000)); await __solveUntil(19); });
  await page.evaluate(async () => { await __fill(false); await __press(); });
  await shot('후반_오답힌트', 300);                  // 19번 금속 활자의 장점
  await page.evaluate(async () => { await __waitLock(); await __solve(); await __solve(); await new Promise(r => setTimeout(r, 1200)); document.getElementById('bChBook').click(); });

  // 8. 결과창: 완성한 고려 이야기책 (명품 도장으로 열린 '구름과 학' 표지를 골라 둔다)
  await page.waitForTimeout(1200);
  await page.click('#covers button:has-text("구름과 학")');
  await shot('결과창_완성한책', 800);

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
