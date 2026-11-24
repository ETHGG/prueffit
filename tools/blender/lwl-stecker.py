import math
sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
blue = mat('sm', (0.15, 0.35, 0.8), rough=0.5)
cer = mat('ceramic', (0.93, 0.9, 0.8), rough=0.3)
metal = mat('metal', (0.62, 0.64, 0.68), metal=0.9, rough=0.3)
boot = mat('boot', (0.12, 0.12, 0.13), rough=0.6)
cab = mat('cable', (0.95, 0.75, 0.1), rough=0.6)
RX = (0, math.radians(90), 0)  # cylinder axis along x, ferrule points to -x
S = 22
def cable(x0, z, length=0.25):
    cyl('cable', 0.0015 * S, length, (x0 + length / 2, 0, z), cab, rot=RX, verts=24)
def lc(z, dy):
    box('lc_body', (0.013 * S, 0.0045 * S, 0.0045 * S), (0, dy, z), blue, bevel=0.003)
    box('lc_latch', (0.008 * S, 0.003 * S, 0.0012 * S), (0.002 * S, dy, z + 0.003 * S), blue, bevel=0.002)
    cyl('lc_ferrule', 0.0009 * S, 0.008 * S, (-0.0105 * S, dy, z), cer, rot=RX)
    cyl('lc_boot', 0.0018 * S, 0.012 * S, (0.0125 * S, dy, z), boot, rot=RX)
def sc_(z):
    box('sc_body', (0.016 * S, 0.009 * S, 0.0075 * S), (0, 0, z), blue, bevel=0.005)
    cyl('sc_ferrule', 0.0015 * S, 0.008 * S, (-0.012 * S, 0, z), cer, rot=RX)
    cyl('sc_boot', 0.0025 * S, 0.016 * S, (0.016 * S, 0, z), boot, rot=RX)
def st(z):
    cyl('st_body', 0.0045 * S, 0.012 * S, (0, 0, z), metal, rot=RX)
    box('st_pin', (0.0012 * S, 0.001 * S, 0.0012 * S), (-0.004 * S, 0, z + 0.0048 * S), metal)
    cyl('st_ferrule', 0.0015 * S, 0.008 * S, (-0.01 * S, 0, z), cer, rot=RX)
    cyl('st_boot', 0.0025 * S, 0.016 * S, (0.014 * S, 0, z), boot, rot=RX)
rows = [
    (0.2, 'LC (Duplex)', 'Ferrule 1,25 mm · klein, Rastnase · Standard bei SFP-Modulen'),
    (0.0, 'SC', 'Ferrule 2,5 mm · quadratisch, Push-Pull · häufig im Patchfeld'),
    (-0.2, 'ST', 'Ferrule 2,5 mm · rund, Bajonettverschluss · ältere Installationen'),
]
box('backplate', (1.15, 0.01, 0.72), (-0.02, 0.12, 0.0), mat('plate', (0.55, 0.6, 0.65), rough=0.8))
lc(0.2, -0.025); lc(0.2, 0.025)
cable(0.0215 * S, 0.2, 0.12)
sc_(0.0); cable(0.024 * S, 0.0, 0.1)
st(-0.2); cable(0.022 * S, -0.2, 0.12)
for z, title, text in rows:
    label(title, (0.78, -0.06, z + 0.005), size=0.06, material=lm)
    label(text, (0.78, -0.06, z - 0.05), size=0.036, material=lm)
label('Ferrule (Keramik)', (-0.45, -0.06, 0.3), size=0.04, material=lm, align='CENTER')
leader((-0.4, -0.06, 0.29), (-0.012 * S - 0.06, -0.03, 0.205), lm, r=0.002)
label('LWL-Steckertypen (eigene Modelle). Die Ferrule ist die Keramikhülse, in der die Faser sitzt.', (-0.6, -0.06, 0.42), size=0.04, material=lm)
label('Farbe: Blau = Singlemode (PC/UPC), Grün = Singlemode APC (schräger Schliff), Beige/Aqua = Multimode', (-0.6, -0.06, -0.42), size=0.036, material=lm)
camera_front((0.62, 0, 0.0), 2.6, tilt=10, dist=3.0)
lights(0.5)
