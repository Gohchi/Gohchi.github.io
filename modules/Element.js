export default {
  data() {
    return {
      selected: false,
      count: 0
    }
  },
  props: {
    title: String
  },
  template: `
    <div
      class="tile double"
      :class="{ selected: selected }"
      @click="selected=!selected; console.log(title);"
    >
      <div class="tile-content image">
        <img src="../../metro/images/1.jpg">
      </div>
    </div>`
}