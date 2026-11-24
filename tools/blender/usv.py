import math, bmesh
sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
blk = mat('block', (0.25, 0.45, 0.7), rough=0.5)
bat = mat('battery', (0.2, 0.6, 0.35), rough=0.5)
src = mat('grid', (0.35, 0.37, 0.4), rough=0.5)
load = mat('load', (0.35, 0.37, 0.4), rough=0.5)
arrow = mat('arrow', (0.95, 0.55, 0.12), rough=0.4)
byp = mat('bypass', (0.6, 0.6, 0.62), rough=0.5)
white = mat('white', (1, 1, 1), emit=1.0)

def arrow_x(x0, x1, z, m=arrow, r=0.018):
    length = x1 - x0 - 0.07
    cyl('shaft', r, length, (x0 + length / 2, 0, z), m, rot=(0, math.radians(90), 0), verts=16)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=24, radius1=r * 2.4, radius2=0, depth=0.07)
    o = _mesh_obj('head', bm, m)
    o.location = (x1 - 0.035, 0, z)
    o.rotation_euler = (0, math.radians(90), 0)

def arrow_z(x, z0, z1, m=arrow, r=0.018):
    length = abs(z1 - z0) - 0.07
    sgn = 1 if z1 > z0 else -1
    cyl('shaft', r, length, (x, 0, z0 + sgn * length / 2), m, verts=16)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=24, radius1=r * 2.4, radius2=0, depth=0.07)
    o = _mesh_obj('head', bm, m)
    o.location = (x, 0, z1 - sgn * 0.035)
    o.rotation_euler = (0 if sgn > 0 else math.radians(180), 0, 0)

parts = [(-1.2, 'Netz', src, 'AC 230 V'), (-0.4, 'Gleichrichter', blk, 'AC → DC'), (0.4, 'Wechselrichter', blk, 'DC → AC'), (1.2, 'Verbraucher', load, 'Server, Switch')]
for x, name, m, sub in parts:
    box(name, (0.46, 0.3, 0.3), (x, 0, 0.35), m, bevel=0.02)
    label(name, (x, -0.16, 0.37), size=0.062, material=white, align='CENTER')
    label(sub, (x, -0.16, 0.28), size=0.055, material=white, align='CENTER')
for a, b in [(-1.2, -0.4), (-0.4, 0.4), (0.4, 1.2)]:
    arrow_x(a + 0.23, b - 0.23, 0.35)
box('Akku', (0.9, 0.3, 0.26), (0.0, 0, -0.2), bat, bevel=0.02)
label('Akku (wird ständig geladen)', (0.0, -0.16, -0.23), size=0.05, material=white, align='CENTER')
arrow_z(-0.25, 0.2, -0.07)
arrow_z(0.25, -0.07, 0.2)
# bypass over the top
cyl('bypass', 0.012, 2.4, (0.0, 0, 0.72), byp, rot=(0, math.radians(90), 0), verts=12)
for x in (-1.2, 1.2):
    cyl('bypass_v', 0.012, 0.22, (x, 0, 0.61), byp, verts=12)
label('Bypass (bei Störung oder Wartung, ohne Akku)', (0.0, 0, 0.77), size=0.065, material=lm, align='CENTER')
label('Online-USV (Doppelwandler, VFI): Verbraucher hängen immer am Wechselrichter – keine Umschaltzeit', (0.0, 0, 0.98), size=0.06, material=lm, align='CENTER')
camera((0.0, -3.7, 0.55), (0.0, 0, 0.36), lens=40)
lights(0.9)
