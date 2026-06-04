import { toRefs } from 'vue';

export default {
  props: {
    ready: Boolean,
    sizeName: String,
    orientation: String,
    size: Object,
    customWidth: Number,
    customHeight: Number,
    customRatioBase: String,
    amountHorizontal: Number,
    marginTop: Number,
    marginRight: Number,
    marginBottom: Number,
    marginLeft: Number,
    gap: Number,
  },
  setup(props, { emit }) {
    const {
      ready,
      customWidth,
      customHeight,
      customRatioBase,
      amountHorizontal,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      gap,
    } = toRefs(props);

    return {
      ready,
      customWidth,
      customHeight,
      customRatioBase,
      refresh: () => emit('refresh'),
      updateCustomDimension: (side, value) => emit('updateCustomDimension', side, value),
      changeCustomRatioBase: base => emit('changeCustomRatioBase', base),
      changeAmountHorizontal: value => emit('changeAmountHorizontal', value),
      changeMarginTop: value => emit('changeMarginTop', value),
      changeMarginRight: value => emit('changeMarginRight', value),
      changeMarginBottom: value => emit('changeMarginBottom', value),
      changeMarginLeft: value => emit('changeMarginLeft', value),
      changeGap: value => emit('changeGap', value),
    };
  },
  computed: {
    isMobile() {
      return window?.innerWidth < 700;
    },
  },
  template: /*html*/`
    <div v-if="ready" class="size-type-info mdc-top-app-bar__title">
      <span v-if="sizeName!='CUSTOM'" class="size-info">{{ sizeName }} - {{(orientation == 'v' ? 'vertical' : 'horizontal')}} ({{ size.width }}x{{ size.height }})</span>
      
      <div v-if="sizeName=='CUSTOM'" class="custom-sizes">
        <span class="size-info">
          Custom ({{ customRatioBase }})
        </span>
        <span>
          {{ orientation == 'v' ? 'vertical' : 'horizontal' }}
        </span>
        <span>
          ({{ size.width }}x{{ size.height }})
        </span>

        <select
          class="custom-ratio-select"
          :value="customRatioBase"
          @change="changeCustomRatioBase($event.target.value)"
        >
          <option value="A4">Ratio A4</option>
          <option value="A3">Ratio A3</option>
        </select>

        <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--with-leading-icon">
          <span class="mdc-notched-outline">
            <span class="mdc-notched-outline__leading"></span>
            <span class="mdc-notched-outline__trailing"></span>
          </span>
          <i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading">
            {{ orientation=='h' ? 'swap_horiz' : 'swap_vert' }}
          </i>
          <input
            class="mdc-text-field__input"
            type="number"
            min="1"
            :value="customWidth"
            @change="updateCustomDimension('width', $event.target.value)"
          />
        </label>

        <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--with-leading-icon">
          <span class="mdc-notched-outline">
            <span class="mdc-notched-outline__leading"></span>
            <span class="mdc-notched-outline__trailing"></span>
          </span>
          <i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading">
            {{ orientation=='v' ? 'swap_horiz' : 'swap_vert' }}
          </i>
          <input
            class="mdc-text-field__input"
            type="number"
            min="1"
            :value="customHeight"
            @change="updateCustomDimension('height', $event.target.value)"
          />
        </label>
      </div>

      <details class="accordion-item">
        <summary class="accordion-header">
          <span># por línea</span>
          <i class="material-icons accordion-icon">expand_more</i>
        </summary>
        <div class="accordion-content">
          <div>
            <input
              class="mdc-text-field__input number-two-digits"
              type="number"
              min="1"
              :value="amountHorizontal"
              @keyup="changeAmountHorizontal($event.target.value);"
            />
      
            <template v-if="isMobile">
              <button
                class="material-icons mdc-icon-button"
                @click="changeAmountHorizontal(amountHorizontal - 1);"
              >keyboard_arrow_left</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeAmountHorizontal(amountHorizontal - 10);"
              >keyboard_double_arrow_left</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeAmountHorizontal(amountHorizontal + 10);"
              >keyboard_double_arrow_right</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeAmountHorizontal(amountHorizontal + 1);"
              >keyboard_arrow_right</button>
            </template>
          </div>
        </div>
      </details>

      <details class="accordion-item">
        <summary class="accordion-header">
          <span>Margen</span>
          <i class="material-icons accordion-icon">expand_more</i>
        </summary>
        <div class="accordion-content">
          <div>
            <span class="margin-label">Arriba:</span>
            <input
              class="mdc-text-field__input number-two-digits"
              type="number"
              min="0"
              :value="marginTop"
              @keyup="changeMarginTop($event.target.value);"
            />
            
            <template v-if="isMobile">
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginTop(marginTop - 1);"
              >keyboard_arrow_left</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginTop(marginTop - 10);"
              >keyboard_double_arrow_left</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginTop(marginTop + 10);"
              >keyboard_double_arrow_right</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginTop(marginTop + 1);"
              >keyboard_arrow_right</button>
            </template>
          </div>
          <div>
            <span class="margin-label">Derecha:</span>
            <input
              class="mdc-text-field__input number-two-digits"
              type="number"
              min="0"
              :value="marginRight"
              @keyup="changeMarginRight($event.target.value);"
            />
            
            <template v-if="isMobile">
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginRight(marginRight - 1);"
              >keyboard_arrow_left</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginRight(marginRight - 10);"
              >keyboard_double_arrow_left</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginRight(marginRight + 10);"
              >keyboard_double_arrow_right</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginRight(marginRight + 1);"
              >keyboard_arrow_right</button>
            </template>
          </div>
          <div>
            <span class="margin-label">Abajo:</span>
            <input
              class="mdc-text-field__input number-two-digits"
              type="number"
              min="0"
              :value="marginBottom"
              @keyup="changeMarginBottom($event.target.value);"
            />
            
            <template v-if="isMobile">
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginBottom(marginBottom - 1);"
              >keyboard_arrow_left</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginBottom(marginBottom - 10);"
              >keyboard_double_arrow_left</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginBottom(marginBottom + 10);"
              >keyboard_double_arrow_right</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginBottom(marginBottom + 1);"
              >keyboard_arrow_right</button>
            </template>
          </div>
          <div>
            <span class="margin-label">Izquierda:</span>
            <input
              class="mdc-text-field__input number-two-digits"
              type="number"
              min="0"
              :value="marginLeft"
              @keyup="changeMarginLeft($event.target.value);"
            />
                
            <template v-if="isMobile">
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginLeft(marginLeft - 1);"
              >keyboard_arrow_left</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginLeft(marginLeft - 10);"
              >keyboard_double_arrow_left</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginLeft(marginLeft + 10);"
              >keyboard_double_arrow_right</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeMarginLeft(marginLeft + 1);"
              >keyboard_arrow_right</button>
            </template>
          </div>
        </div>
      </details>

      <details class="accordion-item">
        <summary class="accordion-header">
          <span>Espacio</span>
          <i class="material-icons accordion-icon">expand_more</i>
        </summary>
        <div class="accordion-content">
          <div>
            <input
              class="mdc-text-field__input number-two-digits"
              type="number"
              min="0"
              :value="gap"
              @keyup="changeGap($event.target.value);"
            />
            
            <template v-if="isMobile">
              <button
                class="material-icons mdc-icon-button"
                @click="changeGap(gap - 1);"
              >keyboard_arrow_left</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeGap(gap - 10);"
              >keyboard_double_arrow_left</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeGap(gap + 10);"
              >keyboard_double_arrow_right</button>
              <button
                class="material-icons mdc-icon-button"
                @click="changeGap(gap + 1);"
              >keyboard_arrow_right</button>
            </template>
          </div>
        </div>
      </details>
    </div>`
};