import Stepper from './Stepper.js';

export default {
  components: { Stepper },
  props: {
    steps: { type: Number, required: true },
    step: { type: Number, default: 1 },            // v-model:step
    finishStep: Number,                            // defaults to the last step
    stepper: { type: Boolean, default: true },
    stepperType: String,
    stepperClickable: { type: Boolean, default: true },
    beforeNext: Function,                          // (step) => boolean | Promise<boolean>
    beforePrior: Function,
    labels: {
      type: Object,
      default: () => ({ cancel: 'Cancel', help: 'Help', prior: 'Prior', next: 'Next', finish: 'Finish' }),
    },
    showHelp: { type: Boolean, default: true },
  },
  emits: ['update:step', 'cancel', 'help', 'finish'],
  computed: {
    last() { return this.finishStep ?? this.steps; },
    isFirst() { return this.step <= 1; },
    isLast() { return this.step >= this.steps; },
    canFinish() { return this.step === this.last; },
  },
  methods: {
    go(n) {
      if (n >= 1 && n <= this.steps) this.$emit('update:step', n);
    },
    async next() {
      if (this.isLast) return;
      if (this.beforeNext && (await this.beforeNext(this.step)) === false) return;
      this.go(this.step + 1);
    },
    async prior() {
      if (this.isFirst) return;
      if (this.beforePrior && (await this.beforePrior(this.step)) === false) return;
      this.go(this.step - 1);
    },
  },
  template: /*html*/`
    <div class="wizard">
      <Stepper v-if="stepper" :steps="steps" :model-value="step" :type="stepperType"
        :clickable="stepperClickable" @update:model-value="go" />

      <div class="steps">
        <!-- inline display:block so v-show wins over the CSS rule that hides every non-first .step -->
        <div v-for="n in steps" :key="n" v-show="n === step" class="step" style="display:block">
          <slot :name="'step' + n" :step="n" />
        </div>
      </div>

      <div class="actions">
        <div class="group-left">
          <button type="button" class="btn-cancel" @click="$emit('cancel', step)">{{ labels.cancel }}</button>
        </div>
        <div class="group-right">
          <button v-if="showHelp" type="button" class="btn-help" @click="$emit('help', step)">{{ labels.help }}</button>
          <button type="button" class="btn-prior" :disabled="isFirst" @click="prior">{{ labels.prior }}</button>
          <button type="button" class="btn-next" :disabled="isLast" @click="next">{{ labels.next }}</button>
          <button type="button" class="btn-finish" :disabled="!canFinish" @click="$emit('finish', step)">{{ labels.finish }}</button>
        </div>
      </div>
    </div>`,
};