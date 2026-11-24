sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
head = mat('head', (0.1, 0.32, 0.65), rough=0.5)
body = mat('body', (0.72, 0.75, 0.8), rough=0.8)
zw = mat('zw', (0.68, 0.3, 0.02), rough=0.5)
ln = mat('line', (0.3, 0.33, 0.37), rough=0.6)


def table(x, z, name, rows, hm=head):
    w = 0.95
    box('h', (w, 0.15, 0.17), (x, 0, z), hm, bevel=0.006)
    label(name, (x, -0.08, z - 0.025), size=0.06, material=wl, align='CENTER')
    for i, r in enumerate(rows):
        zz = z - 0.17 - i * 0.14
        box('r', (w, 0.12, 0.13), (x, 0.01, zz), body)
        label(r, (x - w / 2 + 0.05, -0.06, zz - 0.02), size=0.047, material=lm)
    return z - 0.17 - (len(rows) - 1) * 0.14


table(-1.6, 1.3, 'Kunde', ['PK  KundenNr', 'Name', 'Ort'])
table(-0.35, 1.3, 'Bestellung', ['PK  BestellNr', 'FK  KundenNr', 'Datum'])
table(0.9, 0.55, 'Bestellposition', ['PK, FK  BestellNr', 'PK, FK  ArtikelNr', 'Menge'], hm=zw)
table(2.0, 1.3, 'Artikel', ['PK  ArtikelNr', 'Bezeichnung', 'Preis'])
leader((-1.12, -0.02, 1.13), (-0.83, -0.02, 1.13), ln, r=0.01)
label('1', (-1.08, -0.05, 1.18), size=0.06, material=lm, align='CENTER')
label('n', (-0.88, -0.05, 1.18), size=0.06, material=lm, align='CENTER')
leader((0.13, -0.02, 1.13), (0.6, -0.02, 1.13), ln, r=0.01)
leader((0.6, -0.02, 1.13), (0.6, -0.02, 0.64), ln, r=0.01)
label('1', (0.2, -0.05, 1.18), size=0.06, material=lm, align='CENTER')
label('n', (0.66, -0.05, 0.75), size=0.06, material=lm, align='CENTER')
leader((1.52, -0.02, 1.13), (1.2, -0.02, 1.13), ln, r=0.01)
leader((1.2, -0.02, 1.13), (1.2, -0.02, 0.64), ln, r=0.01)
label('1', (1.46, -0.05, 1.18), size=0.06, material=lm, align='CENTER')
label('n', (1.13, -0.05, 0.75), size=0.06, material=lm, align='CENTER')
label('Bestellung n : m Artikel  →  aufgelöst über die Zwischentabelle „Bestellposition“', (0.2, -0.05, -0.2), size=0.055, material=lm, align='CENTER')
label('mit zusammengesetztem Primärschlüssel aus zwei Fremdschlüsseln (BestellNr, ArtikelNr).', (0.2, -0.05, -0.33), size=0.05, material=lm, align='CENTER')
camera_front((0.2, 0, 0.6), 5.0, tilt=1)
lights(0.55)
