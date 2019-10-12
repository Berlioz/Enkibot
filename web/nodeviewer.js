import {jobselector} from './expandable/jobselector.js'
import {load} from './enkibot.js'
import {tags} from './tags.js'
import {navigation} from './expandable/navigation.js'
import {mapview} from './expandable/mapview.js'

const LINKOPTIONS={attributes:[{name:'target',value:'_blank'}]}

const element=document.querySelector('#nodeviewer')
const title=element.querySelector('.title')
const next=element.querySelector('#next')
const previous=element.querySelector('#previous')
const body=element.querySelector('.body')

class NodeViewer{
  constructor(){
    this.node=false //base YAML object
    this.nodetitle=false //root object key
    this.data=false //this.node[this.title]
    this.metadata=false //this.data['Metadata']
    this.last=false //hold last this.filename
  }
  
  add(hint){
    let item=document.createElement('li')
    item.innerHTML=hint
    body.appendChild(item)
  }
  
  addnavigation(label,nodes,parent){
    let div=document.createElement('div')
    if(label) div.innerHTML=`${label}: `
    for(let n of nodes){
      let link=document.createElement('a')
      link.title=navigation.titles[n]
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
    title.innerHTML=this.nodetitle
    next.innerHTML=''
    previous.innerHTML=''
    let nextnode=this.metadata['next-node']
    if(nextnode&&nextnode!='end') this.addnavigation('Next',[nextnode],next)
    if(this.last){
      //TODO here we could use the metadata 'previous-nodes' field but the state of that is a mess, there are "previous nodes" with multiple values while walking forward is 100% linear, for example...
      this.addnavigation('Back to',[this.last],previous)
    }
    body.innerHTML=''
    for(let section of Object.keys(this.data)){
      let clean=section
      while(clean.indexOf('`')>=0) clean=clean.replace('`','')
      if(this.allow(clean))
        for(let hint of this.data[section]){
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
    this.last=this.filename
    this.filename=node
    this.node=await load(`data/nodes/${node}.yaml`)
    this.nodetitle=Object.keys(this.node)[0]
    this.data=this.node[this.nodetitle]
    this.metadata=this.data['Metadata']
    this.refresh()
    mapview.refresh()
  }
}

export var nodeviewer=new NodeViewer()
