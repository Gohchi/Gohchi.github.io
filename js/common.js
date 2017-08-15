window.document.addEventListener("keydown", onKeyDown, false);
var playing = false;
// temp
var lLastDmgHero = 0;// {damange:0,critical:false};
var lLastDmgMob = 0;// {damange:0,critical:false}; 
 
var hero = new Chara();
hero.initBaseStat(
 26 // hp
 ,5 // sp
 ,8 // atk
 ,9 // def
 ,3 // int
 ,7 // spd
 ,7 // hit
 ,4 // res
);
hero.initAptStat(
 100	// hp
 ,80	// sp
 ,110 	// atk
 ,100 	// def
 ,80	// int
 ,90	// spd
 ,100	// hit
 ,80	// res
); 
 
hero.moveTo(10, 100); 
hero.updateStat();
 
var mob = new Chara(); 
mob.initBaseStat(
 28		// hp
 ,12	// sp
 ,9		// atk
 ,9		// def
 ,10	// int
 ,9		// spd
 ,15		// hit
 ,3		// res
);
mob.initAptStat(
 268	// hp
 ,115	// sp
 ,130 	// atk
 ,140 	// def
 ,90	// int
 ,50	// spd
 ,40	// hit
 ,70	// res
); 
mob.updateStat();
mob.moveTo(150, 100);
mob.setColor('red');


var text = ''
,y = 4
,timer = 0
,textLine = 0
,con = 0
,asciiCon = 0
,asciiMax = 206
,shiftOn = false
,altOn = false
,heroLife = 856
,mobLife = 1264
,gradientMode = 1
,dayHour = 0, lastSec=0;
/*
,capsLock = false;

function shiftIsActive(){
 return (shiftOn) ? true : false;
}

function shiftSet(v){
 shiftOn = v;
}
*/

function getAscii(){
  return String.fromCharCode(con);
}

function getKey(){
 var key = event.keyCode;
 if (altOn) {
  altOn = false;
 return getAltChar(key);
 }else{

    //return (key) ? key : Math.round(Math.random(10)*100);
  return String.fromCharCode( event.keyCode + ((shiftOn)?0:32));
 }
 
}

function captureMsj(msj, ctx){
 switch(msj){
  case 'msj':
   alert(msj); break;
  case 'draw':
   drawStat(mob, ctx); break; 
  case 'heal':
   HealHp(hero, -1);
   HealHp(mob, -1); break;
  case 'hit':
   hero.attack(mob); break;
 }
}

function hit(ctx){
 var dmg = Math.round(Math.random(10)*100); 
 ctx.fillText(dmg, 80, 102);
 mobLife-= dmg;
 if (mobLife < 0) mobLife = 0;
}
function drawLife(
 obj, ctx, x, y
){
 ctx.fillText('hp: ' + obj.getStat('chp') +"/"+ obj.getStat('hp'), x, y); 
 }
 
function drawStat(obj, ctx){
 ctx.font = 'bold 12px Comic Sans MS'; 
 
 obj.updateStat();
 
 ctx.fillText('lvl: ' + obj.level, 4, 15); 
 ctx.fillText('hp: ' + obj.getStat('chp') +"/"+ obj.getStat('hp'), 4, 28); 
 ctx.fillText('sp: ' + obj.getStat('csp') +"/"+ obj.getStat('sp'), 4, 41);

 ctx.fillText('atk: ' + obj.getStat('atk'), 50, 15); 
 ctx.fillText('def: ' + obj.getStat('def'), 110, 15); 
 ctx.fillText('int: ' + obj.getStat('int'), 110, 28); 
 ctx.fillText('spd: ' + obj.getStat('spd'), 110, 41); 
 ctx.fillText('hit: ' + obj.getStat('hit'), 170, 15); 
 ctx.fillText('res: ' + obj.getStat('res'), 170, 28); 
}


function drawStatAsMenu(mnu, obj){
 mnu.add('lvl: ' + obj.level); 
 /*mnu.add('hp: ' + obj.getStat('chp') +"/"+ obj.getStat('hp')); 
 
 mnu.add('sp: ' + obj.getStat('csp') +"/"+ obj.getStat('sp') ); 
 
 mnu.add( 'atk: ' + obj.getStat('atk') ); 
 mnu.add( 'def: ' + obj.getStat('def') ); 
 mnu.add( 'int: ' + obj.getStat('int') ); 
 mnu.add( 'spd: ' + obj.getStat('spd') ); 
 mnu.add( 'hit: ' + obj.getStat('hit') ); 
 mnu.add( 'res: ' + obj.getStat('res') ); */
};

function onKeyDown(){  
// alert(event); 
 var canvas  = document.getElementById('miCanvasIT');
 var ctx = canvas.getContext('2d');
 //______alert(event.keyCode);
 switch(event.keyCode){
  case 0:
    altOn = true;
    break;
  case 13: 
    //if (text != '') ctx.fillText(text, 4, y += 10);
    captureMsj(text, ctx);
    text = '';
    shiftOn = false; 
    timer = 0;
    asciiCon = 0;
    return;
    break;
  case 8:
 //   drawBar(1,2,3,4,'green','blue');
    text = '';
    if (timer >10){
    // dibujar();
     timer = 0;
     y = 4;
    }else{
     timer++;
    }
    break;
  case 16:
    shiftOn = (shiftOn) ? false : true; 
    break;
  default: 
    if (asciiCon<asciiMax)
     // mnu.add(getKey());
      text = text + getKey();
    shiftOn = false; 
   // shiftSet(false);
    timer = 0;
 }
 
 
 // capture temporal hit
 switch(event.keyCode){
 	case 75:
 	 var tmp = hero.attack(mob);
 	lLastDmgHero = tmp.damange;
 	hit.add(
 	 tmp.damange
 	 ,mob.x+(mob.w/2)
 	 ,mob.y
 	 ,tmp.critical
 	);
 	mob.hitted(
 	 tmp.damange,tmp.critical); 
 	 tmp = mob.attack(hero);
 	  
 	lLastDmgMob = tmp.damange;
 	hit.add(
 	 tmp.damange
 	 ,hero.x+(hero.w/2)
 	 ,hero.y
 	 ,tmp.critical
 	); 
 	hero.hitted(
 	 tmp.damange,tmp.critical);
 	tmp = null;
 	// hit damange
 	/*hit.add(
 	 random(100),90,80,random(1)
 	);*/
 	
 	break;
 	case 72:
	HealHp(hero, -1);
	HealHp(mob, -1); 
	MSmnuInfo.v++;
	if( MSmnuInfo.v>9)
	 MSmnuInfo.v = 0; 
	break;
//	default:	alert(event.keyCode); break;
	case 69:
	qy-=3;
	mnu.move(0);
	mnuS.move(0);break;
	case 88:
	qy+=3;
	mnu.move(1);
	mnuS.move(1);break;
	case 74:
	//alert(mnu.option - mnu.from);
	if(playing){
	}{
	 mnu.selectOption();
	}
	break;
	case 79: 
	 haku.v+=0.1; break;  
	case 80: 
	 haku.v-=0.1; break; 
	case 83: 
	 qx-=3;
	 bar.toLeft();
	break; 	 
	case 70:
	 qx+=3;
	 bar.toRight();
	break; 
 
 
 }
 mnu.makeColor(event,1);
  
 con++;

 //dibujar(); 
}

function drawBar(x, y, min, max, colorIn, colorOut, x2, y2){
 if (!colorIn) colorIn='black';
 if (!colorOut) colorOut='red';

}

var blue = 0.5, dblue = 0, cy=0, dcy = 0;
function crazyGradient(cnvs){ 
 var ctx = cnvs.getContext('2d'); 
  
 if(dblue==0){
  blue+=0.01;
  if(blue>=0.999)dblue=1;
  }else{
  blue-=0.01;
  if(blue<=0.001)dblue=0; 
  }
   
 if(dcy==0){
  cy+=1;
  if(cy>=cnvs.height)dcy=1;
  }else{
  cy-=1;
  if(cy<=0)dcy=0; 
  } 
  //alert(dblue+' - ' +blue);
 /*ctx.fillText(cy, 150,100);
 
 ctx.strokeStyle = 'black';
 ctx.beginPath();  
 ctx.moveTo(0,cy);
 ctx.lineTo(
  cnvs.width,cnvs.height-cy
 );
 ctx.closePath();  
 ctx.stroke(); */
  
  switch(gradientMode){
   case 0: 
    var gr = '#FFF';
   break;
   case 1:
    var gr=ctx.createLinearGradient(0,cy,cnvs.width,cnvs.height-cy);
   break;
   case 2:
    var gr=ctx.createRadialGradient(0,cy,cnvs.width,0,cnvs.height-cy,0);
   break;
   case 3:
    var gr=ctx.createLinearGradient(0,0,0,cnvs.height);
    var ctop,cmiddle,cbottom;
    switch(dayHour){
    case 0:
     ctop = "white";
     cmiddle = "cyan";
     cbottom = "blue";
    break; 
    case 1:
     ctop = "yellow";
     cmiddle = "orange";
     cbottom = "red";
    break; 
    case 2:
     ctop = "black";
     cmiddle = "black";
     cbottom = "purple";
    break; 
    }
gr.addColorStop(0,ctop);
gr.addColorStop(0.6,cmiddle);
gr.addColorStop(1,cbottom); 
   break;
  }
  if(gradientMode!=0 &&
     gradientMode!=3){
gr.addColorStop(0,"magenta");
gr.addColorStop(blue,"blue");
gr.addColorStop(1,"red");
 
  }
 return gr;
}

function setGradientMode(v){
 switch(v){
  case 'mono':
   gradientMode = 0;
   break;
  case 'linear': 
   gradientMode = 1; 
   break;
  case 'radial': 
   gradientMode = 2; 
   break;
 }
}

function random(max,min){
 if(!min) min = 0;
 
 return Math.round(
  Math.random(10)*(max-min)
 ) + min;
};
 

function roundedStrokeRect(
 x,y,width,height,radius){
 
 this.roundedRect(
  x,y,width,height,radius);
 this.stroke();
 
}; 

function roundedFillRect(
 x,y,width,height,radius){
 
 this.roundedRect(
  x,y,width,height,radius);
 this.fill();
 
}; 
function roundedRect(x,y,width,height,radius){
  this.beginPath();
  this.moveTo(x,y+radius);
  this.lineTo(x,y+height-radius);
  this.quadraticCurveTo(x,y+height,x+radius,y+height);
  this.lineTo(x+width-radius,y+height);
  this.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
  this.lineTo(x+width,y+radius);
  this.quadraticCurveTo(x+width,y,x+width-radius,y);
  this.lineTo(x+radius,y);
  this.quadraticCurveTo(x,y,x,y+radius);
  //this.stroke();
};

function getSec(){
 return (new Date()).getSeconds();
}; 

function getMin(){
 return (new Date()).getMinutes();
};