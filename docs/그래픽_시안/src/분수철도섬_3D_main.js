/* 분수 철도 섬 — 3D 디오라마 시안
   three.js(r162, 쓰는 부분만 묶어 압축)를 HTML 안에 넣어 인터넷 없이 실행. 게임 코드는 압축하지 않아 다음에 바로 고칠 수 있다. 툰 셰이딩 + 외곽선 + 부드러운 그림자 + 미니어처 초점 흐림.
   위에 겹친 2D 캔버스로 게임 UI(주문표·동전·시간)를 그린다. 이모지 0개. */
/* three.js는 앞 <script>에서 전역 THREE로 들어온다(build_3d.sh). 이 게임 코드는 압축하지 않는다. */

const W = 1280, H = 720, TAU = Math.PI * 2;
const QS = new URLSearchParams(location.search);
const LOW = QS.get('low') === '1';
const glc = document.getElementById('gl'), hudc = document.getElementById('hud');
function fit() { const s = Math.min(innerWidth / W, innerHeight / H); document.getElementById('stage').style.transform = `translate(-50%,-50%) scale(${s})`; }
addEventListener('resize', fit); fit();

/* ───────── WebGL 준비 (못 쓰면 안내) ───────── */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, powerPreference: 'high-performance' });
} catch (e) {
  document.getElementById('nogl').style.display = 'flex';
  throw e;
}
const PR = LOW ? 0.75 : Math.min(2, window.devicePixelRatio || 1);
renderer.setPixelRatio(PR);
renderer.setSize(W, H, false);
renderer.shadowMap.enabled = !LOW;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#93d4f4');
scene.fog = new THREE.Fog('#cdeefa', 48, 100);
const camera = new THREE.PerspectiveCamera(30, W / H, 1, 240);
function placeCam(t) {
  const az = Math.sin(t * 0.07) * 0.08, r = 31.5, el = 0.8;
  camera.position.set(Math.sin(az) * r * Math.cos(el), r * Math.sin(el), Math.cos(az) * r * Math.cos(el));
  camera.lookAt(0, -1.7, -1.3);
}

/* ───────── 빛: 하늘빛(위) + 따뜻한 땅빛(아래) + 왼쪽 위 햇빛 ───────── */
scene.add(new THREE.HemisphereLight('#eef8ff', '#f5cfa8', 1.55));
const sun = new THREE.DirectionalLight('#fff0d2', 2.0);
sun.position.set(-15, 26, 13);
sun.castShadow = !LOW;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -19, right: 19, top: 19, bottom: -19, near: 1, far: 90 });
sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);

/* ───────── 툰 재질 + 외곽선(뒤집은 껍데기) ───────── */
function gradTex(vals) {
  const d = new Uint8Array(vals.length * 4);
  vals.forEach((v, i) => { d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = v; d[i * 4 + 3] = 255; });
  const t = new THREE.DataTexture(d, vals.length, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.generateMipmaps = false; t.needsUpdate = true; return t;
}
const GRAD = gradTex([120, 196, 255]);
const mats = {};
function toon(c, extra) { const k = c + (extra ? JSON.stringify(extra) : ''); return mats[k] || (mats[k] = new THREE.MeshToonMaterial(Object.assign({ color: c, gradientMap: GRAD }, extra || {}))); }
const INK = new THREE.MeshBasicMaterial({ color: '#3b2516', side: THREE.BackSide });
function outline(m, t = 0.05) {
  const g = m.geometry; if (!g.boundingBox) g.computeBoundingBox();
  const s = new THREE.Vector3(); g.boundingBox.getSize(s);
  const h = new THREE.Mesh(g, INK);
  h.scale.set((s.x + 2 * t) / Math.max(s.x, 0.001), (s.y + 2 * t) / Math.max(s.y, 0.001), (s.z + 2 * t) / Math.max(s.z, 0.001));
  m.add(h); return m;
}
function mesh(geo, c, o = {}) {
  const m = new THREE.Mesh(geo, o.material || toon(c, o.mat));
  m.castShadow = o.cast !== false; m.receiveShadow = o.recv !== false;
  if (o.ol !== 0) outline(m, o.ol ?? 0.05);
  if (o.pos) m.position.set(...o.pos); if (o.rot) m.rotation.set(...o.rot); if (o.sc) m.scale.set(...o.sc);
  return m;
}
function rng(seed) { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }

const world = new THREE.Group(); scene.add(world);
const IX = 10.8, IZ = 7.3, TX = 7.5, TZ = 4.5;
const anim = [];   /* 매 프레임 움직일 것들 */

/* ───────── 섬 ───────── */
function buildIsland() {
  const dirt = mesh(new THREE.CylinderGeometry(1, 0.88, 2.6, 80), '#c98b56', { ol: 0, sc: [IX - 0.2, 1, IZ - 0.2], pos: [0, -1.55, 0] });
  const dirtInk = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.88, 2.6, 80), INK); dirtInk.scale.set(IX - 0.05, 1.02, IZ - 0.05); dirtInk.position.y = -1.55;
  const grass = mesh(new THREE.CylinderGeometry(1, 1, 0.55, 80), '#8ad46f', { ol: 0, sc: [IX, 1, IZ], pos: [0, -0.27, 0] });
  const grassInk = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.55, 80), INK); grassInk.scale.set(IX + 0.13, 1.06, IZ + 0.13); grassInk.position.y = -0.27;
  world.add(dirt, dirtInk, grass, grassInk);
  /* 흙 띠(층) */
  for (const [y, c] of [[-1.0, '#b77a4a'], [-1.9, '#a96c40']]) { const b = mesh(new THREE.CylinderGeometry(1, 1, 0.16, 80), c, { ol: 0, sc: [IX - 0.24 - (y < -1.5 ? 0.35 : 0.08), 1, IZ - 0.24 - (y < -1.5 ? 0.3 : 0.08)], pos: [0, y, 0] }); world.add(b); }
  /* 바다 + 물결 무늬 + 거품 */
  const water = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), toon('#46b0e4')); water.rotation.x = -Math.PI / 2; water.position.y = -1.25; water.receiveShadow = true; scene.add(water);
  const wc = document.createElement('canvas'); wc.width = wc.height = 256; const wg = wc.getContext('2d'); wg.strokeStyle = 'rgba(255,255,255,.9)'; wg.lineWidth = 5; wg.lineCap = 'round';
  const R = rng(4); for (let i = 0; i < 14; i++) { const x = R() * 256, y = R() * 256; wg.beginPath(); wg.moveTo(x, y); wg.quadraticCurveTo(x + 10, y - 7, x + 20, y); wg.quadraticCurveTo(x + 30, y + 7, x + 40, y); wg.stroke(); }
  const wt = new THREE.CanvasTexture(wc); wt.wrapS = wt.wrapT = THREE.RepeatWrapping; wt.repeat.set(26, 26); wt.colorSpace = THREE.SRGBColorSpace;
  const waves = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshBasicMaterial({ map: wt, transparent: true, opacity: 0.28, depthWrite: false }));
  waves.rotation.x = -Math.PI / 2; waves.position.y = -1.22; scene.add(waves);
  anim.push((t) => { wt.offset.set(t * 0.004, t * 0.002); });
  const foam = new THREE.Mesh(new THREE.RingGeometry(1, 1.075, 96), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85, depthWrite: false }));
  foam.rotation.x = -Math.PI / 2; foam.position.y = -1.2; foam.scale.set(IX + 0.25, IZ + 0.25, 1); scene.add(foam);
  anim.push((t) => { const k = 1 + Math.sin(t * 1.3) * 0.012; foam.scale.set((IX + 0.25) * k, (IZ + 0.25) * k, 1); foam.material.opacity = 0.65 + 0.2 * Math.sin(t * 1.3); });
  /* 바위 */
  for (let i = 0; i < 9; i++) { const a = R() * TAU; const r = mesh(new THREE.DodecahedronGeometry(0.35 + R() * 0.35, 0), '#a7a2ad', { pos: [Math.cos(a) * (IX + 0.2), -1.05, Math.sin(a) * (IZ + 0.2)], rot: [R(), R(), R()] }); world.add(r); }
}

/* ───────── 선로 ───────── */
let curve, LEN;
function buildTrack() {
  const pts = []; for (let i = 0; i < 120; i++) { const a = i / 120 * TAU, c = Math.cos(a), s = Math.sin(a); pts.push(new THREE.Vector3(TX * Math.sign(c) * Math.pow(Math.abs(c), 0.5), 0, TZ * Math.sign(s) * Math.pow(Math.abs(s), 0.5))); }
  curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal'); LEN = curve.getLength();
  /* 자갈 띠 */
  const N = 360, pos = [], idx = [], up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i <= N; i++) { const u = (i % N) / N, p = curve.getPointAt(u), t = curve.getTangentAt(u), n = new THREE.Vector3().crossVectors(up, t).normalize();
    pos.push(p.x + n.x * 0.82, 0.02, p.z + n.z * 0.82, p.x - n.x * 0.82, 0.02, p.z - n.z * 0.82); if (i < N) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); } }
  const bed = new THREE.BufferGeometry(); bed.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); bed.setIndex(idx); bed.computeVertexNormals();
  const bedM = new THREE.Mesh(bed, toon('#c4b3a3', { side: THREE.DoubleSide })); bedM.receiveShadow = true; world.add(bedM);
  /* 침목 */
  const cnt = Math.floor(LEN / 0.5), sl = new THREE.InstancedMesh(new THREE.BoxGeometry(1.2, 0.1, 0.26), toon('#9a643f'), cnt);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < cnt; i++) { const u = i / cnt, p = curve.getPointAt(u), t = curve.getTangentAt(u); e.set(0, Math.atan2(t.x, t.z), 0); q.setFromEuler(e); m4.compose(new THREE.Vector3(p.x, 0.08, p.z), q, one); sl.setMatrixAt(i, m4); }
  sl.castShadow = true; sl.receiveShadow = true; world.add(sl);
  /* 레일 2줄 */
  for (const sgn of [-1, 1]) { const rp = []; for (let i = 0; i < 240; i++) { const u = i / 240, p = curve.getPointAt(u), t = curve.getTangentAt(u), n = new THREE.Vector3().crossVectors(up, t).normalize(); rp.push(new THREE.Vector3(p.x + n.x * 0.4 * sgn, 0.18, p.z + n.z * 0.4 * sgn)); }
    const rc = new THREE.CatmullRomCurve3(rp, true); const rail = new THREE.Mesh(new THREE.TubeGeometry(rc, 480, 0.055, 6, true), toon('#dfe5ee')); rail.castShadow = true; world.add(rail); }
}

/* ───────── 기차 ───────── */
function makeLoco() {
  const g = new THREE.Group();
  g.add(mesh(new THREE.BoxGeometry(0.94, 0.2, 2.1), '#e2453b', { pos: [0, 0.44, 0] }));
  g.add(mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.28, 24), '#2f9e6a', { rot: [Math.PI / 2, 0, 0], pos: [0, 0.88, 0.34] }));
  for (const z of [0.0, 0.42, 0.84]) g.add(mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.07, 24), '#ffc84a', { rot: [Math.PI / 2, 0, 0], pos: [0, 0.88, z], ol: 0.02 }));
  g.add(mesh(new THREE.BoxGeometry(0.92, 0.88, 0.74), '#2f9e6a', { pos: [0, 0.98, -0.58] }));
  g.add(mesh(new THREE.BoxGeometry(0.96, 0.3, 0.38), '#a9dcf6', { pos: [0, 1.1, -0.58], ol: 0 }));
  g.add(mesh(new THREE.BoxGeometry(1.08, 0.13, 0.92), '#1e5e4b', { pos: [0, 1.48, -0.58] }));
  g.add(mesh(new THREE.CylinderGeometry(0.13, 0.17, 0.46, 16), '#3a3a46', { pos: [0, 1.36, 0.8] }));
  g.add(mesh(new THREE.CylinderGeometry(0.23, 0.15, 0.13, 16), '#3a3a46', { pos: [0, 1.63, 0.8] }));
  g.add(mesh(new THREE.SphereGeometry(0.21, 16, 10, 0, TAU, 0, Math.PI / 2), '#ffc84a', { pos: [0, 1.22, 0.2] }));
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.12, 16), new THREE.MeshBasicMaterial({ color: '#fff4c0' }));
  lamp.rotation.x = Math.PI / 2; lamp.position.set(0, 1.02, 1.02); outline(lamp, 0.03); g.add(lamp);
  g.add(mesh(new THREE.ConeGeometry(0.52, 0.5, 4, 1), '#e2453b', { rot: [Math.PI / 2, Math.PI / 4, 0], pos: [0, 0.32, 1.12], sc: [1, 1, 0.62] }));
  for (const z of [-0.56, 0.06, 0.64]) for (const x of [-0.5, 0.5]) g.add(mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.1, 20), '#d8443a', { rot: [0, 0, Math.PI / 2], pos: [x, 0.31, z], ol: 0.03 }));
  return g;
}
function makeCar(seed) {
  const g = new THREE.Group(), R = rng(seed);
  g.add(mesh(new THREE.BoxGeometry(0.9, 0.12, 1.5), '#4a434f', { pos: [0, 0.38, 0] }));
  g.add(mesh(new THREE.BoxGeometry(0.94, 0.56, 1.52), '#c4553a', { pos: [0, 0.72, 0] }));
  for (const y of [0.6, 0.8]) g.add(mesh(new THREE.BoxGeometry(0.96, 0.03, 1.54), '#7a2f22', { pos: [0, y, 0], ol: 0 }));
  for (let i = 0; i < 6; i++) g.add(mesh(new THREE.SphereGeometry(0.17, 16, 10), '#e3a75e', { sc: [1, 0.45, 1], pos: [(i % 2 ? 0.2 : -0.2) + (R() - 0.5) * 0.05, 1.04, -0.5 + ((i / 2) | 0) * 0.5], ol: 0.035 }));
  for (const z of [-0.5, 0.5]) for (const x of [-0.48, 0.48]) g.add(mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.08, 16), '#3c3c46', { rot: [0, 0, Math.PI / 2], pos: [x, 0.25, z], ol: 0.03 }));
  return g;
}
const train = []; let tu = 0.93; const GAPS = [0, 2.7, 4.75];
const puffs = [];
function buildTrain() {
  train.push(makeLoco(), makeCar(1), makeCar(2)); train.forEach((p) => { p.scale.setScalar(1.18); world.add(p); });
  const pm = toon('#ffffff', { transparent: true, opacity: 1 });
  for (let i = 0; i < 26; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 10), pm.clone()); m.visible = false; m.castShadow = false; world.add(m); puffs.push({ m, life: 9, vx: 0, vz: 0 }); }
}
let puffT = 0; const tmpV = new THREE.Vector3();
function stepTrain(dt) {
  tu = (tu + dt * 1.7 / LEN) % 1;
  train.forEach((p, i) => { const u = ((tu - GAPS[i] / LEN) % 1 + 1) % 1, pt = curve.getPointAt(u), tg = curve.getTangentAt(u); p.position.set(pt.x, 0.1, pt.z); p.rotation.y = Math.atan2(tg.x, tg.z); });
  puffT -= dt;
  if (puffT <= 0) { puffT = 0.22; const f = puffs.find((p) => p.life > 2.2); if (f) { train[0].localToWorld(tmpV.set(0, 1.75, 0.8)); f.m.position.copy(tmpV); f.life = 0; f.vx = (Math.random() - 0.5) * 0.3; f.vz = (Math.random() - 0.5) * 0.3; f.m.visible = true; } }
  for (const p of puffs) { if (p.life > 2.2) { p.m.visible = false; continue; } p.life += dt; const k = p.life / 2.2; p.m.position.x += p.vx * dt; p.m.position.z += p.vz * dt; p.m.position.y += dt * 1.1; const s = 0.6 + k * 1.6; p.m.scale.set(s, s, s); p.m.material.opacity = k < 0.1 ? k / 0.1 : 1 - (k - 0.1) / 0.9; }
}

/* ───────── 역 ───────── */
function signTex(name, bg) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 160; const g = c.getContext('2d');
  g.fillStyle = '#3b2516'; g.beginPath(); rr(g, 4, 4, 504, 152, 30); g.fill();
  g.fillStyle = bg; g.beginPath(); rr(g, 14, 14, 484, 132, 22); g.fill();
  g.font = '92px Bagel, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#5a2a10'; g.fillText(name, 256, 86);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const stations = [];
function buildStation(u, side, name, roofC, signBg) {
  const g = new THREE.Group(), p = curve.getPointAt(u), t = curve.getTangentAt(u);
  g.position.set(p.x, 0, p.z); g.rotation.y = Math.atan2(t.x, t.z);
  g.add(mesh(new THREE.BoxGeometry(1.15, 0.34, 3.6), '#efe1cc', { pos: [side * 1.2, 0.17, 0] }));
  g.add(mesh(new THREE.BoxGeometry(0.08, 0.02, 3.6), '#ffd23f', { pos: [side * 0.72, 0.35, 0], ol: 0 }));
  g.add(mesh(new THREE.BoxGeometry(0.92, 1.25, 2.3), '#fff1dc', { pos: [side * 2.15, 0.95, 0] }));
  g.add(mesh(new THREE.CylinderGeometry(0.64, 0.64, 2.56, 3), roofC, { rot: [-Math.PI / 2, 0, 0], pos: [side * 2.15, 1.88, 0] }));
  for (const z of [-0.8, 0.8]) g.add(mesh(new THREE.BoxGeometry(0.06, 0.42, 0.38), '#7fb6e6', { pos: [side * 1.67, 1.05, z], ol: 0.02 }));
  g.add(mesh(new THREE.BoxGeometry(0.06, 0.58, 0.4), '#9a5a36', { pos: [side * 1.67, 0.62, 0], ol: 0.02 }));
  const board = new THREE.Group(); board.position.set(side * 1.0, 0.34, -0.15); board.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2; g.add(board);
  for (const bx of [-0.9, 0.9]) board.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 8), '#2f5b52', { pos: [bx, 0.55, 0], ol: 0.02 }));
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 0.66), new THREE.MeshBasicMaterial({ map: signTex(name, signBg), transparent: true }));
  sign.position.set(0, 1.2, 0.03); sign.rotation.x = -0.45; board.add(sign);
  board.add(mesh(new THREE.BoxGeometry(2.16, 0.7, 0.05), '#3b2516', { pos: [0, 1.2, -0.01], rot: [-0.45, 0, 0], ol: 0 }));
  for (const z of [-1.45, 1.45]) { g.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 8), '#2f5b52', { pos: [side * 1.55, 0.88, z], ol: 0.02 }));
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshBasicMaterial({ color: '#fff0b0' })); bulb.position.set(side * 1.55, 1.48, z); outline(bulb, 0.025); g.add(bulb); }
  const R = rng(name.length * 7 + (side > 0 ? 3 : 1));
  for (let i = 0; i < 3; i++) { const pg = new THREE.Group(); const col = ['#ff8a3d', '#4f86e0', '#b46be0', '#5fbf5a'][(R() * 4) | 0];
    pg.add(mesh(new THREE.CapsuleGeometry(0.15, 0.2, 4, 10), col, { pos: [0, 0.3, 0], ol: 0.03 }));
    pg.add(mesh(new THREE.SphereGeometry(0.15, 14, 10), '#ffd9b8', { pos: [0, 0.66, 0], ol: 0.03 }));
    pg.position.set(side * (1.1 + R() * 0.25), 0.34, -1.1 + i * 0.55 + (i > 0 ? 0.9 : 0)); g.add(pg);
    const ph = R() * 6; anim.push((t) => { pg.position.y = 0.34 + Math.abs(Math.sin(t * 3 + ph)) * 0.06; }); }
  world.add(g); stations.push({ g, anchor: new THREE.Vector3(side * 2.15, 3.0, 0) });
}

/* ───────── 나무 · 집 · 풍차 · 꽃 ───────── */
function cherry(x, z, s, seed) { const g = new THREE.Group(), R = rng(seed);
  g.add(mesh(new THREE.CylinderGeometry(0.12, 0.17, 1.0, 8), '#7a4a34', { pos: [0, 0.5, 0] }));
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + R(); g.add(mesh(new THREE.IcosahedronGeometry(0.5 + R() * 0.18, 1), i % 2 ? '#ffc4d3' : '#ffb2c8', { pos: [Math.cos(a) * 0.36, 1.25 + R() * 0.35, Math.sin(a) * 0.36] })); }
  g.add(mesh(new THREE.IcosahedronGeometry(0.55, 1), '#ffd0dc', { pos: [0, 1.7, 0] }));
  g.position.set(x, 0, z); g.scale.setScalar(s); world.add(g);
  anim.push((t) => { g.rotation.z = Math.sin(t * 1.2 + seed) * 0.02; }); }
function pine(x, z, s) { const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.6, 8), '#7a4a34', { pos: [0, 0.3, 0] }));
  g.add(mesh(new THREE.ConeGeometry(0.62, 1.0, 7), '#4fae6a', { pos: [0, 0.95, 0] }));
  g.add(mesh(new THREE.ConeGeometry(0.46, 0.8, 7), '#62c27a', { pos: [0, 1.5, 0] }));
  g.position.set(x, 0, z); g.scale.setScalar(s); world.add(g); }
function bush(x, z, s) { const g = new THREE.Group(); for (const [dx, dy, r] of [[0, 0.25, 0.36], [0.3, 0.2, 0.28], [-0.28, 0.2, 0.26]]) g.add(mesh(new THREE.IcosahedronGeometry(r, 1), '#6cc464', { pos: [dx, dy, 0] })); g.position.set(x, 0, z); g.scale.setScalar(s); world.add(g); }
function house(x, z, ry, wall, roofC) { const g = new THREE.Group();
  g.add(mesh(new THREE.BoxGeometry(1.0, 0.8, 0.9), wall, { pos: [0, 0.4, 0] }));
  const roof = mesh(new THREE.ConeGeometry(0.85, 0.7, 4), roofC, { pos: [0, 1.15, 0], rot: [0, Math.PI / 4, 0] }); g.add(roof);
  g.add(mesh(new THREE.BoxGeometry(0.26, 0.42, 0.04), '#9a5a36', { pos: [0, 0.21, 0.46], ol: 0.02 }));
  g.add(mesh(new THREE.BoxGeometry(0.24, 0.22, 0.04), '#8fcff2', { pos: [0.3, 0.52, 0.46], ol: 0.02 }));
  g.position.set(x, 0, z); g.rotation.y = ry; world.add(g); }
function windmill(x, z) { const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.42, 0.62, 2.3, 10), '#fff1dc', { pos: [0, 1.15, 0] }));
  g.add(mesh(new THREE.ConeGeometry(0.62, 0.7, 10), '#e2453b', { pos: [0, 2.6, 0] }));
  const hub = new THREE.Group(); hub.position.set(0, 2.15, 0.62); g.add(hub);
  hub.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 10), '#7a4a34', { rot: [Math.PI / 2, 0, 0] }));
  for (let i = 0; i < 4; i++) { const b = new THREE.Group(); b.rotation.z = i * Math.PI / 2; b.add(mesh(new THREE.BoxGeometry(0.26, 1.35, 0.04), '#fff8ee', { pos: [0.1, 0.78, 0.06], ol: 0.025 })); hub.add(b); }
  g.position.set(x, 0, z); world.add(g); anim.push((t) => { hub.rotation.z = -t * 0.9; }); }
function scatter() {
  const R = rng(17);
  const inside = (x, z, m) => Math.pow(Math.abs(x / (TX - m)), 2) + Math.pow(Math.abs(z / (TZ - m)), 2) < 1;
  const onTrack = (x, z) => { const d = Math.pow(Math.abs(x / TX), 4) + Math.pow(Math.abs(z / TZ), 4); return d > 0.55 && d < 1.7; };
  /* 가운데 마을 */
  house(-2.6, -0.8, 0.3, '#fff1dc', '#ff8a4c'); house(-1.2, -1.6, -0.2, '#fdf0ff', '#6b8fd6'); house(2.9, -1.2, 0.2, '#fff6e0', '#e9a24a');
  windmill(0.6, -1.4);
  for (const [x, z, s] of [[-4.6, 1.2, 1.0], [-5.2, -1.6, 0.9], [4.6, 1.0, 1.05], [5.2, -1.4, 0.85], [-3.0, 1.6, 0.8]]) cherry(x, z, s, (x * 7 + z * 3) | 0);
  for (const [x, z, s] of [[3.6, 1.9, 0.9], [-0.6, 0.6, 0.7]]) pine(x, z, s);
  for (const [x, z, s] of [[1.6, 0.4, 0.9], [-3.8, -2.3, 0.8], [4.2, -2.6, 0.9]]) bush(x, z, s);
  /* 바깥 둘레 */
  for (let i = 0; i < 22; i++) { const a = i / 22 * TAU + R() * 0.12; const x = Math.cos(a) * (IX - 1.1), z = Math.sin(a) * (IZ - 1.0);
    if (z > 5.2 && Math.abs(x) < 3.6) continue; if (z < -5.0 && Math.abs(x) < 3.2) continue;
    const k = R(); if (k < 0.4) cherry(x, z, 0.75 + R() * 0.3, i * 13); else if (k < 0.7) pine(x, z, 0.7 + R() * 0.35); else bush(x, z, 0.8 + R() * 0.4); }
  /* 꽃 (인스턴스) */
  const N = LOW ? 120 : 340, fl = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.075, 0), toon('#ffffff'), N), m4 = new THREE.Matrix4(), col = new THREE.Color();
  const cols = ['#fff6e0', '#ffd84a', '#ff9ac0', '#ff6b7a', '#b8a6ff']; let n = 0;
  while (n < N) { const x = (R() - 0.5) * 2 * IX, z = (R() - 0.5) * 2 * IZ; if (Math.pow(x / IX, 2) + Math.pow(z / IZ, 2) > 0.86 || onTrack(x, z)) continue; m4.makeTranslation(x, 0.06, z); fl.setMatrixAt(n, m4); fl.setColorAt(n, col.set(cols[n % 5])); n++; }
  world.add(fl);
  void inside;
}

/* ───────── 구름(그림자가 섬 위를 지나감) ───────── */
const clouds = [];
function buildClouds() { const R = rng(23);
  for (let i = 0; i < 4; i++) { const g = new THREE.Group(); const n = 4 + ((R() * 3) | 0);
    for (let k = 0; k < n; k++) g.add(mesh(new THREE.IcosahedronGeometry(0.9 + R() * 0.6, 2), '#ffffff', { pos: [(k - n / 2) * 0.95, R() * 0.4, (R() - 0.5) * 0.8], sc: [1, 0.7, 1], ol: 0.06 }));
    g.position.set(-20 + i * 11 + R() * 4, 8.5 + R() * 1.5, -6 + R() * 8); world.add(g); clouds.push(g); } }

/* ───────── 꽃잎 ───────── */
let petalMesh, petals = [];
function buildPetals() { const N = LOW ? 30 : 140, R = rng(31);
  petalMesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.16, 0.1), toon('#ffb9cc', { side: THREE.DoubleSide }), N); petalMesh.castShadow = false;
  for (let i = 0; i < N; i++) petals.push({ x: (R() - 0.5) * 30, y: R() * 12, z: (R() - 0.5) * 20, rx: R() * 6, ry: R() * 6, vr: 1 + R() * 2, ph: R() * 6 });
  world.add(petalMesh); }
const pm4 = new THREE.Matrix4(), pq = new THREE.Quaternion(), pe = new THREE.Euler(), pp = new THREE.Vector3(), ps = new THREE.Vector3(1, 1, 1);
function stepPetals(dt, t) { petals.forEach((p, i) => { p.y -= dt * 0.9; p.x += dt * (0.7 + Math.sin(t + p.ph) * 0.5); p.rx += dt * p.vr; p.ry += dt * p.vr * 0.7;
  if (p.y < 0.05) { p.y = 10 + Math.random() * 2; p.x = -15 + Math.random() * 26; } if (p.x > 16) p.x = -15;
  pe.set(p.rx, p.ry, 0); pq.setFromEuler(pe); pp.set(p.x, p.y, p.z); pm4.compose(pp, pq, ps); petalMesh.setMatrixAt(i, pm4); }); petalMesh.instanceMatrix.needsUpdate = true; }

/* ───────── 미니어처 초점 흐림 + 색보정 + 비네트 ───────── */
let rt = null, postScene = null, postCam = null;
function buildPost() {
  if (LOW) return;
  rt = new THREE.WebGLRenderTarget(W * PR, H * PR, { samples: 4 });
  const mat = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: rt.texture }, px: { value: new THREE.Vector2(1 / (W * PR), 1 / (H * PR)) }, focusY: { value: 0.46 }, band: { value: 0.2 }, amount: { value: 1.0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 px; uniform float focusY; uniform float band; uniform float amount; varying vec2 vUv;
      void main(){
        float d=abs(vUv.y-focusY); float b=smoothstep(band,band+.34,d)*amount;
        vec3 c=texture2D(tDiffuse,vUv).rgb;
        if(b>.002){ vec3 acc=c; float w=1.;
          for(int i=0;i<14;i++){ float fi=float(i); float a=fi*2.39996; float r=sqrt(fi+.5)/3.8; vec2 o=vec2(cos(a),sin(a))*r*b*14.; acc+=texture2D(tDiffuse,vUv+o*px).rgb; w+=1.; }
          c=acc/w; }
        float l=dot(c,vec3(.299,.587,.114));
        c=mix(c,c*vec3(1.05,1.0,.93),smoothstep(.45,1.,l));
        c=mix(c,c*vec3(.93,.96,1.07),1.-smoothstep(.0,.42,l));
        vec2 q=vUv-.5; c*=1.-dot(q,q)*.5;
        gl_FragColor=vec4(c,1.);
        #include <colorspace_fragment>
      }`,
    depthTest: false, depthWrite: false,
  });
  postScene = new THREE.Scene(); postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
  postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
}

/* ══════════════ 2D 게임 UI (주문표 · 동전 · 시간) ══════════════ */
const hud = hudc.getContext('2d'); const HPR = LOW ? 1 : Math.min(2, window.devicePixelRatio || 1);
hudc.width = W * HPR; hudc.height = H * HPR;
const INKC = '#3b2516';
function rr(g, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function circ(g, x, y, r) { g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); g.closePath(); }
function el(g, x, y, rx, ry, rot = 0) { g.moveTo(x + rx * Math.cos(rot), y + rx * Math.sin(rot)); g.ellipse(x, y, rx, ry, rot, 0, TAU); g.closePath(); }
function lin(g, x0, y0, x1, y1, st) { const gr = g.createLinearGradient(x0, y0, x1, y1); st.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; }
function txt(g, s, x, y, o) { g.save(); g.font = `${o.size}px ${o.font || 'Jua'}, sans-serif`; g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'alphabetic'; g.lineJoin = 'round'; g.miterLimit = 2;
  if (o.ex) { g.fillStyle = o.exc; g.strokeStyle = o.exc; g.lineWidth = o.sw || 0; for (let i = o.ex; i >= 1; i--) { if (o.sw) g.strokeText(s, x, y + i); g.fillText(s, x, y + i); } }
  if (o.sw) { g.strokeStyle = o.stroke; g.lineWidth = o.sw; g.strokeText(s, x, y); } g.fillStyle = o.fill; g.fillText(s, x, y); g.restore(); }
const LX = -0.62, LY = -0.78;
function cel(g, shape, base, sh, hl, o = {}) { const s = o.s ?? 5, h = o.h ?? 4, ow = o.ow ?? 3; g.save();
  if (ow > 0) { g.beginPath(); shape(g); g.lineWidth = ow * 2; g.strokeStyle = INKC; g.lineJoin = 'round'; g.stroke(); }
  g.beginPath(); shape(g); g.clip(); g.fillStyle = sh; g.fill(); g.save(); g.translate(LX * s, LY * s); g.beginPath(); shape(g); g.restore(); g.fillStyle = base; g.fill();
  if (h > 0) { g.beginPath(); shape(g); g.save(); g.translate(-LX * h, -LY * h); shape(g); g.restore(); g.globalAlpha = 0.85; g.fillStyle = hl; g.fill('evenodd'); g.globalAlpha = 1; }
  g.restore(); }
/* 아이콘(직접 그림) */
function icCookie(g, x, y, r) { cel(g, (s) => el(s, x, y, r, r * 0.86), '#e3a75e', '#a8662e', '#ffe2ad', { s: r * 0.3, h: r * 0.2, ow: 2 });
  g.fillStyle = '#4a2414'; for (const [dx, dy] of [[-0.35, -0.2], [0.25, -0.35], [0.1, 0.25], [-0.2, 0.35], [0.45, 0.15]]) { g.beginPath(); el(g, x + dx * r, y + dy * r, r * 0.13, r * 0.1); g.fill(); } }
function icApple(g, x, y, r) { cel(g, (s) => { s.moveTo(x, y - r * 0.6); s.bezierCurveTo(x + r * 1.1, y - r * 1.1, x + r * 1.2, y + r * 0.6, x, y + r); s.bezierCurveTo(x - r * 1.2, y + r * 0.6, x - r * 1.1, y - r * 1.1, x, y - r * 0.6); s.closePath(); }, '#ef4a3c', '#a82a33', '#ff9a8a', { s: r * 0.3, h: r * 0.22, ow: 2 });
  g.strokeStyle = INKC; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x, y - r * 0.55); g.lineTo(x + r * 0.1, y - r * 1.05); g.stroke();
  cel(g, (s) => el(s, x + r * 0.42, y - r * 0.92, r * 0.36, r * 0.17, -0.5), '#5fbf5a', '#3a8a4a', '#b7ec8a', { s: 2, h: 1, ow: 2 }); }
function icMilk(g, x, y, r) { cel(g, (s) => { s.moveTo(x - r * 0.6, y - r * 0.35); s.lineTo(x, y - r * 0.95); s.lineTo(x + r * 0.6, y - r * 0.35); s.lineTo(x + r * 0.6, y + r); s.lineTo(x - r * 0.6, y + r); s.closePath(); }, '#fffaf0', '#d6cfe8', '#ffffff', { s: r * 0.25, h: 0, ow: 2 });
  g.fillStyle = '#4f86e0'; g.fillRect(x - r * 0.6, y + r * 0.05, r * 1.2, r * 0.42); g.strokeStyle = INKC; g.lineWidth = 2; g.strokeRect(x - r * 0.6, y + r * 0.05, r * 1.2, r * 0.42); }
const ICON = { cookie: icCookie, apple: icApple, milk: icMilk };
function coin(g, x, y, r) { cel(g, (s) => circ(s, x, y, r), '#ffcf3f', '#d48a14', '#fff6b0', { s: r * 0.25, h: r * 0.18, ow: 3 }); g.strokeStyle = 'rgba(150,80,0,.6)'; g.lineWidth = 2.5; g.beginPath(); circ(g, x, y, r * 0.68); g.stroke(); txt(g, '분', x, y + r * 0.34, { size: r * 0.95, align: 'center', fill: '#b06a0c' }); }
function brass(g, x, y, r, icon) { g.fillStyle = 'rgba(30,18,10,.32)'; g.beginPath(); circ(g, x + 2, y + 5, r); g.fill();
  cel(g, (s) => circ(s, x, y, r), '#f2b84b', '#b77818', '#fff0b0', { s: 4, h: 3, ow: 3 });
  g.fillStyle = lin(g, 0, y - r, 0, y + r, [[0, '#ffe7a6'], [1, '#e9a63a']]); g.beginPath(); circ(g, x, y - 1, r - 8); g.fill();
  g.save(); g.translate(x, y); g.fillStyle = '#5a3214'; g.strokeStyle = '#5a3214'; g.lineWidth = 3;
  if (icon === 'music') { g.beginPath(); el(g, -6, 6, 4.5, 3.6, -0.4); el(g, 6, 3, 4.5, 3.6, -0.4); g.fill(); g.lineWidth = 2.6; g.beginPath(); g.moveTo(-2, 6); g.lineTo(-2, -8); g.lineTo(10, -11); g.lineTo(10, 3); g.stroke(); }
  if (icon === 'pause') { g.beginPath(); rr(g, -8, -9, 6, 18, 2); rr(g, 2, -9, 6, 18, 2); g.fill(); }
  g.restore(); }
const ORDERS = [{ icon: 'cookie', n: 2, d: 3, unit: '상자', left: 0.28, col: '#ff8a3d' }, { icon: 'apple', n: 3, d: 4, unit: '상자', left: 0.64, col: '#e2453b' }, { icon: 'milk', n: 1, d: 2, unit: '통', left: 0.9, col: '#4f86e0' }];
function fracText(g, n, d, x, y, size, color) { txt(g, String(n), x, y - size * 0.18, { size, align: 'center', fill: color, sw: 5, stroke: '#fffaf0' });
  g.fillStyle = color; g.beginPath(); rr(g, x - size * 0.42, y - size * 0.05, size * 0.84, size * 0.11, 3); g.fill(); txt(g, String(d), x, y + size * 0.82, { size, align: 'center', fill: color, sw: 5, stroke: '#fffaf0' }); }
function drawOrder(g, o, x, y, t, i) { const w = 150, h = 132; const wob = o.left < 0.35 ? Math.sin(t * 10) * 0.025 : 0;
  g.save(); g.translate(x + w / 2, y); g.rotate(wob); g.translate(-(x + w / 2), -y);
  g.fillStyle = 'rgba(30,18,10,.3)'; g.beginPath(); rr(g, x + 4, y + 8, w, h, 12); g.fill();
  g.beginPath(); rr(g, x, y, w, h, 12); g.lineWidth = 6; g.strokeStyle = INKC; g.stroke(); g.fillStyle = '#fffaf0'; g.fill();
  g.save(); g.beginPath(); rr(g, x, y, w, h, 12); g.clip(); g.fillStyle = o.col; g.fillRect(x, y, w, 44); g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(x, y, w, 10); g.restore();
  g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y + 44); g.lineTo(x + w, y + 44); g.stroke();
  ICON[o.icon](g, x + 28, y + 23, 15);
  txt(g, ['쿠키', '사과', '우유'][i], x + 52, y + 32, { size: 21, fill: '#fff', sw: 4, stroke: 'rgba(60,20,10,.55)' });
  fracText(g, o.n, o.d, x + 52, y + 84, 30, '#3b2516');
  txt(g, o.unit, x + 106, y + 92, { size: 22, align: 'center', fill: '#7a4a2a' });
  const k = Math.max(0, o.left - (t * 0.01) % 0.25); const bc = k > 0.6 ? '#5fbf5a' : k > 0.3 ? '#ffc23a' : '#e2453b';
  g.fillStyle = '#e8dcc8'; g.beginPath(); rr(g, x + 12, y + h - 18, w - 24, 9, 4.5); g.fill(); g.fillStyle = bc; g.beginPath(); rr(g, x + 12, y + h - 18, (w - 24) * k, 9, 4.5); g.fill();
  g.restore(); }
function flame(g, x, y, s, t) { for (let i = 0; i < 3; i++) { const k = 1 - i * 0.28, c = ['#ff5a2a', '#ff9a2a', '#ffe36a'][i], ph = t * 9 + i;
  g.fillStyle = c; g.beginPath(); g.moveTo(x - 30 * s * k, y + 16 * s); g.quadraticCurveTo(x - 46 * s * k, y - 30 * s * k, x - 10 * s * k + Math.sin(ph) * 4, y - (70 + Math.sin(ph * 1.3) * 8) * s * k);
  g.quadraticCurveTo(x + 6 * s * k, y - 34 * s * k, x + 20 * s * k + Math.sin(ph * 0.8) * 3, y - (52 + Math.cos(ph) * 6) * s * k); g.quadraticCurveTo(x + 40 * s * k, y - 6 * s * k, x + 30 * s * k, y + 16 * s); g.closePath(); g.fill(); } }
function bubble(g, x, y, o) { const w = 96, h = 70; g.save(); g.fillStyle = 'rgba(30,18,10,.25)'; g.beginPath(); rr(g, x - w / 2 + 3, y - h + 6, w, h - 14, 22); g.fill();
  g.beginPath(); rr(g, x - w / 2, y - h, w, h - 14, 22); g.moveTo(x - 10, y - 15); g.lineTo(x, y); g.lineTo(x + 10, y - 15);
  g.lineWidth = 6; g.strokeStyle = INKC; g.stroke(); g.fillStyle = '#fffaf0'; g.fill();
  g.beginPath(); rr(g, x - w / 2 + 3, y - h + 3, w - 6, h - 20, 19); g.fillStyle = '#fffaf0'; g.fill();
  ICON[o.icon](g, x - 22, y - h / 2 - 6, 15); fracText(g, o.n, o.d, x + 20, y - h / 2 - 10, 21, '#3b2516'); g.restore(); }
function drawHUD(t) { const g = hud; g.setTransform(HPR, 0, 0, HPR, 0, 0); g.clearRect(0, 0, W, H); g.lineJoin = 'round'; g.lineCap = 'round';
  /* 말풍선(3D 위치를 화면에 투영) */
  const projs = stations.map((s) => { const v = s.g.localToWorld(s.anchor.clone()).project(camera); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H }; });
  bubble(g, projs[0].x, projs[0].y + Math.sin(t * 3) * 3, ORDERS[0]); bubble(g, projs[1].x, projs[1].y + Math.sin(t * 3 + 1) * 3, ORDERS[1]);
  /* 주문표 (왼쪽 위) */
  g.strokeStyle = '#7a4a2a'; g.lineWidth = 5; g.beginPath(); g.moveTo(10, 14); g.lineTo(512, 14); g.stroke();
  ORDERS.forEach((o, i) => { const x = 16 + i * 164; g.strokeStyle = '#5d6470'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 75, 14); g.lineTo(x + 75, 24); g.stroke(); drawOrder(g, o, x, 22, t, i); });
  /* 무대 이름 띠 (가운데 위) */
  const bx = 1006, by = 18; g.save(); g.fillStyle = 'rgba(30,18,10,.3)'; g.beginPath(); rr(g, bx - 128, by + 6, 256, 46, 23); g.fill();
  g.beginPath(); rr(g, bx - 130, by, 260, 46, 23); g.lineWidth = 6; g.strokeStyle = INKC; g.stroke(); g.fillStyle = lin(g, 0, by, 0, by + 46, [[0, '#3c5ea6'], [1, '#22386e']]); g.fill(); g.restore();
  txt(g, '분수 철도 섬', bx, by + 33, { size: 26, align: 'center', fill: '#fff6e0', sw: 5, stroke: '#1a2850' });
  brass(g, 1196, 41, 24, 'music'); brass(g, 1250, 41, 23, 'pause');
  /* 동전 (왼쪽 아래) + 팁 불꽃 */
  g.save(); g.fillStyle = 'rgba(30,18,10,.32)'; g.beginPath(); rr(g, 64, 640, 210, 58, 14); g.fill(); g.restore();
  g.save(); g.beginPath(); rr(g, 60, 632, 210, 58, 14); g.lineWidth = 6; g.strokeStyle = INKC; g.stroke(); g.fillStyle = lin(g, 0, 632, 0, 690, [[0, '#4f86e0'], [1, '#2f5fb0']]); g.fill(); g.restore();
  flame(g, 58, 652, 1.0, t); coin(g, 58, 662, 42);
  txt(g, '120', 172, 674, { size: 40, align: 'center', fill: '#ffffff', sw: 6, stroke: '#1a2850' });
  g.save(); g.beginPath(); rr(g, 118, 690, 120, 24, 8); g.fillStyle = '#fffaf0'; g.fill(); g.lineWidth = 3; g.strokeStyle = INKC; g.stroke(); g.restore();
  txt(g, '팁 3배', 178, 709, { size: 19, align: 'center', fill: '#c0452a' });
  /* 시간 (오른쪽 아래) */
  g.save(); g.fillStyle = 'rgba(30,18,10,.32)'; g.beginPath(); rr(g, 1032, 640, 232, 66, 14); g.fill();
  g.beginPath(); rr(g, 1028, 632, 232, 66, 14); g.lineWidth = 6; g.strokeStyle = INKC; g.stroke(); g.fillStyle = lin(g, 0, 632, 0, 698, [[0, '#4f86e0'], [1, '#2f5fb0']]); g.fill(); g.restore();
  const secs = Math.max(0, 119 - Math.floor(t)); const mm = String(Math.floor(secs / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0');
  txt(g, `${mm}:${ss}`, 1118, 678, { size: 44, align: 'center', fill: '#ffffff', sw: 6, stroke: '#1a2850' });
  g.fillStyle = '#1a2850'; g.beginPath(); rr(g, 1044, 686, 150, 8, 4); g.fill(); g.fillStyle = '#ffd23f'; g.beginPath(); rr(g, 1044, 686, 150 * secs / 120, 8, 4); g.fill();
  /* 모래시계 */
  const hx = 1226, hy = 664, rot = Math.sin(t * 2) * 0.08; g.save(); g.translate(hx, hy); g.rotate(rot);
  cel(g, (s) => { s.moveTo(-18, -30); s.lineTo(18, -30); s.lineTo(4, 0); s.lineTo(18, 30); s.lineTo(-18, 30); s.lineTo(-4, 0); s.closePath(); }, '#e8f6ff', '#a9c6e0', '#ffffff', { s: 3, h: 2, ow: 3 });
  g.fillStyle = '#ffc23a'; g.beginPath(); g.moveTo(-10, -18); g.lineTo(10, -18); g.lineTo(2, -4); g.lineTo(-2, -4); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-14, 28); g.lineTo(14, 28); g.lineTo(0, 14); g.closePath(); g.fill();
  for (const yy of [-32, 32]) cel(g, (s) => rr(s, -22, yy - 4, 44, 8, 3), '#c77b45', '#8a4a24', '#f0b07a', { s: 2, h: 1, ow: 2.5 });
  g.restore(); }

/* ══════════════ 시작 ══════════════ */
let last = 0, T = 0;
function frame(now) { const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now; T += dt;
  placeCam(T); stepTrain(dt); stepPetals(dt, T); anim.forEach((f) => f(T));
  for (const c of clouds) { c.position.x += dt * 0.6; if (c.position.x > 24) c.position.x = -24; }
  if (LOW) { renderer.setRenderTarget(null); renderer.render(scene, camera); }
  else { renderer.setRenderTarget(rt); renderer.render(scene, camera); renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
  drawHUD(T); requestAnimationFrame(frame); }
(async function init() {
  try { await Promise.all([document.fonts.load('40px Bagel', '쿠키역사과역'), document.fonts.load('30px Jua', '분수 철도 섬')]); } catch (e) { /* 글꼴이 없어도 계속 */ }
  buildIsland(); buildTrack(); buildTrain(); buildStation(0.25, -1, '쿠키역', '#ff8a4c', '#fff3dc'); buildStation(0.75, 1, '사과역', '#e2453b', '#ffe9e4');
  scatter(); buildPetals(); buildPost(); placeCam(0);
  requestAnimationFrame(frame);
})();
