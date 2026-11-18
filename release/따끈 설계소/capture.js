// 「따끈 설계소」 스크린샷 8장 캡처 (game-release 스킬 capture_template.js에서 시작)
// 사용법: NODE_PATH=/opt/node22/lib/node_modules node capture.js <게임 HTML 경로> <저장 폴더>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const gameFile = path.resolve(process.argv[2] || 'index.html');
const outDir = path.resolve(process.argv[3] || 'screenshots');
const NICKNAME = '장도초 과학천재';

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const preinstalled = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(pathToFileURL(gameFile).href);
  await page.waitForFunction('window.READY===true');

  let count = 0;
  const shot = async (label, wait = 700) => {
    await page.waitForTimeout(wait);
    await page.mouse.move(2, 2);
    count += 1;
    const file = path.join(outDir, `${String(count).padStart(2, '0')}_${label}.png`);
    await page.screenshot({ path: file });
    console.log('저장:', path.basename(file));
  };
  const lever = () => page.mouse.click(910, 660);
  // 앞 문항을 실제로 푼 것처럼 진행 기록을 채운다(그 방의 물건이 그만큼 실물로 보인다)
  const doneUpTo = n => page.evaluate(n => { for (let i = 1; i <= n; i++) G.done[i] = { first: i % 4 !== 0 }; save(); }, n);
  const dragTok = async (label, slotIdx) => {
    const tk = await page.evaluate(l => { const k = Q.toks.find(q => q.label === l); return { x: k.x, y: k.y }; }, label);
    const t = (await page.evaluate(() => __test.targets()))[slotIdx];
    await page.mouse.move(tk.x, tk.y); await page.mouse.down(); await page.mouse.move(t.x, t.y, { steps: 8 }); await page.mouse.up();
    await page.waitForTimeout(250);
  };

  // ================= 시나리오 =================
  // 1. 시작 화면: 타이틀 연출이 끝나면 도면 표제란에 이름 쓰기
  await page.waitForTimeout(3600);
  await page.fill('#nick', NICKNAME);
  await shot('시작화면_이름쓰기');
  await lever();
  await page.waitForTimeout(900);

  // 2~3. 초반(관측실): 3번 알코올 온도계 눈높이 → 오답 ㄱ에 핀
  await doneUpTo(2);
  await page.evaluate(() => __test.goto(3));
  await shot('초반_문제', 900);
  let T = await page.evaluate(() => __test.targets());
  await page.waitForTimeout(400);
  await page.mouse.click(T[0].x, T[0].y);          // ㄱ 위에서 내려다본다(오답)
  await shot('초반_오답힌트', 1100);

  // 4~5. 중반(부엌): 7번 원통과 캔 → 꼬리표를 거꾸로 놓고 불 켜기
  await doneUpTo(6);
  await page.evaluate(() => __test.goto(7));
  await shot('중반_문제', 900);
  await dragTok('점점 높아진다', 0);
  await dragTok('점점 낮아진다', 1);
  await lever();
  await shot('중반_오답힌트', 1800);

  // 6~7. 후반(거실): 22번 난방기 → 위쪽에 놓고 켜 보기
  await doneUpTo(21);
  await page.evaluate(() => __test.goto(22));
  await shot('후반_문제', 900);
  await page.mouse.move(530, 652); await page.mouse.down(); await page.mouse.move(354, 237, { steps: 10 }); await page.mouse.up();
  await page.waitForTimeout(400);
  await lever();
  await shot('후반_오답힌트', 4300);

  // 8. 결과창: 30문항을 모두 그린 뒤 집 완성
  await doneUpTo(30);
  await page.evaluate(() => { G.time = 1385; G.wrongs = [{ no: 3, my: '(ㄱ) 위에서 내려다본다' }, { no: 7, my: '점점 높아진다 / 점점 낮아진다' }, { no: 22, my: '위쪽' }]; Q = null; goResult(); });
  await page.waitForFunction('G.tt>6.2', null, { timeout: 30000 });
  await shot('결과창', 300);
  // ============================================================

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
