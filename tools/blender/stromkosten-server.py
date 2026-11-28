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
label('Stromkosten eines Servers im Dauerbetrieb', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
steps = [(blue, ['Leistung', '400 W = 0,4 kW']), (grey, ['× Betriebszeit', '24 h × 365 = 8.760 h']),
         (orange, ['= Energie', '3.504 kWh']), (red, ['× 0,30 €/kWh', '= 1.051,20 € im Jahr'])]
for i, (m, lines) in enumerate(steps):
    x = -1.65 + i * 1.1
    card(x, 1.65, 0.98, 0.44, m, lines)
    if i < 3:
        arrow((x + 0.5, -0.03, 1.65), (x + 0.6, -0.03, 1.65), ln, r=0.01, head=0.04)
t = ['Energie W = P × t (Leistung in kW mal Zeit in h ergibt kWh)',
     'Mit Kühlung und Verteilung (PUE 1,5): 3.504 kWh × 1,5 = 5.256 kWh → 1.576,80 €',
     'Strom aus der Steckdose: I = P ÷ U = 400 W ÷ 230 V ≈ 1,74 A (Netzteil mit cos φ ≈ 1)',
     'Ein effizienteres Gerät mit 300 W spart 876 kWh, also 262,80 € im Jahr.']
for i, s in enumerate(t):
    label(s, (0, -0.05, 1.05 - i * 0.16), size=0.056, material=lm, align='CENTER')
camera_front((0, 0, 1.25), 4.5, tilt=1)
lights(0.55)
