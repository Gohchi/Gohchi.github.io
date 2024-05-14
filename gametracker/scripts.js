const defaultClasses = {
  'warrior': 0,
  'valkyrie': 0,
  'magician': 0,
  'witch': 0,
  'clergy': 0,
  'cleric': 0,
  'martial-artist': 0,
  'fight-mistress': 0,
  'ranger': 0,
  'archer': 0,
  'gunner': 0,
  'gunslinger': 0,
  'ninja': 0,
  'kunoichi': 0,
  'samurai': 0,
  'lady-samurai': 0,
  'armor-knight': 0,
  'thief': 0,
  'wiseman': 0,
  'beast-master': 0,
  'brute-warrior': 0,
  'sorcerer': 0,
  'masked-hero': 0,
  'magic-knight': 0,
  'majin': 0,
  'cheerleader': 0,
  'angel': 0,
};

const template = document.getElementById('class');
const items = document.getElementById('items');

update();

function clearData() {
  localStorage.removeItem('classes');
  update();
}
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
  clear();

  let offset = 0;

  const classes = load() ?? {...defaultClasses};

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