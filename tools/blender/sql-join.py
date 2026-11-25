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
label('SQL: INNER JOIN und LEFT JOIN', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
def tab(x, z, w, title, rows, m):
    h = 0.16 + 0.11 * len(rows)
    box('t', (w, 0.2, h), (x, 0, z - h / 2), m, bevel=0.01)
    label(title, (x, -0.11, z - 0.11), size=0.04, material=wl, align='CENTER')
    for i, r in enumerate(rows):
        label(r, (x, -0.11, z - 0.22 - i * 0.11), size=0.034, material=wl, align='CENTER')
tab(-1.1, 1.95, 1.3, 'Kunde (kunde_id, name)', ['1  Müller', '2  Schmidt', '3  Weber'], blue)
tab(1.1, 1.95, 1.5, 'Bestellung (best_nr, kunde_id)', ['B1  1', 'B2  1', 'B3  2'], orange)
label('SELECT k.name, b.best_nr FROM Kunde k … JOIN Bestellung b ON b.kunde_id = k.kunde_id', (0, -0.05, 1.32), size=0.036, material=lm, align='CENTER')
tab(-1.1, 1.15, 1.6, 'INNER JOIN: nur Treffer in beiden', ['Müller  B1', 'Müller  B2', 'Schmidt  B3'], green)
tab(1.1, 1.15, 1.6, 'LEFT JOIN: alle Kunden', ['Müller  B1', 'Müller  B2', 'Schmidt  B3', 'Weber  NULL'], grey)
label('Weber hat keine Bestellung: Beim INNER JOIN fällt er weg, beim LEFT JOIN bleibt er mit NULL.', (0, -0.05, 0.38), size=0.038, material=lm, align='CENTER')
label('Kunden ohne Bestellung finden: LEFT JOIN … WHERE b.best_nr IS NULL', (0, -0.05, 0.25), size=0.038, material=lm, align='CENTER')
camera_front((0, 0, 1.2), 4.4, tilt=1)
lights(0.55)
