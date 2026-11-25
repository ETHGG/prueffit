sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
blue = mat('blue', (0.1, 0.32, 0.65), rough=0.5)
orange = mat('orange', (0.68, 0.3, 0.02), rough=0.5)
green = mat('green', (0.04, 0.4, 0.18), rough=0.5)
grey = mat('grey', (0.28, 0.32, 0.36), rough=0.6)
red = mat('red', (0.75, 0.15, 0.12), rough=0.5)
ln = mat('ln', (0.15, 0.2, 0.22), rough=0.9)
def card(x, z, w, h, m, lines, sizes=(0.06, 0.042)):
    box('c', (w, 0.2, h), (x, 0, z), m, bevel=0.015)
    n = len(lines)
    for i, t in enumerate(lines):
        s = sizes[0] if i == 0 else sizes[1]
        dz = (n - 1) * 0.06 - i * 0.12
        label(t, (x, -0.11, z + dz - s / 3), size=s, material=wl, align='CENTER')
label('Skript: Benutzer aus einer CSV-Datei anlegen', (0, -0.05, 2.12), size=0.08, material=lm, align='CENTER')
steps = [('benutzer.csv', ['Vorname;Name;Abteilung'], grey), ('Einlesen', ['Import-Csv', '-Delimiter ";"'], blue),
         ('Schleife', ['foreach ($u in $liste)', 'je Zeile ein Benutzer'], blue), ('Anlegen', ['New-ADUser …', 'Gruppe zuweisen'], green),
         ('Protokoll', ['Erfolg / Fehler', 'in Logdatei schreiben'], orange)]
for i, (t, lines, m) in enumerate(steps):
    x = -1.76 + i * 0.88
    card(x, 1.25, 0.8, 0.7, m, [t] + lines, sizes=(0.06, 0.038))
    if i < 4:
        arrow((x + 0.41, -0.02, 1.25), (x + 0.47, -0.02, 1.25), ln, r=0.01, head=0.045)
label('try/catch um „Anlegen“: Ein fehlerhafter Datensatz bricht nicht das ganze Skript ab, sondern landet im Protokoll.', (0, -0.05, 0.55), size=0.046, material=lm, align='CENTER')
label('Vorher mit -WhatIf testen, Konto mit nötigen Rechten nutzen, Startpasswort nicht im Skript speichern.', (0, -0.05, 0.4), size=0.046, material=lm, align='CENTER')
label('Unter Linux entsprechend: while read -r … ; useradd … (Bash).', (0, -0.05, 0.25), size=0.046, material=lm, align='CENTER')
camera_front((0, 0, 1.1), 4.4, tilt=1)
lights(0.55)
