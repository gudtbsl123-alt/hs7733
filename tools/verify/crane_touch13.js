// 블록 항구 크레인 두 번 누르기(상자 → 배) 실제 터치·마우스 시험, 기기 13종 (game-verify의 한 번 누르기 시험을 대신함)
// 사용: NODE_PATH=/opt/node22/lib/node_modules node tools/verify/crane_touch13.js "<게임.html 절대 경로>" <scratchpad 결과 폴더>
const { chromium } = require('playwright'); const fs = require('fs');
const DEVICES = [
  ['노트북 1366x768', 1366, 768, 1, false], ['노트북 1536x864', 1536, 864, 1.25, false], ['PC 1920x1080', 1920, 1080, 1, false],
  ['PC 2560x1440', 2560, 1440, 1, false], ['구형 4:3 1024x768', 1024, 768, 1, false],
  ['아이패드 가로 1180x820', 1180, 820, 2, true], ['아이패드 세로 820x1180', 820, 1180, 2, true], ['갤럭시탭 가로 1280x800', 1280, 800, 2, true],
  ['아이패드 미니 가로 1024x768', 1024, 768, 2, true], ['아이폰 가로 844x390', 844, 390, 3, true], ['갤럭시 가로 915x412', 915, 412, 2.6, true],
  ['아이폰SE 가로 667x375', 667, 375, 2, true], ['휴대폰 세로 390x844', 390, 844, 3, true]];
(async () => {
  const [html, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const rows = []; let fails = 0;
  for (const [name, w, h, dsf, touch] of DEVICES) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: Math.min(dsf, 2), hasTouch: touch, isMobile: touch });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('file://' + html + '?step'); await p.waitForFunction('window.GAME && window.__test', null, { timeout: 60000 });
    const adv = (s) => p.evaluate((s) => GAME.advance(s), s);
    const until = async (fn, max = 20) => { for (let i = 0; i < max * 4; i++) { if (await p.evaluate(fn)) return true; await adv(0.25); } return false; };
    const tap = async (x, y) => { const r = await p.evaluate(() => { const g = document.getElementById('stage').getBoundingClientRect(); return [g.left, g.top, g.width / 1280]; });
      const X = r[0] + x * r[2], Y = r[1] + y * r[2]; if (touch) await p.touchscreen.tap(X, Y); else await p.mouse.click(X, Y); };
    const st = () => p.evaluate(() => __test.state());
    const r = { name }; await adv(1.5);
    try {
      if (h > w) { r.rotate = await p.isVisible('#rot'); if (touch) await p.tap('#rotOk'); else await p.click('#rotOk'); r.rotateGone = !(await p.isVisible('#rot')); }
      await tap(1110, 652); await adv(0.5);                 // 출항 준비 → 이름표
      await tap(410 + 26, 367); await adv(0.3);             // 이름 블록 누르기 → 입력칸
      r.nameFocus = await p.evaluate(() => document.activeElement && document.activeElement.id === 'name');
      await p.keyboard.type('장도초 수학천재'); await adv(0.4);
      await p.screenshot({ path: `${out}/${name.replace(/[ :]/g, '_')}_name.png` });
      await tap(640, 540); await adv(0.6);                  // 출항 준비 끝
      r.name = await p.evaluate(() => GAME.G.name); r.select = (await st()).scene === 'select';
      // 2번(컵 고르기, 4개 중 1개): 오답 상자 → 배
      await p.evaluate(() => __test.goto(2)); await adv(0.4);
      let T = await p.evaluate(() => __test.targets()); const wrong = T.find((t) => !t.correct && !t.confirm), shipT = T.find((t) => t.confirm);
      await tap(wrong.x, wrong.y); await until(() => GAME.crane.held && !GAME.crane.busy, 8); await tap(shipT.x, shipT.y);
      r.hint = await until(() => __test.state().phase === 'hint', 8); await until(() => __test.state().cool === 0 && GAME.G.state === 'play', 10);
      r.wrongNotDone = !(await p.evaluate(() => GAME.G.done[1]));
      T = await p.evaluate(() => __test.targets()); const right = T.find((t) => t.correct);
      await tap(right.x, right.y); await until(() => GAME.crane.held && !GAME.crane.busy, 8); await tap(shipT.x, shipT.y);
      r.ok = await until(() => __test.state().phase === 'ok', 8);
      await p.screenshot({ path: `${out}/${name.replace(/[ :]/g, '_')}_ok.png` });
      // 새 배가 들어오자마자 누른 손가락은 상자를 집지 않는다
      await until(() => GAME.G.task && GAME.G.task.id !== 1, 6);
      const f = await p.evaluate(() => __test.targets().find((t) => !t.confirm)); await tap(f.x, f.y); await adv(0.1);
      r.freshGuard = await p.evaluate(() => !GAME.crane.busy && !GAME.crane.held);
      // 연타: 모든 상자와 배를 한순간에 → 정답 처리 안 됨
      await p.evaluate(() => __test.goto(3)); await adv(0.4);
      T = await p.evaluate(() => __test.targets()); const order = T.filter((t) => !t.correct && !t.confirm).concat(T.filter((t) => t.correct), T.filter((t) => t.confirm));
      for (const t of order) await tap(t.x, t.y); await adv(3);
      r.noMash = (await st()).phase !== 'ok';
      // 멈춤 · 소리
      await p.evaluate(() => __test.goto(4)); await adv(0.4);
      await tap(1142, 52); await adv(0.1); r.pause = (await st()).paused; await p.keyboard.press('Escape'); await adv(0.1); r.resume = !(await st()).paused;
      await tap(1222, 52); await adv(0.1); r.mute = (await st()).muted; await tap(1222, 52); await adv(0.1); r.unmute = !(await st()).muted;
      r.menu = await p.evaluate(() => { const e = new MouseEvent('contextmenu', { bubbles: true, cancelable: true }); document.getElementById('stage').dispatchEvent(e); return e.defaultPrevented; });
    } catch (e) { r.err = e.message.split('\n')[0]; }
    r.errors = errs.length;
    const bad = Object.entries(r).filter(([k, v]) => v === false || (k === 'errors' && v) || k === 'err').map(([k]) => k);
    if (h > w && !r.rotate) bad.push('rotate');
    if (r.name !== '장도초 수학천재') bad.push('nameValue');
    if (bad.length) fails++; console.log((bad.length ? '✗ ' : '✓ ') + name, JSON.stringify(r), bad.join(','));
    rows.push(r); await ctx.close();
  }
  fs.writeFileSync(out + '/touch13.json', JSON.stringify(rows, null, 1));
  console.log(fails ? `FAIL ${fails}` : 'PASS'); await b.close();
})();
