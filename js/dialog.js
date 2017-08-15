//Dialog.js
function Dialog(x,y,w){
	this.x = (x) ? x : 0; 
	this.y = (y) ? y : 0;
	this.w = (w) ? w : 200;
	var aList = [];
	this.list = aList;
	this.selected = false;
	this.page = [];
	this.face = [];
	this.spacing = 12;
	this.option = 0;
	this.rows = 3;
	this.from = 0;
	this.ctx = "";
	this.parent = "";
	this.dir = 0;
	this.color = '#B96';
	
	this.r = 11;
	this.g = 9;
	this.b = 6;
	
	this.mode = 1;
	this.cursor = 1;
};

Dialog.prototype.add = function(str){
  var i = this.page.length;
  this.page[i] = str;
};

Dialog.prototype.drawbg = function(ctx){
  
 ctx.fillStyle = this.color;
 ctx.fillRect(
  this.x-this.spacing/3
 ,this.y-this.spacing*1.2
 ,this.w
 ,this.spacing*this.rows+this.spacing/1.2
 );
 
 ctx.fillStyle = 'black';
 
 // border
 this.drawBorder(ctx, '#753', 0);
 
 this.drawBorder(ctx, '#420', 1);
 
 this.drawBorder(ctx, '#975', 2); 
};

Dialog.prototype.drawBorder = function(ctx, color, a){
 
 ctx.strokeStyle = color; 
 ctx.strokeRect( 
  a+this.x-this.spacing/3
 ,a+this.y-this.spacing*1.2
 ,this.w-a*2
 ,(this.spacing*this.rows+this.spacing/1.2)-a*2
 ); 
};
 
Dialog.prototype.drawtxt = function(ctx){
 //alert( this.page[0].length  + ' - ' + this.w/10);
 
 ctx.fillText(
 this.page[0]
 ,this.x+this.spacing/3
 ,this.y
 ); 
};

Dialog.prototype.draw = function(context){
 if(context){
  var ctx = context;
 }else{
  var ctx = this.ctx;
 }
 
 //if(!this.rows) this.rows = this.item.length;
 // background
 this.drawbg(ctx);
 
 this.drawtxt(ctx);
}
