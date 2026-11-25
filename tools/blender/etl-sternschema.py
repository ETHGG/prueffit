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
import math as _m
label('ETL ins Data Warehouse und Sternschema', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
for k, t in enumerate(['ERP', 'Webshop', 'CRM']):
    card(-1.85, 1.65 - k * 0.38, 0.5, 0.26, grey, [t], sizes=(0.045, 0.04))
    arrow((-1.58, -0.03, 1.65 - k * 0.38), (-1.3, -0.03, 1.27), ln, r=0.005, head=0.035)
card(-1.0, 1.27, 0.55, 0.7, orange, ['Transform', 'bereinigen,', 'vereinheitlichen,', 'verknüpfen'], sizes=(0.045, 0.032))
label('Extract', (-1.45, -0.05, 1.9), size=0.04, material=lm, align='CENTER')
arrow((-0.7, -0.03, 1.27), (-0.42, -0.03, 1.27), ln, r=0.006, head=0.04)
label('Load', (-0.56, -0.05, 1.35), size=0.04, material=lm, align='CENTER')
card(-0.05, 1.27, 0.65, 0.5, blue, ['Data', 'Warehouse'], sizes=(0.05, 0.05))
cx, cz = 1.25, 1.27
card(cx, cz, 0.7, 0.36, orange, ['Fakten: Umsatz', 'Menge, Betrag'], sizes=(0.04, 0.032))
dims = ['Zeit', 'Kunde', 'Produkt', 'Filiale']
for k, t in enumerate(dims):
    a = _m.radians(45 + k * 90)
    x, z = cx + 0.72 * _m.cos(a), cz + 0.55 * _m.sin(a)
    leader((cx + 0.3 * _m.cos(a), -0.02, cz + 0.16 * _m.sin(a)), (x - 0.2 * _m.cos(a), -0.02, z - 0.1 * _m.sin(a)), ln, r=0.005)
    card(x, z, 0.5, 0.24, green, [t], sizes=(0.042, 0.04))
label('Sternschema: Faktentabelle in der Mitte, Dimensionstabellen außen', (cx, -0.05, 0.5), size=0.036, material=lm, align='CENTER')
label('ELT: erst roh laden, dann im Zielsystem umwandeln (z. B. Data Lake in der Cloud).', (0, -0.05, 0.25), size=0.042, material=lm, align='CENTER')
label('Auswerten nach Dimensionen: Drill-down (Jahr → Monat), Slice (nur eine Filiale).', (0, -0.05, 0.12), size=0.042, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
