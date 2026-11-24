import math
sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
core = mat('core', (0.95, 0.7, 0.05), rough=0.3)
clad = mat('clad', (0.45, 0.62, 0.75), rough=0.2)
coat = mat('coat', (0.85, 0.35, 0.15), rough=0.5)
buf = mat('buffer', (0.62, 0.64, 0.66), rough=0.6)
kev = mat('kevlar', (0.85, 0.65, 0.2), rough=0.9)
jack = mat('jacket', (0.05, 0.3, 0.45), rough=0.55)
rot = (0, math.radians(90), 0)
# layers stepped like a stripped cable, axis along x; radii exaggerated for visibility
layers = [
    ('Kern (Glas, Licht wird hier geführt)', 0.045, 1.6, 0.8, core),
    ('Mantel (Glas, niedrigerer Brechungsindex)', 0.07, 1.3, 0.65, clad),
    ('Beschichtung (Primärcoating)', 0.10, 1.0, 0.5, coat),
    ('Pufferschicht (Sekundärcoating)', 0.14, 0.75, 0.375, buf),
    ('Zugentlastung (Aramidfasern)', 0.18, 0.5, 0.25, kev),
    ('Außenmantel', 0.22, 0.3, 0.15, jack),
]
for i, (name, r, length, cx, m) in enumerate(layers):
    cyl(name, r, length, (-0.8 + length / 2, 0, 0), m, rot=rot, verts=64)
# numbers at each step, legend below
for i, (name, r, length, cx, m) in enumerate(layers):
    tip_x = -0.8 + length - 0.05
    leader((tip_x, 0, r), (tip_x, 0, 0.3 + 0.0), lm, r=0.003)
    label(str(i + 1), (tip_x - 0.015, 0, 0.32), size=0.06, material=lm)
    label(f'{i + 1}  {name}', (-0.95 + (i % 2) * 0.98, 0, -0.36 - (i // 2) * 0.085), size=0.05, material=lm)
label('Aufbau eines Glasfaserkabels (Schichten vergrößert dargestellt)', (-0.95, 0, 0.5), size=0.06, material=lm)
camera((0.0, -2.6, 0.05), (0.0, 0, 0.02), lens=40)
lights(0.45)
