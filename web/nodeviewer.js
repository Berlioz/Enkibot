import {jobselector} from './expandable/jobselector.js'
import {load} from './enkibot.js'
import {tags} from './tags.js'
import {navigation,root} from './expandable/navigation.js'
import {mapview} from './expandable/mapview.js'

const LINKOPTIONS={attributes:[{name:'target',value:'_blank'}]}
const INTERNAL='enki.bot/'

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
  }
  
  add(hint){
    let item=document.createElement('li')
    item.innerHTML=hint
    for(let a of item.querySelectorAll('a')){
      let i=a.href.indexOf(INTERNAL)
      if(i>=0){
        let to=a.href.substr(i+INTERNAL.length)
        if(navigation.titles[to]) a.innerHTML=navigation.titles[to]
        a.href='#'+to
        a.target='_self'
      }
    }
    body.appendChild(item)
  }
  
  addnavigation(label,nodes,parent){
    let div=document.createElement('div')
    if(label) div.innerHTML=`${label}: `
    for(let n of nodes){
      let link=document.createElement('a')
      link.title=navigation.titles[n]
      link.innerHTML=link.title
      link.href='#'+n
      div.appendChild(link)
      parent.appendChild(div)
    }
  }
  
  /* 
   * The original ruby program confuses the meaning of 
   * UNION (or) and INTERSECTION (and). Sadly, it's easier to 
   * emulate this fault rather than to fix it (especially when
   * it comes to merging upstream changes).
   */
  allow(tag){
    if(tag=='Metadata') return false
    if(tags.has(tag)||tags.has('All')) return true
    if(tag=='Generic') return true
    let parameters=tag.split(' ').splice(1)
    if(tag.indexOf('INTERSECTION')>=0){
      for(let p of parameters) if(tags.has(p)) return true
      return false
    }
    if(tag.indexOf('UNION')>=0){
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
    document.head.querySelector('title').innerHTML=this.nodetitle + ' | Enkibot'
    title.innerHTML=this.nodetitle
    next.innerHTML=''
    previous.innerHTML=''
    let nextnode=this.metadata['next-node']
    if(nextnode&&nextnode!='end') this.addnavigation('Next',[nextnode],next)
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
    mapview.refresh()
  }
  
  async go(node){
    body.innerHTML='Loading...'
    this.filename=node
    this.node=await load(`data/nodes/${node}.yaml`)
    this.nodetitle=Object.keys(this.node)[0]
    this.data=this.node[this.nodetitle]
    this.metadata=this.data['Metadata']
    this.refresh()
  }
  
  navigate(){
    this.go(location.hash.length>1?location.hash.substr(1):root)
    title.scrollIntoView()
  }
}

export var nodeviewer=new NodeViewer()

window.addEventListener('hashchange',()=>nodeviewer.navigate())
