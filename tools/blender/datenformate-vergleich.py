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
label('Dieselben Daten als CSV, JSON und XML', (0, -0.05, 2.12), size=0.08, material=lm, align='CENTER')
panels = [('CSV', ['name;ip;ports', 'SW-01;10.0.0.2;24', 'SW-02;10.0.0.3;48'], ['Tabelle, Trennzeichen,', 'keine Datentypen'], grey),
          ('JSON', ['[{"name": "SW-01",', '  "ip": "10.0.0.2",', '  "ports": 24}, …]'], ['Schlüssel-Wert-Paare,', 'Web-APIs'], blue),
          ('XML', ['<switch>', '  <name>SW-01</name>', '  <ports>24</ports>', '</switch>'], ['Tags, verschachtelt,', 'per Schema (XSD) prüfbar'], orange)]
for i, (t, code, notes, m) in enumerate(panels):
    x = -1.42 + i * 1.42
    box('p', (1.32, 0.2, 1.15), (x, 0, 1.15), m, bevel=0.015)
    label(t, (x, -0.11, 1.6), size=0.07, material=wl, align='CENTER')
    for k, c in enumerate(code):
        label(c, (x - 0.58, -0.11, 1.4 - k * 0.11), size=0.042, material=wl)
    for k, n in enumerate(notes):
        label(n, (x, -0.11, 0.78 - k * 0.1), size=0.042, material=wl, align='CENTER')
label('Konfigurationsdateien zusätzlich oft als YAML: gut lesbar, Einrückung statt Klammern, Kommentare mit #.', (0, -0.05, 0.3), size=0.046, material=lm, align='CENTER')
camera_front((0, 0, 1.12), 4.4, tilt=1)
lights(0.55)
