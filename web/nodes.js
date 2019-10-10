//TODO might have a cache at some point?
import {load} from './enkibot.js'
import {nodeviewer} from './nodeviewer.js'

const map=document.querySelector('#map')
const links=map.querySelector('.links')
const button=map.querySelector('button')

class Nodes{
  async load(){
    this.nodes=await load('data/nodes.yaml')
    this.nodes=this.nodes['Manifest']
    this.nodes.sort()
    nodeviewer.addnavigation(false,this.nodes,links)
  }
  
  toggle(){
    if(links.classList.contains('hidden')){
      links.classList.remove('hidden')
      button.innerHTML='Hide'
    }else{
      links.classList.add('hidden')
      button.innerHTML='Show'
    }
  }
}

export var nodes=new Nodes();
button.addEventListener('click',()=>nodes.toggle())
