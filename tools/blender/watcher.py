# PrüfFit render watcher: runs every job file dropped into blender/jobs/ (one per tick).
import bpy, os, traceback
_D = '/Users/testfg/Desktop/PrüfFit/blender/'
os.makedirs(_D + 'jobs', exist_ok=True)

def _prueffit_tick():
    try:
        jobs = sorted(f for f in os.listdir(_D + 'jobs') if f.endswith('.job'))
        if jobs:
            j = jobs[0]
            name = open(_D + 'jobs/' + j, encoding='utf-8').read().strip()
            os.rename(_D + 'jobs/' + j, _D + 'jobs/' + j + '.taken')
            try:
                exec(open(_D + name + '.py', encoding='utf-8').read(), {'__name__': 'prueffit_job'})
            except Exception:
                open(_D + 'out/' + name + '.err', 'w').write(traceback.format_exc())
            open(_D + 'jobs/' + j + '.done', 'w').write('ok')
    except Exception:
        pass
    return 3.0

if not bpy.app.timers.is_registered(globals().get('_prueffit_tick_old', _prueffit_tick)):
    bpy.app.timers.register(_prueffit_tick, persistent=True)
print('PrüfFit-Watcher aktiv')
