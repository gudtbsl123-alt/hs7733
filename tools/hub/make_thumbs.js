// 허브 카드에 쓸 게임 썸네일(thumbs/<id>.webp, 480×270)을 만든다. 게임을 1280×720으로 열어 첫 화면을 찍고 줄인다.
// 사용법(저장소 맨 위에서):
//   NODE_PATH=/opt/node22/lib/node_modules node tools/hub/make_thumbs.js            ← 썸네일이 없는 게임만
//   NODE_PATH=/opt/node22/lib/node_modules node tools/hub/make_thumbs.js 69 70     ← 고른 게임만(다시 찍기)
//   … make_thumbs.js --all                                                        ← 전부 다시
// 선택: --wait=4000 (찍기 전 기다리는 시간 ms), --via-curl (인터넷 글꼴·CDN을 curl로 받아 넣기: 브라우저가 인터넷에 못 나가는 환경용)
// 허브는 thumb 칸이 없으면 ./thumbs/<id>.webp를 자동으로 쓰고, 파일이 없으면 이모지로 보여 준다.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { pathToFileURL } = require('url');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'thumbs');
const args = process.argv.slice(2);
const opt = k => { const a = args.find(x => x.startsWith('--' + k)); return a ? (a.split('=')[1] || true) : null; };
const WAIT = +(opt('wait') || 3200);
const VIA_CURL = !!opt('via-curl');
const ids = args.filter(a => /^\d+$/.test(a)).map(Number);

const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const m = src.match(/const FALLBACK = (\{[\s\S]*?\n\] \});/);
if (!m) { console.error('index.html에서 FALLBACK 목록을 찾지 못했어요.'); process.exit(1); }
const games = eval('(' + m[1] + ')').games;
const files = new Map(fs.readdirSync(ROOT).map(f => [f.normalize('NFC'), f]));
fs.mkdirSync(OUT, { recursive: true });
const todo = games.filter(g => opt('all') || (ids.length ? ids.includes(g.id) : !fs.existsSync(path.join(OUT, g.id + '.webp'))));

/* 첫 화면이 작은 상자뿐인 게임은 시작 단추를 누른 뒤 찍는다. 코스터 타이쿤은 학생이 실제로 짓는 놀이공원 모습을 꾸며서 찍는다. */
const PREP = {
  coaster: async (page, g) => {
    await page.locator('button.intro-btn:visible').first().click(); await page.waitForTimeout(500);   // '다음으로' 또는 '새로 시작하기'
    await page.fill('#player-nickname', '장도초'); await page.click('text=공원 개장하기'); await page.waitForTimeout(1200);
    await page.evaluate(seed => {
      const rot = (a, k) => a.length ? a.slice(k % a.length).concat(a.slice(0, k % a.length)) : a;
      const rides = CATALOG.ride.slice().sort((a, b) => b.size - a.size);
      const big = rot(rides.filter(x => x.size >= 5), seed), mid = rot(rides.filter(x => x.size === 4 || x.size === 3), seed), small = rides.filter(x => x.size <= 2);
      const entrance = CATALOG.facility.find(x => x.id === 'park_entrance');
      let put;
      if (typeof placeItem === 'function' && typeof canPlace === 'function') {
        /* 새 엔진: 입구 → 보도 → 시설 순서 규칙과 연구 단계가 있어 직접 배치한다 */
        correctCount = 999; parkOpened = true;
        put = (item, r, c) => { if (item && canPlace(item, r, c)) placeItem(item, r, c); };
        put(entrance, 0, 14);
        const path = (CATALOG.path || [])[0];
        if (path) { for (let r = 2; r < 26; r++) put(path, r, 14); for (let c = 3; c < 27; c++) put(path, 11, c); }
      } else {
        money = 1e9;
        put = (item, r, c) => { if (!item) return; currentBuildItem = item; const p = toScreen(r, c); buildItemAt(p.x, p.y + TILE_H / 2); };
        put(entrance, 0, 14);
      }
      put(big[4] || big[0], 4, 7); put(big[0], 13, 16); put(mid[0], 4, 17); put(mid[1], 13, 6); put(mid[2], 19, 9); put(big[2], 19, 19);
      (CATALOG.shop || []).slice(0, 6).forEach((x, i) => put(x, 7 + (i % 3) * 2, 21 + Math.floor(i / 3) * 2));
      small.slice(0, 4).forEach((x, i) => put(x, 3 + i * 2, 3));
      for (let i = 0; i < 18; i++) spawnGuestAt(2 + (i * 7) % 20, 3 + (i * 11) % 22);
      money = 45000;
    }, g.id);
  },
  start: async page => { await page.click('#btnStart'); await page.waitForTimeout(1500); },
};
const PREP_BY_ID = { 1: 'coaster', 49: 'coaster', 48: 'coaster', 50: 'coaster', 11: 'coaster', 51: 'start' };
/* 선생님이 고른 화면이 따로 있는 게임은 그 그림을 줄여 쓴다 */
const FROM_IMAGE = { 40: 'screenshots/07_후반_고조선시대_플레이화면.png' };

const CACHE = path.join(require('os').tmpdir(), 'hub-thumb-cache');
function viaCurl(route) {
  const url = route.request().url();
  const key = path.join(CACHE, crypto.createHash('md5').update(url).digest('hex'));
  try {
    if (!fs.existsSync(key)) {
      fs.mkdirSync(CACHE, { recursive: true });
      execFileSync('curl', ['-sSL', '--max-time', '30', '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        '-D', key + '.h', '-o', key, url]);
    }
    const head = fs.existsSync(key + '.h') ? fs.readFileSync(key + '.h', 'utf8') : '';
    const ct = (head.match(/content-type:\s*([^\r\n]+)/gi) || []).pop();
    return route.fulfill({ status: 200, contentType: ct ? ct.split(':').slice(1).join(':').trim() : undefined, body: fs.readFileSync(key) });
  } catch (e) { return route.abort(); }
}

/* 그림을 16:9로 가운데 맞춰 자르고(cover) 480×270 webp로 줄인다 */
const toWebp = async b64 => {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
  const W = 480, H = 270, s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const sw = W / s, sh = H / s, sx = (img.naturalWidth - sw) / 2, sy = (img.naturalHeight - sh) / 2;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  return c.toDataURL('image/webp', 0.82).split(',')[1];
};

(async () => {
  if (!todo.length) { console.log('새로 찍을 게임이 없어요.'); return; }
  const preinstalled = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(preinstalled) ? { executablePath: preinstalled } : {});
  const conv = await browser.newPage();
  for (const g of todo) {
    const file = files.get(decodeURIComponent(g.url).replace(/^\.\//, '').normalize('NFC'));
    if (!file) { console.log('✗', g.id, '파일 없음', g.url); continue; }
    if (FROM_IMAGE[g.id]) {
      const b64 = fs.readFileSync(path.join(ROOT, FROM_IMAGE[g.id])).toString('base64');
      const webp = await conv.evaluate(toWebp, b64);
      fs.writeFileSync(path.join(OUT, g.id + '.webp'), Buffer.from(webp, 'base64'));
      console.log('✓', g.id, '(그림에서)', g.title);
      continue;
    }
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    if (VIA_CURL) await ctx.route(u => /^https?:/.test(u.href) && !/^https?:\/\/(127\.0\.0\.1|localhost)/.test(u.href), viaCurl);
    const page = await ctx.newPage();
    try {
      await page.goto(pathToFileURL(path.join(ROOT, file)).href, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(PREP_BY_ID[g.id] ? 1500 : WAIT);
      if (PREP_BY_ID[g.id]) {
        await PREP[PREP_BY_ID[g.id]](page, g); await page.waitForTimeout(WAIT);
        await page.evaluate(() => {                     // 잠깐 뜨는 알림(토스트·목표 달성)은 빼고 찍는다
          const t = document.getElementById('toast'); if (t) t.style.display = 'none';
          document.querySelectorAll('body *').forEach(e => {
            if (e.children.length < 6 && /목표 달성/.test(e.textContent) && /fixed|absolute/.test(getComputedStyle(e).position)) e.style.display = 'none';
          });
        });
      }
      const png = await page.screenshot({ type: 'png' });
      const webp = await conv.evaluate(toWebp, png.toString('base64'));
      const outFile = path.join(OUT, g.id + '.webp');
      fs.writeFileSync(outFile, Buffer.from(webp, 'base64'));
      console.log('✓', g.id, (fs.statSync(outFile).size / 1024).toFixed(0) + 'KB', g.title);
    } catch (e) { console.log('✗', g.id, e.message.split('\n')[0], g.title); }
    await ctx.close();
  }
  await browser.close();
})();
