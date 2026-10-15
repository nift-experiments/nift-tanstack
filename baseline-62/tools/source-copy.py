"""Copy maintained experiment sources; optionally include evaluation records. No Git required."""
from pathlib import Path
import shutil,sys
root=Path.cwd();dest=Path(sys.argv[1]);dest.mkdir(parents=True,exist_ok=False)
skip={'node_modules','dist','.generated','.git','__pycache__'}
for p in root.rglob('*'):
 rel=p.relative_to(root)
 if not p.is_file() or any(x in skip for x in rel.parts):continue
 if rel.parts[0]=='public':continue
 if rel.parts[:2]==('content','docs'):continue
 if rel.parts[0]=='.nift' and str(rel)!='.nift/config.json':continue
 if rel.parts[0]=='evaluation' and '--with-evaluation' not in sys.argv:continue
 if p.name=='routeTree.gen.ts':continue
 q=dest/rel;q.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,q)
print(dest)
