sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
cs = [mat('a', (0.1, 0.32, 0.65), rough=0.5), mat('b', (0.04, 0.36, 0.18), rough=0.5), mat('c', (0.68, 0.3, 0.02), rough=0.5), mat('d', (0.45, 0.3, 0.7), rough=0.5), mat('e', (0.35, 0.38, 0.43), rough=0.5)]
rows = [('10.0.0.0/8', '10.0.0.0 – 10.255.255.255', 'privat (RFC 1918), große Netze', 0),
        ('172.16.0.0/12', '172.16.0.0 – 172.31.255.255', 'privat (RFC 1918)', 1),
        ('192.168.0.0/16', '192.168.0.0 – 192.168.255.255', 'privat (RFC 1918), Heim- und Büronetze', 2),
        ('169.254.0.0/16', '169.254.0.1 – 169.254.255.254', 'APIPA / Link-Local: kein DHCP erreicht', 3),
        ('127.0.0.0/8', '127.0.0.1 = localhost', 'Loopback: eigener Rechner', 4)]
label('Besondere IPv4-Bereiche', (0, -0.05, 1.85), size=0.08, material=lm, align='CENTER')
for i, (p, rng, t, k) in enumerate(rows):
    z = 1.5 - i * 0.34
    box('p', (1.05, 0.2, 0.28), (-1.6, 0, z), cs[k], bevel=0.01)
    label(p, (-1.6, -0.11, z - 0.025), size=0.055, material=wl, align='CENTER')
    label(rng, (-0.95, -0.05, z - 0.025), size=0.05, material=lm)
    label(t, (0.55, -0.05, z - 0.025), size=0.05, material=lm)
label('Private Adressen werden im Internet nicht geroutet – der Router übersetzt sie per NAT in eine öffentliche Adresse.', (0, -0.05, -0.25), size=0.046, material=lm, align='CENTER')
label('Zum Testen und für Beispiele gibt es Dokumentationsbereiche: 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24.', (0, -0.05, -0.37), size=0.046, material=lm, align='CENTER')
camera_front((0, 0, 0.75), 4.3, tilt=1)
lights(0.55)
