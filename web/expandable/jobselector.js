import {jobs,tags} from '../tags.js'
import {Expandable} from './expandable.js'

const element=document.querySelector('#jobs ')
const control=element.querySelector('.body')
const inputtemplate=document.querySelector('template#jobselect')

class JobSelector extends Expandable{
  constructor(){
    super(control,element.querySelector('button'),false)
  }
  
  refresh(){
    control.innerHTML=''
    let sorted=Array.from(jobs)
    sorted.sort()
    sorted.splice(0,0,'All','Debug')
    for(let j of sorted){
      let select=inputtemplate.content.cloneNode(true)
      let input=select.querySelector('input')
      input.id='job-'+j
      input.value=j
      let label=select.querySelector('label')
      label.setAttribute('for',input.id)
      label.innerHTML=j.replace('-',' ')
      control.appendChild(select)
      input.addEventListener('click',()=>tags.refresh())
    }
  }
  
  get jobs(){
    let jobs=Array.from(control.querySelectorAll('input'))
    return new Set(jobs.filter(j=>j.checked).map(j=>j.value))
  }
}

export const jobselector=new JobSelector()
