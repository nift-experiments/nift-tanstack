"""Linux exploratory build observer: time(1) max process RSS plus sampled descendant sum.
No sum of per-process maxima. 2ms target sampling; observer excluded. Linux RSS double
counts shared mappings; short peaks may be missed. Serialized campaign only.
"""
import subprocess,time,json,sys,pathlib,os
name=sys.argv[1];cmd=sys.argv[2:];out=pathlib.Path('evaluation/observations');out.mkdir(parents=True,exist_ok=True)
start=time.monotonic();intervals=[];last=start;peak=0;dominant=None;peakindividual=0
with (out/(name+'.log')).open('w') as log:
 p=subprocess.Popen(['/usr/bin/time','-v','-o',str(out/(name+'.time')),*cmd],stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
 while p.poll() is None:
  now=time.monotonic();intervals.append(now-last);last=now
  # Traverse kernel child lists for every thread; avoid a whole-system /proc scan.
  # A child can be spawned by a nonleader runtime thread, hence all task lists.
  current=[];pending=[p.pid];seen=set()
  while pending:
   pid=pending.pop()
   if pid in seen:continue
   seen.add(pid);d=pathlib.Path('/proc')/str(pid)
   try:
    stat=(d/'stat').read_text();tail=stat[stat.rfind(')')+2:].split();rss=int(tail[21])*os.sysconf('SC_PAGE_SIZE');comm=stat[stat.find('(')+1:stat.rfind(')')];current.append((pid,rss,comm))
    for task in (d/'task').iterdir():
     try:pending.extend(map(int,(task/'children').read_text().split()))
     except OSError:pass
   except (OSError,ValueError,IndexError):pass
  total=sum(x[1] for x in current)
  if current:peakindividual=max(peakindividual,max(x[1] for x in current))
  if total>peak:peak=total;dominant=max(current,key=lambda x:x[1]) if current else None
  time.sleep(.002)
 elapsed=time.monotonic()-start
usage=(out/(name+'.time')).read_text();maxrss=next((int(l.split(':')[-1]) for l in usage.splitlines() if 'Maximum resident set size' in l),None)
result={'scenario':name,'command':cmd,'exitCode':p.returncode,'wallSeconds':elapsed,'maximumIndividualProcessKiB_time':maxrss,'sampledTreePeakMiB':peak/1048576,'dominantAtTreePeak':dominant,'sampledIndividualPeakMiB':peakindividual/1048576,'sampleCount':len(intervals),'targetIntervalMs':2,'samplingMethod':'all-thread-kernel-descendants-v2','maximumObservedIntervalMs':max(intervals,default=0)*1000}
(out/(name+'.json')).write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result),flush=True)
raise SystemExit(p.returncode)
