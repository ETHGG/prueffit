U = 0.04445
W = 0.4826  # 19 inch
sc = reset()
frame = mat('frame', (0.12, 0.13, 0.14), metal=0.6, rough=0.45)
dark = mat('dark', (0.06, 0.07, 0.08), metal=0.3, rough=0.5)
grey = mat('grey', (0.55, 0.58, 0.6), metal=0.7, rough=0.35)
port = mat('port', (0.02, 0.02, 0.02), rough=0.8)
green = mat('led_g', (0.1, 0.9, 0.3), emit=4)
amber = mat('led_a', (1.0, 0.6, 0.05), emit=4)
blue = mat('cable_b', (0.1, 0.35, 0.85), rough=0.6)
yellow = mat('cable_y', (0.95, 0.75, 0.1), rough=0.6)
ups = mat('ups', (0.16, 0.17, 0.18), metal=0.2, rough=0.6)
screen = mat('screen', (0.2, 0.6, 0.9), emit=2)

units = 12
H = units * U
# frame: two posts per side + top/bottom
for x in (-W / 2 - 0.03, W / 2 + 0.03):
    box('post', (0.03, 0.05, H + 0.06), (x, 0, H / 2), frame, bevel=0.003)
box('top', (W + 0.12, 0.08, 0.03), (0, 0.01, H + 0.045), frame, bevel=0.004)
box('bottom', (W + 0.12, 0.08, 0.03), (0, 0.01, -0.015), frame, bevel=0.004)
box('back', (W + 0.12, 0.01, H + 0.09), (0, 0.32, H / 2), mat('backwall', (0.2, 0.21, 0.22), rough=0.8))
for x in (-W / 2 - 0.03, W / 2 + 0.03):
    box('side', (0.01, 0.32, H + 0.09), (x * 1.04, 0.16, H / 2), mat('sidewall', (0.18, 0.19, 0.2), rough=0.8))

def unit_z(u, height=1):
    # u counted from the top (1 = top unit)
    return H - (u - 1) * U - height * U / 2

# 1U patch panel, 24 ports
z = unit_z(1)
box('patch', (W, 0.03, U * 0.92), (0, 0, z), grey, bevel=0.002)
for i in range(24):
    x = -W / 2 + 0.035 + i * ((W - 0.07) / 23)
    box('pp', (0.012, 0.01, 0.011), (x, -0.016, z), port)
# 1U cable management with cables looping
z = unit_z(2)
box('mgmt', (W, 0.04, U * 0.9), (0, 0, z), dark, bevel=0.002)
for i in range(12):
    x = -W / 2 + 0.04 + i * ((W - 0.08) / 11)
    m = blue if i % 3 else yellow
    cyl('cable', 0.0035, U * 1.6, (x, -0.03, z + U * 0.3), m)
# 1U switch, 24 ports + LEDs + 4 SFP
z = unit_z(3)
box('switch', (W, 0.03, U * 0.92), (0, 0, z), dark, bevel=0.002)
for i in range(24):
    x = -W / 2 + 0.06 + (i // 2) * 0.026
    zz = z + (0.007 if i % 2 == 0 else -0.007)
    box('sp', (0.012, 0.01, 0.0095), (x, -0.016, zz), port)
    box('led', (0.002, 0.004, 0.002), (x + 0.008, -0.017, zz + 0.004), green if i % 5 else amber)
for i in range(4):
    box('sfp', (0.014, 0.01, 0.008), (W / 2 - 0.11 + i * 0.022, -0.016, z), mat('sfp', (0.5, 0.5, 0.55), metal=0.8, rough=0.3))
# blank 1U
box('blank', (W, 0.02, U * 0.92), (0, 0, unit_z(4)), frame)
# 2U server
z = unit_z(5, 2)
box('server', (W, 0.04, 2 * U * 0.95), (0, 0, z), mat('srv', (0.22, 0.23, 0.25), metal=0.5, rough=0.4), bevel=0.003)
for i in range(8):
    box('bay', (0.045, 0.01, 0.018), (-W / 2 + 0.05 + i * 0.05, -0.021, z), grey, bevel=0.001)
    box('bayled', (0.003, 0.004, 0.003), (-W / 2 + 0.065 + i * 0.05, -0.027, z + 0.012), green)
# second 1U server
z = unit_z(7)
box('server2', (W, 0.04, U * 0.92), (0, 0, z), mat('srv', (0.22, 0.23, 0.25), metal=0.5, rough=0.4), bevel=0.002)
for i in range(4):
    box('bay2', (0.05, 0.01, 0.022), (-W / 2 + 0.06 + i * 0.06, -0.021, z), grey, bevel=0.001)
# blanks
for u in (8, 9, 10):
    box('blank', (W, 0.02, U * 0.92), (0, 0, unit_z(u)), frame)
# 2U UPS at the bottom
z = unit_z(11, 2)
box('ups', (W, 0.05, 2 * U * 0.95), (0, 0, z), ups, bevel=0.004)
box('ups_screen', (0.07, 0.01, 0.035), (W / 2 - 0.09, -0.026, z), screen)
for i in range(3):
    box('ups_led', (0.004, 0.004, 0.004), (W / 2 - 0.15 - i * 0.012, -0.027, z), green)
box('ups_grille', (0.25, 0.008, 0.06), (-0.06, -0.026, z), mat('grille', (0.1, 0.1, 0.11), rough=0.9))

# labels on the right
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
items = [
    ('Patchpanel', unit_z(1)),
    ('Kabelführung', unit_z(2)),
    ('Switch (mit SFP-Ports)', unit_z(3)),
    ('Server (2 HE)', unit_z(5, 2)),
    ('Server (1 HE)', unit_z(7)),
    ('Blindabdeckungen', unit_z(9)),
    ('USV (unten, schwer)', unit_z(11, 2)),
]
lx = W / 2 + 0.16
for text, zz in items:
    leader((W / 2 + 0.04, -0.04, zz), (lx - 0.01, -0.04, zz), lm, r=0.0015)
    label(text, (lx, -0.04, zz - 0.009), size=0.035, material=lm)
label('19-Zoll-Netzwerkschrank, 12 HE (1 HE = 44,45 mm)', (-W / 2 - 0.05, -0.04, H + 0.08), size=0.032, material=lm)

camera((0.42, -1.55, H * 0.62), (0.16, 0, H * 0.47), lens=42)
lights()
