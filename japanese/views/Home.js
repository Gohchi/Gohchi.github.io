import MainHeader from 'components/MainHeader.js';
import PhraseToRuby from 'components/PhraseToRuby.js';
import template from 'templates/Home.js';

import { furiganaStore } from 'store';

export default {
  components: {
    MainHeader,
    PhraseToRuby,
  },
  data() {
    return {
      furiganaStore,
    };
  },
  template,
}