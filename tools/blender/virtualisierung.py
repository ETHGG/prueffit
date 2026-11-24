sc = reset()
lm = mat('label', (0.02, 0.03, 0.035), rough=1.0)
c_hw = mat('hw', (0.35, 0.38, 0.43), rough=0.6)
c_os = mat('hostos', (0.25, 0.5, 0.85), rough=0.6)
c_hv = mat('hv', (0.95, 0.55, 0.12), rough=0.5)
c_vm = mat('vm', (0.3, 0.68, 0.38), rough=0.6)
c_app = mat('app', (0.55, 0.6, 0.66), rough=0.6)
c_ct = mat('ct', (0.55, 0.4, 0.8), rough=0.6)
W, H = 1.1, 0.2


def slab(x, z, w, h, m, text, size=0.06):
    box('s', (w, 0.5, h), (x, 0, z), m, bevel=0.01)
    label(text, (x, -0.26, z - size * 0.35), size=size, material=lm, align='CENTER')


def stack(x, title, layers, guests, guest_m, guest_text):
    z = 0.0
    for m, t in layers:
        slab(x, z, W, H, m, t)
        z += H + 0.02
    gw = (W - 0.08) / 3
    for i in range(3):
        gx = x - W / 2 + gw / 2 + i * (gw + 0.04)
        gz = z
        for j, (m, t) in enumerate(guests):
            slab(gx, gz, gw, H, m, t if t else f'{guest_text} {i + 1}', size=0.044)
            gz += H + 0.02
    label(title, (x, -0.26, 1.18), size=0.075, material=lm, align='CENTER')


stack(-1.3, 'Typ 1 (Bare Metal)', [(c_hw, 'Hardware'), (c_hv, 'Hypervisor')],
      [(c_vm, 'Gast-OS'), (c_app, 'App')], c_vm, 'VM')
stack(0.0, 'Typ 2 (Hosted)', [(c_hw, 'Hardware'), (c_os, 'Host-Betriebssystem'), (c_hv, 'Hypervisor (Programm)')],
      [(c_vm, 'Gast-OS'), (c_app, 'App')], c_vm, 'VM')
stack(1.3, 'Container', [(c_hw, 'Hardware'), (c_os, 'Host-Betriebssystem'), (c_hv, 'Container-Engine')],
      [(c_ct, 'Bibliotheken'), (c_app, 'App')], c_ct, 'C')
label('Typ 1: z. B. ESXi, Hyper-V, Proxmox (Server)   ·   Typ 2: z. B. VirtualBox, VMware Workstation (Test, Schulung)', (0, -0.26, -0.3), size=0.05, material=lm, align='CENTER')
label('Container haben kein eigenes Gast-OS: sie teilen sich den Kernel des Hosts.', (0, -0.26, -0.4), size=0.05, material=lm, align='CENTER')
camera_front((0.0, 0, 0.45), 3.95, tilt=8)
lights(0.55)
