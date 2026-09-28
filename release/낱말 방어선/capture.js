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
const NICKNAME = '장도초 타자천재';   // 창체 타자 연습 게임

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

  // ================= 시나리오: 낱말 방어선 (보스전 있음 → 10장) =================
  /* 가상 학생: 1분에 tpm타, typo 확률로 틀리며 cond가 참이 될 때까지 게임 시간을 빨리 돌린다 */
  const sim = (cond, secs, tpm = 150, typo = .04) => page.evaluate(([c,s,t,y]) => { const r = __sim(c, s, t, y); __clearLv(); $('banner').classList.add('hidden'); return r; }, [cond, secs, tpm, typo]);
  const keys = async (n) => { for (let i = 0; i < n; i++) { const k = await page.evaluate(() => { const t = nextTok(), K = TOK2KEY[t]; return K ? (K.shift ? 'Shift+' : '') + K.code : null; }); if (k) await page.keyboard.press(k); await page.waitForTimeout(70); } };

  await page.evaluate(() => { localStorage.clear(); });
  await page.reload(); await page.waitForTimeout(600);
  await page.evaluate(() => {
    window.__sim = (cond, maxSecs, tpm, typo) => {
      const dt = 1/60, iv = 60/tpm; let kt = 0, think = 0;
      for (let i = 0; i < maxSecs*60; i++) {
        if (G.over) return 'over';
        if (G.paused === 'lv') { lvLock = 0; const m = LV_OPS.findIndex(o => o.kind === 'main'); chooseLv(m >= 0 && Math.random() < .6 ? m : Math.floor(Math.random()*LV_OPS.length)); }
        if (eval(cond)) return 'ok';
        update(dt); kt += dt;
        if (think > 0) { think -= dt; continue; }
        if (kt >= iv) { kt = 0; const t = nextTok();
          if (t) { if (Math.random() < typo && G.lock) onToken(t === 'ㄱ' ? 'ㄴ' : 'ㄱ'); else onToken(t); if (!G.lock) think = .35; }
          if (G.hp < 140 && G.items.heal > 0) useItem('heal'); }
      }
      return 'time';
    };
    window.__clearLv = () => { while (G && G.paused === 'lv') { lvLock = 0; chooseLv(0); } };
    /* 낱말을 치는 도중인 적을 하나 만든다 (틀린 글쇠 장면용) */
    window.__typeSome = (n) => { for (let i = 0; i < n; i++) { const t = nextTok(); if (t) onToken(t); } };
    window.__typo = () => { for (let i = 0; i < 5 && !G.lock; i++) __typeSome(1); if (!G.lock) return; const exp = G.lock.word.toks[G.lock.pos]; onToken(exp === 'ㅋ' ? 'ㅌ' : 'ㅋ'); };
  });
  await page.fill('#nick', NICKNAME);
  await page.evaluate(() => { save.pack = 'easy'; save.speed = 1; save.adapt = true; writeSave(); syncPackNow(); });
  await shot('시작화면', 2200);                      // 흩어진 글자가 모여 이름이 되는 연출
  await page.click('.mi[data-p="pNew"]'); await page.click('.witem[data-w="boom"]'); await page.waitForTimeout(200);
  await page.click('#bGoC'); await page.waitForTimeout(200); await page.click('#bHowGo'); await page.waitForTimeout(300);
  /* 초반: 1단계 */
  await sim('G.playT>22', 30, 110, .03); await keys(3);
  await shot('초반_낱말치기', 150);
  await page.evaluate(() => __typo());
  await shot('초반_오답글쇠', 150);
  /* 중반: 2단계 (네모·오각 적, 보조 무기) */
  await sim('G.stage===2 && G.stageT>55', 400, 150, .04); await keys(4);
  await shot('중반_낱말치기', 150);
  await page.evaluate(() => __typo());
  await shot('중반_오답글쇠', 150);
  /* 후반: 3단계 (글자가 흩어진 적) */
  await sim('G.stage===3 && G.stageT>60', 400, 150, .04);
  await page.evaluate(() => { const e = G.enemies.find(x => x.disp === 'split'); if (!e) makeEnemy('split'); });
  await sim('G.enemies.some(x=>x.disp==="split" && Math.hypot(x.x-LAY.px,x.y-LAY.py)<380)', 20, 60, 0);
  await keys(2);
  await shot('후반_흩어진글자', 150);
  await page.evaluate(() => __typo());
  await shot('후반_오답글쇠', 150);
  /* 3단계 보스: 문장이 안개에 가려요 */
  await sim('G.phase==="boss" && G.boss && G.boss.t>1.2', 200, 150, .04);
  await page.evaluate(() => { const B = G.boss; showBanner('보스 등장!', B.def.name + ' · ' + B.def.tip, 5000); });
  await shot('보스전_등장', 500);
  await sim('G.boss && G.boss.si>=1 && G.boss.tg.pos>=5', 120, 150, .03); await keys(3);
  await shot('보스전_문장치기', 150);
  /* 끝까지: 도전 성공 결과 */
  await sim('G.over', 400, 150, .04);
  await page.waitForTimeout(2000);
  await shot('결과창', 400);
  // ============================================================

  await browser.close();
  if (errors.length) console.log('게임 오류 발견:\n- ' + errors.join('\n- '));
  console.log(`총 ${count}장 저장 → ${outDir}`);
  if (count < 8 || count > 10) console.log('⚠ 8~10장이 아닙니다. 시나리오를 확인하세요.');
})();
