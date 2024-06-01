
export default class Game {
  /**
   * Initializes a section.
   * @param {string} from elementId from template element.
   * @param {string} to elementId of the destiny element.
   */
  init(from, to) {
    const toEl = this.get(to);
    const fromEl = this.get(from);
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

  /**
   * Returns a reference to the first object with the specified value of the ID attribute.
   * @param {string} elementId String that specifies the ID value.
   */
  get(elementId) {
    return document.getElementById(elementId);
  }

  set(elementId, eventId, callback) {
    const el = this.get(elementId);
    el[eventId] = callback.bind(this);
  }
}