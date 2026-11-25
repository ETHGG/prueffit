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
label('Cluster aktiv/passiv: Failover beim Ausfall', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
def panel(cx, title, act, failed):
    label(title, (cx, -0.05, 1.9), size=0.055, material=lm, align='CENTER')
    card(cx, 1.62, 0.9, 0.3, orange, ['virtuelle IP 10.0.0.50'], sizes=(0.045, 0.04))
    for k, n in enumerate(['Knoten 1', 'Knoten 2']):
        x = cx - 0.5 + k * 1.0
        m = red if failed == k else (green if act == k else grey)
        st = 'ausgefallen' if failed == k else ('aktiv' if act == k else 'passiv (Standby)')
        card(x, 1.05, 0.8, 0.45, m, [n, st], sizes=(0.05, 0.036))
        if failed != k:
            leader((x, -0.03, 1.28), (cx, -0.03, 1.47), ln, r=0.005) if act == k else None
        leader((x, -0.03, 0.82), (cx, -0.03, 0.58), ln, r=0.005)
    leader((cx - 0.1, -0.03, 1.05), (cx + 0.1, -0.03, 1.05), red if failed is not None else ln, r=0.005)
    label('Heartbeat', (cx, -0.05, 1.12), size=0.032, material=lm, align='CENTER')
    card(cx, 0.45, 0.9, 0.28, blue, ['gemeinsamer Speicher (SAN)'], sizes=(0.04, 0.035))
panel(-1.05, 'Normalbetrieb', 0, None)
panel(1.05, 'Nach Ausfall von Knoten 1', 1, 0)
arrow((-0.22, -0.03, 1.3), (0.22, -0.03, 1.3), ln, r=0.01, head=0.06)
label('Fehlt der Heartbeat, startet Knoten 2 die Dienste und übernimmt die virtuelle IP – die Clients merken nur eine kurze Unterbrechung.', (0, -0.05, 0.12), size=0.04, material=lm, align='CENTER')
label('Aktiv/aktiv: beide Knoten arbeiten und teilen sich die Last; dann muss jeder die Last des anderen mittragen können.', (0, -0.05, 0.0), size=0.04, material=lm, align='CENTER')
camera_front((0, 0, 1.05), 4.4, tilt=1)
lights(0.55)
