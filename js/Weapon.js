// weapon.js
function weapon(){
 this.x = 0;
 this.y = 0;
 this.w = 3;
 this.h = 3;
 this.vx = 3;
 this.mx = 0.9; 
 this.dirx = 0; 
 this.vy = 3;
 this.my = 1.1; 
 this.diry = 2; 
 this.dir = 0;
 this.v = 1;
 this.ctx = "";
 this.parent = "";
}
 
weapon.prototype.draw = function(){
 /*
 var cc = document.getElementById('miCanvasIT');
var ctxx = c.getContext('2d'); 
 
 ctxx.fillRect(
  this.x, this.y
  ,this.w, this.h
 ); 
 ctxx.fillText( this.parent,
  this.x+10, this.y
 ); 
 */
 
 var prnt = this.parent;
 var mode = 3;
 prnt.ctx.save();
 prnt.ctx.fillStyle =
  (mode==2)?'yellow':'red';
 this.orbit(mode);
 
 prnt.ctx.fillRect(
  this.x+prnt.x+prnt.w
  ,this.y+prnt.y+prnt.h
  ,this.w, this.h
 );
 /*
 prnt.ctx.fillText( 
 this.diry+' '+Math.round(this.y)+' '+Math.round(this.vy),
  30,30
 );
 
 
 prnt.ctx.fillText( 
 this.mx+' '+this.my+' '+this.x,
  30,45
 );*/
 
 prnt.ctx.restore(); 
};

weapon.prototype.orbit = function(mode){
 switch(mode){ 
 //-------------------------- 
 case 1:  // dont work
 //-------------------------- 
 switch(this.dir){
  case 0:
   this.x++;
   this.y++;
   if(this.x==0) this.dir = 1;
   break;
  case 1:
   this.x++;
   this.y--;
   if(this.y==0) this.dir = 2;
   break; 
  case 2:
   this.x--;
   this.y--;
   if(this.x==0) this.dir = 3;
   break;
  case 3:
   this.x--;
   this.y++;
   if(this.y==0) this.dir = 0;
   break; 
 }
 break; 
 //-------------------------- 
 case 2: 
 //-------------------------- 
  switch(this.dir){
  case 0:
   this.x+=(
    this.vx=this.vx*this.mx);
   this.y+=(
    this.vy=this.vy*this.my);
   if(this.x>0){
    this.dir = 1;
    this.mx = 0.9;
    
    this.my = 1.1;
    this.vy = 0.1;
   }
   break;
  case 1:
   this.x+=(
    this.vx=this.vx*this.mx);
   this.y-=(
    this.vy=this.vy*this.my);
   if(this.vx<0.1){
    this.dir = 2;
    this.mx = 1.1;
    this.vx = 0.1; 
    
    this.my = 0.9;
   }
   break; 
  case 2:
   this.x-=(
    this.vx=this.vx*this.mx);
   this.y-=(
    this.vy=this.vy*this.my);
   if(this.x<0){
    this.dir = 3;
    this.mx = 0.9;
    
    this.my = 1.1;
    this.vy = 0.1;
   } 
   break;
  case 3:
   this.x-=(
    this.vx=this.vx*this.mx);
   this.y+=(
    this.vy=this.vy*this.my);
   if(this.vx<0.1){
    this.dir = 0;
    this.mx = 1.1;
    this.vx = 0.1; 
    
    this.my = 0.9;
   } 
   break; 
  } 
 break;
 //--------------------------
 case 3: 
 //-------------------------- 
  switch(this.dirx){
  case 0:
   this.x+=(
    this.vx=this.vx*this.mx);
   if(this.x>0){
    this.dirx = 1;
    this.mx = 0.9;
   }
   break;
  case 1:
   this.x+=(
    this.vx=this.vx*this.mx);
   if(this.vx<0.1){
    this.dirx = 2;
    this.mx = 1.1;
    this.vx = 0.1; 
   }
   break; 
  case 2:
   this.x-=(
    this.vx=this.vx*this.mx);
   if(this.x<0){
    this.dirx = 3;
    this.mx = 0.9;
   } 
   break;
  case 3:
   this.x-=(
    this.vx=this.vx*this.mx);
   if(this.vx<0.1){
    this.dirx = 0;
    this.mx = 1.1;
    this.vx = 0.1; 
   } 
   break; 
  } 
  switch(this.diry){
  case 0:
   this.y+=(
    this.vy=this.vy*this.my);
   if(this.y>0){
    this.diry = 1;
    this.my = 0.9;
   }
   break;
  case 1:
   this.y+=(
    this.vy=this.vy*this.my);
   if(this.vy<0.1){
    this.diry = 2;
    this.my = 1.1;
    this.vy = 0.1; 
   }
   break; 
  case 2:
   this.y-=(
    this.vy=this.vy*this.my);
   if(this.y<0){
    this.diry = 3;
    this.my = 0.9;
   } 
   break;
  case 3:
   this.y-=(
    this.vy=this.vy*this.my);
   if(this.vy<0.1){
    this.diry = 0;
    this.my = 1.1;
    this.vy = 0.1; 
   } 
   break; 
  }
 break;
 }
};