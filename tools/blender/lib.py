import bpy, math, os
from mathutils import Vector

BG = (0.933, 0.945, 0.957)  # #eef1f4, matches the figure background in the app


def reset():
    sc = bpy.context.scene
    # Clear the scene in place (reloading the file would reset the UI the script runs from).
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.cameras, bpy.data.lights, bpy.data.curves, bpy.data.worlds):
        for d in list(coll):
            if d.users == 0:
                coll.remove(d)
    engines = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items]
    sc.render.engine = 'BLENDER_EEVEE_NEXT' if 'BLENDER_EEVEE_NEXT' in engines else 'BLENDER_EEVEE'
    sc.render.resolution_x, sc.render.resolution_y = 2400, 1600
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    sc.view_settings.view_transform = 'Standard'
    world = bpy.data.worlds.new('W')
    world.use_nodes = True
    bgn = world.node_tree.nodes['Background']
    bgn.inputs[0].default_value = (*BG, 1)
    bgn.inputs[1].default_value = 1.0
    sc.world = world
    try:
        sc.eevee.taa_render_samples = 32
    except Exception:
        pass
    return sc


def mat(name, rgb, metal=0.0, rough=0.5, emit=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*rgb, 1)
    p.inputs['Metallic'].default_value = metal
    p.inputs['Roughness'].default_value = rough
    if emit:
        key = 'Emission Color' if 'Emission Color' in p.inputs else 'Emission'
        p.inputs[key].default_value = (*rgb, 1)
        p.inputs['Emission Strength'].default_value = emit
    return m


import bmesh


def _link(o):
    bpy.context.scene.collection.objects.link(o)
    return o


def _mesh_obj(name, bm, material, smooth=False):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    me.materials.append(material)
    return _link(bpy.data.objects.new(name, me))


def box(name, size, loc, material, bevel=0.0):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= size[0]; v.co.y *= size[1]; v.co.z *= size[2]
    o = _mesh_obj(name, bm, material)
    o.location = loc
    if bevel:
        mod = o.modifiers.new('bevel', 'BEVEL')
        mod.width = bevel
        mod.segments = 2
    return o


def cyl(name, r, depth, loc, material, rot=(0, 0, 0), verts=48):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=verts, radius1=r, radius2=r, depth=depth)
    o = _mesh_obj(name, bm, material, smooth=True)
    o.location = loc
    o.rotation_euler = rot
    return o


def label(text, loc, size=0.06, material=None, rot=(math.radians(90), 0, 0), align='LEFT'):
    cu = bpy.data.curves.new('label', 'FONT')
    cu.body = text
    cu.size = size
    cu.align_x = align
    cu.materials.append(material or mat('label', (0.02, 0.03, 0.035), rough=1.0))
    o = _link(bpy.data.objects.new('label', cu))
    o.location = loc
    o.rotation_euler = rot
    return o


def leader(a, b, material=None, r=0.004):
    a, b = Vector(a), Vector(b)
    d = b - a
    o = cyl('leader', r, d.length, (a + b) / 2, material or mat('leader', (0.15, 0.2, 0.22), rough=0.9), verts=12)
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = d.to_track_quat('Z', 'Y')
    return o


def camera(loc, target, lens=50, ortho=None):
    cd = bpy.data.cameras.new('Cam')
    cam = _link(bpy.data.objects.new('Cam', cd))
    cam.location = loc
    d = Vector(target) - Vector(loc)
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    cd.lens = lens
    if ortho:
        cd.type = 'ORTHO'
        cd.ortho_scale = ortho
    bpy.context.scene.camera = cam
    return cam


def lights(strength=1.0):
    strength *= 0.25
    for i, (loc, energy, size) in enumerate([((3, -4, 5), 900, 4), ((-4, -2, 3), 350, 5), ((0, 4, 4), 250, 5)]):
        ld = bpy.data.lights.new(f'L{i}', 'AREA')
        ld.energy = energy * strength
        ld.size = size
        l = _link(bpy.data.objects.new(f'L{i}', ld))
        l.location = loc
        d = Vector((0, 0, 0)) - Vector(loc)
        l.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


def camera_front(center, width, tilt=18, dist=6.0):
    # orthographic camera in front (-y), tilted down by `tilt` degrees, `width` = visible width
    cx, cy, cz = center
    t = math.radians(tilt)
    loc = (cx, cy - dist * math.cos(t), cz + dist * math.sin(t))
    return camera(loc, center, ortho=width)


def arrow(a, b, material, r=0.012, head=0.06):
    a, b = Vector(a), Vector(b)
    d = b - a
    shaft_end = b - d.normalized() * head
    leader(a, shaft_end, material, r=r)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=24, radius1=r * 2.6, radius2=0, depth=head)
    o = _mesh_obj('head', bm, material)
    o.location = shaft_end + d.normalized() * head / 2
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = d.to_track_quat('Z', 'Y')
    return o


def render(path):
    sc = bpy.context.scene
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fmt = 'WEBP' if 'WEBP' in [e.identifier for e in bpy.types.ImageFormatSettings.bl_rna.properties['file_format'].enum_items] else 'PNG'
    sc.render.image_settings.file_format = fmt
    sc.render.image_settings.color_mode = 'RGB'
    if fmt == 'WEBP':
        sc.render.image_settings.quality = 78
    out = os.path.splitext(path)[0] + ('.webp' if fmt == 'WEBP' else '.png')
    sc.render.filepath = out
    bpy.ops.render.render(write_still=True)
    return {'file': out, 'bytes': os.path.getsize(out), 'format': fmt}
