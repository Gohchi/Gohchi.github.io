// import common.js
registerServiceWorker('/gametracker/sw.js');

const modules = {
  'D-DS': './modules/disgaea-ds/main.js',
  'D-3': './modules/disgaea-3/main.js',
};

let scripts;

window.trackerChanged = function (e) {
  const id = e.target.value;
  
  clear();

  import(modules[id])
    .then((Module) => {
      scripts = new Module.default();
      scripts.start();
    });
};

window.clearData = function () {
  scripts.clearData();
};

// fire first time
window.trackerChanged({
  target: { value: document.getElementById('game-id').value }
});

function clear() {
  for (const id of ['game-body', 'game-actions']) {
    const element = document.getElementById(id);
    element.innerHTML = '';
    element.className = '';
  }
};