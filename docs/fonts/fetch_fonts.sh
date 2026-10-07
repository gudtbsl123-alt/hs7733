#!/usr/bin/env bash
# 크기가 큰 글꼴은 저장소에 두지 않고, 쓸 때만 내려받는다. 모두 SIL Open Font License 1.1(Google Fonts 저장소).
# 사용: bash docs/fonts/fetch_fonts.sh <글꼴키> [저장폴더]
#   글꼴키(분위기는 docs/게임그래픽_가이드.md 7장):
#     gowunbatang · gowundodum · eastseadokdo · dongle · gamjaflower · himelody
#     yeonsung(레트로 간판) · blackandwhitepicture(옛 영화·잉크 만화) · kiranghaerang(장난꾸러기 만화)
#     gugi(블록·기하·레트로 기계) · dokdo(거친 붓) · nanumbrushscript(붓 손글씨) · nanumpenscript(펜 손글씨·칠판)
#     poorstory(그림책) · singleday(귀여운 장식) · cutefont(작고 귀여운) · stylish(단정·카페) · diphylleia(우아한 명조)
#     sunflower(깔끔한 고딕 굵게)
#   저장폴더 기본값: /tmp/hs7733-fonts (저장소 밖. 게임에는 embed_fonts.py로 쓰는 글자만 넣으니 원본은 커밋하지 않는다)
# 모두 한글 2,350자(KS X 1001)와 자모를 갖고 있어 이름 입력용 --ksx를 쓸 수 있다(diphylleia는 자모 1자 없음).
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
  yeonsung)     FILES="YeonSung-Regular.ttf" ;;
  blackandwhitepicture) FILES="BlackAndWhitePicture-Regular.ttf" ;;
  kiranghaerang) FILES="KirangHaerang-Regular.ttf" ;;
  gugi)         FILES="Gugi-Regular.ttf" ;;
  dokdo)        FILES="Dokdo-Regular.ttf" ;;
  nanumbrushscript) FILES="NanumBrushScript-Regular.ttf" ;;
  nanumpenscript)   FILES="NanumPenScript-Regular.ttf" ;;
  poorstory)    FILES="PoorStory-Regular.ttf" ;;
  singleday)    FILES="SingleDay-Regular.ttf" ;;
  cutefont)     FILES="CuteFont-Regular.ttf" ;;
  stylish)      FILES="Stylish-Regular.ttf" ;;
  diphylleia)   FILES="Diphylleia-Regular.ttf" ;;
  sunflower)    FILES="Sunflower-Bold.ttf Sunflower-Medium.ttf" ;;
  *) echo "글꼴키: gowunbatang | gowundodum | eastseadokdo | dongle | gamjaflower | himelody | yeonsung | blackandwhitepicture | kiranghaerang | gugi | dokdo | nanumbrushscript | nanumpenscript | poorstory | singleday | cutefont | stylish | diphylleia | sunflower"; exit 1 ;;
esac
mkdir -p "$DEST"
for f in $FILES OFL.txt; do
  out="$DEST/$f"; [ "$f" = "OFL.txt" ] && out="$DEST/OFL_$KEY.txt"
  curl -sSfL -m 120 -o "$out" "https://raw.githubusercontent.com/google/fonts/main/ofl/$KEY/$f"
  echo "받음: $out"
done
