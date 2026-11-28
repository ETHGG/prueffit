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
label('Datenverlust und Ausfallzeit mit RPO und RTO vergleichen', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
box('axis', (4.0, 0.03, 0.025), (0, 0, 1.45), ln)
def mark(x, t, m):
    box('m', (0.03, 0.04, 0.3), (x, -0.01, 1.45), m)
    label(t, (x, -0.05, 1.7), size=0.058, material=lm, align='CENTER')
mark(-1.6, 'letzte Sicherung 02:00', green)
mark(0.0, 'Ausfall 10:00', red)
mark(1.6, 'wieder in Betrieb 14:00', blue)
box('rpo', (1.56, 0.06, 0.26), (-0.8, 0, 1.12), orange, bevel=0.01)
label('Datenverlust 8 h', (-0.8, -0.06, 1.16), size=0.058, material=wl, align='CENTER')
label('mit dem RPO vergleichen', (-0.8, -0.06, 1.05), size=0.05, material=wl, align='CENTER')
box('rto', (1.56, 0.06, 0.26), (0.8, 0, 1.12), blue, bevel=0.01)
label('Ausfallzeit 4 h', (0.8, -0.06, 1.16), size=0.058, material=wl, align='CENTER')
label('mit dem RTO vergleichen', (0.8, -0.06, 1.05), size=0.05, material=wl, align='CENTER')
t = ['RPO (Recovery Point Objective): höchstens erlaubter Datenverlust',
     '→ bestimmt, wie oft gesichert oder repliziert wird',
     'RTO (Recovery Time Objective): höchstens erlaubte Ausfallzeit',
     '→ bestimmt Technik, Redundanz und Ersatzsysteme',
     'Beispiel: Verlangt ist ein RPO von 1 h – die nächtliche Sicherung reicht nicht.',
     'Ein RTO von 8 h wäre mit 4 h Wiederherstellung eingehalten.']
for i, s in enumerate(t):
    label(s, (0, -0.05, 0.72 - i * 0.13), size=0.058, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
