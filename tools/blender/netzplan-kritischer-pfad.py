sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
face = mat('face', (0.97, 0.97, 0.97), rough=0.8)
crit = mat('crit', (0.85, 0.15, 0.12), rough=0.5)
norm = mat('norm', (0.3, 0.33, 0.37), rough=0.5)
grid = mat('grid', (0.35, 0.38, 0.42), rough=0.8)
NW, NH = 0.78, 0.54


def node(x, z, top, mid, bot, critical):
    box('frame', (NW + 0.04, 0.06, NH + 0.04), (x, 0.03, z), crit if critical else norm, bevel=0.005)
    box('face', (NW, 0.08, NH), (x, 0, z), face)
    for dz in (NH / 6, -NH / 6):
        leader((x - NW / 2, -0.045, z + dz), (x + NW / 2, -0.045, z + dz), grid, r=0.003)
    for dz in (NH / 3, -NH / 3):
        for dx in (-NW / 6, NW / 6):
            leader((x + dx, -0.045, z + dz - NH / 6), (x + dx, -0.045, z + dz + NH / 6), grid, r=0.003)
    for i, t in enumerate(top):
        label(t, (x + (i - 1) * NW / 3, -0.05, z + NH / 3 - 0.025), size=0.06, material=lm, align='CENTER')
    label(mid, (x, -0.05, z - 0.022), size=0.052, material=lm, align='CENTER')
    for i, t in enumerate(bot):
        label(t, (x + (i - 1) * NW / 3, -0.05, z - NH / 3 - 0.025), size=0.06, material=lm, align='CENTER')


# A 2 Tage -> B 3, C 5; B -> D 1; C, D -> E 3
node(-1.75, 0.55, ['0', '2', '2'], 'A  Ist-Analyse', ['0', '0 | 0', '2'], True)
node(-0.6, 1.15, ['2', '3', '5'], 'B  Angebote', ['3', '1 | 0', '6'], False)
node(-0.6, -0.05, ['2', '5', '7'], 'C  Server einrichten', ['2', '0 | 0', '7'], True)
node(0.55, 1.15, ['5', '1', '6'], 'D  Bestellung', ['6', '1 | 1', '7'], False)
node(1.7, 0.55, ['7', '3', '10'], 'E  Test, Abnahme', ['7', '0 | 0', '10'], True)
for a, b, c in [((-1.36, 0.7), (-0.99, 1.0), norm), ((-1.36, 0.4), (-0.99, 0.1), crit), ((-0.21, 1.15), (0.16, 1.15), norm),
                ((0.94, 1.0), (1.31, 0.7), norm), ((-0.21, -0.05), (1.31, 0.4), crit)]:
    arrow((a[0], -0.02, a[1]), (b[0], -0.02, b[1]), c, r=0.011, head=0.06)
# legend
node(-1.75, -0.6, ['FAZ', 'Dauer', 'FEZ'], 'Nr.  Vorgang', ['SAZ', 'GP | FP', 'SEZ'], False)
label('Aufbau eines Knotens', (-1.75, -0.05, -0.97), size=0.05, material=lm, align='CENTER')
label('Kritischer Pfad (rot): A → C → E, Gesamtpuffer 0, Projektdauer 10 Tage', (0.55, -0.05, -0.5), size=0.055, material=lm, align='CENTER')
label('B: GP = SAZ − FAZ = 3 − 2 = 1, FP = FAZ(D) − FEZ(B) = 5 − 5 = 0', (0.55, -0.05, -0.68), size=0.05, material=lm, align='CENTER')
label('D: GP = 6 − 5 = 1, FP = FAZ(E) − FEZ(D) = 7 − 6 = 1', (0.55, -0.05, -0.84), size=0.05, material=lm, align='CENTER')
camera_front((0.0, 0, 0.2), 4.6, tilt=2)
lights(0.55)
