export default /*html*/`
  <div class="adjectives-practice practice-sections">
    <MainHeader title="ADJECTIVE PRACTICE" hideZoom="true">
      <div class="keyboard-toolbar-buttons">
        <div class="toolbar-group">
          <FilterMenu
            label="JLPT"
            title="JLPT levels"
            :options="levelOptions"
            :modelValue="selectedLevels"
            @update:modelValue="setLevels"
          />
          <FilterMenu
            label="Type"
            title="Adjective types"
            :options="adjTypes"
            :modelValue="selectedTypes"
            @update:modelValue="setTypes"
          />
          <div class="icon-button keyboard-icon" title="Type mode" v-if="inputMode === 'choice'" @click="setInputMode('type')"></div>
          <div class="icon-button check-icon" title="Options mode" v-if="inputMode === 'type'" @click="setInputMode('choice')"></div>
        </div>
      </div>
    </MainHeader>

    <main>
      <div class="card">
        <template v-if="targetAdj">
          <WordCorner :word="targetAdj.dictionary" :level="targetAdj.level" />

          <div class="prompt verb-prompt">
            <template v-if="furiganaStore.showFurigana">
              <ruby>{{ targetAdj.dictionary }}<rp>(</rp><rt>{{ targetAdj.reading }}</rt><rp>)</rp></ruby>
            </template>
            <template v-else>{{ targetAdj.dictionary }}</template>
          </div>

          <div class="verb-target-label">
            {{ typeLabel }} · {{ targetAdj.level }}<template v-if="targetAdj.tags?.length"> · {{ targetAdj.tags.join(', ') }}</template>
          </div>

          <div class="memory-bar" :title="'Memory: ' + adjMemory + '/' + MAX_MEMORY">
            <span v-for="n in MAX_MEMORY" :key="n" class="memory-dot" :class="{ filled: n <= adjMemory }"></span>
          </div>

          <template v-if="inputMode === 'type'">
            <input
              ref="typeInput"
              v-model="typeInputValue"
              @keyup.enter="checkTypeAnswer"
              autocomplete="off"
              class="verb-input"
              placeholder="Type the reading in hiragana..."
            />
          </template>
          <template v-else>
            <div class="choice-grid verb-choice-grid">
              <button
                v-for="option in choiceOptions" :key="option"
                class="choice-button"
                @click="chooseOption(option)"
              >{{ option }}</button>
            </div>
          </template>

          <div id="adj-status" :class="statusClass">{{ status }}</div>

          <div class="row">
            <button v-if="inputMode === 'type'" @click="checkTypeAnswer">Check</button>
            <button @click="revealAnswer">Reveal</button>
            <button @click="newTarget">Skip</button>
            <button @click="resetScore">Reset</button>
          </div>

          <div class="stats">
            <div>Score: <span>{{ score }}</span></div>
            <div>Streak: <span>{{ streak }}</span></div>
          </div>
          <div class="stats memory-stats">
            <div>🧠 Mastered: <span>{{ adjStats.mastered }}/{{ adjStats.total }}</span></div>
          </div>
        </template>

        <template v-else>
          <div :class="statusClass">{{ status || 'No adjectives match the selected filters.' }}</div>
        </template>
      </div>

      <SessionHistory :entries="sessionHistory" />
    </main>
  </div>
`;