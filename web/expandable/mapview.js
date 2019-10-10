import {Expandable} from './expandable.js'
import {nodeviewer} from '../nodeviewer.js'

const ELEMENT=document.querySelector('#map')
const MAP=ELEMENT.querySelector('img')

class MapView extends Expandable{
  constructor(){super(MAP,ELEMENT.querySelector('button'),false)}
  
  refresh(){
    let map=nodeviewer.metadata['map'];
    if(!map){
      ELEMENT.classList.add('hidden')
      return
    }
    ELEMENT.classList.remove('hidden')
    MAP.src=`maps/${map}`
  }
}

export var mapview=new MapView()
