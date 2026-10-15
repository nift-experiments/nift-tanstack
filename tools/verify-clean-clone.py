"""Compare reproducible publication contracts with a separately built clean clone.
SSR main content is compared; dynamic Router serialization timestamps are excluded
by comparing this explicit content surface rather than rewriting whole HTML.
"""
import json, pathlib, hashlib, sys
root=pathlib.Path.cwd(); other=pathlib.Path(sys.argv[1]).resolve()
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
docs=json.loads((root/'corpus/active.json').read_text())
assert docs==json.loads((other/'corpus/active.json').read_text())
for doc in docs: assert sha(root/doc['file'])==sha(other/doc['file']),doc['file']
import re
result={'documents':len(docs),'sourceBytesEqual':True,'models':{}}
for model in ['hybrid','control']:
 a=root/model/'dist'; b=other/model/'dist'
 for doc in docs:
  rel='content/'+doc['slug']+'.json'
  assert json.loads((a/rel).read_text())==json.loads((b/rel).read_text()),rel
 for rel in [pathlib.Path('client/index.html'),pathlib.Path('client/docs/index.html')]+[pathlib.Path('client/docs')/d['slug']/'index.html' for d in docs]:
  x=re.search(r'<main[^>]*>[\s\S]*?</main>',(a/rel).read_text())
  y=re.search(r'<main[^>]*>[\s\S]*?</main>',(b/rel).read_text())
  assert x and y and x[0]==y[0],str(rel)
 assets=sorted(p.relative_to(a) for p in (a/'client/assets').rglob('*') if p.is_file())
 assert assets==sorted(p.relative_to(b) for p in (b/'client/assets').rglob('*') if p.is_file())
 for rel in assets: assert sha(a/rel)==sha(b/rel),str(rel)
 assert sha(a/'client/search-index.json')==sha(b/'client/search-index.json')
 result['models'][model]={'payloadObjectsEqual':True,'staticMainPagesEqual':len(docs)+2,'assetFilesByteEqual':len(assets),'searchBytesEqual':True}
print(json.dumps(result,indent=2))
