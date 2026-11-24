sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
cols = [mat('a', (0.1, 0.32, 0.65), rough=0.5), mat('b', (0.04, 0.36, 0.18), rough=0.5), mat('c', (0.68, 0.3, 0.02), rough=0.5), mat('d', (0.6, 0.15, 0.12), rough=0.5)]
free = mat('free', (0.78, 0.8, 0.83), rough=0.8)
L = 4.0
X0 = -L / 2
u = L / 256
segs = [(0, 128, 0, 'A  /25', '100 Hosts\n.0 – .127'), (128, 64, 1, 'B  /26', '50 Hosts\n.128 – .191'), (192, 32, 2, 'C  /27', '20 Hosts\n.192 – .223'), (224, 4, 3, 'D /30', ''), (228, 28, None, 'frei', '.228 – .255')]
for start, size, ci, t1, t2 in segs:
    x = X0 + (start + size / 2) * u
    w = size * u - 0.012
    box('seg', (w, 0.25, 0.4), (x, 0, 0.6), cols[ci] if ci is not None else free, bevel=0.006)
    tm = wl if ci is not None else lm
    if size >= 28:
        label(t1, (x, -0.14, 0.66), size=0.07 if size > 28 else 0.055, material=tm, align='CENTER')
    if t2:
        label(t2, (x, -0.06, 0.25), size=0.048, material=lm, align='CENTER')
for v in (0, 128, 192, 224, 228, 256):
    x = X0 + v * u
    leader((x, -0.05, 0.36), (x, -0.05, 0.84), mat('tick', (0.3, 0.33, 0.37), rough=0.6), r=0.004)
    dx = -0.05 if v == 224 else (0.05 if v == 228 else 0)
    label(str(v), (x + dx, -0.06, 0.9), size=0.042, material=lm, align='CENTER')
xd = X0 + 226 * u
leader((xd, -0.05, 0.36), (xd - 0.25, -0.05, -0.05), lm, r=0.004)
label('D  /30: 2 Hosts, .224 – .227', (xd - 0.25, -0.06, -0.15), size=0.048, material=lm, align='CENTER')
label('192.168.10.0/24 – letztes Oktett', (0, -0.06, 1.1), size=0.065, material=lm, align='CENTER')
label('Größte Netze zuerst; jedes Netz beginnt auf einem Vielfachen seiner Größe (128, 64, 32, 4).', (0, -0.06, -0.45), size=0.05, material=lm, align='CENTER')
label('Nutzbare Hosts = 2^(32 − Präfix) − 2: /25 → 126, /26 → 62, /27 → 30, /30 → 2', (0, -0.06, -0.58), size=0.05, material=lm, align='CENTER')
camera_front((0, 0, 0.3), 4.4, tilt=2)
lights(0.55)
