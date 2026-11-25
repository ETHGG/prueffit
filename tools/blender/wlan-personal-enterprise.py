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
label('WLAN-Sicherheit: Personal mit gemeinsamem Passwort, Enterprise mit eigener Anmeldung', (0, -0.05, 2.18), size=0.062, material=lm, align='CENTER')
label('WPA3-Personal (SAE)', (-1.15, -0.05, 1.95), size=0.055, material=lm, align='CENTER')
label('WPA2/3-Enterprise (802.1X)', (1.15, -0.05, 1.95), size=0.055, material=lm, align='CENTER')
for i, x in enumerate((-1.75, -1.15, -0.55)):
    card(x, 1.55, 0.5, 0.36, blue, ['Gerät %d' % (i + 1), 'Passwort X'], sizes=(0.04, 0.032))
card(-1.15, 0.95, 0.8, 0.36, green, ['Access Point', 'kennt Passwort X'], sizes=(0.042, 0.032))
for x in (-1.75, -1.15, -0.55):
    arrow((x, -0.03, 1.36), (-1.15 + (x + 1.15) * 0.3, -0.03, 1.14), ln, r=0.006, head=0.03)
label('Ein Passwort für alle: Verlässt jemand die Firma,', (-1.15, -0.05, 0.58), size=0.034, material=lm, align='CENTER')
label('muss es auf allen Geräten geändert werden.', (-1.15, -0.05, 0.48), size=0.034, material=lm, align='CENTER')
for i, (x, n) in enumerate(((0.55, 'Anna'), (1.15, 'Ben'), (1.75, 'Cem'))):
    card(x, 1.55, 0.5, 0.36, blue, [n, 'eigenes Konto'], sizes=(0.04, 0.032))
card(0.85, 0.95, 0.62, 0.36, green, ['Access Point', 'reicht weiter'], sizes=(0.04, 0.032))
card(1.7, 0.95, 0.62, 0.36, orange, ['RADIUS-Server', 'prüft Konto'], sizes=(0.04, 0.032))
for x in (0.55, 1.15, 1.75):
    arrow((x, -0.03, 1.36), (0.85 + (x - 1.15) * 0.25, -0.03, 1.14), ln, r=0.006, head=0.03)
arrow((1.17, -0.03, 0.95), (1.38, -0.03, 0.95), ln, r=0.006, head=0.03)
label('Jede Person meldet sich einzeln an (Konto oder Zertifikat);', (1.15, -0.05, 0.58), size=0.034, material=lm, align='CENTER')
label('ein Konto lässt sich gezielt sperren – im Unternehmen Standard.', (1.15, -0.05, 0.48), size=0.034, material=lm, align='CENTER')
label('Beide verschlüsseln die Funkstrecke (AES). WEP und WPA mit TKIP gelten als unsicher.', (0, -0.05, 0.22), size=0.036, material=lm, align='CENTER')
camera_front((0, 0, 1.2), 4.5, tilt=1)
lights(0.55)
