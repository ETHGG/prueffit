sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
host = mat('host', (0.1, 0.3, 0.65), rough=0.5)
sw = mat('sw', (0.8, 0.4, 0.05), rough=0.5)
srv = mat('srv', (0.25, 0.27, 0.3), metal=0.3, rough=0.4)
q = mat('q', (0.1, 0.4, 0.8), rough=0.4)
a = mat('a', (0.1, 0.5, 0.25), rough=0.4)
tl = mat('timeline', (0.55, 0.58, 0.62), rough=0.6)
cols = {'S': (-1.45, host, 'Supplicant\n(Laptop)'), 'A': (0.0, sw, 'Authenticator\n(Switch / Access Point)'), 'R': (1.45, srv, 'Authentication Server\n(RADIUS-Server)')}
TOP = 1.6
for x, m, t in cols.values():
    box('n', (1.0, 0.3, 0.32), (x, 0, TOP), m, bevel=0.015)
    label(t, (x, -0.16, TOP + 0.03), size=0.052, material=wl, align='CENTER')
    leader((x, 0, TOP - 0.17), (x, 0, -0.05), tl, r=0.007)
steps = [('S', 'A', q, '1  EAPOL: Identität, Passwort oder Zertifikat'),
         ('A', 'R', q, '2  RADIUS Access-Request (EAP weitergereicht)'),
         ('R', 'A', a, '3  Access-Accept (optional mit VLAN)'),
         ('A', 'S', a, '4  EAP-Success: Port freigeschaltet')]
for i, (f, t, m, txt) in enumerate(steps):
    z = 1.2 - i * 0.32
    xf, xt = cols[f][0], cols[t][0]
    s = 1 if xt > xf else -1
    arrow((xf + s * 0.02, -0.03, z), (xt - s * 0.02, -0.03, z), m, r=0.011, head=0.06)
    label(txt, ((xf + xt) / 2, -0.06, z + 0.05), size=0.046, material=lm, align='CENTER')
label('Bis zur Freigabe lässt der Switchport nur EAPOL durch. Bei Ablehnung (Access-Reject) bleibt er gesperrt', (0, -0.06, -0.25), size=0.048, material=lm, align='CENTER')
label('oder das Gerät landet im Gäste-VLAN. Zugangsdaten prüft nur der RADIUS-Server, nicht der Switch.', (0, -0.06, -0.37), size=0.048, material=lm, align='CENTER')
camera_front((0, 0, 0.7), 4.1, tilt=2)
lights(0.55)
