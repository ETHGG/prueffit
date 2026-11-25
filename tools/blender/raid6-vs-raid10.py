sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
ok = mat('ok', (0.1, 0.32, 0.65), rough=0.5)
bad = mat('bad', (0.75, 0.15, 0.12), rough=0.5)
grn = mat('grn', (0.04, 0.4, 0.18), rough=0.5)
br = mat('br', (0.35, 0.38, 0.43), rough=0.6)
rows = [
    ('RAID 6 (4 Platten, doppelte Parität): Platten 2 und 4 fallen aus',
     [(-1.75, 'Platte 1', ok), (-1.25, 'defekt', bad), (-0.75, 'Platte 3', ok), (-0.25, 'defekt', bad)], None,
     grn, 'läuft weiter', 'zwei beliebige Platten dürfen ausfallen'),
    ('RAID 10 (2 Spiegel, darüber Striping): je eine Platte aus Spiegel A und B fällt aus',
     [(-1.8, 'A1', ok), (-1.35, 'A2 defekt', bad), (-0.75, 'B1 defekt', bad), (-0.3, 'B2', ok)], True,
     grn, 'läuft weiter', 'jeder Spiegel hat noch eine Kopie'),
    ('RAID 10: beide Platten von Spiegel A fallen aus',
     [(-1.8, 'A1 defekt', bad), (-1.35, 'A2 defekt', bad), (-0.75, 'B1', ok), (-0.3, 'B2', ok)], True,
     bad, 'Daten verloren', 'die Hälfte jedes Stripes fehlt'),
]
for i, (title, disks, mirrors, rm, rt, rd) in enumerate(rows):
    z = 1.5 - i * 0.72
    label(title, (-2.05, -0.05, z + 0.24), size=0.05, material=lm)
    for x, t, m in disks:
        box('d', (0.42, 0.2, 0.3), (x, 0, z), m, bevel=0.01)
        label(t, (x, -0.11, z - 0.015), size=0.04, material=wl, align='CENTER')
    if mirrors:
        for x0, x1, t in [(-1.8, -1.35, 'Spiegel A'), (-0.75, -0.3, 'Spiegel B')]:
            box('m', (x1 - x0 + 0.42, 0.04, 0.03), ((x0 + x1) / 2, 0, z - 0.2), br)
            label(t, ((x0 + x1) / 2, -0.05, z - 0.3), size=0.038, material=lm, align='CENTER')
    box('r', (0.6, 0.2, 0.2), (0.35, 0, z), rm, bevel=0.01)
    label('OK' if rm is grn else 'Verlust', (0.35, -0.11, z - 0.015), size=0.045, material=wl, align='CENTER')
    label(rt, (0.75, -0.05, z + 0.02), size=0.05, material=lm)
    label(rd, (0.75, -0.05, z - 0.08), size=0.042, material=lm)
label('Bei 4 Platten haben beide 50 % Nutzkapazität. RAID 6 übersteht garantiert 2 beliebige Ausfälle, schreibt aber langsamer (doppelte Parität).', (0, -0.05, -0.42), size=0.043, material=lm, align='CENTER')
label('RAID 10 schreibt und baut schneller neu auf, übersteht aber garantiert nur 1 Ausfall – mehr nur, wenn verschiedene Spiegel betroffen sind.', (0, -0.05, -0.52), size=0.043, material=lm, align='CENTER')
camera_front((-0.05, 0, 0.62), 4.3, tilt=1)
lights(0.55)
