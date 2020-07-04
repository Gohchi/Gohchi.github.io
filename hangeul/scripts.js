document.addEventListener("keydown", keyDownTextField, false);

const numbersA = [
  '',
  '하나',
  '둘',
  '셋',
  '넷',
  '다섯',
  '여섯',
  '일곱',
  '여덟',
  '아홉',
  '열',
  '열한',
  '열두',
];
const numbersB = {
  '1': '일',
  '2': '이',
  '3': '삼',
  '4': '사',
  '5': '오',
  '6': '육',
  '7': '칠',
  '8': '팔',
  '9': '구',
  '10': '십',
  '100': '백',
  '1000': '천',
};

let voices;
setTimeout(() => {
  loadVoices();
}, 100);
function loadVoices(){
  console.log('Loading voices...');
  voices = speechSynthesis.getVoices().filter(o => o.lang === 'ko-KR');
  if(!voices.length) {
    console.log('Loading voices... fail. Retry');
    setTimeout(() => {
      loadVoices();
    }, 100);
  }
}

// tools --------------------------------------------------------------------------------

function get(id){
  if(isMobile()) id = 'mobile-' + id;
  return document.getElementById(id);
}

function set(id, value){
  document.getElementById(id).innerText = value;
}

function isEmpty(id){
  return !document.getElementById(id).innerText;
}

const groups = {
  "0": { from: 1000, to: 9999 },
  "1": { from: 300, to: 999 },
  "2": { from: 100, to: 299 },
  "3": { from: 1, to: 99 },
}

function randNum(){
  if(getNumberType() == 'A')
    return Math.floor(Math.random() * 12) + 1;

  const p = Math.random();
  const i = p < 0.1 ? 0 : p < 0.3 ? 1 : p < 0.6 ? 2 : 3;
  const group = groups[i];
  return Math.floor(Math.random() * (group.to - group.from)) + group.from;
}

function say( text ){
  let msg = new SpeechSynthesisUtterance( text );
  msg.lang = 'ko-KR';
  msg.voice = voices[get('voice').value];
  msg.rate = parseFloat(get('rate').value);
  window.speechSynthesis.speak( msg );
}

function isMobile(){
  return window.innerWidth <= 900;
}

function getNumberType(){
  return get('number-type').value == "0" ? 'A' : 'B';
}

function numberToText(num){
  if(getNumberType() == 'A')
    return numbersA[num];

  const textNumber = num.toString().split('');
  let name = [];
  for(let i = textNumber.length - 1; i >= 0; i--){
    const n = textNumber[i];
    if(i < textNumber.length - 1){
      name.unshift(numbersB['1' + '0'.repeat(textNumber.length - 1 - i)]);
      if(n != '0' && n != '1'){
        name.unshift(numbersB[n]);
      }
    } else { // is the first one
      if(n != '0'){
        name.push(numbersB[n]);
      }
    }
  }
  return name.join('');
}


function getNumberAsHangeul(){
  let num = parseInt(document.getElementById('number').innerText);

  return numberToText(num);
}

function keyDownTextField(e) {
  if(e.keyCode==13) {
    getRandomNumber()
  } else if (e.keyCode == 83) {
    showDetails();
  } else if (e.keyCode == 68) {
    sayMyName();
  } else {
    // console.log(e.keyCode);
  }
}

function hide( el ){
  el.classList.add("hidden");
}

function show( el ){
  if(typeof el === 'string'){
    el = get(el);
  }
  el.classList.remove("hidden");
}

function toggle( el ){
  if(typeof el === 'string'){
    el = get(el);
  }
  
  if(el.classList.contains("hidden")){
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}
// bottom actions --------------------------------------------------------------------------------

function showMore(){
  const menu = get('more-options');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

function sayMyName(){
  let num = parseInt(document.getElementById('number').innerText);

  say(numberToText(num));
}

function showDetails(){
  let hangeul = getNumberAsHangeul();
  set('hangeul', hangeul || '');
}

function getRandomNumber(){
  set('number', randNum());
  set('hangeul', '');
  get('hangeulSyllables').textContent = '';
}

// more actions --------------------------------------------------------------------------------

function toggleSyllables(){
  console.log('toggleSyllables');
  let container = get('hangeulSyllables');
  container.textContent = '';
  getNumberAsHangeul().split('').forEach(syllable => {
    let child = document.createElement('button');
    child.innerText = syllable;
    child.onclick = () => say(syllable);
    container.appendChild(child);
  })
}