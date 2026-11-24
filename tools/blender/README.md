# 3D-Bilder für die Lernzettel (Blender)

Die Abbildungen in `img/notes/` werden mit Blender (ab 5.x) aus diesen Skripten erzeugt – eigene Modelle, keine Herstellerlogos.

- `lib.py`: Szene leeren, Materialien, Grundkörper, Beschriftungen, Kamera, Licht, Rendern (1200 × 800, WebP, heller Hintergrund `#eef1f4`)
- `<name>.py`: eine Szene je Bild; der Dateiname ist der Bildname (`img/notes/<name>.webp`)

Ausführen (Blender-Python-Konsole oder Blender-MCP-Add-on):

```python
exec(open('tools/blender/lib.py').read()); exec(open('tools/blender/serverschrank.py').read()); render('img/notes/serverschrank.webp')
```

Danach Größe prüfen (höchstens 150 KB, `data.test.js`) und das Bild im Lernzettel einbinden: `![Bildbeschreibung](name "Bildunterschrift")`.
