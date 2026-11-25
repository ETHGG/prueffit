sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
blue = mat('blue', (0.1, 0.32, 0.65), rough=0.5)
orange = mat('orange', (0.68, 0.3, 0.02), rough=0.5)
green = mat('green', (0.04, 0.4, 0.18), rough=0.5)
grey = mat('grey', (0.28, 0.32, 0.36), rough=0.6)
red = mat('red', (0.75, 0.15, 0.12), rough=0.5)
ln = mat('ln', (0.15, 0.2, 0.22), rough=0.9)
def card(x, z, w, h, m, lines, sizes=(0.06, 0.042)):
    box('c', (w, 0.2, h), (x, 0, z), m, bevel=0.015)
    n = len(lines)
    for i, t in enumerate(lines):
        s = sizes[0] if i == 0 else sizes[1]
        dz = (n - 1) * 0.06 - i * 0.12
        label(t, (x, -0.11, z + dz - s / 3), size=s, material=wl, align='CENTER')
metal = mat('metal', (0.55, 0.57, 0.6), metal=0.7, rough=0.35)
pcb = mat('pcb', (0.05, 0.28, 0.12), rough=0.6)
heat = mat('heat', (0.7, 0.72, 0.75), metal=0.8, rough=0.3)
ram = mat('ram', (0.08, 0.1, 0.25), rough=0.5)
dark = mat('dark', (0.08, 0.08, 0.09), rough=0.5)
psu = mat('psu', (0.25, 0.26, 0.28), metal=0.5, rough=0.4)
X0, X1, Y = -0.35, 0.35, 0.22
box('floor', (X1 - X0, 2 * Y, 0.004), ((X0 + X1) / 2, 0, 0), metal)
for s in (-1, 1):
    box('side', (X1 - X0, 0.006, 0.04), ((X0 + X1) / 2, s * Y, 0.02), metal)
box('board', (0.42, 0.40, 0.003), (-0.29, 0, 0.004), pcb)
for k in range(8):
    y = -0.19 + k * 0.054
    box('bay', (0.07, 0.048, 0.03), (-0.71, y, 0.017), dark, bevel=0.002)
    box('led', (0.006, 0.006, 0.002), (-0.745, y + 0.015, 0.033), green)
for k in range(6):
    y = -0.175 + k * 0.07
    box('fanbox', (0.04, 0.062, 0.035), (-0.55, y, 0.02), dark, bevel=0.003)
    cyl('fan', 0.024, 0.004, (-0.55, y, 0.039), grey, verts=24)
for s in (-1, 1):
    yc = s * 0.11
    box('hs', (0.09, 0.08, 0.004), (-0.38, yc, 0.008), heat)
    for f in range(9):
        box('fin', (0.09, 0.003, 0.028), (-0.38, yc - 0.036 + f * 0.009, 0.024), heat)
    for off in (0.05, 0.063, 0.076):
        for side in (-1, 1):
            box('dimm', (0.13, 0.006, 0.03), (-0.38, yc + side * off, 0.018), ram)
for k, y in enumerate((0.175, 0.105)):
    box('psu', (0.13, 0.065, 0.038), (-0.115, y, 0.021), psu, bevel=0.002)
    box('psu_handle', (0.01, 0.03, 0.01), (-0.045, y, 0.03), dark)
    box('psu_led', (0.005, 0.005, 0.002), (-0.055, y - 0.02, 0.041), green)
box('riser', (0.11, 0.12, 0.004), (-0.13, -0.12, 0.02), dark)
box('card', (0.11, 0.1, 0.012), (-0.13, -0.12, 0.03), green)
for k in range(4):
    box('rj45', (0.012, 0.016, 0.012), (-0.056, -0.02 - k * 0.022, 0.012), dark)
for o in list(bpy.context.scene.collection.objects):
    if o.name.startswith(('floor', 'side')):
        continue
    o.location.x += 0.4
def tag(text, anchor, pos, al):
    ax, ay, az = anchor
    leader((ax, ay, az + 0.002), (pos[0], pos[1], 0.06), lm, r=0.0015)
    dx = -0.015 if al == 'RIGHT' else 0.015
    label(text, (pos[0] + dx, pos[1] - 0.01, 0.06), size=0.032, material=lm, rot=(0, 0, 0), align=al)
tag('Hot-Swap-Schächte: im Betrieb tauschbar', (-0.31, -0.1, 0.035), (-0.42, -0.1), 'RIGHT')
tag('Lüfter, redundant: saugen vorn kalt an', (-0.15, 0.105, 0.045), (-0.42, 0.12), 'RIGHT')
tag('2 CPUs unter passiven Kühlkörpern', (0.02, 0.11, 0.04), (0.02, 0.3), 'LEFT')
tag('RAM-Steckplätze je CPU, in Luftrichtung', (0.02, -0.186, 0.035), (0.02, -0.3), 'LEFT')
tag('2 Netzteile 1+1, im Betrieb tauschbar', (0.285, 0.175, 0.045), (0.42, 0.2), 'LEFT')
tag('Netzwerkanschlüsse', (0.344, -0.04, 0.02), (0.42, -0.02), 'LEFT')
tag('Erweiterungskarte (PCIe-Riser)', (0.27, -0.12, 0.04), (0.42, -0.14), 'LEFT')
label('1-HE-Rackserver von oben (Deckel offen)', (0, 0.45, 0.06), size=0.045, material=lm, rot=(0, 0, 0), align='CENTER')
label('vorn', (-0.35, 0.25, 0.06), size=0.03, material=lm, rot=(0, 0, 0), align='CENTER')
label('hinten', (0.35, 0.25, 0.06), size=0.03, material=lm, rot=(0, 0, 0), align='CENTER')
arrow((-0.35, -0.4, 0.03), (0.35, -0.4, 0.03), blue, r=0.005, head=0.035)
label('Luftstrom: vorn kalt (Kaltgang) → hinten warm (Warmgang)', (0, -0.47, 0.03), size=0.03, material=lm, rot=(0, 0, 0), align='CENTER')
label('Jedes Netzteil hängt an einer anderen Stromseite (A/B); fällt eine aus, trägt das andere die ganze Last.', (0, -0.56, 0.03), size=0.03, material=lm, rot=(0, 0, 0), align='CENTER')
camera((0.0, 0.0, 3.0), (0.0, 0.0, 0.0), lens=50, ortho=2.3)
lights(0.7)
