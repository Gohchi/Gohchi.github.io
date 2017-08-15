function CharaSprite(){
 this.base = "";	// parent?
 this.x = 10;		// y axis
 this.y = 50;		// width
 this.ctx = "";		// height
 
 this.state = 0;
 // 0 - stand
 this.footL = {x:3,y:5} 
 this.footR = {x:3,y:5} 
}

CharaSprite.prototype.draw = function(ctx,x,y){
 var t = this.base; 
 this.x = x;
 this.y = y;
 this.ctx = ctx;
  
 this.drawFoots();
 this.drawLegs();
 this.drawTorso();
 this.drawArms();
 this.drawHands();
 this.drawHead();
 
 this.ctx.fillStyle = 'red';
 this.ctx.fillText( '.'
  ,this.x,this.y
 ); 
 this.ctx.fillStyle = 'black'; 
 
 /*
 // if hitted
 if( t.hit.time>0 ){
  if(t.hit.crit){
   // cross eyes
   for(var i = 0;i<2;i++){
    ctx.beginPath();  
    ctx.moveTo(x+10,y+10);  
    ctx.lineTo(x+20,y+20);  
    ctx.stroke();
    ctx.beginPath();  
    ctx.moveTo(x+20,y+10);  
    ctx.lineTo(x+10,y+20);  
    ctx.stroke(); 
    x+= 20;
   }
  }else{
  // point eyes
  ctx.fillRect(
   t.x+14,t.y+14,2,2); 
  ctx.fillRect(
   t.x+34,t.y+14,2,2); 
  }
  t.hit.time--;
 }else{
  var s = 0;
  // circle eyes
  for(var i=0;i<2;i++){
  ctx.beginPath();  
  ctx.moveTo(
   t.x+10+s, t.y+15);
  ctx.bezierCurveTo(
   t.x+10+s, t.y+23, 
   t.x+22+s, t.y+23, 
   t.x+22+s, t.y+15
  );
  ctx.bezierCurveTo(
   t.x+22+s, t.y+7, 
   t.x+10+s, t.y+7,
   t.x+10+s, t.y+15
  ); 
  s+=20
  ctx.fill();
  }
  ctx.fillStyle = 'white';
  ctx.fillRect(
   t.x+15,t.y+15,4,4); 
  ctx.fillRect(
   t.x+35,t.y+15,4,4); 
  ctx.fillStyle = 'black'; 
 } */
};
 
CharaSprite.prototype.drawFoots = function(){
 var t = this.base;

 switch(this.state){
  case 0:
   this.ctx.fillRect(
    this.x-8, this.y-4, 6,4);
 
   this.ctx.fillRect(
    this.x-1,this.y-4, 10,4);
   break;
 }
};
 
CharaSprite.prototype.drawLegs = function(){
 var t = this.base;
 
 this.ctx.fillRect(
  this.x-7, this.y-10, 4,8);
 this.ctx.fillRect(
  this.x-6, this.y-17, 4,8);
 
 
 this.ctx.fillRect(
  this.x,this.y-10, 4,7);
 this.ctx.fillRect(
  this.x+1,this.y-16, 4,7);
 
};
 
CharaSprite.prototype.drawTorso = function(){
 var t = this.base;

 this.ctx.fillRect(
  this.x-5,this.y-30, 10, 15);
 this.ctx.fillRect(
  this.x-5,this.y-24, 11, 9); 
 
};
 
CharaSprite.prototype.drawArms = function(){
 var t = this.base;

 this.ctx.fillRect(
  this.x-7,this.y-29, 3, 3);
  
 this.ctx.fillRect(
  this.x-8,this.y-28, 2, 8);
 
 this.ctx.fillRect(
  this.x-9,this.y-22, 2, 6); 
};
 
CharaSprite.prototype.drawHands = function(){
 var t = this.base;
 
 this.ctx.fillRect(
  this.x-10,this.y-16, 4, 4); 
 
}; 

CharaSprite.prototype.drawHead = function(){
 var t = this.base;
 
 this.ctx.fillRect(
  this.x-2,this.y-34, 4, 4); 
 
 this.ctx.fillRect(
  this.x-11,this.y-50, 25, 18);
 
}; 
