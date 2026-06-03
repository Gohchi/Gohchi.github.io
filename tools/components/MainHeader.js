import { toRefs } from 'vue';

import MenuOption from 'components/MenuOption.js';

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
            <menu-option
              id="download"
              icon="download"
              :options="[['download', 'Descargar'], ['pdf', 'PDF'], ['print', 'Imprimir']]"
              :openMenu="openMenu"
              @change="onClickDownloadOption"
            />

            <menu-option
              id="bg-color"
              icon="colorize"
              :selected="bgColor"
              :options="[['white', 'Blanco'], ['black', 'Negro'], ['gray', 'Gris']]"
              :openMenu="openMenu"
              @change="onClickBgColorOption"
            />
          
            <div class="mdc-menu-surface--anchor">
              <button id="button-line-styles"
                class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                aria-label="Size"
                @click="openMenu('line-styles')"
              >line_style</button>
              <div id="menu-line-styles" class="mdc-menu mdc-menu-surface">
                <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
                  <component v-for="[key, value] in [['NONE', 'Nada'], ['LINE', 'Normal'], ['DASH', 'Líneas']]">
                    <li class="mdc-list-item" role="menuitem"
                      v-bind:class="(lineStyles==key ? 'mdc-list-item--selected' : null)"
                      @click="lineStyles=key; changeType();"
                    >
                      <span class="mdc-list-item__ripple"></span>
                      <span class="mdc-list-item__text">{{ value }}</span>
                    </li>
                  </component>
                </ul>
              </div>
            </div>

            <div class="mdc-menu-surface--anchor">
              <button id="button-sizes" class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                aria-label="Size"
                @click="openMenu('sizes')"
              >photo_size_select_large</button>
              <div id="menu-sizes" class="mdc-menu mdc-menu-surface">
                <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
                  <component v-for="item in ['A4', 'A3', 'CUSTOM']">
                    <li class="mdc-list-item" role="menuitem"
                      v-bind:class="(sizeName==item ? 'mdc-list-item--selected' : null)"
                      @click="sizeName=item; changeType();"
                    >
                      <span class="mdc-list-item__ripple"></span>
                      <span class="mdc-list-item__text">{{ item }}</span>
                    </li>
                  </component>
                </ul>
              </div>
            </div>

            <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Orientation"
              @click="swapOrientation"
            >rotate_90_degrees_ccw</button>

            <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Border"
              @click="swapBorder"
            >{{ showBorder ? 'border_clear' : 'border_outer' }}</button>
            
            <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Refresh"
              v-bind:disabled="!ready" @click="refresh"
            >autorenew</button>
            
            <div class="mdc-menu-surface--anchor">
              <button id="button-more"
                class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                aria-label="Size"
                @click="openMenu('more')"
              >more_vert</button>
              <div id="menu-more" class="mdc-menu mdc-menu-surface">
                <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
                  <component v-for="[key, value] in [['show-type', (showPaperType ? 'Ocultar' : 'Mostrar') + ' tipo de hoja'], ['add-legend', legend ? 'Quitar leyenda' : 'Agregar leyenda']]">
                    <li class="mdc-list-item" role="menuitem"
                      @click="moreOptionSelected(key);"
                    >
                      <span class="mdc-list-item__ripple"></span>
                      <span class="mdc-list-item__text">{{ value }}</span>
                    </li>
                  </component>
                </ul>
              </div>
            </div>

            <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Clear"
              @click="clearAll"
            >clear</button>
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