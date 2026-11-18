set -e
cd "$(dirname "$0")"
python3 -I build.py dev >/dev/null; python3 -I build.py >/dev/null
E=/home/user/hs7733/docs/그래픽_시안/src/embed_fonts.py
python3 $E --ksx src.html r1.html __SUNB__=/tmp/hs7733-fonts/Sunflower-Bold.ttf 2>&1 | tail -3
python3 $E r1.html "5학년 2학기 과학 열과 우리 생활(따끈 설계소).html" __PEN__=/tmp/hs7733-fonts/NanumPenScript-Regular.ttf@pen.txt __ORBIT__=/home/user/hs7733/docs/fonts/Orbit-Regular.ttf@sym.txt __DOHYEON__=/home/user/hs7733/docs/fonts/DoHyeon-Regular.ttf@sym.txt 2>&1 | tail -6
ls -la "5학년 2학기 과학 열과 우리 생활(따끈 설계소).html" | awk '{print $5}'
