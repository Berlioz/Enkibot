#!/usr/bin/python3
# updates data/nodes.yaml
# DEPENDENCIES: pip3 install pyyaml
import yaml,glob,os

NODES={
  'Manifest':[],
  'Titles':{}, # titles (root YAML dictionary keys) by filename
}
DANGLING=[]

def register(node):
  with open(f'data/nodes/{node}.yaml') as f:
    data=yaml.load(f,Loader=yaml.FullLoader)
    title=list(data.keys())[0]
    NODES['Manifest']+=[node]
    NODES['Titles'][node]=title
    return data,title

def travel(node):
  data,title=register(node)
  nextnode=data[title]['Metadata']['next-node']
  if nextnode!='end':
    travel(nextnode)
  
travel('begin')
for f in glob.glob('data/nodes/*.yaml'):
  node=os.path.basename(f)
  node=node[:node.index('.')]
  if not node in NODES['Manifest']:
    DANGLING+=[node]
    register(node)
if len(DANGLING)>0:
  print(f'Included dangling nodes: {", ".join(sorted(DANGLING))}.')
with open('data/nodes.yaml','w') as f:
  f.write(yaml.dump(NODES))  
