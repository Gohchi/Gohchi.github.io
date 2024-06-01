
const character = {
  'base': {
    'Portrait': '221D10C9 000000',
    'Sprite': '121D1098 00000',
    'Class': '121D109C 00000',
  },
};
const item = {
  'base': {
    'Rarity': '221D0AF7 000000',
    'Specialist slots': '221D0AFA 0000000',
    'Icon': '221D0AFC 00000'
  },
  'Rarity': '00', // (00 = legendary)
  'Specialist slots': '4', // max 4
  getItemIcon: function (value) {
    const [id, name] = ITEM_ICONS.find(([id]) => id === value);
    const base = this.base['Icon'];
    return `AR ${base}${id} ;${name}`;
  } 
};


const more = {
  'Character Portrait': '221D10C9 000000F0',
  'Class': '121D109C 000000ED',
  'Level': '121D1094 00000001',
  'Experience': '021D0A70 00000000',
  'JM': '221D10D2 00000094',
  'Number of skills': '221D10CE 00000004',
  'Skill 1': '121D0ED8 000009C5',
  'Skill 2': '121D0EDA 000009CF',
  'Skill 3': '121D0EDC 000009D9',
  'Skill 4': '121D0EDE 000009E3',
};
// const res = generate(3502, sprites);
// const res = generate(256, titles);

// console.log(res);

function generate(limit, data) {
  const pre = data[0].substring(0, 16);
  const post = ' ;missing #';

  const dataHEX = data.map(o => o.substring(16, 20));
  
  const toHex = int => int.toString(16).toUpperCase().padStart(4, '000');
  
  console.log(`generating until ${limit} (HEX: ${toHex(limit)})`);
  
  let res = '';
  for (let i = 1; i < limit; i++) {
    const value = toHex(i);
    if (dataHEX.includes(value)) {
      const index = dataHEX.indexOf(value);
      res += data[index] + '\n';
    } else {
      res += pre + value + post + value + '\n';
    }
  }
  
  return res;
}