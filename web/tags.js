import {load} from './enkibot.js'
import {jobselector} from './jobselector.js'
import {nodeviewer} from './nodeviewer.js'

var data=false
export var jobs=new Set()

class Tags{
  constructor(){
    this.active=new Set()
  }
  
  async load(){
    data=await load('data/jobs.yaml')
    data=data['Jobs']
    for(let j in data) jobs.add(j)
    jobselector.refresh()
  }
  
  get debug(){
    return this.active.has('Debug')
  }
  
  refresh(){
    this.active.clear()
    for(let j of jobselector.jobs){
      this.active.add(j)
      if(data[j]) for(let tag of data[j]) this.active.add(tag)
    }
    nodeviewer.refresh()
  }
  
  has(tag){return this.active.has('all')||this.active.has(tag)}
}

export var tags=new Tags()
