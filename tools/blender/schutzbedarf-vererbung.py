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
label('Schutzbedarf vererben (BSI-Standard 200-2)', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
label('Beispiel Vertraulichkeit', (0, -0.05, 2.02), size=0.055, material=grey, align='CENTER')
apps = [(-1.45, 'Lohnbuchhaltung', 'hoch', red), (0, 'E-Mail', 'normal', green), (1.45, 'Intranet', 'normal', green)]
for x, n, s, m in apps:
    card(x, 1.68, 1.1, 0.4, m, ['Anwendung: ' + n, 'Schutzbedarf ' + s])
    arrow((x, -0.03, 1.46), (x * 0.35, -0.03, 1.2), ln, r=0.008, head=0.04)
card(0, 1.0, 1.6, 0.4, red, ['Server SRV-01', 'erbt hoch (Maximumprinzip)'])
arrow((0, -0.03, 0.78), (0, -0.03, 0.62), ln, r=0.008, head=0.04)
card(0, 0.42, 1.6, 0.36, red, ['Serverraum', 'erbt hoch'])
t = [('Maximumprinzip:', 'der höchste Schutzbedarf der Anwendungen bestimmt den des Systems'),
     ('Kumulationseffekt:', 'viele „normale“ Anwendungen auf einem System können zusammen „hoch“ ergeben'),
     ('Verteilungseffekt:', 'ist eine Anwendung redundant verteilt, kann der Bedarf je System sinken (v. a. Verfügbarkeit)')]
for i, (a, b) in enumerate(t):
    label(a, (-2.15, -0.05, 0.02 - i * 0.13), size=0.054, material=orange)
    label(b, (-1.2, -0.05, 0.02 - i * 0.13), size=0.054, material=lm)
camera_front((0, 0, 1.0), 4.5, tilt=1)
lights(0.55)
