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
label('Link-Aggregation (LACP): mehrere Leitungen als ein logischer Link', (0, -0.05, 2.1), size=0.075, material=lm, align='CENTER')
for z, t in [(1.6, 'Core-Switch'), (0.55, 'Access-Switch')]:
    box('sw', (2.75, 0.5, 0.18), (-0.33, 0.1, z), grey, bevel=0.01)
    label(t, (-1.62, -0.16, z - 0.03), size=0.06, material=wl)
    for p in range(12):
        box('port', (0.11, 0.05, 0.08), (-0.6 + p * 0.14, -0.16, z), lm)
xs = [0.0, 0.14, 0.28, 0.42]
for k, x in enumerate(xs):
    m = blue if k < 3 else red
    leader((-0.6 + 4 * 0.14 + x - 0.42 + 0.0, -0.2, 0.62), (-0.6 + 4 * 0.14 + x - 0.42, -0.2, 1.53), m, r=0.018)
label('4 × 1 Gbit/s', (0.25, -0.2, 1.12), size=0.06, material=lm)
label('= bis zu 4 Gbit/s gesamt', (0.25, -0.2, 0.99), size=0.05, material=lm)
label('fällt eine Leitung aus (rot),', (0.25, -0.2, 0.86), size=0.045, material=red)
label('laufen die anderen weiter', (0.25, -0.2, 0.75), size=0.045, material=red)
label('Lastverteilung per Hash über MAC-/IP-Adressen oder Ports: Ein einzelner Datenstrom nutzt nur eine Leitung (max. 1 Gbit/s).', (0, -0.05, 0.2), size=0.046, material=lm, align='CENTER')
label('Beide Seiten müssen LACP (IEEE 802.1AX, früher 802.3ad) sprechen; bei gestapelten Switches auch über zwei Geräte verteilt.', (0, -0.05, 0.06), size=0.046, material=lm, align='CENTER')
camera_front((0, 0, 1.05), 4.4, tilt=1)
lights(0.55)
