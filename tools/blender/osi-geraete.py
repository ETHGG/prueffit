sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
cols = [mat('l1', (0.3, 0.33, 0.37), rough=0.5), mat('l2', (0.1, 0.32, 0.65), rough=0.5), mat('l3', (0.04, 0.36, 0.18), rough=0.5), mat('l7', (0.68, 0.3, 0.02), rough=0.5)]
rows = [('Schicht 5–7\nAnwendung', 'Proxy, Load Balancer, NGFW', 'Inhalte, URLs, Anwendungen'),
        ('Schicht 3/4\nVermittlung, Transport', 'Router, Layer-3-Switch, Paketfilter', 'IP-Adressen, Ports'),
        ('Schicht 2\nSicherung', 'Switch, Bridge, Access Point', 'MAC-Adressen'),
        ('Schicht 1\nBitübertragung', 'Hub, Repeater, Medienkonverter', 'nur Signale, keine Adressen')]
for i, (layer, dev, crit) in enumerate(rows):
    z = 1.45 - i * 0.45
    m = cols[3 - i]
    box('l', (0.95, 0.2, 0.38), (-1.55, 0, z), m, bevel=0.01)
    label(layer, (-1.55, -0.11, z + 0.03), size=0.048, material=wl, align='CENTER')
    box('d', (1.45, 0.2, 0.38), (-0.25, 0, z), m, bevel=0.01)
    label(dev, (-0.25, -0.11, z - 0.025), size=0.05, material=wl, align='CENTER')
    label(crit, (1.05, -0.05, z - 0.025), size=0.05, material=lm)
label('Gerät', (-0.25, -0.05, 1.75), size=0.06, material=lm, align='CENTER')
label('entscheidet anhand von', (1.05, -0.05, 1.75), size=0.06, material=lm)
label('Einordnung nach der höchsten Schicht, die das Gerät auswertet. Ein klassischer Switch arbeitet auf Schicht 2,', (0, -0.05, -0.3), size=0.046, material=lm, align='CENTER')
label('ein Layer-3-Switch kann zusätzlich routen; ein WLAN-Router für zu Hause vereint Router, Switch und Access Point.', (0, -0.05, -0.42), size=0.046, material=lm, align='CENTER')
camera_front((0, 0, 0.7), 4.4, tilt=1)
lights(0.55)
