export default /*html*/`
  <div class="kana-keyboard">
    <MainHeader
      title="KANA KEYBOARD"
      hideFurigana="true"
      hideZoom="true"
    >
    </MainHeader>

    <main>
      <div class="card">
        <div style="text-align:center">Type this kana:</div>
        <div id="prompt" class="prompt">{{ target }}</div>

        <div id="status" :class="statusClass">{{ status }}</div>

        <div class="row">
          <button @click="newTarget">Next</button>
          <button @click="resetScore">Reset</button>
          <button @click="focusInput">Focus</button>
        </div>

        <div class="stats">
          <div>Score: <span id="score">{{ score }}</span></div>
          <div>Streak: <span id="streak">{{ streak }}</span></div>
          <div>Last: <span id="last">{{ last }}</span></div>
        </div>
      </div>

      <!-- Hidden input for IME-safe capture -->
      <input ref="capture" autocomplete="off" v-model="inputValue" @input="onInput" id="capture" />
    </main>
  </div>
`;