import {nodeviewer} from './nodeviewer.js'
import {tags} from './tags.js'
import {navigation} from './expandable/navigation.js'
import './expandable/guides.js'

export async function load(target){
  let yaml=await fetch(target)
  yaml=await yaml.text()
  return jsyaml.safeLoad(yaml)
}
async function setup(){
  await navigation.load()
  await tags.load()
  nodeviewer.navigate()
}
setup()
