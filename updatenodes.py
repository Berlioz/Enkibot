#!/usr/bin/python3
# updates data/nodes.yaml
# DEPENDENCIES: pip3 install pyyaml
# TODO would be good as a last step to check the actual files against the index and warn about any dangling nodes
import yaml

NODES={
  'Manifest':[],
  'Titles':{}, # titles (root YAML dictionary keys) by filename
}

def travel(node):
  nextnode=False
  with open(f'data/nodes/{node}.yaml') as f:
    data=yaml.load(f,Loader=yaml.FullLoader)
    title=list(data.keys())[0]
    NODES['Manifest']+=[node]
    NODES['Titles'][node]=title
    nextnode=data[title]['Metadata']['next-node']
  if nextnode!='end':
    travel(nextnode)
  
travel('begin')
with open('data/nodes.yaml','w') as f:
  f.write(yaml.dump(NODES))  
