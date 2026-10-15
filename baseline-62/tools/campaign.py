"""One serialized exploratory observation per workload/model. No statistical claims."""
import subprocess,pathlib,json,shutil
r=pathlib.Path.cwd()
def run(args):subprocess.run(args,check=True)
def observe(model,scenario,args):run(['python3','tools/observe.py',model+'-'+scenario,*args])
def clean(model):
 for name in (['dist','.generated','.nift/public','.nift/identity-stage1','public/docs','public/index.html','public/site.css','public/preferences.js'] if model=='hybrid' else ['control/dist','control/.tanstack']):
  p=r/name
  if p.is_dir():shutil.rmtree(p)
  elif p.exists():p.unlink()
models=[('hybrid',['bun','run','build'],['bun','run','build:full']),('control',['bun','run','build:control'],['bun','run','build:control'])]
for model,normal,full in models:
 clean(model);observe(model,'fresh',normal);observe(model,'warm-full',full);observe(model,'unchanged',normal)
for scenario,file,replace in [
 ('docs-edit','docs/start/workspace-setup.md',lambda s:s+'\nRecord the approved workspace slug in the onboarding ticket.\n'),
 ('shared-layout','shared/site.json',lambda s:s.replace('"Overview"','"Workspace overview"')),
 ('component-edit','shared/Portal.tsx',lambda s:s.replace('Operate with context.','Operate with clear context.'))]:
 p=r/file;original=p.read_text()
 try:
  p.write_text(replace(original))
  for model,normal,_ in models:observe(model,scenario,normal)
 finally:
  p.write_text(original)
  for _,normal,_ in models:
   with open('/tmp/pulse-campaign-restore.log','a') as log:subprocess.run(normal,stdout=log,stderr=subprocess.STDOUT,check=True)
observe('control','ssr-only',['bun','run','build:control:ssr'])
# Restore the comparable complete publication after measuring the smaller SSR workload.
with open('/tmp/pulse-campaign-restore.log','a') as log:subprocess.run(['bun','run','build:control'],stdout=log,stderr=subprocess.STDOUT,check=True)
results=[json.loads(p.read_text()) for p in sorted((r/'evaluation/observations').glob('*.json'))]
(r/'evaluation/benchmark-results.json').write_text(json.dumps(results,indent=2)+'\n')
