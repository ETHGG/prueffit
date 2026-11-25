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
label('Vom Zahlungsverzug zur Zwangsvollstreckung', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
st = [('Rechnung', 'Zahlungsziel', grey), ('Verzug', 'spätestens 30 Tage nach', orange), ('Mahnung(en)', 'außergerichtlich', orange),
      ('Mahnbescheid', 'Antrag beim Amtsgericht', red), ('Vollstreckungs-', 'bescheid', red), ('Zwangs-', 'vollstreckung', red)]
sub = ['', 'Fälligkeit und Rechnung', '(gesetzlich nicht nötig)', '(online-mahnantrag.de)', 'wenn kein Widerspruch', 'Gerichtsvollzieher']
for i, (a, b, m) in enumerate(st):
    x = -1.83 + i * 0.73
    card(x, 1.35, 0.66, 0.6, m, [a, b, sub[i]], sizes=(0.05, 0.036))
    if i < 5:
        arrow((x + 0.335, -0.02, 1.35), (x + 0.395, -0.02, 1.35), ln, r=0.008, head=0.04)
label('Widerspruch gegen den Mahnbescheid: 2 Wochen · Einspruch gegen den Vollstreckungsbescheid: 2 Wochen → dann streitiges Verfahren', (0, -0.05, 0.82), size=0.043, material=lm, align='CENTER')
label('Mit dem Verzug: Verzugszinsen (Unternehmen: 9 Prozentpunkte über dem Basiszinssatz, Verbraucher: 5) und bei Unternehmen 40 € Pauschale.', (0, -0.05, 0.6), size=0.043, material=lm, align='CENTER')
label('Gegenüber Verbrauchern tritt der Verzug nach 30 Tagen nur ein, wenn die Rechnung darauf hinweist; sonst durch Mahnung.', (0, -0.05, 0.45), size=0.043, material=lm, align='CENTER')
camera_front((0, 0, 1.2), 4.4, tilt=1)
lights(0.55)
