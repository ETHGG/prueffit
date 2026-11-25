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
label('Updates stufenweise verteilen (Update-Ringe)', (0, -0.05, 2.05), size=0.08, material=lm, align='CENTER')
cols = [(-1.65, grey, ['Hersteller', 'neues Update'], 'Tag 0'), (-0.55, blue, ['Ring 0: Test', 'Testsystem, wenige VMs'], 'sofort'),
        (0.55, orange, ['Ring 1: Pilot', 'ca. 10 % der Geräte'], 'nach 1–2 Tagen'), (1.65, green, ['Ring 2: alle', 'übrige Geräte'], 'nach ca. 1 Woche')]
for x, m, lines, t in cols:
    card(x, 1.2, 0.92, 0.6, m, lines)
    label(t, (x, -0.05, 0.72), size=0.05, material=lm, align='CENTER')
for i in range(3):
    arrow((cols[i][0] + 0.48, -0.02, 1.2), (cols[i + 1][0] - 0.48, -0.02, 1.2), ln, r=0.012, head=0.07)
leader((-0.55, -0.02, 0.6), (1.65, -0.02, 0.6), ln, r=0.004)
label('Fehler gemeldet? Verteilung anhalten, Update zurückziehen – nur geprüfte Updates erreichen alle Geräte.', (0, -0.05, 0.38), size=0.05, material=red, align='CENTER')
label('Werkzeuge: WSUS oder Intune (Windows), Paketquellen und Konfigurationsmanagement (Linux).', (0, -0.05, 0.16), size=0.047, material=lm, align='CENTER')
label('Kritische Sicherheitsupdates werden mit verkürzten Fristen verteilt; vorher Backup und Plan für den Rückweg.', (0, -0.05, 0.02), size=0.047, material=lm, align='CENTER')
camera_front((0, 0, 1.0), 4.4, tilt=1)
lights(0.55)
