sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
floor = mat('floor', (0.86, 0.87, 0.89), rough=0.9)
wall = mat('wall', (0.45, 0.48, 0.52), rough=0.8)
apm = mat('ap', (0.97, 0.97, 0.97), rough=0.4)
ch = {1: ((0.15, 0.45, 0.9), (0.62, 0.75, 0.95)), 6: ((0.1, 0.6, 0.3), (0.62, 0.86, 0.68)), 11: ((0.9, 0.45, 0.1), (0.97, 0.78, 0.6))}
txt = {1: (0.03, 0.2, 0.55), 6: (0.02, 0.32, 0.12), 11: (0.55, 0.22, 0.02)}
FLAT = (0, 0, 0)
box('floor', (3.4, 2.2, 0.02), (0, 0, -0.02), floor)
for (x, y, w, d) in [(0, 1.1, 3.4, 0.03), (0, -1.1, 3.4, 0.03), (-1.7, 0, 0.03, 2.2), (1.7, 0, 0.03, 2.2), (0, 0, 3.4, 0.02)]:
    box('wall', (w, d, 0.04), (x, y, 0.02), wall)
R, S = 0.66, 1.08
grid = [[1, 6, 11], [11, 1, 6]]
for r, row in enumerate(grid):
    for c, k in enumerate(row):
        x, y = (c - 1) * S, (0.54 if r == 0 else -0.54)
        line_c, fill_c = ch[k]
        cyl('cell', R, 0.004, (x, y, 0.01 + 0.002 * (r * 3 + c)), mat(f'fill{k}', fill_c, rough=0.9), verts=64)
        lc = mat(f'line{k}', line_c, rough=0.5)
        n = 64
        for i in range(n):
            a1, a2 = 2 * math.pi * i / n, 2 * math.pi * (i + 1) / n
            leader((x + R * math.cos(a1), y + R * math.sin(a1), 0.06), (x + R * math.cos(a2), y + R * math.sin(a2), 0.06), lc, r=0.008)
        cyl('ap', 0.09, 0.04, (x, y, 0.08), apm, verts=32)
        cyl('led', 0.025, 0.01, (x, y, 0.105), lc, verts=16)
        label(f'AP {r * 3 + c + 1}', (x, y + 0.16, 0.1), size=0.075, material=lm, rot=FLAT, align='CENTER')
        label(f'Kanal {k}', (x, y - 0.24, 0.1), size=0.085, material=mat(f'txt{k}', txt[k], rough=1.0), rot=FLAT, align='CENTER')
label('2,4 GHz: üblich sind die überlappungsfreien Kanäle 1, 6 und 11 (in Europa mit 13 Kanälen teils auch 1, 5, 9, 13).', (0, -1.3, 0.1), size=0.062, material=lm, rot=FLAT, align='CENTER')
label('Benachbarte Zellen bekommen verschiedene Kanäle und überlappen leicht (ca. 15–20 %) für nahtloses Roaming.', (0, -1.42, 0.1), size=0.062, material=lm, rot=FLAT, align='CENTER')
camera((0, -0.16, 8), (0, -0.16, 0), ortho=4.35)
lights(0.55)
