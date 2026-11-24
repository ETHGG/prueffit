sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
f = [mat('mac', (0.1, 0.32, 0.65), rough=0.5), mat('tag', (0.68, 0.3, 0.02), rough=0.5), mat('type', (0.35, 0.38, 0.43), rough=0.5), mat('data', (0.04, 0.36, 0.18), rough=0.5), mat('fcs', (0.45, 0.3, 0.7), rough=0.5)]


def frame(z, fields, title):
    label(title, (-2.05, -0.05, z + 0.22), size=0.055, material=lm)
    x = -2.05
    for name, w, k, sub in fields:
        box('f', (w - 0.015, 0.2, 0.3), (x + w / 2, 0, z), f[k], bevel=0.008)
        label(name, (x + w / 2, -0.11, z + (0.01 if sub else -0.025)), size=0.048, material=wl, align='CENTER')
        if sub:
            label(sub, (x + w / 2, -0.11, z - 0.08), size=0.038, material=wl, align='CENTER')
        x += w


frame(1.3, [('Ziel-MAC', 0.6, 0, '6 Byte'), ('Quell-MAC', 0.6, 0, '6 Byte'), ('Typ', 0.4, 2, '2 Byte'), ('Daten', 1.9, 3, '46–1500 Byte'), ('FCS', 0.4, 4, '4 Byte')], 'Ethernet-Frame ohne Tag (Access-Port, Endgerät)')
frame(0.55, [('Ziel-MAC', 0.6, 0, '6 Byte'), ('Quell-MAC', 0.6, 0, '6 Byte'), ('802.1Q-Tag', 0.6, 1, '4 Byte'), ('Typ', 0.4, 2, '2 Byte'), ('Daten', 1.3, 3, '46–1500 Byte'), ('FCS', 0.4, 4, '4 Byte')], 'Ethernet-Frame mit Tag (Trunk-Port zwischen Switches)')
xt = -2.05 + 1.2 + 0.3
parts = [('TPID 0x8100', 0.75), ('PCP\n3 Bit', 0.45), ('DEI\n1 Bit', 0.4), ('VLAN-ID\n12 Bit', 0.6)]
x = xt - 1.1
for name, w in parts:
    box('p', (w - 0.015, 0.15, 0.3), (x + w / 2, 0, -0.05), f[1], bevel=0.006)
    label(name, (x + w / 2, -0.09, -0.03 if '\n' in name else -0.07), size=0.042, material=wl, align='CENTER')
    x += w
leader((xt - 0.3, -0.02, 0.39), (xt - 1.1, -0.02, 0.11), f[1], r=0.006)
leader((xt + 0.3, -0.02, 0.39), (x, -0.02, 0.11), f[1], r=0.006)
label('VLAN-ID: 12 Bit → 4096 Werte, nutzbar 1–4094 (0 und 4095 reserviert); PCP = Priorität (802.1p, z. B. für VoIP).', (0, -0.05, -0.42), size=0.046, material=lm, align='CENTER')
label('Der Switch fügt den Tag am Trunk-Port ein und entfernt ihn am Access-Port wieder.', (0, -0.05, -0.54), size=0.046, material=lm, align='CENTER')
camera_front((0.05, 0, 0.55), 4.4, tilt=1)
lights(0.55)
