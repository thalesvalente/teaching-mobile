#!/usr/bin/env python3
"""One-shot, anchored migration of the audited A08 candidate. No Google calls."""
from pathlib import Path
import json, re, shutil, subprocess
ROOT=Path.cwd()
L='lessons/aula-08-av1-incremento-1/'
G='lessons/aula-07-estado-filtros/appscript/'
BASE='fe9cd3dd9f07c0fdc144467df63aa1a4f7c1731c'
T=ROOT/'.a08-remediation'
changes={}
def read(p): return changes[p] if p in changes else (ROOT/p).read_text(encoding='utf-8')
def put(p,s): changes[p]=s
def sub(p,a,b):
 s=read(p)
 if s.count(a)!=1: raise RuntimeError(f'{p}: expected one anchor, got {s.count(a)}: {a[:100]}')
 put(p,s.replace(a,b))
def between(p,a,b,new):
 s=read(p); i=s.index(a); j=s.index(b,i+len(a));put(p,s[:i]+new+s[j:])
if subprocess.check_output(['git','config','--get','remote.origin.url'],text=True).strip().rstrip('/') not in ['https://github.com/thalesvalente/teaching-mobile','https://github.com/thalesvalente/teaching-mobile.git']:
 raise RuntimeError('Canonical repository mismatch')
for p in [L,G,'tests','.github/workflows/qa-aula08.yml']:
 diff=subprocess.check_output(['git','diff',BASE,'HEAD','--',p],text=True)
 if diff: raise RuntimeError('Inputs changed after audited baseline: '+p)
for phase in ['part1.py','part2.py','part3.py']:
 exec(compile((T/phase).read_text(encoding='utf-8'),str(T/phase),'exec'),globals())
