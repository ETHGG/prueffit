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
label('Fehlersuche systematisch: ein Kreislauf', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
steps = [('1. Fehler beschreiben', 'was, seit wann, wer, was geändert?', blue),
         ('2. Informationen sammeln', 'Logs, Monitoring, Messwerte', blue),
         ('3. Hypothesen bilden', 'nach Wahrscheinlichkeit und Aufwand', orange),
         ('4. gezielt testen', 'immer nur eine Änderung', orange),
         ('5. beheben und prüfen', 'Funktion testen, dokumentieren', green)]
cx, cz, R = 0, 1.1, 0.7
P = []
for i, (t, d, m) in enumerate(steps):
    a = _m.radians(90 - i * 72)
    x, z = cx + 1.45 * R * _m.cos(a) * 1.25, cz + R * _m.sin(a)
    P.append((x, z))
    card(x, z, 1.2, 0.32, m, [t, d], sizes=(0.042, 0.032))
for i in range(5):
    (x1, z1), (x2, z2) = P[i], P[(i + 1) % 5]
    dx, dz = x2 - x1, z2 - z1
    L = (dx * dx + dz * dz) ** 0.5
    ux, uz = dx / L, dz / L
    k = 0.62 if abs(ux) > 0.7 else 0.3
    arrow((x1 + ux * k, -0.03, z1 + uz * k * 0.6), (x2 - ux * k, -0.03, z2 - uz * k * 0.6), ln, r=0.006, head=0.04)
label('Test negativ?', (cx, -0.05, cz + 0.05), size=0.045, material=red, align='CENTER')
label('zurück zu Schritt 3', (cx, -0.05, cz - 0.05), size=0.04, material=red, align='CENTER')
label('Werkzeuge: ping, traceroute/tracert, ipconfig/ip, nslookup, Kabeltester, Logdateien', (0, -0.05, 0.12), size=0.042, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
