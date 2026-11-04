// Shared by /hiragana-practice, /hiragana-keyboard, /hiragana-listen and the katakana ones
// (see views/KanaPractice.js). The route decides the script and whether you pick, type or listen.
export default /*html*/`
  <div class="kana-keyboard practice-sections">
    <MainHeader
      :title="title"
      hideFurigana="true"
      hideZoom="true"
    >
      <div class="keyboard-toolbar-buttons">
        <div class="toolbar-group">
          <FilterMenu
            label="Kana"
            title="Which kana to practice: basic, dakuten, handakuten, sokuon, combos"
            :options="groupOptions"
            :modelValue="selectedGroups"
            @update:modelValue="setGroups"
          />
          <router-link v-if="siblingTo" :to="siblingTo" class="icon-button" :class="siblingIcon" :title="siblingTitle"></router-link>
          <div v-if="listen" class="icon-button" :class="{ 'check-icon': mode === 'type', 'keyboard-icon': mode === 'choice' }" :title="mode === 'type' ? 'Options mode (meaning)' : 'Type mode (reading)'" @click="toggleMode()"></div>
        </div>
      </div>
    </MainHeader>

    <main>
      <div class="card choice-card" :class="feedbackClass">
        <WordCorner v-if="!listen" :word="target" />

        <InfoIcons
          :streak="streak"
          :score="score"
          :last="last"
          :mastered="kanaStats"
        />

        <div style="text-align:center">
          <template v-if="listen">{{ mode === 'type' ? 'Listen and type the kana:' : 'Listen and pick the kana:' }}</template>
          <template v-else>{{ mode === 'type' ? 'Type this kana:' : 'Which reading matches?' }}</template>
        </div>
        <button v-if="listen" type="button" id="prompt" class="listen-prompt" title="Play the sound again" aria-label="Play the sound again" @click="playTarget">🔊</button>
        <div v-else id="prompt" class="prompt">{{ target }}</div>

        <div class="memory-bar" :title="'Memory: ' + kanaMemory + '/' + MAX_MEMORY">
          <span v-for="n in MAX_MEMORY" :key="n" class="memory-dot" :class="{ filled: n <= kanaMemory }"></span>
        </div>

        <!-- typing: what the keyboard has typed so far (は → ば → ぱ) and how to get the kana -->
        <div v-if="mode === 'type'" class="typed-preview" :class="{ empty: !pending }" aria-live="polite">{{ pending || '・・・' }}</div>
        <div v-if="hint" class="typing-hint">{{ hint }}</div>

        <div id="status" :class="statusClass">{{ status }}</div>

        <template v-if="mode === 'choice'">
          <div class="choice-grid" :class="{ 'listen-mode': listen }">
            <button
              v-for="option in kanaOptions" :key="target + option.kana"
              class="choice-button"
              @click="chooseKanaOption(option)"
            >{{ listen ? option.kana : option.romaji }}</button>
          </div>
        </template>

        <div class="row">
          <button @click="newTarget">Next</button>
          <button @click="resetScore">Reset</button>
          <button v-if="mode === 'type' && pending" @click="submitTyped">Check</button>
          <button v-if="mode === 'type'" @click="focusInput">Focus</button>
        </div>
      </div>

      <input
        v-if="mode === 'type'"
        ref="capture" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
        @input="onInput" @keydown.enter.prevent="submitTyped" id="capture"
      />

      <SessionHistory :entries="sessionHistory" />
    </main>
  </div>
`;
