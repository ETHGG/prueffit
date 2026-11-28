sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
blue = mat('blue', (0.1, 0.32, 0.65), rough=0.5)
orange = mat('orange', (0.68, 0.3, 0.02), rough=0.5)
green = mat('green', (0.04, 0.4, 0.18), rough=0.5)
grey = mat('grey', (0.28, 0.32, 0.36), rough=0.6)
red = mat('red', (0.75, 0.15, 0.12), rough=0.5)
ln = mat('ln', (0.15, 0.2, 0.22), rough=0.9)
def card(x, z, w, h, m, lines, sizes=(0.062, 0.05)):
    box('c', (w, 0.2, h), (x, 0, z), m, bevel=0.015)
    n = len(lines)
    for i, t in enumerate(lines):
        s = sizes[0] if i == 0 else sizes[1]
        dz = (n - 1) * 0.06 - i * 0.12
        label(t, (x, -0.11, z + dz - s / 3), size=s, material=wl, align='CENTER')
import math as _m
label('Sicherheitszeichen: Form und Farbe sagen, was gilt', (0, -0.05, 2.15), size=0.075, material=lm, align='CENTER')
xs = [-1.7, -0.85, 0, 0.85, 1.7]
zc = 1.35
# Verbot: red ring + bar
cyl('v1', 0.3, 0.04, (xs[0], 0, zc), red, rot=(_m.radians(90), 0, 0))
cyl('v2', 0.24, 0.05, (xs[0], 0, zc), wl, rot=(_m.radians(90), 0, 0))
_vb = box('vb', (0.5, 0.06, 0.06), (xs[0], -0.04, zc), red)
_vb.rotation_euler = (0, _m.radians(45), 0)
# Gebot: blue disc
cyl('g', 0.3, 0.04, (xs[1], 0, zc), blue, rot=(_m.radians(90), 0, 0))
label('!', (xs[1], -0.05, zc - 0.1), size=0.28, material=wl, align='CENTER')
# Warnung: yellow triangle (3-sided cylinder)
yel = mat('yellow', (0.95, 0.75, 0.05), rough=0.5)
cyl('w1', 0.36, 0.04, (xs[2], 0, zc - 0.05), ln, rot=(_m.radians(90), 0, 0), verts=3)
cyl('w2', 0.28, 0.05, (xs[2], 0, zc - 0.05), yel, rot=(_m.radians(90), 0, 0), verts=3)
label('!', (xs[2], -0.06, zc - 0.13), size=0.22, material=ln, align='CENTER')
# Rettung: green square
box('r', (0.55, 0.05, 0.55), (xs[3], 0, zc), green, bevel=0.01)
label('+', (xs[3], -0.05, zc - 0.12), size=0.32, material=wl, align='CENTER')
# Brandschutz: red square
box('b', (0.55, 0.05, 0.55), (xs[4], 0, zc), red, bevel=0.01)
for x, t, d, e in zip(xs, ['Verbot', 'Gebot', 'Warnung', 'Rettung', 'Brandschutz'],
                      ['rund, roter Rand,', 'blauer Kreis,', 'gelbes Dreieck,', 'grünes Rechteck', 'rotes Rechteck'],
                      ['Querbalken', 'weißes Symbol', 'schwarzer Rand', 'oder Quadrat', 'oder Quadrat']):
    label(t, (x, -0.05, 1.82), size=0.058, material=lm, align='CENTER')
    label(d, (x, -0.05, 0.88), size=0.058, material=lm, align='CENTER')
    label(e, (x, -0.05, 0.8), size=0.058, material=lm, align='CENTER')
for x, ex in zip(xs, ['Rauchen verboten', 'Schutzbrille tragen', 'Hochspannung', 'Erste Hilfe, Notausgang', 'Feuerlöscher']):
    label('z. B. ' + ex, (x, -0.05, 0.65), size=0.058, material=lm, align='CENTER')
label('Schilder nach ASR A1.3 / DIN EN ISO 7010; Fluchtwege grün, Feuerlöscher und Brandmelder rot.', (0, -0.05, 0.3), size=0.058, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
