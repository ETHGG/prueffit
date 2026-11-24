sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
pc = mat('pc', (0.12, 0.3, 0.62), rough=0.5)
rt = mat('router', (0.8, 0.3, 0.1), rough=0.5)
srv = mat('srv', (0.25, 0.27, 0.3), metal=0.3, rough=0.4)
lan = mat('lan', (0.62, 0.78, 0.66), rough=0.9)
wan = mat('wan', (0.66, 0.74, 0.86), rough=0.9)
line = mat('line', (0.25, 0.27, 0.3), rough=0.6)
tab = mat('tab', (0.97, 0.97, 0.97), rough=0.8)
grid = mat('grid', (0.45, 0.48, 0.52), rough=0.8)
box('lanzone', (1.45, 0.05, 1.3), (-1.45, 0.4, 0.95), lan)
box('wanzone', (1.45, 0.05, 1.3), (1.45, 0.4, 0.95), wan)
label('privates LAN 192.168.1.0/24', (-1.45, -0.05, 1.66), size=0.055, material=lm, align='CENTER')
label('Internet', (1.45, -0.05, 1.66), size=0.055, material=lm, align='CENTER')
for i, ip in enumerate(['192.168.1.10', '192.168.1.11', '192.168.1.12']):
    z = 1.35 - i * 0.38
    box('pc', (0.26, 0.12, 0.2), (-1.85, 0, z), pc, bevel=0.008)
    label(ip, (-1.85, -0.07, z - 0.19), size=0.048, material=lm, align='CENTER')
    leader((-1.72, -0.02, z), (-0.17, -0.02, 0.97), line, r=0.008)
box('router', (0.34, 0.2, 0.3), (0, 0, 0.97), rt, bevel=0.01)
label('Router\n(NAT)', (0, -0.11, 1.0), size=0.05, material=wl, align='CENTER')
label('innen 192.168.1.1', (-0.02, -0.07, 0.66), size=0.042, material=lm, align='CENTER')
label('außen 203.0.113.5', (-0.02, -0.07, 0.57), size=0.042, material=lm, align='CENTER')
leader((0.17, -0.02, 0.97), (1.6, -0.02, 0.97), line, r=0.008)
box('web', (0.24, 0.16, 0.34), (1.8, 0, 0.97), srv, bevel=0.008)
label('Webserver\n198.51.100.20:443', (1.8, -0.07, 0.6), size=0.045, material=lm, align='CENTER')
# NAT table
rows = [('innen (privat)', 'außen (öffentlich)'), ('192.168.1.10:51000', '203.0.113.5:40001'),
        ('192.168.1.11:51000', '203.0.113.5:40002'), ('192.168.1.12:49152', '203.0.113.5:40003')]
TW, RH = 2.2, 0.15
box('table', (TW, 0.04, RH * 4), (0, 0, -0.08), tab)
for i, (a, b) in enumerate(rows):
    z = -0.08 + RH * 1.5 - i * RH
    label(a, (-TW / 4, -0.03, z - 0.022), size=0.05, material=lm, align='CENTER')
    label(b, (TW / 4, -0.03, z - 0.022), size=0.05, material=lm, align='CENTER')
    if i < 3:
        leader((-TW / 2, -0.025, z - RH / 2), (TW / 2, -0.025, z - RH / 2), grid, r=0.003)
leader((0, -0.025, -0.08 - 2 * RH), (0, -0.025, -0.08 + 2 * RH), grid, r=0.003)
label('NAT-Tabelle des Routers (PAT): Unterscheidung über die Portnummer', (0, -0.05, 0.27), size=0.05, material=lm, align='CENTER')
label('Antworten an 203.0.113.5:40002 leitet der Router an 192.168.1.11:51000 weiter.', (0, -0.05, -0.55), size=0.05, material=lm, align='CENTER')
camera_front((0, 0, 0.6), 4.3, tilt=2)
lights(0.55)
