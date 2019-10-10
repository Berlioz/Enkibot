import {nodeviewer} from './nodeviewer.js'
import {tags} from './tags.js'
import {nodes} from './nodes.js'

export async function load(target){
  let yaml=await fetch(target)
  yaml=await yaml.text()
  return jsyaml.safeLoad(yaml)
}
async function setup(){
  await nodes.load()
  await tags.load()
  await nodeviewer.go('begin')
}
setup()
