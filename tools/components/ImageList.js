import NumberField from 'components/NumberField.js';
import SegmentedControl from 'components/SegmentedControl.js';

import { LIMITS } from 'data/mosaic.js';

// List of loaded images. Each row has a thumbnail and its repetition:
//   "Resto"    -> shares the free space with the other "Resto" images
//   "Cantidad" -> an exact number of copies
export default {
  components: { NumberField, SegmentedControl },
  props: {
    items: { type: Array, default: () => [] },
  },
  emits: ['remove', 'repeat'],
  data() {
    return {
      repeatLimits: LIMITS.repeat,
      modes: [
        { value: 'rest', label: 'Resto' },
        { value: 'fixed', label: 'Cantidad' },
      ],
    };
  },
  methods: {
    mode(item) {
      return item.repeat === 'rest' ? 'rest' : 'fixed';
    },
    setMode(item, mode) {
      this.$emit('repeat', item.id, mode === 'rest' ? 'rest' : (item.lastFixed || 1));
    },
  },
  template: /*html*/`
    <ul class="image-list">
      <li v-for="item in items" :key="item.id" class="image-row">
        <img class="thumb" :src="item.url" :alt="item.name" draggable="false" />
        <div class="image-main">
          <div class="image-head">
            <div class="image-text">
              <div class="image-name" :title="item.name">{{ item.name }}</div>
              <div class="image-meta">{{ item.width }} × {{ item.height }} px</div>
            </div>
            <button type="button" class="icon-btn" :aria-label="'Quitar ' + item.name" @click="$emit('remove', item.id)">
              <i class="material-icons" aria-hidden="true">close</i>
            </button>
          </div>
          <div class="image-repeat">
            <SegmentedControl
              small
              label="Repetición"
              :modelValue="mode(item)"
              :options="modes"
              @update:modelValue="value => setMode(item, value)"
            />
            <NumberField
              v-if="item.repeat !== 'rest'"
              compact
              :modelValue="item.repeat"
              :min="repeatLimits[0]"
              :max="repeatLimits[1]"
              @update:modelValue="value => $emit('repeat', item.id, value)"
            />
          </div>
        </div>
      </li>
    </ul>
  `,
};