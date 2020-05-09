function openWin( name ){
  window.open( name);
}

function addProjectEvents( projects ){
  for(let p of projects){
    get( p.id ).onclick = function(e){
      openWin( p.url );
    }
  }
  
  function get( id ){
    return document.getElementById( id );
  }
}