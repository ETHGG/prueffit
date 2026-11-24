sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
doc = mat('doc', (0.72, 0.75, 0.8), rough=0.7)
hs = mat('hash', (0.45, 0.3, 0.7), rough=0.5)
sig = mat('sig', (0.35, 0.38, 0.43), rough=0.5)
op = mat('op', (0.1, 0.32, 0.65), rough=0.5)
pub = mat('pub', (0.1, 0.5, 0.28), rough=0.4)
prv = mat('prv', (0.8, 0.2, 0.15), rough=0.4)
ok = mat('ok', (0.1, 0.55, 0.28), rough=0.5)
ar = mat('arrow', (0.3, 0.33, 0.37), rough=0.6)


def key(x, z, m, text):
    cyl('bow', 0.07, 0.03, (x - 0.12, 0, z), m, rot=(math.radians(90), 0, 0), verts=32)
    box('shaft', (0.2, 0.03, 0.03), (x + 0.04, 0, z), m)
    box('bit', (0.03, 0.03, 0.06), (x + 0.12, 0, z - 0.04), m)
    label(text, (x, -0.04, z - 0.16), size=0.042, material=lm, align='CENTER')


def node(x, z, w, m, text, size=0.05, tm=None):
    box('n', (w, 0.16, 0.24), (x, 0, z), m, bevel=0.01)
    label(text, (x, -0.09, z + (0.0 if '\n' in text else -0.02)), size=size, material=tm or wl, align='CENTER')


def arr(a, b, m=ar):
    arrow((a[0], -0.02, a[1]), (b[0], -0.02, b[1]), m, r=0.008, head=0.045)


label('Absender: signieren', (-1.15, -0.05, 1.8), size=0.07, material=lm, align='CENTER')
label('Empfänger: prüfen', (1.15, -0.05, 1.8), size=0.07, material=lm, align='CENTER')
leader((0, -0.01, 1.8), (0, -0.01, -0.15), mat('sep', (0.6, 0.63, 0.67), rough=0.8), r=0.006)
# sender
node(-1.85, 1.35, 0.42, doc, 'Dokument', tm=lm)
node(-1.15, 1.35, 0.5, op, 'Hash bilden\n(SHA-256)')
arr((-1.63, 1.35), (-1.41, 1.35))
node(-1.15, 0.85, 0.42, hs, 'Hashwert')
arr((-1.15, 1.22), (-1.15, 0.98))
node(-1.15, 0.35, 0.5, op, 'signieren')
arr((-1.15, 0.72), (-1.15, 0.48))
key(-1.85, 0.35, prv, 'privater Schlüssel\ndes Absenders')
arr((-1.65, 0.35), (-1.41, 0.35), prv)
node(-0.42, 0.35, 0.42, sig, 'Signatur')
arr((-0.89, 0.35), (-0.64, 0.35))
# transfer: document + signature
leader((-1.85, -0.02, 1.47), (-1.85, -0.02, 1.58), ar, r=0.008)
leader((-1.85, -0.02, 1.58), (0.42, -0.02, 1.58), ar, r=0.008)
arr((0.42, 1.58), (0.42, 1.48))
label('Dokument (Klartext, nicht verschlüsselt)', (-0.45, -0.06, 1.62), size=0.04, material=lm, align='CENTER')
arr((-0.2, 0.35), (0.2, 0.35))
# receiver
node(0.42, 1.35, 0.42, doc, 'Dokument', tm=lm)
node(1.05, 1.35, 0.5, op, 'Hash bilden')
arr((0.64, 1.35), (0.79, 1.35))
node(1.05, 0.85, 0.42, hs, 'Hashwert')
arr((1.05, 1.22), (1.05, 0.98))
node(0.42, 0.35, 0.42, sig, 'Signatur')
node(1.05, 0.35, 0.5, op, 'prüfen')
arr((0.64, 0.35), (0.79, 0.35))
key(1.75, 0.6, pub, 'öffentlicher Schlüssel\ndes Absenders')
arr((1.6, 0.52), (1.32, 0.4), pub)
node(1.75, 0.95, 0.46, ok, 'gleich?\n→ gültig', size=0.046)
arr((1.27, 0.85), (1.53, 0.92))
arr((1.27, 0.43), (1.53, 0.88))
label('Signatur sichert Integrität (Hash) und Authentizität (nur der Absender hat den privaten Schlüssel).', (0, -0.05, -0.32), size=0.048, material=lm, align='CENTER')
label('Vertraulich wird das Dokument dadurch nicht – dafür zusätzlich verschlüsseln.', (0, -0.05, -0.45), size=0.048, material=lm, align='CENTER')
camera_front((0, 0, 0.72), 4.5, tilt=2)
lights(0.55)
