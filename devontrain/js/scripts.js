function onLoad(){
  for(let id of ["button-esp", "button-eng"]){
    get( id ).onclick = function(e){
      clearClasses();
      setClasses( getLangFromEvent(e) );
    }
  }
}

function clearClasses(){
  for(let id of ["button-esp", "button-eng", "story-esp", "story-eng"]){
    get( id ).className = "";
  }
}
function setClasses( lang ){
  get( "button-" + lang ).className = "selected";
  get( "story-" + lang ).className = "selected";
}

function getLangFromEvent( e ){
  return e.target.id.split('-')[1];
}

function get( id ){
  return document.getElementById( id );
}
