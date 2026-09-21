export default /*html*/`
  <div class="kana-keyboard">
    <MainHeader
      title="VERB PRACTICE"
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
        <div class="verb-filters">
          <div class="filter-group">
            <span>JLPT:</span>
            <button
              v-for="level in verbLevels" :key="level"
              :class="{ active: selectedLevels.includes(level) }"
              @click="toggleLevel(level)"
            >{{ level }}</button>
          </div>
          <div class="filter-group">
            <span>Group:</span>
            <button
              v-for="group in [1, 2, 3]" :key="group"
              :class="{ active: selectedGroups.includes(group) }"
              @click="toggleGroup(group)"
            >{{ group }}</button>
          </div>
        </div>

        <template v-if="targetVerb">
          <div class="verb-meaning">{{ targetVerb.meaning }}</div>
          <div class="prompt verb-prompt">
            <ruby>{{ targetVerb.dictionary }}<rp>(</rp><rt>{{ targetVerb.reading }}</rt><rp>)</rp></ruby>
          </div>
          <div class="verb-target-label">{{ formLabel }} · Group {{ targetVerb.group }} · {{ targetVerb.level }}</div>

          <div class="memory-bar" :title="'Memory: ' + verbMemory + '/' + MAX_MEMORY">
            <span v-for="n in MAX_MEMORY" :key="n" class="memory-dot" :class="{ filled: n <= verbMemory }"></span>
          </div>

          <template v-if="inputMode === 'type'">
            <input
              ref="verbInput"
              v-model="verbInputValue"
              @keyup.enter="checkVerbAnswer"
              autocomplete="off"
              class="verb-input"
              placeholder="Kanji or hiragana, either works..."
            />
          </template>
          <template v-else>
            <div class="choice-grid verb-choice-grid">
              <button
                v-for="option in verbOptions" :key="option"
                class="choice-button"
                @click="chooseVerbOption(option)"
              >{{ option }}</button>
            </div>
          </template>

          <div id="verb-status" :class="verbStatusClass">{{ verbStatus }}</div>

          <div class="row">
            <button v-if="inputMode === 'type'" @click="checkVerbAnswer">Check</button>
            <button @click="revealAnswer">Reveal</button>
            <button @click="newVerbTarget">Skip</button>
            <button @click="resetVerbScore">Reset</button>
          </div>

          <div class="stats">
            <div>Score: <span>{{ verbScore }}</span></div>
            <div>Streak: <span>{{ verbStreak }}</span></div>
          </div>
          <div class="stats memory-stats">
            <div>🧠 Mastered: <span>{{ verbStats.mastered }}/{{ verbStats.total }}</span></div>
          </div>
        </template>

        <template v-else>
          <div :class="verbStatusClass">{{ verbStatus || 'No verbs match the selected filters.' }}</div>
        </template>
      </div>

      <SessionHistory :entries="sessionHistory" />
    </main>
  </div>
`;