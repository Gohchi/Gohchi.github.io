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
        <template v-if="profileStore.user">
          <p>Signed in as <strong>{{ profileStore.user.email }}</strong></p>
        </template>
        <template v-else>
          <p>You're not signed in. Your profile and progress are stored only in this browser.</p>
          <button type="button" class="profile-discard" disabled>Sign in (coming soon)</button>
        </template>
        <p class="profile-meta" v-if="memberSince">Profile created {{ memberSince }}</p>
        <button type="button" class="profile-reset" @click="resetProfile">Reset profile</button>
      </section>
    </main>
  </div>
`;