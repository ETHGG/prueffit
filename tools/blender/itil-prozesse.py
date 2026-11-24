sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
inc = mat('inc', (0.8, 0.2, 0.15), rough=0.5)
prb = mat('prb', (0.68, 0.3, 0.02), rough=0.5)
chg = mat('chg', (0.1, 0.32, 0.65), rough=0.5)
okm = mat('ok', (0.04, 0.36, 0.18), rough=0.5)
ar = mat('arrow', (0.3, 0.33, 0.37), rough=0.6)


def node(x, z, w, h_, m, t, size=0.05):
    box('n', (w, 0.18, h_), (x, 0, z), m, bevel=0.01)
    label(t, (x, -0.1, z + (0.03 if '\n' in t else -0.02)), size=size, material=wl, align='CENTER')


label('Incident', (-1.6, -0.05, 1.6), size=0.075, material=lm, align='CENTER')
label('Problem', (-0.25, -0.05, 1.6), size=0.075, material=lm, align='CENTER')
label('Change', (1.05, -0.05, 1.6), size=0.075, material=lm, align='CENTER')
for i, t in enumerate(['Ticket 1: Drucker\nim 2. OG druckt nicht', 'Ticket 2: Drucker\nim 3. OG druckt nicht', 'Ticket 3: Drucker\nim 4. OG druckt nicht']):
    z = 1.2 - i * 0.42
    node(-1.6, z, 0.82, 0.34, inc, t, size=0.044)
    arrow((-1.18, -0.02, z), (-0.68, -0.02, 0.78), ar, r=0.008, head=0.045)
label('schnell wiederherstellen,\nggf. Workaround (anderer Drucker)', (-1.6, -0.05, 0.1), size=0.044, material=lm, align='CENTER')
node(-0.25, 0.78, 0.82, 0.5, prb, 'gemeinsame Ursache:\nfehlerhaftes\nTreiber-Update', size=0.046)
label('Ursache dauerhaft\nbeseitigen', (-0.25, -0.05, 0.38), size=0.044, material=lm, align='CENTER')
arrow((0.17, -0.02, 0.78), (0.62, -0.02, 0.78), ar, r=0.008, head=0.045)
node(1.05, 0.78, 0.82, 0.5, chg, 'Treiber zurücksetzen:\nbewerten, freigeben\n(CAB), umsetzen', size=0.044)
label('geplante Änderung\nmit Freigabe', (1.05, -0.05, 0.38), size=0.044, material=lm, align='CENTER')
arrow((1.47, -0.02, 0.78), (1.72, -0.02, 0.78), ar, r=0.008, head=0.045)
node(2.0, 0.78, 0.5, 0.34, okm, 'gelöst', size=0.05)
label('Incident Management stellt den Betrieb schnell wieder her, Problem Management sucht die Ursache,', (0.15, -0.05, -0.2), size=0.048, material=lm, align='CENTER')
label('Change Management ändert die Systeme kontrolliert. Ein Service Request (z. B. neues Passwort) ist keine Störung.', (0.15, -0.05, -0.32), size=0.048, material=lm, align='CENTER')
camera_front((0.15, 0, 0.65), 4.6, tilt=2)
lights(0.55)
