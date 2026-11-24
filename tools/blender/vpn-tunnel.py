sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
gw = mat('gw', (0.8, 0.25, 0.2), rough=0.5)
pc = mat('pc', (0.25, 0.45, 0.75), rough=0.5)
srv = mat('srv', (0.3, 0.33, 0.37), metal=0.4, rough=0.4)
net = mat('net', (0.7, 0.78, 0.88), rough=0.6)
tun = mat('tunnel', (0.15, 0.6, 0.3), rough=0.4)
line = mat('line', (0.2, 0.22, 0.25), rough=0.6)
zone = mat('zone', (0.62, 0.7, 0.82), rough=0.9)
# internet in the middle
cyl('internet', 0.78, 0.1, (0, 0.25, 0.35), net, rot=(math.radians(90), 0, 0))
label('Internet', (0, -0.05, 0.33), size=0.075, material=lm, align='CENTER')


def site(x, z, title, n_pc=2, server=True):
    box('zone', (0.95, 0.05, 0.55), (x, 0.4, z), zone)
    s = 1 if x > 0 else -1
    label(title, (x, -0.06, z + 0.31), size=0.06, material=lm, align='CENTER')
    for i in range(n_pc):
        box('pc', (0.14, 0.1, 0.12), (x + s * (0.1 + i * 0.2), 0, z - 0.12), pc, bevel=0.008)
    if server:
        box('srv', (0.16, 0.12, 0.26), (x + s * 0.2, 0, z + 0.08), srv, bevel=0.008)


# top: site-to-site
site(-1.65, 0.95, 'Standort A (LAN)')
site(1.65, 0.95, 'Standort B (LAN)')
for x in (-1.25, 1.25):
    box('gw', (0.16, 0.18, 0.22), (x, 0, 0.95), gw, bevel=0.01)
label('VPN-Gateway', (-1.25, -0.06, 0.65), size=0.045, material=lm, align='CENTER')
label('VPN-Gateway', (1.25, -0.06, 0.65), size=0.045, material=lm, align='CENTER')
o = cyl('tun1', 0.05, 2.34, (0, -0.02, 0.95), tun, rot=(0, math.radians(90), 0))
label('Site-to-Site: ganze Netze dauerhaft verbunden', (0, -0.1, 1.05), size=0.055, material=lm, align='CENTER')
# bottom: client-to-site
box('home', (0.7, 0.05, 0.5), (-1.65, 0.4, -0.3), zone)
label('Homeoffice', (-1.65, -0.06, -0.02), size=0.06, material=lm, align='CENTER')
box('laptop', (0.36, 0.2, 0.025), (-1.65, -0.02, -0.42), srv)
box('screen', (0.34, 0.02, 0.22), (-1.65, 0.08, -0.3), pc, bevel=0.006)
label('Laptop mit\nVPN-Client', (-1.65, -0.08, -0.66), size=0.045, material=lm, align='CENTER')
site(1.65, -0.3, 'Zentrale (LAN)')
box('gw', (0.16, 0.18, 0.22), (1.25, 0, -0.3), gw, bevel=0.01)
label('VPN-Gateway', (1.25, -0.06, -0.6), size=0.045, material=lm, align='CENTER')
cyl('tun2', 0.05, 2.62, (-0.15, -0.02, -0.3), tun, rot=(0, math.radians(90), 0))
label('Client-to-Site: einzelnes Gerät bei Bedarf', (0, -0.1, -0.2), size=0.055, material=lm, align='CENTER')
label('Grün = verschlüsselter Tunnel durch das Internet (z. B. IPsec, WireGuard, OpenVPN/SSL-VPN)', (0, -0.1, -0.9), size=0.05, material=lm, align='CENTER')
camera_front((0.0, 0, 0.25), 4.4, tilt=3)
lights(0.55)
