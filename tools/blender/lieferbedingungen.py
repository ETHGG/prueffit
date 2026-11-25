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
label('Lieferbedingungen: Wer zahlt welchen Teil des Transports?', (0, -0.05, 2.15), size=0.075, material=lm, align='CENTER')
xs = [-1.6, -0.55, 0.55, 1.6]
for x, t in zip(xs, ['Verkäufer', 'Versandstation', 'Empfangsstation', 'Käufer']):
    cyl('p', 0.06, 0.05, (x, -0.02, 1.75), ln, rot=(1.5708, 0, 0))
    label(t, (x, -0.05, 1.86), size=0.045, material=lm, align='CENTER')
leader((xs[0], -0.02, 1.75), (xs[3], -0.02, 1.75), ln, r=0.006)
label('Rollgeld', ((xs[0] + xs[1]) / 2, -0.05, 1.62), size=0.036, material=lm, align='CENTER')
label('Fracht', ((xs[1] + xs[2]) / 2, -0.05, 1.62), size=0.036, material=lm, align='CENTER')
label('Rollgeld', ((xs[2] + xs[3]) / 2, -0.05, 1.62), size=0.036, material=lm, align='CENTER')
rows = [('ab Werk', None), ('unfrei', xs[1]), ('frei Haus', xs[3])]
for i, (n, cut) in enumerate(rows):
    z = 1.3 - i * 0.32
    label(n, (xs[0] - 0.2, -0.05, z - 0.02), size=0.045, material=lm, align='RIGHT')
    a = xs[0]
    if cut:
        box('v', (cut - a, 0.12, 0.18), ((a + cut) / 2, 0, z), blue, bevel=0.005)
        label('Verkäufer', ((a + cut) / 2, -0.07, z - 0.02), size=0.036, material=wl, align='CENTER')
        a = cut
    if a < xs[3]:
        box('k', (xs[3] - a, 0.12, 0.18), ((a + xs[3]) / 2, 0, z), orange, bevel=0.005)
        label('Käufer', ((a + xs[3]) / 2, -0.07, z - 0.02), size=0.036, material=wl, align='CENTER')
label('Ohne Vereinbarung (Versendungskauf): Käufer trägt die Versandkosten; der Verkäufer nur die Kosten bis zur Übergabe.', (0, -0.05, 0.3), size=0.04, material=lm, align='CENTER')
label('Beim Angebotsvergleich Bezugskosten immer mitrechnen: ab Werk kann teurer sein als ein höherer Preis frei Haus.', (0, -0.05, 0.17), size=0.04, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
