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
label('Wie ein Switch lernt und weiterleitet', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
box('sw', (2.0, 0.25, 0.4), (-0.7, 0.05, 1.45), grey, bevel=0.02)
label('Switch', (-0.7, -0.09, 1.52), size=0.06, material=wl, align='CENTER')
pcs = [('A', 'aa:aa', blue), ('B', 'bb:bb', grey), ('C', 'cc:cc', green), ('D', 'dd:dd', grey)]
for k, (n, mac, m) in enumerate(pcs):
    x = -1.45 + k * 0.5
    box('port', (0.16, 0.1, 0.1), (x, -0.1, 1.3), lm)
    label('Port %d' % (k + 1), (x, -0.16, 1.36), size=0.03, material=wl, align='CENTER')
    leader((x, -0.03, 1.25), (x, -0.03, 0.95), ln, r=0.006)
    card(x, 0.75, 0.42, 0.36, m, ['PC ' + n, mac], sizes=(0.045, 0.035))
arrow((-1.62, -0.03, 0.95), (-1.62, -0.03, 1.22), blue, r=0.008, head=0.04)
label('1 Rahmen von A an C', (-1.95, -0.05, 1.05), size=0.035, material=blue)
arrow((-0.28, -0.03, 1.22), (-0.28, -0.03, 0.95), green, r=0.008, head=0.04)
label('3 nur an Port 3', (-0.22, -0.05, 1.05), size=0.035, material=green)
box('tab', (1.1, 0.2, 0.95), (1.25, 0, 1.2), lm, bevel=0.01)
label('MAC-Tabelle', (1.25, -0.11, 1.55), size=0.05, material=wl, align='CENTER')
for k, (mac, port) in enumerate([('aa:aa …', '1  ← 2 gelernt'), ('cc:cc …', '3'), ('dd:dd …', '4')]):
    label(mac, (0.8, -0.11, 1.38 - k * 0.15), size=0.04, material=wl)
    label('Port ' + port, (1.28, -0.11, 1.38 - k * 0.15), size=0.04, material=wl)
rules = ['2 Lernen: Quell-MAC + Eingangsport in die Tabelle (Einträge altern, typisch nach 5 Minuten)',
         '3 Ziel-MAC bekannt → Rahmen nur an diesen Port (Unicast)',
         'Ziel-MAC unbekannt oder Broadcast → an alle Ports außer dem Eingangsport (Fluten), nur im selben VLAN']
for k, t in enumerate(rules):
    label(t, (-2.05, -0.05, 0.38 - k * 0.12), size=0.04, material=lm)
camera_front((0, 0, 1.05), 4.4, tilt=1)
lights(0.55)
