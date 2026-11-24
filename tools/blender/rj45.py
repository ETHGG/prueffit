import math
sc = reset()
clear = mat('clear', (0.85, 0.9, 0.95), rough=0.08)
try:
    p = clear.node_tree.nodes['Principled BSDF']
    p.inputs['Transmission Weight' if 'Transmission Weight' in p.inputs else 'Transmission'].default_value = 0.85
    p.inputs['Alpha'].default_value = 0.55
    clear.blend_method = 'BLEND'
except Exception:
    pass
gold = mat('gold', (1.0, 0.78, 0.3), metal=1.0, rough=0.25)
jacket = mat('jacket', (0.1, 0.35, 0.85), rough=0.6)
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
# T568B: 1 ws/or, 2 or, 3 ws/gn, 4 bl, 5 ws/bl, 6 gn, 7 ws/br, 8 br
cols = {
    'or': (0.95, 0.45, 0.05), 'gn': (0.1, 0.6, 0.2), 'bl': (0.1, 0.3, 0.9), 'br': (0.45, 0.25, 0.1), 'ws': (0.95, 0.95, 0.95),
}
pins = [('ws', 'or'), ('or', 'or'), ('ws', 'gn'), ('bl', 'bl'), ('ws', 'bl'), ('gn', 'gn'), ('ws', 'br'), ('br', 'br')]
names = ['weiß-orange', 'orange', 'weiß-grün', 'blau', 'weiß-blau', 'grün', 'weiß-braun', 'braun']

# connector body (transparent), ~11.7 x 21 x 8 mm, scaled x10
S = 10
box('body', (0.0117 * S, 0.021 * S, 0.008 * S), (0, 0, 0), clear, bevel=0.004)
box('clip', (0.006 * S, 0.012 * S, 0.0015 * S), (0, 0.004 * S, -0.0055 * S), clear, bevel=0.002)
pitch = 0.00102 * S
for i in range(8):
    x = (i - 3.5) * pitch
    box(f'pin{i}', (0.00035 * S, 0.0045 * S, 0.0012 * S), (x, -0.0082 * S, 0.0036 * S), gold)
    base, stripe = pins[i]
    m = mat(f'w{i}', cols[base], rough=0.5)
    cyl(f'wire{i}', 0.00045 * S, 0.03 * S, (x, 0.008 * S, -0.0005 * S), m, rot=(math.radians(90), 0, 0), verts=24)
    if base == 'ws':
        # coloured stripes on white wires
        for k in range(6):
            cyl(f's{i}{k}', 0.00047 * S, 0.0012 * S, (x, (0.0 + k * 0.004) * S, -0.0005 * S), mat(f'st{i}', cols[stripe], rough=0.5), rot=(math.radians(90), 0, 0), verts=24)
    label(str(i + 1), (x - 0.0025, -0.0125 * S, 0.0062 * S), size=0.011, material=lm, rot=(math.radians(90), 0, 0))
cyl('jacket', 0.003 * S, 0.03 * S, (0, 0.032 * S, -0.0005 * S), jacket, rot=(math.radians(90), 0, 0))

# legend
for i, n in enumerate(names):
    label(f'{i + 1}  {n}', (0.12, 0.02, 0.085 - i * 0.024), size=0.017, material=lm)
label('RJ45-Stecker nach T568B (Kontakte oben, Rastnase unten: Pin 1 links)', (-0.2, 0.02, 0.145), size=0.016, material=lm)
camera((0.06, -0.72, 0.27), (0.06, 0.02, 0.0), lens=50)
lights(0.4)
