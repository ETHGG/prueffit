sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
blue = mat('blue', (0.1, 0.32, 0.65), rough=0.5)
orange = mat('orange', (0.68, 0.3, 0.02), rough=0.5)
green = mat('green', (0.04, 0.4, 0.18), rough=0.5)
grey = mat('grey', (0.28, 0.32, 0.36), rough=0.6)
red = mat('red', (0.75, 0.15, 0.12), rough=0.5)
ln = mat('ln', (0.15, 0.2, 0.22), rough=0.9)
def card(x, z, w, h, m, lines, sizes=(0.062, 0.05)):
    box('c', (w, 0.2, h), (x, 0, z), m, bevel=0.015)
    n = len(lines)
    for i, t in enumerate(lines):
        s = sizes[0] if i == 0 else sizes[1]
        dz = (n - 1) * 0.06 - i * 0.12
        label(t, (x, -0.11, z + dz - s / 3), size=s, material=wl, align='CENTER')
label('E-Mail-Absender prüfen: SPF, DKIM und DMARC', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
card(-1.55, 1.55, 0.85, 0.6, blue, ['Mailserver', 'beispiel.de', 'signiert (DKIM)'], sizes=(0.062, 0.05))
card(0.2, 1.55, 0.85, 0.6, blue, ['Mailserver', 'des Empfängers', 'prüft'], sizes=(0.062, 0.05))
arrow((-1.1, -0.03, 1.55), (-0.25, -0.03, 1.55), ln, r=0.009, head=0.05)
label('SMTP (TLS)', (-0.68, -0.05, 1.62), size=0.058, material=lm, align='CENTER')
box('dns', (2.2, 0.2, 0.62), (-0.65, 0, 0.55), grey, bevel=0.015)
label('DNS der Absenderdomain (TXT-Einträge)', (-0.65, -0.11, 0.76), size=0.058, material=wl, align='CENTER')
recs = [('SPF', 'Darf diese IP für', 'beispiel.de senden?'), ('DKIM', 'Passt die Signatur zum', 'öffentlichen Schlüssel?'), ('DMARC', 'Was tun bei Fehlschlag?', 'Passt die Domain zu „From“?')]
for k, (t, a, b) in enumerate(recs):
    x = -1.35 + k * 0.7
    label(t, (x, -0.11, 0.6), size=0.058, material=wl, align='CENTER')
    label(a, (x, -0.11, 0.5), size=0.058, material=wl, align='CENTER')
    label(b, (x, -0.11, 0.43), size=0.058, material=wl, align='CENTER')
    leader((0.2, -0.03, 1.24), (x, -0.03, 0.88), ln, r=0.004)
res = [('zustellen', green, 'alles bestanden'), ('Spam-Ordner', orange, 'quarantine'), ('abweisen', red, 'reject')]
for k, (t, m, s) in enumerate(res):
    card(1.45, 1.75 - k * 0.42, 0.75, 0.32, m, [t, s], sizes=(0.062, 0.05))
    leader((0.63, -0.03, 1.55), (1.06, -0.03, 1.75 - k * 0.42), ln, r=0.004)
label('DMARC besteht, wenn SPF oder DKIM besteht UND die geprüfte Domain zur sichtbaren Absenderadresse passt.', (0, -0.05, 0.05), size=0.058, material=lm, align='CENTER')
label('Richtlinie p=none | quarantine | reject, dazu Berichte an den Domaininhaber (rua).', (0, -0.05, -0.07), size=0.058, material=lm, align='CENTER')
camera_front((0, 0, 1.0), 4.4, tilt=1)
lights(0.55)
