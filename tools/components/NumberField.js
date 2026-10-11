import { clamp } from 'data/mosaic.js';

// Number field made for touch and mouse:
//  - big − / + buttons (hold to repeat)
//  - typed values are applied while typing and clamped when leaving the field
//  - optional slider
export default {
  props: {
    label: String,
    unit: String,
    modelValue: { type: Number, required: true },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 9999 },
    step: { type: Number, default: 1 },
    slider: Boolean,
    sliderMax: Number,
    compact: Boolean,
  },
  emits: ['update:modelValue'],
  computed: {
    rangeMax() {
      return Math.min(this.max, this.sliderMax ?? this.max);
    },
    fill() {
      const span = this.rangeMax - this.min || 1;
      return clamp(((this.modelValue - this.min) / span) * 100, 0, 100) + '%';
    },
  },
  methods: {
    commit(value) {
      const result = clamp(Math.round(value), this.min, this.max);
      if (result !== this.modelValue) this.$emit('update:modelValue', result);
      return result;
    },
    nudge(direction) {
      this.commit(this.modelValue + direction * this.step);
    },
    startHold(direction) {
      this.stopHold();
      this.nudge(direction);
      this.holdDelay = setTimeout(() => {
        this.holdRepeat = setInterval(() => this.nudge(direction), 70);
      }, 400);
    },
    stopHold() {
      clearTimeout(this.holdDelay);
      clearInterval(this.holdRepeat);
    },
    // keyboard activation (Enter/Space) arrives as a click without pointer
    onClick(e, direction) {
      if (e.detail === 0) this.nudge(direction);
    },
    onInput(e) {
      const value = e.target.valueAsNumber;
      if (Number.isFinite(value) && value >= this.min && value <= this.max) {
        this.$emit('update:modelValue', Math.round(value));
      }
    },
    onChange(e) {
      const value = e.target.valueAsNumber;
      e.target.value = this.commit(Number.isFinite(value) ? value : this.modelValue);
    },
    onRange(e) {
      this.commit(Number(e.target.value));
    },
  },
  beforeUnmount() {
    this.stopHold();
  },
  template: /*html*/`
    <div class="field" :class="{ compact }">
      <div class="field-head">
        <span v-if="label" class="field-label">{{ label }}<span v-if="unit" class="unit"> {{ unit }}</span></span>
        <div class="stepper">
          <button
            type="button"
            class="step"
            aria-label="Disminuir"
            :disabled="modelValue <= min"
            @pointerdown="startHold(-1)"
            @pointerup="stopHold"
            @pointerleave="stopHold"
            @pointercancel="stopHold"
            @click="onClick($event, -1)"
          ><i class="material-icons" aria-hidden="true">remove</i></button>
          <input
            type="number"
            inputmode="numeric"
            step="1"
            :aria-label="label"
            :min="min"
            :max="max"
            :value="modelValue"
            @input="onInput"
            @change="onChange"
            @focus="$event.target.select()"
          />
          <button
            type="button"
            class="step"
            aria-label="Aumentar"
            :disabled="modelValue >= max"
            @pointerdown="startHold(1)"
            @pointerup="stopHold"
            @pointerleave="stopHold"
            @pointercancel="stopHold"
            @click="onClick($event, 1)"
          ><i class="material-icons" aria-hidden="true">add</i></button>
        </div>
      </div>
      <input
        v-if="slider"
        type="range"
        class="range"
        :aria-label="label"
        :min="min"
        :max="rangeMax"
        step="1"
        :value="modelValue"
        :style="{ '--fill': fill }"
        @input="onRange"
      />
    </div>
  `,
};