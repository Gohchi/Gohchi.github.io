const resultado = check();
if (resultado) {
  const gameEl = document.getElementById('game');

  gameEl.classList.remove('hidden');
  
  const menuEl = document.getElementById('menu');

  menuEl.classList.add('hidden');

  startGame();
}




function startGame() {
  const urlParams = new URLSearchParams(location.search);

  const heroEl = document.getElementById('hero');
  heroEl.style.backgroundColor = urlParams.get('color');

  const heroNameEl = document.getElementById('hero-name');
  heroNameEl.innerText = urlParams.get('name');
}

function registerGame() {
  const nameElement = document.getElementById('name');
  const colorElement = document.getElementById('color');

  // console.log('game started!');
  // console.log('name:', nameElement.value);
  // console.log('color:', color.value);

  const urlParams = new URLSearchParams(location.search);

  urlParams.set('name', nameElement.value);
  urlParams.set('color', colorElement.value);
  
  location.search = urlParams;
}

function check() {
  const urlParams = new URLSearchParams(location.search);

  const name = urlParams.get('name');
  const color = urlParams.get('color');

  return !!name && !!color;
}
