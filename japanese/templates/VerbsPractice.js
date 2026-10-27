export default /*html*/`
  <div class="verbs-practice practice-sections">
    <MainHeader
      title="VERB PRACTICE"
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
          <FilterMenu
            label="Group"
            title="Verb groups"
            :options="groupOptions"
            :modelValue="selectedGroups"
            @update:modelValue="setGroups"
          />
          <FilterMenu
            label="Form"
            title="Verb forms"
            :options="formOptions"
            :modelValue="selectedForms"
            @update:modelValue="setForms"
          />
          <KanjiPoolMenu
            label="Pool"
            title="Choose which verbs to practice"
            emptyText="No verbs for the selected JLPT levels and groups."
            :items="poolItems"
            :excluded="excludedVerbs"
            @update:excluded="setExcluded"
          />
          <div class="icon-button keyboard-icon" title="Type mode" v-if="inputMode === 'choice'" @click="setInputMode('type')"></div>
          <div class="icon-button check-icon" title="Options mode" v-if="inputMode === 'type'" @click="setInputMode('choice')"></div>
        </div>
      </div>
    </MainHeader>

    <main>
      <div class="card choice-card" :class="feedbackClass">
        <template v-if="targetVerb">
          <WordCorner :word="targetVerb.dictionary" :level="targetVerb.level" />

          <InfoIcons
            :streak="verbStreak"
            :score="verbScore"
            :mastered="verbStats"
          />

          <div class="verb-meaning">{{ targetVerb.meaning }}</div>

          <div class="prompt verb-prompt">
            <template v-if="furiganaStore.showFurigana">
              <template v-for="(part, index) in promptParts" :key="index">
                <ruby v-if="part.rt">{{ part.text }}<rp>(</rp><rt>{{ part.rt }}</rt><rp>)</rp></ruby>
                <template v-else>{{ part.text }}</template>
              </template>
            </template>
            <template v-else>{{ targetVerb.dictionary }}</template>
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
              class="type-input"
              placeholder="Kanji or hiragana, either works..."
            />
          </template>
          <template v-else>
            <div class="choice-grid verb-choice-grid">
              <button
                v-for="option in verbOptions" :key="verbMemoryKey + option"
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
        </template>

        <template v-else>
          <div :class="verbStatusClass">{{ verbStatus || 'No verbs match the selected filters or pool.' }}</div>
        </template>
      </div>

      <SessionHistory :entries="sessionHistory" />
    </main>
  </div>
`;