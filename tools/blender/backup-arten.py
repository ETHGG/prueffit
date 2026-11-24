sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
full = mat('full', (0.1, 0.32, 0.65), rough=0.5)
diff = mat('diff', (0.85, 0.45, 0.05), rough=0.5)
inc = mat('inc', (0.1, 0.5, 0.28), rough=0.5)
faded = {k: mat(f'f{k}', c, rough=0.8) for k, c in [('full', (0.5, 0.6, 0.78)), ('diff', (0.9, 0.68, 0.4)), ('inc', (0.5, 0.75, 0.58))]}
ring = mat('ring', (0.85, 0.15, 0.12), rough=0.5)
days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr']
DX, W = 0.5, 0.34


def row(z0, title, kind, needed):
    label(title, (-1.47, -0.05, z0 + 0.7), size=0.06, material=lm)
    for i, d in enumerate(days):
        x = -1.25 + i * DX
        if i == 0:
            hgt, m, t = 0.6, (full if 0 in needed else faded['full']), 'Voll'
        elif kind == 'diff':
            hgt, m, t = 0.08 * i + 0.04, (diff if i in needed else faded['diff']), f'{d}'
        else:
            hgt, m, t = 0.1, (inc if i in needed else faded['inc']), f'{d}'
        box('bar', (W, 0.25, hgt), (x, 0, z0 + hgt / 2), m, bevel=0.008)
        if i in needed:
            for dx in (-W / 2 - 0.02, W / 2 + 0.02):
                leader((x + dx, -0.14, z0 - 0.02), (x + dx, -0.14, z0 + hgt + 0.02), ring, r=0.007)
            for dz in (-0.02, hgt + 0.02):
                leader((x - W / 2 - 0.02, -0.14, z0 + dz), (x + W / 2 + 0.02, -0.14, z0 + dz), ring, r=0.007)
        label(d, (x, -0.05, z0 - 0.14), size=0.055, material=lm, align='CENTER')


row(1.05, 'Differenziell: jeweils alles seit der letzten Vollsicherung (wächst täglich)', 'diff', {0, 5})
row(0.0, 'Inkrementell: jeweils nur die Änderungen seit der letzten Sicherung', 'inc', {0, 1, 2, 3, 4, 5})
label('Rot umrandet: nötig für die Wiederherstellung am Freitag', (0, -0.15, -0.3), size=0.05, material=ring, align='CENTER')
label('Differenziell: Voll + Freitag (2 Sicherungen) – mehr Speicher, schnellere Wiederherstellung.', (0, -0.05, -0.45), size=0.05, material=lm, align='CENTER')
label('Inkrementell: Voll + alle fünf Inkremente – wenig Speicher, Wiederherstellung aufwendiger.', (0, -0.05, -0.57), size=0.05, material=lm, align='CENTER')
camera_front((0, 0, 0.66), 4.3, tilt=3)
lights(0.55)
