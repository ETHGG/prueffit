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
label('Zentrale Protokollierung: Syslog-Server und SIEM', (0, -0.05, 2.1), size=0.08, material=lm, align='CENTER')
src = [('Server', 1.65), ('Firewall', 1.25), ('Switches', 0.85), ('Clients', 0.45)]
for t, z in src:
    card(-1.65, z, 0.8, 0.3, grey, [t])
    arrow((-1.23, -0.02, z), (-0.62, -0.02, 1.05 + (z - 1.05) * 0.35), ln, r=0.008, head=0.05)
label('Syslog: UDP/TCP 514,', (-0.95, -0.05, 1.98 - 0.08), size=0.04, material=lm, align='CENTER')
label('mit TLS: TCP 6514', (-0.95, -0.05, 1.82 - 0.08), size=0.04, material=lm, align='CENTER')
card(0.0, 1.05, 1.15, 0.95, blue, ['Log-Server / SIEM', 'sammelt und speichert', 'korreliert Ereignisse', 'erkennt Muster'], sizes=(0.065, 0.045))
outs = [('Alarm an Admin', 1.55, red), ('Auswertung, Berichte', 1.05, green), ('Aufbewahrung, Beweise', 0.55, orange)]
for t, z, m in outs:
    card(1.6, z, 1.05, 0.32, m, [t], sizes=(0.05, 0.04))
    arrow((0.6, -0.02, 1.05 + (z - 1.05) * 0.35), (1.06, -0.02, z), ln, r=0.008, head=0.05)
label('Beispiel: 50 fehlgeschlagene Anmeldungen in 2 Minuten von einer Adresse → SIEM meldet möglichen Brute-Force-Angriff.', (0, -0.05, 0.12), size=0.046, material=lm, align='CENTER')
label('Uhrzeit aller Geräte per NTP synchron halten; Logs enthalten oft personenbezogene Daten: Zugriff und Speicherdauer regeln.', (0, -0.05, -0.02), size=0.046, material=lm, align='CENTER')
camera_front((0, 0, 1.02), 4.4, tilt=1)
lights(0.55)
