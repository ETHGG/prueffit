sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
sw = mat('sw', (0.12, 0.13, 0.15), metal=0.3, rough=0.5)
v10 = mat('v10', (0.2, 0.45, 0.9), rough=0.5)
v20 = mat('v20', (0.2, 0.7, 0.35), rough=0.5)
trunk = mat('trunk', (0.95, 0.5, 0.1), rough=0.5)
rt = mat('router', (0.4, 0.42, 0.45), metal=0.4, rough=0.4)
box('switch', (1.6, 0.3, 0.12), (0, 0, 0.5), sw, bevel=0.01)
label('Switch', (-0.78, -0.16, 0.47), size=0.05, material=mat('white', (1, 1, 1), emit=1.0))
ports = [(-0.45, v10), (-0.3, v10), (-0.15, v10), (0.1, v20), (0.25, v20), (0.4, v20), (0.65, trunk)]
for x, m in ports:
    box('port', (0.08, 0.02, 0.06), (x, -0.16, 0.5), m)
pcs = [(-0.9, v10, 'VLAN 10 Vertrieb'), (-0.45, v10, ''), (0.15, v20, 'VLAN 20 Technik'), (0.6, v20, '')]
for i, (x, m, t) in enumerate(pcs):
    box('pc', (0.26, 0.18, 0.2), (x, 0, 0.0), m, bevel=0.01)
    port_x = ports[i if i < 2 else i + 1][0]
    leader((x, -0.05, 0.1), (port_x, -0.16, 0.47), m, r=0.008)
    if t:
        label(t, (x + 0.22, -0.12, -0.2), size=0.06, material=lm, align='CENTER')
box('router', (0.4, 0.3, 0.14), (0.85, 0, 1.05), rt, bevel=0.01)
label('Router oder Layer-3-Switch:\nInter-VLAN-Routing', (0.85, -0.2, 1.32), size=0.055, material=lm, align='CENTER')
leader((0.65, -0.16, 0.53), (0.85, -0.05, 0.98), trunk, r=0.012)
label('Trunk (IEEE 802.1Q):\nFrames mit VLAN-Tag', (0.95, -0.2, 0.76), size=0.055, material=lm)
label('Access-Ports: ungetaggt,\ngehören zu genau einem VLAN', (-1.25, -0.2, 0.76), size=0.055, material=lm)
label('VLAN 10 und VLAN 20 sind getrennte Broadcast-Domänen –\nVerkehr zwischen ihnen nur über Routing', (0.1, -0.2, -0.34), size=0.055, material=lm, align='CENTER')
camera_front((0.2, 0, 0.5), 3.3, tilt=15)
lights(0.8)
