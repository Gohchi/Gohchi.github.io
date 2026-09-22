import MainHeader from 'components/MainHeader.js';
import template from 'templates/Roadmap.js';

import { roadmap } from 'data/roadmap.js';
import { getCompleted, toggleCompleted } from 'data/roadmap-progress.js';

import { furiganaStore } from 'store';

export default {
  components: {
    MainHeader,
  },
  data() {
    return {
      roadmap,
      completed: getCompleted(),
      furiganaStore,
    };
  },
  methods: {
    isDone(stepId) {
      return this.completed.includes(stepId);
    },
    toggleStep(stepId) {
      this.completed = toggleCompleted(stepId);
    },
    stageProgress(stage) {
      const total = stage.steps.length;
      const done = stage.steps.filter(step => this.completed.includes(step.id)).length;
      return { done, total };
    },
  },
  template,
}