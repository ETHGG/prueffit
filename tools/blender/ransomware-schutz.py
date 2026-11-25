sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
atk = mat('atk', (0.72, 0.16, 0.12), rough=0.5)
dfn = mat('dfn', (0.1, 0.32, 0.65), rough=0.5)
key = mat('key', (0.04, 0.4, 0.18), rough=0.5)
ar = mat('ar', (0.3, 0.33, 0.37), rough=0.6)
steps = [
    (['1  Einfallstor', 'Phishing-Mail oder', 'ungepatchte Lücke'], ['Schulung, Mailfilter,', 'Updates, MFA für', 'Fernzugänge']),
    (['2  Ausführung', 'Schadcode startet,', 'lädt Werkzeuge nach'], ['Virenschutz mit', 'Verhaltenserkennung,', 'Makros sperren']),
    (['3  Ausbreitung', 'Adminrechte holen,', 'weitere Rechner'], ['Netz segmentieren,', 'minimale Rechte,', 'eigene Admin-Konten']),
    (['4  Sicherungen', 'löschen oder', 'mit verschlüsseln'], ['Offline- oder', 'unveränderbare', 'Sicherungen (3-2-1)']),
    (['5  Erpressung', 'Daten verschlüsselt,', 'oft vorher kopiert'], ['Notfallplan,', 'Wiederherstellung', 'regelmäßig testen']),
]
label('Angriffskette', (-2.25, -0.05, 1.92), size=0.06, material=lm)
label('Gegenmaßnahmen', (-2.25, -0.05, 1.0), size=0.06, material=lm)
for i, (a, d) in enumerate(steps):
    x = -1.84 + i * 0.92
    box('a', (0.84, 0.2, 0.5), (x, 0, 1.55), atk, bevel=0.012)
    for k, t in enumerate(a):
        label(t, (x, -0.11, 1.68 - k * 0.13), size=0.05 if k == 0 else 0.041, material=wl, align='CENTER')
    if i < 4:
        arrow((x + 0.43, -0.02, 1.55), (x + 0.5, -0.02, 1.55), ar, r=0.012, head=0.05)
    box('d', (0.84, 0.2, 0.46), (x, 0, 0.6), key if i == 3 else dfn, bevel=0.012)
    for k, t in enumerate(d):
        label(t, (x, -0.11, 0.7 - k * 0.13), size=0.041, material=wl, align='CENTER')
    arrow((x, -0.02, 0.84), (x, -0.02, 1.29), ar, r=0.012, head=0.06)
label('Jede Stufe ist eine Chance, den Angriff zu stoppen. Gegen den Schaden hilft am Ende nur eine Sicherung,', (0, -0.05, 0.12), size=0.045, material=lm, align='CENTER')
label('die der Angreifer nicht erreichen kann (grün). Lösegeld garantiert weder Entschlüsselung noch, dass kopierte Daten geheim bleiben.', (0, -0.05, 0.0), size=0.045, material=lm, align='CENTER')
camera_front((0, 0, 1.0), 4.7, tilt=1)
lights(0.55)
