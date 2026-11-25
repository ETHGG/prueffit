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
label('Git: vom Arbeitsverzeichnis bis zum Server', (0, -0.05, 2.15), size=0.08, material=lm, align='CENTER')
xs = [-1.5, -0.5, 0.5, 1.5]
names = [('Arbeits-', 'verzeichnis', grey), ('Staging-', 'Bereich', orange), ('lokales', 'Repository', blue), ('entferntes', 'Repository (Server)', green)]
for x, (a, b, m) in zip(xs, names):
    box('n', (0.8, 0.25, 0.6), (x, 0, 1.45), m, bevel=0.015)
    label(a, (x, -0.14, 1.5), size=0.05, material=wl, align='CENTER')
    label(b, (x, -0.14, 1.4), size=0.04, material=wl, align='CENTER')
for (a, b), cmd in zip(zip(xs, xs[1:]), ['git add', 'git commit -m "…"', 'git push']):
    arrow((a + 0.42, -0.03, 1.55), (b - 0.42, -0.03, 1.55), ln, r=0.007, head=0.04)
    label(cmd, ((a + b) / 2, -0.05, 1.82), size=0.038, material=lm, align='CENTER')
arrow((xs[3] - 0.1, -0.03, 1.1), (xs[0] + 0.1, -0.03, 1.1), ln, r=0.007, head=0.05)
label('git pull (holen und zusammenführen)', (0, -0.05, 0.98), size=0.04, material=lm, align='CENTER')
leader((xs[3], -0.03, 1.15), (xs[3], -0.03, 1.1), ln, r=0.007)
leader((xs[0], -0.03, 1.15), (xs[0], -0.03, 1.1), ln, r=0.007)
label('Branch: eigener Zweig je Funktion → Pull Request mit Code-Review → Merge in den Hauptzweig', (0, -0.05, 0.6), size=0.042, material=lm, align='CENTER')
label('Ein Commit ist ein fester Stand mit Nachricht; bei Konflikten wird von Hand zusammengeführt.', (0, -0.05, 0.45), size=0.042, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
