import Game from '../game/main.js';

import {
  CHARACTER_CLASSES,
  CHARACTER_PORTRAITS,
  CHARACTER_PORTRAITS_EXTRA,
  CHARACTER_SPRITES,
  ITEM_ICONS,
} from './data.js';

import {
  CHARACTER_GROUPS,
  FIELD_BY_ID,
  IDENTITY,
  ITEM_FIELDS,
  ITEM_ICON,
  NAME,
  NOTES,
  PORTRAIT_LIST_A_FROM_JM,
  PRESETS,
  SKILLS,
  THREAD_URL,
  clamp,
  nameToWrites,
  offsetCore,
  toLine,
} from './codes.js';

// =============================================================================
// SECTION 1 - constants and small helpers
// =============================================================================

const STORAGE_KEY = 'DS-state';

const esc = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

const byHex = ([a], [b]) => parseInt(a, 16) - parseInt(b, 16);
const isHex = value => /^[0-9a-f]{1,4}$/i.test(String(value).trim());
const fmt = value => (value == null ? '—' : Number(value).toLocaleString('en-US'));

const defaultState = () => ({
  tab: 'character',
  master: '',
  labels: true,
  nameAsWords: true,
  stabilizePortrait: false,
  name: { on: false, value: '' },
  pick: {
    sprite: { on: false, value: '001' },
    class: { on: false, value: '000' },
    portrait: { on: false, value: 'A:00' }, // 'A:' list A, 'E:' extra list
    icon: { on: false, value: '00' },
  },
  num: {}, // field id -> { on, value }
  skills: { on: false, count: 4, ids: [], levels: [] },
});

const PICKERS = {
  sprite: 'Battle sprite',
  class: 'Class',
  portrait: 'Portrait',
  icon: 'Item icon',
};

// =============================================================================
// SECTION 2 - the tool
// =============================================================================

export default class DisgaeaDS extends Game {
  start() {
    this.init('disgaea-ds-body', 'game-body');
    this.init('disgaea-ds-actions', 'game-actions');
    this.get('game-actions').classList.add('disgaea-ds');

    this.missingImages = new Set();
    this.options = this.buildOptions();
    this.state = this.load();

    this.set('ds-copy', 'onclick', this.copy);
    const root = this.get('ds-root');
    root.addEventListener('input', e => this.onInput(e));
    root.addEventListener('click', e => this.onClick(e));

    this.renderAll();
  }

  clearData() {
    if (confirm('Are you sure?')) {
      localStorage.removeItem(STORAGE_KEY);
      this.state = defaultState();
      this.renderAll();
    }
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  load() {
    const base = defaultState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || typeof saved !== 'object') return base;
      return this.merge(base, saved);
    } catch (e) {
      return base;
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      // ignore quota / privacy-mode errors
    }
  }

  merge(base, extra) {
    return {
      ...base,
      ...extra,
      name: { ...base.name, ...extra.name },
      pick: Object.fromEntries(Object.keys(base.pick).map(key => [key, { ...base.pick[key], ...extra.pick?.[key] }])),
      num: { ...base.num, ...extra.num },
      skills: { ...base.skills, ...extra.skills },
    };
  }

  num(id) {
    return (this.state.num[id] ??= { on: false, value: FIELD_BY_ID[id].def ?? 0 });
  }

  // ---------------------------------------------------------------------------
  // Pickers (sprite / class / portrait / icon)
  // ---------------------------------------------------------------------------

  buildOptions() {
    const list = (data, pad, prefix = '', group = null) => Object.entries(data)
      .sort(byHex)
      .map(([id, name]) => ({ value: prefix + id, label: `${id.padStart(pad, '0')} · ${name}`, group }));

    return {
      sprite: list(CHARACTER_SPRITES, 4),
      class: list(CHARACTER_CLASSES, 3),
      portrait: [
        ...list(CHARACTER_PORTRAITS, 2, 'A:', 'List A (JM above 7F)'),
        ...list(CHARACTER_PORTRAITS_EXTRA, 2, 'E:', 'Extra list (override 1C)'),
      ],
      icon: list(ITEM_ICONS, 2),
    };
  }

  fillSelect(select, key, selected, query = '') {
    const q = query.trim().toLowerCase();
    const groups = new Map();

    for (const option of this.options[key]) {
      if (q && !option.label.toLowerCase().includes(q) && option.value !== selected) continue;
      if (!groups.has(option.group)) groups.set(option.group, []);
      groups.get(option.group).push(option);
    }

    select.innerHTML = [...groups].map(([group, items]) => {
      const html = items
        .map(({ value, label }) => `<option value="${esc(value)}"${value === selected ? ' selected' : ''}>${esc(label)}</option>`)
        .join('');
      return group ? `<optgroup label="${esc(group)}">${html}</optgroup>` : html;
    }).join('');
  }

  optionLabel(key, value) {
    return this.options[key].find(option => option.value === value)?.label.replace(/^[0-9A-F]+ · /, '') ?? value;
  }

  // ---------------------------------------------------------------------------
  // Code generation
  // ---------------------------------------------------------------------------

  buildWrites() {
    const s = this.state;
    const { sprite, class: klass, portrait, icon } = s.pick;
    const out = [];
    const push = (core, size, value, label) => out.push({ core, size, value, label });

    if (klass.on) push(IDENTITY.class.core, 16, parseInt(klass.value, 16), `Class: ${this.optionLabel('class', klass.value)}`);
    if (sprite.on) push(IDENTITY.sprite.core, 16, parseInt(sprite.value, 16), `Battle sprite: ${this.optionLabel('sprite', sprite.value)}`);

    if (portrait.on) {
      const [list, id] = portrait.value.split(':');
      push(IDENTITY.portrait.core, 8, parseInt(id, 16), `Portrait: ${this.optionLabel('portrait', portrait.value)}`);
      if (list === 'E') {
        push(IDENTITY.portraitMode.core, 8, IDENTITY.portraitMode.extra, 'Portrait list: extra');
      } else if (s.stabilizePortrait) {
        push(IDENTITY.portraitMode.core, 8, IDENTITY.portraitMode.normal, 'Portrait override: off');
      }
    }

    if (s.name.on) out.push(...nameToWrites(s.name.value, s.nameAsWords));

    for (const group of CHARACTER_GROUPS) {
      for (const item of group.fields) this.pushNumber(out, item);
    }

    if (s.skills.on) {
      const count = clamp(Math.round(Number(s.skills.count) || 0), 0, SKILLS.max);
      push(SKILLS.countCore, 8, count, 'Number of skills');
      for (let i = 0; i < count; i++) {
        const id = String(s.skills.ids[i] ?? '').trim();
        if (isHex(id)) push(offsetCore(SKILLS.idCore, i * SKILLS.idStep), 16, parseInt(id, 16), `Skill ${i + 1}`);

        const level = String(s.skills.levels[i] ?? '').trim();
        if (level !== '') push(offsetCore(SKILLS.levelCore, i), 8, clamp(Math.round(Number(level) || 0), 0, SKILLS.levelMax), `Skill ${i + 1} level`);
      }
    }

    if (icon.on) push(ITEM_ICON.core, ITEM_ICON.size, parseInt(icon.value, 16), `Item icon: ${this.optionLabel('icon', icon.value)}`);
    for (const item of ITEM_FIELDS) this.pushNumber(out, item);

    return out;
  }

  pushNumber(out, item) {
    const entry = this.num(item.id);
    if (!entry.on) return;
    const value = clamp(Math.round(Number(entry.value) || 0), item.min ?? 0, item.max);
    out.push({ core: item.core, size: item.size, value, label: item.label });
  }

  buildText(writes) {
    const { master, labels } = this.state;
    const masterLines = master.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const lines = writes.map(write => (labels ? `${toLine(write)} ;${write.label}` : toLine(write)));
    return [...masterLines, ...lines].join('\n');
  }

  // ---------------------------------------------------------------------------
  // Editor
  // ---------------------------------------------------------------------------

  renderAll() {
    this.renderEditor();
    this.syncOptions();
    this.refresh();
  }

  numberRow(item) {
    const entry = this.num(item.id);
    return /*html*/`
      <div class="ds-row">
        <input type="checkbox" data-num-on="${item.id}" aria-label="Write ${esc(item.label)}"${entry.on ? ' checked' : ''}>
        <span class="ds-label">${esc(item.label)}</span>
        <input type="number" data-num="${item.id}" min="${item.min ?? 0}" max="${item.max}" value="${esc(entry.value)}" aria-label="${esc(item.label)}">
        <button type="button" data-max="${item.id}" title="Set to ${item.max}">Max</button>
        ${item.note ? `<small>${esc(item.note)}</small>` : ''}
      </div>`;
  }

  pickRow(key) {
    const entry = this.state.pick[key];
    return /*html*/`
      <div class="ds-row ds-pick">
        <input type="checkbox" data-pick-on="${key}" aria-label="Write ${PICKERS[key]}"${entry.on ? ' checked' : ''}>
        <span class="ds-label">${PICKERS[key]}</span>
        <input type="search" data-filter="${key}" placeholder="Filter…" aria-label="Filter ${PICKERS[key]}">
        <select data-pick="${key}" aria-label="${PICKERS[key]}"></select>
      </div>`;
  }

  renderEditor() {
    const s = this.state;
    const hidden = tab => (s.tab === tab ? '' : ' hidden');

    this.get('ds-panes').innerHTML = /*html*/`
      <div class="ds-pane" data-pane="character"${hidden('character')}>
        <div class="ds-presets">
          ${Object.entries(PRESETS).map(([id, preset]) => `<button type="button" data-preset="${id}">Load ${esc(preset.label)}</button>`).join('')}
          <button type="button" data-action="allOff">Turn everything off</button>
        </div>

        <fieldset>
          <legend>Identity</legend>
          <div class="ds-row">
            <input type="checkbox" data-name-on aria-label="Write name"${s.name.on ? ' checked' : ''}>
            <span class="ds-label">Name</span>
            <input type="text" data-name maxlength="${NAME.max}" value="${esc(s.name.value)}" placeholder="ASCII, up to ${NAME.max} letters" aria-label="Name" autocomplete="off">
          </div>
          ${this.pickRow('class')}
          ${this.pickRow('sprite')}
          ${this.pickRow('portrait')}
        </fieldset>

        ${CHARACTER_GROUPS.map(group => /*html*/`
          <details class="ds-group"${group.open ? ' open' : ''}>
            <summary>${esc(group.title)}</summary>
            ${group.fields.map(item => this.numberRow(item)).join('')}
          </details>`).join('')}

        <fieldset>
          <legend>Skills</legend>
          <div class="ds-row">
            <input type="checkbox" data-skills-on aria-label="Write skills"${s.skills.on ? ' checked' : ''}>
            <span class="ds-label">Number of skills</span>
            <input type="number" data-skills-count min="0" max="${SKILLS.max}" value="${esc(s.skills.count)}" aria-label="Number of skills">
          </div>
          <div id="ds-skill-rows"></div>
        </fieldset>
      </div>

      <div class="ds-pane" data-pane="item"${hidden('item')}>
        <fieldset>
          <legend>Item in the bag</legend>
          ${this.pickRow('icon')}
          ${ITEM_FIELDS.map(item => this.numberRow(item)).join('')}
        </fieldset>
        <p class="ds-hint">An item needs at least three codes to behave: item type (icon), item class and equip type.</p>
      </div>

      <div class="ds-pane" data-pane="notes"${hidden('notes')}>
        <ul class="ds-notes">
          ${NOTES.map(({ tone, text }) => `<li class="${tone}">${esc(text)}</li>`).join('')}
        </ul>
        <p class="ds-hint">Source: <a href="${THREAD_URL}" target="_blank" rel="noopener noreferrer">Kodewerx · Disgaea DS (U)</a></p>
      </div>`;

    this.renderSkillRows();
    this.syncTabs();
  }

  renderSkillRows() {
    const s = this.state;
    const count = clamp(Math.round(Number(s.skills.count) || 0), 0, SKILLS.max);

    this.get('ds-skill-rows').innerHTML = Array.from({ length: count }, (_, i) => /*html*/`
      <div class="ds-row ds-skill">
        <span class="ds-label">Skill ${i + 1}</span>
        <input type="text" data-skill-id="${i}" maxlength="4" placeholder="09C5" value="${esc(s.skills.ids[i] ?? '')}" aria-label="Skill ${i + 1} id (hex)" autocomplete="off">
        <input type="number" data-skill-level="${i}" min="0" max="${SKILLS.levelMax}" placeholder="level" value="${esc(s.skills.levels[i] ?? '')}" aria-label="Skill ${i + 1} level">
      </div>`).join('');
  }

  /** Fills the selects and the output options from the state. */
  syncOptions() {
    const root = this.get('ds-root');
    for (const key of Object.keys(PICKERS)) {
      const select = root.querySelector(`[data-pick="${key}"]`);
      if (select) this.fillSelect(select, key, this.state.pick[key].value);
    }

    this.get('ds-master').value = this.state.master;
    for (const key of ['labels', 'nameAsWords', 'stabilizePortrait']) {
      root.querySelector(`[data-opt="${key}"]`).checked = this.state[key];
    }
  }

  syncTabs() {
    const root = this.get('ds-root');
    root.querySelectorAll('[data-tab]').forEach(button => {
      const active = button.dataset.tab === this.state.tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', active);
    });
    root.querySelectorAll('[data-pane]').forEach(pane => {
      pane.hidden = pane.dataset.pane !== this.state.tab;
    });
  }

  // ---------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------

  onInput(e) {
    const target = e.target;
    const d = target.dataset;
    const s = this.state;

    if (d.numOn !== undefined) {
      this.num(d.numOn).on = target.checked;
    } else if (d.num !== undefined) {
      this.num(d.num).value = target.value;
    } else if (d.pickOn !== undefined) {
      s.pick[d.pickOn].on = target.checked;
    } else if (d.pick !== undefined) {
      s.pick[d.pick].value = target.value;
    } else if (d.filter !== undefined) {
      const select = this.get('ds-root').querySelector(`[data-pick="${d.filter}"]`);
      this.fillSelect(select, d.filter, s.pick[d.filter].value, target.value);
      return; // nothing changed in the state
    } else if (d.nameOn !== undefined) {
      s.name.on = target.checked;
    } else if (d.name !== undefined) {
      s.name.value = target.value;
    } else if (d.skillsOn !== undefined) {
      s.skills.on = target.checked;
    } else if (d.skillsCount !== undefined) {
      s.skills.count = target.value;
      this.renderSkillRows();
    } else if (d.skillId !== undefined) {
      s.skills.ids[d.skillId] = target.value;
    } else if (d.skillLevel !== undefined) {
      s.skills.levels[d.skillLevel] = target.value;
    } else if (d.opt !== undefined) {
      s[d.opt] = target.checked;
    } else if (d.master !== undefined) {
      s.master = target.value;
    } else {
      return;
    }

    this.refresh();
  }

  onClick(e) {
    const button = e.target.closest('button');
    if (!button) return;
    const d = button.dataset;

    if (d.tab) {
      this.state.tab = d.tab;
      this.syncTabs();
      this.refresh();
    } else if (d.max) {
      const entry = this.num(d.max);
      entry.on = true;
      entry.value = FIELD_BY_ID[d.max].max;
      const root = this.get('ds-root');
      root.querySelector(`[data-num="${d.max}"]`).value = entry.value;
      root.querySelector(`[data-num-on="${d.max}"]`).checked = true;
      this.refresh();
    } else if (d.preset) {
      const preset = PRESETS[d.preset];
      const { master, labels, nameAsWords, stabilizePortrait, tab } = this.state;
      this.state = this.merge({ ...defaultState(), master, labels, nameAsWords, stabilizePortrait, tab }, preset.state);
      this.renderAll();
    } else if (d.action === 'allOff') {
      const { master, labels, nameAsWords, stabilizePortrait, tab } = this.state;
      this.state = { ...defaultState(), master, labels, nameAsWords, stabilizePortrait, tab };
      this.renderAll();
    }
  }

  async copy() {
    const area = this.get('ds-code');
    try {
      await navigator.clipboard.writeText(area.value);
    } catch (e) {
      area.select();
      document.execCommand('copy');
    }
    const button = this.get('ds-copy');
    button.textContent = 'Copied!';
    setTimeout(() => { button.textContent = 'Copy codes'; }, 1200);
  }

  // ---------------------------------------------------------------------------
  // Refresh: output + preview
  // ---------------------------------------------------------------------------

  refresh() {
    const writes = this.buildWrites();
    this.get('ds-code').value = this.buildText(writes);
    this.get('ds-count').textContent = `${writes.length} ${writes.length === 1 ? 'line' : 'lines'}`;

    const preview = this.get('ds-preview');
    preview.innerHTML = this.state.tab === 'item' ? this.itemPreview() : this.characterPreview();
    preview.querySelectorAll('img[data-src]').forEach(img => {
      img.addEventListener('error', () => {
        this.missingImages.add(img.dataset.src);
        img.remove();
      }, { once: true });
    });

    this.save();
  }

  // ---------------------------------------------------------------------------
  // Preview
  // ---------------------------------------------------------------------------

  value(id) {
    const entry = this.num(id);
    return entry.on ? Number(entry.value) || 0 : null;
  }

  vital(kind, label, current, max) {
    const known = current != null || max != null;
    const ratio = current != null && max ? clamp(current / max, 0, 1) : 1;
    return /*html*/`
      <div class="ds-vital">
        <span class="ds-tag">${label}</span>
        <div class="ds-track${known ? '' : ' off'}"><div class="ds-fill ${kind}" style="width:${known ? Math.round(ratio * 100) : 100}%"></div></div>
        <span class="ds-num">${fmt(current)} / ${fmt(max)}</span>
      </div>`;
  }

  portraitFrame() {
    const { portrait } = this.state.pick;
    if (!portrait.on) {
      return '<div class="ds-portrait"><span class="ds-portrait-id">?</span><span class="ds-portrait-name">No portrait</span></div>';
    }

    const [list, id] = portrait.value.split(':');
    const src = `img/ds/portraits/${list}${id}.png`;
    const image = this.missingImages.has(src) ? '' : `<img data-src="${src}" src="${src}" alt="">`;
    return /*html*/`
      <div class="ds-portrait">
        <span class="ds-portrait-id">${id}</span>
        <span class="ds-portrait-name">${esc(this.optionLabel('portrait', portrait.value))}</span>
        ${image}
      </div>`;
  }

  warnings() {
    const s = this.state;
    const { sprite, class: klass, portrait } = s.pick;
    const jm = this.value('jm');
    const out = [];
    const add = (tone, text) => out.push({ tone, text });
    const plain = text => text.replace(/\s*\(.*\)\s*$/, '').toLowerCase();

    if (!s.master.trim()) add('info', 'No master code yet. Paste it in the box under the codes.');
    if (s.name.on && /[^\x20-\x7E]/.test(s.name.value)) add('warn', 'The name has letters outside ASCII. They are written as "?".');

    if (sprite.on) {
      const spriteName = this.optionLabel('sprite', sprite.value);
      if (parseInt(sprite.value, 16) === 0xA1E) add('warn', 'Human Kurtis can crash the game if he is not equipped properly.');
      if (parseInt(sprite.value, 16) >= 0x7D0) add('warn', 'Monster and NPC sprites need a weapon they can carry, or the character freezes in an attack pose.');
      if (klass.on) {
        const className = this.optionLabel('class', klass.value);
        if (plain(spriteName) !== plain(className)) {
          add('info', `Sprite (${spriteName}) and class (${className}) differ. The sprite is only the look and voice; the class sets skills and growth.`);
        }
      }
    }

    if (portrait.on && portrait.value.startsWith('A:')) {
      if (jm == null) add('info', 'List A portraits need JM above 7F. Turn on JM below.');
      else if (jm < PORTRAIT_LIST_A_FROM_JM) add('warn', `JM ${jm} is 7F or lower, so the game reads portraits from list B, not the one you picked.`);
    }

    return out;
  }

  characterPreview() {
    const s = this.state;
    const { class: klass, sprite } = s.pick;
    const v = id => this.value(id);
    const jm = v('jm');

    const name = s.name.on && s.name.value.trim() ? esc(s.name.value) : '';
    const stats = [['ATK', 'atk'], ['DEF', 'def'], ['INT', 'int'], ['SPD', 'spd'], ['HIT', 'hit'], ['RES', 'res']];
    const count = s.skills.on ? clamp(Math.round(Number(s.skills.count) || 0), 0, SKILLS.max) : 0;

    const skills = Array.from({ length: count }, (_, i) => {
      const id = String(s.skills.ids[i] ?? '').trim().toUpperCase();
      const level = String(s.skills.levels[i] ?? '').trim();
      return `<li><span class="ds-tag">${i + 1}</span> ${isHex(id) ? id.padStart(4, '0') : '----'}${level !== '' ? ` <em>Lv${esc(level)}</em>` : ''}</li>`;
    }).join('');

    return /*html*/`
      <div class="ds-window" role="region" aria-label="Character preview">
        <div class="ds-window-title"><span>Status</span><span>${v('level') != null ? `Lv ${fmt(v('level'))}` : 'Lv —'}</span></div>
        <div class="ds-window-body">
          <div class="ds-head">
            ${this.portraitFrame()}
            <div class="ds-who">
              <span class="ds-name${name ? '' : ' off'}">${name || 'Name'}</span>
              <span class="ds-class">${klass.on ? esc(this.optionLabel('class', klass.value)) : 'Class —'}</span>
              <span class="ds-sprite">${sprite.on ? `Sprite ${esc(this.optionLabel('sprite', sprite.value))}` : 'Sprite —'}</span>
            </div>
          </div>

          ${this.vital('hp', 'HP', v('hp'), v('maxHp'))}
          ${this.vital('sp', 'SP', v('sp'), v('maxSp'))}

          <div class="ds-stats">
            ${stats.map(([label, id]) => `<div class="ds-stat"><span class="ds-tag">${label}</span><span class="ds-num">${fmt(v(id))}</span></div>`).join('')}
            <div class="ds-stat"><span class="ds-tag">MV</span><span class="ds-num">${fmt(v('mv'))}</span></div>
            <div class="ds-stat"><span class="ds-tag">JM</span><span class="ds-num">${fmt(jm)}</span></div>
            <div class="ds-stat"><span class="ds-tag">CNT</span><span class="ds-num">${fmt(v('counter'))}</span></div>
          </div>
          ${jm != null ? `<div class="ds-list">Portrait list ${jm >= PORTRAIT_LIST_A_FROM_JM ? 'A' : 'B'} (JM ${jm >= PORTRAIT_LIST_A_FROM_JM ? 'above' : 'at or below'} 7F)</div>` : ''}

          <div class="ds-block">
            <h3>Skills</h3>
            ${skills ? `<ul class="ds-skills">${skills}</ul>` : '<p class="ds-empty">Turn on skills to list them here.</p>'}
          </div>

          ${this.badges()}
          <p class="ds-foot">Applies to the first party slot.</p>
        </div>
      </div>`;
  }

  itemPreview() {
    const s = this.state;
    const { icon } = s.pick;
    const rarity = this.value('itemRarity');
    const slots = this.value('itemSlots');
    const equip = this.value('itemEquip');
    const shown = clamp(slots ?? 0, 0, 4);

    return /*html*/`
      <div class="ds-window" role="region" aria-label="Item preview">
        <div class="ds-window-title"><span>Item</span><span>${rarity === 0 ? 'Legendary' : rarity != null ? `Rarity ${rarity}` : 'Rarity —'}</span></div>
        <div class="ds-window-body">
          <div class="ds-head">
            <div class="ds-portrait"><span class="ds-portrait-id">${icon.on ? esc(icon.value) : '?'}</span><span class="ds-portrait-name">${icon.on ? esc(this.optionLabel('icon', icon.value)) : 'No icon'}</span></div>
            <div class="ds-who">
              <span class="ds-name">${icon.on ? esc(this.optionLabel('icon', icon.value)) : 'Item'}</span>
              <span class="ds-class">Equip type ${equip != null ? equip.toString(16).toUpperCase().padStart(4, '0') : '—'}</span>
              <span class="ds-sprite">JM ${fmt(this.value('itemJm'))}</span>
            </div>
          </div>
          <div class="ds-stat"><span class="ds-tag">Specialist slots</span><span class="ds-num" aria-label="${slots ?? 0} of 4">${'◆'.repeat(shown)}${'◇'.repeat(4 - shown)}</span></div>
          <p class="ds-foot">Needs item type, item class and equip type to behave.</p>
        </div>
      </div>`;
  }

  badges() {
    const list = this.warnings();
    if (!list.length) return '';
    return `<ul class="ds-badges">${list.map(({ tone, text }) => `<li class="ds-badge ${tone}">${esc(text)}</li>`).join('')}</ul>`;
  }
}