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
label('Mantelleitung NYM-J 3 × 1,5 mm² im Querschnitt', (0, -0.05, 2.15), size=0.075, material=lm, align='CENTER')
brown = mat('brown', (0.35, 0.18, 0.08), rough=0.5)
gy = mat('gy', (0.25, 0.6, 0.15), rough=0.5)
cu = mat('cu', (0.85, 0.45, 0.2), metal=1.0, rough=0.3)
mantle = mat('mantle', (0.75, 0.76, 0.78), rough=0.6)
fill = mat('fill', (0.55, 0.56, 0.58), rough=0.8)
cx, cz = -0.75, 1.15
cyl('m', 0.62, 0.3, (cx, 0.15, cz), mantle, rot=(_m.radians(90), 0, 0))
cyl('f', 0.52, 0.3, (cx, 0.12, cz), fill, rot=(_m.radians(90), 0, 0))
cores = [(brown, 'L (braun)'), (mat('blue2', (0.1, 0.3, 0.75), rough=0.5), 'N (blau)'), (gy, 'PE (grün-gelb)')]
pos = []
for k, (m, t) in enumerate(cores):
    a = _m.radians(90 + k * 120)
    x, z = cx + 0.25 * _m.cos(a), cz + 0.25 * _m.sin(a)
    pos.append((x, z))
    cyl('i', 0.2, 0.32, (x, 0.1, z), m, rot=(_m.radians(90), 0, 0))
    cyl('c', 0.11, 0.34, (x, 0.08, z), cu, rot=(_m.radians(90), 0, 0))
box('stripe', (0.045, 0.05, 0.2), (pos[2][0] + 0.15, -0.08, pos[2][1]), mat('yel', (0.95, 0.8, 0.05), rough=0.5))
(x, z) = pos[0]
leader((x + 0.2, -0.12, z), (0.3, -0.12, 1.77), ln, r=0.004)
label('L (braun)', (0.35, -0.05, 1.75), size=0.05, material=lm)
(x, z) = pos[2]
leader((x + 0.2, -0.12, z - 0.02), (0.3, -0.12, 0.82), ln, r=0.004)
label('PE (grün-gelb)', (0.35, -0.05, 0.8), size=0.05, material=lm)
(x, z) = pos[1]
leader((x - 0.2, -0.12, z), (-1.55, -0.12, 0.72), ln, r=0.004)
label('N (blau)', (-1.6, -0.05, 0.7), size=0.05, material=lm, align='RIGHT')
mx, mz = cx + 0.62 * _m.cos(_m.radians(15)), cz + 0.62 * _m.sin(_m.radians(15))
leader((mx, -0.12, mz), (0.3, -0.12, 1.32), ln, r=0.004)
label('Außenmantel (PVC)', (0.35, -0.05, 1.3), size=0.045, material=lm)
label('N = Normleitung (VDE) · Y = PVC · M = Mantelleitung · J = mit grün-gelbem Schutzleiter (O = ohne)', (0, -0.05, 0.32), size=0.042, material=lm, align='CENTER')
label('3 × 1,5 mm²: drei Adern mit je 1,5 mm² Kupfer. Der Querschnitt richtet sich nach Strom, Verlegeart, Länge und Absicherung.', (0, -0.05, 0.18), size=0.04, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
