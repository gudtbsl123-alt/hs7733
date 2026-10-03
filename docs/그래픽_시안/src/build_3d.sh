#!/usr/bin/env bash
# 3D 게임을 HTML 하나로 만든다: three.js(게임이 쓰는 부분만 묶어 압축) + 게임 코드(압축하지 않음) + 글꼴
# 사용: bash build_3d.sh <게임코드.js> <페이지.html> <결과.html> [작업폴더]
#   - 페이지.html: __THREE__, __GAME__ 자리표시자와 글꼴 자리표시자(__JUA__, __BAGEL__)를 가진 HTML
#   - 게임코드.js: import 없이 전역 THREE를 쓰는 코드(압축하지 않고 그대로 들어가 다음 세션이 바로 고칠 수 있다)
#   예) bash docs/그래픽_시안/src/build_3d.sh docs/그래픽_시안/src/분수철도섬_3D_main.js docs/그래픽_시안/src/분수철도섬_3D_page.html /tmp/분수철도섬.html
# 저장소 안에 node_modules·package.json을 만들지 않는다(작업폴더 기본값: /tmp/three-build).
set -e
[ $# -ge 3 ] || { echo "사용: bash build_3d.sh <게임코드.js> <페이지.html> <결과.html> [작업폴더]"; exit 1; }
abs(){ python3 -c 'import os,sys;print(os.path.abspath(sys.argv[1]))' "$1"; }
GAME="$(abs "$1")"; PAGE="$(abs "$2")"; OUT="$(abs "$3")"; WORK="$(abs "${4:-/tmp/three-build}")"
SRC="$(cd "$(dirname "$0")" && pwd)"; FONTS="$SRC/../../fonts"
mkdir -p "$WORK" && cd "$WORK"
[ -f package.json ] || npm init -y >/dev/null
INSTALLED=$(node -p "try{require('./node_modules/three/package.json').version}catch(e){''}")
# 0.162는 WebGL1 컴퓨터까지 되는 마지막 판(r163부터 WebGL1 지원 중단)
[ "$INSTALLED" = "0.162.0" ] || npm install three@0.162.0 esbuild@0.24.0 >/dev/null
# 게임 코드가 쓰는 THREE.이름만 모아 묶는다(나머지는 빠져서 파일이 작아진다)
NAMES=$(grep -o 'THREE\.[A-Za-z0-9_]*' "$GAME" | sed 's/THREE\.//' | sort -u | paste -sd, -)
echo "export { $NAMES } from 'three';" > three_entry.js
# --charset=utf8: 한글을 \uXXXX로 바꾸지 않는다
npx esbuild three_entry.js --bundle --minify --format=iife --global-name=THREE --charset=utf8 --target=es2019 --legal-comments=none --outfile=three.min.js
python3 - "$PAGE" three.min.js "$GAME" page_built.html <<'PY'
import sys
page, three, game, out = sys.argv[1:]
s = open(page, encoding='utf-8').read()
for key, path in (('__THREE__', three), ('__GAME__', game)):
    body = open(path, encoding='utf-8').read()
    assert key in s, key + ' 자리표시자가 페이지에 없음'
    assert '</script' not in body.lower(), path + ' 안에 </script 글자가 있어 HTML이 깨짐'
    s = s.replace(key, body)
open(out, 'w', encoding='utf-8').write(s)
PY
python3 "$SRC/embed_fonts.py" page_built.html "$OUT" __BAGEL__="$FONTS/BagelFatOne-Regular.ttf" __JUA__="$FONTS/Jua-Regular.ttf"
