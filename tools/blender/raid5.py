sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
case = mat('case', (0.55, 0.58, 0.62), metal=0.6, rough=0.35)
data = [mat('d1', (0.2, 0.45, 0.85), rough=0.5), mat('d2', (0.2, 0.62, 0.45), rough=0.5), mat('d3', (0.55, 0.35, 0.8), rough=0.5), mat('d4', (0.25, 0.65, 0.75), rough=0.5)]
par = mat('parity', (0.95, 0.42, 0.05), rough=0.45)
# rows: stripe A..D; parity position rotates (left-symmetric-like for illustration)
rows = [['A1', 'A2', 'A3', 'Ap'], ['B1', 'B2', 'Bp', 'B3'], ['C1', 'Cp', 'C2', 'C3'], ['Dp', 'D1', 'D2', 'D3']]
for d in range(4):
    x = (d - 1.5) * 0.42
    box(f'disk{d}', (0.34, 0.24, 0.06), (x, 0, -0.06), case, bevel=0.01)
    label(f'Platte {d + 1}', (x - 0.1, -0.13, -0.17), size=0.05, material=lm)
    for r, row in enumerate(rows):
        z = 0.06 + (3 - r) * 0.13
        name = row[d]
        is_p = name.endswith('p')
        box(f'blk{d}{r}', (0.3, 0.2, 0.11), (x, 0, z), par if is_p else data['ABCD'.index(name[0])], bevel=0.008)
        label(name, (x - 0.045 if not is_p else x - 0.05, -0.11, z - 0.025), size=0.06, material=mat('white', (1, 1, 1), emit=1.0))
label('RAID 5: Daten (blau/grün/violett/türkis) und Parität (orange) über alle Platten verteilt', (-0.88, 0, 0.67), size=0.04, material=lm)
label('Nutzkapazität = (n − 1) × Plattengröße, hier 3 von 4 Platten · 1 Platte darf ausfallen', (-0.88, 0, -0.29), size=0.04, material=lm)
camera((0.0, -2.35, 0.55), (0.0, 0, 0.2), lens=45)
lights(0.9)
