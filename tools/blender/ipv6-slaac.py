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
label('IPv6: Adresse automatisch beziehen (SLAAC)', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
card(-1.55, 1.85, 0.9, 0.3, blue, ['Host'], sizes=(0.07, 0.05))
card(1.55, 1.85, 0.9, 0.3, green, ['Router'], sizes=(0.07, 0.05))
box('l1', (0.02, 0.02, 1.55), (-1.55, 0.05, 0.92), ln)
box('l2', (0.02, 0.02, 1.55), (1.55, 0.05, 0.92), ln)
def step(z, n, txt, sub=None):
    label(n, (-2.0, -0.05, z - 0.02), size=0.07, material=orange, align='CENTER')
    label(txt, (-1.45, -0.05, z + 0.03), size=0.055, material=lm)
    if sub:
        label(sub, (-1.45, -0.05, z - 0.07), size=0.05, material=lm)
step(1.62, '1', 'Link-Local-Adresse bilden: fe80::/64 + eigene Interface-ID')
step(1.4, '2', 'Duplikatprüfung (DAD): Neighbor Solicitation an die Multicast-Gruppe', 'keine Antwort = Adresse ist frei')
arrow((-1.5, -0.03, 1.08), (1.5, -0.03, 1.08), blue, r=0.01, head=0.06)
label('3  Router Solicitation an ff02::2 (alle Router)', (0, -0.05, 1.13), size=0.055, material=blue, align='CENTER')
arrow((1.5, -0.03, 0.82), (-1.5, -0.03, 0.82), green, r=0.01, head=0.06)
label('4  Router Advertisement: Präfix 2001:db8:1:1::/64, Router als Gateway', (0, -0.05, 0.87), size=0.055, material=green, align='CENTER')
label('oft auch DNS-Server (RDNSS) und die Flags M/O', (0, -0.05, 0.71), size=0.05, material=green, align='CENTER')
step(0.45, '5', 'Globale Adresse: Präfix + Interface-ID (zufällig oder EUI-64), wieder DAD', 'Beispiel: 2001:db8:1:1:3c4d:5e6f:7a8b:9c0d/64')
t = ['Kein DHCP-Server nötig; der Router schickt Router Advertisements auch regelmäßig von sich aus.',
     'Flag M = Adressen per DHCPv6 (zustandsbehaftet); Flag O = nur weitere Angaben per DHCPv6 (zustandslos).']
for i, s in enumerate(t):
    label(s, (0, -0.05, 0.02 - i * 0.13), size=0.052, material=lm, align='CENTER')
camera_front((0, 0, 1.0), 4.6, tilt=1)
lights(0.55)
