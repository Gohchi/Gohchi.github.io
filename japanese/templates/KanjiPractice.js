export default /*html*/`
  <div class="kana-keyboard">
    <MainHeader
      title="KANJI PRACTICE"
      hideFurigana="true"
      hideZoom="true"
    >
      <div class="keyboard-toolbar-buttons">
        <div class="toolbar-group">
          <div class="icon-button check-icon" title="Options mode (meaning)" v-if="inputMode === 'type'" @click="setInputMode('choice')"></div>
          <div class="icon-button keyboard-icon" title="Type mode (reading)" v-if="inputMode === 'choice'" @click="setInputMode('type')"></div>
        </div>
      </div>
    </MainHeader>

    <main>
      <div class="card verb-card">
        <template v-if="targetWord">
          <!-- the meaning is the answer in choice mode, so it is hidden there -->
          <div class="verb-meaning" v-if="inputMode === 'type'">{{ targetWord.meaning }}</div>
          <div class="prompt" :style="wordPromptStyle">{{ targetWord.word }}</div>
          <div class="verb-target-label">
            {{ inputMode === 'choice' ? 'Pick the meaning' : 'Write the reading in hiragana, or the word in kanji' }}
          </div>

          <div class="memory-bar" :title="'Memory: ' + wordMemory + '/' + MAX_MEMORY">
            <span v-for="n in MAX_MEMORY" :key="n" class="memory-dot" :class="{ filled: n <= wordMemory }"></span>
          </div>

          <template v-if="inputMode === 'type'">
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
          </template>
          <template v-else>
            <div class="choice-grid verb-choice-grid">
              <button
                v-for="option in wordOptions" :key="option"
                class="choice-button"
                :disabled="wordLocked || wordRevealed || wrongOptions.includes(option)"
                @click.stop="chooseMeaning(option)"
              >{{ option }}</button>
            </div>
          </template>

          <div :class="wordStatusClass">{{ wordStatus }}</div>

          <div class="row">
            <button v-if="inputMode === 'type'" @click="checkWordAnswer">Check</button>
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