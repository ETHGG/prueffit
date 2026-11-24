#!/usr/bin/env python3
"""Draws the SVG sketches for the study notes (since 2.19): img/notes/skizze-*.svg.

Run from the repository root: python3 tools/sketches/build.py
Each sketch: view box 1200 × 800 (same 3:2 frame as the rendered pictures), own white
background, large type (the sketch is shown about 340 px wide on an iPhone SE), no external
references. Edit the drawing functions below and run the script again.
"""
from html import escape
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / 'img' / 'notes'
INK = '#10201f'
MUTED = '#4b5d5c'
TEAL = '#0f766e'
TEAL_BG = '#e6f4f1'
LINE = '#9db3b0'
FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"


def svg(title, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" '
            f'role="img" font-family="{FONT}">\n<title>{escape(title)}</title>\n'
            f'<rect x="0" y="0" width="1200" height="800" fill="#ffffff"/>\n'
            '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            f'<path d="M0,0 L10,5 L0,10 z" fill="{TEAL}"/></marker></defs>\n'
            f'{body}\n</svg>\n')


def text(x, y, s, size=40, fill=INK, weight=400, anchor='start'):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{weight}" text-anchor="{anchor}">{escape(s)}</text>'


def box(x, y, w, h, fill=TEAL_BG, stroke=TEAL, rx=14, sw=4):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'


def arrow(x1, y1, x2, y2, dash=False, color=TEAL):
    d = ' stroke-dasharray="14 10"' if dash else ''
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="5"{d} marker-end="url(#arrow)"/>'


def heading(s):
    return text(600, 70, s, 46, INK, 700, 'middle')


# ---- hardware.einheiten: decimal vs. binary prefixes ----
def einheiten():
    rows = [('kB', '1.000 Byte', 'KiB', '1.024 Byte'), ('MB', '1.000 kB', 'MiB', '1.024 KiB'),
            ('GB', '1.000 MB', 'GiB', '1.024 MiB'), ('TB', '1.000 GB', 'TiB', '1.024 GiB')]
    out = [heading('Dezimal (SI) und binär (IEC)'),
           text(300, 150, 'Faktor 1.000 = 10³', 38, TEAL, 700, 'middle'),
           text(900, 150, 'Faktor 1.024 = 2¹⁰', 38, TEAL, 700, 'middle')]
    for i, (a, av, b, bv) in enumerate(rows):
        y = 190 + i * 112
        out += [box(60, y, 480, 92), text(90, y + 62, a, 48, INK, 700), text(510, y + 62, av, 40, INK, 400, 'end'),
                box(660, y, 480, 92), text(690, y + 62, b, 48, INK, 700), text(1110, y + 62, bv, 40, INK, 400, 'end')]
    out += [text(600, 690, '1 TB = 10¹² Byte ≈ 931 GiB (≈ 0,91 TiB)', 40, INK, 700, 'middle'),
            text(600, 750, '1 Byte = 8 Bit · Datenraten in Bit/s, Dateien in Byte', 36, MUTED, 400, 'middle')]
    return 'Dezimale und binäre Einheiten im Vergleich', '\n'.join(out)


# ---- projekt.risiko: risk matrix (likelihood × impact) ----
def risikomatrix():
    colors = {1: ('#dcfce7', '#166534', 'gering'), 2: ('#fef9c3', '#854d0e', 'mittel'), 3: ('#fee2e2', '#991b1b', 'hoch')}
    # rating = class of likelihood (1–3) × impact (1–3): 1–2 gering, 3–4 mittel, 6–9 hoch
    level = lambda p, s: 1 if p * s <= 2 else 2 if p * s <= 4 else 3
    out = [heading('Risikomatrix: Wahrscheinlichkeit × Schaden')]
    x0, y0, c = 330, 120, 260 // 1  # cell width
    cw, ch = 270, 160
    labels = ['gering', 'mittel', 'hoch']
    for si, s in enumerate([3, 2, 1]):  # rows: impact high at top
        y = y0 + si * ch
        out.append(text(x0 - 20, y + ch / 2 + 14, labels[s - 1], 38, INK, 400, 'end'))
        for p in (1, 2, 3):
            x = x0 + (p - 1) * cw
            bg, fg, word = colors[level(p, s)]
            out += [f'<rect x="{x}" y="{y}" width="{cw}" height="{ch}" fill="{bg}" stroke="#ffffff" stroke-width="6"/>',
                    text(x + cw / 2, y + ch / 2 + 2, word, 40, fg, 700, 'middle'),
                    text(x + cw / 2, y + ch / 2 + 50, f'{p} × {s} = {p * s}', 32, fg, 400, 'middle')]
    for p in (1, 2, 3):
        out.append(text(x0 + (p - 1) * cw + cw / 2, y0 + 3 * ch + 50, labels[p - 1], 38, INK, 400, 'middle'))
    out += [text(x0 + 1.5 * cw, y0 + 3 * ch + 100, 'Eintrittswahrscheinlichkeit →', 38, TEAL, 700, 'middle'),
            f'<text x="80" y="{y0 + 1.5 * ch}" font-size="38" fill="{TEAL}" font-weight="700" text-anchor="middle" '
            f'transform="rotate(-90 80 {y0 + 1.5 * ch})">Schadenshöhe →</text>']
    return 'Risikomatrix mit Ampelfarben aus Eintrittswahrscheinlichkeit und Schadenshöhe', '\n'.join(out)


# ---- programmierung.testen: V-model, test levels opposite the design steps ----
def testebenen():
    left = ['Anforderungen', 'Systementwurf', 'Architektur', 'Feinentwurf']
    right = ['Abnahmetest', 'Systemtest', 'Integrationstest', 'Komponententest']
    out = [heading('V-Modell: jede Entwurfsstufe hat ihre Teststufe')]
    w, h, step, shift = 370, 80, 122, 50
    for i in range(4):
        y = 115 + i * step
        lx, rx = 30 + i * shift, 800 - i * shift
        out += [box(lx, y, w, h), text(lx + w / 2, y + 54, left[i], 38, INK, 700, 'middle'),
                box(rx, y, w, h, '#ffffff'), text(rx + w / 2, y + 54, right[i], 38, TEAL, 700, 'middle'),
                arrow(lx + w + 12, y + h / 2, rx - 14, y + h / 2, dash=True, color=LINE)]
        if i < 3:
            out += [arrow(lx + 70, y + h + 4, lx + 70, y + step - 6),
                    arrow(rx + w - 70, y + step - 4, rx + w - 70, y + h + 8)]
    yb = 115 + 3 * step + h
    out += [box(415, 630, 370, 80, TEAL, TEAL), text(600, 683, 'Programmierung', 38, '#ffffff', 700, 'middle'),
            arrow(30 + 3 * shift + 60, yb + 4, 430, 650), arrow(770, 650, 800 - 3 * shift + w - 60, yb + 8),
            text(600, 770, 'gestrichelt: Was entworfen wird, wird auf derselben Stufe getestet.', 30, MUTED, 400, 'middle')]
    return 'V-Modell mit Entwurfsstufen links und den zugehörigen Teststufen rechts', '\n'.join(out)


# ---- recht.vertragsrecht: contract by two declarations, then obligations and fulfilment ----
def kaufvertrag():
    out = [heading('Kaufvertrag: Abschluss, Pflichten, Erfüllung'),
           box(60, 120, 470, 120), text(295, 172, 'Antrag', 44, INK, 700, 'middle'), text(295, 218, '1. Willenserklärung', 34, MUTED, 400, 'middle'),
           box(670, 120, 470, 120), text(905, 172, 'Annahme', 44, INK, 700, 'middle'), text(905, 218, '2. Willenserklärung', 34, MUTED, 400, 'middle'),
           text(600, 192, '+', 60, TEAL, 700, 'middle'),
           arrow(600, 250, 600, 300),
           box(60, 310, 1080, 230, '#ffffff'),
           text(600, 362, 'Kaufvertrag = Verpflichtungsgeschäft', 42, TEAL, 700, 'middle'),
           text(90, 420, 'Verkäufer muss:', 36, INK, 700), text(90, 466, 'Ware übergeben und', 36), text(90, 510, 'Eigentum verschaffen', 36),
           text(640, 420, 'Käufer muss:', 36, INK, 700), text(640, 466, 'Kaufpreis zahlen und', 36), text(640, 510, 'Ware abnehmen', 36),
           arrow(600, 550, 600, 600),
           box(60, 610, 1080, 150, TEAL_BG),
           text(600, 662, 'Erfüllungsgeschäft', 42, TEAL, 700, 'middle'),
           text(600, 720, 'Übergabe + Einigung über das Eigentum · Zahlung', 36, INK, 400, 'middle')]
    return 'Kaufvertrag aus Antrag und Annahme, danach Pflichten und Erfüllung', '\n'.join(out)


# ---- wirtschaft.kalkulation: purchase and sales calculation scheme ----
def kalkulation():
    buy = [('Listeneinkaufspreis', ''), ('− Lieferrabatt', ''), ('= Zieleinkaufspreis', ''), ('− Lieferskonto', ''),
           ('= Bareinkaufspreis', ''), ('+ Bezugskosten', ''), ('= Bezugspreis', 'b')]
    sell = [('Bezugspreis', ''), ('+ Handlungskosten', ''), ('= Selbstkosten', ''), ('+ Gewinn', ''),
            ('= Barverkaufspreis', ''), ('+ Kundenskonto', 'h'), ('= Zielverkaufspreis', ''), ('+ Kundenrabatt', 'h'),
            ('= Listenverkaufspreis', 'b')]
    out = [heading('Kalkulation im Handel'),
           text(300, 135, 'Einkauf (Bezug)', 38, TEAL, 700, 'middle'), text(900, 135, 'Verkauf (netto)', 38, TEAL, 700, 'middle')]

    def column(x, items, step):
        res = []
        for i, (label, kind) in enumerate(items):
            y = 160 + i * step
            if kind == 'b':
                res.append(box(x - 10, y + 2, 520, step - 6, TEAL_BG, TEAL, 10, 3))
            res.append(text(x + 10, y + step - 18, label, 36, INK, 700 if label.startswith('=') or i == 0 else 400))
            if kind == 'h':
                res.append(text(x + 490, y + step - 18, 'vom Hundert', 26, MUTED, 400, 'end'))
        return res
    out += column(50, buy, 64) + column(650, sell, 64)
    out += [arrow(560, 160 + 6 * 64 + 32, 640, 192),
            text(50, 760, 'Skonto und Rabatt im Verkauf vom Ziel- bzw. Listenpreis rechnen (im Hundert).', 28, MUTED)]
    # fix: Kundenskonto/Kundenrabatt are percentages of the higher price → computed "im Hundert"
    out = [o.replace('vom Hundert', 'im Hundert') for o in out]
    return 'Schema der Bezugskalkulation und der Verkaufskalkulation', '\n'.join(out)


# ---- programmierung.modellierung: class diagram with association, multiplicity, inheritance ----
def uml_klasse():
    def cls(x, y, name, attrs, ops, w=440):
        h1, line = 70, 46
        h2 = 20 + line * len(attrs)
        h3 = 20 + line * len(ops)
        res = [f'<rect x="{x}" y="{y}" width="{w}" height="{h1 + h2 + h3}" fill="#ffffff" stroke="{INK}" stroke-width="4"/>',
               f'<line x1="{x}" y1="{y + h1}" x2="{x + w}" y2="{y + h1}" stroke="{INK}" stroke-width="3"/>',
               f'<line x1="{x}" y1="{y + h1 + h2}" x2="{x + w}" y2="{y + h1 + h2}" stroke="{INK}" stroke-width="3"/>',
               text(x + w / 2, y + 48, name, 40, INK, 700, 'middle')]
        for i, a in enumerate(attrs):
            res.append(text(x + 20, y + h1 + 46 + i * line, a, 34))
        for i, o in enumerate(ops):
            res.append(text(x + 20, y + h1 + h2 + 46 + i * line, o, 34))
        return res, h1 + h2 + h3
    out = [heading('UML-Klassendiagramm')]
    k, kh = cls(60, 110, 'Kunde', ['- kundenNr: int', '- name: String'], ['+ bestellen(): void'])
    b, bh = cls(700, 110, 'Bestellung', ['- bestellNr: int', '- datum: Date'], ['+ summe(): double'])
    g, gh = cls(60, 520, 'Geschäftskunde', ['- ustIdNr: String'], [], 440)
    out += k + b + g
    y = 110 + 70 + 20
    out += [f'<line x1="500" y1="{y + 60}" x2="700" y2="{y + 60}" stroke="{INK}" stroke-width="4"/>',
            text(515, y + 45, '1', 36, INK, 700), text(690, y + 45, '0..*', 36, INK, 700, 'end'),
            text(600, y + 110, 'gibt auf', 32, MUTED, 400, 'middle'),
            # inheritance: hollow triangle at the superclass
            f'<line x1="280" y1="520" x2="280" y2="{110 + kh + 40}" stroke="{INK}" stroke-width="4"/>',
            f'<polygon points="280,{110 + kh} 250,{110 + kh + 44} 310,{110 + kh + 44}" fill="#ffffff" stroke="{INK}" stroke-width="4"/>',
            text(300, 480, 'Vererbung', 32, MUTED),
            text(580, 560, 'Sichtbarkeit: − privat, + öffentlich,', 32, INK),
            text(580, 604, '# geschützt', 32, INK),
            text(580, 664, 'Multiplizität: 1, 0..1, 0..*, 1..*', 32, INK),
            text(580, 724, 'Leeres Dreieck zeigt zur Oberklasse', 32, INK)]
    return 'Klassendiagramm mit Assoziation, Multiplizitäten und Vererbung', '\n'.join(out)


SKETCHES = {
    'skizze-einheiten': einheiten,
    'skizze-risikomatrix': risikomatrix,
    'skizze-testebenen': testebenen,
    'skizze-kaufvertrag': kaufvertrag,
    'skizze-kalkulation': kalkulation,
    'skizze-uml-klasse': uml_klasse,
}

if __name__ == '__main__':
    for name, draw in SKETCHES.items():
        title, body = draw()
        (OUT / f'{name}.svg').write_text(svg(title, body), encoding='utf-8')
        print(name)
