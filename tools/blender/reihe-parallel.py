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
label('Reihenschaltung und Parallelschaltung', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
def res(x, z, t, horizontal=True):
    box('r', (0.36, 0.1, 0.14) if horizontal else (0.14, 0.1, 0.36), (x, 0, z), orange, bevel=0.01)
    label(t, (x, -0.06, z - 0.02) if horizontal else (x + 0.12, -0.06, z - 0.02), size=0.04, material=lm if not horizontal else wl, align='CENTER' if horizontal else 'LEFT')
# series (left)
cx = -1.05
label('Reihe', (cx, -0.05, 1.85), size=0.06, material=lm, align='CENTER')
leader((cx - 0.85, -0.02, 1.45), (cx + 0.85, -0.02, 1.45), ln, r=0.008)
for k, t in enumerate(['100 Ω', '100 Ω', '50 Ω']):
    res(cx - 0.55 + k * 0.55, 1.45, t)
label('R = R1 + R2 + R3 = 250 Ω', (cx, -0.05, 1.12), size=0.045, material=lm, align='CENTER')
label('Strom überall gleich,', (cx, -0.05, 0.98), size=0.04, material=lm, align='CENTER')
label('Spannungen addieren sich', (cx, -0.05, 0.9), size=0.04, material=lm, align='CENTER')
# parallel (right)
cx = 1.05
label('Parallel', (cx, -0.05, 1.85), size=0.06, material=lm, align='CENTER')
leader((cx - 0.75, -0.02, 1.7), (cx + 0.6, -0.02, 1.7), ln, r=0.008)
leader((cx - 0.75, -0.02, 1.2), (cx + 0.6, -0.02, 1.2), ln, r=0.008)
for k, t in enumerate(['100 Ω', '100 Ω', '50 Ω']):
    xr = cx - 0.5 + k * 0.5
    leader((xr, -0.02, 1.2), (xr, -0.02, 1.7), ln, r=0.008)
    res(xr, 1.45, t, horizontal=False)
label('1/R = 1/100 + 1/100 + 1/50 = 0,04 → R = 25 Ω', (cx, -0.05, 1.0), size=0.042, material=lm, align='CENTER')
label('Spannung überall gleich,', (cx, -0.05, 0.88), size=0.04, material=lm, align='CENTER')
label('Ströme addieren sich', (cx, -0.05, 0.8), size=0.04, material=lm, align='CENTER')
label('Parallel ist der Gesamtwiderstand immer kleiner als der kleinste Einzelwiderstand.', (0, -0.05, 0.45), size=0.043, material=lm, align='CENTER')
label('Ohmsches Gesetz: U = R × I · Leistung: P = U × I', (0, -0.05, 0.3), size=0.043, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
