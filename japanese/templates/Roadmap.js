export default /*html*/`
  <div class="roadmap">
    <MainHeader
      title="ROADMAP"
      @onChangeFurigana="furiganaStore.switchFurigana()"
    ></MainHeader>

    <main>
      <section class="roadmap-intro">
        <p class="eyebrow">学習ロードマップ · Learning roadmap</p>
        <h1>Your path through this site</h1>
        <p class="lead">
          A suggested order to work through the tools here. Priority one: stop reading
          romaji as soon as possible — everything below is built kana-first on purpose.
        </p>
      </section>

      <ol class="stage-list">
        <li v-for="(stage, index) in roadmap" :key="stage.id" class="stage">
          <div class="stage-header">
            <span class="stage-number">{{ index + 1 }}</span>
            <div class="stage-heading">
              <h2>{{ stage.title }}</h2>
              <p class="stage-subtitle">{{ stage.subtitle }}</p>
            </div>
            <div class="stage-progress" v-if="stage.steps.length">
              {{ stageProgress(stage).done }}/{{ stageProgress(stage).total }}
            </div>
          </div>

          <ul class="step-list">
            <li
              v-for="step in stage.steps" :key="step.id"
              class="step"
              :class="{ done: isDone(step.id) }"
            >
              <label class="step-check">
                <input type="checkbox" :checked="isDone(step.id)" @change="toggleStep(step.id)" />
                <span></span>
              </label>
              <div class="step-body">
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
                <div class="step-links" v-if="step.links && step.links.length">
                  <router-link
                    v-for="link in step.links.filter(l => l.route)" :key="link.label"
                    :to="link.route"
                    class="step-link"
                  >{{ link.label }} →</router-link>
                  <a
                    v-for="link in step.links.filter(l => l.href)" :key="link.href"
                    :href="link.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="step-link"
                  >{{ link.label }} →</a>
                </div>
                <span v-if="step.comingSoon" class="step-soon">Coming soon</span>
              </div>
            </li>
          </ul>
        </li>
      </ol>

      <section class="roadmap-more">
        <h2>More on the way</h2>
        <p>New stages will show up here as new sections launch on the site.</p>
      </section>
    </main>
  </div>
`;