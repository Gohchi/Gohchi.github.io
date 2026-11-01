export default /*html*/`
  <div class="admin">
    <MainHeader
      title="ADMIN"
      hideFurigana="true"
      hideZoom="true"
    />

    <main>
      <!-- session still being restored -->
      <section v-if="profileStore.authBusy" class="admin-intro">
        <p class="lead" role="status">Checking your session…</p>
      </section>

      <!-- everyone else sees nothing about this section -->
      <section v-else-if="!profileStore.isAdmin" class="admin-intro">
        <h1>404</h1>
        <p class="lead">That route doesn’t exist.</p>
      </section>

      <template v-else>
        <section class="admin-intro">
          <p class="eyebrow">管理 · Admin</p>
          <h1>Users</h1>
          <p class="lead">
            <template v-if="loadedAt">Loaded {{ formatDate(loadedAt) }}</template>
            <template v-else>Loading…</template>
          </p>
        </section>

        <p v-if="error" class="admin-error" role="alert">{{ error }}</p>

        <section class="admin-summary">
          <div class="summary-tile"><span class="summary-value">{{ totals.users }}</span><span class="summary-label">users</span></div>
          <div class="summary-tile"><span class="summary-value">{{ totals.answers }}</span><span class="summary-label">answers</span></div>
          <div class="summary-tile"><span class="summary-value">{{ totals.mastered }}</span><span class="summary-label">items mastered</span></div>
          <div class="summary-tile"><span class="summary-value">{{ totals.docs }}</span><span class="summary-label">documents</span></div>
        </section>

        <section class="admin-bar">
          <input
            v-model="query"
            type="search"
            class="admin-search"
            placeholder="Search name, uid or level..."
            aria-label="Search users"
            autocomplete="off"
          />
          <div class="chip-row" role="group" aria-label="Sort by">
            <button
              v-for="option in sorts" :key="option.key"
              type="button"
              class="admin-chip"
              :class="{ on: sort === option.key }"
              @click="sort = option.key"
            >{{ option.label }}</button>
          </div>
          <button type="button" class="admin-chip refresh" :disabled="loading" @click="load">
            {{ loading ? 'Loading…' : 'Refresh' }}
          </button>
        </section>

        <div v-if="visibleUsers.length" class="table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Level</th>
                <th>Started</th>
                <th>Last active</th>
                <th>Days</th>
                <th>Answers</th>
                <th>Accuracy</th>
                <th>Practiced</th>
                <th>Mastered</th>
                <th>★</th>
                <th>Roadmap</th>
                <th>Synced</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="user in visibleUsers" :key="user.uid">
                <tr @click="toggleOpen(user.uid)" :title="user.uid">
                  <td class="col-user">
                    <span class="user-avatar">{{ user.avatar || '👤' }}</span>
                    <span class="user-name">{{ user.displayName || 'No name' }}</span>
                    <small>{{ shortUid(user.uid) }}</small>
                  </td>
                  <td>{{ user.targetLevel || '—' }}</td>
                  <td>{{ formatDate(user.startedAt) }}</td>
                  <td>{{ formatDate(user.lastActive) }}</td>
                  <td>{{ user.daysPracticed }}</td>
                  <td>{{ user.answers }}</td>
                  <td>{{ user.accuracy === null ? '—' : user.accuracy + '%' }}</td>
                  <td>{{ user.practiced }}</td>
                  <td>{{ user.mastered }}</td>
                  <td>{{ user.favorites }}</td>
                  <td>{{ user.roadmapDone }}</td>
                  <td>{{ formatDate(user.updatedAt) }}</td>
                </tr>
                <tr v-if="open[user.uid]" class="raw-row">
                  <td colspan="12"><pre>{{ prettyJson(user.docs) }}</pre></td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <p v-else-if="!loading && !error" class="admin-empty">No users found.</p>
      </template>
    </main>
  </div>
`;