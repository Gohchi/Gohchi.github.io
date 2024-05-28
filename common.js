async function registerServiceWorker(path) {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(path);
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

async function addResourcesToCache(storeName, resources) {
  const cache = await caches.open(storeName);
  await cache.addAll(resources);
};