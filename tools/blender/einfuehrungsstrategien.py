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
label('Einführungsstrategien für ein neues System', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
rows = [('Stichtag (Big Bang)', [(0, 0.5, grey, 'alt'), (0.5, 1.0, green, 'neu für alle')], 'schnell, aber hohes Risiko'),
        ('stufenweise', [(0, 0.3, grey, 'alt'), (0.3, 0.55, blue, 'Abt. A'), (0.55, 0.8, blue, '+ Abt. B'), (0.8, 1.0, green, 'alle')], 'Risiko begrenzt, dauert länger'),
        ('Parallelbetrieb', [(0, 0.35, grey, 'alt'), (0.35, 0.75, orange, 'alt + neu gleichzeitig'), (0.75, 1.0, green, 'neu')], 'sicher, aber doppelte Arbeit'),
        ('Pilotbetrieb', [(0, 0.3, grey, 'alt'), (0.3, 0.6, blue, 'Pilotgruppe'), (0.6, 1.0, green, 'alle')], 'Fehler früh finden, Key-User')]
X0, W = -1.2, 2.3
for i, (n, segs, note) in enumerate(rows):
    z = 1.65 - i * 0.36
    label(n, (X0 - 0.08, -0.05, z - 0.02), size=0.05, material=lm, align='RIGHT')
    for a, b, m, t in segs:
        box('s', (W * (b - a) - 0.02, 0.15, 0.2), (X0 + W * (a + b) / 2, 0, z), m, bevel=0.008)
        label(t, (X0 + W * (a + b) / 2, -0.1, z - 0.02), size=0.036, material=wl, align='CENTER')
    label(note, (X0 + W + 0.08, -0.05, z - 0.02), size=0.038, material=lm)
arrow((X0, -0.02, 0.32), (X0 + W, -0.02, 0.32), ln, r=0.006, head=0.05)
label('Zeit', (X0 + W + 0.08, -0.05, 0.3), size=0.04, material=lm)
label('Immer dazu: Tests, Schulung vor dem Start, Hypercare nach dem Go-Live und ein Plan für den Rückweg.', (0, -0.05, 0.12), size=0.045, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
