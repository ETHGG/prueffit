sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
person = mat('person', (0.68, 0.3, 0.02), rough=0.5)
dev = mat('dev', (0.1, 0.32, 0.65), rough=0.5)
lic = mat('lic', (0.04, 0.36, 0.18), rough=0.5)
ln = mat('ln', (0.3, 0.33, 0.37), rough=0.6)


def human(x, z, s=1.0):
    cyl('head', 0.07 * s, 0.05, (x, 0, z + 0.2 * s), person, rot=(math.radians(90), 0, 0), verts=32)
    box('body', (0.18 * s, 0.08, 0.22 * s), (x, 0, z), person, bevel=0.03)


label('Benutzer-CAL', (-1.15, -0.05, 1.75), size=0.08, material=lm, align='CENTER')
label('Geräte-CAL', (1.15, -0.05, 1.75), size=0.08, material=lm, align='CENTER')
human(-1.15, 1.2)
label('Außendienstlerin', (-1.15, -0.05, 0.98), size=0.045, material=lm, align='CENTER')
for i, t in enumerate(['Laptop', 'Tablet', 'Smartphone']):
    x = -1.75 + i * 0.6
    box('d', (0.42, 0.1, 0.26), (x, 0, 0.55), dev, bevel=0.012)
    label(t, (x, -0.06, 0.53), size=0.042, material=wl, align='CENTER')
    leader((-1.15, -0.02, 0.95), (x, -0.02, 0.69), ln, r=0.006)
box('l1', (1.1, 0.1, 0.24), (-1.15, 0, 0.1), lic, bevel=0.012)
label('1 Benutzer-CAL', (-1.15, -0.06, 0.08), size=0.055, material=wl, align='CENTER')
label('eine Person, beliebig viele Geräte', (-1.15, -0.05, -0.15), size=0.045, material=lm, align='CENTER')
for i, t in enumerate(['Früh', 'Spät', 'Nacht']):
    x = 0.55 + i * 0.6
    human(x, 1.2, 0.9)
    label(t, (x, -0.05, 0.98), size=0.045, material=lm, align='CENTER')
    leader((x, -0.02, 0.95), (1.15, -0.02, 0.69), ln, r=0.006)
box('pc', (0.6, 0.1, 0.26), (1.15, 0, 0.55), dev, bevel=0.012)
label('Leitstand-PC', (1.15, -0.06, 0.53), size=0.042, material=wl, align='CENTER')
box('l2', (1.1, 0.1, 0.24), (1.15, 0, 0.1), lic, bevel=0.012)
label('1 Geräte-CAL', (1.15, -0.06, 0.08), size=0.055, material=wl, align='CENTER')
label('ein Gerät, beliebig viele Personen', (1.15, -0.05, -0.15), size=0.045, material=lm, align='CENTER')
leader((0, -0.01, 1.8), (0, -0.01, -0.2), mat('sep', (0.6, 0.63, 0.67), rough=0.8), r=0.005)
label('Eine CAL (Client Access License) erlaubt den Zugriff auf eine Serversoftware; die Serverlizenz selbst kommt dazu.', (0, -0.05, -0.45), size=0.046, material=lm, align='CENTER')
camera_front((0, 0, 0.65), 4.3, tilt=1)
lights(0.55)
