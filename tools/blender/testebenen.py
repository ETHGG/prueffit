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
label('Testebenen: vom kleinen Baustein zur Abnahme', (0, -0.05, 2.35), size=0.075, material=lm, align='CENTER')
lv = [(4.2, blue, 'Unittest (Modultest)', 'einzelne Funktion oder Klasse · Entwickler · automatisch, schnell, viele Tests'),
      (3.6, green, 'Integrationstest', 'Zusammenspiel von Modulen und Schnittstellen'),
      (3.0, orange, 'Systemtest', 'ganzes System gegen die Anforderungen · Testumgebung'),
      (2.4, red, 'Abnahmetest', 'Auftraggeber prüft gegen den Vertrag · Protokoll')]
for i, (w, m, t, d) in enumerate(lv):
    z = 0.74 + i * 0.4
    box('lv', (w, 0.15, 0.36), (0, 0, z), m, bevel=0.012)
    label(t, (0, -0.09, z + 0.04), size=0.062, material=wl, align='CENTER')
    label(d, (0, -0.09, z - 0.11), size=0.05, material=wl, align='CENTER')
label('Black-Box: nur Eingaben und Ausgaben gegen die Anforderung (Systemtest, Abnahme)', (0, -0.05, 0.36), size=0.054, material=lm, align='CENTER')
label('White-Box: Quellcode bekannt, z. B. jeden Zweig einmal durchlaufen (Unittest)', (0, -0.05, 0.22), size=0.054, material=lm, align='CENTER')
label('Regressionstest: nach jeder Änderung alte Tests wiederholen – am besten automatisch', (0, -0.05, 0.08), size=0.054, material=lm, align='CENTER')
camera_front((0, 0, 1.2), 4.5, tilt=1)
lights(0.55)
