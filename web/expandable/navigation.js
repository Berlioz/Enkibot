//TODO might have a cache at some point?
import {load} from '../enkibot.js'
import {nodeviewer} from '../nodeviewer.js'
import {Expandable} from './expandable.js'

const element=document.querySelector('#navigation')
const links=element.querySelector('.links')
const button=element.querySelector('button')

class Navigation extends Expandable{
  constructor(){
    super(links,button)
  }
  
  async load(){
    this.nodes=await load('data/nodes.yaml')
    this.nodes=this.nodes['Manifest']
    this.nodes.sort()
    nodeviewer.addnavigation(false,this.nodes,links)
  }
}

export var navigation=new Navigation()
