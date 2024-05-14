let defaultClasses = {
  'warrior': 3,
  'valkyrie': 4,
  'magician': 1,
  'witch': 1,
  'clergy': 1,
  'cleric': 1,
  'martial-artist': 1,
  'fight-mistress': 1,
  'ranger': 1,
  'archer': 1,
  'gunner': 1,
  'gunslinger': 1,
  'ninja': 1,
  'kunoichi': 1,
  'samurai': 1,
  'samurai-girl': 0,
  'armor-knight': 1,
  'thief': 1,
  'wiseman': 1,
  'beast-master': 1,
  'unknown01': 0,
  'sorcerer': 1,
  'unknown02': 0,
  'magic-knight': 1,
  'unknown03': 0,
  'cheerleader': 1,
  'angel': 0,
};

const template = document.getElementById('class');
const items = document.getElementById('items');

update();

function save(classes) {
  localStorage.setItem('classes', JSON.stringify(classes));
}

function load() {
  const data = localStorage.getItem('classes');

  if (data) {
    return JSON.parse(data);
  }
}

function clear() {
  items.innerHTML = '';
}

function update() {

  let offset = 0;

  const classes = load() ?? defaultClasses;

  for (const cls of Object.entries(classes)) {
    const [className, unlocked] = cls;

    const clon = template.content.cloneNode(true);
    const item = clon.children[0];
    item.classList.add(className);
    item.classList.add('offset'+(offset%3));
    
    for (let i = 0; i < 5; i++) {
      const subitem = item.children[i];
      subitem.onclick = () => {
        if (classes[className] >= i + 1) { 
          classes[className] = i;
        } else {
          classes[className] = i + 1;
        }
        save(classes);
        clear();
        update();
      };
      
      if (i < unlocked) {
        subitem.classList.add('unlocked');
      }
    }
    items.appendChild(clon);

    offset++;
  }
}

function change() {
  localStorage.setItem('classes', classes);
}