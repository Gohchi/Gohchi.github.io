export default/*html*/`
  <MainHeader :title="'PRINT PRACTICE'" :hide-furigana="true" :hide-zoom="true" />

  <main class="print-practice">
    <section class="print-toolbar" aria-label="Print practice options">
      <div class="print-heading">
        <p class="eyebrow">Japanese handwriting sheets</p>
        <h1>{{ title }} <span v-if="script === 'kanji'">{{ level }}</span></h1>
        <p v-if="script === 'kanji'">{{ items.length }} characters from the JLPT {{ level }} list.</p>
        <p v-else>Basic kana practice sheet.</p>
      </div>
      <div class="print-controls">
        <div class="segmented-control" aria-label="Choose script">
          <button :class="{ active: script === 'hiragana' }" @click="script = 'hiragana'">ひらがな</button>
          <button :class="{ active: script === 'katakana' }" @click="script = 'katakana'">カタカナ</button>
          <button :class="{ active: script === 'kanji' }" @click="script = 'kanji'">漢字</button>
        </div>
        <div v-if="script === 'kanji'" class="level-control" aria-label="Choose JLPT level">
          <span>JLPT</span>
          <button v-for="option in levels" :key="option" :class="{ active: level === option }" @click="level = option">{{ option }}</button>
        </div>
        <button class="print-button" @click="printWorksheet" title="Print this worksheet">Print worksheet</button>
      </div>
    </section>

    <canvas
      id="practice-sheet"
      ref="practiceSheet"
      class="practice-sheet"
      :aria-label="title + ' practice worksheet'"
    ></canvas>
  </main>
`;