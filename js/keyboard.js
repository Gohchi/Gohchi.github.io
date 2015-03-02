// keyboardConfig

 function getAltChar(code){
 switch(code){
  case 65: code = 42; 
  break; // * 
  case 66: code = 63; // ?
   break; 
  case 67: code = 57; // 9
   break; 
  case 68: code = 53; // 5
   break;
  case 69: code = 50; // 2
   break; 
  case 70: code = 54; // 6
   break;
  case 71: code = 37; // %
   break;
  case 72: code = 36; // $
   break; 
  case 73: code = 45; // -
   break; 
  case 74: code = 38; // &
   break; 
  case 75: code = 39; // '
   break;
  case 76: code = 34; 
  break; // " 
  case 77: code = 58; // :
   break; 
  case 78: code = 33; 
  break; // ! 
  case 79: code = 43; // +
  break;  
  case 80: code = 61; // =
   break;
  case 81: code = 35; // #
   break; 
  case 82: code = 51; // 3
   break; 
  case 83: code = 52; // 4
   break; 
  case 84: code = 40; // (
   break; 
  case 85: code = 95; // _
   break; 
  case 86: code = 47; // /
   break; 
  case 87: code = 49; // 1
   break; 
  case 88: code = 56; // 8
   break; 
  case 89: code = 41; // )
   break; 
  case 90: code = 55; // 7
   break; 
  case 188: code = 59; // ;
  // code = 44; // , 
  break;
  case 190: code = 46; // .
  break;
  default:
   code = code;
 }
 //alert(Int.fromCharCode('*'));
 return String.fromCharCode(code);
}
