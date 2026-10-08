// 게시판에 올릴 사진을 올리는 순서대로 번호를 붙여 한 폴더에 모은다.
// 선생님은 1번부터 차례로 게시글 맨 위에 올리기만 하면 된다.
// 사용법: node make_upload_set.js <release/게임이름> <사진1> <사진2> ...
//   사진은 release 폴더 안의 경로(예: screenshots/01_시작화면_이름쓰기.png)를 올리는 순서대로 적는다.
//   결과: <release/게임이름>/게시판_사진/1번_시작화면_이름쓰기.png, 2번_… (예전 파일은 지우고 새로 만든다)
// 원본 screenshots/ 파일은 그대로 둔다(capture.js·tv_guide.json이 그 이름을 쓴다).

const path = require('path');
const fs = require('fs');

const [relDir, ...shots] = process.argv.slice(2);
if (!relDir || !shots.length) { console.error('사용법: node make_upload_set.js <release/게임이름> <사진1> <사진2> ...'); process.exit(1); }
if (shots.length > 9) { console.error('사진은 9장까지만 넣어요(10번부터는 파일 정렬 순서가 꼬여요).'); process.exit(1); }

const outDir = path.join(relDir, '게시판_사진'.normalize('NFC'));
const srcs = shots.map(s => path.resolve(relDir, s));
const missing = srcs.filter(s => !fs.existsSync(s));
if (missing.length) { console.error('없는 파일:\n' + missing.join('\n')); process.exit(1); }

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
srcs.forEach((src, i) => {
  const label = path.basename(src).normalize('NFC').replace(/^\d+_/, '');   /* 01_ 같은 찍은 순서 번호는 떼고 장면 이름만 남긴다 */
  const name = `${i + 1}번_${label}`.normalize('NFC');
  fs.copyFileSync(src, path.join(outDir, name));
  console.log(name);
});
console.log(`저장: ${outDir} (${srcs.length}장)`);
