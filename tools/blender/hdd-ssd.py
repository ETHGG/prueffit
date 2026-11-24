import math
sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
alu = mat('alu', (0.7, 0.72, 0.75), metal=0.9, rough=0.3)
platter = mat('platter', (0.85, 0.87, 0.9), metal=1.0, rough=0.08)
arm = mat('arm', (0.35, 0.37, 0.4), metal=0.8, rough=0.3)
pcbm = mat('pcb', (0.07, 0.16, 0.12), rough=0.6)
chip = mat('chip', (0.05, 0.05, 0.06), rough=0.4)
gold = mat('gold', (1.0, 0.78, 0.3), metal=1.0, rough=0.3)
# HDD (3.5 inch, opened), left
HX = -0.03
box('hdd_case', (0.102, 0.147, 0.012), (HX, 0, 0), alu, bevel=0.003)
cyl('platter', 0.0475, 0.002, (HX, 0.02, 0.008), platter, verts=96)
cyl('spindle', 0.012, 0.006, (HX, 0.02, 0.011), arm)
cyl('pivot', 0.008, 0.008, (HX + 0.032, -0.05, 0.01), arm)
leader((HX + 0.032, -0.05, 0.012), (HX + 0.012, 0.0, 0.012), arm, r=0.0025)
box('head', (0.006, 0.006, 0.003), (HX + 0.012, 0.0, 0.0125), mat('head', (0.9, 0.5, 0.1), rough=0.4))
# SSD (M.2 2280), right
SX = 0.13
box('ssd_pcb', (0.022, 0.08, 0.0015), (SX, 0, 0), pcbm)
for k in range(2):
    box('nand', (0.016, 0.018, 0.0016), (SX, -0.012 + k * 0.022, 0.0015), chip)
box('ctrl', (0.014, 0.014, 0.0016), (SX, 0.028, 0.0015), chip)
for k in range(10):
    box('pin', (0.0012, 0.004, 0.0003), (SX - 0.008 + k * 0.0018, -0.0385, 0.0009), gold)
items = [
    ('Magnetscheibe (Platter)', (HX, 0.05, 0.009), (-0.1, 0.09)),
    ('Spindelmotor', (HX, 0.02, 0.014), (-0.1, 0.05)),
    ('Schreib-/Lesekopf', (HX + 0.012, 0.0, 0.014), (-0.1, -0.01)),
    ('Schreib-/Lesearm (Aktuator)', (HX + 0.03, -0.045, 0.014), (-0.1, -0.06)),
    ('NAND-Flash-Speicherchips', (SX, 0.0, 0.003), (0.16, 0.0)),
    ('Controller', (SX, 0.028, 0.003), (0.16, 0.03)),
    ('M.2-Kontakte (PCIe/NVMe)', (SX, -0.0385, 0.002), (0.16, -0.045)),
]
for text, a, (lx, ly) in items:
    leader(a, (lx + (0.0 if lx > 0 else 0.0), ly, 0.02), lm, r=0.0004)
    label(text, (lx + (0.003 if lx > 0 else -0.003), ly - 0.0025, 0.02), size=0.0078, material=lm, rot=(0, 0, 0), align='LEFT' if lx > 0 else 'RIGHT')
label('HDD (3,5 Zoll, geöffnet):\nmechanisch, bewegte Teile', (HX, -0.088, 0.02), size=0.009, material=lm, rot=(0, 0, 0), align='CENTER')
label('SSD (M.2 2280):\nFlash-Speicher, keine bewegten Teile', (SX + 0.03, -0.065, 0.02), size=0.009, material=lm, rot=(0, 0, 0), align='CENTER')
camera((0.03, 0.0, 1.0), (0.03, 0.0, 0.0), lens=50, ortho=0.47)
lights(0.7)
