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
label('Barrierefreiheit: die vier Prinzipien der WCAG', (0, -0.05, 2.12), size=0.08, material=lm, align='CENTER')
tiles = [('Wahrnehmbar', ['über mehr als einen Sinn', 'Alternativtext, Untertitel', 'Kontrast mind. 4,5 : 1'], blue),
         ('Bedienbar', ['alles ohne Maus', 'sichtbarer Fokus', 'genug Zeit'], green),
         ('Verständlich', ['klare Sprache', 'vorhersehbares Verhalten', 'Fehler mit Lösungshinweis'], orange),
         ('Robust', ['sauberes HTML', 'echte Buttons, label', 'Screenreader liest korrekt'], grey)]
for i, (t, lines, m) in enumerate(tiles):
    x = -1.62 + i * 1.08
    card(x, 1.15, 1.0, 1.1, m, [t] + lines, sizes=(0.066, 0.043))
label('Gefordert ist meist Stufe AA (Doppel-A); Pflicht z. B. nach BFSG (seit 28.06.2025) für viele Angebote an Verbraucher, BITV 2.0 für Bundesbehörden.', (0, -0.05, 0.32), size=0.045, material=lm, align='CENTER')
label('Merkhilfe: Inhalte wahrnehmen → bedienen → verstehen → mit Hilfsmitteln nutzen.', (0, -0.05, 0.17), size=0.047, material=lm, align='CENTER')
camera_front((0, 0, 1.08), 4.4, tilt=1)
lights(0.55)
