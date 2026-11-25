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
label('Automatisierungspyramide (vereinfacht)', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
lv = [('Feld', 'Sensoren, Aktoren', green, 'Echtzeit, Millisekunden'),
      ('Steuerung', 'SPS', green, 'Feldbus, Industrial Ethernet'),
      ('Prozessleitung', 'Leitstand, Visualisierung', blue, 'OPC UA, MQTT'),
      ('Betriebsleitung', 'Produktionsplanung (MES)', blue, ''),
      ('Unternehmen', 'ERP', orange, 'Stunden, Tage')]
for i, (t, ex, m, note) in enumerate(lv):
    z = 0.55 + i * 0.29
    w = 2.5 - i * 0.45
    box('p', (w, 0.2, 0.25), (-0.6, 0, z), m, bevel=0.01)
    label(t, (-0.6, -0.11, z - 0.025), size=0.045, material=wl, align='CENTER')
    leader((-0.6 + w / 2 + 0.03, -0.03, z), (0.85, -0.03, z), ln, r=0.003)
    label(ex, (0.9, -0.05, z + 0.01), size=0.04, material=lm)
    if note:
        label(note, (0.9, -0.05, z - 0.07), size=0.032, material=lm)
arrow((-2.0, -0.02, 0.45), (-2.0, -0.02, 1.85), ln, r=0.006, head=0.05)
label('mehr Daten,', (-1.95, -0.05, 1.95), size=0.034, material=lm)
label('langsamer', (-1.95, -0.05, 1.89), size=0.034, material=lm)
label('In der OT zählt zuerst Verfügbarkeit (und die Sicherheit von Menschen); Updates nur in Wartungsfenstern.', (0, -0.05, 0.18), size=0.04, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
