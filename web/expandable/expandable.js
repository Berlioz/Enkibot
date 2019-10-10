export class Expandable{
  constructor(content,button,hide=true){
    this.content=content
    this.button=button
    button.addEventListener('click',()=>this.toggle())
    if(hide) this.hide()
    else this.show()
  }
  
  hide(){
    this.content.classList.add('hidden')
    this.button.innerHTML='Show'
  }
  
  show(){
    this.content.classList.remove('hidden')
    this.button.innerHTML='Hide'
  }
  
  toggle(){
    if(this.content.classList.contains('hidden')) this.show()
    else this.hide()
  }
}
