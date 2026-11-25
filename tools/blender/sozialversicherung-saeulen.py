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
label('Die fünf Säulen der Sozialversicherung', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
box('dach', (4.1, 0.5, 0.08), (0, 0.1, 1.82), grey, bevel=0.01)
cols = [('Kranken-', 'versicherung', 'Krankenkassen', 'AN + AG je ½', blue), ('Pflege-', 'versicherung', 'Pflegekassen', 'AN + AG je ½*', blue),
        ('Renten-', 'versicherung', 'Dt. Renten-', 'AN + AG je ½', blue), ('Arbeitslosen-', 'versicherung', 'Bundesagentur', 'AN + AG je ½', blue),
        ('Unfall-', 'versicherung', 'Berufs-', 'nur Arbeitgeber', orange)]
sub = ['', '', 'versicherung', 'für Arbeit', 'genossenschaft']
for i, (a, b, tr, pay, m) in enumerate(cols):
    x = -1.64 + i * 0.82
    box('col', (0.62, 0.4, 1.2), (x, 0.1, 1.17), m, bevel=0.02)
    label(a, (x, -0.11, 1.55), size=0.05, material=wl, align='CENTER')
    label(b, (x, -0.11, 1.46), size=0.05, material=wl, align='CENTER')
    label(tr, (x, -0.11, 1.18), size=0.042, material=wl, align='CENTER')
    if sub[i]: label(sub[i], (x, -0.11, 1.1), size=0.042, material=wl, align='CENTER')
    label(pay, (x, -0.11, 0.78), size=0.042, material=wl, align='CENTER')
box('sockel', (4.1, 0.5, 0.08), (0, 0.1, 0.53), grey, bevel=0.01)
label('Prinzipien: Versicherungspflicht, Solidarprinzip, Rente im Umlageverfahren (Generationenvertrag).', (0, -0.05, 0.3), size=0.046, material=lm, align='CENTER')
label('* Pflege: Kinderlose ab 23 zahlen einen Zuschlag allein, in Sachsen tragen Arbeitnehmer einen höheren Anteil.', (0, -0.05, 0.16), size=0.044, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
