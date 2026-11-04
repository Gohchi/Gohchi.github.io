export default {
  props: {
    streak: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    last: { type: String, default: undefined }, // optional: only shown when provided
    mastered: {
      type: Object, // { mastered, total }
      default: () => ({ mastered: 0, total: 0 }),
    },
    memory: { type: Number, default: undefined }, // optional: memory stage of the current item, drawn as a small bar
    memoryMax: { type: Number, default: 5 },
  },
  template: /*html*/`
    <div class="info-icons">
      <div class="streak" title="Streak">
        <div class="icon fire-mask" :class="{ active: streak > 0 }"></div>
        {{ streak }}
      </div>
      <div class="score" title="Score">
        <div class="icon star-mask"></div>
        {{ score }}
      </div>
      <div v-if="last !== undefined" class="last" title="Last answer">
        <div class="icon return-mask"></div>
        {{ last }}
      </div>
      <div class="mastered" title="Mastered">
        <div class="icon mastered-mask"></div>
        {{ mastered.mastered }}/{{ mastered.total }}
      </div>
      <div
        v-if="memory !== undefined"
        class="memory-meter"
        role="meter"
        :aria-valuenow="memory"
        aria-valuemin="0"
        :aria-valuemax="memoryMax"
        :title="'Memory: ' + memory + '/' + memoryMax"
      ><span :style="{ width: (memoryMax ? memory / memoryMax * 100 : 0) + '%' }"></span></div>
    </div>
  `,
};