sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
rt = mat('router', (0.68, 0.3, 0.02), rough=0.5)
pk = mat('pkt', (0.1, 0.32, 0.65), rough=0.5)
tab = mat('tab', (0.95, 0.95, 0.96), rough=0.8)
hit = mat('hit', (0.55, 0.85, 0.6), rough=0.8)
part = mat('part', (0.88, 0.9, 0.93), rough=0.8)
grid = mat('grid', (0.45, 0.48, 0.52), rough=0.8)
box('pkt', (0.9, 0.15, 0.28), (-1.6, 0, 1.45), pk, bevel=0.012)
label('Paket an\n10.1.2.7', (-1.6, -0.09, 1.48), size=0.055, material=wl, align='CENTER')
arrow((-1.13, -0.02, 1.45), (-0.62, -0.02, 1.45), mat('ar', (0.3, 0.33, 0.37), rough=0.6), r=0.01, head=0.05)
box('rt', (0.7, 0.25, 0.3), (-0.25, 0, 1.45), rt, bevel=0.012)
label('Router', (-0.25, -0.14, 1.43), size=0.06, material=wl, align='CENTER')
label('sucht den Eintrag mit dem längsten passenden Präfix', (1.05, -0.06, 1.43), size=0.05, material=lm, align='CENTER')
rows = [('Ziel / Präfix', 'nächster Hop / Schnittstelle', 'passt zu 10.1.2.7?', None),
        ('0.0.0.0/0', 'Provider (Default-Route)', 'ja – 0 Bit', part),
        ('10.0.0.0/8', 'Router R2', 'ja – 8 Bit', part),
        ('10.1.0.0/16', 'Router R3', 'ja – 16 Bit', part),
        ('10.1.2.0/24', 'eth1 (direkt verbunden)', 'ja – 24 Bit → gewinnt', hit),
        ('192.168.5.0/24', 'Router R4', 'nein', None)]
TW, RH, z0 = 3.9, 0.17, 1.0
xs = [-1.35, 0.15, 1.35]
for i, (a, b, c, m) in enumerate(rows):
    z = z0 - i * RH
    box('row', (TW, 0.03, RH - 0.01), (0, 0.02, z), m or tab)
    for x, t in zip(xs, (a, b, c)):
        label(t, (x, -0.02, z - 0.022), size=0.05 if i else 0.048, material=lm, align='CENTER')
label('Je länger das Präfix, desto genauer die Route. Die Default-Route 0.0.0.0/0 passt immer, wird aber nur genommen,', (0, -0.04, -0.2), size=0.047, material=lm, align='CENTER')
label('wenn nichts Genaueres passt. Bei gleich langem Präfix entscheiden administrative Distanz und Metrik.', (0, -0.04, -0.32), size=0.047, material=lm, align='CENTER')
camera_front((0, 0, 0.65), 4.3, tilt=2)
lights(0.55)
