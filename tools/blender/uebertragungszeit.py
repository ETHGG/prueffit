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
label('Übertragungszeit: 2 GB über 100 Mbit/s', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
steps = [(blue, ['Datenmenge', '2 GB = 2 · 10⁹ Byte']), (orange, ['in Bit (× 8)', '16 · 10⁹ Bit']),
         (green, ['÷ Datenrate', '100 · 10⁶ Bit/s']), (red, ['Zeit', '160 s = 2 min 40 s'])]
for i, (m, lines) in enumerate(steps):
    x = -1.65 + i * 1.1
    card(x, 1.65, 0.95, 0.44, m, lines)
    if i < 3:
        arrow((x + 0.5, -0.03, 1.65), (x + 0.6, -0.03, 1.65), ln, r=0.01, head=0.04)
label('Achtung bei Binärpräfixen:', (-2.05, -0.05, 1.12), size=0.058, material=orange)
label('2 GiB = 2 · 1024³ Byte = 2.147.483.648 Byte → × 8 ÷ 10⁸ Bit/s ≈ 171,8 s', (-2.05, -0.05, 0.97), size=0.054, material=lm)
label('Datenraten sind immer dezimal: 100 Mbit/s = 100.000.000 Bit/s = 12,5 MB/s', (-2.05, -0.05, 0.82), size=0.054, material=lm)
t = ['Byte → Bit: mal 8 · Bit/s → Byte/s: durch 8',
     'Formel: t = Datenmenge ÷ Datenrate (beide in Bit bzw. Bit/s)',
     'Das Ergebnis ist die Untergrenze: Protokoll-Overhead (ca. 5 %) kommt in der Praxis dazu.']
for i, s in enumerate(t):
    label(s, (0, -0.05, 0.48 - i * 0.14), size=0.054, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.5, tilt=1)
lights(0.55)
