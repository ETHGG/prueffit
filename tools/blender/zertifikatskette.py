sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
root = mat('root', (0.62, 0.15, 0.45), rough=0.5)
inter = mat('inter', (0.1, 0.32, 0.65), rough=0.5)
srv = mat('srv', (0.04, 0.36, 0.18), rough=0.5)
br = mat('br', (0.22, 0.24, 0.28), rough=0.5)
ar = mat('arrow', (0.3, 0.33, 0.37), rough=0.6)


def cert(x, z, m, title, lines):
    box('c', (1.3, 0.12, 0.5), (x, 0, z), m, bevel=0.015)
    label(title, (x, -0.07, z + 0.12), size=0.058, material=wl, align='CENTER')
    for i, l in enumerate(lines):
        label(l, (x, -0.07, z - 0.02 - i * 0.09), size=0.042, material=wl, align='CENTER')


cert(-1.2, 1.4, root, 'Stammzertifikat (Root-CA)', ['signiert sich selbst', 'liegt im Zertifikatsspeicher von OS/Browser'])
cert(-1.2, 0.65, inter, 'Zwischenzertifikat', ['Aussteller: Root-CA', 'signiert von der Root-CA'])
cert(-1.2, -0.1, srv, 'Serverzertifikat www.beispiel.de', ['Aussteller: Zwischen-CA', 'öffentlicher Schlüssel, Gültigkeit'])
arrow((-1.2, -0.02, 1.13), (-1.2, -0.02, 0.92), ar, r=0.01, head=0.05)
arrow((-1.2, -0.02, 0.38), (-1.2, -0.02, 0.17), ar, r=0.01, head=0.05)
label('signiert', (-0.5, -0.05, 1.0), size=0.045, material=lm)
label('signiert', (-0.5, -0.05, 0.25), size=0.045, material=lm)
box('browser', (1.2, 0.12, 1.5), (1.15, 0, 0.62), br, bevel=0.015)
label('Browser prüft', (1.15, -0.07, 1.22), size=0.06, material=wl, align='CENTER')
for i, t in enumerate(['1  Name passt zur Adresse?', '2  Gültigkeitszeitraum?', '3  nicht widerrufen\n    (CRL, OCSP)?', '4  Signaturen bis zu einem\n    vertrauten Stammzertifikat?']):
    label(t, (0.65, -0.07, 1.0 - i * 0.26), size=0.045, material=wl)
arrow((-0.53, -0.02, -0.1), (0.53, -0.02, 0.1), ar, r=0.01, head=0.05)
label('Der Server schickt Server- und Zwischenzertifikat mit; das Stammzertifikat hat der Client schon.', (0, -0.05, -0.55), size=0.048, material=lm, align='CENTER')
label('Fehlt eine Stufe oder ist die Root-CA unbekannt, warnt der Browser („unbekannter Aussteller“).', (0, -0.05, -0.67), size=0.048, material=lm, align='CENTER')
camera_front((0, 0, 0.55), 4.3, tilt=1)
lights(0.55)
