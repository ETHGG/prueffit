sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
white = mat('white', (1, 1, 1), emit=1.0)
case = mat('case', (0.55, 0.58, 0.62), metal=0.6, rough=0.35)
cols = {'A': mat('a', (0.2, 0.45, 0.85), rough=0.5), 'B': mat('b', (0.2, 0.62, 0.45), rough=0.5), 'C': mat('c', (0.55, 0.35, 0.8), rough=0.5), 'D': mat('d', (0.95, 0.42, 0.05), rough=0.5)}
def disk(x, blocks, name):
    box('disk', (0.26, 0.2, 0.05), (x, 0, -0.05), case, bevel=0.008)
    label(name, (x, -0.11, -0.16), size=0.045, material=lm, align='CENTER')
    for r, b in enumerate(blocks):
        z = 0.05 + (len(blocks) - 1 - r) * 0.12
        box('blk', (0.22, 0.16, 0.1), (x, 0, z), cols[b[0]], bevel=0.006)
        label(b, (x, -0.09, z - 0.022), size=0.055, material=white, align='CENTER')
groups = [
    (-1.15, 'RAID 0 – Striping', [['A1', 'B1', 'C1'], ['A2', 'B2', 'C2']], 'Kapazität n × K · schnell · 0 Ausfälle'),
    (-0.15, 'RAID 1 – Spiegelung', [['A1', 'B1', 'C1'], ['A1', 'B1', 'C1']], 'Kapazität K · 1 Platte darf ausfallen'),
    (1.05, 'RAID 10 – Spiegel, dann Striping', [['A1', 'B1', 'C1'], ['A1', 'B1', 'C1'], ['A2', 'B2', 'C2'], ['A2', 'B2', 'C2']], 'n/2 × K · 1 Ausfall je Spiegelpaar'),
]
for cx, title, disks, info in groups:
    n = len(disks)
    for i, blocks in enumerate(disks):
        disk(cx + (i - (n - 1) / 2) * 0.3, blocks, f'Platte {i + 1}')
    label(title, (cx, -0.11, 0.48), size=0.065, material=lm, align='CENTER')
    label(info, (cx, -0.11, -0.25), size=0.05, material=lm, align='CENTER')
for x in (0.75, 1.35):
    box('pair', (0.62, 0.01, 0.42), (x, 0.13, 0.15), mat('pairbg', (0.7, 0.75, 0.82), rough=0.9))
label('RAID ist kein Backup: Löschen oder Verschlüsselung durch Ransomware betrifft alle Platten gleichzeitig.', (0.0, -0.11, -0.4), size=0.042, material=lm, align='CENTER')
camera_front((0.05, 0, 0.08), 3.5, tilt=10)
lights(0.8)
