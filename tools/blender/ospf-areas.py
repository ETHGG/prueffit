sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
p0 = mat('p0', (0.62, 0.74, 0.92), rough=0.7)
p1 = mat('p1', (0.66, 0.85, 0.7), rough=0.7)
p2 = mat('p2', (0.92, 0.8, 0.62), rough=0.7)
rt = mat('rt', (0.1, 0.32, 0.65), rough=0.5)
abr = mat('abr', (0.68, 0.3, 0.02), rough=0.5)
asb = mat('asb', (0.45, 0.3, 0.7), rough=0.5)
ln = mat('ln', (0.2, 0.24, 0.27), rough=0.8)
net = mat('net', (0.28, 0.32, 0.36), rough=0.5)
label('OSPF mit mehreren Areas', (0, -0.05, 2.58), size=0.075, material=lm, align='CENTER')
box('a0', (3.0, 0.1, 0.96), (0, 0.15, 1.68), p0, bevel=0.03)
label('Area 0 – Backbone', (-1.42, -0.05, 2.03), size=0.058, material=lm)
box('a1', (2.0, 0.1, 0.92), (-1.3, 0.15, 0.59), p1, bevel=0.03)
label('Area 1 (Standort A)', (-2.22, -0.05, 0.9), size=0.052, material=lm)
box('a2', (2.0, 0.1, 0.92), (1.3, 0.15, 0.59), p2, bevel=0.03)
label('Area 2 (Standort B)', (0.38, -0.05, 0.9), size=0.052, material=lm)
box('inet', (0.9, 0.2, 0.42), (2.05, 0, 1.72), net, bevel=0.02)
label('anderes Netz', (2.05, -0.11, 1.75), size=0.044, material=wl, align='CENTER')
label('(z. B. Provider)', (2.05, -0.11, 1.64), size=0.04, material=wl, align='CENTER')


def router(name, x, z, m, sub=None):
    cyl('r', 0.14, 0.12, (x, 0, z), m, rot=(math.radians(90), 0, 0))
    label(name, (x, -0.08, z - 0.02), size=0.042 if len(name) > 2 else 0.052, material=wl, align='CENTER')
    if sub:
        label(sub, (x, -0.05, z - 0.25), size=0.042, material=lm, align='CENTER')


links = [((-1.0, 1.12), (0.0, 1.62)), ((1.0, 1.12), (0.0, 1.62)), ((0.0, 1.62), (1.05, 1.72)), ((1.05, 1.72), (1.6, 1.72)),
         ((-1.0, 1.12), (-1.8, 0.5)), ((-1.0, 1.12), (-0.8, 0.5)), ((-1.8, 0.5), (-0.8, 0.5)),
         ((1.0, 1.12), (0.8, 0.5)), ((1.0, 1.12), (1.8, 0.5)), ((0.8, 0.5), (1.8, 0.5))]
for a, b in links:
    leader((a[0], -0.02, a[1]), (b[0], -0.02, b[1]), ln, r=0.009)
router('R0', 0.0, 1.62, rt)
router('ASBR', 1.05, 1.72, asb)
router('ABR 1', -1.0, 1.12, abr)
router('ABR 2', 1.0, 1.12, abr)
router('R1', -1.8, 0.5, rt)
router('R2', -0.8, 0.5, rt)
router('R3', 0.8, 0.5, rt)
router('R4', 1.8, 0.5, rt)
label('ABR = Bereichsgrenzrouter: je eine Schnittstelle in Area 0 und in seiner Area', (-2.4, -0.05, 2.38), size=0.046, material=lm)
label('ASBR = Grenzrouter zu einem fremden Routing (z. B. statische Route oder BGP)', (-2.4, -0.05, 2.27), size=0.046, material=lm)
label('Jede Area hängt am Backbone: Pakete von Area 1 nach Area 2 laufen über ABR 1 – Area 0 – ABR 2 (Ausnahme: virtueller Link).', (0, -0.05, -0.02), size=0.05, material=lm, align='CENTER')
label('In der Area kennt jeder Router die ganze Topologie (Link-State); der ABR meldet nach außen nur die Netze, nicht die Topologie → Störungen bleiben lokal.', (0, -0.05, -0.15), size=0.05, material=lm, align='CENTER')
label('Kosten je Link = Referenzbandbreite / Bandbreite (Standard 100 Mbit/s: 100 Mbit/s → 1, 10 Mbit/s → 10); damit 1 und 10 Gbit/s sich unterscheiden, Referenz erhöhen.', (0, -0.05, -0.28), size=0.05, material=lm, align='CENTER')
camera_front((0, 0, 1.1), 5.1, tilt=1)
lights(0.55)
