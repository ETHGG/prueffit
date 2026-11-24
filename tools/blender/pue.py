sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
it = mat('it', (0.1, 0.32, 0.65), rough=0.5)
cool = mat('cool', (0.15, 0.6, 0.75), rough=0.5)
ups = mat('ups', (0.68, 0.3, 0.02), rough=0.5)
light = mat('light', (0.85, 0.75, 0.2), rough=0.5)
S = 3.4 / 1600
x0 = -1.7
parts = [('IT-Geräte 1.000 kW', 1000, it, wl), ('Kühlung 450 kW', 450, cool, wl), ('USV-Verluste 100 kW', 100, ups, wl), ('Licht 50', 50, light, lm)]
x = x0
for t, v, m, tm in parts:
    box('p', (v * S - 0.01, 0.25, 0.4), (x + v * S / 2, 0, 1.0), m, bevel=0.008)
    if v >= 200:
        label(t, (x + v * S / 2, -0.14, 0.98), size=0.05, material=tm, align='CENTER')
    else:
        zt = 0.62 if v == 100 else 0.5
        leader((x + v * S / 2, -0.03, 0.8), (x + v * S / 2, -0.03, zt + 0.05), lm, r=0.004)
        label(t.replace('Licht 50', 'Licht 50 kW'), (x + v * S / 2 + 0.04, -0.05, zt), size=0.045, material=lm, align='RIGHT')
    x += v * S
leader((x0, -0.03, 1.28), (x0 + 1600 * S, -0.03, 1.28), lm, r=0.006)
label('Gesamtenergie des Rechenzentrums 1.600 kW', (0, -0.05, 1.36), size=0.055, material=lm, align='CENTER')
leader((x0, -0.03, 0.72), (x0 + 1000 * S, -0.03, 0.72), it, r=0.006)
label('davon IT 1.000 kW', (x0 + 500 * S, -0.05, 0.58), size=0.05, material=lm, align='CENTER')
label('PUE = Gesamtenergie ÷ Energie der IT = 1.600 kW ÷ 1.000 kW = 1,6', (0, -0.05, 0.25), size=0.065, material=lm, align='CENTER')
label('Ideal ist 1,0 (alle Energie geht in die IT). Besser werden: freie Kühlung, Warm-/Kaltgang, effiziente USV, Abwärme nutzen.', (0, -0.05, 0.05), size=0.045, material=lm, align='CENTER')
camera_front((0, 0, 0.75), 4.0, tilt=1)
lights(0.55)
