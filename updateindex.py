#!/usr/bin/python3
# updates data/nodes.yaml
# DEPENDENCIES: pip3 install pyyaml
import yaml,glob,os,sys

NODES={
  'Manifest':[],
  'Titles':{}, # titles (root YAML dictionary keys) by filename
}
DANGLING=[]
LINKED_NODES=set(['airship_w3', 'bahamut','fork_tower','gogo','island_shrine','istory_falls','leviathan','mirage','odin','omniscient','phoenix_tower','sea_trench','sealed_castle','stooges','wendigo'])#not dangling, just inline links

def register(node):
  with open(f'data/nodes/{node}.yaml') as f:
    data=yaml.load(f,Loader=yaml.FullLoader)
    title=list(data.keys())[0]
    NODES['Manifest']+=[node]
    NODES['Titles'][node]=title
    return data,title

def travel(node):
  try:
    data,title=register(node)
    nextnode=data[title]['Metadata']['next-node']
    if nextnode!='end':
      travel(nextnode)
  except Exception as e:
    print(f'Exception while processing {node}: {e}')
    sys.exit(1)
  
travel('begin')
for f in glob.glob('data/nodes/*.yaml'):
  node=os.path.basename(f)
  node=node[:node.index('.')]
  if not node in NODES['Manifest']:
    register(node)
    if not node in LINKED_NODES:
      DANGLING+=[node]
if len(DANGLING)>0:
  print(f'Dangling nodes found: {sorted(DANGLING)}.')
with open('data/nodes.yaml','w') as f:
  f.write(yaml.dump(NODES))  
print('Done.')
