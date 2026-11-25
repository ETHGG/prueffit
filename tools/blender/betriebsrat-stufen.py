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
label('Beteiligung des Betriebsrats: von schwach bis stark', (0, -0.05, 2.12), size=0.08, material=lm, align='CENTER')
st = [('Information', ['wirtschaftliche Lage,', 'Personalplanung'], grey),
      ('Anhörung', ['jede Kündigung –', 'ohne Anhörung unwirksam'], blue),
      ('Zustimmung / Widerspruch', ['Einstellung, Versetzung', '(Unternehmen > 20 AN)'], orange),
      ('Echte Mitbestimmung', ['Arbeitszeit, Pausen,', 'technische Überwachung'], green)]
for i, (t, lines, m) in enumerate(st):
    x = -1.6 + i * 1.07
    h = 0.45 + i * 0.25
    z = 0.4 + h / 2
    box('st', (1.0, 0.3, h), (x, 0.05, z), m, bevel=0.012)
    for k, s in enumerate([t] + lines):
        label(s, (x, -0.12, z + h / 2 - 0.12 - k * 0.11), size=0.058 if k == 0 else 0.04, material=wl, align='CENTER')
label('Bei echter Mitbestimmung (§ 87 BetrVG) entscheidet ohne Einigung die Einigungsstelle – z. B. bei neuer Software, die Leistung oder Verhalten überwachen kann.', (0, -0.05, 0.2), size=0.044, material=lm, align='CENTER')
camera_front((0, 0, 1.1), 4.4, tilt=1)
lights(0.55)
