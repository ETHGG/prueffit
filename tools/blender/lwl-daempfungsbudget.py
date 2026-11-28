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
label('Glasfaser: Dämpfungsbudget prüfen', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
card(-1.85, 1.75, 0.5, 0.34, blue, ['Switch A'], sizes=(0.055, 0.05))
card(1.85, 1.75, 0.5, 0.34, blue, ['Switch B'], sizes=(0.055, 0.05))
box('f', (3.2, 0.03, 0.03), (0, 0, 1.75), orange)
for x, t in [(-1.5, 'Stecker'), (1.5, 'Stecker')]:
    box('st', (0.1, 0.1, 0.12), (x, -0.02, 1.75), grey, bevel=0.01)
    label(t, (x, -0.05, 1.53), size=0.05, material=lm, align='CENTER')
for x in [-1.15, -0.4, 0.4, 1.15]:
    box('sp', (0.06, 0.06, 0.06), (x, -0.02, 1.75), red)
label('4 Spleiße', (0, -0.05, 1.53), size=0.05, material=red, align='CENTER')
label('10 km Singlemode-Faser (1310 nm)', (0, -0.05, 1.86), size=0.055, material=lm, align='CENTER')
U = 0.42
x0 = -1.6
segs = [(4.0, orange, 'Faser 4,0'), (1.0, grey, 'Stecker 1,0'), (0.4, red, ''), (2.6, green, 'Reserve 2,6')]
x = x0
for v, m, t in segs:
    box('b', (v * U, 0.1, 0.24), (x + v * U / 2, 0, 1.12), m)
    if t:
        label(t, (x + v * U / 2, -0.07, 1.1), size=0.05, material=wl, align='CENTER')
    x += v * U
label('Spleiße 0,4', (x0 + 5.2 * U, -0.05, 0.9), size=0.05, material=red, align='CENTER')
leader((x0, -0.02, 1.3), (x0, -0.02, 1.38), ln, r=0.005)
leader((x0 + 8 * U, -0.02, 1.3), (x0 + 8 * U, -0.02, 1.38), ln, r=0.005)
leader((x0, -0.02, 1.34), (x0 + 8 * U, -0.02, 1.34), ln, r=0.005)
label('Budget des Transceivers 8,0 dB', (x0 + 4 * U, -0.05, 1.4), size=0.05, material=lm, align='CENTER')
t = ['Budget = Sendeleistung − Empfindlichkeit:  −3 dBm − (−11 dBm) = 8,0 dB',
     'Faser 10 km × 0,4 dB/km = 4,0 dB · Stecker 2 × 0,5 dB = 1,0 dB · Spleiße 4 × 0,1 dB = 0,4 dB',
     'Verluste 5,4 dB ≤ 8,0 dB → Verbindung geht, 2,6 dB Reserve für Alterung und Reparaturen',
     'Werte sind Planungsbeispiele – maßgeblich sind Datenblatt und Messung (Dämpfungsmessung, OTDR).']
for i, s in enumerate(t):
    label(s, (0, -0.05, 0.62 - i * 0.14), size=0.052, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.5, tilt=1)
lights(0.55)
