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
label('Spanning Tree: Root Bridge und Portrollen', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
P = {'1': (-0.9, 1.75), '2': (-1.75, 0.6), '3': (-0.05, 0.6)}
card(-0.65, 1.75, 1.05, 0.38, green, ['SW1 – Root Bridge', 'Priorität 4096'])
card(-1.50, 0.6, 1.05, 0.38, blue, ['SW2', '32768 · MAC …:01'])
card(0.20, 0.6, 1.05, 0.38, blue, ['SW3', '32768 · MAC …:02'])
def link(a, b, m):
    leader((a[0], 0.02, a[1]), (b[0], 0.02, b[1]), m, r=0.012)
link((-0.90, 1.56), (-1.35, 0.79), ln)
link((-0.40, 1.56), (0.05, 0.79), ln)
link((-0.97, 0.6), (-0.33, 0.6), red)
def port(x, z, t, m):
    box('p', (0.17, 0.08, 0.13), (x, -0.08, z), m, bevel=0.01)
    label(t, (x, -0.13, z - 0.03), size=0.058, material=wl, align='CENTER')
port(-0.92, 1.47, 'D', green); port(-0.38, 1.47, 'D', green)
port(-1.29, 0.88, 'R', orange); port(-0.01, 0.88, 'R', orange)
port(-0.87, 0.6, 'D', green); port(-0.43, 0.6, 'B', red)
label('je 1 Gbit/s, Kosten 4', (-1.50, -0.05, 1.2), size=0.05, material=lm, align='CENTER')
label('blockiert', (-0.65, -0.05, 0.4), size=0.05, material=red, align='CENTER')
lg = [('R', orange, 'Root Port: kürzester Weg zur Root Bridge'),
      ('D', green, 'Designated Port: leitet weiter'),
      ('B', red, 'blockiert (RSTP: Alternate Port)')]
for i, (t, m, s) in enumerate(lg):
    port(0.95, 1.75 - i * 0.25, t, m)
    label(s, (1.1, -0.05, 1.73 - i * 0.25), size=0.05, material=lm)
r = ['1  Root Bridge = kleinste Bridge-ID (zuerst Priorität, bei Gleichstand kleinste MAC)',
     '2  Jeder andere Switch: ein Root Port mit den kleinsten Pfadkosten zur Root Bridge',
     '3  Jede Leitung: ein Designated Port – Seite mit kleineren Kosten zur Root Bridge,',
     '    bei Gleichstand (SW2/SW3: beide 4) die kleinere Bridge-ID → SW2',
     '4  Alle übrigen Ports blockieren; fällt eine Leitung aus, wird neu berechnet']
for i, s in enumerate(r):
    label(s, (-2.1, -0.05, 0.08 - i * 0.12), size=0.052, material=lm)
camera_front((0, 0, 1.0), 4.5, tilt=1)
lights(0.55)
