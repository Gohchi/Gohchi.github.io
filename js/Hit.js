// hit.js
function hit(){
 this.x = [];
 this.y = [];
 this.w = 3;
 this.h = 3;
 this.m = 0.9;
 this.Mv = 3;
 this.v = [];
 this.critical = [];
 
 this.xv = [];
 this.yv = []; 
 this.value = [];
 this.ctx = "";
 this.alpha = [];
 
 this.Mtimer = 70;
 this.timer = []; 
}

hit.prototype.draw = function(){
 if(this.value.length>0){
 
 var conReinit = 0;
 
 this.ctx.save();
 
 this.ctx.strokeStyle = '#666';

/* this.ctx.fillText(
  this.value.length, 100, 20
 )*/
 
 for(var i=0;i<this.value.length;i++){
  /*this.ctx.fillText(
   i, 15*i, 30
  );
  this.ctx.fillText(
   this.value[i], 15*i, 45
  ); */
 //--------------------------
  if(this.timer[i]!=0){
 
 //if(this.tmr<80)
  this.alpha[i]-=0.015;

  if(this.alpha[i]<0) 
   this.alpha[i]=0;
  if(this.timer[i]<70){
   this.v[i] = this.v[i]*this.m;
  }
  this.yv[i]-= this.v[i];
 
  this.ctx.globalAlpha = this.alpha[i];
 
  if(this.critical[i]){
   this.ctx.fillStyle = '#F00';
 //  this.xv[i] = -3;
   this.ctx.font = 'bold 24px Comic Sans MS'; 
  }else{ 
   this.ctx.fillStyle = '#000';
 
   this.ctx.font = 'bold 18px Comic Sans MS';
  }

  this.ctx.fillText(
   this.value[i] 
   ,this.x[i] + this.xv[i] -
    (this.ctx.measureText(
     this.value[i]
    ).width/2)
   ,this.y[i] + this.yv[i] 
  );
  this.ctx.strokeText(
   this.value[i] 
   ,this.x[i] + this.xv[i] -
    (this.ctx.measureText(
     this.value[i]
    ).width/2) 
   ,this.y[i] + this.yv[i] 
  );

/*  investigar in this.value
this.ctx.fillText(
   i + ' - ' + this.value[i] + ' x:' + this.x[i] + ' y:' + this.y[i]
   ,10
   ,20
  ); */
  this.ctx.fillStyle = '#FFF';
 
  this.timer[i]--; 
  }else{
   conReinit++;
  }
 } 
 //this.ctx.fillText('/'+conReinit,120,20);
 if(conReinit==this.value.length)
  this.reinit();
  //this.ctx.fillText('reinit',40,100); 
 
 this.ctx.restore();
 
 }
};

hit.prototype.add = function(
 value, x, y, critical
){
 //if(value<10)value='miss';
 var i = this.value.length;
 this.value[i] = value;
 this.x[i] = x;
 this.y[i] = y;
 
 this.xv[i] = 0; 
 this.yv[i] = 0; 
 this.alpha[i] = 1;
 this.v[i] = this.Mv;
 
 if(!critical){
  this.timer[i] = this.Mtimer; 
 }else{
  this.critical[i] = critical;
  this.timer[i] = this.Mtimer * 1.1; 
 }
};

 
hit.prototype.reinit = function(
){
 this.value = [];
 this.x = [];
 this.y = [];
 this.v = [];
 this.critical = [];
 this.xv = [];
 this.yv = []; 
 this.alpha = [];
 this.timer = []; 
};