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

  /* 게임 코드는 (function(){ ... })() 안에 있어 밖에서 상태를 볼 수 없다.
     캡처용 임시 사본에만 들여다보기 구멍(window.__T)을 하나 뚫는다. 화면에 보이는 내용은 그대로다. */
  const os = require('os');
  let html = fs.readFileSync(gameFile, 'utf8');
  const cut = html.lastIndexOf('})();');
  html = html.slice(0, cut) + 'window.__T = code => eval(code);\n' + html.slice(cut);
  const tmp = path.join(os.tmpdir(), 'capture_' + Date.now() + '.html');
  fs.writeFileSync(tmp, html);
  await page.goto(pathToFileURL(tmp).href);
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

  // ================= 시나리오: 유적유물 테트리스 퀴즈 (보스전 없음 → 8장) =================
  const T = code => page.evaluate(c => window.__T(c), code);
  /* 보드 아래쪽에 블록이 쌓인 모습 (줄마다 한두 칸씩 비워 둔다) */
  const stack = rows => T(`(()=>{ for(let r=ROWS-${rows}; r<ROWS; r++){ const hole1=Math.floor(Math.random()*COLS), hole2=(hole1+3+Math.floor(Math.random()*5))%COLS;
      for(let c=0;c<COLS;c++) board[r][c] = (c===hole1 || (r%2 && c===hole2)) ? -1 : Math.floor(Math.random()*7); } drawBoard(); })()`);
  /* n번째 문제까지 풀었다고 보고 진행 상황을 맞춘다 (문제는 하 → 중 → 상 순서로 나온다) */
  const progress = (n, extra) => T(`(()=>{ buildQuizQueue(); quizQueue.splice(0, ${n}); quizStats.attempted=${n}; quizStats.correctFirstTry=Math.round(${n}*.85);
      ${extra}; updateHUD(); updateGaugeUI(); updateProgressUI(); })()`);
  const openQuiz = () => T(`(()=>{ pendingQuizCount=1; startQuizIfPending(); })()`);
  const clickWrong = async () => { const ans = await T('curQuiz.answer'); const wrong = ans===0 ? 1 : 0; await page.click(`#choicesBox .choice >> nth=${wrong}`); };
  const clickRight = async () => { const ans = await T('curQuiz.answer'); await page.click(`#choicesBox .choice >> nth=${ans}`); await page.waitForTimeout(1100); };
  const play = async (ms) => { const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowLeft','ArrowRight']; const end=Date.now()+ms; let i=0; while(Date.now()<end){ await page.keyboard.press(keys[i++%keys.length]); await page.waitForTimeout(160); } };

  await page.fill('#nicknameInput', NICKNAME);
  await shot('시작화면', 600);
  await page.click('#startBtn'); await page.waitForTimeout(600);
  await T('muted=true');    // 캡처하는 동안 소리는 끈다 (화면에는 영향 없음)
  /* 초반: 구석기 · 하 난이도 */
  await stack(4); await progress(1, 'score=640; totalLines=4; gauge=0'); await play(1400);
  await openQuiz(); await shot('초반_문제', 700);
  await clickWrong(); await shot('초반_오답힌트', 600);
  await clickRight();
  /* 중반: 삼국 시대 · 중 난이도 */
  await stack(7); await progress(14, 'score=3420; totalLines=34; level=4; dropInterval=635; maxCombo=4; gauge=0'); await play(1600);
  await openQuiz(); await shot('중반_문제', 700);
  await clickWrong(); await shot('중반_오답힌트', 600);
  await clickRight();
  /* 후반: 고려 · 상 난이도 */
  await stack(9); await progress(24, 'score=6180; totalLines=62; level=7; dropInterval=470; maxCombo=6; gauge=0'); await play(1600);
  await openQuiz(); await shot('후반_문제', 700);
  await clickWrong(); await shot('후반_오답힌트', 600);
  await clickRight();
  /* 30문제를 모두 푼 뒤의 결과창 */
  await T(`(()=>{ quizStats.attempted=30; quizStats.correctFirstTry=26; score=8350; totalLines=81; level=9; maxCombo=7; startTime=Date.now()-17*60*1000-24000; pausedAccum=0; updateHUD(); updateProgressUI(); gameOver('line'); })()`);
  await shot('결과창', 1200);
  fs.unlinkSync(tmp);
  // ============================================================

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
