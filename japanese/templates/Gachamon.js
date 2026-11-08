export default /*html*/`
  <div class="gachamon">
    <MainHeader
      title="GACHA"
      hideFurigana="true"
      hideZoom="true"
    />

    <main>
      <section class="gm-hero">
        <p class="eyebrow">ガチャ · Powered by Gachamon</p>
        <h1>Pull a card</h1>
      </section>

      <p v-if="error" class="gm-message gm-error" role="alert">{{ error }}</p>
      <p v-if="notice" class="gm-message gm-notice" role="status">{{ notice }}</p>

      <p v-if="booting" class="gm-muted">Loading…</p>

      <template v-else>
        <!-- account -->
        <section class="gm-account">
          <template v-if="user">
            <span class="gm-who">{{ player?.name || user.displayName || user.email }}</span>
            <span v-if="canPlay" class="gm-pulls">🎟 {{ pulls }} pull{{ pulls === 1 ? '' : 's' }}</span>
            <button type="button" class="gm-link" :disabled="busy" @click="signOut">Sign out</button>
          </template>
          <button v-else type="button" class="gm-button" :disabled="busy" @click="signIn">
            Sign in with Google to play
          </button>
        </section>

        <p v-if="waiting" class="gm-message">Your account is waiting for approval. You can play once it is approved.</p>
        <p v-if="rejected" class="gm-message gm-error">Your account was not approved for this game.</p>

        <!-- banner opened -->
        <section v-if="banner" class="gm-banner">
          <button type="button" class="gm-link" @click="closeBanner">← All banners</button>
          <h2>{{ banner.name }}</h2>
          <img v-if="banner.image" class="gm-banner-image" :src="mediaUrl(banner.image)" :alt="banner.name" />

          <div class="gm-actions">
            <button type="button" class="gm-button" :disabled="busy || !canPlay || pulls < 1" @click="pull(1)">Pull ×1</button>
            <button type="button" class="gm-button" :disabled="busy || !canPlay || pulls < 10" @click="pull(10)">Pull ×10</button>
          </div>
          <p v-if="!user" class="gm-muted">Sign in to pull.</p>

          <div v-if="results.length" class="gm-results">
            <h3>You got</h3>
            <div class="gm-cards">
              <article v-for="(item, i) in results" :key="i" class="gm-card" :class="'rarity-' + item.rarity.toLowerCase()">
                <img v-if="item.image" :src="mediaUrl(item.image)" :alt="item.name" loading="lazy" />
                <h4>{{ item.name }}</h4>
                <p class="gm-rarity">{{ item.rarity }} <span v-if="item.foil" class="gm-foil" :style="{ color: item.foil.color }">{{ foilLabel(item) }}</span></p>
                <p v-if="item.description" class="gm-desc">{{ item.description }}</p>
              </article>
            </div>
          </div>

          <h3>Odds</h3>
          <ul class="gm-odds">
            <li v-for="o in banner.odds" :key="o.rarity">{{ o.rarity }}: {{ chance(o.chance) }} ({{ o.items }} items)</li>
          </ul>

          <h3>Items</h3>
          <div class="gm-cards">
            <article v-for="item in banner.items" :key="item.id" class="gm-card gm-card-small">
              <img v-if="item.image" :src="mediaUrl(item.image)" :alt="item.name" loading="lazy" />
              <h4>{{ item.name }}</h4>
              <p class="gm-rarity">{{ item.rarity }} · {{ chance(item.chance) }}</p>
            </article>
          </div>
        </section>

        <!-- banner list -->
        <section v-else class="gm-banners">
          <h2>Banners</h2>
          <p v-if="!banners.length" class="gm-muted">No banner is live right now.</p>
          <div class="gm-grid">
            <button v-for="b in banners" :key="b.id" type="button" class="gm-tile" @click="openBanner(b)">
              <img v-if="b.image" :src="mediaUrl(b.image)" :alt="b.name" loading="lazy" />
              <h3>{{ b.name }}</h3>
              <p>{{ b.item_count }} items<span v-if="b.ends_at"> · until {{ b.ends_at }}</span></p>
            </button>
          </div>
        </section>

        <!-- free pulls -->
        <section v-if="canPlay && drops.length" class="gm-drops">
          <h2>Free pulls</h2>
          <ul>
            <li v-for="d in drops" :key="d.id">
              <span>{{ d.name }} (+{{ d.pulls }})</span>
              <button v-if="d.can_claim" type="button" class="gm-button" :disabled="busy" @click="claim(d)">Claim</button>
              <span v-else class="gm-muted">{{ d.claimed ? 'Claimed' : 'Coming soon' }}</span>
            </li>
          </ul>
        </section>

        <section v-if="canPlay && sources.codes" class="gm-code">
          <h2>Have a code?</h2>
          <form @submit.prevent="redeem">
            <input v-model="code" type="text" placeholder="XXXX-XXXX-XXXX" autocomplete="off" />
            <button type="submit" class="gm-button" :disabled="busy || !code.trim()">Redeem</button>
          </form>
        </section>

        <!-- inventory -->
        <section v-if="canPlay" class="gm-inventory">
          <h2>Your collection</h2>
          <p v-if="!inventory.length" class="gm-muted">Nothing yet. Make your first pull!</p>
          <ul>
            <li v-for="row in inventory" :key="row.id + '-' + (row.foil || '')">
              {{ row.name }} <span class="gm-rarity">({{ row.rarity }}<template v-if="row.foil"> · ✦ {{ row.foil }}</template>)</span>
              <strong v-if="row.copies > 1"> ×{{ row.copies }}</strong>
            </li>
          </ul>
        </section>
      </template>
    </main>
  </div>
`;
