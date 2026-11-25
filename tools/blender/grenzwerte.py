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
label('Äquivalenzklassen und Grenzwerte: Alter von 18 bis 99', (0, -0.05, 2.15), size=0.072, material=lm, align='CENTER')
x0, x1 = -2.0, 2.0
box('axis', (4.0, 0.03, 0.02), (0, 0, 1.2), ln)
segs = [(-2.0, -0.9, red, 'ungültig: unter 18'), (-0.9, 0.9, green, 'gültig: 18 bis 99'), (0.9, 2.0, red, 'ungültig: über 99')]
for a, b, m, t in segs:
    box('seg', (b - a - 0.04, 0.2, 0.3), ((a + b) / 2, 0, 1.45), m, bevel=0.01)
    label(t, ((a + b) / 2, -0.11, 1.42), size=0.04, material=wl, align='CENTER')
for v, x, m in [('17', -0.98, red), ('18', -0.82, green), ('99', 0.82, green), ('100', 0.98, red)]:
    cyl('dot', 0.035, 0.05, (x, -0.02, 1.2), m, rot=(1.5708, 0, 0), verts=24)
    label(v, (x, -0.05, 1.03), size=0.045, material=lm, align='CENTER')
label('Grenzwerte: je Grenze der letzte ungültige und der erste gültige Wert', (0, -0.05, 0.86), size=0.04, material=lm, align='CENTER')
label('Vertreter je Klasse, z. B. 10 · 40 · 120 – dazu Sonderfälle: leer, Text statt Zahl, 18,5', (0, -0.05, 0.72), size=0.04, material=lm, align='CENTER')
label('Viele Fehler entstehen genau an den Grenzen (z. B. > statt ≥).', (0, -0.05, 0.56), size=0.04, material=lm, align='CENTER')
camera_front((0, 0, 1.35), 4.4, tilt=1)
lights(0.55)
