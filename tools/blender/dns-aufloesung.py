sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
host = mat('host', (0.1, 0.3, 0.65), rough=0.5)
res = mat('res', (0.8, 0.4, 0.05), rough=0.5)
srv = mat('srv', (0.25, 0.27, 0.3), metal=0.3, rough=0.4)
q = mat('q', (0.1, 0.4, 0.8), rough=0.4)
a = mat('a', (0.1, 0.5, 0.25), rough=0.4)
tl = mat('timeline', (0.55, 0.58, 0.62), rough=0.6)
cols = {'C': (-1.75, host, 'Client\n(Stub-Resolver)'), 'R': (-0.75, res, 'DNS-Resolver\n(rekursiv, Cache)'),
        'O': (0.2, srv, 'Root-Server\n( . )'), 'T': (1.0, srv, 'TLD-Server\n( .de )'), 'A': (1.85, srv, 'autoritativer\nServer beispiel.de')}
TOP = 1.95
for x, m, t in cols.values():
    box('n', (0.74, 0.3, 0.3), (x, 0, TOP), m, bevel=0.015)
    label(t, (x, -0.16, TOP + 0.03), size=0.052, material=wl, align='CENTER')
    leader((x, 0, TOP - 0.16), (x, 0, -0.02), tl, r=0.007)
steps = [('C', 'R', q, '1  www.beispiel.de?'), ('R', 'O', q, '2  www.beispiel.de?'), ('O', 'R', a, '3  Verweis: .de-Server'),
         ('R', 'T', q, '4  www.beispiel.de?'), ('T', 'R', a, '5  Verweis: ns.beispiel.de'), ('R', 'A', q, '6  www.beispiel.de?'),
         ('A', 'R', a, '7  A-Record 203.0.113.10'), ('R', 'C', a, '8  203.0.113.10 (wird gecacht)')]
for i, (f, t, m, txt) in enumerate(steps):
    z = 1.58 - i * 0.205
    xf, xt = cols[f][0], cols[t][0]
    s = 1 if xt > xf else -1
    arrow((xf + s * 0.02, -0.03, z), (xt - s * 0.02, -0.03, z), m, r=0.009, head=0.05)
    label(txt, ((xf + xt) / 2, -0.06, z + 0.04), size=0.047, material=lm, align='CENTER')
label('Rekursiv: der Client stellt eine Anfrage und bekommt die fertige Antwort.  Iterativ: der Resolver fragt Root, TLD und autoritativen Server nacheinander.', (0.05, -0.06, -0.2), size=0.043, material=lm, align='CENTER')
camera_front((0.05, 0, 0.88), 4.45, tilt=2)
lights(0.55)
