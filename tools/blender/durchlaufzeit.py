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
label('Durchlaufzeit: Wo geht die Zeit verloren?', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
segs = [(20, blue, 'B'), (240, grey, 'Liegezeit 4 h'), (20, blue, 'B'), (240, grey, 'Liegezeit 4 h'), (20, blue, 'B'), (30, orange, 'T')]
x0, s = -1.9, 3.8 / 570
a = 0
for v, m, t in segs:
    box('s', (v * s - 0.006, 0.15, 0.3), (x0 + (a + v / 2) * s, 0, 1.45), m, bevel=0.004)
    label(t, (x0 + (a + v / 2) * s, -0.09, 1.43), size=0.058 if len(t) < 3 else 0.045, material=wl, align='CENTER')
    a += v
leader((x0, -0.02, 1.2), (x0 + 3.8, -0.02, 1.2), ln, r=0.004)
for t in (0, 120, 240, 360, 480, 570):
    label('%d min' % t, (x0 + t * s, -0.05, 1.07), size=0.058, material=lm, align='CENTER')
for k, (m, t) in enumerate([(blue, 'B = Bearbeitung: 3 × 20 min = 60 min (≈ 11 %)'), (grey, 'Liegezeit: 2 × 4 h = 480 min (≈ 84 %)'), (orange, 'T = Transport: 30 min (≈ 5 %)')]):
    box('l', (0.1, 0.05, 0.08), (-1.3, 0, 0.82 - k * 0.14), m)
    label(t, (-1.18, -0.05, 0.8 - k * 0.14), size=0.058, material=lm)
label('Durchlaufzeit = Bearbeitung + Liegezeit + Transport = 60 + 480 + 30 = 570 min = 9,5 h', (0, -0.05, 0.3), size=0.058, material=lm, align='CENTER')
label('Hebel: Liegezeiten und Übergaben verringern, Medienbrüche vermeiden – nicht nur schneller bearbeiten.', (0, -0.05, 0.16), size=0.058, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
