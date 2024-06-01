import Game from '../game/main.js';
import { BASE_CHARACTER, CHARACTER_CLASSES, CHARACTER_PORTRAITS, CHARACTER_SPRITES } from './data.js';

export default class DisgaeaDS extends Game {
  start() {
    this.init('disgaea-ds-body', 'game-body');

    const actions = this.get('game-actions');
    actions.classList.add('disgaea-ds');

    const info = [
      [CHARACTER_SPRITES, 'sprite'],
      [CHARACTER_CLASSES, 'classes'],
      [CHARACTER_PORTRAITS, 'portraits'],
    ];

    for (const [data, id] of info) {
      this.setSelect(data, id);
      this.set(id, 'onchange', this.update);
    }

    this.update();
  }

  update() {
    const spriteId = this.get('sprite').value;
    const classId = this.get('classes').value;
    const portraitId = this.get('portraits').value;

    const codeEl = this.get('code');
    codeEl.innerHTML = `${BASE_CHARACTER.Sprite}${spriteId}\n`
      + `${BASE_CHARACTER.Class}${classId}\n`
      + `${BASE_CHARACTER.Portrait}${portraitId}`;
  }
};