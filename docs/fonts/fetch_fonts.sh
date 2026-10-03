#!/usr/bin/env bash
# 크기가 큰 글꼴은 저장소에 두지 않고, 쓸 때만 내려받는다. 모두 SIL Open Font License 1.1(Google Fonts 저장소).
# 사용: bash docs/fonts/fetch_fonts.sh <글꼴키> [저장폴더]
#   글꼴키: gowunbatang · gowundodum · eastseadokdo · dongle · gamjaflower · himelody
#   저장폴더 기본값: /tmp/hs7733-fonts (저장소 밖. 게임에는 embed_fonts.py로 쓰는 글자만 넣으니 원본은 커밋하지 않는다)
# 내려받기가 막히면 docs/fonts 안의 8종(Jua, Bagel Fat One, Black Han Sans, Do Hyeon, Galmuri11, Song Myung, Gaegu, Orbit)에서 고른다.
set -e
KEY="$1"; DEST="${2:-/tmp/hs7733-fonts}"
case "$KEY" in
  gowunbatang)  FILES="GowunBatang-Regular.ttf GowunBatang-Bold.ttf" ;;
  gowundodum)   FILES="GowunDodum-Regular.ttf" ;;
  eastseadokdo) FILES="EastSeaDokdo-Regular.ttf" ;;
  dongle)       FILES="Dongle-Regular.ttf Dongle-Bold.ttf" ;;
  gamjaflower)  FILES="GamjaFlower-Regular.ttf" ;;
  himelody)     FILES="HiMelody-Regular.ttf" ;;
  *) echo "글꼴키: gowunbatang | gowundodum | eastseadokdo | dongle | gamjaflower | himelody"; exit 1 ;;
esac
mkdir -p "$DEST"
for f in $FILES OFL.txt; do
  out="$DEST/$f"; [ "$f" = "OFL.txt" ] && out="$DEST/OFL_$KEY.txt"
  curl -sSfL -m 120 -o "$out" "https://raw.githubusercontent.com/google/fonts/main/ofl/$KEY/$f"
  echo "받음: $out"
done
