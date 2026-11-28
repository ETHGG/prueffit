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
label('SAN: Zoning im Switch, LUN-Masking im Speicher', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
card(-1.75, 1.6, 0.8, 0.42, blue, ['Server A', 'HBA …:0a'])
card(-1.75, 0.85, 0.8, 0.42, green, ['Server B', 'HBA …:0b'])
card(0, 1.22, 0.9, 0.9, grey, ['FC-Switch', ' ', 'Zone 1: A + Port 1', 'Zone 2: B + Port 2'])
box('st', (1.0, 0.2, 1.25), (1.65, 0, 1.22), lm, bevel=0.015)
label('Speichersystem', (1.65, -0.11, 1.72), size=0.062, material=wl, align='CENTER')
for i, (t, m) in enumerate([('LUN 0 → nur A', blue), ('LUN 1 → nur B', green), ('LUN 2 → nur B', green)]):
    box('lun', (0.8, 0.05, 0.2), (1.65, -0.12, 1.45 - i * 0.27), m, bevel=0.01)
    label(t, (1.65, -0.16, 1.43 - i * 0.27), size=0.05, material=wl, align='CENTER')
label('Port 1', (1.0, -0.05, 1.48), size=0.05, material=lm, align='CENTER')
label('Port 2', (1.0, -0.05, 0.92), size=0.05, material=lm, align='CENTER')
leader((-1.35, -0.02, 1.6), (-0.45, -0.02, 1.45), blue, r=0.012)
leader((-1.35, -0.02, 0.85), (-0.45, -0.02, 1.0), green, r=0.012)
leader((0.45, -0.02, 1.45), (1.15, -0.02, 1.4), blue, r=0.012)
leader((0.45, -0.02, 1.0), (1.15, -0.02, 1.05), green, r=0.012)
t = ['Zoning (FC-Switch): Wer darf mit wem sprechen? Server A sieht nur Port 1 des Speichers.',
     'LUN-Masking (Speichersystem): Welche LUN darf ein Server sehen? Erkennung über die WWPN des HBA.',
     'Beides zusammen verhindert, dass ein Server fremde Volumes einbindet oder formatiert.',
     'Bei iSCSI entsprechen VLANs bzw. Zugriffslisten nach Initiator-Name dem Zoning bzw. Masking.']
for i, s in enumerate(t):
    label(s, (0, -0.05, 0.3 - i * 0.14), size=0.052, material=lm, align='CENTER')
camera_front((0, 0, 1.1), 4.5, tilt=1)
lights(0.55)
