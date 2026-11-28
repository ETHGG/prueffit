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
label('Wichtige Ports und ihre Dienste', (0, -0.05, 2.25), size=0.075, material=lm, align='CENTER')
P = [('22', 'SSH', 'TCP', green), ('53', 'DNS', 'UDP, TCP', blue), ('67/68', 'DHCP', 'UDP', blue), ('80', 'HTTP', 'TCP', orange),
     ('123', 'NTP', 'UDP', blue), ('161/162', 'SNMP', 'UDP', blue), ('443', 'HTTPS', 'TCP; HTTP/3: UDP', green), ('587', 'SMTP-Submission', 'TCP', orange),
     ('993', 'IMAPS', 'TCP', green), ('995', 'POP3S', 'TCP', green), ('3389', 'RDP', 'TCP, TLS', green), ('25', 'SMTP', 'TCP', orange)]
xs = [-1.5, -0.5, 0.5, 1.5]; zs = [1.8, 1.3, 0.8]
for k, (p, d, t, m) in enumerate(P):
    card(xs[k % 4], zs[k // 4], 0.9, 0.4, m, ['Port ' + p, d + ' · ' + t], sizes=(0.062, 0.05))
label('grün: verschlüsselt · orange: unverschlüsselt bzw. erst durch TLS-Erweiterung geschützt · blau: Infrastrukturdienst', (0, -0.05, 0.38), size=0.058, material=lm, align='CENTER')
label('Ports sind Standardwerte – ein Dienst kann auch auf einem anderen Port betrieben werden.', (0, -0.05, 0.25), size=0.058, material=lm, align='CENTER')
camera_front((0, 0, 1.2), 4.5, tilt=1)
lights(0.55)
