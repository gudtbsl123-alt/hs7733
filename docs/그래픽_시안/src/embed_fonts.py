"""게임 HTML에 쓰인 글자만 골라 글꼴을 줄이고(woff2) base64로 넣는다. 인터넷 없이 게임 글꼴을 쓰기 위한 도구.

사용:
  python3 embed_fonts.py 원본.html 결과.html __JUA__=docs/fonts/Jua-Regular.ttf __BAGEL__=docs/fonts/BagelFatOne-Regular.ttf@제목글자.txt
  python3 embed_fonts.py --ksx 원본.html 결과.html __JUA__=docs/fonts/Jua-Regular.ttf      (학생이 이름을 입력하거나, 실행 중 글자를 조합하는 게임)

- 원본 HTML의 @font-face 주소 자리에 __JUA__ 같은 자리표시자를 적어 둔다:
    @font-face{font-family:"Jua";src:url(data:font/woff2;base64,__JUA__) format("woff2")}
- 기본: 파일 전체(블록 주석·base64 덩어리 제외)에 나오는 글자 + 문자열 안 \\uXXXX 글자 + 숫자·영문·기본 기호를 넣는다.
- 글꼴파일@글자파일.txt 로 적으면 그 글꼴에는 글자 파일의 글자(+ 숫자·영문·기본 기호)만 넣는다.
  제목 글꼴처럼 몇 글자만 쓰는 글꼴을 작게 만들 때 쓴다.
- --ksx: 한글 2,350자(KS X 1001)와 한글 자모를 모두 넣는다. 입력·조합 글자가 있으면 꼭 쓴다(Jua 기준 woff2 약 330KB).
- 글꼴에 없는 글자는 경고로 알려 준다(예: Jua에는 · × ÷ ① ← 가 없다). 그런 글자는 직접 그리거나 다른 글꼴로 넣는다.
- 필요하면: pip install fonttools brotli --break-system-packages
- 글꼴은 SIL Open Font License 1.1. 결과 HTML에 라이선스 주석을 남긴다.
"""
import base64, io, re, sys
from fontTools import subset
from fontTools.ttLib import TTFont

args = sys.argv[1:]
KSX = '--ksx' in args
args = [a for a in args if a != '--ksx']
src_path, out_path, *pairs = args
html = open(src_path, encoding='utf-8').read()

# 글자 모으기: base64 덩어리와 블록 주석(/* */, <!-- -->)을 빼고 파일 전체에서
scan = re.sub(r'[A-Za-z0-9+/=]{300,}', '', html)
scan = re.sub(r'/\*.*?\*/', '', scan, flags=re.S)
scan = re.sub(r'<!--.*?-->', '', scan, flags=re.S)
chars = set(c for c in scan if ord(c) > 127)
chars |= set(chr(int(h, 16)) for h in re.findall(r'\\u([0-9a-fA-F]{4})', scan))
BASIC = set(' 0123456789+-=/:.,!?%()[]~\'"') | set('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
if KSX:
    for b1 in range(0xB0, 0xC9):
        for b2 in range(0xA1, 0xFF):
            chars.add(bytes([b1, b2]).decode('euc-kr'))
    chars |= set(chr(c) for c in range(0x3131, 0x3164))   # ㄱ~ㅣ 한글 자모
all_text = ''.join(sorted(c for c in (chars | BASIC) if ord(c) >= 32 and not 0xFE00 <= ord(c) <= 0xFE0F))

for pair in pairs:
    key, spec = pair.split('=', 1)
    if '@' in spec:
        font_path, text_path = spec.split('@', 1)
        text = ''.join(sorted(set(open(text_path, encoding='utf-8').read().replace('\n', '')) | BASIC))
    else:
        font_path, text = spec, all_text
    font = TTFont(font_path)
    cmap = font.getBestCmap()
    missing = [c for c in text if ord(c) > 127 and ord(c) not in cmap]
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    opts.name_IDs = ['*']
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    buf = io.BytesIO()
    font.flavor = 'woff2'
    font.save(buf)
    if key not in html:
        print(f'경고: {key} 자리표시자가 HTML에 없음')
    html = html.replace(key, base64.b64encode(buf.getvalue()).decode())
    hangul = sum(1 for c in text if '가' <= c <= '힣')
    print(f'{key}: 한글 {hangul}자 -> woff2 {len(buf.getvalue()) // 1024} KB (파일 안에서는 base64라 약 1.33배)')
    if missing:
        print(f'  ⚠ 이 글꼴에 없는 글자 {len(missing)}개: {"".join(missing[:40])}  → 직접 그리거나 다른 글꼴로')

open(out_path, 'w', encoding='utf-8').write(html)
print('저장:', out_path, len(html) // 1024, 'KB')
