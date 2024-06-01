
export default class Game {
  init(from, to) {
    const toEl = document.getElementById(to);
    const fromEl = document.getElementById(from);
    toEl.appendChild(fromEl.content.cloneNode(true));
  }
  start() {
    console.debug('start no implemented');
  }

  clearData() {
    console.debug('clearData no implemented');
  }

  markUnmark() {
    console.debug('markUnmark no implemented');
  }
}