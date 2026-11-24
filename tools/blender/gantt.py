sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
crit = mat('crit', (0.75, 0.15, 0.12), rough=0.5)
norm = mat('norm', (0.1, 0.32, 0.65), rough=0.5)
buf = mat('buf', (0.55, 0.58, 0.62), rough=0.8)
grid = mat('grid', (0.75, 0.77, 0.8), rough=0.8)
ms = mat('ms', (0.85, 0.6, 0.05), rough=0.4)
X0, U = -1.2, 0.32
tasks = [('A  Ist-Analyse', 0, 2, True, 0), ('B  Angebote', 2, 3, False, 1), ('C  Server einrichten', 2, 5, True, 0), ('D  Bestellung', 5, 1, False, 1), ('E  Test, Abnahme', 7, 3, True, 0)]
for d in range(11):
    x = X0 + d * U
    leader((x, 0.05, -0.05), (x, 0.05, 1.72), grid, r=0.003)
    label(str(d), (x, -0.03, 1.78), size=0.045, material=lm, align='CENTER')
label('Tag', (X0 + 10 * U + 0.15, -0.03, 1.78), size=0.045, material=lm)
for i, (t, s, d, c, gp) in enumerate(tasks):
    z = 1.5 - i * 0.32
    label(t, (X0 - 0.1, -0.03, z - 0.025), size=0.052, material=lm, align='RIGHT')
    box('bar', (d * U - 0.02, 0.15, 0.2), (X0 + (s + d / 2) * U, 0, z), crit if c else norm, bevel=0.01)
    if gp:
        box('buf', (gp * U - 0.02, 0.1, 0.1), (X0 + (s + d + gp / 2) * U, -0.03, z), buf)
        label('Puffer', (X0 + (s + d + gp / 2) * U, -0.06, z - 0.1), size=0.035, material=lm, align='CENTER')
xm, zm = X0 + 10 * U, 1.5 - 5 * 0.32
o = box('ms', (0.14, 0.14, 0.14), (xm, -0.02, zm), ms)
o.rotation_euler = (0, math.radians(45), 0)
label('Meilenstein: Abnahme (Dauer 0)', (xm - 0.15, -0.03, zm - 0.03), size=0.05, material=lm, align='RIGHT')
label('Rot = kritischer Pfad A → C → E (10 Tage); grau = Puffer von B und D.', (0.2, -0.03, -0.25), size=0.05, material=lm, align='CENTER')
label('Gantt zeigt Dauer und Termine anschaulich; Abhängigkeiten sieht man im Netzplan besser.', (0.2, -0.03, -0.38), size=0.05, material=lm, align='CENTER')
camera_front((0.15, 0, 0.75), 4.3, tilt=1)
lights(0.55)
