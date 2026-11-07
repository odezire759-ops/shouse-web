import sys, os, re, shutil
here = os.path.dirname(os.path.abspath(__file__))
tpl = open(os.path.join(here,'engine.tpl.html'),encoding='utf-8').read()
tpl = tpl.replace('//==REAL==', open(os.path.join(here,'real.js'),encoding='utf-8').read())   # Realistic-mode module (opt-in, lazy-loads fx.js)
out_root = sys.argv[1]
for key in sys.argv[2:]:
    src = open(os.path.join(here,'rooms',key+'.js'),encoding='utf-8').read()
    m = re.search(r'//==CFG==\n(.*?)//==BUILD==\n(.*)$', src, re.S)
    cfg, build = m.group(1), m.group(2)
    html = tpl.replace('//==CFG==', cfg).replace('//==BUILD==', build)
    d = os.path.join(out_root, key); os.makedirs(d, exist_ok=True)
    open(os.path.join(d,'index.html'),'w',encoding='utf-8').write(html)
    print(key, len(html.encode('utf-8')), 'bytes')
# on-demand post-processing bundle for Realistic mode: one shared file next to the room folders (room-3d/fx.js)
shutil.copyfile(os.path.join(here,'vendor','three-r128-fx.js'), os.path.join(out_root,'fx.js'))
print('fx.js', os.path.getsize(os.path.join(out_root,'fx.js')), 'bytes')
