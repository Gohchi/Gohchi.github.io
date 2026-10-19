import MainHeader from 'components/MainHeader.js';
import template from 'templates/Donate.js';

import { donationLinks } from 'data/donate.js';

export default {
  components: {
    MainHeader,
  },
  data() {
    return {
      donationLinks,
      photoOk: true,
    };
  },
  template,
};