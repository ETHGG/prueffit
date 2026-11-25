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
label('Technische Dokumentation: für wen?', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
docs = [('Benutzer-', 'dokumentation', 'Anwender', 'Bedienung Schritt für Schritt,', 'Bildschirmfotos', blue),
        ('Administrations-', 'dokumentation', 'IT-Betrieb', 'Installation, Konfiguration,', 'Zugänge, Datensicherung', green),
        ('System-', 'dokumentation', 'Entwickler', 'Aufbau, Schnittstellen,', 'Datenmodell', orange),
        ('Projekt-', 'dokumentation', 'Auftraggeber', 'Ziele, Planung,', 'Abweichungen, Ergebnis', grey)]
for i, (a, b, who, c1, c2, m) in enumerate(docs):
    x = -1.62 + i * 1.08
    box('d', (0.95, 0.2, 1.0), (x, 0, 1.3), m, bevel=0.015)
    label(a, (x, -0.11, 1.62), size=0.05, material=wl, align='CENTER')
    label(b, (x, -0.11, 1.53), size=0.05, material=wl, align='CENTER')
    label('für: ' + who, (x, -0.11, 1.3), size=0.045, material=wl, align='CENTER')
    label(c1, (x, -0.11, 1.08), size=0.034, material=wl, align='CENTER')
    label(c2, (x, -0.11, 1.0), size=0.034, material=wl, align='CENTER')
label('Gute Dokumentation ist zielgruppengerecht, aktuell (Version, Datum, Autor), klar gegliedert und vollständig.', (0, -0.05, 0.5), size=0.044, material=lm, align='CENTER')
label('Ein Dokument für alle passt selten – Zugangsdaten gehören z. B. nicht in die Benutzerdokumentation.', (0, -0.05, 0.36), size=0.042, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
