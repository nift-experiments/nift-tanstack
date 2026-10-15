"""One matched exploratory observation per model/scenario, serialized. No medians."""
from pathlib import Path
import subprocess,json,hashlib,datetime
root=Path.cwd();observations=root/'evaluation/observations-phase2';observations.mkdir(parents=True,exist_ok=True)
def call(command,log='/tmp/pulse2-campaign-prepare.log'):
 with open(log,'a') as output:subprocess.run(command,stdout=output,stderr=subprocess.STDOUT,check=True)
def measure(model,scenario,flags=[]):
 name=f'{scale}-{model}-{scenario}'
 subprocess.run(['python3','tools/observe.py',name,'bun','tools/build.ts',model,*flags],check=True)
 record=json.loads((observations/(name+'.json')).read_text());text=(observations/(name+'.log')).read_text();record['pipeline']=json.loads(text.strip().splitlines()[-1]);(observations/(name+'.json')).write_text(json.dumps(record,indent=2)+'\n')
 print(f"RESULT {name}: {record['wallSeconds']:.3f}s / {record['sampledTreePeakMiB']:.1f} MiB tree / {record['maximumIndividualProcessKiB_time']/1024:.1f} MiB max process",flush=True)
models=['hybrid','control']
for scale in [62,500,1500,3000]:
 call(['bun','tools/generate.ts',str(scale)])
 order=models if scale in [62,1500] else list(reversed(models))
 for model in order:
  measure(model,'fresh',['--fresh']);measure(model,'warm-full',['--all']);measure(model,'unchanged')
 file=root/'corpus/original/start/workspace-setup.md';saved=file.read_text()
 try:
  file.write_text(saved+'\nRecord the workspace approval in the change ticket.\n')
  for model in order:measure(model,'docs-edit')
 finally:
  file.write_text(saved)
  for model in models:call(['bun','tools/build.ts',model])
# Production-scale dependency families: shared shell, MDX UI, navigation and style, app-only UI.
for scenario,filename,old,new in [
 ('shared-layout','app/src/routes/__root.tsx','PulseOps · Developer operations','PulseOps · Operations workspace'),
 ('mdx-component','shared/DocComponents.tsx','"Note"','"Operator note"'),
 ('navigation','shared/site.json','"Overview"','"Workspace overview"'),
 ('styling','shared/site.css','--accent:#b7f36b','--accent:#b8f36b'),
 ('app-component','shared/Portal.tsx','Operate with context.','Operate with clear context.')]:
 file=root/filename;saved=file.read_text()
 if old not in saved:raise RuntimeError('Scenario source literal missing: '+scenario)
 edited=saved.replace(old,new)
 try:
  file.write_text(edited)
  for model in models:measure(model,scenario)
 finally:
  file.write_text(saved)
  for model in models:call(['bun','tools/build.ts',model])
# Additional established Start prerender, not the optimized control headline.
for scale in [62,3000]:
 call(['bun','tools/generate.ts',str(scale)])
 measure('control','native-fresh',['--fresh','--native'])
# Leave the matched3,000-page publication ready for inspection.
scale=3000
for model in models:call(['bun','tools/build.ts',model])
results=[json.loads(p.read_text()) for p in sorted(observations.glob('*.json'))]
(root/'evaluation/results-phase2.json').write_text(json.dumps(results,indent=2)+'\n')
print('Campaign complete; sources restored; selected scale3000.',flush=True)
