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
const NICKNAME = '장도초 과학천재';

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  // Claude Code 웹 환경에는 브라우저가 이 위치에 미리 깔려 있다. 없으면 기본 설치본을 쓴다
  const preinstalled = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
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

  // ================= 시나리오 (울림 밴드 월드 투어, 보스전 없음 → 8장) =================
  // 실제 게임을 처음부터 끝까지 진행한다. 리허설은 정답을 고르고, 공연은 박자에 맞춰 친다(빨리 감기).
  // 1번·16번·27번 문항에서 멈춰 '문제 화면'과 '일부러 틀린 뒤 힌트 화면'을 찍는다.
  await page.evaluate(() => {
    window.watchPerf = () => {};   /* 빨리 감기 때문에 생기는 '느린 화면' 자동 저사양 전환을 끈다 (촬영 전용) */
    const ff = s => { for (let i = 0; i < s * 60; i++) { T += 1 / 60; update(1 / 60); } };
    const answer = () => { const st = Q.st;
      if (st.kind === 'strike') { const g = st.target, k = PROP.kind;
        if (k === 'glock') { const bar = g.bar || PROP.order[0]; release({ id: PROP.order.indexOf(bar), bar, hold: true }, g.str === 'loud' ? .9 : g.str === 'soft' ? .2 : .5); }
        else if (k === 'drum') release({ id: 'skin', hold: true }, g.str === 'loud' ? .9 : .2);
        else if (k === 'kalimba') release({ id: PROP.keys[g.key], key: g.key }, .6);
        else if (k === 'uke') release({ id: 'f' + g.fret, fret: g.fret }, .6);
        return; }
      if (st.kind === 'pick') { chooseAmp(st.ans); return; }
      st.ans.forEach(x => chooseAmp(x)); confirmMulti(); };
    /* stop(): 이 조건이 되면 멈춘다 */
    window.__play = stopNo => { let guard = 0;
      while (scene !== 'final' && guard++ < 40000) {
        if (scene === 'map') { const nb = document.querySelector('#mapBtns .next'); nb.click(); ff(.1); continue; }
        if (scene === 'cityEnd') { $('bCeOk').click(); ff(.1); continue; }
        if (scene === 'city') { const ph = CT.phase;
          if (ph === 'rehearsal' && Q) {
            if (Q.mode === 'plan' && Q.it.no === stopNo && Q.si === 0 && Q.stepTries === 0) return 'stop';
            if (Q.mode === 'done') { advance(); ff(.1); continue; }
            if (Q.mode === 'plan' && Q.cool <= 0) { answer(); ff(.4); continue; }
            ff(.2); continue; }
          if (ph === 'concert') { const S = SONG, n = S.notes.find(x => x.st === 'wait');
            if (n && Math.abs(S.t - n.t) < .02) { if (S.def.inst === 'drum') release({ id: 'skin', hold: true }, .5); else { const bar = n.p || PROP.order[1]; release({ id: PROP.order.indexOf(bar), bar, hold: true }, n.s === 'loud' ? .9 : .2); } ff(1 / 60); continue; }
            T += 1 / 120; update(1 / 120); continue; }
          ff(.1); continue; }
        ff(.1); }
      return scene; };
    window.__wrongAmp = () => { const ans = Array.isArray(Q.st.ans) ? Q.st.ans : [Q.st.ans]; const b = [...$('amps').children].find(x => !ans.includes(x.dataset.v)); return b ? [...$('amps').children].indexOf(b) : -1; };
  });
  const clickAmp = async i => { await page.click(`#amps .amp:nth-child(${i + 1})`); };

  // 1) 타이틀: 커튼이 열린 뒤 앰프 이름표에 이름 쓰기
  await page.waitForTimeout(2200);
  await page.fill('#nick', NICKNAME);
  await shot('시작화면_이름쓰기', 500);
  await page.mouse.click(770, 466);                      // 볼륨 손잡이를 올려 시작
  await page.waitForTimeout(1300);
  if (await page.isVisible('#bHowOk')) { await page.click('#bHowOk'); await page.waitForTimeout(300); }

  // 2) 초반: 초록 숲 1번 문항
  await page.evaluate(() => window.__play(1));
  await shot('초반_문제', 900);
  await clickAmp(await page.evaluate(() => window.__wrongAmp()));
  await shot('초반_오답힌트', 1100);

  // 3) 중반: 별빛 놀이공원 16번 문항 (하프)
  await page.waitForTimeout(1800);
  await page.evaluate(() => window.__play(16));
  await shot('중반_문제', 900);
  await clickAmp(await page.evaluate(() => window.__wrongAmp()));
  await shot('중반_오답힌트', 1100);

  // 4) 후반: 달빛 마을 27번 문항 (두 가지 고르기)
  await page.waitForTimeout(1800);
  await page.evaluate(() => window.__play(27));
  await shot('후반_문제', 900);
  await clickAmp(await page.evaluate(() => window.__wrongAmp())); await page.waitForTimeout(150); await page.click('#bOk');
  await shot('후반_오답힌트', 1100);

  // 5) 끝까지 진행 → 투어 기록(결과창)
  await page.waitForTimeout(1900);
  await page.evaluate(() => window.__play(-1));
  await shot('결과창', 2600);
  // ============================================================

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
