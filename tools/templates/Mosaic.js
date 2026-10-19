export default /*html*/`
  <div class="mosaic">
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <h1>{{ t('app.title') }}</h1>
      </div>

      <div class="topbar-actions">
        <LanguageSwitch />

        <button type="button" class="btn" :aria-label="t('top.addImages')" @click="pickFiles">
          <i class="material-icons" aria-hidden="true">add_photo_alternate</i>
          <span class="label-long">{{ t('top.addImages') }}</span>
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
            <span>{{ busy ? t('top.generating') : t('top.export') }}</span>
          </button>

          <div v-if="exportOpen" class="menu" role="menu">
            <button type="button" role="menuitem" class="menu-item" @click="runExport('png')">
              <i class="material-icons" aria-hidden="true">image</i>
              <span><strong>{{ t('export.png') }}</strong><small>{{ sizeText }}</small></span>
            </button>
            <button type="button" role="menuitem" class="menu-item" @click="runExport('pdf')">
              <i class="material-icons" aria-hidden="true">picture_as_pdf</i>
              <span><strong>{{ t('export.pdf') }}</strong><small>{{ t('export.pdfHint') }}</small></span>
            </button>
            <button v-if="!isCoarse" type="button" role="menuitem" class="menu-item" @click="runExport('print')">
              <i class="material-icons" aria-hidden="true">print</i>
              <span><strong>{{ t('export.print') }}</strong><small>{{ t('export.printHint') }}</small></span>
            </button>
            <button v-if="canShare" type="button" role="menuitem" class="menu-item" @click="runExport('share')">
              <i class="material-icons" aria-hidden="true">share</i>
              <span><strong>{{ t('export.share') }}</strong><small>{{ t('export.shareHint') }}</small></span>
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
              :aria-label="t('info.preview') + ' ' + infoText"
            ></canvas>
          </div>
        </div>

        <div class="paper-info" aria-live="polite">
          <span>{{ infoText }}</span>
          <button
            type="button"
            class="chip-btn"
            :title="t('info.toggleUnit', { unit: unitPaper === 'px' ? 'cm' : 'px' })"
            @click="toggleUnit('unitPaper')"
          >{{ paperSizeLabel }}</button>
          <span v-if="images.length">{{ tiles }} {{ tiles === 1 ? t('info.piece') : t('info.pieces') }}</span>
          <button
            v-if="pieceSizeLabel"
            type="button"
            class="chip-btn"
            :title="t('info.pieceTitle', { unit: unitPiece === 'px' ? 'cm' : 'px' })"
            @click="toggleUnit('unitPiece')"
          >{{ pieceSizeLabel }}</button>
        </div>

        <div class="zoom-bar" role="group" :aria-label="t('zoom.label')">
          <button type="button" class="icon-btn" :aria-label="t('zoom.out')" :disabled="zoom <= 1" @click="zoomBy(1 / 1.25)">
            <i class="material-icons" aria-hidden="true">zoom_out</i>
          </button>
          <button type="button" class="zoom-label" :title="t('zoom.fitTitle')" @click="setZoom(1)">{{ zoomLabel }}</button>
          <button type="button" class="icon-btn" :aria-label="t('zoom.in')" :disabled="zoom >= 6" @click="zoomBy(1.25)">
            <i class="material-icons" aria-hidden="true">zoom_in</i>
          </button>
        </div>

        <div v-if="!images.length" class="empty">
          <div class="empty-card">
            <i class="material-icons" aria-hidden="true">add_photo_alternate</i>
            <h2>{{ t('empty.title') }}</h2>
            <p>{{ emptyText }}</p>
            <button type="button" class="btn primary" @click="pickFiles">{{ t('empty.choose') }}</button>
          </div>
        </div>

        <div v-if="dragging" class="drop-hint">
          <i class="material-icons" aria-hidden="true">add_photo_alternate</i>
          <span>{{ t('drop.hint') }}</span>
        </div>
      </section>

      <aside class="panel" :class="{ collapsed: isMobile && !sheetOpen }">
        <button
          type="button"
          class="sheet-handle"
          :aria-label="sheetOpen ? t('sheet.hide') : t('sheet.show')"
          @click="sheetOpen = !sheetOpen"
        ><span></span></button>

        <nav class="tabs" role="tablist" :aria-label="t('tabs.label')">
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
            <span>{{ t('tab.' + tab.key) }}</span>
            <em v-if="tab.key === 'images' && images.length" class="badge">{{ images.length }}</em>
          </button>
        </nav>

        <div class="panel-body" role="tabpanel">

          <template v-if="activeTab === 'paper'">
            <section class="group">
              <h2 class="group-title">{{ t('paper.title') }}</h2>
              <SegmentedControl
                :label="t('paper.title')"
                :modelValue="settings.paper"
                :options="paperOptions"
                @update:modelValue="setPaper"
              />
              <SegmentedControl
                :label="t('orientation.title')"
                v-model="settings.orientation"
                :options="orientationOptions"
              />
            </section>

            <section v-if="settings.paper === 'CUSTOM'" class="group">
              <h2 class="group-title">{{ t('custom.title') }}</h2>
              <p class="hint">{{ t('custom.hint') }}</p>
              <SegmentedControl
                :label="t('custom.ratio')"
                :modelValue="settings.customRatioBase"
                :options="ratioOptions"
                @update:modelValue="setRatio"
              />
              <div class="field-row">
                <NumberField
                  :label="t('custom.width')"
                  unit="px"
                  compact
                  :step="100"
                  :modelValue="settings.customWidth"
                  :min="limits.custom[0]"
                  :max="limits.custom[1]"
                  @update:modelValue="value => setCustom('width', value)"
                />
                <NumberField
                  :label="t('custom.height')"
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
              <h2 class="group-title">{{ t('layout.title') }}</h2>
              <NumberField
                :label="t('layout.perRow')"
                slider
                :sliderMax="12"
                v-model="settings.columns"
                :min="limits.columns[0]"
                :max="limits.columns[1]"
              />
              <NumberField
                :label="t('layout.gap')"
                unit="px"
                slider
                :sliderMax="120"
                v-model="settings.gap"
                :min="limits.gap[0]"
                :max="limits.gap[1]"
              />
            </section>

            <section class="group">
              <h2 class="group-title">{{ t('margins.title') }}</h2>
              <div class="field-grid">
                <NumberField :label="t('margins.top')" unit="px" compact :step="5" v-model="settings.marginTop" :min="limits.margin[0]" :max="limits.margin[1]" />
                <NumberField :label="t('margins.bottom')" unit="px" compact :step="5" v-model="settings.marginBottom" :min="limits.margin[0]" :max="limits.margin[1]" />
                <NumberField :label="t('margins.left')" unit="px" compact :step="5" v-model="settings.marginLeft" :min="limits.margin[0]" :max="limits.margin[1]" />
                <NumberField :label="t('margins.right')" unit="px" compact :step="5" v-model="settings.marginRight" :min="limits.margin[0]" :max="limits.margin[1]" />
              </div>
            </section>
          </template>

          <template v-else-if="activeTab === 'images'">
            <section class="group">
              <div class="group-head">
                <h2 class="group-title">{{ images.length }} {{ images.length === 1 ? t('images.one') : t('images.many') }}</h2>
                <div class="group-actions">
                  <button type="button" class="btn small" @click="pickFiles">
                    <i class="material-icons" aria-hidden="true">add</i><span>{{ t('images.add') }}</span>
                  </button>
                  <button type="button" class="btn small danger" :disabled="!images.length" @click="clearImages">
                    <i class="material-icons" aria-hidden="true">delete_sweep</i><span>{{ t('images.removeAll') }}</span>
                  </button>
                </div>
              </div>

              <p v-if="!images.length" class="hint">{{ t('images.empty') }}</p>

              <ImageList :items="images" @remove="removeImage" @repeat="setRepeat" />

              <p v-if="images.length" class="hint">
                <strong>{{ t('repeat.fixed') }}</strong> {{ t('images.hintFixed') }}
                <strong>{{ t('repeat.rest') }}</strong> {{ t('images.hintRest') }}
              </p>
            </section>
          </template>

          <template v-else>
            <section class="group">
              <h2 class="group-title">{{ t('filter.title') }}</h2>
              <SegmentedControl
                :label="t('filter.title')"
                style="grid-auto-flow: row; grid-template-columns: 1fr 1fr;"
                v-model="settings.filter"
                :options="filterOptions"
              />
              <NumberField
                v-if="showFilterAmount"
                :label="t('filter.amount')"
                unit="%"
                slider
                v-model="settings.filterAmount"
                :min="limits.amount[0]"
                :max="limits.amount[1]"
              />
              <p v-if="settings.filter === 'print'" class="hint">
                <strong>{{ t('filter.print') }}</strong> {{ t('filter.printHint') }}
              </p>
              <p v-else-if="settings.filter === 'fade'" class="hint">{{ t('filter.fadeHint') }}</p>
              <p v-if="settings.filter !== 'none'" class="hint">{{ t('filter.note') }}</p>
            </section>

            <section class="group">
              <h2 class="group-title">{{ t('background.title') }}</h2>
              <SegmentedControl :label="t('background.label')" v-model="settings.background" :options="backgroundOptions" />
            </section>

            <section class="group">
              <h2 class="group-title">{{ t('line.title') }}</h2>
              <SegmentedControl :label="t('line.label')" v-model="settings.lineStyle" :options="lineOptions" />
            </section>

            <section class="group">
              <h2 class="group-title">{{ t('text.title') }}</h2>
              <label class="switch">
                <span>{{ t('text.showPaper') }}</span>
                <input type="checkbox" v-model="settings.showPaperType" />
                <span class="track" aria-hidden="true"></span>
              </label>
              <label class="text-field">
                <span class="field-label">{{ t('text.legend') }}</span>
                <input type="text" v-model="settings.legend" maxlength="80" :placeholder="t('text.optional')" autocomplete="off" />
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