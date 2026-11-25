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
label('Hashwert: kleinste Änderung → völlig anderer Wert', (0, -0.05, 2.25), size=0.07, material=lm, align='CENTER')
rows = [(1.85, 'Angebot: 1000 Euro', '4613c2be75448b1b…', blue),
        (1.45, 'Angebot: 1001 Euro', '76badfd5e51d1861…', blue),
        (0.95, 'Salt x7Q2 + Sommer2026', '6b39bf21f5f5c1f0…', green),
        (0.55, 'Salt 9kLm + Sommer2026', '9978f8c3e142bf4e…', green)]
for z, a, h, m in rows:
    card(-1.3, z, 1.15, 0.3, m, [a], sizes=(0.04, 0.03))
    card(0, z, 0.6, 0.3, grey, ['SHA-256'], sizes=(0.04, 0.03))
    card(1.3, z, 1.15, 0.3, orange, [h], sizes=(0.04, 0.03))
    arrow((-0.7, -0.03, z), (-0.32, -0.03, z), ln, r=0.008, head=0.05)
    arrow((0.32, -0.03, z), (0.7, -0.03, z), ln, r=0.008, head=0.05)
label('Eingabe', (-1.3, -0.05, 2.06), size=0.04, material=lm, align='CENTER')
label('Hashfunktion', (0, -0.05, 2.06), size=0.04, material=lm, align='CENTER')
label('Hashwert (gekürzt, 64 Hex-Zeichen)', (1.3, -0.05, 2.06), size=0.04, material=lm, align='CENTER')
label('oben: eine Ziffer geändert → anderer Hash (Integrität prüfbar)', (0, -0.05, 1.2), size=0.036, material=lm, align='CENTER')
label('unten: gleiches Passwort, anderer Salt → anderer Hash (Salt macht vorberechnete Tabellen nutzlos)', (0, -0.05, 0.3), size=0.036, material=lm, align='CENTER')
label('Für Passwörter in der Praxis ein langsames Verfahren wie Argon2 oder bcrypt statt SHA-256 allein.', (0, -0.05, 0.17), size=0.036, material=lm, align='CENTER')
camera_front((0, 0, 1.2), 4.5, tilt=1)
lights(0.55)
