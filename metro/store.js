import { reactive } from 'vue';

let uid = 0;

export const notifyStore = reactive({
  items: [],
  show({ caption = '', content, timeout = 3000, background, color }) {
    const id = ++uid;
    this.items.push({ id, caption, content, background, color });
    if (timeout) setTimeout(() => this.close(id), timeout);
    return id;
  },
  close(id) { this.items = this.items.filter(i => i.id !== id); },
});

export const dialogStore = reactive({
  current: null, // { title, content, icon, flat, shadow }
  open(options) { this.current = options; },
  close() { this.current = null; },
});