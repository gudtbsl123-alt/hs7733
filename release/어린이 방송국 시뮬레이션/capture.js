// 「어린이 방송국 시뮬레이션」 스크린샷 10장 자동 캡처 (보스전 없음)
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

  // 게임 안의 실제 함수(pick·pickWord·air·goNext)로 답을 고르고 방송한다
  await page.evaluate(() => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    window.__right = () => { const c = G.cur, q = c.q;
      if (q.type === 'fill') { c.sel = q.blanks.map(() => null); c.focus = 0; q.ans.forEach(w => pickWord(w)); } else pick(q.ans); };
    window.__wrong = async () => { const c = G.cur, q = c.q; while (c.locked > 0) await sleep(100);
      if (q.type === 'fill') { const w = q.bank.filter(x => !q.ans.includes(x)); q.blanks.forEach((_, i) => pickWord(w[i % w.length])); }
      else pick(LAYOUT[q.no].find(v => v !== q.ans && !c.bad.has(v)));
      air(); };
    window.__solve = async () => { while (G.cur.locked > 0) await sleep(100); __right(); air();
      while (G.phase !== 'fb') await sleep(150); await sleep(200); goNext(); await sleep(400); };
    window.__to = async no => { while (G.cur.q.no !== no) await __solve(); };
    window.__finish = async () => { while (G.phase !== 'done') await __solve(); await sleep(1200); };
    window.__nextCh = async () => { await __finish(); document.getElementById('bChNext').click(); await sleep(1200); };
  });

  // 1. 시작화면 (앵커 4명이 번갈아 인사한다)
  await page.fill('#nick', NICKNAME);
  await shot('시작화면', 1500);
  await page.click('#bStart'); await page.waitForTimeout(300);
  await page.click('#bHowOk'); await page.waitForTimeout(400);
  await page.click('#eps .ep >> nth=0'); await page.waitForTimeout(600);

  // 2~4. 초반: 1회 건강 뉴스 (앵커 하트말랑)
  await shot('초반_문제', 1200);                                    // 1번: 손 씻기 원고의 빈칸에 낱말 카드 넣기
  await page.evaluate(async () => { await __solve(); await __to(3); await __wrong(); });
  await shot('초반_오답힌트', 600);                                 // 3번: 방송 사고 + 감독님 힌트
  await page.evaluate(async () => { while (G.cur.locked > 0) await new Promise(r => setTimeout(r, 100)); __right(); air(); });
  await shot('초반_방송성공', 2700);                                // 앵커가 원고를 읽고 시청자 댓글이 올라온다

  // 5~6. 중반: 2회 안전·나눔 뉴스(삐뽀) → 3회 이야기 극장(두리)
  await page.evaluate(async () => { goNext(); await new Promise(r => setTimeout(r, 400)); await __nextCh(); await __to(10); });
  await shot('중반_문제', 900);                                     // 10번: 승강기 버튼의 점자 카드 고르기
  await page.evaluate(async () => { await __nextCh(); await __to(13); await __wrong(); });
  await shot('중반_오답힌트', 600);                                 // 13번: 연우의 마음 + 힌트

  // 7~9. 후반: 4회 우리 반 신문 소식 (식빵 편집장)
  await page.evaluate(async () => { await __nextCh(); await __to(18); });
  await shot('후반_문제', 900);                                     // 18번: 친구 셋 가운데 알맞게 말하지 않은 친구
  await page.evaluate(async () => { await __to(20); await __wrong(); });
  await shot('후반_오답힌트', 600);                                 // 20번: 이어 주는 말 짝 + 힌트
  await page.evaluate(async () => { await __finish(); });
  await shot('방송끝', 1200);                                       // 4회 방송 끝: 앵커 인사와 별

  // 10. 방송 결산
  await page.click('#bChReport');
  await shot('결과창', 1500);

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + [...new Set(errors)].join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
