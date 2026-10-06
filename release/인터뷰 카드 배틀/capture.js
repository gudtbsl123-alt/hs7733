// 「인터뷰 카드 배틀」 스크린샷 8장 자동 캡처
// 사용법: node capture.js <게임 HTML 경로> <저장 폴더>
// 보스전이 없는 게임이라 8장: 시작 1 + 초반 2 + 중반 2 + 후반 2 + 결과 1

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

  await page.goto(pathToFileURL(gameFile).href);
  await page.waitForTimeout(1500);

  let count = 0;
  const shot = async (label, wait = 700) => {
    await page.waitForTimeout(wait);
    count += 1;
    const file = path.join(outDir, `${String(count).padStart(2, '0')}_${label}.png`);
    await page.screenshot({ path: file });
    console.log('저장:', path.basename(file));
  };
  const wait = ms => page.waitForTimeout(ms);
  const qno = () => page.evaluate(() => (B && B.q && B.mode === 'ask') ? B.q.no : null);

  // 지금 질문의 정답 카드를 실제로 눌러 낸다 (빈칸 문제는 정답 순서대로 채우고 말하기)
  const answerRight = async () => {
    await page.evaluate(() => {
      const q = B.q;
      if (q.type === 'fill') {
        q.ans.forEach(a => { const cd = B.cards.find(c => c.val === a && !c.used); cd.el.click(); });
        document.getElementById('bTalk').click();
      } else {
        B.cards.find(c => c.orig === q.ans).el.click();
      }
    });
    await wait(1300);
  };
  // 일부러 틀린 카드를 낸다 (빈칸 문제는 순서를 하나 밀어 채운다)
  const answerWrong = async () => {
    await page.evaluate(() => {
      const q = B.q;
      if (q.type === 'fill') {
        const order = q.ans.slice(1).concat(q.ans[0]);
        order.forEach(a => { const cd = B.cards.find(c => c.val === a && !c.used); cd.el.click(); });
        document.getElementById('bTalk').click();
      } else {
        B.cards.find(c => c.orig !== q.ans && !c.dead).el.click();
      }
    });
  };
  const next = async () => { await page.evaluate(() => document.getElementById('bNext').click()); await wait(900); };

  // 면담 하나가 끝날 때까지 다음 문제로 넘어가며 (stopAt 번호에서 멈춤)
  const playUntil = async stopAt => {
    for (let guard = 0; guard < 40; guard++) {
      const n = await qno();
      if (n === stopAt) return;
      if (n == null) {
        const mode = await page.evaluate(() => B ? B.mode : null);
        if (mode === 'intro' || mode === 'solved') { await next(); continue; }
        return; // 마음 문 열림 → 면담 끝
      }
      await answerRight();
    }
  };
  // 면담 끝 → 보상 → 지도 → (휴식 고르기) → 다음 면담 시작
  const toNextStage = async () => {
    await page.waitForSelector('#bStOk', { state: 'visible', timeout: 15000 });
    await wait(1200);
    await page.click('#bStOk');
    await wait(800);
    const reward = await page.isVisible('#scrReward');
    if (reward) { await page.click('#rwCards .rcard'); await wait(800); }
    const pick = await page.$('.node.pick');
    if (pick) { await pick.click(); await wait(800); }
    await page.click('.node.next');
    await wait(1500);
    await next(); // 인터뷰 시작
  };

  // ================= 시나리오 =================
  // 1. 시작 화면: 어린이 기자증에 이름 입력
  await page.fill('#nick', NICKNAME);
  await shot('시작화면', 1200);

  await page.click('#bStart');
  await wait(1000);
  if (await page.isVisible('#scrHow')) { await page.click('#bHowOk'); await wait(600); }
  await page.click('.node.next');
  await wait(1800);
  await next();

  // 2~3. 초반 (면담 준비실 · 떨림이): 1번 문제 / 4번 빈칸 문제 오답 힌트
  await shot('초반_문제', 1200);
  await playUntil(4);
  await answerWrong();
  await shot('초반_오답힌트', 900);
  await wait(1400);
  await answerRight();
  await playUntil(-1);

  // 시립 도서관 → 로봇 연구소
  await toNextStage();
  await playUntil(-1);
  await toNextStage();

  // 4. 중반 (로봇 연구소): 10번 후속 질문 문제
  await playUntil(10);
  await shot('중반_문제', 1200);
  await playUntil(-1);
  await toNextStage();

  // 5. 중반 (질문 설계실): 14번 질문 종류 빈칸 오답 힌트
  await playUntil(14);
  await answerWrong();
  await shot('중반_오답힌트', 900);
  await wait(1400);
  await answerRight();

  // 6. 후반 (질문 설계실): 16번 친구 카드 문제
  await playUntil(16);
  await shot('후반_문제', 1200);
  await playUntil(-1);
  await toNextStage();

  // 7. 후반 (상담실): 18번 오답 힌트
  await playUntil(18);
  await answerWrong();
  await shot('후반_오답힌트', 900);
  await wait(1400);
  await answerRight();
  await playUntil(-1);

  // 8. 결과창
  await page.waitForSelector('#bStOk', { state: 'visible', timeout: 15000 });
  await wait(1200);
  await page.click('#bStOk');
  await shot('결과창', 1800);
  // ============================================================

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
