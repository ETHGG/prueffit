sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
one = mat('one', (0.1, 0.32, 0.65), rough=0.5)
zero = mat('zero', (0.42, 0.45, 0.5), rough=0.6)
hx = mat('hex', (0.68, 0.3, 0.02), rough=0.5)
bits = [1, 0, 1, 1, 0, 1, 1, 0]
vals = [128, 64, 32, 16, 8, 4, 2, 1]
W, G = 0.38, 0.05
x0 = -(8 * W + 7 * G + 0.15) / 2 + W / 2
xs = []
for i, (b, v) in enumerate(zip(bits, vals)):
    x = x0 + i * (W + G) + (0.15 if i >= 4 else 0)
    xs.append(x)
    box('bit', (W, 0.2, 0.38), (x, 0, 0.9), one if b else zero, bevel=0.012)
    label(str(b), (x, -0.11, 0.85), size=0.13, material=wl, align='CENTER')
    label(str(v), (x, -0.06, 1.18), size=0.06, material=lm, align='CENTER')
    label(f'2^{7 - i}', (x, -0.06, 1.32), size=0.045, material=lm, align='CENTER')
    if b:
        label(str(v), (x, -0.06, 0.52), size=0.06, material=mat('blue', (0.03, 0.2, 0.5), rough=1.0), align='CENTER')
label('Stellenwert', (x0 - 0.3, -0.06, 1.18), size=0.045, material=lm, align='RIGHT')
label('Dezimal:  128 + 32 + 16 + 4 + 2 = 182', (0, -0.06, 0.32), size=0.07, material=lm, align='CENTER')
for k, (a, b, t) in enumerate([(0, 3, 'B (11)'), (4, 7, '6')]):
    xa, xb = xs[a] - W / 2, xs[b] + W / 2
    leader((xa, -0.05, 0.12), (xb, -0.05, 0.12), hx, r=0.01)
    leader((xa, -0.05, 0.12), (xa, -0.05, 0.2), hx, r=0.01)
    leader((xb, -0.05, 0.12), (xb, -0.05, 0.2), hx, r=0.01)
    label(t, ((xa + xb) / 2, -0.06, -0.08), size=0.09, material=mat('htxt', (0.5, 0.2, 0.02), rough=1.0), align='CENTER')
label('Hexadezimal: je 4 Bit = 1 Ziffer → B6  (11 · 16 + 6 = 182)', (0, -0.06, -0.35), size=0.065, material=lm, align='CENTER')
camera_front((0, 0, 0.5), 4.2, tilt=1)
lights(0.55)
