import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls, clock;
let fractalMat, mesh;
let audioCtx, analyser, dataArray;
let started = false;

// --- Wait for the DOM before wiring up the button ---
window.addEventListener('DOMContentLoaded', () => {
  console.log("✅ Fractal Harmonics: DOM ready");
  const btn = document.getElementById('startBtn');
  if (btn) {
    btn.addEventListener('click', async () => {
      if (started) return;
      started = true;
      document.getElementById('overlay').style.display = 'none';
      try {
        await initScene();
        await initAudio();
        animate();
      } catch (err) {
        console.error("❌ Initialization failed:", err);
        alert("Error starting Fractal Harmonics. Check console for details.");
      }
    });
  } else {
    console.error("❌ startBtn not found in DOM!");
  }
});

async function initScene() {
  console.log("🎨 Initializing scene...");
  const container = document.getElementById('viewport');
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 1;
  controls.maxDistance = 10;

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

  const geo = new THREE.SphereGeometry(1, 128, 128);
  mesh = new THREE.Mesh(geo, fractalMat);
  scene.add(mesh);

  window.addEventListener('resize', onResize);
  console.log("✅ Scene initialized");
}

function onResize() {
  if (!camera || !renderer || !fractalMat) return;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  fractalMat.uniforms.iResolution.value.set(innerWidth, innerHeight, 1);
}

// --- AUDIO SETUP ---
async function initAudio() {
  console.log("🎧 Initializing audio...");
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  let stream;
  try {
    // must be user gesture triggered (the Start button)
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("🎙️ Microphone access granted.");
  } catch (err) {
    console.warn("⚠️ Mic access denied, using fallback audio element.");
    const player = document.getElementById('player');
    if (player) {
      player.play();
      stream = player.captureStream();
    } else {
      throw new Error("No fallback <audio> element found.");
    }
  }

  const source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyser);
  console.log("✅ Audio analyzer connected.");
}

// --- ANALYSIS HELPERS ---
function getAudioLevel() {
  if (!analyser) return 0;
  analyser.getByteFrequencyData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
  return sum / dataArray.length / 255;
}

// --- MAIN LOOP ---
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const level = getAudioLevel();

  if (fractalMat) {
    fractalMat.uniforms.iTime.value = t;
    fractalMat.uniforms.iAudio.value = level;
  }

  if (mesh) {
    mesh.rotation.y += 0.0015;
    mesh.rotation.x += 0.0008;
  }

  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}
