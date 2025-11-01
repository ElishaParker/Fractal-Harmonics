import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, analyser, dataArray, droplet, material, audioCtx;
let composer, bloomPass, clock;
let started = false;

document.getElementById('startBtn').addEventListener('click', async () => {
  if (started) return;
  started = true;
  document.getElementById('startBtn').style.display = 'none';
  await initScene();
  await initAudio();
  animate();
});

async function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 3;
  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(3, 3, 3);
  scene.add(light);

  const [vertexShader, fragmentShader] = await Promise.all([
    fetch('./shaders/droplet.vert').then(r => r.text()),
    fetch('./shaders/droplet.frag').then(r => r.text())
  ]);

  const geo = new THREE.SphereGeometry(1, 256, 256);
  material = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iAudio: { value: 0.0 },
      iColor: { value: new THREE.Color(0x00ffff) }
    },
    vertexShader, fragmentShader
  });

  droplet = new THREE.Mesh(geo, material);
  scene.add(droplet);

  const renderScene = new RenderPass(scene, camera);
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, 0.4, 0.85
  );
  composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  window.addEventListener('resize', onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

async function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioCtx.createMediaStreamSource(stream);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  source.connect(analyser);
}

function getDominantFreq() {
  analyser.getByteFrequencyData(dataArray);
  const maxIndex = dataArray.indexOf(Math.max(...dataArray));
  const freq = maxIndex * (audioCtx.sampleRate / analyser.fftSize);
  const amplitude = Math.max(...dataArray) / 255;
  return { freq, amplitude };
}

function mapFreqToColor(freq) {
  const ranges = [
    { f: 396, color: new THREE.Color(0xff0000) },
    { f: 432, color: new THREE.Color(0xffa500) },
    { f: 528, color: new THREE.Color(0x00ff00) },
    { f: 639, color: new THREE.Color(0x00ffff) },
    { f: 741, color: new THREE.Color(0x0000ff) },
    { f: 852, color: new THREE.Color(0x8b00ff) }
  ];
  let result = ranges[0].color;
  for (let i = 1; i < ranges.length; i++) {
    if (freq < ranges[i].f) {
      result = ranges[i - 1].color.clone().lerp(ranges[i].color, 0.5);
      break;
    }
  }
  return result;
}

function animate() {
  requestAnimationFrame(animate);
  if (!analyser) return;

  const { freq, amplitude } = get

