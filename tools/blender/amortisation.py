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
label('Amortisationszeit: Wann ist die Investition wieder drin?', (0, -0.05, 2.15), size=0.075, material=lm, align='CENTER')
x0, zero, sz = -1.6, 1.15, 0.055 / 1000 * 1.0
ys = [-12000, -8000, -4000, 0, 4000, 8000]
leader((x0 - 0.1, -0.02, zero), (x0 + 3.3, -0.02, zero), ln, r=0.006)
label('0 €', (x0 - 0.15, -0.05, zero - 0.02), size=0.042, material=lm, align='RIGHT')
for i, v in enumerate(ys):
    x = x0 + 0.15 + i * 0.55
    h = abs(v) * sz
    if h > 0:
        m = red if v < 0 else green
        box('b', (0.32, 0.15, h), (x, 0, zero + (h / 2 if v > 0 else -h / 2)), m, bevel=0.006)
        txt = ('−' if v < 0 else '+') + '{:,}'.format(abs(v)).replace(',', '.') + ' €'
        label(txt, (x, -0.05, zero + (h + 0.05 if v > 0 else -h - 0.1)), size=0.04, material=lm, align='CENTER')
    else:
        label('± 0 €', (x, -0.05, zero + 0.1), size=0.04, material=green, align='CENTER')
    label('Jahr %d' % i if i else 'Kauf', (x, -0.05, zero - 0.1 if v >= 0 else zero + 0.06), size=0.04, material=lm, align='CENTER')
label('Amortisation nach 3 Jahren', (x0 + 0.15 + 3 * 0.55, -0.05, zero + 0.7), size=0.045, material=green, align='CENTER')
leader((x0 + 0.15 + 3 * 0.55, -0.03, zero + 0.65), (x0 + 0.15 + 3 * 0.55, -0.03, zero + 0.18), green, r=0.004)
label('Server für 12.000 €, Rückfluss 4.000 € je Jahr (Einsparung + Abschreibung)', (0, -0.05, 0.3), size=0.045, material=lm, align='CENTER')
label('Amortisationszeit = Anschaffungskosten ÷ Ø Rückfluss je Jahr = 12.000 € ÷ 4.000 € = 3 Jahre (kürzer = weniger Risiko)', (0, -0.05, 0.15), size=0.043, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
