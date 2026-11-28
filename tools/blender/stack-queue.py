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
label('Stapel (Stack) und Warteschlange (Queue)', (0, -0.05, 2.2), size=0.075, material=lm, align='CENTER')
label('Stack – LIFO: zuletzt hinein, zuerst heraus', (-1.1, -0.05, 1.9), size=0.06, material=blue, align='CENTER')
for i, v in enumerate(['3', '7', '5']):
    card(-1.1, 0.75 + i * 0.3, 0.6, 0.26, blue if i < 2 else orange, [v], sizes=(0.08, 0.05))
box('cup', (0.7, 0.2, 0.03), (-1.1, 0, 0.58), ln)
box('cl', (0.03, 0.2, 0.95), (-1.46, 0, 1.05), ln)
box('cr', (0.03, 0.2, 0.95), (-0.74, 0, 1.05), ln)
arrow((-0.55, -0.03, 1.38), (-0.55, -0.03, 1.7), orange, r=0.01, head=0.05)
label('pop() → 5', (-0.47, -0.05, 1.5), size=0.058, material=orange)
label('push(3), push(7), push(5)', (-1.1, -0.05, 0.38), size=0.054, material=lm, align='CENTER')
label('Queue – FIFO: zuerst hinein, zuerst heraus', (1.1, -0.05, 1.9), size=0.06, material=green, align='CENTER')
for i, v in enumerate(['3', '7', '5']):
    card(0.6 + i * 0.4, 1.2, 0.34, 0.4, orange if i == 0 else green, [v], sizes=(0.08, 0.05))
box('qt', (1.4, 0.2, 0.03), (1.0, 0, 1.45), ln)
box('qb', (1.4, 0.2, 0.03), (1.0, 0, 0.95), ln)
arrow((0.35, -0.03, 1.2), (0.05, -0.03, 1.2), orange, r=0.01, head=0.05)
label('dequeue() → 3', (0.2, -0.05, 0.75), size=0.058, material=orange, align='CENTER')
arrow((1.95, -0.03, 1.2), (1.72, -0.03, 1.2), green, r=0.01, head=0.05)
label('enqueue() hinten', (1.75, -0.05, 0.75), size=0.054, material=lm, align='CENTER')
label('enqueue(3), enqueue(7), enqueue(5)', (1.1, -0.05, 0.38), size=0.054, material=lm, align='CENTER')
t = ['Stack: Aufrufstapel bei Funktionsaufrufen und Rekursion, „Rückgängig“, Klammern prüfen',
     'Queue: Druckerwarteschlange, Nachrichten zwischen Programmen, Breitensuche']
for i, s in enumerate(t):
    label(s, (0, -0.05, 0.08 - i * 0.14), size=0.054, material=lm, align='CENTER')
camera_front((0, 0, 1.05), 4.5, tilt=1)
lights(0.55)
