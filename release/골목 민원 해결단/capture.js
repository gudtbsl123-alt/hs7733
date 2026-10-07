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
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
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

  // ================= 시나리오: 골목 민원 해결단 (보스전 없음 → 8장) =================
  const G = (fn, arg) => page.evaluate(fn, arg);
  // 주민 i에게 다가가 말을 건다(실제 게임의 openTalk) → 대사를 끝까지 보여 준다
  const talkTo = async (qi) => { await G((qi) => { const n = __G.NPCS.find((m) => m.qi === qi); __G.P.x = n.x - 18; __G.P.y = n.y; __G.P.dir = 3; __G.openTalk(n); }, qi); await page.waitForTimeout(1600); await G(() => { __G.S.talk.shown = 999; }); };
  // 틀린 카드 하나 건네기(힌트가 뜬다)
  const giveWrong = () => G(() => { const t = __G.S.talk, q = t.q; const bad = (c) => (q.type === 'order' ? c.opt !== q.ans[0] : Array.isArray(q.ans) ? !q.ans.includes(c.opt) : c.opt !== q.ans);
    const ci = t.cards.findIndex((c) => !c.gray && !c.gone && bad(c)); __G.give(ci, q.type === 'fix' ? __G.NPCS.find((n) => n.kid === q.kidAns) : t.n); });
  // 정답 카드를 차례로 건네 해결하고 대화를 닫는다
  const solve = async (qi) => { await talkTo(qi);
    for (let k = 0; k < 4; k++) { const ph = await G(() => __G.S.talk.phase); if (ph === 'ok') break;
      await G(() => { const t = __G.S.talk, q = t.q, want = q.type === 'order' ? q.ans[t.given.length] : Array.isArray(q.ans) ? q.ans.find((a) => !t.given.includes(a)) : q.ans;
        const ci = t.cards.findIndex((c) => c.opt === want && !c.gone); __G.give(ci, q.type === 'fix' ? __G.NPCS.find((n) => n.kid === q.kidAns) : t.n); }); await page.waitForTimeout(450); }
    await page.waitForTimeout(600); await G(() => __G.closeTalk()); await page.waitForTimeout(300);
    // 구역을 되살리는 연출이 나오면 끝까지 본 뒤 넘어간다
    if (await G(() => !!__G.S.event)) { await page.waitForTimeout(800); await G(() => __G.skipEvent()); await page.waitForTimeout(400); } };
  const zoneQs = (z) => G((z) => __G.QUESTIONS.map((q, i) => [q.zone, i]).filter(([zz]) => zz === z).map(([, i]) => i), z);

  // 1) 시작: 타이틀(간판 글자가 켜짐) → 누르면 이름 쓰기 장면 → 닉네임 입력
  await page.waitForTimeout(5800); await page.mouse.click(640, 400); await page.waitForTimeout(900);
  await page.fill('#nameIn', NICKNAME); await shot('시작화면_이름쓰기', 400);
  await page.keyboard.press('Enter'); await page.waitForTimeout(700);
  await G(() => { __G.S.overlay = null; });   // 하는 법 창 닫기(시작하기)

  // 2) 초반(큰길 골목): 문제 → 오답 힌트
  await talkTo(0); await shot('초반_문제', 300);
  await giveWrong(); await shot('초반_오답힌트', 900);
  await G(() => __G.closeTalk());
  for (const qi of await zoneQs(0)) await solve(qi);
  for (const qi of await zoneQs(1)) await solve(qi);

  // 3) 중반(주민 센터 앞): 세 친구 가운데 잘못 말한 친구에게 고쳐 말하기 카드 건네기
  const fixQ = await G(() => __G.QUESTIONS.findIndex((q) => q.type === 'fix'));
  await talkTo(fixQ); await shot('중반_문제', 300);
  await giveWrong(); await shot('중반_오답힌트', 900);
  await G(() => __G.closeTalk());
  for (const z of [2, 3, 4]) for (const qi of await zoneQs(z)) await solve(qi);

  // 4) 후반(홍보 광장): 포스터 자료를 보고 소개 방법 고르기
  const posterQ = await G(() => __G.QUESTIONS.findIndex((q) => q.data === 'poster'));
  await talkTo(posterQ); await shot('후반_문제', 300);
  await giveWrong(); await shot('후반_오답힌트', 900);
  await G(() => __G.closeTalk());
  for (const qi of await zoneQs(5)) await solve(qi);

  // 5) 밤 축제가 끝나면 결과창
  await page.waitForFunction(() => __G.S.scene === 'result', null, { timeout: 20000 });
  await shot('결과창', 3200);
  // ============================================================

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
