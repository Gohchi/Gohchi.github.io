import Game from '../game/main.js';

import { DEFAULT_CLASSES, SUB_CLASSES } from './data.js';


let selected;

export default class Disgaea3 extends Game {
  start() {
    this.init('disgaea-3-body', 'game-body');
    this.init('disgaea-3-actions', 'game-actions');
    
    const actions = document.getElementById('game-actions');
    actions.classList.add('disgaea-3');
    
    this.update();
  }
  
  clearData() {
    if (confirm('Are you sure?')) {
      localStorage.removeItem('D3-classes');
      localStorage.removeItem('classes'); // legacy
      this.update();
    }
  }

  markUnmark() {
    if (!selected) return;
    const markButton = document.getElementById('mark-button');

    const classes = { ...DEFAULT_CLASSES, ...this.load() };

    const { className, level } = selected;
    if (classes[className] >= level + 1) { 
      markButton.innerText = 'Mark';
      classes[className] = level;
    } else {
      markButton.innerText = 'Unmark';
      classes[className] = level + 1;
    }
    this.save(classes);
    this.update();
  }

  save(classes) {
    localStorage.setItem('D3-classes', JSON.stringify(classes));
  }

  load() {
    const data = localStorage.getItem('classes') // legacy
                ?? localStorage.getItem('D3-classes');

    if (data) {
      const parsed = JSON.parse(data);

      const classes = Object.keys(DEFAULT_CLASSES);
      const filtered = Object.entries(parsed)
        .filter(([key]) => classes.includes(key))
        .reduce((res, [key, value]) => {
          res[key] = value;
          return res;
        }, {});

      return filtered;
    }

    return {};
  }

  clear() {
    const items = document.getElementById('items');
    items.innerHTML = '';
  }

  update() {
    this.clear();

    let offset = 0;

    const template = document.getElementById('disgaea-3-class');
    const subclass = document.getElementById('subclass');
    const markButton = document.getElementById('mark-button');

    const classes = { ...DEFAULT_CLASSES, ...this.load() };

    for (const cls of Object.entries(classes)) {
      const [CLASS_NAME, unlocked] = cls;

      const clon = template.content.cloneNode(true);
      const item = clon.children[0];
      item.classList.add(CLASS_NAME);
      item.classList.add('offset'+(offset%3));
      
      for (let i = 0; i < 6; i++) {
        const subitem = item.children[i];
        subitem.onclick = () => {
          selected = {
            className: CLASS_NAME,
            level: i,
          };
          subclass.innerText = SUB_CLASSES[CLASS_NAME][i];

          markButton.innerText = subitem.classList.contains('unlocked') ? 'Unmark' : 'Mark';
        };
        
        if (i < unlocked) {
          subitem.classList.add('unlocked');
        }
      }
  
      const items = document.getElementById('items');
      items.appendChild(clon);

      offset++;
    }
  }

  change() {
    localStorage.setItem('classes', classes);
  }
}