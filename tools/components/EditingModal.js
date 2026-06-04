export default {
  props: {
    fileRepetitions: Array,
    files: Array,
    repeatOptions: Array,
  },
  methods: {
    click() {
      this.$emit('onClick');
    },
    closeRepeatModal() {
      this.$emit('closeRepeatModal');
    },
    setRepeatCount(index, value) {
      this.$emit('setRepeatCount', index, value);
    }
  },
  template: /*html*/`
    <div class="repeat-modal-backdrop" @click.self="closeRepeatModal"
    >
      <div class="repeat-modal">
        <div class="top-bar">
          <h2>Repeticiones de imágenes</h2>
          <button class="mdc-icon-button" type="button" @click="closeRepeatModal">×</button>
        </div>
        <div class="content">
          <template v-for="(file, index) in files" :key="index">
            <div class="item">
              <span>{{ file.name || 'Imagen ' + (index + 1) }}</span>
              <select
                :value="fileRepetitions[index] || 'rest'"
                @change="e => setRepeatCount(index, e.target.value)"
              >
                <option v-for="([value,label]) in repeatOptions" :key="value" :value="value">{{ label }}</option>
              </select>
            </div>
          </template>
        </div>
        <div class="bottom-bar">
          <button class="mdc-button mdc-button--raised" type="button" @click="closeRepeatModal" style="padding:10px 18px;">Cerrar</button>
        </div>
      </div>
    </div>
  `,
};
              