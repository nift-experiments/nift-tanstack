"""One serialized observation per requested case, same observer as Phase 2."""
import subprocess,sys,pathlib,json,os
root=pathlib.Path.cwd();env=dict(os.environ,PATH=str(pathlib.Path.home()/'.bun/bin')+':/usr/local/bin:/usr/bin:/bin')
def build():subprocess.run(['bun','tools/build.ts'],env=env,check=True,stdout=subprocess.DEVNULL)
def observe(name,*args):
 subprocess.run([sys.executable,'tools/observe.py','3000-nift-first-'+name,'bun','tools/build.ts',*args],env=env,check=True)
 path=root/'../evaluation/nift-first/observations'/('3000-nift-first-'+name+'.json');r=json.loads(path.read_text());print(f"{name}: {r['wallSeconds']:.3f}s / {r['maximumIndividualProcessKiB_time']/1024:.1f} MiB individual / {r['sampledTreePeakMiB']:.1f} MiB tree",flush=True)
def edit(name,path,old,new):
 p=pathlib.Path(path);data=p.read_bytes()
 try:
  text=data.decode();assert old in text;p.write_text(text.replace(old,new,1));observe(name)
 finally:p.write_bytes(data);build()
observe('fresh','--fresh');observe('warm-full','--all');observe('unchanged')
edit('docs-edit','../corpus/original/start/workspace-setup.md','## Verification','Production publication edit probe.\n\n## Verification')
edit('mdx-edit','../corpus/authored/reliability-advanced/capacity-drills.mdx','## Review the result','Additional maintenance observation.\n\n## Review the result')
edit('shared-layout','templates/header.html','LOCAL WORKSPACE','LOCAL DEMO WORKSPACE')
# Keep reference maintained CSS untouched: a configuration-local template CSS style change.
edit('shared-style','templates/page.html','</head>','<style>main { scroll-margin-top: 5rem; }</style></head>')
edit('frontend-island','frontend/doc-islands.tsx','requests/hour','requests per hour')

# Independent static stylesheet edit: bytes republish without app/MDX rebuild.
edit('shared-css','../shared/site.css',':root{font:',':root{scroll-padding-top:5rem;font:')
