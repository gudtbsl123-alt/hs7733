// 「천지인 메신저」 스크린샷 10장 자동 캡처 (보스전 없음)
// 사용법: node capture.js <게임 HTML 경로> <저장 폴더>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const gameFile = path.resolve(process.argv[2] || 'index.html');
const outDir = path.resolve(process.argv[3] || 'screenshots');
const NICKNAME = '장도초 국어천재';

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
  await page.waitForTimeout(900);

  let count = 0;
  const shot = async (label, wait = 700) => {
    await page.waitForTimeout(wait);
    await page.evaluate(() => { const t = document.getElementById('toast'); if (t) t.innerHTML = ''; }); /* 잠깐 뜨는 알림이 그림을 가리지 않게 */
    count += 1;
    const file = path.join(outDir, `${String(count).padStart(2, '0')}_${label}.png`);
    await page.screenshot({ path: file });
    console.log('저장:', path.basename(file));
  };

  // 게임 안의 실제 함수(공방 이름표·북·자판·pick·pickWord·send·goNext)로 진행한다
  await page.evaluate(() => {
    const sl = ms => new Promise(r => setTimeout(r, ms));
    window.__wait = async (f, ms = 30000) => { const t0 = Date.now(); while (!f()) { if (Date.now() - t0 > ms) throw new Error('timeout'); await sl(60); } };
    window.__ask = async () => { await __wait(() => G.phase === 'act' || G.phase === 'ask' || G.phase === 'done'); };
    window.__act = async () => { const q = G.cur.q;
      if (q.act === 'basic5') for (const n of ['혀끝', '혀뿌리', '입술', '이', '목구멍']) { Workshop.organ(n); await __wait(() => !Workshop.anim); }
      if (q.act === 'stroke') { Workshop.putAnvil('ㄴ'); Workshop.drum(); }
      if (q.act === 'type_ye') for (const k of ['ㆍ', 'ㆍ', 'ㅣ', 'ㅣ']) { keyPress(k); await sl(80); }
      await __wait(() => G.phase === 'ask'); };
    window.__pickRight = () => { const c = G.cur, q = c.q;
      if (q.type === 'one' || q.type === 'who') pick(q.ans);
      else if (q.type === 'two') q.ans.forEach(a => pick(a));
      else if (q.type === 'fill') { c.focus = 0; q.ans.forEach(w => pickWord(w)); }
      else if (q.type === 'ab') { c.sel = q.ans.slice(); renderDock(); }
      else if (q.type === 'key') { (q.keys === 'vowel' ? ['ㅡ', 'ㆍ'] : q.ans).forEach(k => keyPress(k)); } };
    window.__wrong = async () => { await __ask(); if (G.phase === 'act') await __act(); await __wait(() => G.cur.locked <= 0);
      const c = G.cur, q = c.q; pick(LAYOUT[q.no].find(v => v !== q.ans && !c.bad.has(v))); send(); await __wait(() => !!document.querySelector('#msgs .b.hint') && G.phase === 'ask'); };
    window.__solve = async () => { await __ask(); if (G.phase === 'done') return; if (G.phase === 'act') await __act(); await __wait(() => G.cur.locked <= 0);
      __pickRight(); send(); await __wait(() => G.phase === 'fb'); await sl(200); goNext(); await sl(300); };
    window.__to = async no => { await __ask(); while (G.cur.q.no !== no) await __solve(); await __ask(); };
    window.__finish = async () => { while (G.phase !== 'done') await __solve(); };
  });

  // 1. 시작화면 (휴대폰 잠금 화면 + 할아버지의 사랑방)
  await page.fill('#nick', NICKNAME);
  await shot('시작화면', 1200);
  await page.evaluate(() => { save.voice = false; });           /* 캡처를 빨리 하려고 목소리만 끈다 (화면은 같다) */
  await page.click('#slide span'); await page.waitForTimeout(500);
  await page.click('#bHowOk'); await page.waitForTimeout(400);
  await page.click('#chatList .ci >> nth=0');

  // 2~3. 초반: 박물관 나들이
  await page.evaluate(async () => { await __ask(); });
  await shot('초반_문제', 900);                                  // 1번: 동굴 벽화·매듭 끈·점토판 + 낱말 카드
  await page.evaluate(async () => { await __solve(); await __wrong(); });
  await shot('초반_오답힌트', 600);                              // 2번: 오답 → 글벗 힌트

  // 4~6. 중반: 소리 글자 공방 → 헐버트
  await page.evaluate(async () => { await __finish(); await new Promise(r => setTimeout(r, 1500)); document.getElementById('bChNext').click(); await __ask(); Workshop.organ('혀끝'); });
  await shot('중반_공방글자만들기', 900);                        // 혀끝이 윗잇몸에 닿고 금빛 선이 'ㄴ'이 되는 순간
  await page.evaluate(async () => { await __wait(() => !Workshop.anim); await __act(); await __to(5); });
  await shot('중반_천지인자판', 700);                            // 5번: ㅡ + ㆍ = □ 를 천지인 자판으로
  await page.evaluate(async () => { await __finish(); await new Promise(r => setTimeout(r, 1500)); document.getElementById('bChNext').click(); await __to(10); await __wrong(); });
  await shot('중반_오답힌트', 600);                              // 10번: 헐버트의 공부방 + 힌트

  // 7~9. 후반: 다온이의 메시지 → 조사 보고서 → 마지막 장면
  await page.evaluate(async () => { await __finish(); await new Promise(r => setTimeout(r, 1500)); document.getElementById('bChNext').click(); await __to(19); });
  await shot('후반_문제', 900);                                  // 19번: 탕수육 식탁 "부먹? 찍먹?"
  await page.evaluate(async () => { await __finish(); await new Promise(r => setTimeout(r, 1500)); document.getElementById('bChNext').click(); await __to(14); await __wrong(); });
  await shot('후반_오답힌트', 600);                              // 14번: 다온이의 보고하는 글 + 그래프 + 힌트
  await page.evaluate(async () => { await __finish(); await __wait(() => !!document.getElementById('gpText') && document.getElementById('gpText').textContent === '다온아 고맙다', 40000); });
  await shot('마지막장면', 300);                                 // 할아버지가 천지인 자판으로 "다온아 고맙다"

  // 10. 결과창
  await page.waitForFunction(() => !document.getElementById('scrCh').classList.contains('hidden'), null, { timeout: 40000 });
  await page.click('#bChReport');
  await shot('결과창', 1500);

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + [...new Set(errors)].join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
