sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
blue = mat('blue', (0.1, 0.32, 0.65), rough=0.5)
orange = mat('orange', (0.68, 0.3, 0.02), rough=0.5)
green = mat('green', (0.04, 0.4, 0.18), rough=0.5)
grey = mat('grey', (0.28, 0.32, 0.36), rough=0.6)
red = mat('red', (0.75, 0.15, 0.12), rough=0.5)
ln = mat('ln', (0.15, 0.2, 0.22), rough=0.9)
def card(x, z, w, h, m, lines, sizes=(0.062, 0.05)):
    box('c', (w, 0.2, h), (x, 0, z), m, bevel=0.015)
    n = len(lines)
    for i, t in enumerate(lines):
        s = sizes[0] if i == 0 else sizes[1]
        dz = (n - 1) * 0.06 - i * 0.12
        label(t, (x, -0.11, z + dz - s / 3), size=s, material=wl, align='CENTER')
label('Operatoren: Wie viel gehört in die Antwort? Beispiel USV', (0, -0.05, 2.15), size=0.072, material=lm, align='CENTER')
st = [('nennen', grey, ['Online-USV']),
      ('beschreiben', blue, ['Die Online-USV versorgt die Last', 'dauerhaft über den Wechselrichter.']),
      ('erläutern', green, ['Weil die Last immer am Wechselrichter', 'hängt, gibt es beim Netzausfall keine', 'Umschaltzeit – das schützt Server.']),
      ('beurteilen', orange, ['Für den Serverraum geeignet: keine Um-', 'schaltzeit, aber teurer und mehr Abwärme;', 'Urteil: lohnt sich bei kritischen Diensten.'])]
x0 = -1.65
for i, (op, m, lines) in enumerate(st):
    x = x0 + i * 1.1
    h = 0.35 + i * 0.28
    box('s', (1.02, 0.18, h), (x, 0, 0.55 + h / 2), m, bevel=0.01)
    label(op, (x, -0.1, 0.55 + h - 0.12), size=0.058, material=wl, align='CENTER')
    for k, t in enumerate(lines):
        label(t, (x, -0.05, 0.55 + h + 0.08 + (len(lines) - 1 - k) * 0.075), size=0.058, material=lm, align='CENTER')
label('Faustregel: etwa ein Gedanke pro Punkt. „Erläutern“ braucht ganze Sätze mit „weil …“, „beurteilen“ Kriterien und ein eigenes Urteil.', (0, -0.05, 0.3), size=0.058, material=lm, align='CENTER')
camera_front((0, 0, 1.15), 4.4, tilt=1)
lights(0.55)
