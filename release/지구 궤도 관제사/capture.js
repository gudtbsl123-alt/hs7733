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
const NICKNAME = '장도초 과학천재';

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  // Claude Code 웹 환경에는 브라우저가 이 위치에 미리 깔려 있다. 없으면 기본 설치본을 쓴다
  const preinstalled = '/opt/pw-browsers/chromium';
  const args = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];  // 3D(WebGL) 게임
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled, args } : { args });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(pathToFileURL(gameFile).href + '?shot=1');  // shot=1: 느린 화면 알림·자동 저사양 전환을 끔
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

  // ================= 시나리오 (지구 궤도 관제사, 보스전 없음 → 8장) =================
  const G = (fn, arg) => page.evaluate(fn, arg);
  const ready = () => G(() => { __game.S.trans = null; });
  // 타이틀 → 하는 법 4장 → 이름 쓰기(관제 콘솔 브라운관)
  await page.waitForTimeout(2200);
  for (let i = 0; i < 20 && (await G(() => __game.S.scene)) !== 'name'; i++) { await page.mouse.click(640, 400); await page.waitForTimeout(500); }
  await page.waitForTimeout(500); await page.fill('#nameIn', NICKNAME);
  await shot('시작화면_이름쓰기', 600);
  await page.keyboard.press('Enter'); await page.waitForTimeout(900);
  // 초반: 임무 1 · 1번(태양 고도인 각 누르기)
  await ready(); await G(() => __game.startStage(0)); await shot('초반_문제', 2000);
  await G(() => { __game.S.sel = '㉡'; }); await page.keyboard.press('Enter'); await shot('초반_오답힌트', 1600);
  // 중반: 임무 2 · 9번(남중 고도가 가장 높은 달 찾기) — 지구를 4월 자리로 옮겨 송신
  await ready(); await G(() => __game.startStage(1)); await G(() => __game.setMonth(4)); await shot('중반_문제', 2000);
  await page.keyboard.press('Enter'); await shot('중반_오답힌트', 1600);
  // 후반: 임무 3 · 18번(자전축 각도계) — 6문항을 차례로 풀어 18번까지 간다
  await ready(); await G(() => __game.startStage(2));
  for (let i = 0; i < 30; i++) { const st = await G(() => __game.state()); if (st.qi === 4 && !st.solved && !st.busy) break; if (st.solved) await page.keyboard.press('Enter'); else if (!st.busy) { await G(() => __game.solve()); await page.keyboard.press('Enter'); } await page.waitForTimeout(800); }
  await shot('후반_문제', 1800);
  await page.keyboard.press('Enter'); await shot('후반_오답힌트', 1600);
  // 끝까지 풀고 관제 일지(결과창)
  for (let i = 0; i < 12; i++) { const st = await G(() => __game.state()); if (st.scene !== 'play') break; if (!st.solved) { await G(() => __game.solve()); await page.keyboard.press('Enter'); await page.waitForTimeout(900); } await page.keyboard.press('Enter'); await page.waitForTimeout(900); }
  await page.waitForTimeout(2500); await G(() => { const p = document.querySelector('.paper'); if (p) p.classList.add('skip'); });
  await shot('결과창', 800);
  // ============================================================

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
