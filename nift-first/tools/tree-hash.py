"""Deterministic file inventory digest for a static publication (includes hidden files)."""
import hashlib,pathlib,json,sys
root=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else 'public')
rows=[];total=0
for p in sorted(root.rglob('*')):
 if p.is_file():
  data=p.read_bytes();total+=len(data);rows.append(str(p.relative_to(root))+'\0'+hashlib.sha256(data).hexdigest())
print(json.dumps({'files':len(rows),'bytes':total,'inventorySha256':hashlib.sha256('\n'.join(rows).encode()).hexdigest()},indent=2))
