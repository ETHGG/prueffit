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
label('Mangelhafte Lieferung: Rechte des Käufers der Reihe nach', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
card(-1.55, 1.7, 1.1, 0.5, grey, ['1 Prüfen und rügen', 'unter Kaufleuten unverzüglich', '(§ 377 HGB)'])
card(0, 1.7, 1.25, 0.5, blue, ['2 Nacherfüllung', 'Nachbesserung oder', 'Ersatzlieferung (Wahl Käufer)'])
card(1.55, 1.7, 1.1, 0.5, red, ['scheitert oder', 'verweigert, Frist', 'abgelaufen'])
arrow((-0.98, -0.03, 1.7), (-0.65, -0.03, 1.7), ln, r=0.01, head=0.05)
arrow((0.65, -0.03, 1.7), (0.98, -0.03, 1.7), ln, r=0.01, head=0.05)
label('3 danach wahlweise', (0, -0.05, 1.27), size=0.062, material=lm, align='CENTER')
arrow((1.55, -0.03, 1.42), (1.55, -0.03, 1.3), ln, r=0.008, head=0.04)
leader((-1.4, -0.02, 1.2), (1.55, -0.02, 1.2), ln, r=0.006)
for x in [-1.4, 0, 1.4]:
    arrow((x, -0.03, 1.2), (x, -0.03, 1.07), ln, r=0.008, head=0.04)
card(-1.4, 0.82, 1.2, 0.46, orange, ['Rücktritt', 'Geld zurück, Ware zurück', 'nicht bei unerheblichem Mangel'])
card(0, 0.82, 1.2, 0.46, orange, ['Minderung', 'Kaufpreis wird', 'angemessen herabgesetzt'])
card(1.4, 0.82, 1.2, 0.46, green, ['zusätzlich Schadensersatz', 'wenn der Verkäufer den', 'Mangel zu vertreten hat'])
t = ['Gewährleistung: 2 Jahre ab Lieferung; beim Verbraucher wird 1 Jahr lang vermutet, dass der Mangel schon da war.',
     'Garantie ist eine freiwillige Zusage des Herstellers oder Händlers – zusätzlich zur gesetzlichen Gewährleistung.']
for i, s in enumerate(t):
    label(s, (0, -0.05, 0.3 - i * 0.14), size=0.054, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.6, tilt=1)
lights(0.55)
