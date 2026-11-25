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
label('Schutzklassen elektrischer Geräte', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
xs = [-1.4, 0, 1.4]
# I: housing with earth conductor
box('g1', (0.8, 0.3, 0.55), (xs[0], 0, 1.35), grey, bevel=0.02)
leader((xs[0] + 0.4, -0.05, 1.2), (xs[0] + 0.62, -0.05, 0.95), green, r=0.012)
leader((xs[0] + 0.4, -0.06, 1.2), (xs[0] + 0.62, -0.06, 0.95), orange, r=0.006)
label('Schutzleiter (grün-gelb) am Gehäuse', (xs[0], -0.05, 0.85), size=0.04, material=lm, align='CENTER')
# II: double insulation (two nested frames)
box('g2o', (0.8, 0.3, 0.55), (xs[1], 0, 1.35), blue, bevel=0.02)
box('g2i', (0.56, 0.32, 0.33), (xs[1], 0, 1.35), wl, bevel=0.01)
box('g2c', (0.4, 0.34, 0.18), (xs[1], 0, 1.35), blue, bevel=0.01)
label('doppelte oder verstärkte Isolierung', (xs[1], -0.05, 0.85), size=0.04, material=lm, align='CENTER')
# III: low voltage
box('g3', (0.6, 0.3, 0.4), (xs[2], 0, 1.35), green, bevel=0.02)
label('≤ 50 V AC / 120 V DC', (xs[2], -0.2, 1.33), size=0.036, material=wl, align='CENTER')
label('Schutzkleinspannung (SELV)', (xs[2], -0.05, 0.85), size=0.04, material=lm, align='CENTER')
for x, t, ex in zip(xs, ['Schutzklasse I', 'Schutzklasse II', 'Schutzklasse III'], ['z. B. Server, PC mit Metallgehäuse', 'z. B. Steckernetzteil, Notebook-Netzteil', 'z. B. 12-V-Gerät am Sicherheitstrafo']):
    label(t, (x, -0.05, 1.75), size=0.06, material=lm, align='CENTER')
    label(ex, (x, -0.05, 0.72), size=0.038, material=lm, align='CENTER')
label('Klasse II hat keinen Schutzleiter – der Schutz liegt in der Isolierung. Bei Klasse III ist die Spannung so niedrig, dass Berühren in der Regel ungefährlich ist.', (0, -0.05, 0.3), size=0.042, material=lm, align='CENTER')
label('Dazu: RCD (30 mA) schaltet ab, wenn Fehlerstrom z. B. durch einen Menschen fließt.', (0, -0.05, 0.15), size=0.042, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
