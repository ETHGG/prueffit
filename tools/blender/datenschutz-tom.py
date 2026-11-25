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
label('Technisch-organisatorische Maßnahmen (TOM, Art. 32 DSGVO)', (0, -0.05, 2.12), size=0.078, material=lm, align='CENTER')
tiles = [
    ('Zutrittskontrolle', 'Serverraum abschließen,', 'Besucher eintragen', blue),
    ('Zugangskontrolle', 'Passwort und MFA,', 'Bildschirmsperre', blue),
    ('Zugriffskontrolle', 'Rechte nach Rolle,', 'Zugriffe protokollieren', blue),
    ('Weitergabekontrolle', 'Verschlüsselung', '(TLS, VPN, S/MIME)', orange),
    ('Verfügbarkeit', 'Backup, USV,', 'Wiederherstellung testen', green),
    ('Überprüfung', 'Maßnahmen regelmäßig', 'testen und bewerten', grey),
]
for i, (t, a, b, m) in enumerate(tiles):
    x = -1.42 + (i % 3) * 1.42
    z = 1.5 - (i // 3) * 0.78
    card(x, z, 1.3, 0.64, m, [t, a, b], sizes=(0.062, 0.046))
label('Technisch = durch Technik (z. B. Verschlüsselung) · organisatorisch = durch Regeln (z. B. Schulung, Besucherliste).', (0, -0.05, 0.22), size=0.046, material=lm, align='CENTER')
label('Die Begriffe Zutritts-, Zugangs- und Zugriffskontrolle stammen aus dem früheren BDSG und sind in der Praxis weiter üblich.', (0, -0.05, 0.08), size=0.046, material=lm, align='CENTER')
camera_front((0, 0, 1.08), 4.4, tilt=1)
lights(0.55)
