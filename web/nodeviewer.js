import {jobselector} from './jobselector.js'
import {load} from './enkibot.js'
import {tags} from './tags.js'
import {navigation} from './expandable/navigation.js'

const LINKOPTIONS={attributes:[{name:'target',value:'_blank'}]}

const element=document.querySelector('#nodeviewer')
const title=element.querySelector('.title')
const next=element.querySelector('#next')
const body=element.querySelector('.body')

class NodeViewer{
  constructor(){
    this.node=false
  }
  
  add(hint){
    let item=document.createElement('li')
    item.innerHTML=hint
    body.appendChild(item)
  }
  
  addnavigation(label,nodes,parent=next){
    let div=document.createElement('div')
    if(label) div.innerHTML=`${label}: `
    for(let n of nodes){
      let link=document.createElement('a')
      link.title=n
      link.innerHTML=link.title
      link.addEventListener('click',()=>this.go(n))
      link.href='#'
      div.appendChild(link)
      parent.appendChild(div)
    }
  }
  
  allow(tag){
    if(tag=='Metadata') return false
    if(tags.has(tag)||tags.has('All')) return true
    if(tag=='Generic') return true
    let parameters=tag.split(' ').splice(1)
    if(tag.indexOf('UNION')>=0){
      for(let p of parameters) if(tags.has(p)) return true
      return false
    }
    if(tag.indexOf('INTERSECTION')>=0){
      for(let p of parameters) if(!tags.has(p)) return false
      return true
    }
    if(tag.indexOf('NOT')>=0){
      for(let p of parameters) if(tags.has(p)) return false
      return true
    }
    //TODO can use here to catch unknown tags
    return false
  }
  
  refresh(){
    let nodetitle=Object.keys(this.node)[0]
    title.innerHTML=nodetitle
    let data=this.node[nodetitle]
    let metadata=data['Metadata']
    next.innerHTML=''
    if(metadata['next-node']) this.addnavigation('Next',[metadata['next-node']])
    body.innerHTML=''
    for(let section of Object.keys(data)){
      let clean=section
      while(clean.indexOf('`')>=0) clean=clean.replace('`','')
      if(this.allow(clean))
        for(let hint of data[section]){
          if(hint.indexOf('- ')==0) hint=hint.substr(2)
          if(tags.debug) hint+=` [${clean}]`
          this.add(anchorme(hint,LINKOPTIONS))
        }
    }
    if(tags.debug){
      this.add('<hr>')
      let activetags=Array.from(tags.active)
      activetags.sort()
      this.add('Tags: '+activetags.join(' '))
      this.add(JSON.stringify(this.node))
    }
  }
  
  async go(node){
    body.innerHTML='Loading...'
    this.node=await load(`data/nodes/${node}.yaml`)
    this.refresh()
  }
}

export var nodeviewer=new NodeViewer()
