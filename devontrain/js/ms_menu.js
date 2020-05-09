// MS_Menu.js
function MS_Menu(ctx){
 this.x = 0;
 this.y = 0;
 this.w = 50;
 this.h = 80;
 this.ctx = (ctx) ? ctx:"";
 this.mode = 1;
 this.v = 0;
 this.min = 12;
 this.sec = 56;
};

MS_Menu.prototype.draw = function(){
 if(this.ctx != ""){
  var x = this.x;
  var y = this.y;
  var w = this.w;
  var h = this.h;
 
 // BORDER 
  
 // this.ctx.fillRect(100,50,50,50);
  
  var gr = this.ctx.createLinearGradient(
   x+(w/2),y,x+(w/2),y+h
  );
  gr.addColorStop(0,"#999");
  gr.addColorStop(0.2,"black"); 
  gr.addColorStop(0.95,"black");
  gr.addColorStop(1,"grey");
 
  this.ctx.fillStyle = gr;
  
  this.ctx.globalAlpha = 0.3; 
  this.ctx.roundedFillRect(
   x,y, w,h, 12); 
   
  // Title
  this.ctx.fillStyle = 'white';
  this.ctx.strokeStyle = 'black';
 // this.font = 'bold 20px';
  this.ctx.globalAlpha = 1; 
 
 

  var Title = 'Time:';
  this.ctx.strokeText(Title,
   this.x+5, this.y+15);
 
  this.ctx.fillText(Title,
   this.x+5, this.y+15);
      
  // Center box
  var xcb = x+w-110;
  var ycb = y+4;
  var wcb = 106;//w-14;
  var hcb = h-9;
  gr = this.ctx.createLinearGradient(
   xcb+(wcb*0.4) ,ycb,
   xcb+(wcb*0.6), ycb+hcb
  );
  gr.addColorStop(0,"black");
//gr.addColorStop(0.1,"black"); 
  gr.addColorStop(1,"grey");
 
  this.ctx.globalAlpha = 0.5; 
  this.ctx.fillStyle = '#222';
  
  this.ctx.roundedFillRect(
   xcb ,ycb, wcb, hcb, 12); 
 
  this.ctx.strokeStyle = gr;//'#222';
  
  this.ctx.roundedStrokeRect(
   xcb ,ycb, wcb, hcb, 12); 
   
  this.ctx.globalAlpha = 1;
   
  this.ctx.strokeStyle = '#999';
  this.ctx.roundedStrokeRect(
   x,y, w,h, 12); 
   /*
  this.ctx.strokeRect(
   x+(w/2),y,5,5); 
  this.ctx.strokeRect(
   x+(w/2),y+h ,5,5); */
  
  this.drawNumbers();
  }
};

 
MS_Menu.prototype.moveTo = function(x,y){
 this.x = x; this.y = y;
};
 
MS_Menu.prototype.resize = function(w,h){
 this.w = w; this.h = h;
};

MS_Menu.prototype.drawNumbers = function(){
 var x = this.x+45;
 var y = this.y+11; 
 
 var gr = this.ctx.createLinearGradient(
   x, y, x, y+30
  );
  gr.addColorStop(0,"white");
  gr.addColorStop(0.3,"yellow");
 
 this.ctx.fillStyle = gr;
 
 switch(this.mode){
  case 0:
 this.dNumber(this.v, x, y);
  break;
  case 1:
 this.dNumber(
  parseInt(this.min/10)
  , x, y);
 
 x+=25;
 this.dNumber(
  this.min-( 
   parseInt(this.min/10)*10)
  , x, y);
 
 this.ctx.fillRect(
  x+23, y+8, 4, 4);
 
 this.ctx.fillRect(
  x+23, y+22, 4, 4);
  
 x+=30;
 this.dNumber(
  parseInt(this.sec/10)
  , x, y); 

 x+=25;
 this.dNumber(
  this.sec-( 
   parseInt(this.sec/10)*10)
  , x, y);
  break;
 }
};

MS_Menu.prototype.dNumber = function(e, x, y){
 if(this.ledOn(1, e)){
  this.dline(1, x, y);
 }
 
 if(this.ledOn(2, e)){
  this.dline(4, x, y);
 } 
 
 x+=20; 
 
 if(this.ledOn(3, e)){
  this.dline(2, x, y);
 }  
 y+=17; x-=20;
 
 if(this.ledOn(4, e)){
  this.dline(5, x, y);
 } 
 if(this.ledOn(8, e)){
  this.dline(6, x, y);
 } 
 if(this.ledOn(9, e)){
  this.dline(7, x, y);
 } 
 if(this.ledOn(10, e)){
  this.dline(8, x, y);
 } 
 if(this.ledOn(11, e)){
  this.dline(9, x, y);
 } 
 
 y-=2;
 
 if(this.ledOn(5, e)){
  this.dline(4, x, y);
 } 
 
 x+=20; 
 
 if(this.ledOn(6, e)){
  this.dline(2, x, y);
 } 
 
 y+=20; x-=20;
 
 if(this.ledOn(7, e)){
  this.dline(3, x, y);
 } 
}; 
 
MS_Menu.prototype.ledOn = function(l, e){
 switch(l){
  case 1:
   if(e!=1 && e!=4 ) 
    return true;
  break; 
  case 2:
   if(e!=1&&e!=2&&e!=3&&e!=7)
    return true; 
  break; 
  case 3: 
   if( e!=5 && e!=6 ) 
    return true; 
  break; 
  case 4: 
   if(e==3 || e==8 ) 
    return true; 
  break; 
  case 5: 
   if(e==0||e==2||e==6||e==8)
    return true; 
  break; 
  case 6: 
   if( e!=2 ) return true;
  break; 
  case 7: 
   if( e!=1&&e!=4&&e!=7)
    return true; 
  break; 
  case 8: 
   if( e==4 || e==9) 
    return true; 
  break; 
  case 9: 
   if( e==2 ) return true; 
  break; 
  case 10: 
   if( e==6 ) return true; 
  break; 
  case 11: 
   if( e==5 ) return true; 
  break; 
 }
 return false;
};

MS_Menu.prototype.dline = function(e, x, y){
 switch(e){
  case 1:
 this.ctx.beginPath();  
 this.ctx.moveTo(x+2,y);
 this.ctx.lineTo(x+18,y); 
 this.ctx.lineTo(x+13,y+5); 
 this.ctx.lineTo(x+7,y+5); 
 this.ctx.closePath();
 this.ctx.fill();
  break;
  case 2:
 this.ctx.beginPath();  
 this.ctx.moveTo(x,y+2);
 this.ctx.lineTo(x,y+18); 
 this.ctx.lineTo(x-5,y+13); 
 this.ctx.lineTo(x-5,y+7); 
 this.ctx.closePath();
 this.ctx.fill();
  break; 
  case 3:
 this.ctx.beginPath();  
 this.ctx.moveTo(x+2,y);
 this.ctx.lineTo(x+18,y); 
 this.ctx.lineTo(x+13,y-5); 
 this.ctx.lineTo(x+7,y-5); 
 this.ctx.closePath();
 this.ctx.fill();
  break; 
  case 4:
 this.ctx.beginPath();  
 this.ctx.moveTo(x,y+2);
 this.ctx.lineTo(x,y+18); 
 this.ctx.lineTo(x+5,y+13); 
 this.ctx.lineTo(x+5,y+7); 
 this.ctx.closePath();
 this.ctx.fill();
  break; 
  case 5:
 this.ctx.beginPath();  
 this.ctx.moveTo(x+2,y);
 this.ctx.lineTo(x+7,y-3); 
 this.ctx.lineTo(x+13,y-3); 
 this.ctx.lineTo(x+18,y); 
 this.ctx.lineTo(x+13,y+3); 
 this.ctx.lineTo(x+7,y+3);
 this.ctx.closePath();
 this.ctx.fill();
  break; 
  case 6:
 this.ctx.beginPath();  
 this.ctx.moveTo(x+1,y+3);
 this.ctx.lineTo(x+7,y-3); 
 this.ctx.lineTo(x+13,y-3); 
 this.ctx.lineTo(x+18,y); 
 this.ctx.lineTo(x+13,y+3); 
 this.ctx.closePath();
 this.ctx.fill();
  break; 
  case 7:
 this.ctx.beginPath();  
 this.ctx.moveTo(x+1,y-3);
 this.ctx.lineTo(x+7,y-3); 
 this.ctx.lineTo(x+13,y-3); 
 this.ctx.lineTo(x+18,y+3); 
 this.ctx.lineTo(x+7,y+3); 
 this.ctx.closePath();
 this.ctx.fill();
  break; 
  case 8:
 this.ctx.beginPath();  
 this.ctx.moveTo(x+2,y);
 this.ctx.lineTo(x+7,y-3); 
 this.ctx.lineTo(x+19,y-3); 
 this.ctx.lineTo(x+13,y+3); 
 this.ctx.lineTo(x+7,y+3);
 this.ctx.closePath();
 this.ctx.fill();
  break; 
  case 9:
 this.ctx.beginPath();  
 this.ctx.moveTo(x+1,y+3);
 this.ctx.lineTo(x+7,y-3); 
 this.ctx.lineTo(x+19,y-3); 
 this.ctx.lineTo(x+13,y+3); 
 this.ctx.closePath();
 this.ctx.fill();
  break; 
 } 
};
