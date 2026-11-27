export default /*html*/`
  <div class="location-practice practice-sections">
    <MainHeader
      title="LOCATION PRACTICE"
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
          <KanjiPoolMenu
            label="Pool"
            title="Choose which location words to practice"
            emptyText="No location words for the selected JLPT levels."
            :items="poolItems"
            :excluded="excludedWords"
            @update:excluded="setExcluded"
          />
          <div
            v-if="inputMode === 'choice'"
            class="icon-button words-toggle"
            role="button"
            :title="script === 'kanji' ? 'Options in kanji (click for hiragana)' : 'Options in hiragana (click for kanji)'"
            @click.stop="toggleScript"
          >{{ script === 'kanji' ? '漢字' : 'かな' }}</div>
          <div class="icon-button keyboard-icon" title="Type mode" v-if="inputMode === 'choice'" @click.stop="setInputMode('type')"></div>
          <div class="icon-button check-icon" title="Options mode" v-if="inputMode === 'type'" @click.stop="setInputMode('choice')"></div>
        </div>
      </div>
    </MainHeader>

    <main>
      <div class="card choice-card" :class="feedbackClass">
        <template v-if="target">
          <WordCorner :word="target.word" :speech="target.reading" :level="target.level" />

          <InfoIcons
            :streak="streak"
            :score="score"
            :mastered="stats"
            :memory="memory"
            :memory-max="MAX_MEMORY"
          />

          <!-- type mode: the meaning tells apart words that can look the same (隣 / 右) -->
          <div class="verb-meaning" v-if="inputMode === 'type'">{{ target.meaning }}</div>

          <div class="loc-scene" :class="sceneClass" role="img" aria-label="Where is the icon?">
            <div v-if="scene.layout.box" class="loc-box"></div>
            <div v-if="scene.layout.ring" class="loc-ring"></div>
            <span
              v-for="(ref, i) in scene.refs" :key="'ref' + i"
              class="loc-item loc-ref"
              :class="{ big: scene.layout.box }"
              :style="cell(scene.layout.refs[i])"
            >{{ ref.emoji }}</span>
            <span class="loc-item loc-sub" :style="cell(scene.layout.sub)">{{ scene.sub.emoji }}</span>
            <span v-if="scene.layout.viewer" class="loc-item loc-viewer" style="--c: 3; --r: 5;">👀</span>
          </div>

          <div class="loc-sentence">
            <template v-for="(token, i) in sentence" :key="i">
              <span v-if="token.blank" class="loc-blank" :class="{ filled: locked || revealed }">
                <template v-if="locked || revealed">{{ answerText }}</template>
              </span>
              <template v-else-if="token.reading">
                <template v-for="(part, j) in rubyParts(token.text, token.reading)" :key="j">
                  <ruby v-if="part.rt && furiganaStore.showFurigana">{{ part.text }}<rp>(</rp><rt>{{ part.rt }}</rt><rp>)</rp></ruby>
                  <template v-else>{{ part.text }}</template>
                </template>
              </template>
              <template v-else>{{ token.text }}</template>
            </template>
          </div>

          <div class="verb-target-label">
            {{ inputMode === 'choice' ? 'Pick the word that fits the blank' : 'Spell the reading in hiragana, kana by kana' }}
          </div>

          <template v-if="inputMode === 'type'">
            <KanaSpellInput
              ref="wordInput"
              :key="spellRound"
              :answer="target.reading"
              :readonly="locked"
              @mistake="onMistake"
              @done="onSpelled"
              @next="newTarget"
            />
          </template>
          <template v-else>
            <div class="choice-grid">
              <button
                v-for="option in options" :key="target.word + option.word"
                class="choice-button"
                :class="{ correct: locked && option.word === target.word, wrong: wrongOptions.includes(option.word) }"
                :disabled="locked || revealed || wrongOptions.includes(option.word)"
                @click.stop="chooseOption(option)"
              >
                <template v-if="script === 'kana'">{{ option.reading }}</template>
                <template v-else v-for="(part, j) in rubyParts(option.word, option.reading)" :key="j">
                  <ruby v-if="part.rt && furiganaStore.showFurigana">{{ part.text }}<rp>(</rp><rt>{{ part.rt }}</rt><rp>)</rp></ruby>
                  <template v-else>{{ part.text }}</template>
                </template>
              </button>
            </div>
          </template>

          <div :class="statusClass">{{ status }}</div>

          <div class="row">
            <button v-if="inputMode === 'type'" @click="checkTyped">Check</button>
            <button @click="reveal">Reveal</button>
            <button @click="newTarget">Skip</button>
            <button @click="resetScore">Reset</button>
          </div>
        </template>

        <template v-else>
          <div :class="statusClass">{{ status || 'No location words in the selected pool.' }}</div>
        </template>
      </div>

      <SessionHistory :entries="sessionHistory" />
    </main>
  </div>
`;