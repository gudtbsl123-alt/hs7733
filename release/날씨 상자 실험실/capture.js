// 「날씨 상자 실험실」 스크린샷 10장 자동 캡처 (보스전 없음, 결과창 3장)
// 사용법: node capture.js <게임 HTML 경로> <저장 폴더>

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
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto(pathToFileURL(gameFile).href);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload();
  await page.waitForTimeout(800);

  let count = 0;
  const shot = async (label, wait = 700) => {
    await page.waitForTimeout(wait);
    await page.evaluate(() => { const t = document.getElementById('toast'); if (t) t.innerHTML = ''; }); /* 잠깐 뜨는 알림이 그림을 가리지 않게 */
    count += 1;
    const file = path.join(outDir, `${String(count).padStart(2, '0')}_${label}.png`);
    await page.screenshot({ path: file });
    console.log('저장:', path.basename(file));
  };

  // 게임 안의 실제 도구(SCN.use)와 답 고르기 함수(pickOpt·pickOX·pickWord·submit)로 진행한다
  await page.evaluate(() => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const ACTS = { temp:[['temp',0]], phone:[['phone']], thermo:[['thermo']], rain:[['rain',.9]], wind:[['wind',1]], humid:[['humid',.9]],
      canDew:[['cold']], dawn:[['time',1]], jarFog:[['smoke'],[2600],['ice']], parcel:[['night'],['up']], columns:[['Lc'],['Rw']],
      sat:[['shot']], hl:[['H'],['tap',190,230],['L'],['tap',490,230]], table:[['show']], box:[['sand'],['water'],['incense'],['lid']],
      lamp:[['lamp']], daynight:[['dn']], night:[['dn']] };
    window.__act = async () => { const g = G.cur.q.act.goal;
      for (const st of ACTS[g]) { if (typeof st[0] === 'number') { await sleep(st[0]); continue; }
        if (st[0] === 'tap') Scenes.tap(st[1] + IX, st[2] + IY); else SCN[SC.id].use(st[0], st[1]);
        renderTools(); await sleep(300); }
      while (!(G.phase === 'ask' || G.phase === 'fb')) await sleep(150); };
    window.__right = () => { const c = G.cur, q = c.q;
      if (q.type === 'one') pickOpt(q.ans); else if (q.type === 'ox') q.ans.forEach((v, i) => pickOX(i, v)); else { c.sel = q.blanks.map(() => null); c.focus = 0; q.ans.forEach(w => pickWord(w)); } };
    window.__wrong = () => { const c = G.cur, q = c.q;
      if (q.type === 'one') pickOpt(LAYOUT[q.no].find(v => v !== q.ans && !c.bad.has(v)));
      else if (q.type === 'ox') q.items.forEach((_, i) => pickOX(i, i === 0 ? (q.ans[0] === 'O' ? 'X' : 'O') : q.ans[i]));
      else q.ans.slice().reverse().forEach(w => pickWord(w)); submit(); };
    window.__solve = async () => { if (G.phase === 'act') await __act(); while (G.cur.locked > 0) await sleep(100);
      __right(); submit(); if (G.phase === 'after') await __act(); while (G.phase !== 'fb') await sleep(150); await sleep(300); goNext(); await sleep(500); };
    window.__to = async (no) => { while (G.cur.q.no !== no) await __solve(); };
    window.__nextRoom = async () => { while (G.phase !== 'done') await __solve(); await sleep(1200); const b = document.getElementById('bChNext') || document.getElementById('bChReport'); b.click(); await sleep(1200); };
  });

  // 1. 시작화면 (비가 오다 그치는 마을이 움직인다)
  await page.fill('#nick', NICKNAME);
  await shot('시작화면', 9000);

  await page.click('#bStart'); await page.waitForTimeout(300);
  await page.click('#bHowOk'); await page.waitForTimeout(300);
  await page.click('#rooms .room >> nth=0'); await page.waitForTimeout(800);

  // 2~3. 초반: 1실험실 기상 관측실
  await page.evaluate(() => __act());
  await shot('초반_문제', 1200);                         // 1번: 기온 조절기를 내려 추워진 마을
  await page.evaluate(async () => { await __solve(); await __to(3); await __act(); __wrong(); });
  await shot('초반_오답힌트', 500);                      // 3번: 온도계 확대 + 박사님 힌트
  await page.evaluate(async () => { await __nextRoom(); });

  // 4~5. 중반: 2실험실 응결 실험실
  await page.evaluate(async () => { await __to(9); await __act(); });
  await shot('중반_문제', 1500);                         // 9번: 집기병 안이 뿌옇게 흐려진 모습
  await page.evaluate(async () => { await __solve(); await __to(12); await __act(); await new Promise(r => setTimeout(r, 1500)); __wrong(); });
  await shot('중반_오답힌트', 500);                      // 12번: 안개와 구름 + 힌트
  await page.evaluate(async () => { await __nextRoom(); await __nextRoom(); });

  // 6~7. 후반: 4실험실 바람 실험실
  await page.evaluate(async () => { await __act(); });
  await shot('후반_문제', 2500);                         // 17번: 향 연기가 모래 쪽에서 물 쪽으로
  await page.evaluate(async () => { await __to(20); __wrong(); });
  await shot('후반_오답힌트', 500);                      // 20번 육풍: 힌트
  await page.evaluate(async () => { await __nextRoom(); });

  // 8~10. 결과창: 연구 보고서 · 날씨 도감 · 오답 노트
  await shot('결과창_연구보고서', 1500);
  await page.click('.tabs [data-t=tDex]');
  await shot('결과창_날씨도감', 500);
  await page.click('.tabs [data-t=tNote]');
  await shot('결과창_오답노트', 500);

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
