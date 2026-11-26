sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
hdr = mat('hdr', (0.35, 0.38, 0.43), rough=0.5)
new = mat('new', (0.1, 0.32, 0.65), rough=0.5)
esp = mat('esp', (0.68, 0.3, 0.02), rough=0.5)
enc = mat('enc', (0.04, 0.36, 0.18), rough=0.5)
ln = mat('ln', (0.15, 0.2, 0.22), rough=0.9)
gr = mat('grtxt', (0.02, 0.3, 0.12), rough=1.0)
label('IPsec mit ESP: Transportmodus und Tunnelmodus', (0, -0.05, 2.3), size=0.075, material=lm, align='CENTER')


def row(z, x0, fields, title):
    label(title, (x0, -0.05, z + 0.27), size=0.054, material=lm)
    x = x0
    spans = []
    for name, w, m in fields:
        box('f', (w - 0.02, 0.2, 0.36), (x + w / 2, 0, z), m, bevel=0.01)
        label(name, (x + w / 2, -0.11, z + (0.02 if '\n' in name else -0.02)), size=0.046, material=wl, align='CENTER')
        if m is enc:
            spans.append((x, x + w))
        x += w
    a, b = spans[0][0] + 0.02, spans[-1][1] - 0.02
    leader((a, -0.03, z - 0.25), (b, -0.03, z - 0.25), enc, r=0.007)
    leader((a, -0.03, z - 0.25), (a, -0.03, z - 0.2), enc, r=0.007)
    leader((b, -0.03, z - 0.25), (b, -0.03, z - 0.2), enc, r=0.007)
    label('verschlüsselt', ((a + b) / 2, -0.05, z - 0.36), size=0.046, material=gr, align='CENTER')


row(1.55, -2.1, [('IP-Header\nHost A → Host B', 0.95, hdr), ('ESP-\nHeader', 0.5, esp), ('TCP/UDP + Daten', 1.3, enc), ('ESP-\nTrailer', 0.6, enc), ('Prüfwert', 0.55, esp)],
    'Transportmodus: Ende-zu-Ende zwischen zwei Rechnern, der Original-IP-Header bleibt sichtbar')
row(0.55, -2.3, [('neuer IP-Header\nGateway 1 → Gateway 2', 1.05, new), ('ESP-\nHeader', 0.5, esp), ('Original-IP-Header\n10.1.0.5 → 10.2.0.9', 1.05, enc), ('TCP/UDP + Daten', 0.85, enc), ('ESP-\nTrailer', 0.6, enc), ('Prüfwert', 0.55, esp)],
    'Tunnelmodus: zwischen zwei VPN-Gateways (Site-to-Site), das ganze Original-Paket wird verpackt')
label('ESP verschlüsselt die grünen Teile; der Prüfwert schützt ESP-Header bis Trailer vor Veränderung.', (0, -0.05, -0.08), size=0.046, material=lm, align='CENTER')
label('AH sichert nur Integrität und Herkunft, verschlüsselt nicht und verträgt kein NAT.', (0, -0.05, -0.2), size=0.046, material=lm, align='CENTER')
label('Vorher handeln die Partner die Schlüssel mit IKE aus (UDP 500, hinter NAT: UDP 4500). Site-to-Site-VPNs nutzen meist den Tunnelmodus.', (0, -0.05, -0.32), size=0.046, material=lm, align='CENTER')
camera_front((0, 0, 1.05), 4.85, tilt=1)
lights(0.55)
