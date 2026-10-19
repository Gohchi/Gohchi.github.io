import { createApp, ref } from 'vue';
import NavigationBar from 'components/NavigationBar.js';
import Dropdown from 'components/Dropdown.js';
import TileArea from 'components/TileArea.js';
import TileGroup from 'components/TileGroup.js';
import Tile from 'components/Tile.js';
import LiveTile from 'components/LiveTile.js';
import Carousel from 'components/Carousel.js';
import Countdown from 'components/Countdown.js';
import Clock from 'components/Clock.js';
import Hint from 'components/Hint.js';
import Popover from 'components/Popover.js';
import InputControl from 'components/InputControl.js';
import Check from 'components/Check.js';
import ButtonSet from 'components/ButtonSet.js';
import DataTable from 'components/DataTable.js';
import Listview from 'components/Listview.js';
import FluentMenu from 'components/FluentMenu.js';
import Notify from 'components/Notify.js';
import Dialog from 'components/Dialog.js';
import { notifyStore, dialogStore } from 'store';

createApp({
  components: {
    NavigationBar, Dropdown, TileArea, TileGroup, Tile, LiveTile, Carousel, Countdown, Clock,
    Hint, Popover, InputControl, Check, ButtonSet, DataTable, Listview, FluentMenu, Notify, Dialog,
  },
  setup() {
    const selected = ref({ a: true });
    const frames = [
      { type: 'image', images: ['images/1.jpg'] },
      { type: 'image-set', images: ['images/2.jpg', 'images/3.jpg', 'images/4.jpg', 'images/5.jpg'] },
    ];
    const text = ref('');
    const pass = ref('');
    const agree = ref(false);
    const mode = ref('b');
    const tags = ref(['x']);
    const fluentTab = ref('home');
    const listActive = ref(1);
    const rowSel = ref(null);

    const exit = () => dialogStore.open({ title: 'Invalid operation', content: 'Under construction.', shadow: true });
    const print = () => window.print();

    return {
      selected, frames, text, pass, agree, mode, tags, fluentTab, listActive, rowSel,
      exit, print, notifyStore,
      slides: ['images/1.jpg', 'images/2.jpg', 'images/3.jpg'],
      options: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }, { key: 'c', label: 'C' }],
      columns: [{ field: 'name', caption: 'Name' }, { field: 'qty', caption: 'Qty' }],
      rows: [{ id: 1, name: 'Apple', qty: 3 }, { id: 2, name: 'Pear', qty: 1 }, { id: 3, name: 'Plum', qty: 8 }],
      items: [
        { id: 1, title: 'Inbox', subtitle: 'Mail', remark: '3 new', icon: 'icon-mail' },
        { id: 2, title: 'Calendar', remark: 'Today', icon: 'icon-calendar', marked: true },
      ],
      fluentTabs: [{ id: 'file', title: 'File', special: true }, { id: 'home', title: 'Home' }, { id: 'view', title: 'View' }],
    };
  },
  template: /*html*/`
    <div class="metro">
      <NavigationBar>
        <Dropdown>
          <template #toggle>Start</template>
          <li><a href="#">Main</a></li>
          <li class="divider"></li>
          <li><a href="#" @click.prevent="print">Print...</a></li>
          <li class="disabled"><a href="#">Disabled</a></li>
          <li><a href="#" @click.prevent="exit">Exit</a></li>
        </Dropdown>
        <Dropdown place-right class="place-right">
          <template #toggle><span class="icon-cog"></span></template>
          <li><a href="#">Products</a></li>
          <li><a href="#">Support</a></li>
        </Dropdown>
      </NavigationBar>

      <TileArea color="darkCobalt">
        <TileGroup title="Tiles" size="three">
          <Tile color="bg-cyan" size="double-vertical" v-model="selected.a" draggable>
            <div class="brand"><div class="badge">59</div></div>
          </Tile>
          <Tile color="bg-cyan" transform @click="notifyStore.show({ caption: 'Tile', content: 'Clicked' })">
            <div class="brand"><div class="badge">12</div></div>
          </Tile>
          <LiveTile :frames="frames" size="double" />
        </TileGroup>
      </TileArea>

      <div style="clear:both;padding:20px;max-width:760px">
        <Carousel :slides="slides" effect="fade" :height="200" />
        <br>
        <Countdown :days="2" /> <Clock />
        <br>
        <Hint text="I am a tooltip" title="Hint"><button>Hover me</button></Hint>
        <Popover text="Popover!" position="bottom"><button>Click me</button></Popover>
        <br><br>
        <InputControl v-model="text" placeholder="Text with clear" />
        <InputControl v-model="pass" type="password" placeholder="Password" />
        <InputControl type="search" v-model="text" placeholder="Search" />
        <Check v-model="agree" caption="Agree" />
        <Check v-model="agree" type="switch" caption="Switch" />
        <Check v-model="mode" type="radio" value="a" caption="Radio A" />
        <Check v-model="mode" type="radio" value="b" caption="Radio B" />
        <ButtonSet v-model="tags" :options="options" multiple />
        <ButtonSet v-model="mode" :options="options" />
        <DataTable :columns="columns" :rows="rows" striped hovered sortable selectable v-model="rowSel" />
        <Listview :items="items" v-model="listActive" variant="outlook" />
        <FluentMenu :tabs="fluentTabs" v-model="fluentTab" @special="exit">
          <template #home><span style="padding:10px">Home tools</span></template>
          <template #view><span style="padding:10px">View tools</span></template>
        </FluentMenu>
      </div>

      <Notify /><Dialog />
    </div>`,
}).mount('#app');