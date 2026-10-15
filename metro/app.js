import { createApp, ref } from 'vue';
import NavigationBar from 'components/NavigationBar.js';
import Dropdown from 'components/Dropdown.js';
import Tile from 'components/Tile.js';
import LiveTile from 'components/LiveTile.js';
import Notify from 'components/Notify.js';
import Dialog from 'components/Dialog.js';
import { notifyStore, dialogStore } from 'store';

createApp({
  components: { NavigationBar, Dropdown, Tile, LiveTile, Notify, Dialog },
  setup() {
    const selected = ref({ a: true });
    const frames = [
      { type: 'image', images: ['images/1.jpg'] },
      { type: 'image-set', images: ['images/2.jpg', 'images/3.jpg', 'images/4.jpg', 'images/5.jpg'] },
    ];
    const exit = () => dialogStore.open({ title: 'Invalid operation', content: 'Under construction.', shadow: true });
    return { selected, frames, exit, notifyStore };
  },
  template: /*html*/`
    <div class="metro">
      <NavigationBar>
        <Dropdown>
          <template #toggle>Start</template>
          <li><a href="#">Main</a></li>
          <li class="divider"></li>
          <li><a href="#" @click.prevent="window.print()">Print...</a></li>
          <li><a href="#" @click.prevent="exit">Exit</a></li>
        </Dropdown>
        <Dropdown place-right class="place-right">
          <template #toggle><span class="icon-cog"></span></template>
          <li><a href="#">Products</a></li>
        </Dropdown>
      </NavigationBar>

      <Tile color="bg-cyan" size="double-vertical" v-model="selected.a">
        <div class="brand"><div class="badge">59</div></div>
      </Tile>
      <Tile color="bg-cyan" transform @click="notifyStore.show({ caption: 'Tile', content: 'Clicked' })">
        <div class="brand"><div class="badge">12</div></div>
      </Tile>
      <LiveTile :frames="frames" size="double" />

      <Notify /><Dialog />
    </div>`,
}).mount('#app');