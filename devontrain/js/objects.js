// Objects
function Chara(){
 this.firstName = "";
 this.lastName = "";
 this.id = 5566;
 this.x = 10;		// x axis
 this.y = 10;		// y axis
 this.w = 50;		// width
 this.h = 50;		// height
 this.v = 3;  		// velocity
 this.d = 1; 	 	// direction
 this.a = 1;		// animation
 this.color = 'black';
 this.ctx = "";
 this.Sprite = new CharaSprite();
  this.Sprite.base = this;
 		//,i : {}  // image 
 var BStat = [];
 	// Status
  BStat.hp = 1;
  BStat.sp = 1;
  BStat.atk = 1;
  BStat.def = 1;
  BStat.int = 1;
  BStat.spd = 1;
  BStat.hit = 1;
  BStat.res = 1;
  
 var AStat = [];
 	// Status
  AStat.hp = 1;
  AStat.sp = 1;
  AStat.atk = 1;
  AStat.def = 1;
  AStat.int = 1;
  AStat.spd = 1;
  AStat.hit = 1;
  AStat.res = 1; 

 var CStat = [];
 	// Status
  CStat.chp = 1;
  CStat.csp = 1;
  CStat.hp = 1;
  CStat.sp = 1;
  CStat.atk = 1;
  CStat.def = 1;
  CStat.int = 1;
  CStat.spd = 1;
  CStat.hit = 1;
  CStat.res = 1; 
  
 this.BaseStat = BStat;
 this.AptStat = AStat;
 this.CurStat = CStat;
 this.level = 100;
 this.State = 1;
 // 0 death, 1 normal, 2 poison, 3 paralize, 4 confusion, 5 blind, 6 slow, 7 anger.
 
 // properties used on hit
 var hit = [];
  hit.time = 0;
  hit.crit = false;
  hit.dmg = 0; 
  
 this.hit = hit;
}
 
//--------------------------- 
// getLevel - GLVL01
//--------------------------- 
Chara.prototype.getLevel =
function(){
 return this.level;
};
 
//--------------------------- 
// levelUp - LVLUP01
//--------------------------- 
Chara.prototype.levelUp =
function(){
 this.level++;
};  
 
//--------------------------- 
// initBaseStat
//--------------------------- 
Chara.prototype.initBaseStat =
function(hp, sp, atk, def, int, spd, hit, res){ 
 this.BaseStat.hp = hp; 
 this.BaseStat.sp = sp;
 this.BaseStat.atk = atk;
 this.BaseStat.def = def; 
 this.BaseStat.int = int; 
 this.BaseStat.spd = spd; 
 this.BaseStat.hit = hit; 
 this.BaseStat.res = res;
}; 
 
//--------------------------- 
// initAptStat - IASTAT01
//--------------------------- 
Chara.prototype.initAptStat =
function(hp, sp, atk, def, int, spd, hit, res){
 this.AptStat.hp = hp; 
 this.AptStat.sp = sp;
 this.AptStat.atk = atk;
 this.AptStat.def = def; 
 this.AptStat.int = int; 
 this.AptStat.spd = spd; 
 this.AptStat.hit = hit; 
 this.AptStat.res = res;
}; 
 
//--------------------------- 
// updateStat - USTAT01
//--------------------------- 
Chara.prototype.updateStat =
function(){ 
 this.CurStat.hp = (this.BaseStat.hp + (0 * (this.AptStat.hp/100))) * this.level;
 
 this.CurStat.sp = (this.BaseStat.sp + (0 * (this.AptStat.sp/100))
 ) * this.level;
 
 this.CurStat.atk = (this.BaseStat.atk + (0 * (this.AptStat.atk/100))
 ) * this.level;
 
 this.CurStat.def = (this.BaseStat.def + (0 * (this.AptStat.def/100))
 ) * this.level;
 
 this.CurStat.int = (this.BaseStat.int + (0 * (this.AptStat.int/100)) 
 ) * this.level;
 
 this.CurStat.spd = (this.BaseStat.spd + (0 * (this.AptStat.spd/100))
 ) * this.level;
  
 this.CurStat.hit = (this.BaseStat.hit + (0 * (this.AptStat.hit/100))
 ) * this.level;
  
 this.CurStat.res = (this.BaseStat.res + (0 * (this.AptStat.res/100))
 ) * this.level; 
}; 

//--------------------------- 
// getStat - GSTAT01
//--------------------------- 
Chara.prototype.getStat =
function(Stat){
 switch(Stat){
 case 'chp': return this.CurStat.chp; break;
 case 'hp': return this.CurStat.hp; break;
 case 'csp': return this.CurStat.csp; break; 
 case 'sp': return this.CurStat.sp; break; 
 case 'atk': return this.CurStat.atk; break;
 case 'def': return this.CurStat.def; break;
 case 'int': return this.CurStat.int; break;
 case 'spd': return this.CurStat.spd; break;
 case 'hit': return this.CurStat.hit; break;
 case 'res': return this.CurStat.res; break;
 default: return 'not defined';
 }
};

//--------------------------- 
// getDamange - GDMG01
//--------------------------- 
Chara.prototype.getDamange =
function(dmg){
 this.CurStat.chp -= Math.round(dmg);
 if (this.CurStat.chp<0) this.CurStat.chp = 0; 
 if (this.CurStat.chp==0) this.State = 0; // death
};

 
//--------------------------- 
// attack - ATK01
//--------------------------- 
Chara.prototype.attack =
function(foe){
 if (this.State == 0) {
  return {
   damange:0
   ,critical:false
  };
 }
 var debug = false;
 var hit = this.CurStat.hit;
 var spd = foe.CurStat.spd;
 
 var rate = Math.round(hit*0.75/spd*100);
 if(debug) alert('Hit Rate: ' + rate + '%');
 
 var hitMsj = 'Miss';
 var hitValue = getRandomInt(1,100);
 
 if (hitValue <= rate) hitMsj = 'Hit!';
 if(debug) alert('Value: ' + hitValue + '\n' + hitMsj);
  
  if (hitValue <= rate) {
   var atk = this.CurStat.atk;
   var def = foe.CurStat.def;
   var dmg = Math.round(atk/2/def*atk);
   
   var rndm = getRandomInt(-20, 20) / 100;
   dmg = dmg + (dmg * rndm);
   
   // Critical
   var critRate = Math.round(rate / 10);
   
   critRate = (critRate<=30) ? critRate : 30;
    
   if(debug) alert('Critical Rate: ' + critRate + '%'); 
   
   var critHitValue = getRandomInt(1,100); 
   
   if (critHitValue<=critRate){
    dmg = dmg * 2;
    if(debug) alert('Damange!!! ' + dmg);
   }else{
    if(debug) alert('Damange: ' + dmg);
   }
   foe.getDamange(dmg);
   
  }else{
  	var dmg = 'miss';
  }// temp
   
   return {
    damange:dmg,
    critical:(critHitValue<=critRate)
   }; 
};

//--------------------------- 
// draw - DRW01
//--------------------------- 
Chara.prototype.draw =
function(context){
 if(context){
  var ctx = context;
 }else{
  var ctx = this.ctx;
 } 
 
 this.drawChara();
 
 ctx.strokeStyle = this.color; 
 if(this.CurStat.chp == 0){
 ctx.fillRect(this.x, this.y, this.w, this.h); 
 }else{ 
 ctx.strokeRect(this.x, this.y, this.w, this.h);
 }
}

 
Chara.prototype.drawChara =
function(context){
 if(context){
  var ctx = context;
 }else{
  var ctx = this.ctx;
 } 
 var x = this.x+(this.w/2);
 var y = this.y+this.h;
/* ctx.fillText(
  isNaN(this.hit.dmg) 
  ,x,y+70);*/
 this.Sprite.draw(ctx,x,y);
};

Chara.prototype.hitted = function(damange,critical){
 var hit = this.hit;
 if( !isNaN(damange) ){ 
  hit.time = 30;
  hit.dmg = damange;
  hit.crit = critical;
 }
};

Chara.prototype.moveTo =
function(x, y){
	this.x = x;
	this.y = y;
}
 
Chara.prototype.setColor =
function(c){
	this.color = c;
}
 
Chara.prototype.move =
function(dir, ctx){
 switch(dir){
  case 69:
   this.y -= this.v; break;
  case 88:
   this.y += this.v; break;
  case 70:
   this.x += this.v; break;
  case 83:
   this.x -= this.v; break;
 }
 ctx.strokeRect(this.x, this.y, 20, 20); 
// alert(dir);
}; 

function HealHp(obj, q){
  if(obj.State == 0) return;
  if (q == -1) obj.CurStat.chp = obj.CurStat.hp; return;
  obj.CurStat.chp += q;
  obj.CurStat.chp = (obj.CurStat.chp>obj.CurStat.hp) ? obj.CurStat.hp : obj.CurStat.chp;
}
function HealSp(obj, q){
  if(obj.State == 0) return; 
  if (q == -1) obj.CurStat.csp = obj.CurStat.sp; return;
  obj.CurStat.csp += q;
  obj.CurStat.csp = (obj.CurStat.csp>obj.CurStat.sp) ? obj.CurStat.sp : obj.CurStat.csp;
}
   // define the Person Class
function Person() {}

Person.prototype.walk = function(){
  alert ('I am walking!');
};
Person.prototype.sayHello = function(){
  alert ('hello');
};

// define the Student class
function Student() {
  // Call the parent constructor
  Person.call(this);
};

// inherit Person
Student.prototype = new Person();

// correct the constructor pointer because it points to Person
Student.prototype.constructor = Student;
 
// replace the sayHello method
Student.prototype.sayHello = function(){
  alert('hi, I am a student');
};

// add sayGoodBye method
Student.prototype.sayGoodBye = function(){
  alert('goodBye');
};

// var Hero = {
//    
// 		//e.:IMG = {}
// 		//   IMG[1] = Image.load("Image/image.png", RAM)
// 		,DrawOn : "up" // screen
	
// 		// var Area = {}
// 		// 	Area.x1 = ,x + 10
// 		// 	Area.y1 = ,x + 10
// 		// 	Area.x2 = ,x+,w - 10
// 		// 	Area.y2 = ,y+,h - 10
// 		// 	,ContactArea = Area 
	

// };



 function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
