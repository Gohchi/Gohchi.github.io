// import common.js
registerServiceWorker('/gametracker/sw.js');

const modules = {
  'D-DS': './modules/disgaea-ds/main.js',
  'D-3': './modules/disgaea-3/main.js',
};

let scripts;

window.trackerChanged = function (e) {
  const id = e.target.value;
  console.log(id);
  import(modules[id])
    .then((Module) => {
      scripts = new Module.default();
      scripts.start();
    });
};

window.markUnmark = function () {
  scripts.markUnmark();
};
window.clearData = function () {
  scripts.clearData();
};

window.trackerChanged({
  target: { value: 'D-3' }
});
