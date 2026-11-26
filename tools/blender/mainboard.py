import math
sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
pcb = mat('pcb', (0.07, 0.16, 0.12), rough=0.6)
socket = mat('socket', (0.75, 0.75, 0.7), metal=0.7, rough=0.3)
ram = mat('ram', (0.12, 0.12, 0.14), rough=0.5)
pcie = mat('pcie', (0.1, 0.1, 0.11), rough=0.6)
heat = mat('heat', (0.45, 0.47, 0.5), metal=0.8, rough=0.35)
blue = mat('sata', (0.15, 0.3, 0.7), rough=0.5)
io = mat('io', (0.6, 0.62, 0.65), metal=0.6, rough=0.3)
atx = mat('atx', (0.9, 0.9, 0.88), rough=0.6)
# board 30.5 x 24.4 cm (ATX), lying flat, units in m
W, D = 0.305, 0.244
box('board', (W, D, 0.004), (0, 0, 0), pcb)
box('socket', (0.06, 0.06, 0.008), (0.0, 0.04, 0.006), socket, bevel=0.002)
box('cpu_lever', (0.004, 0.05, 0.004), (0.035, 0.04, 0.006), socket)
for i in range(4):
    box(f'ram{i}', (0.006, 0.135, 0.012), (0.06 + i * 0.011, 0.04, 0.008), ram)
box('atx24', (0.016, 0.052, 0.014), (0.13, 0.03, 0.009), atx)
box('chipset', (0.04, 0.04, 0.01), (0.07, -0.07, 0.007), heat, bevel=0.002)
box('m2', (0.022, 0.08, 0.003), (-0.03, -0.035, 0.004), mat('m2', (0.2, 0.2, 0.22), rough=0.5))
for k in range(4):
    box('chip', (0.012, 0.012, 0.002), (-0.03, -0.06 + k * 0.016, 0.0065), mat('chipblk', (0.05, 0.05, 0.06), rough=0.4))
for j, y in enumerate((-0.075, -0.105)):
    box(f'pcie{j}', (0.09, 0.008, 0.012), (-0.07 + 0.0, y, 0.008), pcie)
box('pcie_x1', (0.025, 0.008, 0.012), (-0.1, -0.05, 0.008), pcie)
for k in range(4):
    box(f'sata{k}', (0.012, 0.007, 0.009), (0.135, -0.07 + k * 0.012, 0.007), blue)
box('io', (0.02, 0.16, 0.035), (-0.14, 0.03, 0.02), io, bevel=0.002)
box('vrm', (0.07, 0.014, 0.018), (0.0, 0.1, 0.012), heat, bevel=0.002)
box('vrm2', (0.014, 0.06, 0.018), (-0.055, 0.045, 0.012), heat, bevel=0.002)
# move every part of the board to the left, labels go in a column on the right
for o in list(bpy.context.scene.collection.objects):
    o.location.x -= 0.165
OX = -0.165
items = [
    ('Anschlussblende (I/O)', (-0.14, 0.09, 0.04)),
    ('Spannungswandler (VRM) mit Kühlkörper', (0.0, 0.1, 0.022)),
    ('CPU-Sockel', (0.0, 0.04, 0.011)),
    ('RAM-Steckplätze (DIMM)', (0.077, 0.08, 0.015)),
    ('24-poliger ATX-Stromanschluss', (0.13, 0.03, 0.017)),
    ('M.2-Steckplatz', (-0.03, -0.03, 0.007)),
    ('SATA-Anschlüsse', (0.135, -0.052, 0.012)),
    ('Chipsatz mit Kühlkörper', (0.07, -0.07, 0.013)),
    ('PCIe-x1-Steckplatz', (-0.1, -0.05, 0.015)),
    ('PCIe-x16-Steckplätze', (-0.07, -0.105, 0.015)),
]
LX = 0.02
for k, (text, (ax, ay, az)) in enumerate(items):
    ly = 0.17 - k * 0.037
    a = (ax + OX, ay, az + 0.002)
    leader(a, (LX - 0.005, ly, 0.04), lm, r=0.0007)
    label(text, (LX, ly - 0.005, 0.04), size=0.0135, material=lm, rot=(0, 0, 0))
label('Mainboard (ATX, 30,5 × 24,4 cm) – Draufsicht', (-0.32, 0.19, 0.04), size=0.015, material=lm, rot=(0, 0, 0))
camera((0.0, 0.0, 1.0), (0.0, 0.0, 0.0), lens=50, ortho=0.68)
lights(0.7)
