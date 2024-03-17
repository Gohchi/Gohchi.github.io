import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer;
const RESOURCES_PATH = '../modules/threejs/examples/models/';

export function init(id) {
  const container = document.getElementById(id);
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(1.5, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(4, 6, 18);

  scene = new THREE.Scene();
  
  function createLights() {
    const ambientLight = new THREE.AmbientLight('white', 2);

    const mainLight = new THREE.DirectionalLight('white', 5);
    mainLight.position.set(10, 1, 10);

    return { ambientLight, mainLight };
  }
  
  const loader = new GLTFLoader().setPath(RESOURCES_PATH);
  loader.load('Portrait.glb', async function (gltf) {
    const model = gltf.scene;

    await renderer.compileAsync(model, camera, scene);

    const { ambientLight, mainLight } = createLights();
    scene.add(ambientLight, mainLight, model);

    render();
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setClearColor(0x000000, 0); // the default
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 1000;
  controls.target.set(0, 0.08, 0);
  controls.update();

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  renderer.render(scene, camera);
}