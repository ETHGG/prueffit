sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
line = mat('line', (0.3, 0.32, 0.35), rough=0.6)
lv = [mat('l0', (0.55, 0.62, 0.72), rough=0.6), mat('l1', (0.45, 0.68, 0.88), rough=0.6), mat('l2', (0.5, 0.78, 0.58), rough=0.6), mat('l3', (0.95, 0.75, 0.4), rough=0.6)]
nodes = {
    '24': (0.0, 1.0, '192.168.1.0/24', '254 Hosts'),
    '25a': (-0.8, 0.62, '192.168.1.0/25', '.1 – .126'),
    '25b': (0.8, 0.62, '192.168.1.128/25', '.129 – .254'),
    '26a': (0.35, 0.24, '192.168.1.128/26', '.129 – .190'),
    '26b': (1.25, 0.24, '192.168.1.192/26', '.193 – .254'),
    '27a': (0.85, -0.14, '192.168.1.192/27', '.193 – .222'),
    '27b': (1.65, -0.14, '192.168.1.224/27', '.225 – .254'),
}
level = {'24': 0, '25a': 1, '25b': 1, '26a': 2, '26b': 2, '27a': 3, '27b': 3}
for k, (x, z, net, hosts) in nodes.items():
    box(k, (0.72, 0.1, 0.27), (x, 0, z), lv[level[k]], bevel=0.015)
    label(net, (x, -0.06, z + 0.02), size=0.058, material=lm, align='CENTER')
    label(hosts, (x, -0.06, z - 0.085), size=0.052, material=lm, align='CENTER')
for a, b in [('24', '25a'), ('24', '25b'), ('25b', '26a'), ('25b', '26b'), ('26b', '27a'), ('26b', '27b')]:
    xa, za = nodes[a][0], nodes[a][1] - 0.14
    xb, zb = nodes[b][0], nodes[b][1] + 0.14
    leader((xa, 0.0, za), (xb, 0.0, zb), line, r=0.008)
for z, t in [(1.0, '/24: 256 Adressen'), (0.62, '/25: 128 Adressen'), (0.24, '/26: 64 Adressen'), (-0.14, '/27: 32 Adressen')]:
    label(t, (-1.6, -0.06, z - 0.02), size=0.05, material=lm)
label('Je Bit mehr im Präfix halbiert sich das Netz · nutzbare Hosts = 2^(32 − Präfix) − 2', (0.0, -0.06, -0.48), size=0.05, material=lm, align='CENTER')
camera_front((0.12, 0, 0.3), 3.9, tilt=6)
lights(0.8)
