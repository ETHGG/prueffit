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
label('Netto-Personalbedarf berechnen', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
x0, z0, s = -1.6, 0.6, 0.15
items = [(['Brutto-Bedarf'], 7, None, blue), (['aktueller', 'Bestand'], 6, None, grey), (['− Abgänge', '(Rente)'], -1, 6, red), (['+ Zugänge', '(Azubi übernommen)'], 1, 5, green), (['= Bestand', 'zum Planungstermin'], 6, None, grey), (['Netto-Bedarf', '7 − 6 = 1'], 1, 6, orange)]
leader((x0 - 0.1, -0.02, z0), (x0 + 3.6, -0.02, z0), ln, r=0.005)
for i, (t, v, base, m) in enumerate(items):
    x = x0 + 0.25 + i * 0.6
    b = base or 0
    lo, hi = (b, b + v) if v > 0 else (b + v, b)
    h = (hi - lo) * s
    box('b', (0.4, 0.15, h), (x, 0, z0 + lo * s + h / 2), m, bevel=0.006)
    label(('+' + str(v) if v > 0 else '−' + str(-v)) if base is not None else str(v), (x, -0.1, z0 + hi * s + 0.05), size=0.045, material=lm, align='CENTER')
    for k, w in enumerate(t):
        label(w, (x, -0.05, z0 - 0.12 - k * 0.08), size=0.034, material=lm, align='CENTER')
label('Netto-Bedarf = Brutto-Bedarf − (Bestand − Abgänge + Zugänge) = 7 − (6 − 1 + 1) = 1 Person einstellen', (0, -0.05, 0.22), size=0.044, material=lm, align='CENTER')
label('Positiv → einstellen · negativ → Überhang abbauen (z. B. Versetzung, keine Nachbesetzung)', (0, -0.05, 0.1), size=0.042, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
