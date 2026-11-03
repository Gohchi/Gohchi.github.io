export default /*html*/`
  <div class="progress">
    <MainHeader
      title="PROGRESS"
      hideFurigana="true"
      hideZoom="true"
    />

    <main>
      <section class="progress-intro">
        <p class="eyebrow">進捗 · Progress</p>
        <h1>Everything you've practiced</h1>
        <p class="lead" v-if="startedAt">
          Practicing since <strong>{{ startedAt }}</strong>
          · {{ daysPracticed }} {{ daysPracticed === 1 ? 'day' : 'days' }} practiced.
        </p>
        <p class="lead" v-else>
          Nothing recorded yet. Answer a few questions in any practice section and your progress will show up here.
        </p>
      </section>

      <section class="progress-group">
        <h2>Levels</h2>

        <article v-for="c in levels" :key="c.id" class="progress-card">
          <div class="progress-card-header">
            <h3>{{ c.label }}</h3>
            <span class="xp-level">Lv {{ c.level }}<template v-if="c.maxed"> MAX</template></span>
          </div>
          <div class="progress-bar" :title="formatXp(c.xp) + ' / ' + formatXp(c.cap) + ' XP'">
            <span class="progress-bar-fill" :style="{ width: (c.progress * 100) + '%' }"></span>
          </div>
          <p class="xp-caption" v-if="!c.maxed">{{ formatXp(c.xp) }} / {{ formatXp(c.next) }} XP to Lv {{ c.level + 1 }}</p>
          <p class="xp-caption" v-else>{{ formatXp(c.xp) }} XP · everything mastered</p>
        </article>

        <article class="progress-card">
          <div class="progress-card-header">
            <h3>Total</h3>
            <span class="xp-caption">{{ formatXp(xpTotal.xp) }} / {{ formatXp(xpTotal.cap) }} XP</span>
          </div>
          <div class="progress-bar">
            <span class="progress-bar-fill" :style="{ width: (xpTotal.cap ? xpTotal.xp / xpTotal.cap * 100 : 0) + '%' }"></span>
          </div>
        </article>
      </section>

      <section class="progress-group progress-pending" v-if="hasPending">
        <h2>Pending to unlock</h2>
        <p class="xp-caption">What is still closed, and what to practice to open it.</p>

        <article class="progress-card" v-if="pending.sections.length">
          <div class="progress-card-header"><h3>Sections</h3></div>
          <ul class="pending-list">
            <li v-for="m in pending.sections" :key="m.category + m.need">
              <div class="pending-main">
                <div>
                  <strong>{{ m.label }} Lv {{ m.need }}</strong>
                  <span class="xp-caption"> · you are Lv {{ m.have }}<template v-if="m.toNext"> · {{ formatXp(m.toNext) }} XP to Lv {{ m.have + 1 }}</template></span>
                </div>
                <div class="pending-chips">
                  <span class="pending-label">Opens</span>
                  <span v-for="name in m.opens" :key="name" class="pending-chip">🔒 {{ name }}</span>
                </div>
                <div v-if="m.also.length" class="xp-caption">Also needs {{ m.also.join(' + ') }}</div>
              </div>
              <router-link :to="m.route" class="step-link">Practice →</router-link>
            </li>
          </ul>
        </article>

        <article class="progress-card" v-if="pending.kanji.next || pending.kanji.open">
          <div class="progress-card-header">
            <h3>Kanji groups</h3>
            <span class="xp-caption">{{ pending.kanji.open }} / {{ pending.kanji.total }} open</span>
          </div>
          <div class="progress-bar">
            <span class="progress-bar-fill" :style="{ width: (pending.kanji.open / pending.kanji.total * 100) + '%' }"></span>
          </div>
          <template v-if="pending.kanji.next">
            <p class="pending-text" v-if="pending.kanji.next.kind === 'level'">
              Next group <strong>#{{ pending.kanji.next.group }}</strong> opens at
              <strong>Hiragana Lv {{ pending.kanji.next.level }}</strong>.
            </p>
            <p class="pending-text" v-else>
              Next group <strong>#{{ pending.kanji.next.group }}</strong> opens when
              <strong>{{ pending.kanji.next.needPassed }}</strong> of the
              {{ pending.kanji.next.members }} kanji in <strong>#{{ pending.kanji.next.prev }}</strong>
              reach memory stage 3
              ({{ pending.kanji.next.passed }} so far).
            </p>
            <router-link to="/kanji-meaning" class="step-link">Practice kanji →</router-link>
          </template>
          <p class="pending-text" v-else>Every kanji group is open.</p>
        </article>

        <article class="progress-card" v-if="pending.words.locked">
          <div class="progress-card-header">
            <h3>Words</h3>
            <span class="xp-caption">{{ pending.words.locked }} of {{ pending.words.total }} locked</span>
          </div>
          <p class="pending-text">
            <template v-if="pending.words.byType.hiragana">{{ pending.words.byType.hiragana }} hiragana · </template>
            <template v-if="pending.words.byType.katakana">{{ pending.words.byType.katakana }} katakana · </template>
            <template v-if="pending.words.byType.kanji">{{ pending.words.byType.kanji }} kanji</template>
            words are waiting for kana you have not answered yet or for a kanji group.
          </p>

          <template v-if="pending.words.kana.length">
            <p class="pending-label">Kana that open the most words</p>
            <div class="pending-chips">
              <span v-for="item in pending.words.kana" :key="item.script + item.kana" class="pending-chip kana-chip" :title="item.blocks + ' locked words use it, ' + item.opens + ' only need this one'">
                <span class="pending-kana">{{ item.kana }}</span>
                <small>{{ item.opens ? '+' + item.opens + ' now' : item.blocks + ' words' }}</small>
              </span>
            </div>
          </template>

          <template v-if="pending.words.groups.length">
            <p class="pending-label">Waiting for a kanji group</p>
            <div class="pending-chips">
              <span v-for="item in pending.words.groups" :key="item.group" class="pending-chip">#{{ item.group }} <small>{{ item.count }}</small></span>
            </div>
          </template>
        </article>
      </section>

      <section class="progress-summary">
        <div class="summary-tile">
          <span class="summary-value">🔥 {{ streak.current }}</span>
          <span class="summary-label">current streak (days)</span>
        </div>
        <div class="summary-tile">
          <span class="summary-value">{{ streak.longest }}</span>
          <span class="summary-label">longest streak</span>
        </div>
        <div class="summary-tile">
          <span class="summary-value">{{ totalAnswers }}</span>
          <span class="summary-label">answers</span>
        </div>
        <div class="summary-tile">
          <span class="summary-value">{{ totalAccuracy === null ? '—' : totalAccuracy + '%' }}</span>
          <span class="summary-label">accuracy</span>
        </div>
        <div class="summary-tile">
          <span class="summary-value">🧠 {{ totalMastered }}</span>
          <span class="summary-label">items mastered</span>
        </div>
        <div class="summary-tile">
          <span class="summary-value">{{ formatDate(streak.lastActive) }}</span>
          <span class="summary-label">last practice</span>
        </div>
      </section>

      <section class="progress-heatmap">
        <h2>Last {{ heatmap.length }} days</h2>
        <div class="heatmap-grid">
          <span
            v-for="day in heatmap" :key="day.date"
            class="heatmap-cell"
            :class="'level-' + day.level"
            :title="day.date + ': ' + day.answers + ' answers'"
          ></span>
        </div>
      </section>

      <section v-for="group in groups" :key="group.name" class="progress-group">
        <h2>{{ group.name }}</h2>

        <article v-for="item in group.items" :key="item.id" class="progress-card">
          <div class="progress-card-header">
            <h3>{{ item.label }}</h3>
            <router-link :to="item.route" class="step-link">Practice →</router-link>
          </div>

          <div class="progress-bar" :title="item.practiced + ' practiced of ' + item.total">
            <span class="progress-bar-fill" :style="{ width: (item.total ? item.practiced / item.total * 100 : 0) + '%' }"></span>
          </div>

          <dl class="progress-facts">
            <div><dt>Practiced</dt><dd>{{ item.practiced }} / {{ item.total }}</dd></div>
            <div><dt>Mastered</dt><dd>{{ item.mastered }}</dd></div>
            <div><dt>Accuracy</dt><dd>{{ item.accuracy === null ? '—' : item.accuracy + '%' }}</dd></div>
            <div><dt>Started</dt><dd>{{ formatDate(item.first) }}</dd></div>
            <div><dt>Last</dt><dd>{{ formatDate(item.last) }}</dd></div>
          </dl>

          <button
            v-if="item.practiced"
            type="button"
            class="progress-toggle"
            @click="toggleOpen(item.id)"
          >{{ open[item.id] ? 'Hide items' : 'Show items (weakest first)' }}</button>

          <div v-if="open[item.id]" class="progress-items">
            <table>
              <thead>
                <tr><th>Item</th><th>Memory</th><th>✔</th><th>✘</th><th>Started</th><th>Last</th></tr>
              </thead>
              <tbody>
                <tr v-for="entry in itemsFor(item.id)" :key="entry.key">
                  <td class="item-key">{{ entry.key }}</td>
                  <td>
                    <span v-for="n in MAX_MEMORY" :key="n" class="memory-dot" :class="{ filled: n <= entry.memory }"></span>
                  </td>
                  <td>{{ entry.correct }}</td>
                  <td>{{ entry.wrong }}</td>
                  <td>{{ formatDate(entry.first) }}</td>
                  <td>{{ formatDate(entry.last) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section class="progress-group">
        <h2>Reading &amp; guidance</h2>

        <article class="progress-card">
          <div class="progress-card-header">
            <h3>Common phrases</h3>
            <router-link to="/common-phrases" class="step-link">Open →</router-link>
          </div>
          <dl class="progress-facts">
            <div><dt>Favorites</dt><dd>{{ favorites }} / {{ phrasesTotal }}</dd></div>
          </dl>
        </article>

        <article class="progress-card">
          <div class="progress-card-header">
            <h3>Roadmap</h3>
            <router-link to="/roadmap" class="step-link">Open →</router-link>
          </div>
          <div class="progress-bar">
            <span class="progress-bar-fill" :style="{ width: (roadmapTotal ? roadmapDone / roadmapTotal * 100 : 0) + '%' }"></span>
          </div>
          <dl class="progress-facts">
            <div><dt>Steps done</dt><dd>{{ roadmapDone }} / {{ roadmapTotal }}</dd></div>
          </dl>
        </article>
      </section>

      <section class="progress-danger">
        <button type="button" class="progress-reset" @click="resetAll">Reset all progress</button>
      </section>
    </main>
  </div>
`;