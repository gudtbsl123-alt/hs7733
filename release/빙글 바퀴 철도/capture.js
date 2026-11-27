// 빙글 바퀴 철도 스크린샷 8장 자동 캡처 (game-release 템플릿을 이 게임에 맞게 채움)
// 사용법: node capture.js <게임 HTML 경로> <저장 폴더>
// 3D 게임이라 소프트웨어 WebGL을 켜고, ?step(정해진 시간만큼 화면 넘기기)으로 같은 장면을 매번 똑같이 찍는다.
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
  const args = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled, args } : { args });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(pathToFileURL(gameFile).href + '?step');
  await page.waitForFunction(() => window.GAME && window.__test, null, { timeout: 60000 });

  let count = 0;
  const shot = async (label, wait = 500) => {
    await page.waitForTimeout(wait); count += 1;
    const file = path.join(outDir, `${String(count).padStart(2, '0')}_${label}.png`);
    await page.screenshot({ path: file }); console.log('저장:', path.basename(file));
  };
  /* 역 문제 열기 → 오답 말뚝 앞에 기차를 세워 실마리 띄우기 */
  const ask = (no) => page.evaluate((no) => { __test.goto(no, 0); GAME.tickN(1.5); GAME.draw(); }, no);
  const wrongStop = () => page.evaluate(() => { const F = GAME.G.F, k = (F.ans + 1) % F.n; GAME.TRAIN.s = F.signs[k].s + 0.2; GAME.TRAIN.v = 0.5; GAME.G.moved = true; setLever(0); GAME.tickN(1.0); GAME.draw(); });

  // 1 시작 화면: 상자에서 기차가 나온 뒤 이름판에 닉네임
  await page.evaluate(() => { GAME.tickN(4); GAME.draw(); });
  await page.fill('#nick', NICKNAME); await page.evaluate(() => { $('nick').blur(); GAME.tickN(0.2); GAME.draw(); });
  await shot('시작화면_이름쓰기', 700);
  // 2·3 초반(1노선 놀이 매트 마을 · 원주와 원주율)
  await ask(3); await shot('초반_문제');
  await wrongStop(); await shot('초반_오답힌트');
  // 4·5 중반(3노선 물컵 호수 · 굴러간 거리)
  await ask(13); await shot('중반_문제');
  await wrongStop(); await shot('중반_오답힌트');
  // 6·7 후반(5노선 밤의 창가 · 색칠한 부분의 넓이)
  await ask(26); await shot('후반_문제');
  await wrongStop(); await shot('후반_오답힌트');
  // 8 결과창: 30문항을 마친 기록으로 띄우기(깨운 장난감·별 사탕 포함)
  await page.evaluate(() => { const G = GAME.G; GAME.Q.forEach((q) => { G.rec[q.no] = { no: q.no, tries: q.no % 5 ? 0 : 1, wrong: q.no % 5 ? [] : ['?'], first: !!(q.no % 5), ok: true }; });
    GAME.TOYS.forEach((t) => { if (t.no % 5) wakeToy(t, true); }); G.stars = 96; G.perfect = 19; GAME.SAVE().perfK = {}; for (let i = 0; i < 19; i++) GAME.SAVE().perfK[i * 1.7 | 0] = 1; G.playT = 21 * 60; GAME.SAVE().owner = '장도초 수학천재'; GAME.SAVE().done = [1, 1, 1, 1, 1]; goResult(); GAME.tickN(3.5); GAME.draw(); });
  await shot('결과창', 900);

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
