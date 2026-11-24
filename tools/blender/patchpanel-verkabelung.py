sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
bld = mat('bld', (0.72, 0.76, 0.82), rough=0.9)
wallm = mat('wallm', (0.4, 0.43, 0.48), rough=0.8)
slab_m = mat('slab', (0.5, 0.53, 0.58), rough=0.8)
rk = mat('rack', (0.2, 0.22, 0.25), metal=0.4, rough=0.4)
pc = mat('pc', (0.12, 0.3, 0.62), rough=0.5)
dose = mat('dose', (0.45, 0.48, 0.52), rough=0.5)
prim = mat('prim', (0.1, 0.55, 0.3), rough=0.4)
sek = mat('sek', (0.9, 0.5, 0.05), rough=0.4)
ter = mat('ter', (0.15, 0.4, 0.85), rough=0.4)
FH = 0.48


def building(x0, w, floors, name):
    box('b', (w, 0.3, floors * FH), (x0 + w / 2, 0.3, floors * FH / 2), bld)
    for xw in (x0, x0 + w):
        box('wall', (0.04, 0.32, floors * FH), (xw, 0.29, floors * FH / 2), wallm)
    for f in range(floors + 1):
        box('slab', (w, 0.32, 0.025), (x0 + w / 2, 0.29, f * FH), slab_m)
    label(name, (x0 + w / 2, -0.05, floors * FH + 0.06), size=0.065, material=lm, align='CENTER')


building(-2.0, 2.6, 4, 'Gebäude A')
building(1.0, 1.0, 2, 'Gebäude B')
# building/campus distributor in A, ground floor
box('sv', (0.24, 0.12, 0.36), (-1.8, 0, 0.2), rk, bevel=0.005)
label('Standort- und\nGebäudeverteiler', (-1.8, -0.08, -0.17), size=0.045, material=lm, align='CENTER')
# floor distributors A (floors 1-3) and their outlets
for f in range(1, 4):
    z = f * FH
    box('ev', (0.18, 0.12, 0.26), (-1.45, 0, z + 0.15), rk, bevel=0.005)
    leader((-1.36, -0.02, z + 0.08), (0.42, -0.02, z + 0.08), ter, r=0.011)
    for dx in (-0.3, 0.45):
        box('dose', (0.07, 0.05, 0.07), (dx, -0.01, z + 0.08), dose)
        box('pc', (0.16, 0.08, 0.12), (dx + 0.12, 0, z + 0.07), pc, bevel=0.006)
label('Etagen-\nverteiler', (-1.78, -0.08, 3 * FH + 0.22), size=0.042, material=lm, align='CENTER')
# secondary: riser from building distributor to every floor distributor
leader((-1.68, -0.03, 0.3), (-1.55, -0.03, 0.3), sek, r=0.012)
leader((-1.55, -0.03, 0.3), (-1.55, -0.03, 3 * FH + 0.15), sek, r=0.012)
# building B: building distributor + one floor with outlet
box('gvb', (0.2, 0.12, 0.3), (1.2, 0, 0.17), rk, bevel=0.005)
label('Gebäude-\nverteiler', (1.2, -0.08, -0.17), size=0.045, material=lm, align='CENTER')
box('evb', (0.18, 0.12, 0.26), (1.2, 0, FH + 0.15), rk, bevel=0.005)
leader((1.32, -0.03, 0.25), (1.32, -0.03, FH + 0.15), sek, r=0.012)
leader((1.29, -0.02, FH + 0.08), (1.7, -0.02, FH + 0.08), ter, r=0.011)
box('dose', (0.07, 0.05, 0.07), (1.7, -0.01, FH + 0.08), dose)
box('pc', (0.16, 0.08, 0.12), (1.82, 0, FH + 0.07), pc, bevel=0.006)
# primary: campus cable between the buildings (underground)
leader((-1.68, -0.03, 0.08), (-1.68, -0.03, -0.32), prim, r=0.014)
leader((-1.68, -0.03, -0.32), (1.08, -0.03, -0.32), prim, r=0.014)
leader((1.08, -0.03, -0.32), (1.08, -0.03, 0.08), prim, r=0.014)
# legend
for i, (m, t) in enumerate([(prim, 'Primär (Standort): zwischen Gebäuden, meist LWL'),
                            (sek, 'Sekundär (Gebäude): Steigbereich, LWL oder Kupfer'),
                            (ter, 'Tertiär (Etage): bis zur Anschlussdose, Kupfer')]):
    z = 2.05 - i * 0.14
    leader((0.85, -0.03, z + 0.02), (1.05, -0.03, z + 0.02), m, r=0.014)
    label(t, (1.1, -0.05, z), size=0.045, material=lm)
label('Tertiär: höchstens 90 m fest verlegt + 10 m Patchkabel = 100 m (Switch → Patchpanel → Dose → Endgerät)', (0, -0.05, -0.55), size=0.05, material=lm, align='CENTER')
camera_front((0.05, 0, 0.8), 4.6, tilt=2)
lights(0.6)
