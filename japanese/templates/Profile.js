export default /*html*/`
  <div class="profile">
    <MainHeader
      title="PROFILE"
      hideFurigana="true"
      hideZoom="true"
    />

    <main>
      <section class="profile-hero">
        <div class="profile-avatar">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Profile photo" />
          <span v-else>{{ form.avatar }}</span>
        </div>
        <h1>{{ shownName }}</h1>
        <p class="lead">
          Target level <strong>{{ form.targetLevel }}</strong>
          <template v-if="startedAt"> · practicing since {{ startedAt }}</template>
        </p>
      </section>

      <section class="profile-goal">
        <div class="profile-goal-header">
          <h2>Today</h2>
          <span>{{ todayAnswers }} / {{ profileStore.profile.dailyGoal }} answers · 🔥 {{ streak.current }}</span>
        </div>
        <div class="profile-bar">
          <span class="profile-bar-fill" :style="{ width: goalPercent + '%' }"></span>
        </div>
        <router-link to="/progress" class="profile-link">See all progress →</router-link>
      </section>

      <section class="profile-favorites">
        <div class="profile-favorites-header">
          <h2>Favorite kanji</h2>
          <span v-if="favoriteKanji.length">★ {{ favoriteKanji.length }}</span>
        </div>

        <ul v-if="favoriteKanji.length" class="favorite-kanji-list">
          <li v-for="item in favoriteKanji" :key="item.word" class="favorite-kanji">
            <div class="favorite-kanji-word">
              <KanjiWithRuby v-if="item.entry" :text="item.word" :entry="item.entry" />
              <span v-else>{{ item.word }}</span>
            </div>
            <div class="favorite-kanji-info">
              <span class="favorite-kanji-reading">{{ item.reading }}</span>
              <span class="favorite-kanji-meaning">{{ item.meaning }}</span>
            </div>
            <button
              type="button"
              class="favorite-kanji-remove"
              :title="'Remove ' + item.word + ' from favorites'"
              :aria-label="'Remove ' + item.word + ' from favorites'"
              @click="kanjiFavorites.remove(item.word)"
            >&times;</button>
          </li>
        </ul>
        <p v-else class="profile-meta">Tap any kanji, then the ☆ in its dialog, to keep it here.</p>
      </section>

      <section class="profile-form">
        <h2>Edit profile</h2>

        <label class="field">
          <span class="field-label">Display name</span>
          <input
            type="text"
            v-model="form.displayName"
            :maxlength="DISPLAY_NAME_MAX"
            placeholder="How should we call you?"
            autocomplete="nickname"
          />
        </label>

        <div class="field">
          <span class="field-label">Avatar</span>
          <div class="avatar-grid">
            <button
              v-for="avatar in AVATARS" :key="avatar"
              type="button"
              class="avatar-option"
              :class="{ selected: form.avatar === avatar }"
              :aria-pressed="form.avatar === avatar"
              @click="form.avatar = avatar"
            >{{ avatar }}</button>
          </div>
        </div>

        <div class="field">
          <span class="field-label">Target JLPT level</span>
          <div class="chip-row">
            <button
              v-for="level in TARGET_LEVELS" :key="level"
              type="button"
              class="profile-chip"
              :class="{ selected: form.targetLevel === level }"
              @click="form.targetLevel = level"
            >{{ level }}</button>
          </div>
        </div>

        <label class="field">
          <span class="field-label">Daily goal (answers per day)</span>
          <input
            type="number"
            v-model.number="form.dailyGoal"
            :min="DAILY_GOAL_MIN"
            :max="DAILY_GOAL_MAX"
            step="5"
          />
        </label>

        <div class="field">
          <span class="field-label">Translation language</span>
          <div class="chip-row">
            <button
              v-for="lang in TRANSLATION_LANGS" :key="lang.key"
              type="button"
              class="profile-chip"
              :class="{ selected: form.translationLang === lang.key }"
              @click="form.translationLang = lang.key"
            >{{ lang.label }}</button>
          </div>
        </div>

        <div class="profile-actions">
          <button type="button" class="profile-save" :disabled="!dirty" @click="save">Save</button>
          <button type="button" class="profile-discard" :disabled="!dirty" @click="discard">Discard changes</button>
          <span v-if="saved" class="profile-saved" role="status">Saved ✓</span>
        </div>
      </section>

      <section class="profile-account">
        <h2>Account</h2>

        <p v-if="profileStore.authStatus" class="profile-loading" role="status">{{ authStatusText }}</p>

        <template v-else-if="profileStore.user">
          <p>Signed in as <strong>{{ profileStore.user.email }}</strong></p>
          <p class="profile-meta">Your progress, favorites, roadmap and profile are saved to your account and synced across devices.</p>
          <button type="button" class="profile-discard" @click="profileStore.signOut()">Sign out</button>
        </template>

        <template v-else>
          <p>You're not signed in. Your profile and progress are stored only in this browser.</p>
          <button type="button" class="profile-save" @click="profileStore.signIn()">Sign in with Google</button>
          <p v-if="profileStore.authError" class="profile-error" role="alert">{{ profileStore.authError }}</p>
        </template>

        <p class="profile-meta" v-if="memberSince">Profile created {{ memberSince }}</p>
        <button type="button" class="profile-reset" @click="resetProfile">Reset profile</button>
      </section>
    </main>
  </div>
`;