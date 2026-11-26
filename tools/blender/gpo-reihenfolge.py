sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
grey = mat('grey', (0.35, 0.38, 0.43), rough=0.5)
site = mat('site', (0.45, 0.3, 0.7), rough=0.5)
dom = mat('dom', (0.1, 0.32, 0.65), rough=0.5)
ou = mat('ou', (0.04, 0.36, 0.18), rough=0.5)
res = mat('res', (0.68, 0.3, 0.02), rough=0.5)
ln = mat('ln', (0.15, 0.2, 0.22), rough=0.9)
label('Gruppenrichtlinien (GPO): Reihenfolge der Anwendung', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
layers = [('1  Lokal', 'auf dem PC selbst', 'Bildschirmsperre: nicht gesetzt', grey),
          ('2  Standort', 'z. B. Standort Magdeburg', 'Bildschirmsperre: nicht gesetzt', site),
          ('3  Domäne', 'firma.local', 'Bildschirmsperre nach 15 Min.', dom),
          ('4  OU', 'OU Vertrieb (Unter-OUs danach)', 'Bildschirmsperre nach 5 Min.', ou)]
for i, (name, sub, setting, m) in enumerate(layers):
    z = 1.75 - i * 0.42
    x = -1.05 + i * 0.12
    box('l', (2.0, 0.25 - i * 0.02, 0.32), (x, 0.0, z), m, bevel=0.02)
    label(name, (x - 0.92, -0.14, z + 0.02), size=0.062, material=wl)
    label(sub, (x - 0.92, -0.14, z - 0.1), size=0.042, material=wl)
    label(setting, (x + 0.92, -0.14, z - 0.035), size=0.05, material=wl, align='RIGHT')
arrow((-2.2, -0.03, 1.85), (-2.2, -0.03, 0.4), ln, r=0.012, head=0.07)
label('zuerst', (-2.2, -0.05, 1.92), size=0.045, material=lm, align='CENTER')
label('zuletzt', (-2.2, -0.05, 0.26), size=0.045, material=lm, align='CENTER')
box('r', (1.25, 0.2, 0.62), (1.55, 0, 1.0), res, bevel=0.02)
for k, (t, s) in enumerate([('Ergebnis für einen PC', 0.05), ('in der OU Vertrieb:', 0.05), ('Sperre nach 5 Min.', 0.06), ('Bei Widerspruch gewinnt', 0.042), ('die zuletzt angewendete GPO', 0.042)]):
    label(t, (1.55, -0.11, 1.2 - k * 0.1 - (0.02 if k >= 3 else 0)), size=s, material=wl, align='CENTER')
arrow((0.4, -0.03, 0.52), (0.9, -0.03, 0.8), res, r=0.01, head=0.06)
label('Varianten: „Erzwungen“ (Enforced) an einer GPO verhindert, dass tiefere Ebenen sie überschreiben.', (0, -0.05, 0.1), size=0.048, material=lm, align='CENTER')
label('„Vererbung deaktivieren“ an einer OU hält GPOs höherer Ebenen fern – erzwungene GPOs wirken trotzdem.', (0, -0.05, -0.05), size=0.048, material=lm, align='CENTER')
label('Computer-Einstellungen greifen beim Start, Benutzer-Einstellungen bei der Anmeldung (danach regelmäßig neu).', (0, -0.05, -0.18), size=0.048, material=lm, align='CENTER')
camera_front((0, 0, 1.0), 4.6, tilt=1)
lights(0.55)
