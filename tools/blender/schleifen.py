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
label('Kopfgesteuerte und fußgesteuerte Schleife', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
Z = [1.65, 1.2, 0.75]
def boxes(x, title, steps, note):
    label(title, (x, -0.05, 1.92), size=0.06, material=lm, align='CENTER')
    for (t, m), z in zip(steps, Z):
        card(x, z, 1.25, 0.28, m, [t], sizes=(0.045, 0.04))
    label(note, (x, -0.05, 0.42), size=0.04, material=lm, align='CENTER')
def down(x, a, b):
    arrow((x, -0.03, a - 0.15), (x, -0.03, b + 0.15), ln, r=0.006, head=0.04)
def back(x, side, za, zb):
    e = x + side * 0.63; o = x + side * 0.8
    leader((e, -0.03, za), (o, -0.03, za), ln, r=0.005)
    leader((o, -0.03, za), (o, -0.03, zb), ln, r=0.005)
    arrow((o, -0.03, zb), (e, -0.03, zb), ln, r=0.005, head=0.035)
# head-controlled
x = -1.05
boxes(x, 'kopfgesteuert (while)', [('Bedingung erfüllt?', orange), ('Schleifenrumpf', blue), ('weiter nach der Schleife', grey)], 'prüft vorher: evtl. 0 Durchläufe')
down(x, Z[0], Z[1]); label('ja', (x + 0.05, -0.05, 1.42), size=0.036, material=green)
back(x, -1, Z[1], Z[0])
back(x, 1, Z[0], Z[2]); label('nein', (x + 0.84, -0.05, 1.2), size=0.036, material=red)
# foot-controlled
x = 1.05
boxes(x, 'fußgesteuert (do … while)', [('Schleifenrumpf', blue), ('Bedingung erfüllt?', orange), ('weiter nach der Schleife', grey)], 'prüft danach: mindestens 1 Durchlauf')
down(x, Z[0], Z[1])
back(x, 1, Z[1], Z[0]); label('ja', (x + 0.84, -0.05, 1.42), size=0.036, material=green)
down(x, Z[1], Z[2]); label('nein', (x + 0.05, -0.05, 0.97), size=0.036, material=red)
label('Beispiel Passwortabfrage: erst eingeben, dann prüfen → fußgesteuert. Liste abarbeiten, die leer sein kann → kopfgesteuert.', (0, -0.05, 0.15), size=0.042, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
