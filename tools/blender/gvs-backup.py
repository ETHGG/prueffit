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
label('Generationenprinzip: Großvater – Vater – Sohn', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
days = ['Mo', 'Di', 'Mi', 'Do', 'Fr']
x0, z0 = -1.55, 1.75
for d, t in enumerate(days):
    label(t, (x0 + d * 0.5, -0.05, 1.95), size=0.045, material=lm, align='CENTER')
for w in range(4):
    label('Woche %d' % (w + 1), (x0 - 0.3, -0.05, z0 - w * 0.32 - 0.02), size=0.035, material=lm, align='RIGHT')
    for d in range(5):
        if d < 4:
            m, t = green, 'S-' + days[d]
        elif w < 3:
            m, t = blue, 'V%d' % (w + 1)
        else:
            m, t = orange, 'G-Jan'
        card(x0 + d * 0.5, z0 - w * 0.32, 0.44, 0.26, m, [t], sizes=(0.045, 0.04))
card(1.5, 1.65, 1.1, 0.36, green, ['Sohn: täglich (Mo–Do)', '4 Bänder, jede Woche neu beschrieben'], sizes=(0.042, 0.032))
card(1.5, 1.2, 1.1, 0.36, blue, ['Vater: Freitag', '4 Bänder, nach einem Monat neu'], sizes=(0.042, 0.032))
card(1.5, 0.75, 1.1, 0.36, orange, ['Großvater: Monatsende', '12 Bänder, ein Jahr aufbewahrt'], sizes=(0.042, 0.032))
label('In diesem Beispiel: 4 + 4 + 12 = 20 Bänder; Wiederherstellung täglich für eine Woche, wöchentlich für einen Monat, monatlich für ein Jahr.', (0, -0.05, 0.3), size=0.04, material=lm, align='CENTER')
label('Die Zahlen hängen von den Regeln ab, z. B. zusätzliche Sohn-Bänder für Samstag oder längere Aufbewahrung der Großväter.', (0, -0.05, 0.18), size=0.04, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
