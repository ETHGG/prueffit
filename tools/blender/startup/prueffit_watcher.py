# Startet den PrüfFit-Render-Watcher bei jedem Blender-Start
# (Ordner blender-scripts ist in den Einstellungen als Script Directory eingetragen).
import bpy

import os
_W = os.path.expanduser('~/Desktop/PrüfFit/blender/watcher.py')


def _start():
    try:
        exec(open(_W, encoding='utf-8').read(), {'__name__': 'prueffit_watcher'})
    except Exception as e:
        print('PrüfFit-Watcher nicht gestartet:', e)
    try:
        import addon_utils
        for mod in addon_utils.modules():
            if 'mcp' in mod.__name__.lower():
                addon_utils.enable(mod.__name__, default_set=True)
    except Exception as e:
        print('MCP-Add-on nicht aktiviert:', e)
    return None


def register():
    bpy.app.timers.register(_start, first_interval=2.0)


def unregister():
    pass
