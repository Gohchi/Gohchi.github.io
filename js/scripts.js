window.onload = function(){
  let btn = get('bg-toggle');
  let body = this.document.getElementsByTagName('body')[0];
  let toggled = false;
  btn.onclick = function(){
    if(toggled){
      btn.innerText = 'BG: GIF';
      btn.title = 'I couldn\' found the owner to give the credits :C';
      body.className = '';
    } else {
      btn.innerText = 'BG: SVG';
      btn.title = 'Under construction hehe';
      body.className = 'svg';
    }
    
    toggled = !toggled;
  }
}


function openWin( name ){
  window.open( name );
}

function addProjectEvents( projects ){
  for(let p of projects){
    get( p.id ).onclick = function(e){
      openWin( p.url );
    }
  }
  
}

function get( id ){
  return document.getElementById( id );
}
