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
label('Aufbauorganisation: Einlinien-, Stablinien- und Mehrliniensystem', (0, -0.05, 2.15), size=0.07, material=lm, align='CENTER')
def node(x, z, t, m, w=0.42):
    card(x, z, w, 0.16, m, [t], sizes=(0.036, 0.03))
def ln_(a, b):
    leader((a[0], -0.02, a[1]), (b[0], -0.02, b[1]), ln, r=0.005)
def tree(cx, staff=False, multi=False):
    top = (cx, 1.7)
    mids = [(cx - 0.3, 1.3), (cx + 0.3, 1.3)]
    lows = [(cx - 0.45, 0.9), (cx - 0.15, 0.9), (cx + 0.15, 0.9), (cx + 0.45, 0.9)]
    node(*top, 'Leitung', blue)
    for m_ in mids:
        ln_((top[0], top[1] - 0.08 if not staff else 1.5), (m_[0], m_[1] + 0.08))
        node(*m_, 'Abt.', blue, w=0.36)
    for k, l_ in enumerate(lows):
        if multi:
            for m_ in mids:
                ln_((m_[0], m_[1] - 0.08), (l_[0], l_[1] + 0.08))
        else:
            m_ = mids[k // 2]
            ln_((m_[0], m_[1] - 0.08), (l_[0], l_[1] + 0.08))
        node(*l_, 'MA', grey, w=0.24)
    if staff:
        leader((cx, -0.02, 1.62), (cx, -0.02, 1.5), orange, r=0.005)
        leader((cx, -0.02, 1.5), (cx + 0.45, -0.02, 1.5), orange, r=0.005)
        node(cx + 0.62, 1.5, 'Stab', orange, w=0.34)
xs = [-1.45, 0, 1.45]
tree(xs[0]); tree(xs[1], staff=True); tree(xs[2], multi=True)
for x, t, a, b in zip(xs, ['Einliniensystem', 'Stabliniensystem', 'Mehrliniensystem'],
                      ['ein Vorgesetzter je Stelle', 'Stab berät,', 'mehrere Fachvorgesetzte'],
                      ['klar, aber lange Wege', 'hat kein Weisungsrecht', 'Fachwissen, aber Konflikte']):
    label(t, (x, -0.05, 1.95), size=0.05, material=lm, align='CENTER')
    label(a, (x, -0.05, 0.65), size=0.038, material=lm, align='CENTER')
    label(b, (x, -0.05, 0.56), size=0.038, material=lm, align='CENTER')
label('MA = Mitarbeitende · Abt. = Abteilung. Weitere Formen: Sparten- und Matrixorganisation.', (0, -0.05, 0.25), size=0.04, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
