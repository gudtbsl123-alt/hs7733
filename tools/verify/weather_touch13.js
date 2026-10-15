// 날씨 상자 실험실 두 번 누르기(보기 고르기 → 확인하기) 실제 터치·마우스 시험 + '새 연구원' 기록 지우기, 기기 13종
// (game-verify의 한 번 누르기 시험을 대신함)
// 사용: NODE_PATH=/opt/node22/lib/node_modules node tools/verify/weather_touch13.js "<게임.html 절대 경로>" <scratchpad 결과 폴더>
const { chromium } = require('playwright'); const fs = require('fs');
const DEVICES = [
  ['노트북 1366x768', 1366, 768, 1, false], ['노트북 1536x864', 1536, 864, 1.25, false], ['PC 1920x1080', 1920, 1080, 1, false],
  ['PC 2560x1440', 2560, 1440, 1, false], ['구형 4:3 1024x768', 1024, 768, 1, false],
  ['아이패드 가로 1180x820', 1180, 820, 2, true], ['아이패드 세로 820x1180', 820, 1180, 2, true], ['갤럭시탭 가로 1280x800', 1280, 800, 2, true],
  ['아이패드 미니 가로 1024x768', 1024, 768, 2, true], ['아이폰 가로 844x390', 844, 390, 3, true], ['갤럭시 가로 915x412', 915, 412, 2.6, true],
  ['아이폰SE 가로 667x375', 667, 375, 2, true], ['휴대폰 세로 390x844', 390, 844, 3, true]];
const OLD = { nick: '김민준', sfx: true, bgm: true, lite: false, seenHow: true, best: [{ stars: 3, score: 600, first: 5 }, null, null, null], done: [true, false, false, false], cards: { 1: 'holo', 2: 'normal' } };
(async () => {
  const [html, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); let fails = 0;
  for (const [name, w, h, dsf, touch] of DEVICES) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: Math.min(dsf, 2), hasTouch: touch, isMobile: touch });
    await ctx.addInitScript((o) => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('weather_box_lab_v1', JSON.stringify(o)); } }, OLD);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('file://' + html); await p.waitForFunction(() => window.__test && __test.isReady());
    const tapSel = (s) => (touch ? p.tap(s) : p.click(s));
    const tap = async (x, y) => { const g = await p.evaluate(() => { const r = GAME.getBoundingClientRect(); return [r.left, r.top, SCALE]; }); const X = g[0] + x * g[2], Y = g[1] + y * g[2]; if (touch) await p.touchscreen.tap(X, Y); else await p.mouse.click(X, Y); };
    const st = () => p.evaluate(() => __test.state());
    const submit = async () => { const c = (await p.evaluate(() => __test.targets())).find((t) => t.confirm); await tap(c.x, c.y); };   /* 힌트가 뜨면 단추 자리가 바뀌므로 누를 때마다 다시 잰다 */
    const wait = (fn, ms = 8000) => p.waitForFunction(fn, null, { timeout: ms }).then(() => true).catch(() => false);
    const r = { name };
    try {
      if (h > w) { r.rotate = await p.isVisible('#rotHint'); await tapSel('#bRotOk'); }
      // 앞 학생 기록이 보이고, 다른 이름으로 들어가면 묻는다 → 처음부터 시작
      r.recShown = await p.isVisible('#recRow');
      await tapSel('#nick'); await p.fill('#nick', '이서연'); await tapSel('#bStart');
      r.askName = await wait(() => !document.getElementById('scrReset').classList.contains('hidden'), 3000);
      await tapSel('#bRsYes'); await p.waitForTimeout(300);
      const s1 = await p.evaluate(() => JSON.parse(localStorage.getItem('weather_box_lab_v1')));
      r.wiped = s1.nick === '이서연' && !s1.done.some(Boolean) && !Object.keys(s1.cards).length && s1.sfx === true;
      await p.screenshot({ path: `${out}/${name.replace(/[ :]/g, '_')}_reset.png` });
      // 하나 고르기 문항: 오답 고르기 → 확인 → 힌트, 기다린 뒤 정답 → 확인 → 정답
      await p.evaluate(() => __test.goto(1)); await p.waitForTimeout(500);
      let T = await p.evaluate(() => __test.targets());
      const wrong = T.find((t) => !t.correct && !t.confirm); await tap(wrong.x, wrong.y); await submit();
      r.hint = await wait(() => __test.state().phase === 'hint');
      await wait(() => __test.state().cool <= 0, 10000); await p.waitForTimeout(150);
      T = await p.evaluate(() => __test.targets()); const right = T.find((t) => t.correct); await tap(right.x, right.y); await submit();
      r.ok = await wait(() => __test.state().phase === 'ok');
      await p.screenshot({ path: `${out}/${name.replace(/[ :]/g, '_')}_ok.png` });
      // '다음 실험'을 누른 손가락이 새 문항 보기를 고르거나 답하지 않는다
      await wait(() => !!document.getElementById('bNext'), 3000); await tapSel('#bNext'); await p.waitForTimeout(600);
      const nx = await st(); r.noGhost = nx.no !== 1 && nx.phase === 'ask' && nx.tries === 0 && (await p.evaluate(() => { const s = G.cur.sel; return s === null || (Array.isArray(s) && s.every((v) => v === null)); }));
      // 연타: 오답 고르기·확인, 곧바로 정답 고르기·확인 → 정답이 되면 안 된다(오답 뒤 대기)
      await p.evaluate(() => __test.goto(2)); await p.waitForTimeout(500);
      T = await p.evaluate(() => __test.targets()); const W2 = T.find((t) => !t.correct && !t.confirm), R2 = T.find((t) => t.correct), S2 = T.find((t) => t.confirm);
      await p.evaluate((P) => { const g = GAME.getBoundingClientRect(); for (const q of P) { const el = document.elementFromPoint(g.left + q.x * SCALE, g.top + q.y * SCALE); if (el) el.click(); } }, [W2, S2, R2, S2]);
      await p.waitForTimeout(800); r.noMash = (await st()).phase !== 'ok';
      // 멈춤 · 소리
      await tapSel('#bPause'); r.pause = (await st()).paused; await tapSel('#bResume'); r.resume = !(await st()).paused;
      await tapSel('#bSound'); r.mute = (await st()).muted; await tapSel('#bSound'); r.unmute = !(await st()).muted;
    } catch (e) { r.err = e.message.split('\n')[0]; }
    r.errors = errs.length;
    const bad = Object.entries(r).filter(([k, v]) => v === false || (k === 'errors' && v) || k === 'err').map(([k]) => k);
    if (h > w && !r.rotate) bad.push('rotate');
    if (bad.length) fails++; console.log((bad.length ? '✗ ' : '✓ ') + name, JSON.stringify(r), bad.join(','));
    await ctx.close();
  }
  console.log(fails ? `FAIL ${fails}` : 'PASS'); await b.close();
})();
