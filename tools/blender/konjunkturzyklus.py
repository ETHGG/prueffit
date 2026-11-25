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
label('Konjunkturzyklus', (0, -0.05, 2.12), size=0.08, material=lm, align='CENTER')
pts = []
for k in range(81):
    x = -1.9 + k * 3.8 / 80
    pts.append((x, -0.02, 1.15 + 0.45 * _m.sin((x + 1.9) / 3.8 * 2 * _m.pi - _m.pi / 2) + 0.12 * (x + 1.9) / 3.8))
for a, b in zip(pts, pts[1:]):
    leader(a, b, blue, r=0.014)
leader((-1.95, -0.02, 0.55), (1.95, -0.02, 0.55), ln, r=0.005)
leader((-1.95, -0.02, 0.55), (-1.95, -0.02, 1.85), ln, r=0.005)
label('Zeit', (1.85, -0.05, 0.42), size=0.045, material=lm)
label('Wirtschaftsleistung', (-1.9, -0.05, 1.9), size=0.045, material=lm)
leader((-1.9, -0.02, 0.85), (1.9, -0.02, 1.18), ln, r=0.003)
label('Trend', (1.6, -0.05, 1.25), size=0.04, material=lm)
ph = [(-1.9, 'Tiefstand', 'hohe Arbeitslosigkeit'), (-0.95, 'Aufschwung', 'Aufträge und Investitionen steigen'),
      (0.0, 'Boom', 'volle Auslastung, Preise steigen'), (0.95, 'Abschwung', 'Nachfrage und Investitionen sinken')]
for x, t, d in ph:
    z = 1.15 + 0.45 * _m.sin((x + 1.9) / 3.8 * 2 * _m.pi - _m.pi / 2) + 0.12 * (x + 1.9) / 3.8
    cyl('pt', 0.035, 0.03, (x, -0.04, z), orange, rot=(_m.radians(90), 0, 0))
    up = z < 1.15
    label(t, (x + (0.12 if x < -1.5 else 0), -0.05, z + (-0.2 if up else 0.24)), size=0.055, material=lm, align='CENTER')
    label(d, (x + (0.25 if x < -1.5 else 0), -0.05, z + (-0.3 if up else 0.13)), size=0.038, material=lm, align='CENTER')
label('Der Staat kann antizyklisch gegensteuern: im Abschwung mehr ausgeben und investieren, im Boom sparen und Schulden abbauen.', (0, -0.05, 0.22), size=0.045, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
