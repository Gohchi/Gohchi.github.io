export default /*html*/`
  <div class="kana-keyboard">
    <MainHeader
      title="KANJI PRACTICE"
      hideFurigana="true"
      hideZoom="true"
    >
      <div class="keyboard-toolbar-buttons">
        <div class="toolbar-group">
          <button @click="checkWordAnswer">Check</button>
          <button @click="revealWordAnswer">Reveal</button>
          <button @click="newWordTarget">Skip</button>
          <button @click="resetWordScore">Reset</button>
        </div>
      </div>
    </MainHeader>

    <main>
      <div class="card verb-card">
        <template v-if="targetWord">
          <div class="verb-meaning">{{ targetWord.meaning }}</div>
          <div class="prompt" :style="wordPromptStyle">{{ targetWord.word }}</div>
          <div class="verb-target-label">Write the reading in hiragana, or the word in kanji</div>

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
            placeholder="ひらがな or 漢字で入力..."
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

      <SessionHistory :entries="sessionHistory" />
    </main>
  </div>
`;