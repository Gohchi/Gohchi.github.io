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
  'celestial-host': 0,

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
  'gunslinger': ['Gunslinger', 'Bounty Hunter', 'Trigger Happy', 'Ready Revolver', 'Shooting Star', 'Fortune Venus'],
  'ninja': ['Genin', 'Chunin', 'Jounin', 'Oniwaban', 'Touryou', 'Shadow Master'],
  'kunoichi': ['Hanakage', 'Yukikage', 'Hoshikage', 'Tsukikage', 'Sorakage', 'Master Kunoichi'],
  'samurai': ['Ronin', 'Samurai', 'Bujin', 'Kengou', 'Kensei', 'Sword Master'],
  'lady-samurai': ['Exorcist', 'Diabolist', 'Holy Swordwoman', 'Battle Maiden', 'Carnage Princess', 'Blade Master'],
  'armor-knight': ['Heavy Knight', 'Iron Knight', 'Steel Knight', 'Mythril Knight', 'Adamant Knight', 'Aegis Knight'],
  'thief': ['Thief', 'Rogue', 'Scout', 'Bandit', 'Trickster', 'Master Thief'],
  'wiseman': ['Druid', 'Mystic', 'Sage', 'Hermit', 'Prophet', 'Geo Master'],
  'beast-master': ['Beast Tamer', 'Beast Leader', 'Beast Lord', 'Beast Queen', 'Beast Master', 'Beast Savior'],
  'brute-warrior': ['Barbarian', 'Crusher', 'Marauder', 'Berserker', 'Avenger', 'Genocider'],
  'sorcerer': ['Shaman', 'Witch Doctor', 'Necromancer', 'Dark Elder', 'Purgatory Oracle', 'Soul Invoker'],
  'masked-hero': ['Masked Hero', 'Vizard Hero', 'Morphing Hero', 'Fixed-Up Hero', 'Galaxy Hero', 'Super Dimensionman'],
  'magic-knight': ['Magic Knight', 'Dark Knight', 'Rune Knight', 'Mega Knight', 'Force Knight', 'Space Knight'],
  'majin': ['Chaos Soldier', 'Death Avenger', 'Violater', 'Last Battalion', 'Death Army', 'Omega Sentinel'],
  'cheerleader': ['Brand New Idol', 'Summer Idol', 'Celestial Idol', 'Dream Idol', 'Brilliant Idol', 'Idol Master'],
  'celestial-host': ['Angel', 'Angel Cadet', 'Angel Soldier', 'Crusader', 'Avenger', 'Paladin'],

  'sludge': ['Green Slime', 'Red Blob', 'Blue Gelatin', 'Ochre Jelly', 'Grey Ooze', 'Black Pudding'],
  'orc': ['Petite Orc', 'Orc Captain', 'Head Orc', 'Orc Master', 'Orc King', 'Shadow Orc'],
  'winged-warrior': ['Mothman', 'Messenger', 'Watcher', 'Observer', 'Spy', 'Unknown'],
  'shroom': ['Eryngi', 'Matango', 'Champinion', 'Fungus', 'Wonderspore', 'Eyrndom'],
  'spirit': ['Ghost', 'Boggart', 'Specter', 'Wraith', 'Fiend', 'Phantom'],
  'slumber-cat': ['Catsaber', 'Warcat', 'Cait Sith', 'Grimalkin', 'Elbaccie', 'Lord Cat God'],
  'prinny': ['Private Prinny', 'Captain Prinny', 'Colonel Prinny', 'General Prinny', 'Prinny King', 'Prinny God'],
  'undead': ['Zombie', 'Ghoul', 'Corpse', 'Ghast', 'Wight', 'Zombie King'],
  'marionette': ['Marionette', 'Killer Puppet', 'Assassin Doll', 'Death Coppelia', 'Mad Jester', 'Hells Crown'],
  'flora-beast': ['Alraune', 'Nemophila', 'Pharbitis', 'Belladonna', 'Photinia', 'Parthenocissus'],
  'aqua-demon': ['Warslug', 'Vodianoi', 'Sea Monk', 'Aqua Fighter', 'Charybdis', 'Dagon'],
  'roc': ['Cockatrice', 'Basilcrow', 'Peryton', 'Malphas', 'Foolfool', 'Abraxas'],
  'death': ['Chernobog', 'Death', 'Tezcatilipoca', 'Mrtyu', 'Samael', 'Thanatos'],
  'mystic-beast': ['Cu Sith', 'Hell Hound', 'Black Dog', 'Garm', 'Orthros', 'Fenrir'],
  'holy-dragon': ['White Dragon', 'Dragon King', 'Saint Dragon', 'Heaven Dragon', 'Terra Dragon', 'Divine Dragon'],
  'succubus': ['Empusa', 'Lilim', 'Succubus', 'Carmilla', 'Hecate', 'Lilith'],
  'dragon-zombie': ['Skeletal Dragon', 'Death Dragon', 'Curse Dragon', 'Mystic Dragon', 'Dark Dragon', 'Hell Dragon'],
  'wood-golem': ['Wood Giant', 'Tree Folk', 'Forest Guardian', 'Green Giant', 'Gaia Titan', 'Dreadnaught'],
  'riffle-demon': ['Baciel', 'Gambiel', 'Adnachiel', 'Verchiel', 'Ambriel', 'Malchidael'],
  'fire-demon': ['Ifrit', 'Satana', 'Marid', 'Flamberg', 'Slust', 'Agni'],
  'felynn': ['Nekomata', 'Bowmaw', 'Tail Ring', 'Casperleague', 'Ovinig', 'Bastet'],
  'dragon': ['Dragon', 'Fafnir', 'Nidhogg', 'Ahzi Dahaka', 'Tiamat', 'Bahamut'],
  'factory-desco': ['Factory Desco', 'Factory Des Z', 'Factory Des ZZ', 'Factory Des V', 'Factory Des W', 'Factory Des X'],
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