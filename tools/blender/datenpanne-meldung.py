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
label('Datenpanne: melden oder nicht? (Art. 33 und 34 DSGVO)', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
card(-1.5, 1.72, 1.2, 0.42, grey, ['Verletzung bemerkt', 'z. B. Laptop gestohlen'])
arrow((-0.88, -0.03, 1.72), (-0.62, -0.03, 1.72), ln, r=0.01, head=0.05)
card(0, 1.72, 1.2, 0.42, blue, ['Risiko bewerten', 'für die Betroffenen'])
leader((0, -0.02, 1.5), (0, -0.02, 1.38), ln, r=0.006)
leader((-1.45, -0.02, 1.38), (1.45, -0.02, 1.38), ln, r=0.006)
for x in [-1.45, 0, 1.45]:
    arrow((x, -0.03, 1.38), (x, -0.03, 1.25), ln, r=0.008, head=0.04)
card(-1.45, 0.98, 1.35, 0.5, green, ['voraussichtlich kein Risiko', 'nicht melden,', 'aber dokumentieren'])
card(0, 0.98, 1.35, 0.5, orange, ['Risiko', 'binnen 72 Stunden an die', 'Aufsichtsbehörde melden'])
card(1.45, 0.98, 1.35, 0.5, red, ['hohes Risiko', 'zusätzlich Betroffene', 'unverzüglich informieren'])
t = ['Die 72 Stunden laufen ab dem Bekanntwerden; spätere Meldungen müssen begründet werden.',
     'Jede Panne wird intern dokumentiert – auch die, die nicht gemeldet werden muss.',
     'Ein Auftragsverarbeiter meldet die Panne unverzüglich seinem Auftraggeber; melden muss der Verantwortliche.',
     'Waren die Daten wirksam verschlüsselt, ist das Risiko oft gering.']
for i, s in enumerate(t):
    label(s, (0, -0.05, 0.48 - i * 0.14), size=0.054, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.5, tilt=1)
lights(0.55)
