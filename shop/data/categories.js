export const categories = [
  { id: 'all', label: 'All items' },
  { id: 'books', label: 'Books' },
  { id: 'figures', label: 'Figures' },
  { id: 'tcg', label: 'TCG Cards' },
  { id: 'videogames', label: 'Video Games' },
  { id: 'tech', label: 'Tech' },
  { id: 'other', label: 'Other' },
];

// Human-readable labels for item condition, used on cards and detail view.
export const conditions = {
  new: 'New',
  'like-new': 'Like new',
  used: 'Used',
  'for-parts': 'For parts / not working',
};

// Human-readable labels + styling hooks for item status.
export const statuses = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
};
