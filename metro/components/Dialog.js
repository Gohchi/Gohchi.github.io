import { dialogStore } from 'store';
export default {
  data: () => ({ dialogStore }),
  template: /*html*/`
    <Teleport to="body">
      <div v-if="dialogStore.current" class="metro window-overlay"
        style="background:rgba(0,0,0,.7)" @click="dialogStore.close()">
        <div class="window" :class="{ flat: dialogStore.current.flat, shadow: dialogStore.current.shadow }"
          style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)" @click.stop>
          <div class="caption">
            <button class="btn-close" @click="dialogStore.close()"></button>
            <div class="title">{{ dialogStore.current.title }}</div>
          </div>
          <div class="content" style="padding:42px 10px 10px">{{ dialogStore.current.content }}</div>
        </div>
      </div>
    </Teleport>`,
};