export default /*html*/`
  <div class="home-welcome">
    <MainHeader
      isHome="true"
      @onChangeFurigana="furiganaStore.switchFurigana()"
    >
      <div class="title">
        <ruby>万灯<rp>(</rp><rt>マンドー</rt><rp>)</rp></ruby>の<PhraseToRuby text="日本語"/>のメモ
      </div>
    </MainHeader>

    <main>
      <section class="hero">
        <p class="eyebrow">ようこそ · Welcome</p>
        <h1>Learning Japanese, one note at a time</h1>
        <p class="lead">
          This corner of my site is where I collect everything I'm picking up
          while learning Japanese: phrases, kanji, grammar notes, and small
          practice tools I've built along the way.
        </p>
      </section>

      <section class="why">
        <h2>Why I'm learning it</h2>
        <p>
          I want to enjoy manga, anime, movies and video games the way they
          were actually made, not through someone else's interpretation. A lot
          gets lost, softened, or changed in translation — jokes, wordplay,
          cultural nuance, sometimes entire lines. Reading and listening in the
          original language means getting the real thing.
        </p>
        <p>
          Kanji is a big part of that. Once you can read it, meanings get
          sharper: a character often carries its own layer of meaning on top
          of the word it's part of, and you start noticing connections between
          words that would otherwise look unrelated. It's less about
          memorizing shapes and more about understanding how the language
          actually thinks.
        </p>
        <p>
          And beyond media, I'd love to be able to hold a real conversation
          with native speakers when I travel — to ask questions, get
          recommendations, and actually connect with people instead of
          pointing at a translation app.
        </p>
      </section>

      <section class="jlpt">
        <h2>About JLPT levels</h2>
        <p>
          You'll see levels like <strong>N5</strong> through <strong>N1</strong>
          scattered around this site (kanji, verbs, topics). They come from the
          <strong>JLPT</strong> (Japanese Language Proficiency Test), the most
          common way to measure Japanese ability:
        </p>
        <ul class="jlpt-list">
          <li><strong>N5</strong> — the basics: simple grammar, everyday phrases, ~100 kanji.</li>
          <li><strong>N4</strong> — a bit more grammar and vocabulary for basic daily conversations.</li>
          <li><strong>N3</strong> — a bridge level, handling everyday situations more naturally.</li>
          <li><strong>N2</strong> — comfortable with most everyday and some business/news Japanese.</li>
          <li><strong>N1</strong> — the highest level: complex, nuanced, academic Japanese.</li>
        </ul>
        <p>
          I'm not studying for the exam itself, but the levels are a handy way
          to sort vocabulary, kanji and grammar by difficulty as I go.
        </p>
      </section>

      <section class="sections">
        <h2>What's in here</h2>
        <div class="section-grid">
          <router-link to="/common-phrases" class="section-card">
            <h3>Common Phrases</h3>
            <p>A running list of everyday phrases I've picked up, with furigana and translations.</p>
          </router-link>
          <router-link to="/translations" class="section-card">
            <h3>翻訳 Translations</h3>
            <p>Fan translations of books and stories I'm reading, alongside the original text.</p>
          </router-link>
          <router-link to="/kana-keyboard" class="section-card">
            <h3>Kana Keyboard</h3>
            <p>Quick drills to practice recognizing and typing hiragana and katakana.</p>
          </router-link>
          <router-link to="/verbs-practice" class="section-card">
            <h3>Verb Practice</h3>
            <p>Conjugation practice for godan, ichidan and irregular verbs, by JLPT level.</p>
          </router-link>
          <router-link to="/topics" class="section-card">
            <h3>Topics</h3>
            <p>Short grammar and vocabulary write-ups, from honorifics to counters and numbers.</p>
          </router-link>
          <router-link to="/print-practice" class="section-card">
            <h3>Print Practice</h3>
            <p>Printable handwriting worksheets for kana and kanji.</p>
          </router-link>
        </div>
      </section>
    </main>
  </div>
`;