const DEFAULT_CLASSES = {
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

  'sludge': 0,
  'orc': 0,
  'winged-warrior': 0,
  'shroom': 0,
  'spirit': 0,
  'slumber-cat': 0,
  'prinny': 0,
  'undead': 0,
  'marionette': 0,
  'flora-beast': 0,
  'aqua-demon': 0,
  'roc': 0,
  'death': 0,
  'mystic-beast': 0,
  'holy-dragon': 0,
  'succubus': 0,
  'dragon-zombie': 0,
  'wood-golem': 0,
  'riffle-demon': 0,
  'fire-demon': 0,
  'felynn': 0,
  'dragon': 0,
  'factory-desco': 0,
};

const SUB_CLASSES = {
  'warrior': ['Fighter', 'Warrior', 'Destroyer', 'Gladiator', 'Warlord', 'Battle Master'],
  'valkyrie': ['Lady Fighter', 'Lady Warrior', 'Valkyrie', 'Minerva Lass', 'Freya', 'Iron Maiden'],
  'magician': ['Red Skull', 'Green Skull', 'Blue Skull', 'Star Skull', 'Prism Skull', 'Galaxy Skull'],
  'witch': ['Red Mage', 'Green Mage', 'Blue Mage', 'Star Mage', 'Prism Mage', 'Galaxy Mage'],
  'clergy': ['Heretic', 'Zealot', 'Martyr', 'Pilgrim', 'Farvashi', 'Anti-Messiah'],
  'cleric': ['Healer', 'Acolyte', 'Priest', 'Bishop', 'Cardinal', 'Saint'],
  'martial-artist': ['Fury Fatalist', 'Fight Artist', 'Champ of Fighters', 'Viper Fighter', 'Lethal Combatant', 'Boulevard Fighter'],
  'fight-mistress': ['Wind Spinner', 'Thunder Fist', 'Storm Bringer', 'Sky Faller', 'Star Warrior', 'God Buster'],
  'ranger': ['Ranger', 'Chaser', 'Strider', 'Hawkeye', 'Enforcer', 'Sagittarius'],
  'archer': ['Archer', 'Hunter', 'Shooter', 'Bow Master', 'Cupid', 'Freischutz'],
  'gunner': ['Gunner', 'Sniper', 'Outlaw', 'Hitman', 'Bullseye', 'Desperado'],
  'gunslinger': [],
  'ninja': [],
  'kunoichi': [],
  'samurai': [],
  'lady-samurai': [],
  'armor-knight': [],
  'thief': [],
  'wiseman': [],
  'beast-master': [],
  'brute-warrior': [],
  'sorcerer': [],
  'masked-hero': [],
  'magic-knight': [],
  'majin': [],
  'cheerleader': [],
  'angel': [],

  'sludge': [],
  'orc': [],
  'winged-warrior': [],
  'shroom': [],
  'spirit': [],
  'slumber-cat': [],
  'prinny': [],
  'undead': [],
  'marionette': [],
  'flora-beast': [],
  'aqua-demon': [],
  'roc': [],
  'death': [],
  'mystic-beast': [],
  'holy-dragon': [],
  'succubus': [],
  'dragon-zombie': [],
  'wood-golem': [],
  'riffle-demon': [],
  'fire-demon': [],
  'felynn': [],
  'dragon': [],
  'factory-desco': [],
};

const template = document.getElementById('class');
const items = document.getElementById('items');
const subclass = document.getElementById('subclass');
const markButton = document.getElementById('mark-button');

let selected;

update();

function trackerChanged(e) {
  // console.log(e.target.value);
}

function clearData() {
  if (confirm('Are you sure?')) {
    localStorage.removeItem('D3-classes');
    localStorage.removeItem('classes'); // legacy
    update();
  }
}
function save(classes) {
  localStorage.setItem('D3-classes', JSON.stringify(classes));
}

function load() {
  const data = localStorage.getItem('classes') // legacy
               ?? localStorage.getItem('D3-classes');

  if (data) {
    return JSON.parse(data);
  }

  return {};
}

function clear() {
  items.innerHTML = '';
}

function update() {
  clear();

  let offset = 0;

  const classes = { ...DEFAULT_CLASSES, ...load() };

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
    items.appendChild(clon);

    offset++;
  }
}

function change() {
  localStorage.setItem('classes', classes);
}

function markUnmark() {
  if (!selected) return;

  const classes = { ...DEFAULT_CLASSES, ...load() };

  const { className, level } = selected;
  if (classes[className] >= level + 1) { 
    markButton.innerText = 'Mark';
    classes[className] = level;
  } else {
    markButton.innerText = 'Unmark';
    classes[className] = level + 1;
  }
  save(classes);
  update();
}