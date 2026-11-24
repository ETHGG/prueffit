sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
data = mat('data', (0.38, 0.41, 0.46), rough=0.6)
tcp = mat('tcp', (0.04, 0.36, 0.18), rough=0.5)
ip = mat('ip', (0.1, 0.32, 0.65), rough=0.5)
eth = mat('eth', (0.68, 0.3, 0.02), rough=0.5)
H = 0.26


def seg(x0, w, z, m, t, size=0.05):
    box('s', (w - 0.01, 0.2, H), (x0 + w / 2, 0, z), m, bevel=0.008)
    label(t, (x0 + w / 2, -0.11, z - 0.022), size=size, material=wl, align='CENTER')


D0, DW = 0.4, 1.0
rows = [('Schicht 5–7 Anwendung', 'Daten', []),
        ('Schicht 4 Transport', 'Segment', [(tcp, 'TCP-Header\n(Ports)', 0.55)]),
        ('Schicht 3 Vermittlung', 'Paket', [(ip, 'IP-Header\n(IP-Adressen)', 0.55), (tcp, 'TCP-Header', 0.55)]),
        ('Schicht 2 Sicherung', 'Frame', [(eth, 'Ethernet-Header\n(MAC-Adressen)', 0.62), (ip, 'IP-Header', 0.55), (tcp, 'TCP-Header', 0.55)])]
for i, (layer, unit, headers) in enumerate(rows):
    z = 1.5 - i * 0.42
    label(layer, (-2.15, -0.05, z + 0.02), size=0.05, material=lm)
    label(unit, (-2.15, -0.05, z - 0.08), size=0.05, material=mat('unit', (0.5, 0.2, 0.02), rough=1.0))
    x = D0
    for m, t, w in reversed(headers):
        x -= w
    xx = x
    for m, t, w in headers:
        seg(xx, w, z, m, t, size=0.042)
        xx += w
    seg(D0, DW, z, data, 'Daten (z. B. HTTP)')
    if unit == 'Frame':
        seg(D0 + DW, 0.4, z, eth, 'FCS', size=0.045)
label('Schicht 1: Bits auf dem Medium', (-2.15, -0.05, -0.18), size=0.05, material=lm)
for k in range(28):
    box('b', (0.05, 0.05, 0.08 if k % 3 else 0.14), (-0.9 + k * 0.1, 0, -0.16), eth if k % 2 else data)
label('Beim Senden fügt jede Schicht ihren Header hinzu (Kapselung), beim Empfang wird er wieder entfernt.', (0, -0.05, -0.5), size=0.05, material=lm, align='CENTER')
label('FCS = Prüfsumme des Frames (Fehlererkennung).', (0, -0.05, -0.62), size=0.05, material=lm, align='CENTER')
camera_front((0, 0, 0.6), 4.6, tilt=1)
lights(0.55)
