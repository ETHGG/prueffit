sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
cl = mat('cl', (0.1, 0.32, 0.65), rough=0.5)
sv = mat('sv', (0.22, 0.24, 0.28), metal=0.3, rough=0.4)
a = mat('a', (0.1, 0.4, 0.8), rough=0.4)
b = mat('b', (0.04, 0.36, 0.18), rough=0.4)
enc = mat('enc', (0.68, 0.3, 0.02), rough=0.4)
tl = mat('tl', (0.55, 0.58, 0.62), rough=0.6)
for x, m, t in [(-1.3, cl, 'Browser'), (1.3, sv, 'Webserver (Port 443)')]:
    box('n', (1.0, 0.25, 0.3), (x, 0, 1.75), m, bevel=0.012)
    label(t, (x, -0.14, 1.73), size=0.05, material=wl, align='CENTER')
    leader((x, 0, 1.6), (x, 0, 0.2), tl, r=0.007)
steps = [(-1, a, '1  ClientHello: TLS-Versionen, Verfahren, Schlüsselanteil'),
         (1, b, '2  ServerHello + Zertifikat + Schlüsselanteil (signiert)'),
         (0, None, '3  Browser prüft das Zertifikat (Kette, Name, Gültigkeit)'),
         (-1, a, '4  beide berechnen denselben Sitzungsschlüssel (ECDHE)'),
         (2, enc, '5  Daten (HTTP) symmetrisch verschlüsselt, z. B. AES-GCM')]
for i, (d, m, t) in enumerate(steps):
    z = 1.35 - i * 0.26
    if d == -1:
        arrow((-1.28, -0.03, z), (1.28, -0.03, z), m, r=0.01, head=0.05)
    elif d == 1:
        arrow((1.28, -0.03, z), (-1.28, -0.03, z), m, r=0.01, head=0.05)
    elif d == 2:
        leader((-1.28, -0.03, z), (1.28, -0.03, z), m, r=0.02)
    label(t, (0, -0.06, z + 0.05), size=0.045, material=lm, align='CENTER')
label('Vereinfacht nach TLS 1.3: Der Schlüssel wird ausgehandelt, nicht übertragen; das Zertifikat beweist die Echtheit des Servers.', (0, -0.05, -0.05), size=0.044, material=lm, align='CENTER')
camera_front((0, 0, 0.85), 4.2, tilt=1)
lights(0.55)
