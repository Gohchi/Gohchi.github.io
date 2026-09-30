export default /*html*/`
  <div class="kana-keyboard">
    <MainHeader
      title="HIRAGANA PRACTICE"
      hideFurigana="true"
      hideZoom="true"
    >
      <div class="keyboard-toolbar-buttons">
        <div class="toolbar-group">
          <div class="icon-button keyboard-icon" title="Type mode" v-if="inputMode === 'choice'" @click="setInputMode('type')"></div>
          <div class="icon-button check-icon" title="Options mode" v-if="inputMode === 'type'" @click="setInputMode('choice')"></div>
        </div>
      </div>
    </MainHeader>

    <main>
      <div class="card verb-card">
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

          <div class="row">
            <button @click="checkWordAnswer">Check</button>
            <button @click="revealWordAnswer">Reveal</button>
            <button @click="newWordTarget">Skip</button>
            <button @click="resetWordScore">Reset</button>
          </div>

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