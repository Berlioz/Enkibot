import {nodeviewer} from './nodeviewer.js'
import {tags} from './tags.js'
import {navigation} from './expandable/navigation.js'
import './expandable/guides.js'
import './expandable/mapview.js'

export async function load(target){
  let yaml=await fetch(target)
  yaml=await yaml.text()
  return jsyaml.safeLoad(yaml)
}
async function setup(){
  await navigation.load()
  await tags.load()
  await nodeviewer.go('begin')
}
setup()
