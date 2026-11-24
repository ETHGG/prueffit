sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
c = [mat('w', (0.1, 0.32, 0.65), rough=0.5), mat('b', (0.04, 0.36, 0.18), rough=0.5), mat('s', (0.62, 0.15, 0.45), rough=0.5)]
ok = mat('ok', (0.04, 0.36, 0.18), rough=0.5)
no = mat('no', (0.75, 0.15, 0.12), rough=0.5)
for i, (t, ex) in enumerate([('Wissen', 'Passwort, PIN,\nSicherheitsfrage'), ('Besitz', 'Smartphone-App,\nChipkarte, Token'), ('Sein', 'Fingerabdruck,\nGesicht')]):
    x = -1.3 + i * 1.3
    box('f', (1.1, 0.2, 0.55), (x, 0, 1.3), c[i], bevel=0.015)
    label(t, (x, -0.11, 1.38), size=0.08, material=wl, align='CENTER')
    label(ex, (x, -0.11, 1.2), size=0.045, material=wl, align='CENTER')
rows = [('Passwort + Code aus der Authenticator-App', 'MFA: Wissen + Besitz', ok),
        ('Chipkarte + PIN', 'MFA: Besitz + Wissen', ok),
        ('Passwort + Sicherheitsfrage', 'keine MFA: zweimal Wissen', no)]
for i, (a, b, m) in enumerate(rows):
    z = 0.6 - i * 0.3
    label(a, (-1.85, -0.05, z - 0.02), size=0.052, material=lm)
    box('r', (1.25, 0.12, 0.22), (1.25, 0, z), m, bevel=0.01)
    label(b, (1.25, -0.07, z - 0.02), size=0.045, material=wl, align='CENTER')
label('Mehr-Faktor-Authentifizierung (MFA) verlangt mindestens zwei Faktoren aus verschiedenen Kategorien.', (0, -0.05, -0.3), size=0.048, material=lm, align='CENTER')
label('Ein gestohlenes Passwort allein reicht dann nicht für die Anmeldung.', (0, -0.05, -0.42), size=0.048, material=lm, align='CENTER')
camera_front((0, 0, 0.6), 4.2, tilt=1)
lights(0.55)
