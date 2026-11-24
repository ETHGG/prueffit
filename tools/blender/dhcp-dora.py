sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
host = mat('host', (0.1, 0.3, 0.65), rough=0.5)
srv = mat('srv', (0.25, 0.27, 0.3), metal=0.3, rough=0.4)
bc = mat('bc', (0.85, 0.45, 0.05), rough=0.4)
sv_m = mat('sv', (0.1, 0.5, 0.25), rough=0.4)
tl = mat('timeline', (0.55, 0.58, 0.62), rough=0.6)
XC, XS, TOP = -1.0, 1.0, 1.6
for x, m, t in [(XC, host, 'Client\n(noch ohne IP-Adresse)'), (XS, srv, 'DHCP-Server\n192.168.1.1')]:
    box('n', (0.9, 0.3, 0.32), (x, 0, TOP), m, bevel=0.015)
    label(t, (x, -0.16, TOP + 0.03), size=0.055, material=wl, align='CENTER')
    leader((x, 0, TOP - 0.17), (x, 0, -0.05), tl, r=0.007)
steps = [(XC, XS, bc, 'D  Discover', 'Broadcast: 0.0.0.0:68 → 255.255.255.255:67'),
         (XS, XC, sv_m, 'O  Offer', 'Angebot: 192.168.1.50, Maske, Gateway, DNS, Lease'),
         (XC, XS, bc, 'R  Request', 'Broadcast: „Ich nehme 192.168.1.50 von 192.168.1.1“'),
         (XS, XC, sv_m, 'A  Acknowledge', 'Bestätigung – Client nutzt die Adresse bis Lease-Ende')]
for i, (a, b, m, t1, t2) in enumerate(steps):
    z = 1.2 - i * 0.36
    s = 1 if b > a else -1
    arrow((a + s * 0.02, -0.03, z), (b - s * 0.02, -0.03, z), m, r=0.011, head=0.06)
    label(t1, (0, -0.06, z + 0.11), size=0.062, material=lm, align='CENTER')
    label(t2, (0, -0.06, z + 0.04), size=0.045, material=lm, align='CENTER')
box('k1', (0.14, 0.04, 0.04), (-1.15, -0.03, -0.27), bc)
label('vom Client per Broadcast', (-1.03, -0.05, -0.29), size=0.048, material=lm)
box('k2', (0.14, 0.04, 0.04), (0.35, -0.03, -0.27), sv_m)
label('vom Server (Unicast oder Broadcast)', (0.47, -0.05, -0.29), size=0.048, material=lm)
label('Request per Broadcast, damit auch andere DHCP-Server erfahren, dass ihr Angebot abgelehnt ist. UDP-Ports: Server 67, Client 68.', (0, -0.05, -0.45), size=0.043, material=lm, align='CENTER')
camera_front((0, 0, 0.66), 3.9, tilt=2)
lights(0.55)
