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
const NICKNAME = '';   // 이 게임에는 닉네임 칸이 없다

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  // Claude Code 웹 환경에는 브라우저가 이 위치에 미리 깔려 있다. 없으면 기본 설치본을 쓴다
  const preinstalled = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  /* 이 게임은 Tailwind·Tone.js·폭죽 효과를 CDN에서 불러온다.
     인터넷이 막힌 곳에서 찍을 때는 CDN_CACHE 폴더(tailwind.js, Tone.js, confetti.js)에서 대신 넣어 준다. */
  const CACHE = process.env.CDN_CACHE;
  if(CACHE){
    const serve = (pat, file) => page.route(pat, r => r.fulfill({ status:200, contentType:'application/javascript', body:fs.readFileSync(path.join(CACHE,file)) }));
    await serve(/cdn\.tailwindcss\.com/, 'tailwind.js'); await serve(/Tone\.js/, 'Tone.js'); await serve(/canvas-confetti/, 'confetti.js');
  }
  await page.goto(pathToFileURL(gameFile).href);
  await page.waitForTimeout(1200);

  let count = 0;
  // 화면 캡처: 애니메이션이 멈출 시간을 준 뒤 찍는다
  const shot = async (label, wait = 700) => {
    await page.waitForTimeout(wait);
    await page.evaluate(() => window.scrollTo(0, 0));   // 입력칸에 초점이 가면 화면이 내려가므로 맨 위로
    count += 1;
    const file = path.join(outDir, `${String(count).padStart(2, '0')}_${label}.png`);
    await page.screenshot({ path: file });
    console.log('저장:', path.basename(file));
  };

  // ================= 시나리오: 그림 넌센스 퀴즈 10탄 (보스전 있음: 10번·20번 → 10장) =================
  const E = (f, arg) => page.evaluate(f, arg);
  const answer = () => E(() => quizData[currentQuestionIndex].answer);
  /* k번째 문제(0부터)로 건너뛴다. 앞 문제를 풀었다고 보고 점수·맞힌 수를 맞춘다 */
  const goTo = (k, score, correct, combo) => E(([k,sc,correct,combo]) => { clearInterval(timerInterval); score=sc; correctAnswersCount=correct; currentCombo=combo; currentQuestionIndex=k-1; nextQuestion(); }, [k, score, correct, combo]);
  const typeWrong = async (w) => { await page.fill('#answer-input', w); await page.click('#answer-form button[type=submit]'); };

  await shot('시작화면', 800);
  await page.click('button[onclick="startGame()"]'); await page.waitForTimeout(600);
  await E(() => { goldenIndices = [5, 12, 16]; });          // 중반에 황금 문제가 보이도록 자리만 정한다
  /* 초반: 2번 문제 */
  await goTo(1, 100, 1, 1);
  await shot('초반_문제', 700);
  await page.click('#btn-item-hint'); await typeWrong('정답');
  await shot('초반_오답힌트', 250);
  /* 중반: 6번 황금 문제 */
  await goTo(5, 480, 5, 3);
  await shot('중반_황금문제', 900);
  await page.click('#btn-item-hint'); await typeWrong('모르겠어');
  await shot('중반_오답힌트', 250);
  /* 10번 보스 스테이지 */
  await goTo(9, 1130, 8, 3);
  await shot('보스전_10번', 1200);
  await page.fill('#answer-input', await answer()); await page.click('#answer-form button[type=submit]');
  await page.waitForTimeout(3500);   // 정답 폭죽이 다 떨어질 때까지
  /* 후반: 15번 문제 */
  await goTo(14, 1880, 12, 2);
  await shot('후반_문제', 700);
  await typeWrong('나무'); await page.click('#btn-item-time');
  await shot('후반_오답힌트', 250);
  /* 20번 최종 보스 */
  await goTo(19, 2710, 17, 4);
  await shot('보스전_20번', 1200);
  await page.fill('#answer-input', await answer()); await page.click('#answer-form button[type=submit]');
  await page.waitForTimeout(900);
  await page.click('button[onclick="nextQuestion()"]');
  await E(() => { gameStartTime = Date.now() - (8*60+42)*1000; goldenCorrectCount = 3; speedKillCount = 6; showFinalResult(); });
  await shot('결과창', 4000);
  // ============================================================

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
