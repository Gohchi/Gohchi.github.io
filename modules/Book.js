import contactData from '/data.json' assert {type: 'json'};

export default {
  data() {
    return {
      ...contactData,
      activeView: 1
    }
  },
  props: {
    show: String,
  //   phone: String,
  //   email: String,
  },
  methods: {
    copyToClipboard(value) {
      // const { phone } = this.$data;
      const element = document.createElement("input");
      element.type = "text";
      element.value = value;
      document.body.appendChild(element);
      element.select();
      element.setSelectionRange(0, 99999);
      document.execCommand('copy');
      document.body.removeChild(element);
    }
  },
  template: /*html*/`
    <div class="book wrap" :class="{ out: !show }">
      <div class="card" :class="{ viewfront: activeView == 'front', viewback: activeView == 'back' }">
        <div class="front clickable" @click="activeView='front'">
          <div class="side-text">Mart&iacute;n A. Farias biography</div>
        </div>
        <div class="back"></div>
        <div class="top"></div>
        <div class="bottom"></div>

        <div class="left clickable" @click="activeView='back'">
          <div class="name">Mart&iacute;n A. Farias</div>
          <div class="prof">Web Developer</div>
        </div>
        <div class="right clickable" @click="activeView=''">
          <div class="logo"><i class="fa fa-cubes"></i>
            Web Developer
          </div>
          <div class="bottomInfo">
            <ul v-on:click.stop>
              <li><i class="fa fa-home"></i></li>
              <li class="copy-content" title="copy number to clipboard" @click="copyToClipboard(phone)"><i class="fa fa-phone"></i>{{ phone }}</li>
              <li class="copy-content" title="copy e-mail to clipboard" @click="copyToClipboard(email)"><i class="fa fa-email"></i>{{ email }}</li>
              <li>
                <a href="https://github.com/gohchi/" target="_blank">
                  <img class="icon" src="images/icons/github.png" /></a>
                <a href="https://ar.linkedin.com/in/fariasmartinpixel/" target="_blank">
                  <img class="icon" src="images/icons/linkedin.ico" /></a>
                <a :href="'mailto:' + email">
                  <img class="icon" src="images/icons/email.png" /></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
}