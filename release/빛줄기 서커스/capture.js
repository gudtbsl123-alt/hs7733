// 게임 스크린샷 8~10장 자동 캡처 템플릿
// 사용법: node capture.js <게임 HTML 경로> <저장 폴더>
// Claude가 게임마다 이 파일을 복사한 뒤 "시나리오" 부분만 채워서 실행한다.

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const gameFile = path.resolve(process.argv[2] || 'index.html');
const outDir = path.resolve(process.argv[3] || 'screenshots');
// 게임 과목에 맞게 바꾼다: 장도초 국어천재 / 수학천재 / 사회천재 / 과학천재 등
const NICKNAME = '장도초 수학천재'; // 4학년 2학기 수학 사각형

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  // Claude Code 웹 환경에는 브라우저가 이 위치에 미리 깔려 있다. 없으면 기본 설치본을 쓴다
  const preinstalled = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(pathToFileURL(gameFile).href + '?shot=1'); // 촬영용: 느린 화면 안내·자동 저사양 전환을 끔
  await page.waitForTimeout(1200);

  let count = 0;
  // 화면 캡처: 애니메이션이 멈출 시간을 준 뒤 찍는다
  const shot = async (label, wait = 700) => {
    await page.waitForTimeout(wait);
    count += 1;
    const file = path.join(outDir, `${String(count).padStart(2, '0')}_${label}.png`);
    await page.screenshot({ path: file });
    console.log('저장:', path.basename(file));
  };

  // ================= 시나리오: 빛줄기 서커스(수학, 보스전 없음 → 8장) =================
  // 게임 안 검증용 훅(window.__game)으로 막·문항을 옮기고, 화면은 실제 게임 그대로 찍는다
  const st = () => page.evaluate(() => __game.state());
  const waitPh = async (want, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const s = await st(); if (s.scene !== 'play' || want.includes(s.ph)) return s; await page.waitForTimeout(150); } return st(); };
  const wrongWithHint = async () => { await page.evaluate(() => { __game.wrong(); __game.pull(); }); await page.waitForTimeout(500); await waitPh(['active']); };
  const solveNext = async () => { await page.evaluate(() => { __game.solve(); __game.pull(); }); await waitPh(['done']); await page.waitForTimeout(300); await page.evaluate(() => __game.next()); await page.waitForTimeout(400); };

  // 1) 타이틀 → 하는 법 건너뛰기 → 이름 쓰기 장면에 닉네임 입력
  await page.waitForTimeout(2500); await page.mouse.click(640, 400); await page.waitForTimeout(1500);
  await page.mouse.click(984, 36); await page.waitForTimeout(2000);
  await page.fill('#nameIn', NICKNAME); await page.waitForTimeout(300);
  await shot('시작화면_이름쓰기', 600);
  await page.keyboard.press('Enter'); await page.waitForTimeout(3500);

  // 2) 초반: 1막 v1(빨강 레이저를 파랑과 수직으로)
  await page.evaluate(() => goScene('play', { act: 1, idx: 1 })); await waitPh(['active']);
  await shot('초반_문제', 1200);
  await wrongWithHint(); await shot('초반_오답힌트', 900);

  // 3) 중반: 2막 v5(빛띠 두 개로 평행사변형)
  await page.evaluate(() => goScene('play', { act: 2, idx: 4 })); await waitPh(['active']);
  await shot('중반_문제', 1200);
  await wrongWithHint(); await shot('중반_오답힌트', 900);

  // 4) 후반: 3막을 처음부터 풀어 마지막 대공연(v10)까지 간다
  await page.evaluate(() => goScene('play', { act: 3, idx: 0 })); await waitPh(['active']);
  for (let i = 0; i < 9; i++) { await waitPh(['active']); if (i === 3) await wrongWithHint(); await solveNext(); }
  await waitPh(['active']);
  await shot('후반_대공연_문제', 1200);
  await wrongWithHint(); await shot('후반_대공연_오답힌트', 900);
  await page.evaluate(() => { __game.solve(); __game.pull(); }); await waitPh(['done']);
  await page.waitForTimeout(500); await page.evaluate(() => __game.next());

  // 5) 결과창(공연 기록 + 오답 노트)
  await shot('결과창', 3500);
  // ============================================================

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
