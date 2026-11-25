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
label('Gesetzliche Kündigungsfristen des Arbeitgebers (§ 622 BGB)', (0, -0.05, 2.15), size=0.072, material=lm, align='CENTER')
st = [('Probezeit', '2 Wochen', 0.5), ('unter 2 J.', '4 Wochen*', 1), ('ab 2 J.', '1 Monat', 1), ('ab 5 J.', '2 Monate', 2), ('ab 8 J.', '3 Monate', 3), ('ab 10 J.', '4 Monate', 4), ('ab 12 J.', '5 Monate', 5), ('ab 15 J.', '6 Monate', 6), ('ab 20 J.', '7 Monate', 7)]
x0, z0, s = -1.85, 0.55, 0.17
leader((x0 - 0.15, -0.02, z0), (x0 + 3.85, -0.02, z0), ln, r=0.005)
for i, (t, d, v) in enumerate(st):
    x = x0 + 0.1 + i * 0.43
    m = grey if i < 2 else (blue if i < 5 else orange)
    box('b', (0.36, 0.15, v * s), (x, 0, z0 + v * s / 2), m, bevel=0.005)
    label(d, (x, -0.05, z0 + v * s + 0.05), size=0.036, material=lm, align='CENTER')
    label(t, (x, -0.05, z0 - 0.1), size=0.036, material=lm, align='CENTER')
label('Betriebszugehörigkeit', (x0 + 3.85, -0.05, z0 - 0.2), size=0.036, material=lm, align='RIGHT')
label('* Grundfrist: 4 Wochen zum 15. oder zum Monatsende – sie gilt auch für Arbeitnehmer.', (0, -0.05, 0.3), size=0.04, material=lm, align='CENTER')
label('Längere Fristen gelten nur für die Kündigung durch den Arbeitgeber, jeweils zum Monatsende; Tarif- und Arbeitsvertrag können abweichen.', (0, -0.05, 0.18), size=0.04, material=lm, align='CENTER')
label('Kündigung immer schriftlich mit Unterschrift (§ 623 BGB). Probezeit: höchstens 6 Monate.', (0, -0.05, 0.06), size=0.04, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
