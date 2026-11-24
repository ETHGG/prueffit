sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
hd = mat('hd', (0.1, 0.32, 0.65), rough=0.5)
row = mat('row', (0.8, 0.83, 0.87), rough=0.8)
hit = mat('hit', (0.55, 0.85, 0.6), rough=0.8)
allow = mat('allow', (0.04, 0.36, 0.18), rough=0.5)
deny = mat('deny', (0.75, 0.15, 0.12), rough=0.5)
pk = mat('pk', (0.68, 0.3, 0.02), rough=0.5)
cols = [(-1.75, 'Nr.'), (-1.25, 'Quelle'), (-0.35, 'Ziel'), (0.55, 'Dienst'), (1.25, 'Aktion')]
rules = [('1', 'beliebig', 'Webserver DMZ', 'TCP 443', 'erlauben'),
         ('2', 'beliebig', 'Mailserver DMZ', 'TCP 25', 'erlauben'),
         ('3', 'LAN 10.0.0.0/24', 'beliebig', 'TCP 80, 443', 'erlauben'),
         ('4', 'Admin-PC 10.0.0.5', 'Webserver DMZ', 'TCP 22', 'erlauben'),
         ('5', 'beliebig', 'beliebig', 'alle', 'verweigern')]
TW, RH, z0 = 3.9, 0.19, 1.35
box('head', (TW, 0.05, RH), (0, 0.03, z0), hd)
for x, t in cols:
    label(t, (x, -0.02, z0 - 0.025), size=0.052, material=wl, align='CENTER')
for i, r in enumerate(rules):
    z = z0 - (i + 1) * (RH + 0.02)
    box('r', (TW, 0.05, RH), (0, 0.03, z), hit if i == 4 else row)
    for (x, _), t in zip(cols, r):
        if t in ('erlauben', 'verweigern'):
            box('a', (0.62, 0.04, RH - 0.05), (x, -0.01, z), allow if t == 'erlauben' else deny, bevel=0.01)
            label(t, (x, -0.04, z - 0.022), size=0.048, material=wl, align='CENTER')
        else:
            label(t, (x, -0.02, z - 0.022), size=0.048, material=lm, align='CENTER')
box('pkt', (2.3, 0.1, 0.24), (-0.5, 0, -0.05), pk, bevel=0.012)
label('Paket: Internet → Webserver DMZ, TCP 22 (SSH)', (-0.5, -0.06, -0.075), size=0.05, material=wl, align='CENTER')
label('Regeln 1–4 passen nicht\n→ Regel 5: verweigern', (1.45, -0.04, -0.03), size=0.05, material=lm, align='CENTER')
label('Die Regeln werden von oben nach unten geprüft, die erste passende entscheidet (First Match).', (0, -0.04, -0.4), size=0.05, material=lm, align='CENTER')
label('Am Ende steht „alles verweigern“ (Default Deny); spezielle Regeln gehören nach oben.', (0, -0.04, -0.52), size=0.05, material=lm, align='CENTER')
camera_front((0, 0, 0.5), 4.3, tilt=1)
lights(0.55)
