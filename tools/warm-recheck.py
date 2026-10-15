"""Focused warm-publication correction: valid compiled payloads can be reused by both models."""
from pathlib import Path
import subprocess,json
out=Path('evaluation/observations-phase2');old=Path('evaluation/warm-payload-force');old.mkdir(exist_ok=True)
def prepare(cmd):
 with open('/tmp/pulse2-warm-prepare.log','a') as log:subprocess.run(cmd,stdout=log,stderr=subprocess.STDOUT,check=True)
for scale in [62,500,1500,3000]:
 prepare(['bun','tools/generate.ts',str(scale)])
 for model in ['hybrid','control']:
  prepare(['bun','tools/build.ts',model])
  name=f'{scale}-{model}-warm-full'
  for suffix in ['.json','.time','.log']:
   p=out/(name+suffix)
   if p.exists():p.rename(old/p.name)
  subprocess.run(['python3','tools/observe.py',name,'bun','tools/build.ts',model,'--all'],check=True)
  p=out/(name+'.json');result=json.loads(p.read_text());result['pipeline']=json.loads((out/(name+'.log')).read_text().strip().splitlines()[-1]);p.write_text(json.dumps(result,indent=2)+'\n');print(f"WARM {name}: {result['wallSeconds']:.3f}s / {result['sampledTreePeakMiB']:.1f} MiB",flush=True)
Path('evaluation/results-phase2.json').write_text(json.dumps([json.loads(p.read_text()) for p in sorted(out.glob('*.json'))],indent=2)+'\n')
