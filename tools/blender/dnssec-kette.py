sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
wl = mat('white', (1, 1, 1), emit=1.0)
pan = mat('pan', (0.82, 0.85, 0.88), rough=0.7)
key = mat('key', (0.1, 0.32, 0.65), rough=0.5)
ds = mat('ds', (0.68, 0.3, 0.02), rough=0.5)
rec = mat('rec', (0.28, 0.32, 0.36), rough=0.5)
sig = mat('sig', (0.04, 0.42, 0.2), rough=0.6)
gr = mat('grtxt', (0.02, 0.3, 0.12), rough=1.0)
hsh = mat('hsh', (0.45, 0.17, 0.0), rough=0.6)
label('DNSSEC: Vertrauenskette von der Root-Zone bis zum Eintrag', (0, -0.05, 2.45), size=0.075, material=lm, align='CENTER')
cols = [(-1.7, 'Root-Zone  „.“', 'DS-Eintrag für .de', 'Hash des .de-Schlüssels'),
        (0.0, 'Zone  .de', 'DS-Eintrag für beispiel.de', 'Hash des Zonenschlüssels'),
        (1.7, 'Zone  beispiel.de', 'A-Eintrag  www', '203.0.113.10')]
for i, (x, title, t1, t2) in enumerate(cols):
    box('pan', (1.4, 0.1, 1.75), (x, 0.12, 1.08), pan, bevel=0.02)
    label(title, (x - 0.62, -0.05, 1.79), size=0.058, material=lm)
    box('key', (1.1, 0.2, 0.34), (x, 0, 1.45), key, bevel=0.012)
    label('DNSKEY', (x, -0.11, 1.48), size=0.05, material=wl, align='CENTER')
    label('öffentlicher Schlüssel', (x, -0.11, 1.37), size=0.044, material=wl, align='CENTER')
    m = rec if i == 2 else ds
    box('ds', (1.1, 0.2, 0.34), (x, 0, 0.62), m, bevel=0.012)
    label(t1, (x, -0.11, 0.66), size=0.05, material=wl, align='CENTER')
    label(t2, (x, -0.11, 0.54), size=0.044, material=wl, align='CENTER')
    arrow((x, -0.13, 1.27), (x, -0.13, 0.8), sig, r=0.011, head=0.07)
    label('signiert', (x + 0.06, -0.05, 1.07), size=0.048, material=gr)
    label('(RRSIG)', (x + 0.06, -0.05, 0.97), size=0.044, material=gr)
# hash links: DS in parent -> DNSKEY of child
for xa, xb in ((-1.7, 0.0), (0.0, 1.7)):
    arrow((xa + 0.56, -0.15, 0.7), (xb - 0.56, -0.15, 1.38), hsh, r=0.01, head=0.07)
    label('passt der', ((xa + xb) / 2 - 0.2, -0.2, 1.22), size=0.048, material=hsh, align='CENTER')
    label('Hash?', ((xa + xb) / 2 - 0.2, -0.2, 1.12), size=0.048, material=hsh, align='CENTER')
# trust anchor
box('anchor', (1.1, 0.2, 0.24), (-1.45, 0, 2.12), sig, bevel=0.012)
label('Vertrauensanker im Resolver', (-1.45, -0.11, 2.09), size=0.048, material=wl, align='CENTER')
arrow((-1.3, -0.13, 2.0), (-1.3, -0.13, 1.63), sig, r=0.011, head=0.07)
label('Der validierende Resolver prüft jede Signatur und jeden Hash von oben nach unten. Bricht die Kette, verwirft er die Antwort (Fehler SERVFAIL).', (0, -0.05, 0.08), size=0.05, material=lm, align='CENTER')
label('DNSSEC sichert Echtheit und Unverfälschtheit der Antworten, verschlüsselt aber nichts (Vertraulichkeit: DNS über TLS/HTTPS).', (0, -0.05, -0.05), size=0.05, material=lm, align='CENTER')
label('In der Praxis meist zwei Schlüssel je Zone: KSK (signiert die Schlüssel, auf ihn zeigt der DS-Eintrag) und ZSK (signiert die Einträge).', (0, -0.05, -0.18), size=0.05, material=lm, align='CENTER')
camera_front((0, 0, 1.12), 5.0, tilt=1)
lights(0.55)
