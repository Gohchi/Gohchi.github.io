import { LANGS, i18n, setLang, t } from 'data/i18n.js';

// Flags are inline SVG: emoji flags do not render on Windows.
export default {
  data() {
    return { langs: LANGS };
  },
  computed: {
    current() {
      return i18n.lang;
    },
  },
  methods: { setLang, t },
  template: /*html*/`
    <div class="lang-switch" role="radiogroup" :aria-label="t('lang.label')">
      <button
        v-for="lang in langs"
        :key="lang.code"
        type="button"
        role="radio"
        class="lang-btn"
        :class="{ on: current === lang.code }"
        :aria-checked="current === lang.code"
        :aria-label="lang.label"
        :title="lang.label"
        @click="setLang(lang.code)"
      >
        <!-- Argentina -->
        <svg v-if="lang.code === 'es'" viewBox="0 0 24 16" aria-hidden="true">
          <rect width="24" height="16" fill="#74ACDF" />
          <rect y="5.33" width="24" height="5.34" fill="#ffffff" />
          <circle cx="12" cy="8" r="1.7" fill="#F6B40E" />
        </svg>
        <!-- United Kingdom -->
        <svg v-else viewBox="0 0 60 30" aria-hidden="true">
          <clipPath id="uk-s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
          <clipPath id="uk-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
          <g clip-path="url(#uk-s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" stroke-width="6" />
            <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#uk-t)" stroke="#C8102E" stroke-width="4" />
            <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" stroke-width="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6" />
          </g>
        </svg>
      </button>
    </div>
  `,
};