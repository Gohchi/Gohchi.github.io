import { computed, provide } from 'vue';

export default {
  props: {
    modelValue: { type: [String, Number, Array], default: null }, // open id, or ids when !closeAny
    closeAny: { type: Boolean, default: true },                   // true = only one open at a time
    marker: Boolean,                                              // the "with-marker" arrow style
  },
  emits: ['update:modelValue', 'open'],
  setup(props, { emit }) {
    const openIds = computed(() => new Set([].concat(props.modelValue ?? [])));

    provide('accordion', {
      isOpen: id => openIds.value.has(id),
      toggle(id) {
        const opening = !openIds.value.has(id);
        if (props.closeAny) {
          emit('update:modelValue', opening ? id : null);
        } else {
          const next = new Set(openIds.value);
          opening ? next.add(id) : next.delete(id);
          emit('update:modelValue', [...next]);
        }
        if (opening) emit('open', id);
      },
    });
  },
  template: `<div class="accordion" :class="{ 'with-marker': marker }"><slot /></div>`,
};