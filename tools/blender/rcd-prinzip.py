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
import math as _m
label('RCD (FI-Schutzschalter): Hin- und Rückstrom vergleichen', (0, -0.05, 2.15), size=0.075, material=lm, align='CENTER')
label('Normalbetrieb', (-1.1, -0.05, 1.9), size=0.05, material=lm, align='CENTER')
label('Fehlerfall: Strom fließt über einen Menschen zur Erde', (1.1, -0.05, 1.9), size=0.05, material=lm, align='CENTER')
for s, mL, top in ((-1, green, 'Differenz 0 mA → bleibt eingeschaltet'), (1, red, 'Differenz 40 mA ≥ 30 mA → schaltet in Millisekunden ab')):
    x0 = s * 1.1
    card(x0 - 0.55, 1.2, 0.5, 0.5, grey, ['RCD 30 mA', 'vergleicht', 'L und N'], sizes=(0.05, 0.034))
    card(x0 + 0.55, 1.2, 0.5, 0.5, blue, ['Gerät'], sizes=(0.055, 0.04))
    arrow((x0 - 0.3, -0.03, 1.32), (x0 + 0.3, -0.03, 1.32), orange, r=0.008, head=0.04)
    arrow((x0 + 0.3, -0.03, 1.08), (x0 - 0.3, -0.03, 1.08), blue, r=0.008, head=0.04)
    hin = '2,000 A' if s < 0 else '2,040 A'
    label('L hin: ' + hin, (x0, -0.05, 1.38), size=0.034, material=orange, align='CENTER')
    label('N zurück: 2,000 A', (x0, -0.05, 0.98), size=0.034, material=blue, align='CENTER')
    if s > 0:
        arrow((x0 + 0.55, -0.03, 0.92), (x0 + 0.55, -0.03, 0.62), red, r=0.008, head=0.04)
        label('40 mA über den Körper zur Erde', (x0 + 0.55, -0.05, 0.52), size=0.034, material=red, align='CENTER')
    card(x0, 0.28, 1.6, 0.26, mL, [top], sizes=(0.04, 0.03))
label('Der RCD schützt Personen, aber nicht vor Überlast oder Kurzschluss (dafür der LS-Schalter) – und nicht, wenn man L und N gleichzeitig berührt (kein Differenzstrom).', (0, -0.05, -0.02), size=0.036, material=lm, align='CENTER')
camera_front((0, 0, 1.05), 4.4, tilt=1)
lights(0.55)
