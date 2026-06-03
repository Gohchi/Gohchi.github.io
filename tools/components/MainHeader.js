import { toRefs } from 'vue';

import MenuOption from 'components/MenuOption.js';
import ButtonOption from 'components/ButtonOption.js';

export default {
  props: {
    title: String,
    ready: Boolean,
    showBorder: Boolean,
    showPaperType: Boolean,
    legend: String,
    hideZoom: Boolean,
  },
  components: {
    MenuOption,
    ButtonOption,
  },
  setup(props, { emit }) {
    const {
      title,
      ready,
      showBorder,
      showPaperType,
      legend,
      hideZoom,
    } = toRefs(props);

    return {
      title: title ?? 'Mosaicos',
      bgColor: 'white',
      lineStyles: 'LINE',
      sizeName: 'A4',
      download: 'download',
      fileLoaded: () => emit('fileLoaded'),
      refresh: () => emit('refresh'),
      swapOrientation: () => emit('swapOrientation'),
      swapBorder: () => emit('swapBorder'),
      clearAll: () => emit('clearAll'),
      moreOptionSelected: option => emit('moreOptionSelected', option),
      openMenu: id => emit('openMenu', id),
      downloadFile: action => emit('downloadFile', action),
    };
  },
  methods: {
    changeType() {
      this.$emit('changeType', this.bgColor, this.lineStyles, this.sizeName, this.download);
    },
    onClickDownloadOption(key) {
      this.downloadFile(key);
      this.changeType();
    },
    onClickBgColorOption(key) {
      this.bgColor = key;
      this.changeType();
    },
    onClickLineStylesOption(key) {
      this.lineStyles = key;
      this.changeType();
    },
    onClickSizeOption(key) {
      this.sizeName = key;
      this.changeType();
    }
  },
  template: /*html*/`
    <header class="mdc-top-app-bar">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <!-- <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button" aria-label="Open navigation menu">menu</button> -->
          <!-- <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Help" @click="showHelp=!showHelp">help</button> -->
          <div class="main-icon"></div>
          <span class="mdc-top-app-bar__title">{{ title }}</span>
        </section>
        <section id="toolbar-actions" class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
          <template v-if="ready">
            <MenuOption
              id="download"
              icon="download"
              :options="[['download', 'Descargar'], ['pdf', 'PDF'], ['print', 'Imprimir']]"
              :openMenu="openMenu"
              @change="onClickDownloadOption"
            />

            <MenuOption
              id="bg-color"
              icon="colorize"
              :selected="bgColor"
              :options="[['white', 'Blanco'], ['black', 'Negro'], ['gray', 'Gris']]"
              :openMenu="openMenu"
              @change="onClickBgColorOption"
            />

            <MenuOption
              id="line-styles"
              icon="line_style"
              :selected="lineStyles"
              :options="[['NONE', 'Nada'], ['LINE', 'Normal'], ['DASH', 'Líneas']]"
              :openMenu="openMenu"
              @change="onClickLineStylesOption"
            />

            <MenuOption
              id="sizes"
              icon="photo_size_select_large"
              :selected="sizeName"
              :options="[['A4', 'A4'], ['A3', 'A3'], ['CUSTOM', 'Personalizado']]"
              :openMenu="openMenu"
              @change="onClickSizeOption"
            />

            <ButtonOption
              icon="rotate_90_degrees_ccw"
              @onClick="swapOrientation"
            />

            <ButtonOption
              :icon="showBorder ? 'border_clear' : 'border_outer'"
              @onClick="swapBorder"
            />
            
            <ButtonOption
              icon="autorenew"
              v-bind:disabled="!ready"
              @onClick="refresh"
            />
            
            <MenuOption
              id="more"
              icon="more_vert"
              :options="[['show-type', (showPaperType ? 'Ocultar' : 'Mostrar') + ' tipo de hoja'], ['add-legend', legend ? 'Quitar leyenda' : 'Agregar leyenda']]"
              :openMenu="openMenu"
              @change="moreOptionSelected"
            />
            
            <ButtonOption
              icon="clear"
              @onClick="clearAll"
            />
          </template>

          <label v-if="!ready" class="mdc-button mdc-button--outlined mdc-top-app-bar__action-item load-file-button">
            <input type="file" id="file" v-on:change="fileLoaded" style="display: none;">
            <div class="mdc-button__ripple"></div>
            <span class="mdc-button__label">Cargar</span>
          </label>
        </section>
      </div>
    </header>
  `,
};