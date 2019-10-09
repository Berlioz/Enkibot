#!/usr/bin/python3
#not, unlike the ruby generator, 'debug' simply shows debug data, use 'all' to print everything
#TODO since the branching-nodes architecture isn't being used in practice, could instead add a Relevant and/or Irrelevant field, which, if present, will check for the tags and skip the node if not relevant

import yaml,sys,os

DATA='data'
JOBS=set(a.lower() for a in sys.argv[1:])
DEBUG='debug' in JOBS
OPERATORS=set(['UNION','INTERSECTION','NOT'])
CLEAR={'nt':'cls','posix':'clear',}

tags=set(['Generic'])
alltags=set(tags)|set(['debug','all'])
unrecognized=set()
txt=open('hints.txt','w')

if len(JOBS)==0:
  print(f'Usage: {sys.argv[0]} [all] [job1 job2 ...] [debug]')
  sys.exit(-1)

def output(line=''):
  print(line)
  print(line,file=txt)
def read(node=False,path=False):
  if not path:
    path=f'{DATA}/nodes/{node}.yaml'
  with open(path,'r') as f:
    try:
      return yaml.load(f.read(),Loader=yaml.FullLoader)
    except Exception as e:
      print(f'Error loading "{path}"...')
      print(e)
      return False
def process(tag):
  if tag in tags or 'all' in JOBS:
    return True
  parameters=tag.split(' ')[1:]
  if 'UNION' in tag:
    for p in parameters:
      if p in tags:
        return True
    return False
  if 'INTERSECTION' in tag:
    for p in parameters:
      if not p in tags:
        return False
    return True
  if 'NOT' in tag:
    for p in parameters:
      if p in tags:
        return False
    return True
  if not tag in alltags:
    global unrecognized
    unrecognized|=set([tag])
  return False
def travel(node='begin'):
  if node=='end':
    return
  node=read(node)
  if not node:
    return
  title=list(node.keys())[0]
  node=node[title]
  if not DEBUG and os.name in CLEAR:
    os.system(CLEAR[os.name])
  output(title)
  output("="*len(title))
  output()
  global unrecognized
  for tag in node:
    if tag=='Metadata':
      continue
    if process(tag.replace('`','')): #allows multiple sections with same tag, for organizing?
      suffix=f'[{tag}]' if DEBUG else ''
      for hint in node[tag]:
        output(f'{hint if hint[0]=="-" else "- "+hint} {suffix}')
  if DEBUG:
    output('')
  else:
    input('')
  travel(node['Metadata']['next-node'])
def loadtags():
  data=read(path=f'{DATA}/jobs.yaml')
  global tags,alltags
  for j in data['Jobs']:
    jobtags=set( [j]+data['Jobs'][j])
    alltags|=jobtags
    if 'all' in JOBS or j.lower() in JOBS:
      tags|=jobtags
  lowertags=[t.lower() for t in alltags]
  for j in JOBS:
    if j not in lowertags:
      print(f'Unknown tag: {j}')
      sys.exit(-1)
def show(unrecognized):
  if len(unrecognized)>0:
    listing=' '.join(f'"{u}"' for u in sorted(unrecognized))
    print(f'Unrecognized: {listing}.')

loadtags()
travel()
show(unrecognized)
