import AppHeader from 'components/AppHeader.js';
import AppFooter from 'components/AppFooter.js';
import FilterBar from 'components/FilterBar.js';
import ItemCard from 'components/ItemCard.js';
import ItemDetail from 'components/ItemDetail.js';

import template from 'templates/Home.js';

import { items } from 'data/items.js';
import contactData from '/data.json' with { type: 'json' };

export default {
  components: {
    AppHeader,
    AppFooter,
    FilterBar,
    ItemCard,
    ItemDetail,
  },
  data() {
    return {
      items,
      selectedType: 'all',
      searchQuery: '',
      hideSold: false,
      selectedItemId: null,
      contactEmail: contactData.email,
    };
  },
  methods: {
    openItem(id) {
      this.selectedItemId = id;
    },
    closeItem() {
      this.selectedItemId = null;
    },
  },
  computed: {
    selectedItem() {
      return this.items.find(item => item.id === this.selectedItemId) || null;
    },
    filteredItems() {
      const query = this.searchQuery.trim().toLowerCase();

      return this.items.filter(item => {
        if (this.hideSold && item.status === 'sold') return false;
        if (this.selectedType !== 'all' && item.type !== this.selectedType) return false;

        if (query) {
          const haystack = [item.title, item.subtype, item.description, ...(item.tags || [])]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(query)) return false;
        }

        return true;
      });
    },
  },
  template,
};
