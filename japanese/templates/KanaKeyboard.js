export default /*html*/`
  <div class="kana-keyboard">
    <MainHeader
      title="KANA KEYBOARD"
      hideFurigana="true"
      hideZoom="true"
    >
    </MainHeader>

    <main>
      <div class="mode-toggle">
        <button :class="{ active: mode === 'kana' }" @click="switchMode('kana')">Kana</button>
        <button :class="{ active: mode === 'verbs' }" @click="switchMode('verbs')">Verbs</button>
      </div>

      <template v-if="mode === 'kana'">
        <div class="card">
          <div style="text-align:center">Type this kana:</div>
          <div id="prompt" class="prompt">{{ target }}</div>

          <div id="status" :class="statusClass">{{ status }}</div>

          <div class="row">
            <button @click="newTarget">Next</button>
            <button @click="resetScore">Reset</button>
            <button @click="focusInput">Focus</button>
          </div>

          <div class="stats">
            <div>Score: <span id="score">{{ score }}</span></div>
            <div>Streak: <span id="streak">{{ streak }}</span></div>
            <div>Last: <span id="last">{{ last }}</span></div>
          </div>
        </div>

        <!-- Hidden input for IME-safe capture -->
        <input ref="capture" autocomplete="off" v-model="inputValue" @input="onInput" id="capture" />
      </template>

      <template v-if="mode === 'verbs'">
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

            <input
              ref="verbInput"
              v-model="verbInputValue"
              @keyup.enter="checkVerbAnswer"
              autocomplete="off"
              class="verb-input"
              placeholder="Type the conjugated form..."
            />

            <div id="verb-status" :class="verbStatusClass">{{ verbStatus }}</div>

            <div class="row">
              <button @click="checkVerbAnswer">Check</button>
              <button @click="revealAnswer">Reveal</button>
              <button @click="newVerbTarget">Skip</button>
              <button @click="resetVerbScore">Reset</button>
            </div>

            <div class="stats">
              <div>Score: <span>{{ verbScore }}</span></div>
              <div>Streak: <span>{{ verbStreak }}</span></div>
            </div>
          </template>

          <template v-else>
            <div :class="verbStatusClass">{{ verbStatus || 'No verbs match the selected filters.' }}</div>
          </template>
        </div>
      </template>
    </main>
  </div>
`;