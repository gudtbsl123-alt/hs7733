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
const NICKNAME = '장도초 사회천재';

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  // Claude Code 웹 환경에는 브라우저가 이 위치에 미리 깔려 있다. 없으면 기본 설치본을 쓴다
  const preinstalled = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(pathToFileURL(gameFile).href);
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

  // ================= 시나리오: 무지개 골목 (보스전 없음 → 8장) =================
  const solve = () => page.evaluate(() => {
    const c = G.cur, q = c.q, $$ = s => [...document.querySelectorAll(s)];
    if (c.locked > 0) quizUpdate(c.locked + .01);
    if (q.type === 'one') $$('#answers .acard').find(e => +e.dataset.i === q.ans).click();
    else if (q.type === 'two') { c.sel.slice().forEach(i => $$('#answers .acard').find(e => +e.dataset.i === i).click()); q.ans.forEach(i => $$('#answers .acard').find(e => +e.dataset.i === i).click()); $('bConfirm').click(); }
    else if (q.type === 'tiles') { c.tileSel = []; drawTiles(); for (const ch of q.ans) $$('#answers .tile-b').find(e => e.textContent === ch && !e.disabled).click(); }
    else if (q.type === 'match') { for (let i = 0; i < 3; i++) { document.querySelector(`#matchBox .ml[data-l="${i}"]`).click(); document.querySelector(`#matchBox .mr[data-r="${i}"]`).click(); } $('bConfirm').click(); }
    else if (q.type === 'sort') { for (const ii of c.sOrder) { if (c.placed[ii] !== undefined) continue; document.querySelector(`#sPool .sitem[data-s="${ii}"]`).click(); $$('#answers .bin')[q.items[ii][1]].click(); } $('bConfirm').click(); }
  });
  const wrong = () => page.evaluate(() => { const q = G.cur.q; const el = [...document.querySelectorAll('#answers .acard')].find(e => +e.dataset.i !== q.ans && !e.disabled); el.click(); });
  const phase = () => page.evaluate(() => G ? G.phase : null);
  const curId = () => page.evaluate(() => G && G.cur ? G.cur.q.id : null);
  // 정답을 누르고 다음 이야기로 (원하는 문제가 나올 때까지)
  const playUntil = async (id) => {
    for (let g = 0; g < 20; g++) {
      if ((await phase()) === 'ask' && (await curId()) === id) return;
      if ((await phase()) !== 'ask') { await page.waitForTimeout(300); continue; }
      await solve(); await page.waitForTimeout(1700); await page.click('#bNext'); await page.waitForTimeout(900);
    }
  };
  const finishChapter = async () => {
    for (let g = 0; g < 20 && (await phase()) !== 'done'; g++) {
      if ((await phase()) !== 'ask') { await page.waitForTimeout(400); continue; }
      await solve(); await page.waitForTimeout(1700); if ((await phase()) === 'feedback') { await page.click('#bNext'); await page.waitForTimeout(700); }
    }
  };
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload(); await page.waitForTimeout(1000);
  await page.fill('#nick', NICKNAME);
  await shot('시작화면', 1200);
  await page.click('#bStart'); await page.waitForTimeout(400); await page.click('#bHowOk'); await page.waitForTimeout(300);
  // 1장 (초반): 준이 이야기 → 다른 나라의 음식
  await page.click('.card'); await page.waitForTimeout(600); await page.click('#bIntroGo'); await page.waitForTimeout(1500);
  await playUntil('Q04');
  await shot('초반_문제', 900);
  await wrong(); await shot('초반_오답힌트', 800);
  await finishChapter(); await page.waitForTimeout(2600);
  // 2장 (중반): 외국인 이주민의 긍정적 영향
  await page.click('#bResNext'); await page.waitForTimeout(600); await page.click('#bIntroGo'); await page.waitForTimeout(1500);
  await playUntil('Q12');
  await shot('중반_문제', 900);
  await wrong(); await shot('중반_오답힌트', 800);
  await finishChapter(); await page.waitForTimeout(2600);
  // 3장 (후반): 미나 이야기
  await page.click('#bResNext'); await page.waitForTimeout(600); await page.click('#bIntroGo'); await page.waitForTimeout(1500);
  await playUntil('Q16');
  await shot('후반_문제', 900);
  await wrong(); await shot('후반_오답힌트', 800);
  await finishChapter(); await page.waitForTimeout(6000);
  // 최종 결과창
  await page.click('#bResFinal');
  await shot('결과창', 1500);
  // ============================================================

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
