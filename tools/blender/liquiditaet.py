sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
blue = mat('blue', (0.1, 0.32, 0.65), rough=0.5)
orange = mat('orange', (0.68, 0.3, 0.02), rough=0.5)
green = mat('green', (0.04, 0.4, 0.18), rough=0.5)
grey = mat('grey', (0.28, 0.32, 0.36), rough=0.6)
red = mat('red', (0.75, 0.15, 0.12), rough=0.5)
ln = mat('ln', (0.15, 0.2, 0.22), rough=0.9)
def card(x, z, w, h, m, lines, sizes=(0.062, 0.05)):
    box('c', (w, 0.2, h), (x, 0, z), m, bevel=0.015)
    n = len(lines)
    for i, t in enumerate(lines):
        s = sizes[0] if i == 0 else sizes[1]
        dz = (n - 1) * 0.06 - i * 0.12
        label(t, (x, -0.11, z + dz - s / 3), size=s, material=wl, align='CENTER')
label('Liquiditätsgrade: Reicht das Geld für die kurzfristigen Schulden?', (0, -0.05, 2.15), size=0.072, material=lm, align='CENTER')
x0, z0, s = -1.5, 0.5, 0.0075
segs = [('flüssige Mittel 30', 30, blue), ('Forderungen 90', 90, green), ('Vorräte 60', 60, orange)]
bars = [('1. Grades', 1, '30 %', '≈ 20 % üblich'), ('2. Grades', 2, '120 %', 'mind. 100 %'), ('3. Grades', 3, '180 %', '120–200 %')]
for i, (n, k, pct, rule) in enumerate(bars):
    x = x0 + i * 0.75
    b = 0
    for t, v, m in segs[:k]:
        box('s', (0.45, 0.15, v * s - 0.008), (x, 0, z0 + (b + v / 2) * s), m, bevel=0.005)
        b += v
    label('Liquidität ' + n, (x, -0.05, z0 - 0.1), size=0.058, material=lm, align='CENTER')
    label(pct, (x, -0.05, z0 + b * s + 0.06), size=0.058, material=lm, align='CENTER')
    label(rule, (x, -0.05, z0 - 0.19), size=0.058, material=lm, align='CENTER')
xv = x0 + 3 * 0.75
box('v', (0.45, 0.15, 100 * s), (xv, 0, z0 + 50 * s), red, bevel=0.005)
label('kurzfristige', (xv, -0.05, z0 - 0.1), size=0.058, material=lm, align='CENTER')
label('Verbindlichkeiten 100', (xv, -0.05, z0 - 0.19), size=0.058, material=lm, align='CENTER')
leader((x0 - 0.3, -0.03, z0 + 100 * s), (xv + 0.3, -0.03, z0 + 100 * s), red, r=0.004)
label('100 %', (xv + 0.35, -0.05, z0 + 100 * s - 0.02), size=0.058, material=red)
for j, (t, v, m) in enumerate(segs):
    box('l', (0.08, 0.05, 0.08), (1.35, 0, 1.77 - j * 0.15), m)
    label(t, (1.45, -0.05, 1.75 - j * 0.15), size=0.058, material=lm)
label('Tsd. €', (1.35, -0.05, 1.9), size=0.058, material=lm)
label('Liquidität = Zähler ÷ kurzfristige Verbindlichkeiten × 100 – Grad 1: flüssige Mittel, Grad 2: + Forderungen, Grad 3: gesamtes Umlaufvermögen', (0, -0.05, 0.1), size=0.058, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
