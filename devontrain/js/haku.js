// haku.js
function haku(){
 this.x = 80;
 this.y = 20;
 this.w = 3;
 this.h = 3;
 this.m = 1.1;
 this.dir = 0;
 this.v = 1;
 this.ctx = "";
 this.wpn = new weapon();
 this.parent = "";
}
 
haku.prototype.draw = function(){
 
 this.ctx.save();
 this.advance();
 
 if(this.isOutBottom())
  this.setMultiplier(0.9);
 
 if(this.isOnTopJump()) 
  this.setMultiplier(1.1);
 
 if(this.toRight()){
  if(this.x>223-this.w) 
   this.toLeft(true); 
  this.x+=this.v; 
 }else{
  if(this.x<0) 
   this.toRight(true); 
  this.x-=this.v; 
 }

 this.ctx.fillRect(this.x, this.y, this.w, this.h);
 this.wpn.draw();
 this.ctx.restore();

};

haku.prototype.advance = function(){
 this.y = this.y * this.m;
};

haku.prototype.isOutBottom = function(){
 if(this.y>256) return true;
 return false;
};
 
haku.prototype.setMultiplier = function(m){
 this.m = m;
};

haku.prototype.isOnTopJump = function(){
 if(this.y < 1) return true;
 return false;
};
 
haku.prototype.toRight = function(v){
 if(v){
  this.dir = 0;
  return;
 }
 
 return(this.dir==0)?true:false;
}; 
 
haku.prototype.toLeft = function(v){
 if(v){
  this.dir = 1;
  return;
 }
 
 return(this.dir==1)?true:false;
};

 
haku.prototype.contact = function(foe){
 if( // contact
  (
  this.x<=foe.x+foe.w && 
  this.x>=foe.x && 
  this.y<=foe.y+foe.h && 
  this.y>=foe.y
  )||(  
  this.x<=foe.x+foe.w && 
  this.x>=foe.x && 
  this.y+this.h<=foe.y+foe.h && 
  this.y+this.h>=foe.y 
  )||(  
  this.x+this.w<=foe.x+foe.w && 
  this.x+this.w>=foe.x && 
  this.y<=foe.y+foe.h && 
  this.y>=foe.y 
  )||(  
  this.x+this.w<=foe.x+foe.w && 
  this.x+this.w>=foe.x && 
  this.y+this.h<=foe.y+foe.h && 
  this.y+this.h>=foe.y 
  )
 ){
   this.ctx.fillStyle='red'; 
//    if(playing){
//	} 
   this.m = 0.9;
   return true;
  } 
}; 

haku.prototype.contactAni = function(critical){
 var t = this;
 t.ctx.save();
 t.ctx.fillStyle = '#FFFF00';
 
 if(critical){

 t.ctx.save();
 t.ctx.fillStyle = '#FFFF00';
 t.ctx.beginPath();  
 t.ctx.moveTo(t.x,t.y);  
 t.ctx.lineTo(
  t.x-random(40,30)
  ,t.y-random(15,5));  
 t.ctx.lineTo(
  t.x-random(55,45)
  ,t.y-random(25,20)); 
 t.ctx.lineTo(
  t.x-random(40,30)
  ,t.y-random(20,15)); 
 t.ctx.lineTo(
  t.x-random(45,35)
  ,t.y-random(65,55)); 
 t.ctx.lineTo(
  t.x-random(30,20)
  ,t.y-random(40,30)); 
 t.ctx.lineTo(
  t.x-random(25,15)
  ,t.y-random(60,55)); 
 t.ctx.lineTo(
  t.x-random(5)
  ,t.y-random(70,60)); 
 t.ctx.lineTo(
  t.x+random(5)
  ,t.y-random(90,65)); 
 t.ctx.lineTo(
  t.x+random(15,25)
  ,t.y-random(65,55)); 
 t.ctx.lineTo(
  t.x+random(30,25)
  ,t.y-random(55,45)); 
 t.ctx.lineTo(
  t.x+random(30,25)
  ,t.y-random(45,30)); 
  // 4th spike
 t.ctx.lineTo(
  t.x+random(45,35)
  ,t.y-random(65,55)); 
  // 5th 
 t.ctx.lineTo(
  t.x+random(45,35)
  ,t.y-random(30,20)); 
 t.ctx.lineTo(
  t.x+random(55,45)
  ,t.y-random(25,15)); 
 t.ctx.lineTo(
  t.x+random(25,15)
  ,t.y-random(10,5)); 
 t.ctx.closePath();
 t.ctx.fill();
 // end yellow flame
 
 t.ctx.fillStyle = '#FFAA00';
 t.ctx.beginPath();  
 t.ctx.moveTo(t.x,t.y);  
 t.ctx.lineTo(
  t.x-random(15,10)
  ,t.y-random(10,5));  
 t.ctx.lineTo( 
  t.x-random(30,20)
  ,t.y-random(25,25));  
 t.ctx.lineTo(
  t.x-random(15,10)
  ,t.y-random(30,20));  
 t.ctx.lineTo(
  t.x-random(20,15)
  ,t.y-random(50,40));  
 t.ctx.lineTo(
  t.x-random(10,5)
  ,t.y-random(40,30));  
 t.ctx.lineTo(
  t.x+random(10,5)
  ,t.y-random(60,50));  
 t.ctx.lineTo(
  t.x+random(20,15)
  ,t.y-random(30,25));  
 t.ctx.lineTo(
  t.x+random(35,30)
  ,t.y-random(35,30));  
 t.ctx.lineTo(
  t.x+random(20,15)
  ,t.y-random(10,5));
 t.ctx.closePath();
 t.ctx.fill(); 
 // end yellow flame
 
 t.ctx.fillStyle = '#FF0000';
 t.ctx.beginPath();  
 t.ctx.moveTo(t.x,t.y);  
 t.ctx.lineTo(
  t.x-random(10,5)
  ,t.y-random(15,5)); 
 t.ctx.lineTo(
  t.x//-random(5)
  ,t.y-random(25,15)); 
 t.ctx.lineTo(
  t.x+random(10,5)
  ,t.y-random(15,5));  
 t.ctx.closePath();
 t.ctx.fill();
  
 t.ctx.restore();
 
 }else{
 t.ctx.beginPath();  
 t.ctx.moveTo(t.x,t.y);  
 t.ctx.lineTo(
  t.x-random(50,40)
  ,t.y-random(20,10));  
 t.ctx.lineTo(
  t.x-random(40,30)
  ,t.y-random(25,20));  
 t.ctx.closePath();
 t.ctx.fill();
  
 t.ctx.beginPath();  
 t.ctx.moveTo(t.x,t.y);  
 t.ctx.lineTo(
  t.x+random(10,5)
  ,t.y-random(50,40));  
 t.ctx.lineTo(
  t.x,t.y-random(60,50));  
 t.ctx.closePath();
 t.ctx.fill(); 
 
 t.ctx.beginPath();  
 t.ctx.moveTo(t.x,t.y);  
 t.ctx.lineTo(
  t.x+random(50,40)
  ,t.y-random(20,10));  
 t.ctx.lineTo(
  t.x+random(40,30)
  ,t.y-random(25,20));  
 t.ctx.closePath();
 t.ctx.fill();
 }
 
 t.ctx.restore();
};