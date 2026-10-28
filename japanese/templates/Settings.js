export default /*html*/`
  <div class="settings">
    <MainHeader
      title="SETTINGS"
      hideFurigana="true"
      hideZoom="true"
    />

    <main>
      <section class="settings-intro">
        <p class="eyebrow">設定 · Settings</p>
        <h1>Practice pools</h1>
        <p class="lead">
          Choose which words show up in each practice. Changes are saved right away and apply
          the next time you open that practice. The Pool button inside each practice edits
          the same lists.
        </p>
      </section>

      <section class="settings-pools">
        <div class="chip-row" role="tablist" aria-label="Pool">
          <button
            v-for="chip in poolChips" :key="chip.id"
            type="button"
            role="tab"
            class="s-chip"
            :class="{ on: pool === chip.id }"
            :aria-selected="pool === chip.id"
            @click="pool = chip.id"
          >
            {{ chip.label }}
            <span class="count">{{ chip.on }}/{{ chip.total }}</span>
          </button>
        </div>

        <input
          v-model="query"
          type="search"
          class="settings-search"
          placeholder="Search word, reading or meaning..."
          aria-label="Search words"
          autocomplete="off"
        />

        <div class="filter-line">
          <span class="filter-name">JLPT</span>
          <div class="chip-row">
            <button
              v-for="level in levels" :key="level"
              type="button"
              class="s-chip small"
              :class="{ on: selectedLevels.includes(level) }"
              :aria-pressed="selectedLevels.includes(level)"
              @click="toggleLevel(level)"
            >{{ level }}</button>
          </div>
        </div>

        <div class="filter-line">
          <span class="filter-name">Status</span>
          <div class="chip-row">
            <button
              v-for="option in statusOptions" :key="option.key"
              type="button"
              class="s-chip small"
              :class="{ on: status === option.key }"
              @click="status = option.key"
            >{{ option.label }}</button>
          </div>
        </div>

        <div class="filter-line">
          <span class="filter-name">Memory</span>
          <div class="chip-row">
            <button
              v-for="option in memoryOptions" :key="option.key"
              type="button"
              class="s-chip small"
              :class="{ on: memory === option.key }"
              @click="memory = option.key"
            >{{ option.label }}</button>
          </div>
        </div>

        <div v-if="facetOptions.length" class="filter-line">
          <span class="filter-name">{{ currentPool.facetLabel }}</span>
          <div class="chip-row">
            <button
              type="button"
              class="s-chip small"
              :class="{ on: facet === 'all' }"
              @click="facet = 'all'"
            >All</button>
            <button
              v-for="option in facetOptions" :key="option.key"
              type="button"
              class="s-chip small"
              :class="{ on: facet === option.key }"
              @click="facet = option.key"
            >{{ option.label }}</button>
          </div>
        </div>

        <div class="settings-bar">
          <span class="settings-summary">
            {{ filteredRows.length }} of {{ rows.length }} words · {{ filteredOnCount }} in pool
          </span>
          <div class="bulk-actions">
            <button type="button" :disabled="!filteredRows.length" @click="bulk('include')">Include all</button>
            <button type="button" :disabled="!filteredRows.length" @click="bulk('exclude')">Exclude all</button>
            <button type="button" :disabled="!filteredRows.length" @click="bulk('invert')">Invert</button>
            <button v-if="activeFilterCount" type="button" class="clear" @click="clearFilters">Clear filters ({{ activeFilterCount }})</button>
          </div>
        </div>

        <router-link v-if="currentPool" :to="currentPool.route" class="practice-link">
          Practice {{ currentPool.label.toLowerCase() }} →
        </router-link>

        <div v-if="filteredRows.length" class="table-wrap">
          <table class="pool-table">
            <thead>
              <tr>
                <th class="col-check"></th>
                <th>Word</th>
                <th>Reading</th>
                <th class="col-meaning">Meaning</th>
                <th>JLPT</th>
                <th v-if="pool === 'all' || facetOptions.length">{{ pool === 'all' ? 'Pool' : currentPool.facetLabel }}</th>
                <th>Memory</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in visibleRows" :key="row.rowKey"
                :class="{ off: !isOn(row) }"
                :title="row.detail"
                @click="toggle(row)"
              >
                <td class="col-check">
                  <input
                    type="checkbox"
                    :checked="isOn(row)"
                    :aria-label="'Include ' + row.word + ' in the pool'"
                    @click.stop
                    @change="toggle(row)"
                  />
                </td>
                <td class="col-word">{{ row.word }}</td>
                <td class="col-reading">{{ row.reading }}</td>
                <td class="col-meaning">{{ row.meaning }}</td>
                <td class="col-level">
                  <span v-if="row.level" class="level-pill" :class="'lv-' + row.level">{{ row.level }}</span>
                  <span v-else class="muted">—</span>
                </td>
                <td v-if="pool === 'all' || facetOptions.length" class="col-pool">
                  <template v-if="pool === 'all'">
                    {{ poolLabels[row.poolId] }}<small v-if="row.facetShort"> · {{ row.facetShort }}</small>
                  </template>
                  <template v-else>{{ row.facetShort }}</template>
                </td>
                <td class="col-memory">
                  <span
                    v-for="n in MAX_MEMORY" :key="n"
                    class="memory-dot"
                    :class="{ filled: n <= row.memory }"
                  ></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          v-if="filteredRows.length > visibleRows.length"
          type="button"
          class="show-more"
          @click="limit += PAGE_SIZE"
        >Show more ({{ filteredRows.length - visibleRows.length }} left)</button>

        <article v-if="!filteredRows.length" class="empty-list">
          <h2>No words found</h2>
          <p>Try a different search or clear the filters.</p>
          <button type="button" class="show-more" @click="clearFilters">Clear filters</button>
        </article>
      </section>
    </main>
  </div>
`;