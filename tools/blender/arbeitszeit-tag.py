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
label('Arbeitszeitgesetz für Erwachsene: Pausen und Ruhezeit', (0, -0.05, 2.15), size=0.075, material=lm, align='CENTER')
x0, s = -1.9, 3.8 / 24
leader((x0, -0.02, 1.2), (x0 + 3.8, -0.02, 1.2), ln, r=0.004)
for h in range(0, 25, 2):
    label('%d' % h if h < 24 else '24 Uhr', (x0 + h * s, -0.05, 1.05), size=0.034, material=lm, align='CENTER')
def seg(a, b, m, t, z=1.32):
    box('s', ((b - a) * s - 0.01, 0.12, 0.2), (x0 + (a + b) / 2 * s, 0, z), m, bevel=0.004)
    if t:
        label(t, (x0 + (a + b) / 2 * s, -0.07, z - 0.02), size=0.032, material=wl, align='CENTER')
seg(8, 12, blue, 'Arbeit')
seg(12, 12.75, orange, '')
seg(12.75, 17.5, blue, 'Arbeit')
label('45 min Pause', (x0 + 12.4 * s, -0.05, 1.5), size=0.034, material=orange, align='CENTER')
seg(17.5, 24, green, 'Ruhezeit mind. 11 h', z=1.62)
seg(0, 4.5, green, 'bis 4:30 Uhr', z=1.62)
label('Beispiel: 8:00–17:30 Uhr = 8,75 h Arbeit + 45 min Pause → frühestens 4:30 Uhr wieder arbeiten', (0, -0.05, 0.82), size=0.04, material=lm, align='CENTER')
card(-1.25, 0.45, 1.15, 0.36, blue, ['Arbeitszeit', 'werktäglich 8 h, bis 10 h, wenn', 'im Schnitt von 6 Monaten 8 h'], sizes=(0.045, 0.03))
card(0, 0.45, 1.15, 0.36, orange, ['Pausen', 'über 6 h: 30 min', 'über 9 h: 45 min (Blöcke ≥ 15 min)'], sizes=(0.045, 0.03))
card(1.25, 0.45, 1.15, 0.36, green, ['Ruhezeit', 'mind. 11 h ohne Unterbrechung', 'nach Ende der Arbeit'], sizes=(0.045, 0.03))
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
