/* 게임 자동 점검 (game-verify)
   사용법: node verify.js <게임.html> <결과 폴더> [all|static|content|play|devices]
   게임은 window.__test 창구를 열어 두어야 한다 (SKILL.md "점검 창구" 참고).
   결과: <결과 폴더>/report.json, report.txt, content/(문항 단계 사진·모음), devices/(기기별 사진)
   마지막 줄에 "PASS" 또는 "FAIL n건"을 찍는다. FAIL이면 고친 뒤 다시 돌린다. */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');

const game = path.resolve(process.argv[2] || 'index.html');
const out = path.resolve(process.argv[3] || 'verify_out');
const what = (process.argv[4] || 'all').split(',');
const want = k => what.includes('all') || what.includes(k);
const EXE = fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {};
/* 3D(WebGL) 게임일 때만 소프트웨어 WebGL을 켠다. 2D 게임에 켜면 큰 화면에서 아주 느려져 시험이 엇나간다 */
const IS3D = /WebGLRenderer|getContext\(\s*['"]webgl/.test(fs.readFileSync(game, 'utf8'));
const ARGS = IS3D ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] : [];
fs.mkdirSync(out, { recursive: true });
const report = { game: path.basename(game), when: new Date().toISOString(), fails: [], warns: [], sections: {} };
const fail = (sec, msg) => { report.fails.push(`[${sec}] ${msg}`); };
const warn = (sec, msg) => { report.warns.push(`[${sec}] ${msg}`); };
const log = (...a) => { console.log(...a); };

/* 기기 목록: 노트북·PC·구형 4:3·태블릿 가로세로·휴대폰 가로세로 (이름, 너비, 높이, 배율, 터치) */
const DEVICES = [
  ['노트북 1366x768', 1366, 768, 1, false], ['노트북 1536x864', 1536, 864, 1.25, false], ['PC 1920x1080', 1920, 1080, 1, false],
  ['PC 2560x1440', 2560, 1440, 1, false], ['구형 4:3 1024x768', 1024, 768, 1, false],
  ['아이패드 가로 1180x820', 1180, 820, 2, true], ['아이패드 세로 820x1180', 820, 1180, 2, true], ['갤럭시탭 가로 1280x800', 1280, 800, 2, true],
  ['아이패드 미니 가로 1024x768', 1024, 768, 2, true], ['아이폰 가로 844x390', 844, 390, 3, true], ['갤럭시 가로 915x412', 915, 412, 2.6, true],
  ['아이폰SE 가로 667x375', 667, 375, 2, true], ['휴대폰 세로 390x844', 390, 844, 3, true]];

async function open(browser, opt = {}) {
  const ctx = await browser.newContext({ viewport: { width: opt.w || 1280, height: opt.h || 720 }, deviceScaleFactor: opt.dsf || 1, hasTouch: !!opt.touch, isMobile: !!opt.touch });
  const page = await ctx.newPage(); const errors = [], external = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('request', r => { const u = r.url(); if (!/^(file:|data:|blob:|about:)/.test(u)) external.push(u); });
  await page.goto(pathToFileURL(game).href + '?test=1');
  /* 게임이 첫 입력을 받을 준비가 될 때까지 (타이틀 연출 끝) — __test.isReady()가 없으면 창구가 생길 때까지만 */
  await page.waitForFunction(() => window.__test && (!window.__test.isReady || window.__test.isReady()), null, { timeout: 20000 }).catch(() => {});
  const has = await page.evaluate(() => !!window.__test);
  if (has) await page.evaluate(() => { if (__test.quiet) __test.quiet(); });
  await page.waitForTimeout(opt.settle || 400);
  return { ctx, page, errors, external, has };
}

/* ── 1. 정적 검사: 파일 이름 NFC · 이모지 · 바깥 주소 ── */
async function checkStatic(browser) {
  const sec = 'static'; const html = fs.readFileSync(game, 'utf8'); const base = path.basename(game);
  if (base !== base.normalize('NFC')) fail(sec, '파일 이름이 NFC가 아님 (GitHub Pages 404)');
  const noData = html.replace(/data:[^"')\s]+/g, '').replace(/[A-Za-z0-9+/=]{200,}/g, '');
  const emo = noData.match(/\p{Extended_Pictographic}/gu); if (emo) fail(sec, `이모지 ${emo.length}개: ${[...new Set(emo)].slice(0, 8).join(' ')}`);
  const urls = (noData.match(/(?:src|href)\s*=\s*["']https?:\/\/[^"']+/g) || []).concat(noData.match(/url\(\s*["']?https?:\/\/[^)"']+/g) || []);
  if (urls.length) fail(sec, '바깥 주소: ' + urls.slice(0, 3).join(' | '));
  const { ctx, page, errors, external, has } = await open(browser);
  if (!has) fail(sec, 'window.__test 창구가 없음 → SKILL.md "점검 창구"를 게임에 넣는다');
  await page.waitForTimeout(1500);
  if (external.length) fail(sec, '실행 중 바깥 주소 요청: ' + external.slice(0, 3).join(' | '));
  if (errors.length) fail(sec, '불러올 때 오류: ' + errors.slice(0, 3).join(' | '));
  report.sections.static = { emoji: emo ? emo.length : 0, external: external.length, errors: errors.length };
  await ctx.close(); return has;
}

/* ── 2. 내용: 모든 문항·단계 사진 + 글 모음 + 문항 감사 + 정답 위치 ── */
async function checkContent(browser) {
  const sec = 'content'; const dir = path.join(out, 'content'); fs.mkdirSync(dir, { recursive: true });
  const { ctx, page, errors } = await open(browser);
  const items = await page.evaluate(() => __test.items());
  fs.writeFileSync(path.join(dir, 'items.json'), JSON.stringify(items, null, 2));
  const audit = []; const pos = []; const shots = [];
  for (const it of items) {
    if (!it.hint) audit.push(`${it.no}번 힌트 없음`); if (!it.exp) audit.push(`${it.no}번 해설 없음`);
    it.steps.forEach((s, si) => {
      const A = Array.isArray(s.ans) ? s.ans : [s.ans];
      if (s.opts) {
        if (new Set(s.opts).size !== s.opts.length) audit.push(`${it.no}-${si} 보기 중복`);
        A.forEach(a => { if (!s.opts.includes(a)) audit.push(`${it.no}-${si} 정답 "${a}"이(가) 보기에 없음`); });
      }
      if (s.ans === undefined || s.ans === null || s.ans === '') audit.push(`${it.no}-${si} 정답 없음`);
      const H = String(it.hint || ''); A.forEach(a => { if (typeof a === 'string' && a.length >= 4 && H.includes(a)) audit.push(`${it.no}-${si} 힌트가 정답 "${a}"을 그대로 말함`); });
    });
  }
  for (const it of items) for (let si = 0; si < it.steps.length; si++) {
    await page.evaluate(([n, s]) => __test.goto(n, s), [it.no, si]);
    await page.waitForTimeout(900);
    const st = await page.evaluate(() => ({ s: __test.state(), t: __test.targets ? __test.targets() : [] }));
    if (st.s.no !== it.no || st.s.step !== si) audit.push(`${it.no}-${si} goto 후 화면이 다른 문항(${st.s.no}-${st.s.step})`);
    const picks = st.t.filter(t => !t.confirm); const ci = picks.findIndex(t => t.correct);
    if (it.steps[si].kind === 'pick' && picks.length) pos.push({ no: it.no, si, n: picks.length, at: ci });
    /* 넘침: 무대 밖으로 나간 글 · 잘린 글 */
    const over = await page.evaluate(sel => { const root = document.querySelector(sel) || document.body, R = root.getBoundingClientRect(), bad = [];
      root.querySelectorAll('*').forEach(el => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0 || !el.offsetParent) return;
        const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); if (!hasText) return; const r = el.getBoundingClientRect(); if (!r.width) return;
        const clipped = (cs.overflow !== 'visible' || cs.overflowY !== 'visible') && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2);
        const outside = r.right > R.right + 1 || r.bottom > R.bottom + 1 || r.left < R.left - 1 || r.top < R.top - 1;
        if (clipped || outside) bad.push((el.id ? '#' + el.id : el.className || el.tagName) + (clipped ? ' 잘림' : ' 무대 밖') + ': ' + el.textContent.trim().slice(0, 20)); });
      return bad.slice(0, 4); }, (await page.evaluate(() => (__test.ui && __test.ui.stage) || 'body')));
    over.forEach(o => audit.push(`${it.no}-${si} 글 넘침 ${o}`));
    const f = `i${String(it.no).padStart(2, '0')}_${si}.png`; await page.screenshot({ path: path.join(dir, f) }); shots.push([`${it.no}-${si}`, f]);
  }
  /* 정답 위치: 매 판 섞이는지(다시 열어 비교) 또는 고르게 나뉘는지 */
  const { ctx: c2, page: p2 } = await open(browser); const pos2 = [];
  for (const p of pos) { await p2.evaluate(([n, s]) => __test.goto(n, s), [p.no, p.si]); await p2.waitForTimeout(150); const t = await p2.evaluate(() => __test.targets().filter(x => !x.confirm)); pos2.push(t.findIndex(x => x.correct)); }
  await c2.close();
  const shuffled = pos.some((p, i) => p.at !== pos2[i]);
  const counts = {}; pos.forEach(p => { counts[p.at] = (counts[p.at] || 0) + 1; }); const maxShare = pos.length ? Math.max(...Object.values(counts)) / pos.length : 0;
  if (!shuffled && maxShare > .4) audit.push(`정답 위치가 섞이지 않고 한쪽에 몰림(최다 ${Math.round(maxShare * 100)}%)`);
  if (pos.some(p => p.at < 0)) audit.push('targets()에 정답 표시(correct)가 없는 고르기 문항이 있음');
  /* 사진 모음: 4장씩 한 장으로 (content-critic에게 넘길 것) */
  const sheets = []; for (let i = 0; i < shots.length; i += 4) {
    const grp = shots.slice(i, i + 4), html = `<body style="margin:0;background:#222;display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:6px;font:700 18px sans-serif;color:#fff">${grp.map(([t, f]) => `<div><div style="padding:2px 4px">${t}</div><img src="data:image/png;base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}" style="width:100%;display:block"></div>`).join('')}</body>`;
    const sp = await ctx.newPage(); await sp.setViewportSize({ width: 1280, height: 400 }); await sp.setContent(html); await sp.waitForTimeout(150);
    const name = `sheet_${String(sheets.length + 1).padStart(2, '0')}.png`; await sp.screenshot({ path: path.join(dir, name), fullPage: true }); await sp.close(); sheets.push(name); }
  audit.forEach(a => fail(sec, a)); if (errors.length) fail(sec, '오류: ' + errors.slice(0, 3).join(' | '));
  report.sections.content = { items: items.length, steps: shots.length, shuffledEachRun: shuffled, answerPos: counts, sheets };
  await ctx.close();
}

/* ── 3. 자동 플레이: 모두 정답 / 섞어서 / 많이 틀리기로 결과까지 ── */
async function checkPlay(browser) {
  const sec = 'play'; const res = {};
  for (const mode of ['perfect', 'mixed', 'weak']) {
    const { ctx, page, errors } = await open(browser);
    const r = await page.evaluate(mode => { let guard = 0; __test.start('봇'); while (__test.state().scene !== 'result' && guard++ < 60000) __test.botStep(mode); return { guard, st: __test.state(), result: __test.result ? __test.result() : null }; }, mode);
    if (r.st.scene !== 'result') fail(sec, `${mode}: 결과 화면까지 못 감 (scene=${r.st.scene}, ${r.st.no}번)`);
    if (errors.length) fail(sec, `${mode}: 오류 ` + errors.slice(0, 3).join(' | '));
    await page.waitForTimeout(1200); await page.screenshot({ path: path.join(out, `play_${mode}_result.png`) });
    res[mode] = r.result || r.st; await ctx.close();
  }
  report.sections.play = res;
}

/* ── 4. 기기: 화면 맞춤 + 실제 터치·마우스로 조작 ── */
async function checkDevices(browser) {
  const sec = 'devices'; const dir = path.join(out, 'devices'); fs.mkdirSync(dir, { recursive: true }); const rows = [];
  const only = process.env.DEV ? DEVICES.filter(d => d[0].includes(process.env.DEV)) : DEVICES;   /* DEV=아이폰 처럼 일부만 */
  for (const [name, w, h, dsf, touch] of only) {
    const r = { name }; const { ctx, page, errors } = await open(browser, { w, h, dsf, touch, settle: 400 });
    try {
      const ui = await page.evaluate(() => __test.ui || {});
      const stage = async () => page.evaluate(sel => { const el = document.querySelector(sel); const g = el.getBoundingClientRect(); return { L: g.left, T: g.top, W: g.width, H: g.height }; }, ui.stage || 'body');
      let g = await stage();
      r.fit = g.L >= -1 && g.T >= -1 && g.L + g.W <= w + 1 && g.T + g.H <= h + 1 && (Math.abs(g.L * 2 + g.W - w) <= 3 || Math.abs(g.T * 2 + g.H - h) <= 3) && (Math.abs(g.W - w) <= 2 || Math.abs(g.H - h) <= 2);
      if (!r.fit) fail(sec, `${name}: 무대가 화면에 꽉 차게 가운데로 맞춰지지 않음 (${Math.round(g.L)},${Math.round(g.T)} ${Math.round(g.W)}x${Math.round(g.H)})`);
      const S0 = await page.evaluate(() => (__test.stageSize || [1280, 720])[0]);
      const at = async (x, y) => { const G2 = await stage(); const s2 = G2.W / S0; return { x: G2.L + x * s2, y: G2.T + y * s2 }; };   /* 누를 때마다 무대 위치를 새로 잰다 */
      const hitAt = async (x, y) => { const q = await at(x, y); return page.evaluate(([X, Y]) => { const e = document.elementFromPoint(X, Y); return e ? (e.id ? '#' + e.id : (e.className && e.className.baseVal === undefined ? '.' + String(e.className).split(' ')[0] : e.tagName)) : 'none'; }, [q.x, q.y]); };
      const tapXY = async (x, y) => { const q = await at(x, y); if (touch) await page.touchscreen.tap(q.x, q.y); else await page.mouse.click(q.x, q.y); };
      const tapSel = async sel => { if (touch) await page.tap(sel); else await page.click(sel); };
      /* 세로로 든 휴대폰·태블릿: 가로 안내 */
      const portrait = touch && h > w;
      if (portrait) { const on = ui.rotate ? await page.isVisible(ui.rotate) : false; r.rotate = on; if (!on) fail(sec, `${name}: 세로 화면인데 '가로로 돌리기' 안내가 없음`); else if (ui.rotateOk) { await tapSel(ui.rotateOk); await page.waitForTimeout(250); } }
      /* 길게 누르기 메뉴·글자 선택 막힘 */
      r.noMenu = await page.evaluate(sel => { const e = new MouseEvent('contextmenu', { bubbles: true, cancelable: true }); (document.querySelector(sel) || document.body).dispatchEvent(e); return e.defaultPrevented; }, ui.stage || 'body');
      if (touch && !r.noMenu) fail(sec, `${name}: 길게 누르면 메뉴가 뜸 (contextmenu 막기)`);
      /* 이름 쓰기 → 시작 (실제 입력) */
      if (ui.name) { await tapSel(ui.name); await page.keyboard.type('장도초'); }
      if (process.env.DEBUG && ui.start && typeof ui.start !== 'string') { const q = await at(ui.start.x, ui.start.y); log('    pre', JSON.stringify(q), await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return (e.id || e.tagName) + ' t=' + (typeof G !== 'undefined' ? G.titleT : '?'); }, [q.x, q.y])); }
      if (ui.start) { if (typeof ui.start === 'string') await tapSel(ui.start); else await tapXY(ui.start.x, ui.start.y); }
      await page.waitForFunction(() => __test.state().scene !== 'title', null, { timeout: 15000 }).catch(() => {});
      r.started = await page.evaluate(() => __test.state().scene !== 'title');
      if (process.env.DEBUG) log('    start dbg', JSON.stringify(await page.evaluate(() => ({ st: __test.state(), sc: typeof scene !== 'undefined' ? scene : '', act: document.activeElement && document.activeElement.id }))));
      if (!r.started) fail(sec, `${name}: 시작 조작(${JSON.stringify(ui.start)})으로 게임이 시작되지 않음 — 덮개가 클릭을 가리는지 확인`);
      /* 고르기 문항으로 가서: 오답 탭 → 힌트, 정답 탭 → 정답, 다음 탭 → 다음 문항이 저절로 풀리지 않음 */
      const target = await page.evaluate(() => { for (const it of __test.items()) for (let si = 0; si < it.steps.length; si++) if (it.steps[si].kind === 'pick' && it.steps[si].opts && it.steps[si].opts.length >= 3) return [it.no, si]; return null; });
      if (target) {
        await page.evaluate(([n, s]) => __test.goto(n, s), target); await page.waitForTimeout(900);
        const T = await page.evaluate(() => __test.targets().filter(t => !t.confirm));
        const wrong = T.find(t => !t.correct); await tapXY(wrong.x, wrong.y);
        r.hint = await page.waitForFunction(() => __test.state().phase === 'hint', null, { timeout: 15000 }).then(() => true).catch(() => false);
        if (!r.hint) fail(sec, `${name}: 오답을 눌렀는데 힌트가 안 뜸 (또는 정답이 됨: ${JSON.stringify(await page.evaluate(() => __test.state()))})`);
        const cooled = await page.waitForFunction(() => __test.state().cool <= 0, null, { timeout: 30000 }).then(() => true).catch(() => false);
        if (!cooled) { warn(sec, `${name}: 시험용 화면이 너무 느려 오답 뒤 대기가 30초 안에 안 끝남 — 정답 탭 시험을 건너뜀(게임 오류 아님, 실제 기기로 확인)`); throw new Error('SKIP_SLOW'); }
        if (process.env.DEBUG) for (let i = 0; i < 4; i++) { log('    cool', await page.evaluate(() => [T.toFixed(2), Q.cool, document.querySelector('#amps').className, document.querySelector('#banner').className].join(' '))); await page.waitForTimeout(300); }
        await page.waitForTimeout(150);
        const T2 = await page.evaluate(() => __test.targets().filter(t => !t.confirm)); const right = T2.find(t => t.correct); r.rightHit = await hitAt(right.x, right.y); if (process.env.DEBUG) log('    right', JSON.stringify(right), JSON.stringify(await at(right.x, right.y)), await page.evaluate(lab => { const b = [...document.querySelectorAll('#amps .amp')].find(x => x.dataset.v === lab); const r = b.getBoundingClientRect(); const g = document.querySelector('#game').getBoundingClientRect(); const q = [r.left + r.width / 2, r.top + r.height / 2]; return JSON.stringify({ layers: document.elementsFromPoint(q[0], q[1]).slice(0, 6).map(e => (e.id || String(e.className).slice(0, 30) || e.tagName) + ':' + getComputedStyle(e).pointerEvents), cls: b.className, pe: getComputedStyle(b).pointerEvents, ampsCls: document.querySelector('#amps').className, amp: [r.left, r.top, r.width, r.height], game: [g.left, g.top, g.width], SCALE, sx: scrollX, sy: scrollY }); }, right.label)); await tapXY(right.x, right.y);
        r.ok = await page.waitForFunction(() => __test.state().phase === 'ok', null, { timeout: 15000 }).then(() => true).catch(() => false);
        if (!r.ok) fail(sec, `${name}: 정답을 눌렀는데 정답 처리가 안 됨 — 누른 곳의 요소 ${r.rightHit} (${JSON.stringify(await page.evaluate(() => __test.state()))})`);
        await page.screenshot({ path: path.join(dir, name.replace(/[ :]/g, '_') + '.png') });
        if (ui.next && r.ok) { const before = await page.evaluate(() => __test.state()); if (await page.isVisible(ui.next)) { await tapSel(ui.next); await page.waitForTimeout(700);
          const after = await page.evaluate(() => __test.state()); r.noGhost = !(after.phase === 'ok' || after.phase === 'hint' || after.tries > 0) || (after.no === before.no && after.step === before.step);
          if (!r.noGhost) fail(sec, `${name}: '다음'을 누른 손가락이 새 문항 답까지 눌러 버림 (${JSON.stringify(after)})`); } }
      } else warn(sec, '고르기 문항이 없어 오답·정답 탭 시험을 건너뜀');
      /* 연타 통과 막기: 오답들을 빠르게 누르고 곧바로 정답을 눌러도 정답이 되면 안 된다 (규칙 2) */
      if (target) {
        await page.evaluate(([n, s]) => __test.goto(n, s), target); await page.waitForTimeout(900);
        const M = await page.evaluate(() => __test.targets().filter(t => !t.confirm)); const order = M.filter(t => !t.correct).concat(M.filter(t => t.correct));
        /* 사람 손보다 빠른 최악의 경우: 같은 순간에 모두 누른다 (브라우저 안에서 포인터·클릭 사건을 바로 보냄) */
        const pts = []; for (const t of order) pts.push(await at(t.x, t.y));
        await page.evaluate(P => { for (const q of P) { const el = document.elementFromPoint(q.x, q.y); if (!el) continue; const o = { bubbles: true, cancelable: true, clientX: q.x, clientY: q.y, pointerId: 1, pointerType: 'mouse', isPrimary: true };
          el.dispatchEvent(new PointerEvent('pointerdown', o)); el.dispatchEvent(new PointerEvent('pointerup', o)); window.dispatchEvent(new PointerEvent('pointerup', o)); el.dispatchEvent(new MouseEvent('click', o)); } }, pts);
        await page.waitForTimeout(1500); const st = await page.evaluate(() => __test.state()); r.noMash = st.phase !== 'ok';
        if (!r.noMash) fail(sec, `${name}: 오답을 연달아 누른 뒤 정답을 바로 누르면 통과됨 — 판정 대기 중 입력을 막는다`);
      }
      /* 새 보기 보호: 보기가 막 나타난 순간의 탭(터치 뒤 따라오는 클릭)은 답으로 받지 않는다 */
      if (target && touch) {
        const first = await page.evaluate(([n, s]) => { __test.goto(n, s); const t = __test.targets().filter(x => !x.confirm); return t[0]; }, target);
        await tapXY(first.x, first.y); await page.waitForTimeout(800); const st = await page.evaluate(() => __test.state());
        r.freshGuard = st.phase === 'ask' && st.tries === 0;
        if (!r.freshGuard) fail(sec, `${name}: 보기가 나타나자마자 들어온 탭이 답으로 처리됨 — 화면이 바뀌는 탭 뒤 따라오는 클릭이 새 보기를 누름(새 보기는 0.35초 동안 입력을 받지 않게)`);
      }
      /* 멈춤 · 소리 끄기 */
      if (ui.pause) { await tapSel(ui.pause); r.pause = await page.evaluate(() => __test.state().paused); if (!r.pause) fail(sec, `${name}: 멈춤 단추가 안 됨`); if (ui.resume) await tapSel(ui.resume); }
      if (ui.mute) { await tapSel(ui.mute); r.mute = await page.evaluate(() => __test.state().muted); if (!r.mute) fail(sec, `${name}: 소리 끄기가 안 됨`); await tapSel(ui.mute); }
    } catch (e) { if (e.message !== 'SKIP_SLOW') fail(sec, `${name}: 시험 중단 — ${e.message.split('\n')[0]}`); await page.screenshot({ path: path.join(dir, name.replace(/[ :]/g, '_') + '_fail.png') }).catch(() => {}); }
    if (errors.length) fail(sec, `${name}: 오류 ` + errors.slice(0, 2).join(' | '));
    r.errors = errors.length; rows.push(r); log('  ', name, JSON.stringify(r)); await ctx.close();
  }
  report.sections.devices = rows;
}

(async () => {
  const browser = await chromium.launch({ ...EXE, args: ARGS });
  const has = await checkStatic(browser);
  if (has) {
    if (want('content')) { log('· 내용 사진·감사'); await checkContent(browser); }
    if (want('play')) { log('· 자동 플레이'); await checkPlay(browser); }
    if (want('devices')) { log('· 기기 13종'); await checkDevices(browser); }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
  const txt = [`게임: ${report.game}`, ...report.fails.map(f => '✗ ' + f), ...report.warns.map(w => '△ ' + w), report.fails.length ? `FAIL ${report.fails.length}건` : 'PASS'].join('\n');
  fs.writeFileSync(path.join(out, 'report.txt'), txt); log(txt);
  process.exit(report.fails.length ? 1 : 0);
})();
