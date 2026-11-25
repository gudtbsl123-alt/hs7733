// 조선 타임랩스 마을 스크린샷 9장 (game-release)
// 사용법: NODE_PATH=/opt/node22/lib/node_modules node capture.js "<게임.html>" <저장 폴더>
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs'); const { pathToFileURL } = require('url');
const gameFile = path.resolve(process.argv[2]); const outDir = path.resolve(process.argv[3] || 'screenshots');
const NICKNAME = '장도초 사회천재';
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const pre = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(pre) ? { executablePath: pre } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(pathToFileURL(gameFile).href);
  await page.waitForFunction(() => window.__test && __test.isReady(), null, { timeout: 30000 });
  await page.evaluate(() => __test.quiet());
  let count = 0;
  const shot = async (label, wait = 700) => { await page.waitForTimeout(wait); count++; const f = path.join(outDir, `${String(count).padStart(2, '0')}_${label}.png`); await page.screenshot({ path: f }); console.log('저장:', path.basename(f)); };
  const go = async n => { await page.evaluate(n => __test.goto(n, 0), n); await page.waitForTimeout(1200); };
  const tap = async t => { await page.mouse.click(t.x, t.y); };
  const wrong = async () => { const T = await page.evaluate(() => __test.targets()); await tap(T.find(t => !t.correct)); };
  const right = async () => { const T = await page.evaluate(() => __test.targets()); await tap(T.find(t => t.correct)); };

  // 1. 시작 화면: 해솔이 이름을 묻는 대화창에 이름 입력
  await page.waitForTimeout(2500); await page.fill('#nick', NICKNAME); await shot('시작화면_이름쓰기', 500);
  await page.click('#bStart'); await page.waitForTimeout(800);
  // 2~3. 초반(조선 전기): 3번 삼강행실도
  await go(3); await shot('초반_문제', 300);
  await wrong(); await shot('초반_오답힌트', 1400);
  // 4. 초반 정답 뒤 '진짜 사료' 카드 (7번 훈민정음)
  await go(7); await right(); await shot('정답_진짜사료_훈민정음', 1600);
  // 5~6. 중반(조선 후기): 15번 개울 문항
  await go(15); await shot('중반_문제', 300);
  await wrong(); await shot('중반_오답힌트', 1400);
  // 7~8. 후반(개항 이후): 24번 두 곳 짓기
  await go(24); await shot('후반_문제', 300);
  /* 두 곳을 채워야 판정: 틀린 것 하나 + 맞는 것 하나 */
  { let T = await page.evaluate(() => __test.targets()); await tap(T.find(t => !t.correct)); await page.waitForTimeout(500); T = await page.evaluate(() => __test.targets()); await tap(T.find(t => t.correct)); }
  await shot('후반_오답힌트', 1500);
  // 9. 결과창: 처음부터 끝까지 풀어서
  await page.evaluate(nick => { __test.start(nick); let g = 0; while (__test.state().scene !== 'result' && g++ < 60000) __test.botStep('mixed'); }, NICKNAME);
  await shot('결과창', 3600);
  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
})();
