sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
s0 = mat('s0', (0.35, 0.38, 0.43), rough=0.5)
s1 = mat('s1', (0.1, 0.32, 0.65), rough=0.5)
s2 = mat('s2', (0.45, 0.3, 0.7), rough=0.5)
s3 = mat('s3', (0.04, 0.36, 0.18), rough=0.5)
info = mat('info', (0.68, 0.3, 0.02), rough=0.5)
ln = mat('ln', (0.15, 0.2, 0.22), rough=0.9)


def card(x, z, w, h, m, lines, sizes=(0.056, 0.042)):
    box('c', (w, 0.2, h), (x, 0, z), m, bevel=0.015)
    n = len(lines)
    for i, t in enumerate(lines):
        s = sizes[0] if i == 0 else sizes[1]
        dz = (n - 1) * 0.055 - i * 0.11
        label(t, (x, -0.11, z + dz - s / 3), size=s, material=wl, align='CENTER')


label('Zeitsynchronisation mit NTP: Stratum-Hierarchie', (0, -0.05, 2.3), size=0.075, material=lm, align='CENTER')
X = -0.75
levels = [(1.9, 'Stratum 0', s0, ['Referenzuhr', 'GPS-Empfänger, Funkuhr (DCF77), Atomuhr']),
          (1.35, 'Stratum 1', s1, ['Zeitserver', 'Referenzuhr direkt angeschlossen']),
          (0.8, 'Stratum 2', s2, ['Domänencontroller (PDC-Emulator)', 'fragt den externen Zeitserver'])]
for z, st, m, lines in levels:
    card(X, z, 1.7, 0.36, m, lines)
    label(st, (X - 1.25, -0.05, z - 0.02), size=0.056, material=lm, align='CENTER')
for z in (1.9, 1.35, 0.8):
    if z > 0.8:
        arrow((X, -0.03, z - 0.19), (X, -0.03, z - 0.36), ln, r=0.009, head=0.05)
label('NTP, UDP 123', (X + 0.1, -0.05, 1.05), size=0.04, material=lm)
for k, name in enumerate(['PC-01', 'PC-02', 'Fileserver']):
    x = X - 0.6 + k * 0.6
    card(x, 0.2, 0.52, 0.3, s3, [name], sizes=(0.046, 0.04))
    arrow((X, -0.03, 0.61), (x, -0.03, 0.36), ln, r=0.008, head=0.05)
label('Stratum 3', (X - 1.25, -0.05, 0.18), size=0.056, material=lm, align='CENTER')
box('i', (1.65, 0.2, 1.75), (1.4, 0, 1.05), info, bevel=0.02)
tips = [('Stratum = Abstand zur', 0.05), ('Referenzuhr, jede Stufe + 1', 0.05), ('', 0.04),
        ('höchstens Stratum 15;', 0.046), ('16 = nicht synchronisiert', 0.046), ('', 0.04),
        ('Kerberos duldet standardmäßig', 0.046), ('höchstens 5 Min. Abweichung –', 0.046), ('sonst scheitert die Anmeldung', 0.046), ('', 0.04),
        ('Mitglieder der Domäne holen die', 0.046), ('Zeit vom Domänencontroller,', 0.046), ('nicht aus dem Internet', 0.046)]
for k, (t, s) in enumerate(tips):
    if t:
        label(t, (1.4, -0.11, 1.75 - k * 0.105), size=s, material=wl, align='CENTER')
label('Je kleiner das Stratum, desto näher an der Referenzzeit – nicht zwingend genauer, wenn die Leitung langsam oder schwankend ist.', (0, -0.05, -0.18), size=0.046, material=lm, align='CENTER')
camera_front((0, 0, 1.05), 4.6, tilt=1)
lights(0.55)
