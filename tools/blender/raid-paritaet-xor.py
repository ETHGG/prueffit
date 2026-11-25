sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
ok = mat('ok', (0.1, 0.32, 0.65), rough=0.5)
par = mat('par', (0.68, 0.3, 0.02), rough=0.5)
bad = mat('bad', (0.75, 0.15, 0.12), rough=0.5)
grn = mat('grn', (0.04, 0.4, 0.18), rough=0.5)
ln = mat('ln', (0.15, 0.2, 0.22), rough=0.9)
rows = [
    (1.45, '1  Normalbetrieb: P = D1 XOR D2 XOR D3',
     [('Platte 1', 'D1 = 1011', ok), ('Platte 2', 'D2 = 0110', ok), ('Platte 3', 'D3 = 1100', ok), ('Platte 4', 'P = 0001', par)]),
    (0.55, '2  Platte 2 fällt aus',
     [('Platte 1', 'D1 = 1011', ok), ('defekt', 'D2 = ?', bad), ('Platte 3', 'D3 = 1100', ok), ('Platte 4', 'P = 0001', par)]),
]
for z, title, disks in rows:
    label(title, (-2.1, -0.05, z + 0.3), size=0.055, material=lm)
    for k, (a, b, m) in enumerate(disks):
        x = -1.8 + k * 0.52
        box('d', (0.46, 0.2, 0.4), (x, 0, z), m, bevel=0.01)
        label(a, (x, -0.11, z + 0.05), size=0.042, material=wl, align='CENTER')
        label(b, (x, -0.11, z - 0.1), size=0.045, material=wl, align='CENTER')
label('3  Rebuild: fehlenden Block zurückrechnen', (0.3, -0.05, 1.75), size=0.055, material=lm)
calc = [('', '1011', 'D1'), ('XOR', '1100', 'D3'), ('XOR', '0001', 'P')]
for i, (op, bits, c) in enumerate(calc):
    z = 1.45 - i * 0.2
    label(op, (0.85, -0.05, z), size=0.065, material=lm, align='RIGHT')
    label(bits, (1.25, -0.05, z), size=0.075, material=lm, align='CENTER')
    label(c, (1.65, -0.05, z), size=0.06, material=lm)
leader((0.6, -0.03, 0.9), (1.95, -0.03, 0.9), ln, r=0.006)
label('=', (0.85, -0.05, 0.7), size=0.065, material=lm, align='RIGHT')
box('res', (0.5, 0.1, 0.17), (1.25, 0, 0.73), grn, bevel=0.01)
label('0110', (1.25, -0.06, 0.7), size=0.075, material=wl, align='CENTER')
label('= D2 wieder da', (1.65, -0.05, 0.7), size=0.06, material=lm)
label('XOR bitweise: gleiche Bits ergeben 0, verschiedene 1.', (0.3, -0.05, 0.38), size=0.048, material=lm)
label('So lässt sich jeder einzelne Block aus den übrigen berechnen.', (0.3, -0.05, 0.27), size=0.048, material=lm)
label('Vereinfacht: In echtem RAID 5 wandert der Paritätsblock je Stripe von Platte zu Platte, gerechnet wird mit ganzen Blöcken.', (0, -0.05, -0.08), size=0.045, material=lm, align='CENTER')
label('Fällt eine zweite Platte aus, fehlen zwei Unbekannte – dafür braucht es eine zweite, anders berechnete Parität wie bei RAID 6.', (0, -0.05, -0.2), size=0.045, material=lm, align='CENTER')
camera_front((0.08, 0, 0.8), 4.4, tilt=1)
lights(0.55)
