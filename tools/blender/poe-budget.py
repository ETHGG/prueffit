sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
sw = mat('sw', (0.22, 0.24, 0.28), metal=0.3, rough=0.4)
ap = mat('ap', (0.1, 0.32, 0.65), rough=0.5)
cam = mat('cam', (0.04, 0.36, 0.18), rough=0.5)
free = mat('free', (0.72, 0.75, 0.8), rough=0.8)
bad = mat('bad', (0.75, 0.15, 0.12), rough=0.5)
box('sw', (3.6, 0.3, 0.3), (0, 0, 1.45), sw, bevel=0.012)
label('PoE-Switch, Budget 240 W', (0, -0.16, 1.42), size=0.07, material=wl, align='CENTER')
S = 3.6 / 240
x = -1.8
for i in range(4):
    box('a', (30 * S - 0.01, 0.2, 0.3), (x + 15 * S, 0, 0.9), ap, bevel=0.006)
    label('AP\n30 W', (x + 15 * S, -0.11, 0.93), size=0.045, material=wl, align='CENTER')
    x += 30 * S
for i in range(6):
    box('c', (15.4 * S - 0.01, 0.2, 0.3), (x + 7.7 * S, 0, 0.9), cam, bevel=0.006)
    label('Kam.\n15,4', (x + 7.7 * S, -0.11, 0.93), size=0.04, material=wl, align='CENTER')
    x += 15.4 * S
rest = 240 - 212.4
box('f', (rest * S - 0.01, 0.2, 0.3), (x + rest * S / 2, 0, 0.9), free)
label('frei\n27,6', (x + rest * S / 2, -0.11, 0.93), size=0.04, material=lm, align='CENTER')
label('4 Access Points PoE+ (802.3at): 4 × 30 W = 120 W', (-1.8, -0.05, 0.5), size=0.05, material=lm)
label('6 Kameras PoE (802.3af): 6 × 15,4 W = 92,4 W', (-1.8, -0.05, 0.37), size=0.05, material=lm)
label('Summe 212,4 W → frei 27,6 W', (-1.8, -0.05, 0.24), size=0.055, material=lm)
box('ap5', (30 * S, 0.2, 0.3), (1.2, 0, 0.35), bad, bevel=0.006)
label('5. AP\n30 W', (1.2, -0.11, 0.38), size=0.045, material=wl, align='CENTER')
label('passt nicht', (1.65, -0.05, 0.32), size=0.05, material=mat('btxt', (0.55, 0.08, 0.06), rough=1.0))
label('Gerechnet wird mit der Leistung am Switchport (30 W bzw. 15,4 W), nicht mit der am Gerät (25,5 W bzw. 12,95 W),', (0, -0.05, -0.05), size=0.046, material=lm, align='CENTER')
label('weil viele Switches je Port nach Klasse reservieren. Manche Switches teilen dynamisch nach tatsächlichem Verbrauch zu.', (0, -0.05, -0.17), size=0.046, material=lm, align='CENTER')
camera_front((0, 0, 0.65), 4.2, tilt=1)
lights(0.55)
