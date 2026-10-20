// Disgaea DS (U) - Action Replay knowledge base.
// Additive: data.js (sprites, classes, portraits, item icons) is untouched and
// this file only adds what the code generator needs on top of it.
//
// Sources: Kodewerx thread "Disgaea DS (U)" (page 4 read in full, other pages only
// as search fragments) and the notes already kept in data.js / notes.js.
// https://www.kodewerx.org/forum/viewtopic.php?p=69292

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/** Upper-case hex, zero padded on the left (11B -> 0000011B). */
export const hex = (n, digits = 8) => (n >>> 0).toString(16).toUpperCase().padStart(digits, '0');

// First digit of an AR code = size of the write.
export const PREFIX = { 32: '0', 16: '1', 8: '2' };

/** { core: '21D1098', size: 16, value: 0x9C4 } -> '121D1098 000009C4' */
export const toLine = ({ core, size, value }) => {
  const masked = size === 32 ? value >>> 0 : value & ((1 << size) - 1);
  return `${PREFIX[size]}${core} ${hex(masked, 8)}`;
};

/** Address core (7 hex digits, no size digit) + offset in bytes. */
export const offsetCore = (core, offset) => hex(parseInt(core, 16) + offset, 7);

// ---------------------------------------------------------------------------
// Character name
// ---------------------------------------------------------------------------
// 21 bytes of ASCII at 021D10AC..021D10C0. The tool keeps the last one as the
// end marker (assumption: the thread only ever shows it as 00), so 20 letters.

export const NAME = { core: '21D10AC', bytes: 21, max: 20 };

export function nameToBytes(name) {
  const bytes = new Array(NAME.bytes).fill(0);
  [...name].slice(0, NAME.max).forEach((char, i) => {
    const code = char.charCodeAt(0);
    bytes[i] = code < 0x20 || code > 0x7E ? 0x3F : code; // '?' for anything that is not ASCII
  });
  return bytes;
}

/**
 * asWords = true  -> five 32-bit writes + one 8-bit write (fewer lines).
 *                    Letters go in REVERSE order inside each word (little endian):
 *                    "Mid-" is 4D 69 64 2D -> 2D64694D.
 * asWords = false -> one 8-bit write per letter (21 lines, easier to read).
 */
export function nameToWrites(name, asWords = true) {
  const bytes = nameToBytes(name);

  if (!asWords) {
    return bytes.map((value, i) => ({
      core: offsetCore(NAME.core, i), size: 8, value, label: `Name letter #${i}`,
    }));
  }

  const writes = [];
  for (let word = 0; word < 5; word++) {
    const [a, b, c, d] = bytes.slice(word * 4, word * 4 + 4);
    const text = [a, b, c, d].filter(Boolean).map(code => String.fromCharCode(code)).join('');
    writes.push({
      core: offsetCore(NAME.core, word * 4),
      size: 32,
      value: ((d << 24) | (c << 16) | (b << 8) | a) >>> 0,
      label: `Name letters ${word * 4}-${word * 4 + 3}${text ? ` "${text}"` : ''}`,
    });
  }
  // 021D10C2 is the counter, so the last letter cannot be part of a 32-bit write.
  writes.push({ core: offsetCore(NAME.core, 20), size: 8, value: bytes[20], label: 'Name letter #20 (end)' });
  return writes;
}

// ---------------------------------------------------------------------------
// Identity: sprite, class, portrait
// ---------------------------------------------------------------------------

export const IDENTITY = {
  sprite: { core: '21D1098', size: 16 }, // in-battle sprite (also changes the voice)
  class: { core: '21D109C', size: 16 }, // growth model + skills
  portrait: { core: '21D10C9', size: 8 },
  // Secondary byte next to the portrait. 00 = normal list, 1C = extra list (see data.js).
  portraitMode: { core: '21D10D3', size: 8, normal: 0x00, extra: 0x1C },
};

// JM decides which portrait list the portrait byte is read from:
// above 7F -> list A (CHARACTER_PORTRAITS), 7F or below -> list B (not mapped yet).
export const PORTRAIT_LIST_A_FROM_JM = 0x80;

// ---------------------------------------------------------------------------
// Numeric fields (everything that is "enable + number")
// ---------------------------------------------------------------------------

const STAT_MAX = 99999999; // 05F5E0FF
const WEAPONS = ['Fist', 'Sword', 'Spear', 'Bow', 'Gun', 'Axe', 'Staff'];

const field = (id, label, core, size, max, extra = {}) => ({ id, label, core, size, max, ...extra });

const weaponFields = (prefix, label, core, size, step, max) =>
  WEAPONS.map((weapon, i) => field(`${prefix}${weapon}`, `${weapon} ${label}`, offsetCore(core, i * step), size, max));

export const CHARACTER_GROUPS = [
  {
    id: 'progress',
    title: 'Level, experience and mana',
    open: true,
    fields: [
      field('level', 'Level', '21D1094', 16, 9999, { min: 1, def: 1, note: '16-bit write. 9999 = 270F.' }),
      field('exp', 'Experience', '21D0A70', 32, STAT_MAX, { def: 0, note: 'Upper limit assumed.' }),
      field('mana', 'Mana', '21D1060', 32, 9999999),
    ],
  },
  {
    id: 'stats',
    title: 'Current HP/SP and stats',
    open: true,
    fields: [
      field('hp', 'HP', '21D0FF8', 32, STAT_MAX),
      field('sp', 'SP', '21D0FFC', 32, STAT_MAX),
      field('maxHp', 'Max HP', '21D1000', 32, STAT_MAX),
      field('maxSp', 'Max SP', '21D1004', 32, STAT_MAX),
      field('atk', 'ATK', '21D1008', 32, STAT_MAX),
      field('def', 'DEF', '21D100C', 32, STAT_MAX),
      field('int', 'INT', '21D1010', 32, STAT_MAX),
      field('spd', 'SPD', '21D1014', 32, STAT_MAX),
      field('hit', 'HIT', '21D1018', 32, STAT_MAX),
      field('res', 'RES', '21D101C', 32, STAT_MAX),
    ],
  },
  {
    id: 'misc',
    title: 'Movement, jump and resistances',
    open: true,
    fields: [
      field('mv', 'MV', '21D10CC', 8, 255, {
        note: 'Community notes: 00 no movement, 62 max, 63 teleport (hex).',
      }),
      field('jm', 'JM', '21D10D2', 8, 255, {
        def: 148,
        note: 'Above 127 (7F) the portrait comes from list A, otherwise from list B. Max is 7F or FF depending on the list.',
      }),
      field('counter', 'Counter', '21D10C2', 8, 255),
      field('attackDistance', 'Attack distance', '21D10D6', 8, 6, { note: 'Max 6. The game removes it after an attack.' }),
      field('resFire', 'Fire resistance', '21D10A9', 8, 127),
      field('resWind', 'Wind resistance', '21D10AA', 8, 127),
      field('resIce', 'Ice resistance', '21D10AB', 8, 127),
    ],
  },
  {
    id: 'base',
    title: 'Base stats',
    open: false,
    fields: [
      field('baseHp', 'Base HP', '21D1020', 32, 80000000),
      field('baseSp', 'Base SP', '21D1024', 32, 20000000),
      field('baseAtk', 'Base ATK', '21D1028', 32, 20000000),
      field('baseDef', 'Base DEF', '21D102C', 32, 20000000),
      field('baseInt', 'Base INT', '21D1030', 32, 20000000),
      field('baseSpd', 'Base SPD', '21D1034', 32, 20000000),
      field('baseHit', 'Base HIT', '21D1038', 32, 20000000),
      field('baseRes', 'Base RES', '21D103C', 32, 20000000),
    ],
  },
  {
    id: 'weapons',
    title: 'Weapon experience, mastery and rank',
    open: false,
    fields: [
      ...weaponFields('wExp', 'experience', '21D1040', 32, 4, STAT_MAX),
      ...weaponFields('wMastery', 'mastery', '21D107C', 8, 1, 255),
      ...weaponFields('wRank', 'proficiency rank', '21D1084', 8, 1, 255),
    ],
  },
];

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export const SKILLS = {
  countCore: '21D10CE', // 8-bit: number of skills
  idCore: '21D0ED8', // 16-bit ids, 2 bytes apart
  idStep: 2,
  levelCore: '21D0F98', // 8-bit levels, 1 byte apart
  levelMax: 99,
  max: 30,
};

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------
// An item needs at least three codes to behave: item type (icon), item class
// and equip type (reported in the thread).

export const ITEM_ICON = { core: '21D0AFC', size: 8 };

export const ITEM_FIELDS = [
  field('itemRarity', 'Rarity', '21D0AF7', 8, 255, { note: '00 = legendary.' }),
  field('itemSlots', 'Specialist slots', '21D0AFA', 8, 4, { note: 'Max 4.' }),
  field('itemJm', 'JM', '21D0AFD', 8, 255, { note: 'Labelled "JM" in the old notes.' }),
  field('itemEquip', 'Equip type', '21D0AFE', 16, 65535, { note: '16-bit write.' }),
];

export const FIELD_BY_ID = Object.fromEntries(
  [...CHARACTER_GROUPS.flatMap(group => group.fields), ...ITEM_FIELDS].map(item => [item.id, item])
);

// ---------------------------------------------------------------------------
// Presets (the same shape as the tool state, merged on top of the defaults)
// ---------------------------------------------------------------------------

export const PRESETS = {
  midBoss: {
    label: 'Mid-Boss 1',
    state: {
      name: { on: true, value: 'Mid-Boss' },
      pick: {
        sprite: { on: true, value: '9C4' },
        class: { on: true, value: '0ED' },
        portrait: { on: true, value: 'A:F0' },
      },
      num: {
        level: { on: true, value: 1 },
        exp: { on: true, value: 0 },
        jm: { on: true, value: 148 }, // 0x94, above 7F so list A is used
      },
      skills: { on: true, count: 4, ids: ['09C5', '09CF', '09D9', '09E3'], levels: [] },
    },
  },
  asagi: {
    label: 'Asagi',
    state: {
      name: { on: true, value: 'Asagi' },
      pick: {
        sprite: { on: true, value: 'E1A' },
        class: { on: true, value: '0FD' },
        portrait: { on: true, value: 'E:14' },
      },
      num: {
        level: { on: true, value: 1 },
        exp: { on: true, value: 0 },
        jm: { on: true, value: 148 }, // 0x94, above 7F so list A is used
        attackDistance: { on: true, value: 0 },
      },
      skills: { on: true, count: 4, ids: ['09C5', '09CF', '09D9', '09E3'], levels: [] },
    }
  }
};

// ---------------------------------------------------------------------------
// Notes shown in the tool (tone: 'info' | 'warn')
// ---------------------------------------------------------------------------

export const THREAD_URL = 'https://www.kodewerx.org/forum/viewtopic.php?p=69292';

export const NOTES = [
  { tone: 'info', text: 'Every line is 8 hex digits for the value. The first digit of the address is the size of the write: 0 = 32-bit, 1 = 16-bit, 2 = 8-bit. Short values get zeros on the left (11B becomes 0000011B). The tool does this for you.' },
  { tone: 'warn', text: 'Master code: the thread says the only one you need is the "game ID" code posted on its first page. It is not included here. Paste it in the master code box and it goes on top of the output.' },
  { tone: 'info', text: 'The codes affect the character in the first party slot. Rearrange the party from the menu first, then activate them.' },
  { tone: 'info', text: 'Sprite only changes the in-battle look and the voice. Class sets the growth model and skills. Change both if you want the full character.' },
  { tone: 'warn', text: 'A sprite whose weapon the character cannot carry stays stuck in an attack pose and glitches in fights (for example any monster or NPC sprite with a non-monster weapon). Match the equipped weapon to the sprite. Human Kurtis (0A1E) can crash if he is not equipped properly.' },
  { tone: 'info', text: 'Only Laharl has an out-of-battle sprite. Cutscenes are scripted in the ROM and cannot be edited.' },
  { tone: 'info', text: 'With the class code active, reincarnating applies that class\'s base stats (MV, JM and Counter included). Untested idea from the thread: reset the level to 1 and switch class with the codes instead of reincarnating, to keep skills and old base stats and still gain the new class\'s growth.' },
  { tone: 'info', text: 'JM above 7F reads portraits from list A, 7F or below from list B. List B is not mapped yet. Portrait F0 only displays correctly on Laharl and Etna; a hobgoblin needed 80 (Vyers / Mid-Boss portrait).' },
  { tone: 'info', text: 'A forum member reported that setting the portrait override byte to 00 stabilizes the portrait codes. The "Stabilize portraits" option writes 021D10D3 = 00 for list A portraits. Unverified: the post does not name the address.' },
  { tone: 'info', text: 'Names are ASCII, 20 letters at most. In 32-bit writes the four letters of each word go in reverse order ("Mid-" becomes 2D64694D). The thread\'s first 32-bit example had them unreversed and was wrong.' },
  { tone: 'info', text: 'Not mapped yet: Bandaged Mid-Boss, Astro / Mega cannon turrets and Geo Symbol sprites; Beauty Queen and Jobless (only reachable through the title modifier); Baal\'s six classes; Item God 2.' },
];