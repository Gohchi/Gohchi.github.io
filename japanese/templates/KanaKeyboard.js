export default /*html*/`
  <div class="kana-keyboard practice-sections">
    <MainHeader
      title="KANA PRACTICE"
      hideFurigana="true"
      hideZoom="true"
    >
      <div class="keyboard-toolbar-buttons">
        <div class="toolbar-group">
          <div class="icon-button" :class="{ 'hiragana-icon': kanaMode === 'katakana', 'katakana-icon': kanaMode === 'hiragana' }" title="Kana mode" @click="switchKanaMode()"></div>
          <div class="icon-button keyboard-icon" title="Type mode" v-if="inputMode === 'choice'" @click="setInputMode('type')"></div>
          <div class="icon-button check-icon" title="Options mode" v-if="inputMode === 'type'" @click="setInputMode('choice')"></div>
        </div>
      </div>
    </MainHeader>

    <main>
      <div class="card kanji-card">
        <WordCorner :word="target" />

        <div class="info-icons">
          <div class="streak">
            <div class="icon fire-mask" :class="{ active: streak > 0 }"></div>
            {{ streak }}
          </div>
          <div class="score">
            <div class="icon star-mask"></div>
            {{ score }}
          </div>
          <div class="last">
            <div class="icon return-mask"></div>
            {{ last }}
          </div>
          <div class="mastered">
            <div class="icon mastered-mask"></div>
            {{ kanaStats.mastered }}/{{ kanaStats.total }}
          </div>
        </div>

        <div style="text-align:center">
          {{ inputMode === 'type' ? 'Type this kana:' : 'Which reading matches?' }}
        </div>
        <div id="prompt" class="prompt">{{ target }}</div>

        <div class="memory-bar" :title="'Memory: ' + kanaMemory + '/' + MAX_MEMORY">
          <span v-for="n in MAX_MEMORY" :key="n" class="memory-dot" :class="{ filled: n <= kanaMemory }"></span>
        </div>

        <div id="status" :class="statusClass">{{ status }}</div>

        <template v-if="inputMode === 'choice'">
          <div class="choice-grid">
            <button
              v-for="option in kanaOptions" :key="option.kana"
              class="choice-button"
              @click="chooseKanaOption(option)"
            >{{ option.romaji }}</button>
          </div>
        </template>

        <div class="row">
          <button @click="newTarget">Next</button>
          <button @click="resetScore">Reset</button>
          <button v-if="inputMode === 'type'" @click="focusInput">Focus</button>
        </div>
      </div>

      <input
        v-if="inputMode === 'type'"
        ref="capture" autocomplete="off" v-model="inputValue" @input="onInput" id="capture"
      />

      <SessionHistory :entries="sessionHistory" />
    </main>
  </div>
`;