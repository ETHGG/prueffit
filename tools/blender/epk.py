sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
ev = mat('ev', (0.62, 0.15, 0.45), rough=0.5)
fn = mat('fn', (0.04, 0.36, 0.18), rough=0.5)
org = mat('org', (0.85, 0.75, 0.2), rough=0.5)
inf = mat('inf', (0.35, 0.38, 0.43), rough=0.5)
con = mat('con', (0.25, 0.27, 0.3), rough=0.5)
ln = mat('line', (0.3, 0.33, 0.37), rough=0.6)


def event(x, z, t):
    o = cyl('ev', 0.2, 0.08, (x, 0, z), ev, rot=(math.radians(90), 0, 0), verts=6)
    o.scale = (2.4, 1, 0.62)
    label(t, (x, -0.06, z + 0.01), size=0.045, material=wl, align='CENTER')


def func(x, z, t):
    box('fn', (0.9, 0.12, 0.24), (x, 0, z), fn, bevel=0.06)
    label(t, (x, -0.08, z - 0.02), size=0.048, material=wl, align='CENTER')


def xor(x, z):
    cyl('x', 0.09, 0.06, (x, 0, z), con, rot=(math.radians(90), 0, 0), verts=32)
    label('XOR', (x, -0.05, z - 0.02), size=0.038, material=wl, align='CENTER')


def line(a, b):
    arrow((a[0], -0.01, a[1]), (b[0], -0.01, b[1]), ln, r=0.007, head=0.04)


event(0, 1.95, 'Bestellung\neingegangen')
line((0, 1.81), (0, 1.66))
func(0, 1.54, 'Bestellung prüfen')
box('org', (0.5, 0.1, 0.2), (-1.1, 0, 1.54), org, bevel=0.09)
label('Vertrieb', (-1.1, -0.07, 1.52), size=0.045, material=lm, align='CENTER')
leader((-0.85, -0.01, 1.54), (-0.45, -0.01, 1.54), ln, r=0.005)
box('inf', (0.55, 0.1, 0.2), (1.1, 0, 1.54), inf)
label('Kundendaten', (1.1, -0.07, 1.52), size=0.045, material=wl, align='CENTER')
leader((0.45, -0.01, 1.54), (0.82, -0.01, 1.54), ln, r=0.005)
line((0, 1.42), (0, 1.27))
xor(0, 1.18)
line((-0.08, 1.12), (-0.8, 0.98))
line((0.08, 1.12), (0.8, 0.98))
event(-0.8, 0.85, 'Ware\nverfügbar')
event(0.8, 0.85, 'Ware nicht\nverfügbar')
line((-0.8, 0.71), (-0.8, 0.56))
line((0.8, 0.71), (0.8, 0.56))
func(-0.8, 0.44, 'Ware versenden')
func(0.8, 0.44, 'Ware nachbestellen')
line((-0.8, 0.32), (-0.08, 0.15))
line((0.8, 0.32), (0.08, 0.15))
xor(0, 0.08)
line((0, -0.01), (0, -0.14))
event(0, -0.28, 'Bestellung\nbearbeitet')
for i, (m, t) in enumerate([(ev, 'Ereignis (Sechseck)'), (fn, 'Funktion'), (org, 'Organisationseinheit'), (inf, 'Informationsobjekt'), (con, 'Konnektor')]):
    box('k', (0.12, 0.05, 0.08), (1.55, -0.02, 1.0 - i * 0.16), m)
    label(t, (1.65, -0.04, 0.98 - i * 0.16), size=0.045, material=lm)
label('Beginnt und endet mit einem Ereignis; Ereignisse und Funktionen wechseln sich ab;', (0, -0.04, -0.62), size=0.047, material=lm, align='CENTER')
label('erst die Funktion entscheidet (XOR), mit demselben Konnektor wird wieder zusammengeführt.', (0, -0.04, -0.74), size=0.047, material=lm, align='CENTER')
camera_front((0.2, 0, 0.7), 4.6, tilt=1)
lights(0.55)
