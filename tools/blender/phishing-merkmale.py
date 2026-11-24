sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
paper = mat('paper', (0.86, 0.88, 0.91), rough=0.8)
bar = mat('bar', (0.35, 0.38, 0.43), rough=0.6)
btn = mat('btn', (0.1, 0.32, 0.65), rough=0.5)
red = mat('red', (0.75, 0.15, 0.12), rough=0.5)
att = mat('att', (0.72, 0.75, 0.8), rough=0.6)
box('mail', (2.5, 0.05, 2.0), (-0.75, 0.05, 0.75), paper)
box('bar', (2.5, 0.06, 0.16), (-0.75, 0.03, 1.67), bar)
label('Posteingang – Beispiel (fiktive Bank)', (-1.95, -0.01, 1.65), size=0.045, material=wl)
lines = [(1.48, 'Von: MusterBank Kundenservice <service@musterbank-sicherheit.xyz>', 0.045),
         (1.38, 'Betreff: DRINGEND: Ihr Konto wird gesperrt!', 0.05),
         (1.18, 'Sehr geehrter Kunde,', 0.048),
         (1.06, 'wir haben ungewöhnliche Aktivitäten festgestellt. Bestätigen Sie', 0.045),
         (0.97, 'Ihre Daten innerhalb von 24 Stunden, sonst wird Ihr Konto gesperrt.', 0.045)]
for z, t, s in lines:
    label(t, (-1.92, -0.01, z), size=s, material=lm)
box('btn', (1.1, 0.06, 0.2), (-1.3, 0.02, 0.72), btn, bevel=0.02)
label('Jetzt bestätigen', (-1.3, -0.02, 0.7), size=0.05, material=wl, align='CENTER')
label('Linkziel: http://musterbank.login-check.xyz/…', (-1.92, -0.01, 0.48), size=0.04, material=lm)
box('att', (1.25, 0.06, 0.18), (-1.25, 0.02, 0.22), att, bevel=0.01)
label('Kontoauszug.pdf.exe', (-1.25, -0.02, 0.2), size=0.045, material=lm, align='CENTER')
label('Ihr Sicherheitsteam', (-1.92, -0.01, -0.05), size=0.045, material=lm)
marks = [(1.52, -1.98 + 2.42, 'Absenderdomain passt nicht zur Bank'), (1.42, 0.0, 'Druck und Drohung („DRINGEND“, 24 Stunden)'), (1.22, -0.95, 'unpersönliche Anrede'), (0.52, 0.15, 'Linkziel weicht ab (Maus darüber halten)'), (0.24, -0.45, 'gefährlicher Anhang (doppelte Endung)')]
for i, (z, x, t) in enumerate(marks):
    cyl('m', 0.055, 0.02, (x, -0.04, z), red, rot=(math.radians(90), 0, 0), verts=24)
    label(str(i + 1), (x, -0.06, z - 0.025), size=0.06, material=wl, align='CENTER')
    label(f'{i + 1}  {t}', (0.7, -0.02, 1.45 - i * 0.28), size=0.048, material=lm)
label('Im Zweifel: nicht klicken, Absender über bekannte Wege (Telefon, eigene Lesezeichen) prüfen, IT melden.', (0, -0.02, -0.4), size=0.047, material=lm, align='CENTER')
camera_front((0.25, 0, 0.6), 4.6, tilt=1)
lights(0.55)
