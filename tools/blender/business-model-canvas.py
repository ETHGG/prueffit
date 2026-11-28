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
label('Business Model Canvas: ein Geschäftsmodell auf einer Seite', (0, -0.05, 2.15), size=0.075, material=lm, align='CENTER')
W = 0.8
xs = [-1.64 + i * (W + 0.02) for i in range(5)]
top, mid, bot = 1.85, 1.3, 0.75
def f(x, zc, h, m, t, sub):
    box('f', (W, 0.2, h), (x, 0, zc), m, bevel=0.01)
    label(t, (x, -0.11, zc + h / 2 - 0.12), size=0.058, material=wl, align='CENTER')
    for k, s_ in enumerate(sub):
        label(s_, (x, -0.11, zc + h / 2 - 0.22 - k * 0.07), size=0.058, material=wl, align='CENTER')
H = 1.1
f(xs[0], 1.3, H, grey, 'Schlüssel-', ['partner', 'Lieferanten,', 'Hersteller'])
f(xs[1], 1.3 + H / 4 + 0.005, H / 2 - 0.01, grey, 'Schlüssel-', ['aktivitäten', 'Betrieb, Support'])
f(xs[1], 1.3 - H / 4 - 0.005, H / 2 - 0.01, grey, 'Schlüssel-', ['ressourcen', 'Personal, Rechenzentrum'])
f(xs[2], 1.3, H, orange, 'Wertangebot', ['Welches Problem', 'lösen wir?'])
f(xs[3], 1.3 + H / 4 + 0.005, H / 2 - 0.01, blue, 'Kunden-', ['beziehungen', 'Ansprechpartner, Self-Service'])
f(xs[3], 1.3 - H / 4 - 0.005, H / 2 - 0.01, blue, 'Kanäle', ['Webshop, Vertrieb'])
f(xs[4], 1.3, H, blue, 'Kunden-', ['segmente', 'z. B. Handwerks-', 'betriebe'])
box('k', (2.02, 0.2, 0.32), (-1.03, 0, 0.55), red, bevel=0.01)
label('Kostenstruktur – Personal, Lizenzen, Rechenzentrum', (-1.03, -0.11, 0.53), size=0.058, material=wl, align='CENTER')
box('e', (2.02, 0.2, 0.32), (1.03, 0, 0.55), green, bevel=0.01)
label('Einnahmequellen – Abo, Projekte', (1.03, -0.11, 0.53), size=0.058, material=wl, align='CENTER')
label('Links Infrastruktur (grau), Mitte das Angebot, rechts die Kunden (blau), unten die Finanzen. Beispiel: Systemhaus mit Managed Services.', (0, -0.05, 0.22), size=0.058, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
