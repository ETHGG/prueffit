sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
rbw = mat('rbw', (0.1, 0.32, 0.65), rough=0.5)
afa = mat('afa', (0.68, 0.3, 0.02), rough=0.5)
ax = mat('axis', (0.2, 0.22, 0.25), rough=0.6)
S = 1.5 / 3600
X0, Z0 = -1.5, 0.0
arrow((X0 - 0.2, -0.02, Z0), (X0 + 3.2, -0.02, Z0), ax, r=0.008, head=0.05)
data = [('Anschaffung', 3600, 0), ('Ende Jahr 1', 2400, 1200), ('Ende Jahr 2', 1200, 1200), ('Ende Jahr 3', 0, 1200)]
for i, (t, r, a) in enumerate(data):
    x = X0 + 0.25 + i * 0.8
    if r:
        box('r', (0.5, 0.25, r * S), (x, 0, Z0 + r * S / 2), rbw, bevel=0.008)
        label(f'{r:,} €'.replace(',', '.'), (x, -0.14, Z0 + r * S / 2 - 0.03), size=0.06, material=wl, align='CENTER')
    if a:
        box('a', (0.5, 0.25, a * S), (x, 0, Z0 + r * S + a * S / 2), afa, bevel=0.008)
        label('− 1.200 €', (x, -0.14, Z0 + r * S + a * S / 2 - 0.03), size=0.055, material=wl, align='CENTER')
    label(t, (x, -0.05, Z0 - 0.14), size=0.05, material=lm, align='CENTER')
label('Restbuchwert', (1.7, -0.05, 1.35), size=0.055, material=lm)
box('k1', (0.12, 0.05, 0.08), (1.6, -0.02, 1.37), rbw)
label('Abschreibung (AfA)', (1.7, -0.05, 1.2), size=0.055, material=lm)
box('k2', (0.12, 0.05, 0.08), (1.6, -0.02, 1.22), afa)
label('Server, Anschaffungskosten 3.600 €, Nutzungsdauer 3 Jahre:', (0, -0.05, 1.75), size=0.065, material=lm, align='CENTER')
label('jährliche AfA = 3.600 € ÷ 3 = 1.200 €', (0, -0.05, 1.6), size=0.065, material=lm, align='CENTER')
label('Im Anschaffungsjahr zeitanteilig (monatsgenau); Computerhardware steuerlich auch über 1 Jahr möglich.', (0.3, -0.05, -0.4), size=0.05, material=lm, align='CENTER')
camera_front((0.4, 0, 0.7), 4.4, tilt=1)
lights(0.55)
