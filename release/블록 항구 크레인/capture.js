// 블록 항구 크레인 스크린샷 8장 자동 캡처 (보스전 없음)
// 사용법: NODE_PATH=/opt/node22/lib/node_modules node capture.js "<게임 HTML 경로>" <저장 폴더>
// 3D 게임이라 소프트웨어 WebGL로 열고, ?step 으로 게임 시간을 직접 보낸다(GAME.advance). 30척을 실제로 풀며 필요한 장면만 찍는다.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const gameFile = path.resolve(process.argv[2]);
const outDir = path.resolve(process.argv[3] || 'screenshots');
const NICKNAME = '장도초 수학천재';
const SHOTS = { 12: '중반', 26: '후반' };   /* 중반: 13번 빵집호(무게 비교), 후반: 27번 통통호(무게 싣기) — 0부터 센 문항 번호 */

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const preinstalled = '/opt/pw-browsers/chromium';
  const args = ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'];
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled, args } : { args });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(pathToFileURL(gameFile).href + '?step');
  await page.waitForFunction('window.GAME', null, { timeout: 60000 });
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });

  const gw = s => page.evaluate(s => GAME.advance(s), s);
  const until = async (fn, max = 40, arg) => { for (let i = 0; i < max * 4; i++) { if (await page.evaluate(fn, arg)) return true; await gw(0.25); } return false; };
  const ready = () => until(() => GAME.MODE === 'berth' && GAME.G.state === 'play' && !GAME.crane.busy && GAME.G.crates.every(c => !c.falling));
  let count = 0;
  const shot = async label => { count += 1; const file = path.join(outDir, `${String(count).padStart(2, '0')}_${label}.png`); await page.screenshot({ path: file }); console.log('저장:', path.basename(file)); };
  const move = async (slot, to) => { await page.evaluate(s => { GAME.pickSlot(s); }, slot); await until(() => !GAME.crane.busy && GAME.crane.held); await page.evaluate(h => { GAME.pickSlot(h); }, to); await until(() => !GAME.crane.busy && !GAME.crane.held, 10); };
  /* 문제 데이터에서 정답 짐과 칸을 찾는다 */
  const plan = info => {
    if (info.type === 'load') { const need = info.target - info.start, cs = info.crates;
      if (info.need === 1) return [[cs.find(c => c.w === need).slot, 4]];
      for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) if (cs[i].w + cs[j].w === need) return [[cs[i].slot, 4], [cs[j].slot, 4]]; }
    if (info.type === 'pick') return info.crates.filter(c => c.ok).map(c => [c.slot, 4]);
    return info.crates.filter(c => c.hold >= 0).sort((a, b) => a.hold - b.hold).map(c => [c.slot, 4 + c.hold]);
  };
  const wrongPlan = (info, good) => {
    if (info.type === 'sort') { const c = info.crates.find(c => c.hold === 0); return [[c.slot, 4 + 1]]; }
    const bad = info.crates.filter(c => !good.some(q => q[0] === c.slot)); const w = [[bad[0].slot, 4]]; if (info.need === 2) w.push([(bad[1] || bad[0]).slot, 4]); return w;
  };

  // 1) 타이틀 → 이름 쓰기
  await gw(3); await page.evaluate(() => GAME.BTNS.find(o => o.id === 'new').fn()); await gw(1.5);
  await page.fill('#name', NICKNAME); await gw(0.3); await shot('시작화면_이름쓰기');
  await page.evaluate(() => GAME.BTNS.find(o => o.id === 'go').fn()); await gw(1.5);

  // 2) 부두 6곳 × 5척을 실제로 푼다
  for (let b = 0; b < 6; b++) {
    await until(() => GAME.MODE === 'select'); await gw(1.6);
    await page.evaluate(b => { GAME.chooseBerth(b); }, b);
    for (let k = 0; k < 5; k++) {
      if (!await ready()) throw new Error('문제 준비 안 됨 ' + b + '-' + k);
      const info = await page.evaluate(() => { const G = GAME.G, t = G.task; return { id: t.id, type: t.type, crates: G.crates.map(c => ({ slot: c.slot, w: c.w, ok: !!c.ok, hold: c.hold })), start: t.start, target: t.target, need: t.need, holds: t.holds ? t.holds.length : 0 }; });
      const good = plan(info);
      const label = info.id === 0 ? '초반' : SHOTS[info.id];
      if (label) {
        await gw(0.6); await shot(label + '_문제');
        for (const [s, h] of wrongPlan(info, good)) await move(s, h);
        await until(() => GAME.G.state === 'wrong', 10); await gw(0.9); await shot(label + '_오답힌트');
        await ready();
      }
      for (const [s, h] of good) await move(s, h);
      await until(id => !!GAME.G.done[id], 10, info.id);
      await until(id => GAME.MODE !== 'berth' || (GAME.G.task && GAME.G.task.id !== id), 20, info.id);
    }
  }
  // 3) 30척 완주 결과(점수판·배 도감이 다 나온 뒤)
  await until(() => GAME.MODE === 'result', 30); await gw(4.5); await shot('결과창');

  if (errors.length) console.log('⚠ 게임 오류:\n' + errors.join('\n')); else console.log('게임 오류 없음');
  await browser.close();
})();
