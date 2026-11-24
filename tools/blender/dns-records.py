sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0
)
hd = mat('hd', (0.1, 0.32, 0.65), rough=0.5)
row = mat('row', (0.8, 0.83, 0.87), rough=0.8)
typ = mat('typ', (0.04, 0.36, 0.18), rough=0.5)
label('Zone beispiel.de', (0, -0.05, 1.75), size=0.08, material=lm, align='CENTER')
rows = [('A', 'www.beispiel.de', '203.0.113.10', 'Name → IPv4-Adresse'),
        ('AAAA', 'www.beispiel.de', '2001:db8::10', 'Name → IPv6-Adresse'),
        ('CNAME', 'shop.beispiel.de', 'www.beispiel.de', 'Alias auf einen anderen Namen'),
        ('MX', 'beispiel.de', '10 mail.beispiel.de', 'zuständiger Mailserver (Priorität)'),
        ('TXT', 'beispiel.de', 'v=spf1 mx -all', 'Text, z. B. SPF gegen gefälschte Absender'),
        ('PTR', '10.113.0.203.in-addr.arpa', 'www.beispiel.de', 'Rückwärtsauflösung IP → Name')]
TW, RH, z0 = 4.1, 0.19, 1.45
box('h', (TW, 0.05, RH), (0, 0.03, z0), hd)
for x, t in [(-1.75, 'Typ'), (-0.85, 'Name'), (0.25, 'Wert'), (1.3, 'Zweck')]:
    label(t, (x, -0.02, z0 - 0.025), size=0.05, material=wl, align='CENTER')
for i, (t, n, v, z_) in enumerate(rows):
    z = z0 - (i + 1) * (RH + 0.02)
    box('r', (TW, 0.05, RH), (0, 0.03, z), row)
    box('t', (0.5, 0.04, RH - 0.04), (-1.75, -0.01, z), typ, bevel=0.01)
    label(t, (-1.75, -0.04, z - 0.022), size=0.048, material=wl, align='CENTER')
    label(n, (-0.85, -0.02, z - 0.022), size=0.04, material=lm, align='CENTER')
    label(v, (0.25, -0.02, z - 0.022), size=0.042, material=lm, align='CENTER')
    label(z_, (1.3, -0.02, z - 0.022), size=0.038, material=lm, align='CENTER')
label('Beispieladressen aus den Dokumentationsbereichen; jeder Eintrag hat zusätzlich eine TTL (Gültigkeit im Cache).', (0, -0.04, -0.12), size=0.045, material=lm, align='CENTER')
camera_front((0, 0, 0.82), 4.4, tilt=1)
lights(0.55)
