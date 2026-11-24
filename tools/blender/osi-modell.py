sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
white = mat('white', (1, 1, 1), emit=1.0)
layers = [
    ('7', 'Anwendung', 'Application', 'HTTP(S), DNS, SMTP, IMAP', '', (0.55, 0.25, 0.55)),
    ('6', 'Darstellung', 'Presentation', 'Kodierung, Kompression,', 'Verschlüsselung (z. B. TLS)', (0.6, 0.3, 0.6)),
    ('5', 'Sitzung', 'Session', 'Sitzungen auf- und abbauen', '', (0.65, 0.35, 0.65)),
    ('4', 'Transport', 'Transport', 'TCP, UDP – Ports', '', (0.25, 0.45, 0.8)),
    ('3', 'Vermittlung', 'Network', 'IP, ICMP – Router,', 'Layer-3-Switch', (0.2, 0.55, 0.55)),
    ('2', 'Sicherung', 'Data Link', 'Ethernet, MAC-Adressen –', 'klassischer Switch, Bridge, WLAN-AP', (0.25, 0.6, 0.35)),
    ('1', 'Bitübertragung', 'Physical', 'Kabel, Funk, Stecker –', 'Hub, Repeater, Medienkonverter', (0.55, 0.55, 0.25)),
]
H = 0.2
for i, (n, de, en, d1, d2, col) in enumerate(layers):
    z = (6 - i) * H + H / 2
    box(f'L{n}', (1.0, 0.45, H * 0.9), (-0.2, 0, z), mat(f'm{n}', col, rough=0.5), bevel=0.015)
    label(f'{n}  {de}', (-0.66, -0.23, z - 0.02), size=0.072, material=white)
    label(en, (0.26, -0.23, z - 0.015), size=0.05, material=white, align='RIGHT')
    label(d1, (0.42, -0.23, z + (0.0 if d2 else -0.015)), size=0.05, material=lm)
    if d2:
        label(d2, (0.42, -0.23, z - 0.06), size=0.05, material=lm)
# TCP/IP model brackets on the left
groups = [('Anwendung', 0, 3), ('Transport', 3, 4), ('Internet', 4, 5), ('Netzzugang', 5, 7)]
gm = mat('group', (0.3, 0.33, 0.36), rough=0.6)
for name, a, b in groups:
    top = (7 - a) * H - 0.035
    bot = (7 - b) * H + 0.035
    box('br', (0.03, 0.2, top - bot), (-0.8, 0, (top + bot) / 2), gm)
    label(name, (-0.84, -0.12, (top + bot) / 2 - 0.02), size=0.05, material=lm, align='RIGHT')
label('TCP/IP', (-0.84, -0.12, 1.47), size=0.055, material=lm, align='RIGHT')
label('OSI-Modell', (-0.66, -0.12, 1.47), size=0.055, material=lm)
label('Protokolle und Geräte', (0.42, -0.12, 1.47), size=0.055, material=lm)
label('Ein Layer-3-Switch arbeitet auf Schicht 2 und kann zusätzlich routen (Schicht 3).', (-1.45, -0.12, -0.13), size=0.06, material=lm)
camera_front((0.05, 0, 0.7), 3.1, tilt=12)
lights(0.9)
