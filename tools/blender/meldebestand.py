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
label('Bestellpunktverfahren: Meldebestand und Mindestbestand', (0, -0.05, 2.15), size=0.075, material=lm, align='CENTER')
x0, z0, sx, sz = -1.9, 0.45, 3.7 / 30, 1.4 / 200
leader((x0, -0.02, z0), (x0 + 3.8, -0.02, z0), ln, r=0.005)
leader((x0, -0.02, z0), (x0, -0.02, z0 + 1.5), ln, r=0.005)
label('Tage', (x0 + 3.7, -0.05, z0 - 0.12), size=0.045, material=lm)
label('Bestand (Stück)', (x0, -0.05, z0 + 1.55), size=0.045, material=lm)
pts = []
stock = 190
for d in range(31):
    if d in (16, 31):
        pts.append((x0 + d * sx, -0.03, z0 + stock * sz)); stock += 150
    pts.append((x0 + d * sx + (0.002 if d in (16,) else 0), -0.03, z0 + stock * sz))
    stock -= 10
for a, b in zip(pts, pts[1:]):
    leader(a, b, blue, r=0.012)
for val, name, m in [(80, 'Meldebestand 80 = 10 Stück/Tag × 5 Tage + 30', orange), (30, 'Mindestbestand 30 (Puffer)', red)]:
    z = z0 + val * sz
    leader((x0, -0.025, z), (x0 + 3.8, -0.025, z), m, r=0.006)
    label(name, (x0 + 2.35, -0.05, z + 0.05), size=0.042, material=m)
label('bestellen', (x0 + 11 * sx, -0.05, z0 + 80 * sz + 0.2), size=0.04, material=orange, align='CENTER')
leader((x0 + 11 * sx, -0.03, z0 + 100 * sz), (x0 + 16 * sx, -0.03, z0 + 100 * sz), ln, r=0.004)
label('5 Tage Lieferzeit', (x0 + 13.5 * sx, -0.05, z0 + 106 * sz), size=0.038, material=lm, align='CENTER')
label('Lieferung', (x0 + 16 * sx, -0.05, z0 + 192 * sz), size=0.04, material=green, align='CENTER')
label('Meldebestand = Tagesverbrauch × Lieferzeit + Mindestbestand. Wird er erreicht, wird bestellt; die Ware kommt, bevor der Puffer angegriffen wird.', (0, -0.05, 0.12), size=0.043, material=lm, align='CENTER')
camera_front((0, 0, 1.12), 4.4, tilt=1)
lights(0.55)
