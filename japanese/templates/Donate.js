export default /*html*/`
  <div class="donate">
    <MainHeader
      title="DONATE"
      hideFurigana="true"
      hideZoom="true"
    />

    <main>
      <section class="donate-hero">
        <img
          v-if="photoOk"
          class="donate-photo"
          src="images/me.jpg"
          alt="Martín, the author of this site"
          @error="photoOk = false"
        />
        <p class="eyebrow">ありがとう · Thank you</p>
        <h1>Support this project</h1>
        <p class="lead">
          If you found this useful and want to help me, I will be so grateful.
          Everything here is free to use, and donating is completely optional.
          Your support helps me keep building tools and adding more content.
        </p>
      </section>

      <section class="donate-options">
        <h2>Ways to help</h2>
        <div class="donate-grid">
          <a
            v-for="item in donationLinks" :key="item.id"
            class="donate-card"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <span class="donate-cta">{{ item.cta }} →</span>
          </a>
        </div>
      </section>

      <section class="donate-other">
        <h2>Can't donate? That's okay too</h2>
        <ul>
          <li>Share the site with someone who is learning Japanese.</li>
          <li>Tell me about mistakes or things that could be clearer.</li>
          <li>Keep practicing. That's the best thank-you.</li>
        </ul>
      </section>

      <p class="donate-thanks">ありがとうございます 🍣 Thank you for stopping by!</p>
    </main>
  </div>
`;