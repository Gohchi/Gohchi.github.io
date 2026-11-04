export default /*html*/`
  <div class="practice-sections" :class="script + '-practice'">
    <MainHeader
      :title="title"
      hideFurigana="true"
      hideZoom="true"
    >
      <div class="keyboard-toolbar-buttons">
        <div class="toolbar-group">
          <FilterMenu
            label="JLPT"
            title="JLPT levels"
            :options="levelOptions"
            :modelValue="selectedLevels"
            @update:modelValue="setLevels"
          />
          <div class="icon-button check-icon" title="Options mode (meaning)" v-if="inputMode === 'type'" @click.stop="setInputMode('choice')"></div>
          <div class="icon-button keyboard-icon" title="Type mode (reading)" v-if="inputMode === 'choice'" @click.stop="setInputMode('type')"></div>
        </div>
      </div>
    </MainHeader>

    <main>
      <div class="card choice-card" :class="feedbackClass">
        <template v-if="targetWord">
          <WordCorner :word="targetWord.word" :level="targetWord.level" />

          <InfoIcons
            :streak="wordStreak"
            :score="wordScore"
            :mastered="wordStats"
            :memory="wordMemory"
            :memory-max="MAX_MEMORY"
          />

          <!-- the meaning is the answer in choice mode, so it is hidden there -->
          <div class="verb-meaning" v-if="inputMode === 'type'">{{ targetWord.meaning }}</div>
          <div class="prompt" :style="wordPromptStyle">{{ targetWord.word }}</div>
          <div class="verb-target-label">
            {{ inputLabel }}
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
              class="type-input"
              placeholder="ひらがなで入力..."
            />
          </template>
          <template v-else>
            <div class="choice-grid verb-choice-grid">
              <button
                v-for="option in wordOptions" :key="targetWord.word + option"
                class="choice-button"
                :class="{ correct: wordLocked && option === targetWord.meaning, wrong: wrongOptions.includes(option) }"
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
        </template>

        <template v-else>
          <div :class="wordStatusClass">{{ wordStatus }}</div>
          <div class="row" v-if="!words.length">
            <router-link :to="kanaRoute" class="step-link">Practice {{ script }} characters →</router-link>
          </div>
        </template>
      </div>

      <section class="locked-words" v-if="lockedWords.length && lockedPref.on">
        <button type="button" class="progress-toggle" @click="showLocked = !showLocked">
          🔒 {{ lockedWords.length }} locked {{ lockedWords.length === 1 ? 'word' : 'words' }}
          · {{ showLocked ? 'hide' : 'show what they need' }}
        </button>
        <ul v-if="showLocked" class="locked-words-list">
          <li v-for="item in lockedWords" :key="item.word">
            <span class="locked-word" :title="item.needs">
              <span v-for="(part, i) in markKana(item.word, item.missing)" :key="i" :class="part.missing ? 'kana-missing' : 'kana-ok'">{{ part.ch }}</span>
            </span>
          </li>
        </ul>
      </section>
      <SessionHistory :entries="sessionHistory" />
    </main>
  </div>
`;