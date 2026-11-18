// 수학 코스터 타이쿤 - 3학년 2학기 분수판 스크린샷 8장
// 사용법: node capture.js <게임 HTML 경로> <저장 폴더>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const gameFile = path.resolve(process.argv[2] || 'index.html');
const outDir = path.resolve(process.argv[3] || 'screenshots');
const NICKNAME = '장도초 수학천재';

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const preinstalled = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(pathToFileURL(gameFile).href);
  await page.waitForFunction(() => window.__test && __test.isReady(), null, { timeout: 30000 });
  await page.evaluate(() => { window.__noSave = true; try { localStorage.clear(); } catch (e) { } });

  let count = 0;
  const shot = async (label, wait = 700) => {
    await page.waitForTimeout(wait);
    count += 1;
    const file = path.join(outDir, `${String(count).padStart(2, '0')}_${label}.png`);
    await page.screenshot({ path: file });
    console.log('저장:', path.basename(file));
  };
  /* 공원 꾸미기: 실제 짓기 함수로 정문·보도·기구·가게를 놓고 손님을 들인다(진행 단계만큼) */
  const buildPark = stage => page.evaluate(stage => {
    money = 300000; const P = (id, r, c) => { const it = ITEM_BY_ID[id]; if (it && canPlace(it, r, c)) { placeItem(it, r, c); return true; } return false; };
    if (!parkEntranceBuilt) P('park_entrance', 28, 15);
    for (let r = 14; r <= 27; r++) P('path_asphalt', r, 15);
    for (let c = 11; c <= 22; c++) P('path_asphalt', 20, c);
    const A = [['ride_merry', 25, 16], ['shop_popcorn', 23, 14], ['shop_cotton', 22, 16], ['ride_teacup', 21, 12], ['shop_pizza', 19, 13]];
    const B = [['ride_ferris', 17, 16], ['ride_pirate', 21, 18], ['shop_icecream', 19, 17], ['shop_burger', 19, 20], ['shop_tanghulu', 21, 21], ['ride_bumper', 25, 12]];
    const C = [['ride_coaster_red', 16, 11], ['ride_coaster_wood', 21, 23], ['shop_cafe', 18, 14], ['shop_balloon', 16, 14], ['shop_hotdog', 26, 17], ['ride_swings', 23, 12]];
    [A, B, C].slice(0, stage).flat().forEach(([id, r, c]) => P(id, r, c));
    entities.forEach(e => e.built = 1);
    for (let i = 0; i < 40 * stage; i++) { const r = 14 + (i * 7) % 14, c = 15; spawnGuestAt(r, c); }
    const cm = camFor(21, 16, snapZ(Math.min(VW / 1280, VH / 720) * 1.9), VW * 0.42, VH / 2); camX = cm.x; camY = cm.y; currentScale = snapZ(Math.min(VW / 1280, VH / 720) * 1.9); camTween = null;
  }, stage);
  /* 연구소 열고 n번째 문제로(진행 정도 맞추기: 맞힌 개수 = n-1) */
  const openQ = async n => {
    await page.evaluate(n => { quizOrder = Array.from({ length: 30 }, (_, i) => i); quizIndex = n - 1; correctCount = n - 1; firstTryCount = Math.max(0, n - 3); updateTopHUD(); buildResearchTicks && buildResearchTicks(); }, n);
    await page.click('#btnLab'); await page.waitForTimeout(900);
  };
  const tapOpt = async ok => { const t = await page.evaluate(ok => __test.targets().find(x => x.correct === ok), ok); await page.mouse.click(t.x, t.y); };

  // 1 시작 화면(섬 전체 + 이름)
  await page.waitForFunction(() => LOGO_FX.done && !camTween, null, { timeout: 30000 }).catch(() => {});
  await page.fill('#nameInput', NICKNAME); await page.evaluate(() => { const i = document.getElementById('nameInput'); i.blur(); i.scrollLeft = 0; });
  await shot('시작화면_이름쓰기', 1500);
  // 2·3 초반: 정문 앞 작은 공원, 1번 문제(구슬 묶음 그림)
  await page.click('#btnStart'); await page.waitForFunction(() => scene === 'play'); await page.waitForTimeout(1800);
  await buildPark(1); await openQ(1);
  await shot('초반_문제', 900);
  await tapOpt(false); await shot('초반_오답힌트', 1100);
  await page.waitForTimeout(2600); await tapOpt(true); await page.waitForTimeout(700); await page.click('#btnNext'); await page.waitForTimeout(1600);
  // 4·5 중반: 기구가 늘어난 공원, 15번(원 그림 대분수)
  await buildPark(2); await openQ(15);
  await shot('중반_문제', 900);
  await tapOpt(false); await shot('중반_오답힌트', 1100);
  await page.waitForTimeout(2600); await tapOpt(true); await page.waitForTimeout(700); await page.click('#btnNext'); await page.waitForTimeout(1600);
  // 6·7 후반: 코스터까지 들어선 공원, 29번(크기 비교)
  await buildPark(3); await page.evaluate(() => { dayTime = 0.8; });
  await openQ(29);
  await shot('후반_문제', 900);
  await tapOpt(false); await shot('후반_오답힌트', 1100);
  await page.waitForTimeout(2600); await tapOpt(true); await page.waitForTimeout(700); await page.click('#btnNext'); await page.waitForTimeout(1600);
  // 8 결과: 마지막 문제를 맞히면 시상식
  await openQ(30); await tapOpt(true); await page.waitForTimeout(800); await page.click('#btnNext');
  await page.waitForFunction(() => document.querySelectorAll('.judge.in').length >= 3, null, { timeout: 40000 }).catch(() => console.log('심사위원 대기 시간 초과'));
  await shot('결과창', 2500);

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
})();
