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
label('Linux-Dateirechte lesen und als Zahl schreiben', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
label('ls -l zeigt:', (-2.0, -0.05, 1.85), size=0.058, material=lm)
groups = [('-', grey, 'Typ', '- Datei, d Ordner', None),
          ('rwx', blue, 'Besitzer (anna)', '4 + 2 + 1', '7'),
          ('r-x', green, 'Gruppe (buchhaltung)', '4 + 0 + 1', '5'),
          ('r--', orange, 'alle anderen', '4 + 0 + 0', '4')]
xs = [-1.55, -0.85, 0.05, 0.95]
ws = [0.3, 0.75, 0.75, 0.75]
for (t, m, who, calc, num), x, w in zip(groups, xs, ws):
    box('g', (w, 0.15, 0.36), (x, 0, 1.6), m, bevel=0.015)
    label(t, (x, -0.09, 1.55), size=0.13, material=wl, align='CENTER')
    label(who, (x, -0.05, 1.27), size=0.052, material=lm, align='CENTER')
    if num:
        label(calc, (x, -0.05, 1.12), size=0.052, material=grey, align='CENTER')
        arrow((x, -0.03, 1.05), (x, -0.03, 0.88), m, r=0.008, head=0.04)
        card(x, 0.7, 0.36, 0.3, m, [num], sizes=(0.11, 0.05))
    else:
        label(calc, (x, -0.05, 1.12), size=0.05, material=grey, align='CENTER')
label('anna  buchhaltung  bericht.sh', (1.75, -0.05, 1.57), size=0.055, material=lm, align='CENTER')
label('→  chmod 754 bericht.sh', (1.6, -0.05, 0.68), size=0.07, material=lm, align='CENTER')
t = ['r = lesen (4) · w = schreiben (2) · x = ausführen (1); je Stelle die Werte addieren',
     'Bei Ordnern: r = Inhalt auflisten, w = Dateien anlegen/löschen, x = Ordner betreten',
     'Weitere Beispiele: 644 = rw-r--r-- (Textdatei) · 750 = rwxr-x--- · 600 = rw------- (privater Schlüssel)']
for i, s in enumerate(t):
    label(s, (0, -0.05, 0.25 - i * 0.14), size=0.054, material=lm, align='CENTER')
camera_front((0, 0, 1.1), 4.5, tilt=1)
lights(0.55)
