sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
blue = mat('blue', (0.1, 0.32, 0.65), rough=0.5)
orange = mat('orange', (0.68, 0.3, 0.02), rough=0.5)
green = mat('green', (0.04, 0.4, 0.18), rough=0.5)
grey = mat('grey', (0.28, 0.32, 0.36), rough=0.6)
red = mat('red', (0.75, 0.15, 0.12), rough=0.5)
ln = mat('ln', (0.15, 0.2, 0.22), rough=0.9)
def card(x, z, w, h, m, lines, sizes=(0.06, 0.042)):
    box('c', (w, 0.2, h), (x, 0, z), m, bevel=0.015)
    n = len(lines)
    for i, t in enumerate(lines):
        s = sizes[0] if i == 0 else sizes[1]
        dz = (n - 1) * 0.06 - i * 0.12
        label(t, (x, -0.11, z + dz - s / 3), size=s, material=wl, align='CENTER')
label('E-Rechnung im Inland zwischen Unternehmen (B2B): Fristen', (0, -0.05, 2.15), size=0.072, material=lm, align='CENTER')
arrow((-1.95, -0.02, 1.25), (2.0, -0.02, 1.25), ln, r=0.008, head=0.06)
pts = [(-1.3, '1.1.2025', blue, ['Alle müssen E-Rechnungen', 'empfangen können', 'Versand: Papier oder PDF', 'noch erlaubt (PDF mit Zustimmung)']),
       (0.0, '1.1.2027', orange, ['Vorjahresumsatz über 800.000 €:', 'Versand nur noch als E-Rechnung', 'bis 800.000 €: Papier/PDF', 'noch bis Ende 2027']),
       (1.3, '1.1.2028', green, ['Alle Unternehmen versenden', 'nur noch E-Rechnungen', '(nicht Kleinunternehmer', 'nach § 19 UStG)'])]
for x, d, m, lines in pts:
    cyl('p', 0.07, 0.05, (x, -0.02, 1.25), m, rot=(1.5708, 0, 0))
    label(d, (x, -0.05, 1.42), size=0.075, material=m, align='CENTER')
    for k, t in enumerate(lines):
        if t:
            label(t, (x, -0.05, 1.0 - k * 0.105), size=0.05, material=lm, align='CENTER')
card(-0.95, 0.4, 1.8, 0.36, blue, ['E-Rechnung', 'XRechnung (XML) oder ZUGFeRD (PDF + XML)'], sizes=(0.06, 0.046))
card(0.95, 0.4, 1.8, 0.36, red, ['keine E-Rechnung', 'eingescannte PDF, PDF per E-Mail, Papier'], sizes=(0.06, 0.046))
label('Ausnahmen u. a.: Rechnungen an Verbraucher, Kleinbetragsrechnungen bis 250 €, Kleinunternehmer.', (0, -0.05, 0.08), size=0.05, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
