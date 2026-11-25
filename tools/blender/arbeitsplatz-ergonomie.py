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
wood = mat('wood', (0.55, 0.42, 0.3), rough=0.6)
dark = mat('dark', (0.06, 0.07, 0.08), rough=0.4)
glass = mat('glass', (0.55, 0.75, 0.95), rough=0.2)
scr = mat('scr', (0.2, 0.45, 0.75), emit=0.6)
label('Ergonomischer Bildschirmarbeitsplatz', (0, -1.2, 2.25), size=0.085, material=lm, align='CENTER')
box('window', (0.06, 1.2, 1.1), (-2.0, 0.6, 1.3), glass)
label('Fenster seitlich,', (-2.0, -0.2, 0.62), size=0.045, material=lm, align='CENTER')
label('nicht vor oder hinter', (-2.0, -0.2, 0.53), size=0.045, material=lm, align='CENTER')
label('dem Bildschirm', (-2.0, -0.2, 0.44), size=0.045, material=lm, align='CENTER')
box('desk', (1.6, 0.8, 0.04), (0, 0.4, 0.72), wood, bevel=0.01)
for x in (-0.75, 0.75):
    for y in (0.05, 0.75):
        box('leg', (0.04, 0.04, 0.72), (x, y, 0.36), grey)
box('mon', (0.7, 0.03, 0.42), (0, 0.65, 1.2), dark, bevel=0.01)
box('scr', (0.66, 0.005, 0.38), (0, 0.633, 1.2), scr)
box('stand', (0.06, 0.06, 0.25), (0, 0.68, 0.86), dark)
box('kb', (0.45, 0.15, 0.02), (0, 0.18, 0.75), dark, bevel=0.005)
box('mouse', (0.06, 0.1, 0.02), (0.35, 0.18, 0.75), dark, bevel=0.01)
box('seat', (0.5, 0.45, 0.07), (0, -0.45, 0.48), blue, bevel=0.02)
box('back', (0.48, 0.06, 0.55), (0, -0.7, 0.82), blue, bevel=0.02)
box('post', (0.05, 0.05, 0.4), (0, -0.45, 0.23), grey)
box('base', (0.55, 0.55, 0.03), (0, -0.45, 0.03), grey)
notes = [((0.36, 0.62, 1.4), (1.05, -0.3, 1.75), ['Oberkante auf oder knapp', 'unter Augenhöhe']),
         ((0.36, 0.62, 1.05), (1.15, -0.3, 1.35), ['Abstand ca. 50–70 cm,', 'flimmerfrei, entspiegelt']),
         ((0.2, 0.18, 0.76), (1.2, -0.3, 0.95), ['Tastatur getrennt,', 'Handballenauflage']),
         ((0.75, 0.4, 0.72), (1.25, -0.3, 0.6), ['Tisch ideal 160 × 80 cm,', 'höhenverstellbar']),
         ((-0.25, -0.45, 0.5), (-1.25, -0.3, 1.0), ['Stuhl höhenverstellbar,', 'Rückenlehne verstellbar'])]
for a, b, lines in notes:
    leader(a, b, ln, r=0.004)
    for k, t in enumerate(lines):
        label(t, (b[0] + (0.03 if b[0] > 0 else -0.03), b[1], b[2] + 0.02 - k * 0.09), size=0.045, material=lm, align='LEFT' if b[0] > 0 else 'RIGHT')
label('Beleuchtung mind. 500 Lux, blendfrei · Pausen oder Tätigkeitswechsel · Notebook: Ständer bzw. Monitor und eigene Tastatur', (0, -1.2, 0.02), size=0.045, material=lm, align='CENTER')
camera_front((0, 0, 1.0), 4.6, tilt=14, dist=7)
lights(0.6)
