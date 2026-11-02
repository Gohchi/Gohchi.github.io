// Shared by /hiragana-practice, /hiragana-keyboard, /katakana-practice and /katakana-keyboard
// (see views/KanaPractice.js). The route decides the script and whether you pick or type.
export default /*html*/`
  <div class="kana-keyboard practice-sections">
    <MainHeader
      :title="title"
      hideFurigana="true"
      hideZoom="true"
    >
      <div class="keyboard-toolbar-buttons">
        <div class="toolbar-group">
          <router-link v-if="siblingTo" :to="siblingTo" class="icon-button" :class="siblingIcon" :title="siblingTitle"></router-link>
        </div>
      </div>
    </MainHeader>

    <main>
      <div class="card choice-card" :class="feedbackClass">
        <WordCorner :word="target" />

        <InfoIcons
          :streak="streak"
          :score="score"
          :last="last"
          :mastered="kanaStats"
        />

        <div style="text-align:center">
          {{ mode === 'type' ? 'Type this kana:' : 'Which reading matches?' }}
        </div>
        <div id="prompt" class="prompt">{{ target }}</div>

        <div class="memory-bar" :title="'Memory: ' + kanaMemory + '/' + MAX_MEMORY">
          <span v-for="n in MAX_MEMORY" :key="n" class="memory-dot" :class="{ filled: n <= kanaMemory }"></span>
        </div>

        <div id="status" :class="statusClass">{{ status }}</div>

        <template v-if="mode === 'choice'">
          <div class="choice-grid">
            <button
              v-for="option in kanaOptions" :key="target + option.kana"
              class="choice-button"
              @click="chooseKanaOption(option)"
            >{{ option.romaji }}</button>
          </div>
        </template>

        <div class="row">
          <button @click="newTarget">Next</button>
          <button @click="resetScore">Reset</button>
          <button v-if="mode === 'type'" @click="focusInput">Focus</button>
        </div>
      </div>

      <input
        v-if="mode === 'type'"
        ref="capture" autocomplete="off" v-model="inputValue" @input="onInput" id="capture"
      />

      <SessionHistory :entries="sessionHistory" />
    </main>
  </div>
`;
