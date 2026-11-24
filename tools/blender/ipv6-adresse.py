sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
cols = [mat('glob', (0.1, 0.32, 0.65), rough=0.5), mat('sub', (0.85, 0.45, 0.05), rough=0.5), mat('iid', (0.1, 0.5, 0.28), rough=0.5)]
blocks = [('2001', 0), ('0db8', 0), ('0a0b', 0), ('0012', 1), ('3c4d', 2), ('5e6f', 2), ('7a8b', 2), ('9c0d', 2)]
BW, G = 0.44, 0.04
x0 = -(8 * BW + 7 * G) / 2 + BW / 2
xs = []
for i, (t, k) in enumerate(blocks):
    x = x0 + i * (BW + G)
    xs.append(x)
    box('blk', (BW, 0.2, 0.34), (x, 0, 0.6), cols[k], bevel=0.012)
    label(t, (x, -0.11, 0.56), size=0.095, material=wl, align='CENTER')
    label('16 Bit', (x, -0.11, 0.33), size=0.042, material=lm, align='CENTER')
    if i < 7:
        label(':', (x + BW / 2 + G / 2, -0.11, 0.56), size=0.095, material=lm, align='CENTER')


def brace(xa, xb, z, m, text, size=0.052, up=False):
    d = 0.08 if up else -0.08
    leader((xa, -0.05, z), (xb, -0.05, z), m, r=0.01)
    leader((xa, -0.05, z), (xa, -0.05, z - d), m, r=0.01)
    leader((xb, -0.05, z), (xb, -0.05, z - d), m, r=0.01)
    label(text, ((xa + xb) / 2, -0.07, z + (0.06 if up else -0.13)), size=size, material=lm, align='CENTER')


L = lambda i: xs[i] - BW / 2
R = lambda i: xs[i] + BW / 2
brace(L(0), R(2), 0.2, cols[0], 'Globales Routing-Präfix /48\n(vom Provider)')
brace(L(3), R(3), 0.2, cols[1], 'Subnetz-ID\n16 Bit')
brace(L(4), R(7), 0.2, cols[2], 'Interface-ID 64 Bit\n(SLAAC oder DHCPv6)')
brace(L(0), R(3), 0.9, lm, 'Präfix /64 = Netzanteil', up=True)
brace(L(4), R(7), 0.9, lm, 'Hostanteil', up=True)
label('Gekürzt: 2001:db8:a0b:12:3c4d:5e6f:7a8b:9c0d/64  (führende Nullen je Block weglassen)', (0, -0.07, -0.42), size=0.055, material=lm, align='CENTER')
label('16 Bit Subnetz-ID: 2^16 = 65.536 Netze /64 aus einem /48', (0, -0.07, -0.56), size=0.05, material=lm, align='CENTER')
camera_front((0, 0, 0.45), 4.2, tilt=2)
lights(0.55)
