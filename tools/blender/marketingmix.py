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
label('Marketingmix (4 P) am Beispiel eines IT-Systemhauses', (0, -0.05, 2.12), size=0.08, material=lm, align='CENTER')
tiles = [('Produkt (Product)', ['Was bieten wir an?', 'Managed-Service-Paket,', 'Garantie, Support'], blue),
         ('Preis (Price)', ['Zu welchem Preis?', 'Monatspreis, Staffel,', 'Einführungsrabatt'], orange),
         ('Distribution (Place)', ['Wie zum Kunden?', 'Webshop, Außendienst,', 'Partner'], green),
         ('Kommunikation (Promotion)', ['Wie werben wir?', 'Messe, Newsletter,', 'Referenzen, PR'], grey)]
for i, (t, lines, m) in enumerate(tiles):
    x = -1.06 + (i % 2) * 2.12
    z = 1.5 - (i // 2) * 0.8
    card(x, z, 1.95, 0.68, m, [t] + lines, sizes=(0.066, 0.046))
label('Die vier Instrumente werden aufeinander abgestimmt: Ein Premium-Produkt passt nicht zu Dauerrabatten.', (0, -0.05, 0.22), size=0.047, material=lm, align='CENTER')
camera_front((0, 0, 1.1), 4.4, tilt=1)
lights(0.55)
