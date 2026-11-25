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
import math as _m
fib = mat('fib', (0.85, 0.9, 0.95), rough=0.15)
coat = mat('coat', (0.85, 0.35, 0.1), rough=0.5)
steel = mat('steel', (0.6, 0.62, 0.65), metal=0.8, rough=0.3)
body = mat('body', (0.2, 0.22, 0.25), rough=0.5)
glow = mat('glow', (0.6, 0.8, 1.0), emit=6.0)
box('base', (1.6, 0.8, 0.06), (0, 0, -0.03), body, bevel=0.01)
for s in (-1, 1):
    box('vgroove', (0.35, 0.12, 0.05), (s * 0.3, 0, 0.025), steel, bevel=0.005)
    cyl('fiber', 0.006, 0.42, (s * 0.24, 0, 0.056), fib, rot=(0, _m.radians(90), 0), verts=16)
    cyl('coat', 0.018, 0.35, (s * 0.62, 0, 0.056), coat, rot=(0, _m.radians(90), 0), verts=24)
    cyl('electrode', 0.012, 0.22, (0, s * 0.16, 0.056), steel, rot=(_m.radians(90), 0, 0), verts=16)
cyl('arc', 0.008, 0.2, (0, 0, 0.056), glow, rot=(_m.radians(90), 0, 0), verts=12)
cyl('sleeve', 0.03, 0.4, (0.45, -0.27, 0.03), mat('sleeve', (0.85, 0.85, 0.88), rough=0.3), rot=(0, _m.radians(90), 0), verts=32)
cyl('rod', 0.008, 0.4, (0.45, -0.27, 0.045), steel, rot=(0, _m.radians(90), 0), verts=16)
def tag(text, a, p, al='LEFT'):
    leader(a, p, lm, r=0.002)
    label(text, (p[0] + (0.02 if al == 'LEFT' else -0.02), p[1], p[2] - 0.012), size=0.04, material=lm, rot=(_m.radians(45), 0, 0), align=al)
tag('Elektroden: Lichtbogen verschmilzt die Faserenden', (0, 0.16, 0.08), (0.25, 0.45, 0.25))
tag('Faser (125 µm), Coating entfernt', (-0.25, 0, 0.065), (-0.85, 0.45, 0.25), 'LEFT')
tag('V-Nuten richten aus', (0.3, 0.06, 0.05), (0.55, 0.3, 0.22))
tag('Coating (Schutzschicht)', (0.62, 0, 0.075), (0.85, 0.15, 0.2))
tag('Spleißschutz', (0.62, -0.27, 0.06), (0.8, -0.42, 0.15))
label('(Schrumpfschlauch mit Stahlstab)', (0.82, -0.49, 0.1), size=0.03, material=lm, rot=(_m.radians(45), 0, 0))
label('Glasfaser spleißen (Fusionsspleiß) – Arbeitsschritte:', (-0.8, -0.5, 0.0), size=0.045, material=lm, rot=(_m.radians(45), 0, 0))
steps = ['1 Außenmantel, Aramid und Coating entfernen (der Glasmantel bleibt)', '2 Faser mit Isopropanol reinigen', '3 Mit dem Cleaver gerade brechen', '4 Ausrichten und verschmelzen', '5 Spleißschutz aufschrumpfen']
for k, t in enumerate(steps):
    label(t, (-0.75, -0.585 - k * 0.075, 0.0), size=0.035, material=lm, rot=(_m.radians(45), 0, 0))
label('Spleißdämpfung typ. unter 0,1 dB – deutlich weniger als eine Steckverbindung (typ. ca. 0,3 dB).', (-0.8, -0.99, 0.0), size=0.034, material=lm, rot=(_m.radians(45), 0, 0))
camera((0.15, -2.4, 2.3), (0.15, -0.25, 0.0), lens=44)
lights(0.7)
