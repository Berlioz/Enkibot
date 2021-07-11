import {Expandable} from './expandable.js'

const element=document.querySelector('#guides')
const links=element.querySelector('.links')
const button=element.querySelector('button')

class Guides extends Expandable{
  constructor(){super(links,button)}
}

var guides=new Guides()
