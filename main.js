import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls, clock;
let analyser, dataArray, audioCtx, source;
let fractalMat, mesh;

init();
animate();

async function init() {
  // scene setup
  const container = document.getElementById('viewport');
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 1;
  controls.maxDistance = 10;

  // fractal shader
  const vert = await fetch('shaders/pass.vert').then(r => r.text());
  const frag = await fetch('shaders/fractal.frag').then(r => r.text());
  fractalMat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(innerWidth, innerHeight, 1) },
      iAudio: { value: 0.0 }
    }
  });

  // geometry container
  const geo = new THREE.SphereGeometry(1, 128, 128);
  mesh = new THREE.Mesh(geo, fractalMat);
  scene.add(mesh);

  window.addEventListener('resize', onResize);
  await initAudio();
}

function onResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  fractalMat.uniforms.iResolution.value.set(innerWidth, innerHeight, 1);
}

async function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  source = audioCtx.createMediaStreamSource(stream);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);
}

function getAudioLevel() {
  if (!analyser) return 0;
  analyser.getByteFrequencyData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
  return sum / dataArray.length / 255;
}

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const level = getAudioLevel();

  fractalMat.uniforms.iTime.value = t;
  fractalMat.uniforms.iAudio.value = level;

  mesh.rotation.y += 0.0015;
  mesh.rotation.x += 0.0007;
  controls.update();
  renderer.render(scene, camera);
}
