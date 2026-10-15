import json,re,pathlib,hashlib,urllib.parse
from html.parser import HTMLParser
root=pathlib.Path.cwd(); docs=json.loads((root/'../corpus/active.json').read_text()); failures=[]
class Semantics(HTMLParser):
 def __init__(self):
  super().__init__();self.heading=None;self.headings=[];self.cells=[];self.cell=None;self.code=None;self.codes=[];self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if re.fullmatch('h[1-6]',tag):self.heading=[tag,a.get('id'),'']
  if tag in ('td','th'):self.cell=''
  if tag=='code' and 'language-' in a.get('class',''):self.code=''
  if tag in ('a','img','script','link'):
   v=a.get('href') or a.get('src')
   if v:self.links.append(v)
 def handle_endtag(self,tag):
  if re.fullmatch('h[1-6]',tag) and self.heading:self.heading[2]=' '.join(self.heading[2].split());self.headings.append(self.heading);self.heading=None
  if tag in ('td','th') and self.cell is not None:self.cells.append(' '.join(self.cell.split()));self.cell=None
  if tag=='code' and self.code is not None:self.codes.append(self.code);self.code=None
 def handle_data(self,text):
  if self.heading is not None:self.heading[2]+=text
  if self.cell is not None:self.cell+=text
  if self.code is not None:self.code+=text
islands=0
for d in docs:
 new=(root/'public/docs'/d['slug']/'index.html').read_text();old=(root/'../control/dist/client/docs'/d['slug']/'index.html').read_text()
 a,b=Semantics(),Semantics();a.feed(new);b.feed(old)
 for label,x,y in [('headings',a.headings,b.headings),('table cells',a.cells,b.cells),('highlighted code',a.codes,b.codes)]:
  if x!=y:failures.append({'slug':d['slug'],'surface':label,'new':x[:2],'control':y[:2]})
 islands+=new.count('data-island=')
 assert ('assets/docs.js' in new)==(d['format']=='mdx'),d['slug']
 assert '<title>@title' not in new
for p in (root/'public').rglob('*.html'):
 s=Semantics();s.feed(p.read_text())
 for link in s.links:
  u=urllib.parse.urlparse(urllib.parse.urljoin('http://local/'+str(p.relative_to(root/'public')),link))
  if u.netloc!='local':continue
  target=root/'public'/u.path.lstrip('/')
  if not target.is_file() and not (target/'index.html').is_file():failures.append({'page':str(p.relative_to(root)),'missing':link})
searchEqual=hashlib.sha256((root/'public/search-index.json').read_bytes()).digest()==hashlib.sha256((root/'../control/dist/client/search-index.json').read_bytes()).digest()
assert searchEqual
report={'documents':len(docs),'mdx':sum(d['format']=='mdx' for d in docs),'islandMounts':islands,'pages':len(list((root/'public').rglob('*.html'))),'searchBytesEqualToControl':searchEqual,'compared':['all heading levels/text/anchors','all table cell text','all syntax-highlighted code text','all local href/src targets'],'failures':failures}
print(json.dumps(report,indent=2));assert not failures
