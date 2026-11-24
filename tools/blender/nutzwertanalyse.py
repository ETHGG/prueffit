sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
cm = [mat('preis', (0.1, 0.32, 0.65), rough=0.5), mat('leist', (0.04, 0.36, 0.18), rough=0.5), mat('serv', (0.68, 0.3, 0.02), rough=0.5)]
crit = ['Preis 40 %', 'Leistung 35 %', 'Service 25 %']
offers = [('Angebot A', [(8, 0.4), (6, 0.35), (9, 0.25)]), ('Angebot B', [(6, 0.4), (9, 0.35), (7, 0.25)]), ('Angebot C', [(9, 0.4), (5, 0.35), (6, 0.25)])]
S = 3.0 / 10
X0 = -1.35
for i, (name, parts) in enumerate(offers):
    z = 1.2 - i * 0.48
    label(name, (X0 - 0.1, -0.05, z - 0.03), size=0.06, material=lm, align='RIGHT')
    x = X0
    total = 0
    for k, (pts, w) in enumerate(parts):
        v = pts * w
        total += v
        box('seg', (v * S - 0.01, 0.2, 0.3), (x + v * S / 2, 0, z), cm[k], bevel=0.006)
        label(f'{pts} × {str(w).replace(".", ",")}', (x + v * S / 2, -0.11, z - 0.025), size=0.045, material=wl, align='CENTER')
        x += v * S
    label(f'{total:.2f}'.replace('.', ','), (x + 0.1, -0.05, z - 0.03), size=0.07, material=lm)
for k, t in enumerate(crit):
    box('k', (0.12, 0.05, 0.08), (-1.2 + k * 1.15, -0.02, -0.07), cm[k])
    label(t, (-1.1 + k * 1.15, -0.05, -0.09), size=0.05, material=lm)
label('Gesamtnutzwert = Summe (Punkte × Gewicht) – Angebot A gewinnt mit 7,55', (0, -0.05, -0.32), size=0.055, material=lm, align='CENTER')
label('Gewichte und Punkte sind subjektiv; die Analyse macht die Entscheidung aber nachvollziehbar.', (0, -0.05, -0.45), size=0.048, material=lm, align='CENTER')
camera_front((0.05, 0, 0.55), 4.2, tilt=1)
lights(0.55)
