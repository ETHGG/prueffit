sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
cust = mat('cust', (0.05, 0.22, 0.6), rough=0.5)
prov = mat('prov', (0.5, 0.53, 0.57), rough=0.6)
rows = ['Netzwerk, Hardware', 'Virtualisierung', 'Betriebssystem', 'Laufzeit, Middleware', 'Daten', 'Anwendung']
cols = [('On-Premises', 6), ('IaaS', 4), ('PaaS', 2), ('SaaS', 0)]  # number of top rows managed by the customer
W, H, G = 0.82, 0.19, 0.03
for ci, (name, n_cust) in enumerate(cols):
    x = -1.35 + ci * 0.9
    for ri, r in enumerate(rows):
        z = ri * (H + G)
        is_cust = ri >= len(rows) - n_cust
        box('c', (W, 0.4, H), (x, 0, z), cust if is_cust else prov, bevel=0.01)
        label(r, (x, -0.21, z - 0.018), size=0.05, material=wl if is_cust else lm, align='CENTER')
    label(name, (x, -0.21, len(rows) * (H + G) + 0.02), size=0.08, material=lm, align='CENTER')
box('k1', (0.12, 0.05, 0.08), (-1.2, -0.2, -0.3), cust)
label('verwaltet der Kunde', (-1.1, -0.23, -0.32), size=0.055, material=lm)
box('k2', (0.12, 0.05, 0.08), (0.35, -0.2, -0.3), prov)
label('verwaltet der Anbieter', (0.45, -0.23, -0.32), size=0.055, material=lm)
label('Auch bei SaaS bleibt der Kunde für seine Dateninhalte, Benutzerkonten und den Datenschutz (AVV) verantwortlich.', (0, -0.23, -0.48), size=0.045, material=lm, align='CENTER')
camera_front((0.0, 0, 0.6), 3.8, tilt=6)
lights(0.55)
