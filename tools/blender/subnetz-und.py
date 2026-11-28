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
label('Netzadresse = IP-Adresse UND Subnetzmaske (bitweise)', (0, -0.05, 2.15), size=0.07, material=lm, align='CENTER')
rows = [('IP-Adresse', '192.168.10.77', '0100 1101', blue), ('Maske /26', '255.255.255.192', '1100 0000', orange), ('UND = Netzadresse', '192.168.10.64', '0100 0000', green)]
for i, (a, b, c, m) in enumerate(rows):
    z = 1.7 - i * 0.42
    card(-1.35, z, 1.1, 0.32, m, [a], sizes=(0.062, 0.05))
    label(b, (-0.2, -0.05, z - 0.02), size=0.058, material=lm, align='CENTER')
    label('letztes Oktett: ' + c, (1.2, -0.05, z - 0.02), size=0.058, material=lm, align='CENTER')
box('line', (3.9, 0.02, 0.012), (0.1, 0, 1.075), ln)
label('UND: nur wo beide Bits 1 sind, bleibt eine 1 – die Hostbits (hier die letzten 6) werden zu 0.', (0, -0.05, 0.62), size=0.058, material=lm, align='CENTER')
label('Broadcast: alle Hostbits auf 1 → 0111 1111 = 127 · nutzbare Hosts .65 bis .126 (62 Stück)', (0, -0.05, 0.48), size=0.058, material=lm, align='CENTER')
label('Schneller im Kopf: Blockgröße 256 − 192 = 64 → Netze bei 0, 64, 128, 192; 77 liegt im Block ab 64.', (0, -0.05, 0.34), size=0.058, material=lm, align='CENTER')
camera_front((0, 0, 1.2), 4.5, tilt=1)
lights(0.55)
