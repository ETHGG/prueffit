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
label('Speicherhierarchie: schnell und klein oben, groß und günstig unten', (0, -0.05, 2.15), size=0.072, material=lm, align='CENTER')
lv = [('Register', 'unter 1 ns', 'Bytes', red),
      ('Cache L1–L3 (SRAM)', 'ca. 1–40 ns', 'KB–MB', orange),
      ('Arbeitsspeicher (DRAM)', 'ca. 100 ns', 'GB', orange),
      ('SSD (NVMe)', 'ca. 0,02–0,1 ms', 'TB', blue),
      ('Festplatte (HDD)', 'ca. 5–10 ms', 'TB', blue),
      ('Magnetband', 'Sekunden bis Minuten', 'viele TB je Band', grey)]
n = len(lv)
for i, (t, lat, cap, m) in enumerate(lv):
    z = 1.82 - i * 0.27
    w = 0.7 + i * 0.33
    box('p', (w, 0.2, 0.23), (-0.55, 0, z), m, bevel=0.01)
    label(t, (-0.55, -0.11, z - 0.025), size=0.045, material=wl, align='CENTER')
    label(lat, (0.75, -0.05, z - 0.02), size=0.042, material=lm)
    label(cap, (1.6, -0.05, z - 0.02), size=0.042, material=lm)
label('Zugriffszeit', (0.75, -0.05, 2.0), size=0.045, material=lm)
label('Größe', (1.6, -0.05, 2.0), size=0.045, material=lm)
leader((-1.95, -0.03, 1.145), (0.6, -0.03, 1.145), red, r=0.004)
label('flüchtig', (-1.98, -0.05, 1.18), size=0.038, material=red)
label('nicht flüchtig', (-1.98, -0.05, 1.05), size=0.038, material=red)
arrow((-2.05, -0.02, 0.4), (-2.05, -0.02, 1.85), ln, r=0.006, head=0.05)
label('schneller,', (-1.98, -0.05, 1.75), size=0.034, material=lm)
label('teurer je GB', (-1.98, -0.05, 1.69), size=0.034, material=lm)
label('Werte gerundet; der Cache hält oft gebrauchte Daten nah an der CPU, damit sie selten auf den RAM warten muss.', (0, -0.05, 0.12), size=0.04, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
