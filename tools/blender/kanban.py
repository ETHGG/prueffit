sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
board = mat('board', (0.55, 0.58, 0.62), rough=0.9)
col = mat('col', (0.75, 0.78, 0.82), rough=0.9)
cards = [mat('c1', (0.95, 0.75, 0.15), rough=0.7), mat('c2', (0.35, 0.6, 0.92), rough=0.7), mat('c3', (0.35, 0.75, 0.45), rough=0.7)]
box('board', (3.9, 0.05, 2.0), (0, 0.2, 0.8), board)
cols = [('To Do', ['Drucker Raum 12\nanbinden', 'Backup-Test\ndokumentieren', 'Benutzer für\nNeuzugang anlegen', 'Lizenzen\nprüfen']),
        ('In Arbeit (WIP-Limit 3)', ['Switch tauschen', 'VPN für\nAußendienst', 'Firewall-Regel\nanpassen']),
        ('Erledigt', ['Server-Update', 'Monitoring\neingerichtet'])]
for i, (name, items) in enumerate(cols):
    x = -1.28 + i * 1.28
    box('col', (1.2, 0.04, 1.75), (x, 0.15, 0.72), col)
    label(name, (x, -0.02, 1.66), size=0.06, material=lm, align='CENTER')
    for k, t in enumerate(items):
        z = 1.38 - k * 0.38
        box('card', (0.95, 0.03, 0.3), (x, 0.1, z), cards[i])
        label(t, (x, 0.07, z + (0.02 if '\n' in t else -0.02)), size=0.048, material=lm, align='CENTER')
arrow((-0.55, 0.05, 0.08), (-0.05, 0.05, 0.08), lm, r=0.008, head=0.05)
arrow((0.73, 0.05, 0.08), (1.23, 0.05, 0.08), lm, r=0.008, head=0.05)
label('Pull-Prinzip: Neue Aufgabe erst ziehen, wenn in „In Arbeit“ Platz unter dem WIP-Limit ist.', (0, -0.02, -0.38), size=0.05, material=lm, align='CENTER')
label('Kanban hat keine festen Sprints und Rollen; Ziel ist ein gleichmäßiger Fluss.', (0, -0.02, -0.5), size=0.05, material=lm, align='CENTER')
camera_front((0, 0, 0.65), 4.3, tilt=1)
lights(0.55)
