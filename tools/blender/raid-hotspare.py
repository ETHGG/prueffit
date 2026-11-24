sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
ok = mat('ok', (0.1, 0.32, 0.65), rough=0.5)
bad = mat('bad', (0.75, 0.15, 0.12), rough=0.5)
spare = mat('spare', (0.35, 0.38, 0.43), rough=0.5)
reb = mat('reb', (0.68, 0.3, 0.02), rough=0.5)
ar = mat('arrow', (0.3, 0.33, 0.37), rough=0.6)
stages = [('1  Normalbetrieb', [ok, ok, ok, spare], ['Platte 1', 'Platte 2', 'Platte 3', 'Hot-Spare'], 'RAID 5 aus 3 Platten, Ersatzplatte wartet'),
          ('2  Platte 2 fällt aus', [ok, bad, ok, spare], ['Platte 1', 'defekt', 'Platte 3', 'Hot-Spare'], 'Array läuft „degraded“ weiter (ohne Redundanz)'),
          ('3  automatischer Rebuild', [ok, bad, ok, reb], ['Platte 1', 'defekt', 'Platte 3', 'Rebuild …'], 'Controller baut die Daten aus Parität auf der Ersatzplatte neu auf'),
          ('4  wieder redundant', [ok, spare, ok, ok], ['Platte 1', 'neue Spare', 'Platte 3', 'Platte 4'], 'defekte Platte tauschen (Hot-Swap), sie wird neue Ersatzplatte')]
for i, (t, ms, ls, d) in enumerate(stages):
    z = 1.55 - i * 0.48
    label(t, (-2.05, -0.05, z - 0.02), size=0.055, material=lm)
    for k in range(4):
        x = -0.6 + k * 0.5
        box('d', (0.42, 0.2, 0.3), (x, 0, z), ms[k], bevel=0.01)
        label(ls[k], (x, -0.11, z - 0.02), size=0.04, material=wl, align='CENTER')
    label(d, (-0.85, -0.05, z - 0.25), size=0.042, material=lm)
label('Hot-Spare verkürzt die gefährliche Zeit ohne Redundanz: Der Rebuild startet sofort, nicht erst, wenn jemand die Platte tauscht.', (0, -0.05, -0.4), size=0.044, material=lm, align='CENTER')
camera_front((0, 0, 0.62), 4.3, tilt=1)
lights(0.55)
