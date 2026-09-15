export const books = [
  {
    id: 'berserk',
    title: '小説 ベルセルク',
    subtitle: '炎竜の騎士',
    engTitle: 'Berserk: The Flame Dragon Knight',
  },
  {
    id: 'mgs4',
    title: 'メタルギアソリッド4',
    subtitle: 'ガンズ・オブ・ザ・パトリオット',
    engTitle: 'Metal Gear Solid 4: Guns of the Patriots',
  },
  {
    id: 'eoe',
    title: '新世紀エヴァンゲリオン劇場版',
    subtitle: 'まごころを、君に',
    engTitle: 'The End of Evangelion',
  },
];

const loaders = {
  berserk: () => import('./berserk.js'),
  mgs4: () => import('./mgs4.js'),
  eoe: () => import('./eoe.js'),
};

export function getBookMeta(id) {
  return books.find(book => book.id === id) || null;
}

export async function loadBook(id) {
  const loader = loaders[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}