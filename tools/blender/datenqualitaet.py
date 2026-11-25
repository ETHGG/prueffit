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
label('Dimensionen der Datenqualität mit typischen Mängeln', (0, -0.05, 2.15), size=0.075, material=lm, align='CENTER')
dims = [('Vollständigkeit', 'Kunde ohne E-Mail', blue), ('Korrektheit', 'falsche Hausnummer', blue), ('Gültigkeit', 'PLZ mit 4 Ziffern', blue),
        ('Konsistenz', 'Bestellung nach Lieferung', orange), ('Eindeutigkeit', 'Müller / Mueller GmbH', orange), ('Aktualität', 'alte Anschrift', orange)]
for i, (t, ex, m) in enumerate(dims):
    x = -1.3 + (i % 3) * 1.3
    z = 1.55 - (i // 3) * 0.6
    card(x, z, 1.2, 0.48, m, [t, ex], sizes=(0.055, 0.04))
label('Vollständigkeit = gefüllte Werte ÷ alle Datensätze × 100 % – z. B. 2.220 ÷ 2.400 = 92,5 %', (0, -0.05, 0.5), size=0.043, material=lm, align='CENTER')
label('Bereinigen: profilieren → Regeln festlegen → bereinigen → prüfen → dauerhaft überwachen (Fehler an der Quelle verhindern)', (0, -0.05, 0.36), size=0.04, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
