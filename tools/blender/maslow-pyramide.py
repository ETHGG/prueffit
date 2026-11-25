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
label('Bedürfnispyramide nach Maslow', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
lv = [('Grundbedürfnisse', 'Essen, Schlaf, Wohnung', grey),
      ('Sicherheit', 'fester Arbeitsplatz, Versicherung', blue),
      ('Soziale Bedürfnisse', 'Team, Freunde, Familie', green),
      ('Wertschätzung', 'Anerkennung, Beförderung', orange),
      ('Selbstverwirklichung', 'eigene Ideen umsetzen', red)]
for i, (t, ex, m) in enumerate(lv):
    z = 0.55 + i * 0.3
    w = 2.6 - i * 0.48
    box('p', (w, 0.2, 0.26), (-0.55, 0, z), m, bevel=0.01)
    label(t, (-0.55, -0.11, z - 0.03), size=0.05 if i < 4 else 0.043, material=wl, align='CENTER')
    leader((-0.55 + w / 2 + 0.03, -0.03, z), (1.0, -0.03, z), ln, r=0.003)
    label(ex, (1.05, -0.05, z - 0.02), size=0.042, material=lm)
label('unten: Grundbedürfnisse (Existenz) · oben: Wachstumsbedürfnisse', (-0.55, -0.05, 0.25), size=0.042, material=lm, align='CENTER')
label('Vereinfacht: Meist wird erst die untere Stufe weitgehend erfüllt, bevor die nächste wichtig wird – kein starres Gesetz.', (0, -0.05, 0.1), size=0.042, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
