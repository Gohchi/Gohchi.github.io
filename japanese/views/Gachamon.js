import MainHeader from 'components/MainHeader.js';
import template from 'templates/Gachamon.js';

import {
  GachamonError,
  mediaUrl,
  pullSources,
  watchGachamonAuth,
  signInGachamon,
  signOutGachamon,
  listBanners,
  getBanner,
  getMe,
  getInventory,
  pullBanner,
  listDrops,
  claimDrop,
  redeemCode,
} from 'data/gachamon.js';

const SIGN_IN_ERRORS = {
  'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow pop-ups for this site and try again.',
  'auth/unauthorized-domain': 'This site is not authorized in the Gachamon Firebase project yet.',
};
const SILENT = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];

export default {
  components: { MainHeader },
  data() {
    return {
      booting: true,       // restoring the session
      user: null,          // Gachamon Firebase user
      player: null,        // { id, name, pulls, status }
      banners: [],
      banner: null,        // opened banner (with items)
      results: [],         // items from the last pull
      inventory: [],
      drops: [],
      sources: {},
      code: '',
      busy: false,
      error: '',
      notice: '',
      unwatch: null,
    };
  },
  computed: {
    waiting() { return this.player?.status === 'pending'; },
    rejected() { return this.player?.status === 'rejected'; },
    canPlay() { return this.player?.status === 'active'; },
    pulls() { return this.player?.pulls ?? 0; },
  },
  methods: {
    mediaUrl,
    fail(error) {
      if (SILENT.includes(error?.code)) return;
      this.error = SIGN_IN_ERRORS[error?.code] || error?.message || 'Something went wrong.';
    },
    async run(task) {
      this.error = '';
      this.notice = '';
      this.busy = true;
      try {
        return await task();
      } catch (error) {
        if (error instanceof GachamonError && error.status === 402) {
          this.error = 'Not enough pulls for that.';
        } else {
          this.fail(error);
        }
      } finally {
        this.busy = false;
      }
    },
    async loadBanners() {
      this.banners = await listBanners();
    },
    async loadPlayer() {
      this.player = await getMe();
      if (!this.canPlay) return;
      await Promise.all([this.loadInventory(), this.loadDrops()]);
    },
    async loadInventory() {
      this.inventory = await getInventory();
    },
    async loadDrops() {
      this.drops = this.sources.drops ? await listDrops() : [];
    },
    signIn() {
      return this.run(() => signInGachamon());
    },
    async signOut() {
      await this.run(() => signOutGachamon());
    },
    openBanner(summary) {
      return this.run(async () => {
        this.results = [];
        this.banner = await getBanner(summary.id);
      });
    },
    closeBanner() {
      this.banner = null;
      this.results = [];
    },
    pull(count) {
      return this.run(async () => {
        const { items, player } = await pullBanner(this.banner.id, count);
        this.results = items;
        this.player = player;
        await this.loadInventory();
      });
    },
    claim(drop) {
      return this.run(async () => {
        const { claimed, player } = await claimDrop(drop.id);
        this.player = player;
        this.notice = `+${claimed} pull${claimed === 1 ? '' : 's'} claimed!`;
        await this.loadDrops();
      });
    },
    redeem() {
      const code = this.code.trim();
      if (!code) return;
      return this.run(async () => {
        const { redeemed, player } = await redeemCode(code);
        this.player = player;
        this.code = '';
        this.notice = `Code accepted: +${redeemed} pull${redeemed === 1 ? '' : 's'}!`;
      });
    },
    foilLabel(item) {
      return item.foil ? `✦ ${item.foil.name}` : '';
    },
    chance(value) {
      return `${Number(value).toFixed(value < 1 ? 2 : 1)}%`;
    },
  },
  async mounted() {
    try {
      this.sources = await pullSources();
      await this.loadBanners();
      this.unwatch = await watchGachamonAuth(async user => {
        this.user = user;
        this.player = null;
        this.inventory = [];
        this.drops = [];
        if (user) await this.run(() => this.loadPlayer());
        this.booting = false;
      });
    } catch (error) {
      this.fail(error);
      this.booting = false;
    }
  },
  beforeUnmount() {
    this.unwatch?.();
  },
  template,
};
