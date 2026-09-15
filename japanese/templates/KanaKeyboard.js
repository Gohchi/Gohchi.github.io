export default /*html*/`
  <div class="kana-keyboard">
    <MainHeader
      title="KANA KEYBOARD"
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
      <div class="card">
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

        <div class="stats">
          <div>Score: <span id="score">{{ score }}</span></div>
          <div>Streak: <span id="streak">{{ streak }}</span></div>
          <div>Last: <span id="last">{{ last }}</span></div>
        </div>
        <div class="stats memory-stats">
          <div>🧠 Mastered: <span>{{ kanaStats.mastered }}/{{ kanaStats.total }}</span></div>
        </div>
      </div>

      <!-- Hidden input for IME-safe capture, only used in type mode -->
      <input
        v-if="inputMode === 'type'"
        ref="capture" autocomplete="off" v-model="inputValue" @input="onInput" id="capture"
      />

      <SessionHistory :entries="sessionHistory" />
    </main>
  </div>
`;