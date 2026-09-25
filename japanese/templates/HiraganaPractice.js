export default /*html*/`
  <div class="kana-keyboard">
    <MainHeader
      title="HIRAGANA PRACTICE"
      hideFurigana="true"
      hideZoom="true"
    >
      <div class="keyboard-toolbar-buttons">
        <div class="toolbar-group">
          <button :class="{ active: practiceMode === 'kana' }" title="Characters" @click="setPracticeMode('kana')">文字</button>
          <button :class="{ active: practiceMode === 'words' }" title="Words" @click="setPracticeMode('words')">単語</button>
        </div>
        <div class="toolbar-group" v-if="practiceMode === 'kana'">
          <div class="icon-button keyboard-icon" title="Type mode" v-if="inputMode === 'choice'" @click="setInputMode('type')"></div>
          <div class="icon-button check-icon" title="Options mode" v-if="inputMode === 'type'" @click="setInputMode('choice')"></div>
        </div>
        <div class="toolbar-group">
          <template v-if="practiceMode === 'kana'">
            <button @click="newTarget">Next</button>
            <button @click="resetScore">Reset</button>
            <button v-if="inputMode === 'type'" @click="focusInput">Focus</button>
          </template>
          <template v-else>
            <button @click="checkWordAnswer">Check</button>
            <button @click="revealWordAnswer">Reveal</button>
            <button @click="newWordTarget">Skip</button>
            <button @click="resetWordScore">Reset</button>
          </template>
        </div>
      </div>
    </MainHeader>

    <main>
      <!-- Characters practice -->
      <div class="card" v-if="practiceMode === 'kana'">
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

        <div class="stats">
          <div>Score: <span id="score">{{ score }}</span></div>
          <div>Streak: <span id="streak">{{ streak }}</span></div>
          <div>Last: <span id="last">{{ last }}</span></div>
        </div>
        <div class="stats memory-stats">
          <div>🧠 Mastered: <span>{{ kanaStats.mastered }}/{{ kanaStats.total }}</span></div>
        </div>
      </div>

      <!-- Words practice -->
      <div class="card verb-card" v-else>
        <template v-if="targetWord">
          <div class="verb-meaning">{{ targetWord.meaning }}</div>
          <div class="prompt" :style="wordPromptStyle">{{ targetWord.word }}</div>

          <div class="memory-bar" :title="'Memory: ' + wordMemory + '/' + MAX_MEMORY">
            <span v-for="n in MAX_MEMORY" :key="n" class="memory-dot" :class="{ filled: n <= wordMemory }"></span>
          </div>

          <input
            ref="wordInput"
            v-model="wordInputValue"
            @keydown.enter="onWordEnter"
            :readonly="wordLocked"
            autofocus
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            lang="ja"
            class="verb-input"
            placeholder="ひらがなで入力..."
          />

          <div :class="wordStatusClass">{{ wordStatus }}</div>

          <div class="stats">
            <div>Score: <span>{{ wordScore }}</span></div>
            <div>Streak: <span>{{ wordStreak }}</span></div>
          </div>
          <div class="stats memory-stats">
            <div>🧠 Mastered: <span>{{ wordStats.mastered }}/{{ wordStats.total }}</span></div>
          </div>
        </template>

        <template v-else>
          <div :class="wordStatusClass">{{ wordStatus }}</div>
        </template>
      </div>

      <!-- Hidden input for IME-safe capture, only used in characters type mode -->
      <input
        v-if="practiceMode === 'kana' && inputMode === 'type'"
        ref="capture" autocomplete="off" v-model="inputValue" @input="onInput" id="capture"
      />

      <SessionHistory :entries="sessionHistory" />
    </main>
  </div>
`;