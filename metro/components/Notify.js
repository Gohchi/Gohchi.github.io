import { notifyStore } from 'store';
export default {
  data: () => ({ notifyStore }),
  template: /*html*/`
    <div class="metro notify-container">
      <TransitionGroup name="notify">
        <div v-for="n in notifyStore.items" :key="n.id" class="notify shadow"
          :style="{ backgroundColor: n.background, color: n.color }" @click="notifyStore.close(n.id)">
          <div v-if="n.caption" class="caption" v-html="n.caption"></div>
          <div class="content" v-html="n.content"></div>
        </div>
      </TransitionGroup>
    </div>`,
};