sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
wf = mat('wf', (0.1, 0.32, 0.65), rough=0.5)
sc_m = mat('scrum', (0.1, 0.5, 0.28), rough=0.5)
bl = mat('backlog', (0.75, 0.42, 0.05), rough=0.5)
ar = mat('arrow', (0.3, 0.33, 0.37), rough=0.6)
# Waterfall: staircase
phases = ['Analyse', 'Entwurf', 'Umsetzung', 'Test', 'Betrieb']
for i, p in enumerate(phases):
    x, z = -2.0 + i * 0.3, 1.25 - i * 0.36
    box('wf', (0.62, 0.2, 0.24), (x, 0, z), wf, bevel=0.01)
    label(p, (x, -0.11, z - 0.022), size=0.055, material=wl, align='CENTER')
    if i < 4:
        arrow((x + 0.32, -0.02, z), (x + 0.32, -0.02, z - 0.23), ar, r=0.008, head=0.045)
label('Wasserfall', (-1.4, -0.11, 1.55), size=0.08, material=lm, align='CENTER')
label('Phasen nacheinander, jede endet\nmit einem Ergebnis (Dokument).\nÄnderungen spät sind teuer.', (-1.4, -0.11, -0.45), size=0.05, material=lm, align='CENTER')
# Scrum: cycle
cx, cz, R = 1.05, 0.55, 0.62
steps = [(90, 'Sprint Planning'), (0, 'Sprint\n(1–4 Wochen)'), (-90, 'Inkrement'), (180, 'Review,\nRetrospektive')]
pos = []
for ang, t in steps:
    a = math.radians(ang)
    x, z = cx + R * math.cos(a), cz + R * math.sin(a)
    pos.append((x, z))
    box('sc', (0.66, 0.2, 0.28), (x, 0, z), sc_m, bevel=0.01)
    label(t, (x, -0.11, z + (0.0 if '\n' in t else -0.022)), size=0.05, material=wl, align='CENTER')
for i in range(4):
    a1 = math.radians(steps[i][0] - 32)
    a2 = math.radians(steps[(i + 1) % 4][0] + 32)
    p1 = (cx + R * math.cos(a1), -0.02, cz + R * math.sin(a1))
    p2 = (cx + R * math.cos(a2), -0.02, cz + R * math.sin(a2))
    arrow(p1, p2, ar, r=0.008, head=0.045)
cyl('daily', 0.17, 0.05, (cx + 0.02, 0, cz), mat('daily', (0.95, 0.75, 0.2), rough=0.5), rot=(math.radians(90), 0, 0))
label('Daily\n15 min', (cx + 0.02, -0.04, cz + 0.02), size=0.045, material=lm, align='CENTER')
box('pb', (0.6, 0.2, 0.28), (cx - 1.0, 0, cz + R + 0.0), bl, bevel=0.01)
label('Product\nBacklog', (cx - 1.0, -0.11, cz + R), size=0.05, material=wl, align='CENTER')
arrow((cx - 0.69, -0.02, cz + R), (cx - 0.35, -0.02, cz + R), ar, r=0.008, head=0.045)
label('Scrum', (cx, -0.11, 1.55), size=0.08, material=lm, align='CENTER')
label('Kurze Zyklen, nach jedem Sprint ein nutzbares\nInkrement, Anforderungen dürfen sich ändern.', (cx, -0.11, -0.45), size=0.05, material=lm, align='CENTER')
camera_front((-0.12, 0, 0.6), 4.65, tilt=2)
lights(0.55)
