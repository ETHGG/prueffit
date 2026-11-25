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
label('Mittelwert oder Median? Ein Ausreißer macht den Unterschied', (0, -0.05, 2.15), size=0.075, material=lm, align='CENTER')
x0, s = -1.8, 3.6 / 30
leader((x0, -0.02, 1.2), (x0 + 3.6, -0.02, 1.2), ln, r=0.005)
for t in range(0, 31, 5):
    leader((x0 + t * s, -0.02, 1.17), (x0 + t * s, -0.02, 1.23), ln, r=0.003)
    label(str(t), (x0 + t * s, -0.05, 1.05), size=0.04, material=lm, align='CENTER')
vals = [9, 12, 14, 15, 30]
for v in vals:
    cyl('d', 0.07, 0.05, (x0 + v * s, -0.03, 1.4), red if v == 30 else blue, rot=(1.5708, 0, 0))
    label(str(v), (x0 + v * s, -0.07, 1.385), size=0.045, material=wl, align='CENTER')
label('Ausreißer', (x0 + 30 * s, -0.05, 1.52), size=0.04, material=red, align='CENTER')
for v, t, m, z in [(16, 'Mittelwert 16', orange, 1.85), (14, 'Median 14', green, 1.75)]:
    leader((x0 + v * s, 0.03, 1.25), (x0 + v * s, 0.03, z - 0.04), m, r=0.008)
    label(t, (x0 + v * s + (0.06 if v == 16 else -0.06), -0.05, z), size=0.045, material=m, align='LEFT' if v == 16 else 'RIGHT')
label('Mittelwert = (9 + 12 + 14 + 15 + 30) ÷ 5 = 80 ÷ 5 = 16 – vom Ausreißer nach oben gezogen', (0, -0.05, 0.72), size=0.043, material=lm, align='CENTER')
label('Median = mittlerer Wert der sortierten Reihe = 14 – robust gegen Ausreißer', (0, -0.05, 0.58), size=0.043, material=lm, align='CENTER')
label('Spannweite = 30 − 9 = 21. Bei gerader Anzahl ist der Median das Mittel der beiden mittleren Werte.', (0, -0.05, 0.44), size=0.042, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
