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
label('cron: Wann läuft ein Befehl?', (0, -0.05, 2.15), size=0.075, material=lm, align='CENTER')
F = [('30', 'Minute', '0–59'), ('2', 'Stunde', '0–23'), ('*', 'Tag', '1–31'), ('*', 'Monat', '1–12'), ('1-5', 'Wochentag', '0–7 (0 und 7 = So)')]
for i, (v, n, r) in enumerate(F):
    x = -1.75 + i * 0.72
    card(x, 1.55, 0.62, 0.55, blue, [v, n, r], sizes=(0.08, 0.05))
card(1.95, 1.55, 0.62, 0.55, green, ['Befehl', '/opt/backup.sh'], sizes=(0.062, 0.05))
label('30 2 * * 1-5 /opt/backup.sh  →  montags bis freitags um 2:30 Uhr', (0, -0.05, 1.05), size=0.058, material=lm, align='CENTER')
EX = [('*/15 * * * *', 'alle 15 Minuten (zu Minute 0, 15, 30, 45)'), ('0 0 1 * *', 'am 1. jedes Monats um 0:00 Uhr'), ('0 18 * * 5', 'freitags um 18:00 Uhr'), ('* = jeder Wert', ', = Liste (1,3,5)  ·  - = Bereich (1-5)  ·  /n = jede n-te')]
for i, (a, b) in enumerate(EX):
    z = 0.78 - i * 0.15
    label(a, (-0.12, -0.05, z), size=0.058, material=lm, align='RIGHT')
    label(b, (0.0, -0.05, z), size=0.058, material=lm, align='LEFT')
label('Unter Windows übernimmt die Aufgabenplanung (Trigger, Aktion, Benutzerkonto) diese Rolle.', (0, -0.05, 0.08), size=0.058, material=lm, align='CENTER')
camera_front((0, 0, 1.1), 4.6, tilt=1)
lights(0.55)
