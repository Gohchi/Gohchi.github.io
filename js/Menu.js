//Menu.js
function Menu(x,y){
	this.x = (x) ? x : 0; 
	this.y = (y) ? y : 0;
	var aList = [];
	this.item = aList;
	this.selected = false;
	this.locked = [];
	this.value = [];
	this.action = [];
	this.spacing = 12;
	this.option = 0;
	this.rows = 0;
	this.from = 0;
	this.ctx = "";
	this.parent = "";
	this.dir = 0;
	this.color = '#B96';
	
	this.r = 11;
	this.g = 9;
	this.b = 6;
	
	this.mode = 2;
	this.cursor = 1;
	
	this.angle = 0;
	this.dirx = 0;
	
	this.yv = 0;
	this.xv = 0;
};

Menu.prototype.add = function(str, lock){
  var i = this.item.length;
  this.item[i] = str;
 // this.value[i] = val;
  this.locked[i] = lock;
};

Menu.prototype.setCtx = function(ctx){
 this.ctx = ctx;
};

Menu.prototype.setRows = function(q){
 if(q<0) q = 0;
 if(q>this.item.length)
  q = this.item.length;
 this.rows = q;
// alert(this.rows);
 
};

Menu.prototype.selectOption = function(){
 if (this.selected){
  this.value[this.option].selected = true;
 }
 this.selected = true;
};

Menu.prototype.menuAction = function(){
 switch(
  this.value[this.option]
 ){
  case 'close':
   this.selected = false;
   this.parent.selected = false;
   this.option = 0; 
   break;
 }
};

Menu.prototype.exeAction = function(){
 var ths = this;

// alert(ths.option);
 switch(
  this.action[ths.option]
 ){
  case 'child':
   this.drawChild();
   break;
  case 'action':
   this.menuAction();
   break;
  case 'alert':
   alert(this.value[this.option]);
   this.selected = false;
   break; 
  case 'functionX':
   playing = true;
   break;
  case 'function0':
   gradientMode = 0;
   this.selected = false;
   break;
  case 'function1':
   gradientMode = 1;
   this.selected = false;
   break; 
  case 'function2':
   gradientMode = 2;
   this.selected = false;
   break; 
  case 'function3':
   gradientMode = 3;
   this.selected = false;
   break; 
  default:
   alert('404');
   this.selected = false;
   break;
 }
 
};

Menu.prototype.setAction = function(option, name, obj){
 this.action[option] = name;
 this.value[option] = obj;
 obj.parent = this;
 
};

Menu.prototype.drawChild = function(){
 this.ctx.fillText(this.y,150,100); 
 var cMenu = this.value[this.option];
 
 this.ctx.fillText(cMenu.y,170,100); 

 cMenu.x = this.x+30;
 cMenu.y = this.y+(this.spacing*(this.option-this.from))+this.spacing;
 
 cMenu.draw(this.ctx);
};

Menu.prototype.draw = function(context){
 if(context){
  var ctx = context;
 }else{
  var ctx = this.ctx;
 }
 
 //if(this.parent!=""){
 //ctx.fillText('5lcglfr',30,30);
 if(this.dirx==1){
  this.angle+=0.2;
  this.yv-=0.12;
  if(this.angle>10) this.dirx = 0;
 }else{
  this.angle-=0.2;
  this.yv+=0.12;
  if(this.angle<-5) this.dirx = 1;
 }
// }
 ctx.rotate(this.angle*Math.PI/180); 

// ctx.fillText(this.angle,170,115); 
 ctx.font = 'bold 12px Comic Sans MS'; 
 if(!this.rows) this.rows = this.item.length;
 // background
 this.drawbg(ctx);
 
 ctx.save();
 
 //var toI = 3;
 
 // define rows
 if (this.dir == 0){
 //---------------------------
 //-- Si va hacia arriba
 //---------------------------
  if(this.from >= this.option){
	this.from = this.option;
  }
  if (this.from > (this.item.length-this.rows)){
	this.from = this.item.length- this.rows+1;
  }
  if (this.option == this.item.length-1){
   this.from = this.item.length-this.rows;
   }
 }else{
 //---------------------------
 //-- Si va hacia abajo
 //---------------------------
  if ((this.option - this.from) >= this.rows){
   this.from = this.option - this.rows + 1;
   if (this.from < 0){
    this.from = 0;
   }
  }
  if (this.option == 0){
   this.from = 0;
  }
 }
 var toI = this.rows + this.from;
//alert(this.from+ '-'+toI);
// ctx.fillText(this.from+'/'+toI, 80, 100);
 //ctx.font='30px arial';

 var x = 0;
 // draw items
 for(var i=this.from; i<toI; i++){
  // option selected
  if(i==this.option){
  
   ctx.fillStyle = 'red'; 
  
   if(this.cursor==1){
   //highlight
    ctx.fillText(this.item[i], this.X(), this.Y()+(this.spacing*x)); /*
   
   // Prueba ancho cadena
   
   ctx.strokeStyle='black';
   ctx.beginPath();  
   ctx.moveTo(this.x,this.y+50);  
   ctx.lineTo(
   this.x+ctx.measureText(this.item[i]).width,this.y+50);  
//   ctx.closePath(); 
   ctx.stroke(); 
   */
   
    ctx.restore();
   
   }else{
  
    var x1 = this.X();
    var y1 = this.Y()-this.spacing/3;
  //  with(ctx){
    y1 = y1 + this.spacing*x;
    
    ctx.beginPath();  
    ctx.moveTo(x1,y1);  
    ctx.lineTo(x1-10, y1-5);  
    ctx.lineTo(x1-6 , y1);
    ctx.lineTo(x1-10, y1+5); 
    ctx.closePath(); 
    ctx.fill(); 
    
    ctx.restore();
 //   }

    ctx.fillText(this.item[i], this.X(), this.Y()+(this.spacing*x)); 
    
   }
  }else{
   //normal
   
   if(this.locked[i]){
    ctx.fillStyle = 'grey';
   }else{
    ctx.fillStyle = 'black'; 
   }
   ctx.fillText(
     this.item[i]
     ,this.X()
     ,this.Y()+(
      this.spacing*x
     )
   );
  }
  x++;
 }
 ctx.rotate((-this.angle)*Math.PI/180); 
 if (this.selected){
  this.exeAction();
 }
 

};

Menu.prototype.move = function(dir){
// alert(this.parent.selected);
 if (!this.selected
 && (
  this.parent == "" ||
  this.parent.selected == true
  )
 ){ 
  this.dir = dir;
  if(dir==1){
   this.option++;
   if(this.locked[this.option]
   ){
    while(
     this.locked[this.option]
    ){
     this.option++;
    }
   }
   
   if(this.option>=this.item.length) {
    switch(this.mode){
     case 1:
      this.option=this.item.length-1;
     break;
     case 2:
      this.option=0;
     break;
    }
   }
   
  }else{
   this.option--;
   if(this.locked[this.option]
   ){
    while(
     this.locked[this.option]
    ){
     this.option--;
    }
   }
    
   if(this.option<0){
    switch(this.mode){
     case 1: 
	   this.option=0;
     break;
     case 2:
	   this.option=this.item.length-1;
     break;
    }
   }
   
  }
 }
};

Menu.prototype.setColor = function(color){
	this.color = color;
};

Menu.prototype.makeColor = function(e, mode){
 var key = e.keyCode;

 switch(mode){
  default:
  
 switch(key){
  case 84:
  if(this.r<15) this.r++; break;
  case 89:
  if(this.g<15)	this.g++; break;
  case 85:
  if(this.b<15)	this.b++; break;
  case 86:
  if(this.r>0)	this.r--; break;
  case 66:
  if(this.g>0)	this.g--; break;
  case 78:
  if(this.b>0)	this.b--; break;
  }
  var c = '#';
  c = c + intToHex(this.r);
  c = c + intToHex(this.g); 
  c = c + intToHex(this.b); 
   break;
   case 2:
  switch(key){
  case 84:
  if(this.r<256)
  this.r++; break;
  case 89:
  if(this.g<256)	
  this.g++; break;
  case 85:
  if(this.b<256)
  this.b++; break;
  case 86:
  if(this.r>0)this.r--; break;
  case 66:
  if(this.g>0)this.g--; break;
  case 78:
  if(this.b>0)this.b--; break;
  } 
   var c = typeof(Math);//this.r,this.g,this.b,1);
   
   break;
  }
 if(key==0) alert(c); 
  this.color = c;
};


Menu.prototype.drawbg = function(ctx){
 // ctx.globalAlpha = 0.2;
 ctx.fillStyle = this.color;
 ctx.fillRect(
  this.X()-this.spacing/3
 ,this.Y()-this.spacing*1.2
 ,60
 ,this.spacing*this.rows+this.spacing/1.2
 );
 
 ctx.fillStyle = 'black';
 
 // border
 this.drawBorder(ctx, '#753', 0);
 
 this.drawBorder(ctx, '#420', 1);
 
 this.drawBorder(ctx, '#975', 2); 

 
};

Menu.prototype.drawBorder = function(ctx, color, a){
 
 ctx.strokeStyle = color; 
 ctx.strokeRect( 
  a+this.X()-this.spacing/3
 ,a+this.Y()-this.spacing*1.2
 ,60-a*2
 ,(this.spacing*this.rows+this.spacing/1.2)-a*2
 ); 
};
 
Menu.prototype.X = function(){
 return this.x+this.xv;
};
 
Menu.prototype.Y = function(){
 return this.y+this.yv;
};

function intToHex(v){
 switch(v){
  case 10: v = 'A'; break; 
  case 11: v = 'B'; break; 
  case 12: v = 'C'; break;
  case 13: v = 'D'; break;
  case 14: v = 'E'; break; 
  case 15: v = 'F'; break;
 }
 return v;
}


