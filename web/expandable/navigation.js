//TODO might have a cache at some point?
import {load} from '../enkibot.js'
import {nodeviewer} from '../nodeviewer.js'
import {Expandable} from './expandable.js'

const element=document.querySelector('#navigation')
const links=element.querySelector('.links')
const button=element.querySelector('button')

export var root='begin'

class Navigation extends Expandable{
  constructor(){
    super(links,button)
    this.titles={} //titles (root YAML dictionary keys) by filename
  }
  
  async load(){
    this.nodes=await load('data/nodes.yaml')
    this.titles=this.nodes['Titles']
    this.nodes=this.nodes['Manifest']
    this.nodes.sort((a,b)=>this.titles[a].localeCompare(this.titles[b]))
    this.nodes.splice(this.nodes.indexOf(root),1)
    this.nodes.splice(0,0,root)
    nodeviewer.addnavigation(false,this.nodes,links)
  }
}

export var navigation=new Navigation()
