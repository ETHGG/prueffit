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
label('Open-Source-Lizenzen: Was gilt bei der Weitergabe?', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
cols = [(-1.45, red, 'starkes Copyleft', 'GPL',
         ['geänderte und abgeleitete', 'Programme wieder unter GPL', 'mit Quellcode weitergeben']),
        (0, orange, 'schwaches Copyleft', 'LGPL, MPL',
         ['Änderungen an der Bibliothek', 'offenlegen; eigenes Programm,', 'das sie nur nutzt, darf geschlossen bleiben']),
        (1.45, green, 'freizügig', 'MIT, Apache 2.0, BSD',
         ['auch in geschlossener Software', 'erlaubt; Lizenztext und', 'Urheberhinweis beibehalten'])]
for x, m, t, ex, lines in cols:
    card(x, 1.72, 1.3, 0.42, m, [t, ex], sizes=(0.066, 0.055))
    for i, s in enumerate(lines):
        label(s, (x, -0.05, 1.33 - i * 0.13), size=0.054, material=lm, align='CENTER')
arrow((-2.0, -0.03, 0.78), (2.0, -0.03, 0.78), ln, r=0.01, head=0.06)
label('strengere Pflichten', (-1.45, -0.05, 0.86), size=0.05, material=red, align='CENTER')
label('mehr Freiheit für den Weitergebenden', (1.2, -0.05, 0.86), size=0.05, material=green, align='CENTER')
t = ['Nur intern nutzen ohne Weitergabe löst das Copyleft der GPL nicht aus.',
     'Variante AGPL: schon das Bereitstellen als Webdienst verpflichtet, den Quellcode anzubieten.',
     'Vor dem Einbau fremder Bibliotheken die Lizenz prüfen und dokumentieren (Lizenzliste).']
for i, s in enumerate(t):
    label(s, (0, -0.05, 0.48 - i * 0.14), size=0.054, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.5, tilt=1)
lights(0.55)
