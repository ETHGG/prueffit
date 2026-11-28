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
label('Darlehen 10.000 €, 5 % Zinsen, 4 Jahre: Raten- und Annuitätentilgung', (0, -0.05, 2.2), size=0.07, material=lm, align='CENTER')
S = 0.00042
def bars(x0, rows, title, sub):
    label(title, (x0 + 0.62, -0.05, 1.95), size=0.062, material=lm, align='CENTER')
    for i, (t, z) in enumerate(rows):
        x = x0 + i * 0.42
        box('t', (0.3, 0.1, t * S), (x, 0, 0.6 + t * S / 2), blue)
        box('z', (0.3, 0.1, z * S), (x, 0, 0.6 + t * S + z * S / 2), orange)
        label('%d' % (i + 1), (x, -0.05, 0.47), size=0.05, material=lm, align='CENTER')
        label(('%.2f' % (t + z)).replace('.', ','), (x, -0.07, 0.62 + (t + z) * S), size=0.05, material=lm, align='CENTER')
    label(sub, (x0 + 0.62, -0.05, 0.32), size=0.052, material=lm, align='CENTER')
bars(-2.0, [(2500, 500), (2500, 375), (2500, 250), (2500, 125)], 'Ratentilgung', 'Zinsen gesamt 1.250,00 €')
bars(0.6, [(2320.12, 500.00), (2436.13, 383.99), (2557.93, 262.19), (2685.82, 134.29)], 'Annuität 2.820,12 € je Jahr', 'Zinsen gesamt 1.280,47 €')
box('lt', (0.12, 0.05, 0.12), (-2.0, 0, 0.1), blue); label('Tilgung', (-1.9, -0.05, 0.08), size=0.05, material=lm)
box('lz', (0.12, 0.05, 0.12), (-1.2, 0, 0.1), orange); label('Zinsen', (-1.1, -0.05, 0.08), size=0.05, material=lm)
label('Rate: gleiche Tilgung, sinkende Belastung · Annuität: gleiche Belastung, steigende Tilgung', (-0.45, -0.05, 0.08), size=0.052, material=lm)
camera_front((0, 0, 1.15), 4.6, tilt=1)
lights(0.55)
