sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
srv = mat('srv', (0.25, 0.27, 0.3), metal=0.3, rough=0.4)
pc = mat('pc', (0.12, 0.3, 0.62), rough=0.5)
disk = mat('disk', (0.55, 0.6, 0.66), metal=0.4, rough=0.4)
nas = mat('nas', (0.1, 0.5, 0.28), rough=0.5)
san = mat('san', (0.45, 0.3, 0.7), rough=0.5)
swm = mat('sw', (0.8, 0.4, 0.05), rough=0.5)
lan = mat('lan', (0.3, 0.33, 0.37), rough=0.6)
fc = mat('fc', (0.45, 0.3, 0.7), rough=0.5)
panel = mat('panel', (0.86, 0.88, 0.91), rough=0.9)


def disks(x, z, n=4, w=0.09):
    for i in range(n):
        box('d', (w, 0.04, 0.08), (x - (n - 1) * (w + 0.02) / 2 + i * (w + 0.02), -0.12, z), disk, bevel=0.004)


for x in (-1.45, 0, 1.45):
    box('panel', (1.35, 0.04, 2.05), (x, 0.3, 0.75), panel)
# DAS
label('DAS', (-1.45, -0.05, 1.6), size=0.09, material=lm, align='CENTER')
box('s', (0.5, 0.2, 0.3), (-1.45, 0, 0.95), srv, bevel=0.01)
label('Server', (-1.45, -0.11, 0.93), size=0.05, material=wl, align='CENTER')
box('enc', (0.5, 0.2, 0.18), (-1.45, 0, 0.45), srv, bevel=0.01)
disks(-1.45, 0.45)
leader((-1.45, -0.02, 0.8), (-1.45, -0.02, 0.54), lan, r=0.012)
label('direkt angeschlossen\n(SAS, USB)', (-1.45, -0.05, 0.18), size=0.045, material=lm, align='CENTER')
label('nur dieser Server\nnutzt den Speicher', (-1.45, -0.05, -0.1), size=0.045, material=lm, align='CENTER')
# NAS
label('NAS', (0, -0.05, 1.6), size=0.09, material=lm, align='CENTER')
for x in (-0.4, 0.0, 0.4):
    box('pc', (0.18, 0.1, 0.14), (x, 0, 1.2), pc, bevel=0.006)
    leader((x, -0.02, 1.12), (0, -0.02, 0.95), lan, r=0.007)
box('sw', (0.5, 0.15, 0.08), (0, 0, 0.9), swm, bevel=0.006)
label('LAN-Switch', (0.36, -0.05, 0.88), size=0.04, material=lm)
leader((0, -0.02, 0.86), (0, -0.02, 0.6), lan, r=0.01)
box('nas', (0.5, 0.2, 0.22), (0, 0, 0.47), nas, bevel=0.01)
disks(0, 0.47)
label('Dateiebene über das LAN\n(SMB, NFS)', (0, -0.05, 0.18), size=0.045, material=lm, align='CENTER')
label('Freigaben für viele Clients', (0, -0.05, -0.1), size=0.045, material=lm, align='CENTER')
# SAN
label('SAN', (1.45, -0.05, 1.6), size=0.09, material=lm, align='CENTER')
for x in (1.2, 1.7):
    box('s', (0.32, 0.2, 0.22), (x, 0, 1.2), srv, bevel=0.01)
    label('Server', (x, -0.11, 1.18), size=0.045, material=wl, align='CENTER')
    leader((x, -0.02, 1.09), (1.45, -0.02, 0.95), fc, r=0.01)
box('fcs', (0.5, 0.15, 0.08), (1.45, 0, 0.9), san, bevel=0.006)
label('Speichernetz', (1.72, -0.05, 0.88), size=0.04, material=lm)
leader((1.45, -0.02, 0.86), (1.45, -0.02, 0.6), fc, r=0.012)
box('arr', (0.6, 0.2, 0.22), (1.45, 0, 0.47), san, bevel=0.01)
disks(1.45, 0.47, n=5)
label('Blockebene (Fibre Channel,\niSCSI): wirkt wie lokale Platte', (1.45, -0.05, 0.18), size=0.045, material=lm, align='CENTER')
label('Datenbanken, Virtualisierung', (1.45, -0.05, -0.1), size=0.045, material=lm, align='CENTER')
camera_front((0, 0, 0.72), 4.3, tilt=2)
lights(0.55)
