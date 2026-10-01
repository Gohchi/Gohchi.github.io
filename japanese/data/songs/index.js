export const songs = [
  {
    id: 'akg-world_world_world',
    title: 'World World',
    subtitle: 'by ASIAN KUNG-FU GENERATION',
    engTitle: 'World World',
  },
];

const loaders = {
  'akg-world_world_world': () => import('./akg-world_world_world.js'),
};

export function getSongMeta(id) {
  return songs.find(song => song.id === id) || null;
}

export async function loadSong(id) {
  const loader = loaders[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}