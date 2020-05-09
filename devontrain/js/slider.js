//slider.js
function slider(){
 this.x = 10;
 this.y = 90;
 this.vx = 0;
 this.vy = 0;
 this.w = 60;
 this.h = 10;
 this.m = 1.1;
 this.dir = 0;
 this.v = 3;
 this.sv = 0;
 this.color = 'grey';
 this.ctx = "";
 this.timer = 0;
 //this.wpn = new weapon();
 this.parent = "";
}
 
slider.prototype.draw = function(){
 var t = this
 t.ctx.save();
 
 t.ctx.fillStyle = t.color;
 t.slide();
 t.fillRect();
 
 t.ctx.restore();
};

slider.prototype.limiter = function(){
 var t = this;
 if(t.vx<-t.x) t.vx = -t.x;
 if((t.x+t.vx+t.w) > 223)
  t.vx-= (t.x+t.vx+t.w)-223;
 
};

slider.prototype.fillRect = function(){
 var t = this;
 
 t.limiter();
 
 t.ctx.fillRect(
  t.x + t.vx
  ,t.y + t.vy
  ,t.w,t.h
 ); 
};

 
slider.prototype.slide = function(){
 var t = this;
 if(t.timer>0){
  if(t.timer<25)
   t.vv = t.vv * 0.9;
  t.vx+= (t.dir)?t.vv:-t.vv;
  t.timer--;
 }
 //t.ctx.fillText(
 // t.timer,t.x,t.y);
};
 
slider.prototype.toLeft = function(){
 var t = this;
 t.vv = t.v;
 t.dir = 0;
 t.timer = 30;
};

slider.prototype.toRight = function(){
 var t = this;
 t.vv = t.v;
 t.dir = 1;
 t.timer = 30;
};
