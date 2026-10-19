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