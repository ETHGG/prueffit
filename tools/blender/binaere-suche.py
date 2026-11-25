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
label('Binäre Suche nach 37 in einer sortierten Liste (16 Einträge)', (0, -0.05, 2.15), size=0.072, material=lm, align='CENTER')
vals = [3, 8, 12, 15, 19, 22, 26, 30, 33, 37, 41, 44, 50, 57, 61, 70]
steps = [(0, 15, 7, '1. Mitte: 30 < 37 → rechts weiter'), (8, 15, 11, '2. Mitte: 44 > 37 → links weiter'),
         (8, 10, 9, '3. Mitte: 37 gefunden!')]
for s, (lo, hi, mid, txt) in enumerate(steps):
    z = 1.65 - s * 0.45
    for i, v in enumerate(vals):
        x = -1.85 + i * 0.205
        m = green if (i == mid and s == 2) else (orange if i == mid else (blue if lo <= i <= hi else grey))
        box('c', (0.18, 0.12, 0.2), (x, 0, z), m, bevel=0.01)
        label(str(v), (x, -0.07, z - 0.025), size=0.05, material=wl, align='CENTER')
    label(txt, (1.55, -0.05, z - 0.18), size=0.042, material=lm, align='CENTER')
label('Jeder Schritt halbiert den Suchbereich: höchstens log2(n + 1) Vergleiche (aufgerundet) – bei 1.000 Einträgen etwa 10, linear im ungünstigsten Fall 1.000.', (0, -0.05, 0.3), size=0.044, material=lm, align='CENTER')
label('Voraussetzung: Die Liste ist sortiert. Blau = noch möglicher Bereich, orange = verglichene Mitte, grau = ausgeschlossen.', (0, -0.05, 0.17), size=0.044, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
