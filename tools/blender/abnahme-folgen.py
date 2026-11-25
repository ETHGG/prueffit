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
label('Was sich mit der Abnahme ändert (Werkvertrag, § 640 BGB)', (0, -0.05, 2.12), size=0.078, material=lm, align='CENTER')
label('vor der Abnahme', (-1.05, -0.05, 1.78), size=0.062, material=lm, align='CENTER')
label('nach der Abnahme', (1.05, -0.05, 1.78), size=0.062, material=lm, align='CENTER')
rows = [('Vergütung', 'noch nicht fällig', 'wird fällig'), ('Risiko zufälliger Schäden', 'beim Auftragnehmer', 'beim Auftraggeber'),
        ('Mängelansprüche', 'Verjährung läuft noch nicht', 'Verjährung beginnt'), ('Beweislast für Mängel', 'Auftragnehmer', 'Auftraggeber')]
for i, (k, a, b) in enumerate(rows):
    z = 1.5 - i * 0.3
    label(k, (0, -0.05, z + 0.08), size=0.045, material=lm, align='CENTER')
    card(-1.05, z - 0.04, 1.6, 0.16, grey, [a], sizes=(0.046, 0.04))
    card(1.05, z - 0.04, 1.6, 0.16, green, [b], sizes=(0.046, 0.04))
    arrow((-0.22, -0.02, z - 0.04), (0.22, -0.02, z - 0.04), ln, r=0.008, head=0.05)
label('Wesentliche Mängel: Abnahme verweigern. Unwesentliche: abnehmen, Mangel mit Frist ins Protokoll – sonst gehen Ansprüche verloren.', (0, -0.05, 0.22), size=0.045, material=red, align='CENTER')
camera_front((0, 0, 1.1), 4.4, tilt=1)
lights(0.55)
