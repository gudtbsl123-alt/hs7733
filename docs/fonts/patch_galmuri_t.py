"""Galmuri11 Bold의 '통·퉁·툼·특·틀'은 ㅌ의 윗획과 가운데 획이 붙어 24px에서 '동·둥·둠·득·들'로 읽힌다.
ㅌ을 위로 한 칸 늘려 '획 · 틈 · 획 · 틈 · 획' 다섯 줄로 다시 그린 사본을 만든다(OFL, 예약 이름 없음).
사용: python3 -I patch_galmuri_t.py <원본 ttf> <출력 ttf>   (골목 민원 해결단 build.sh가 부른다)"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen

src, out = sys.argv[1], sys.argv[2]
f = TTFont(src); cm = f.getBestCmap(); gs = f.getGlyphSet(); U = 100   # 1200 upm, 12px 격자 → 점 하나 100

def grid(name):
    p = RecordingPen(); gs[name].draw(p); cs, cur = [], []
    for op, a in p.value:
        if op == 'moveTo': cur = [a[0]]
        elif op == 'lineTo': cur.append(a[0])
        elif op in ('closePath', 'endPath'): cs.append(cur); cur = []
    def inside(x, y):
        c = 0
        for poly in cs:
            for i in range(len(poly)):
                (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % len(poly)]
                if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1): c += 1
        return c % 2
    return {r: [inside(c * U + 50, r * U + 50) for c in range(14)] for r in range(-3, 12)}

T5 = ['.#########..', '.##.........', '.########...', '.##.........', '.#########..']   # 11~7행
for ch in '통퉁툼특틀':
    name = cm[ord(ch)]; g = grid(name)
    if [''.join('#' if v else '.' for v in g[r][:12]) for r in (10, 9)] != ['.#########..', '.########...']: continue   # 예상한 모양이 아니면 건드리지 않는다
    for i, r in enumerate(range(11, 6, -1)): g[r] = [c == '#' for c in T5[i]] + [False, False]
    # 점 덩어리의 바깥 테두리를 이어 겹침 없는 윤곽선으로 만든다(줄마다 사각형을 따로 넣으면 경계에 회색 줄이 생김)
    on = lambda c, r: r in g and 0 <= c < len(g[r]) and g[r][c]
    edges = {}
    for r in g:
        for c in range(len(g[r])):
            if not g[r][c]: continue
            if not on(c - 1, r): edges.setdefault((c, r), []).append((c, r + 1))
            if not on(c, r + 1): edges.setdefault((c, r + 1), []).append((c + 1, r + 1))
            if not on(c + 1, r): edges.setdefault((c + 1, r + 1), []).append((c + 1, r))
            if not on(c, r - 1): edges.setdefault((c + 1, r), []).append((c, r))
    pen = TTGlyphPen(None)
    while edges:
        start = next(iter(edges)); loop = [start]; cur = start
        while True:
            nxt = edges[cur].pop()
            if not edges[cur]: del edges[cur]
            if nxt == start: break
            loop.append(nxt); cur = nxt
        pts = [p for i, p in enumerate(loop) if not ((loop[i - 1][0] == p[0] == loop[(i + 1) % len(loop)][0]) or (loop[i - 1][1] == p[1] == loop[(i + 1) % len(loop)][1]))]   # 한 줄 위의 가운데 점은 뺀다
        pen.moveTo((pts[0][0] * U, pts[0][1] * U))
        for x, y in pts[1:]: pen.lineTo((x * U, y * U))
        pen.closePath()
    f['glyf'][name] = pen.glyph()
    print('patched', ch)
f.save(out)
