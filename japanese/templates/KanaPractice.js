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
            v-if="!wordMode"
            label="Kana"
            title="Which kana to practice: basic, dakuten, handakuten, sokuon, combos"
            :options="groupOptions"
            :modelValue="selectedGroups"
            @update:modelValue="setGroups"
          />
          <router-link v-if="siblingTo" :to="siblingTo" class="icon-button" :class="siblingIcon" :title="siblingTitle"></router-link>
          <div v-if="listen" class="icon-button words-toggle" :class="{ on: wordMode }" :title="wordMode ? 'Practicing words: back to single kana' : 'Practice words, kana by kana'" role="button" :aria-pressed="wordMode" @click="toggleUnit()">Words</div>
          <div v-if="listen" class="icon-button" :class="{ 'check-icon': mode === 'type', 'keyboard-icon': mode === 'choice' }" :title="mode === 'type' ? 'Options mode (meaning)' : 'Type mode (reading)'" @click="toggleMode()"></div>
        </div>
      </div>
    </MainHeader>

    <main>
      <div class="card choice-card" :class="[feedbackClass, { 'listen-card': listen }]" @click="listen && onCardClick($event)">
        <WordCorner v-if="!listen" :word="target" />

        <InfoIcons
          :streak="streak"
          :score="score"
          :last="last"
          :mastered="kanaStats"
          :memory="kanaMemory"
          :memory-max="MAX_MEMORY"
        />

        <div style="text-align:center">
          <template v-if="listen">{{ wordMode ? (mode === 'type' ? 'Listen and type the word:' : 'Listen and pick each kana:') : (mode === 'type' ? 'Listen and type the kana:' : 'Listen and pick the kana:') }}</template>
          <template v-else>{{ mode === 'type' ? 'Type this kana:' : 'Which reading matches?' }}</template>
        </div>
        <div v-if="listen" id="prompt" class="listen-prompt" role="img" aria-label="Tap the card to play the sound again">🔊</div>
        <div v-else id="prompt" class="prompt">{{ target }}</div>

        <!-- Words mode: one slot per kana; each answer paints its slot green (right) or red (wrong) -->
        <div v-if="wordMode" class="word-slots" aria-live="polite">
          <span v-for="(slot, i) in slots" :key="i" class="word-slot" :class="[slot.state, { current: i === index && !finished }]">{{ slot.shown || '・' }}</span>
        </div>

        <!-- typing: what the keyboard has typed so far (は → ば → ぱ) and how to get the kana -->
        <div v-if="mode === 'type'" class="typed-preview" :class="{ empty: !pending }" aria-live="polite">{{ pending || '・・・' }}</div>
        <div v-if="hint" class="typing-hint">{{ hint }}</div>

        <div id="status" :class="statusClass">{{ status }}</div>

        <template v-if="mode === 'choice'">
          <div class="choice-grid" :class="{ 'listen-mode': listen }" @click.stop>
            <button
              v-for="option in kanaOptions" :key="target + option.kana"
              class="choice-button"
              @click="chooseKanaOption(option)"
            >{{ listen ? option.kana : option.romaji }}</button>
          </div>
        </template>

      </div>

      <input
        v-if="mode === 'type'"
        ref="capture" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
        @input="onInput" @keydown.enter.prevent="submitTyped" id="capture"
      />

      <SessionHistory :entries="sessionHistory" />
    </main>

    <!-- actions live here so the card only keeps "listen" -->
    <footer class="practice-footer">
      <div class="row">
        <button type="button" @click="newTarget">Next</button>
        <button type="button" @click="resetScore">Reset</button>
        <button type="button" v-if="mode === 'type' && pending" @click="submitTyped">Check</button>
        <button type="button" v-if="mode === 'type'" @click="focusInput">Focus</button>
      </div>
    </footer>
  </div>
`;
