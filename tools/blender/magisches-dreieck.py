sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
blue = mat('blue', (0.1, 0.32, 0.65), rough=0.5)
orange = mat('orange', (0.68, 0.3, 0.02), rough=0.5)
green = mat('green', (0.04, 0.4, 0.18), rough=0.5)
grey = mat('grey', (0.28, 0.32, 0.36), rough=0.6)
red = mat('red', (0.75, 0.15, 0.12), rough=0.5)
ln = mat('ln', (0.15, 0.2, 0.22), rough=0.9)
def card(x, z, w, h, m, lines, sizes=(0.06, 0.042)):
    box('c', (w, 0.2, h), (x, 0, z), m, bevel=0.015)
    n = len(lines)
    for i, t in enumerate(lines):
        s = sizes[0] if i == 0 else sizes[1]
        dz = (n - 1) * 0.06 - i * 0.12
        label(t, (x, -0.11, z + dz - s / 3), size=s, material=wl, align='CENTER')
import math as _m
label('Magisches Dreieck des Projektmanagements', (0, -0.05, 2.15), size=0.078, material=lm, align='CENTER')
A, B, C = (0, -0.03, 1.8), (-1.1, -0.03, 0.55), (1.1, -0.03, 0.55)
for p, q in ((A, B), (B, C), (C, A)):
    leader(p, q, blue, r=0.014)
for (x, y, z), t, d, m in [(A, 'Qualität / Leistung', 'Was wird geliefert?', green), (B, 'Zeit', 'Bis wann?', orange), (C, 'Kosten', 'Was darf es kosten?', red)]:
    cyl('n', 0.1, 0.05, (x, y, z), m, rot=(_m.radians(90), 0, 0))
    if z > 1:
        label(t, (x + 0.16, -0.05, z + 0.02), size=0.06, material=lm, align='LEFT')
        label(d, (x + 0.16, -0.05, z - 0.08), size=0.042, material=lm, align='LEFT')
    else:
        label(t, (x, -0.05, z - 0.22), size=0.06, material=lm, align='CENTER')
        label(d, (x, -0.05, z - 0.32), size=0.042, material=lm, align='CENTER')
label('Ändert sich eine Ecke,', (0, -0.05, 1.05), size=0.05, material=lm, align='CENTER')
label('müssen die anderen nachgeben', (0, -0.05, 0.95), size=0.05, material=lm, align='CENTER')
label('Beispiel: Budget wird gekürzt, Qualität soll bleiben → mehr Zeit oder weniger Leistungsumfang einplanen.', (0, -0.05, 0.12), size=0.045, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
