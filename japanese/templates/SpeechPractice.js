export default /*html*/`
  <div class="speech-practice practice-sections">
    <MainHeader
      title="SPEECH PRACTICE"
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
          <FilterMenu
            label="Type"
            title="Word types"
            :options="typeOptions"
            :modelValue="selectedTypes"
            @update:modelValue="setTypes"
          />
          <KanjiPoolMenu
            label="Pool"
            title="Choose which words to practice"
            emptyText="No words for the selected JLPT levels and types."
            :items="poolItems"
            :excluded="excludedWords"
            @update:excluded="setExcluded"
          />
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
          />

          <div class="verb-meaning">{{ target.meaning }}</div>
          <div class="prompt">{{ target.word }}</div>
          <div class="verb-target-label">
            {{ supported ? 'Say this word out loud' : 'Type this word (microphone not available)' }}
          </div>

          <!-- microphone -->
          <button
            v-if="supported"
            type="button"
            class="mic-button"
            :class="{ listening }"
            :disabled="locked"
            :aria-pressed="listening"
            :title="listening ? 'Stop listening' : 'Start listening'"
            @click.stop="toggleListening"
          >
            <span class="mic-icon" aria-hidden="true">🎤</span>
            <span>{{ listening ? 'Listening...' : 'Speak' }}</span>
          </button>

          <!-- fallback: no SpeechRecognition in this browser -->
          <input
            v-else
            ref="typedInput"
            v-model="typedValue"
            @keydown.enter="onTypedEnter"
            :readonly="locked"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            lang="ja"
            class="type-input"
            placeholder="ひらがな or 漢字で入力..."
          />

          <div class="heard" :class="{ empty: !heard }">
            <span class="heard-label">Heard</span>
            <span class="heard-text">{{ heard || '—' }}</span>
          </div>

          <div :class="statusClass">{{ status }}</div>

          <div class="row">
            <button v-if="!supported" @click="onTypedEnter({})">Check</button>
            <button @click="reveal">Reveal</button>
            <button @click="newTarget">Skip</button>
            <button @click="resetScore">Reset</button>
          </div>
        </template>

        <template v-else>
          <div :class="statusClass">{{ status || 'No words match the selected filters or pool.' }}</div>
        </template>
      </div>

      <SessionHistory :entries="sessionHistory" />
    </main>
  </div>
`;