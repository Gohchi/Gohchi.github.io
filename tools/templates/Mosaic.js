export default /*html*/`
  <div class="mosaic">
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <h1>Mosaicos</h1>
      </div>

      <div class="topbar-actions">
        <button type="button" class="btn" aria-label="Agregar imágenes" @click="pickFiles">
          <i class="material-icons" aria-hidden="true">add_photo_alternate</i>
          <span class="label-long">Agregar imágenes</span>
        </button>

        <div class="menu-wrap" @click.stop>
          <button
            type="button"
            class="btn primary"
            aria-haspopup="menu"
            :aria-expanded="exportOpen"
            :disabled="!images.length || !!busy"
            @click="exportOpen = !exportOpen"
          >
            <i class="material-icons" aria-hidden="true">file_download</i>
            <span>{{ busy ? 'Generando…' : 'Exportar' }}</span>
          </button>

          <div v-if="exportOpen" class="menu" role="menu">
            <button type="button" role="menuitem" class="menu-item" @click="runExport('png')">
              <i class="material-icons" aria-hidden="true">image</i>
              <span><strong>Imagen PNG</strong><small>{{ sizeText }}</small></span>
            </button>
            <button type="button" role="menuitem" class="menu-item" @click="runExport('pdf')">
              <i class="material-icons" aria-hidden="true">picture_as_pdf</i>
              <span><strong>PDF</strong><small>Listo para imprimir o enviar</small></span>
            </button>
            <button v-if="!isCoarse" type="button" role="menuitem" class="menu-item" @click="runExport('print')">
              <i class="material-icons" aria-hidden="true">print</i>
              <span><strong>Imprimir</strong><small>Abre el diálogo de impresión</small></span>
            </button>
            <button v-if="canShare" type="button" role="menuitem" class="menu-item" @click="runExport('share')">
              <i class="material-icons" aria-hidden="true">share</i>
              <span><strong>Compartir</strong><small>Enviar a otra app</small></span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="workspace">
      <section class="stage">
        <div
          ref="stage"
          class="stage-scroll"
          :class="{ pannable: zoom > 1 }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel="onWheel"
        >
          <div class="paper-wrap">
            <canvas
              ref="canvas"
              class="paper"
              :style="canvasStyle"
              role="img"
              :aria-label="'Vista previa de la hoja ' + infoText"
            ></canvas>
          </div>
        </div>

        <div class="paper-info" aria-live="polite">
          <span>{{ infoText }}</span>
          <span>{{ sizeText }}</span>
          <span v-if="images.length">{{ tiles }} {{ tiles === 1 ? 'pieza' : 'piezas' }}</span>
        </div>

        <div class="zoom-bar" role="group" aria-label="Zoom">
          <button type="button" class="icon-btn" aria-label="Alejar" :disabled="zoom <= 1" @click="zoomBy(1 / 1.25)">
            <i class="material-icons" aria-hidden="true">zoom_out</i>
          </button>
          <button type="button" class="zoom-label" title="Ajustar a la pantalla" @click="setZoom(1)">{{ zoomLabel }}</button>
          <button type="button" class="icon-btn" aria-label="Acercar" :disabled="zoom >= 6" @click="zoomBy(1.25)">
            <i class="material-icons" aria-hidden="true">zoom_in</i>
          </button>
        </div>

        <div v-if="!images.length" class="empty">
          <div class="empty-card">
            <i class="material-icons" aria-hidden="true">add_photo_alternate</i>
            <h2>Empezá con tus imágenes</h2>
            <p>{{ emptyText }}</p>
            <button type="button" class="btn primary" @click="pickFiles">Elegir imágenes</button>
          </div>
        </div>

        <div v-if="dragging" class="drop-hint">
          <i class="material-icons" aria-hidden="true">add_photo_alternate</i>
          <span>Soltá las imágenes para agregarlas</span>
        </div>
      </section>

      <aside class="panel" :class="{ collapsed: isMobile && !sheetOpen }">
        <button
          type="button"
          class="sheet-handle"
          :aria-label="sheetOpen ? 'Ocultar opciones' : 'Mostrar opciones'"
          @click="sheetOpen = !sheetOpen"
        ><span></span></button>

        <nav class="tabs" role="tablist" aria-label="Opciones">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            role="tab"
            class="tab"
            :class="{ active: activeTab === tab.key }"
            :aria-selected="activeTab === tab.key"
            @click="selectTab(tab.key)"
          >
            <i class="material-icons" aria-hidden="true">{{ tab.icon }}</i>
            <span>{{ tab.label }}</span>
            <em v-if="tab.key === 'images' && images.length" class="badge">{{ images.length }}</em>
          </button>
        </nav>

        <div class="panel-body" role="tabpanel">

          <template v-if="activeTab === 'paper'">
            <section class="group">
              <h2 class="group-title">Tamaño de hoja</h2>
              <SegmentedControl
                label="Tamaño de hoja"
                :modelValue="settings.paper"
                :options="paperOptions"
                @update:modelValue="setPaper"
              />
              <SegmentedControl
                label="Orientación"
                v-model="settings.orientation"
                :options="orientationOptions"
              />
            </section>

            <section v-if="settings.paper === 'CUSTOM'" class="group">
              <h2 class="group-title">Medidas personalizadas</h2>
              <p class="hint">
                Mantiene la proporción de la hoja elegida. Con la hoja en vertical, una más chica se genera más rápido.
              </p>
              <SegmentedControl
                label="Proporción"
                :modelValue="settings.customRatioBase"
                :options="ratioOptions"
                @update:modelValue="setRatio"
              />
              <div class="field-row">
                <NumberField
                  label="Ancho"
                  unit="px"
                  compact
                  :step="100"
                  :modelValue="settings.customWidth"
                  :min="limits.custom[0]"
                  :max="limits.custom[1]"
                  @update:modelValue="value => setCustom('width', value)"
                />
                <NumberField
                  label="Alto"
                  unit="px"
                  compact
                  :step="100"
                  :modelValue="settings.customHeight"
                  :min="limits.custom[0]"
                  :max="limits.custom[1]"
                  @update:modelValue="value => setCustom('height', value)"
                />
              </div>
            </section>
          </template>

          <template v-else-if="activeTab === 'layout'">
            <section class="group">
              <h2 class="group-title">Distribución</h2>
              <NumberField
                label="Imágenes por línea"
                slider
                :sliderMax="12"
                v-model="settings.columns"
                :min="limits.columns[0]"
                :max="limits.columns[1]"
              />
              <NumberField
                label="Espacio entre imágenes"
                unit="px"
                slider
                :sliderMax="120"
                v-model="settings.gap"
                :min="limits.gap[0]"
                :max="limits.gap[1]"
              />
            </section>

            <section class="group">
              <h2 class="group-title">Márgenes</h2>
              <div class="field-grid">
                <NumberField label="Arriba" unit="px" compact :step="5" v-model="settings.marginTop" :min="limits.margin[0]" :max="limits.margin[1]" />
                <NumberField label="Abajo" unit="px" compact :step="5" v-model="settings.marginBottom" :min="limits.margin[0]" :max="limits.margin[1]" />
                <NumberField label="Izquierda" unit="px" compact :step="5" v-model="settings.marginLeft" :min="limits.margin[0]" :max="limits.margin[1]" />
                <NumberField label="Derecha" unit="px" compact :step="5" v-model="settings.marginRight" :min="limits.margin[0]" :max="limits.margin[1]" />
              </div>
            </section>
          </template>

          <template v-else-if="activeTab === 'images'">
            <section class="group">
              <div class="group-head">
                <h2 class="group-title">{{ images.length }} {{ images.length === 1 ? 'imagen' : 'imágenes' }}</h2>
                <div class="group-actions">
                  <button type="button" class="btn small" @click="pickFiles">
                    <i class="material-icons" aria-hidden="true">add</i><span>Agregar</span>
                  </button>
                  <button type="button" class="btn small danger" :disabled="!images.length" @click="clearImages">
                    <i class="material-icons" aria-hidden="true">delete_sweep</i><span>Quitar todas</span>
                  </button>
                </div>
              </div>

              <p v-if="!images.length" class="hint">Todavía no hay imágenes. Agregá algunas para armar la hoja.</p>

              <ImageList :items="images" @remove="removeImage" @repeat="setRepeat" />

              <p v-if="images.length" class="hint">
                <strong>Cantidad</strong> pone esa cantidad de copias primero.
                <strong>Resto</strong> reparte el espacio que queda entre las imágenes marcadas así.
              </p>
            </section>
          </template>

          <template v-else>
            <section class="group">
              <h2 class="group-title">Fondo del área de imágenes</h2>
              <SegmentedControl label="Fondo" v-model="settings.background" :options="backgroundOptions" />
            </section>

            <section class="group">
              <h2 class="group-title">Borde del área</h2>
              <SegmentedControl label="Borde" v-model="settings.lineStyle" :options="lineOptions" />
            </section>

            <section class="group">
              <h2 class="group-title">Texto en el margen superior</h2>
              <label class="switch">
                <span>Mostrar tamaño de hoja</span>
                <input type="checkbox" v-model="settings.showPaperType" />
                <span class="track" aria-hidden="true"></span>
              </label>
              <label class="text-field">
                <span class="field-label">Leyenda</span>
                <input type="text" v-model="settings.legend" maxlength="80" placeholder="Opcional" autocomplete="off" />
              </label>
              <p v-if="labelHint" class="hint">{{ labelHint }}</p>
            </section>
          </template>

        </div>
      </aside>
    </main>

    <div v-if="toast" class="toast" :class="{ error: toast.error }" role="status" aria-live="polite">{{ toast.text }}</div>

    <input ref="fileInput" type="file" accept="image/*" multiple hidden @change="onFilesPicked" />
  </div>
`;