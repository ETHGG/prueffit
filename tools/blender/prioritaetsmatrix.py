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
label('Ticket-Priorität = Auswirkung × Dringlichkeit', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
P = [[('1 kritisch', red), ('2 hoch', orange), ('3 mittel', blue)], [('2 hoch', orange), ('3 mittel', blue), ('4 niedrig', green)], [('3 mittel', blue), ('4 niedrig', green), ('5 planbar', green)]]
xs = [-0.55, 0.35, 1.25]; zs = [1.75, 1.3, 0.85]
for i, z in enumerate(zs):
    for j, x in enumerate(xs):
        t, m = P[i][j]
        card(x, z, 0.82, 0.4, m, [t], sizes=(0.062, 0.05))
for j, (x, t) in enumerate(zip(xs, ['hoch', 'mittel', 'niedrig'])):
    label(t, (x, -0.05, 2.0), size=0.058, material=lm, align='CENTER')
for i, (z, t) in enumerate(zip(zs, ['viele Nutzer / ganzer Betrieb', 'eine Abteilung', 'ein Arbeitsplatz'])):
    label(t, (-1.05, -0.05, z - 0.02), size=0.058, material=lm, align='RIGHT')
label('Spalten: Dringlichkeit (hoch – mittel – niedrig) · Zeilen: Auswirkung', (0, -0.05, 0.45), size=0.058, material=lm, align='CENTER')
label('Beispiel: Mailserver für alle fällt aus, sofort nötig → Priorität 1; Drucker eines Platzes, Ersatz vorhanden → 4', (0, -0.05, 0.32), size=0.058, material=lm, align='CENTER')
label('Die genaue Matrix legt jedes Unternehmen selbst fest (z. B. im SLA).', (0, -0.05, 0.19), size=0.058, material=lm, align='CENTER')
camera_front((0, 0, 1.2), 4.5, tilt=1)
lights(0.55)
