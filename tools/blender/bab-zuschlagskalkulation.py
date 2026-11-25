sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
hd = mat('hd', (0.1, 0.32, 0.65), rough=0.5)
cell = mat('cell', (0.8, 0.84, 0.88), rough=0.8)
sm = mat('sm', (0.62, 0.7, 0.8), rough=0.8)
hl = mat('hl', (0.68, 0.3, 0.02), rough=0.5)
cols = [-1.45, -0.42, 0.24, 0.9, 1.56, 2.22]
widths = [1.3, 0.62, 0.62, 0.62, 0.62, 0.62]
def row(z, texts, m, tm, h=0.22, sizes=None, sub=None):
    for c, (x, w, t) in enumerate(zip(cols, widths, texts)):
        box('c', (w, 0.12, h), (x, 0, z), m, bevel=0.006)
        if sub and sub[c]:
            label(sub[c], (x, -0.07, z + 0.03), size=0.037, material=tm, align='CENTER')
            label(t, (x, -0.07, z - 0.09), size=0.05, material=tm, align='CENTER')
        else:
            label(t, (x, -0.07, z - 0.02), size=0.048, material=tm, align='CENTER')
row(1.72, ['Kostenart (Schlüssel)', 'Summe', 'Material', 'Fertigung', 'Verwaltung', 'Vertrieb'], hd, wl)
row(1.47, ['Miete (nach m²)', '20.000', '2.000', '10.000', '6.000', '2.000'], cell, lm)
row(1.22, ['übrige Gemeinkosten (Belege)', '77.000', '4.000', '54.000', '12.000', '7.000'], cell, lm)
row(0.97, ['Summe Gemeinkosten', '97.000', '6.000', '64.000', '18.000', '9.000'], sm, lm)
row(0.66, ['Zuschlagsbasis', '–', '60.000', '50.000', '180.000', '180.000'], cell, lm, h=0.32,
    sub=[None, None, 'Materialeinzelkosten', 'Fertigungslöhne', 'Herstellkosten', 'Herstellkosten'])
row(0.37, ['Zuschlagssatz', '–', '10 %', '128 %', '10 %', '5 %'], hl, wl)
label('Kostenstellen (Beträge in €)', (1.23, -0.05, 1.92), size=0.05, material=lm, align='CENTER')
label('Zuschlagssatz = Gemeinkosten der Kostenstelle : Zuschlagsbasis × 100   (Material: 6.000 : 60.000 × 100 = 10 %)', (0.2, -0.05, 0.08), size=0.045, material=lm, align='CENTER')
label('Herstellkosten = 60.000 + 6.000 + 50.000 + 64.000 = 180.000 € (ohne Bestandsveränderungen)', (0.2, -0.05, -0.05), size=0.045, material=lm, align='CENTER')
camera_front((0.2, 0, 0.88), 4.9, tilt=1)
lights(0.55)
