sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
swm = mat('sw', (0.25, 0.27, 0.3), metal=0.3, rough=0.4)
root = mat('root', (0.1, 0.32, 0.65), metal=0.2, rough=0.4)
fwd = mat('fwd', (0.1, 0.55, 0.28), rough=0.4)
blk = mat('blk', (0.85, 0.15, 0.12), rough=0.4)
pc = mat('pc', (0.12, 0.3, 0.62), rough=0.5)


def switch(x, z, m, name):
    box('sw', (0.8, 0.3, 0.16), (x, 0, z), m, bevel=0.012)
    for i in range(6):
        box('port', (0.06, 0.02, 0.05), (x - 0.25 + i * 0.1, -0.155, z - 0.02), mat('port', (0.08, 0.08, 0.09), rough=0.6))
    label(name, (x, -0.17, z + 0.1), size=0.058, material=lm, align='CENTER')


switch(0, 1.35, root, 'Switch A – Root Bridge (niedrigste Bridge-ID)')
switch(-1.2, 0.25, swm, 'Switch B')
switch(1.2, 0.25, swm, 'Switch C')
leader((-0.3, -0.05, 1.27), (-1.0, -0.05, 0.33), fwd, r=0.016)
leader((0.3, -0.05, 1.27), (1.0, -0.05, 0.33), fwd, r=0.016)
leader((-0.8, -0.05, 0.25), (0.8, -0.05, 0.25), blk, r=0.016)
# blocked port marker (X) at switch C side
for ang in (45, -45):
    o = box('x', (0.2, 0.03, 0.035), (0.62, -0.08, 0.25), blk)
    o.rotation_euler = (0, math.radians(ang), 0)
label('blockierter Port', (0.62, -0.1, 0.38), size=0.05, material=lm, align='CENTER')
label('aktive Verbindungen', (-1.15, -0.1, 0.95), size=0.05, material=lm, align='CENTER')
for x in (-1.45, -0.95, 0.95, 1.45):
    box('pc', (0.16, 0.08, 0.12), (x, 0, -0.25), pc, bevel=0.006)
    leader((x, -0.02, -0.18), (x * 0.85 if abs(x) > 1.2 else x, -0.02, 0.17), mat('line', (0.4, 0.43, 0.47), rough=0.6), r=0.006)
label('Ohne STP kreisen Broadcasts in der Schleife A–B–C endlos (Broadcast-Sturm).', (0, -0.1, -0.55), size=0.052, material=lm, align='CENTER')
label('STP blockiert einen Port; fällt eine aktive Verbindung aus, wird er freigegeben (RSTP: meist in Sekunden).', (0, -0.1, -0.68), size=0.048, material=lm, align='CENTER')
camera_front((0, 0, 0.45), 4.0, tilt=4)
lights(0.55)
