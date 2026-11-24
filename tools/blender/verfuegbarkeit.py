sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
dev = mat('dev', (0.1, 0.32, 0.65), rough=0.5)
srv = mat('srv', (0.25, 0.27, 0.3), metal=0.3, rough=0.4)
res = mat('res', (0.04, 0.36, 0.18), rough=0.5)
line = mat('line', (0.3, 0.33, 0.37), rough=0.6)


def node(x, z, m, t, w=0.62):
    box('n', (w, 0.2, 0.32), (x, 0, z), m, bevel=0.012)
    label(t, (x, -0.11, z + 0.02), size=0.055, material=wl, align='CENTER')


label('Reihe: alle Glieder nötig – Verfügbarkeiten multiplizieren', (0, -0.05, 1.85), size=0.065, material=lm, align='CENTER')
for x, t, m in [(-1.5, 'Router\n99,9 %', dev), (-0.5, 'Firewall\n99,9 %', dev), (0.5, 'Server\n99 %', srv)]:
    node(x, 1.4, m, t)
for a, b in [(-1.19, -0.81), (-0.19, 0.19)]:
    pass
label('=', (1.0, -0.05, 1.36), size=0.1, material=lm, align='CENTER')
for a, b in [(-1.19, -0.81), (-0.19, 0.19)]:
    leader((a, -0.02, 1.4), (b, -0.02, 1.4), line, r=0.012)
node(1.55, 1.4, res, 'gesamt\n98,80 %', w=0.7)
label('0,999 × 0,999 × 0,99 = 0,9880 → schlechter als jedes einzelne Glied', (0, -0.05, 1.0), size=0.05, material=lm, align='CENTER')
label('Parallel: eins reicht – 1 − (1 − A1) × (1 − A2)', (0, -0.05, 0.6), size=0.065, material=lm, align='CENTER')
node(-0.3, 0.2, srv, 'Server 1\n99 %')
node(-0.3, -0.25, srv, 'Server 2\n99 %')
leader((-1.2, -0.02, -0.02), (-0.9, -0.02, -0.02), line, r=0.012)
for z in (0.2, -0.25):
    leader((-0.9, -0.02, -0.02), (-0.61, -0.02, z), line, r=0.012)
    leader((0.01, -0.02, z), (0.3, -0.02, -0.02), line, r=0.012)
label('=', (0.45, -0.05, -0.06), size=0.1, material=lm, align='CENTER')
node(-1.5, -0.02, dev, 'Clients', w=0.55)
node(0.95, -0.02, res, 'gesamt\n99,99 %', w=0.7)
label('1 − 0,01 × 0,01 = 0,9999', (0.95, -0.05, -0.36), size=0.05, material=lm, align='CENTER')
label('Ausfallzeit pro Jahr = (1 − Verfügbarkeit) × 8.760 h:  98,80 % → ca. 105 h,  99,99 % → ca. 53 min', (0, -0.05, -0.7), size=0.05, material=lm, align='CENTER')
camera_front((0, 0, 0.6), 4.3, tilt=2)
lights(0.55)
