import { Controller } from './controller.js';
import * as Bars from './modes/bars.js';
import * as Wave from './modes/wave.js';
import * as Circle from './modes/circle.js';

let currentMode = null;
let analyser, dataArray, ctx, audioCtx, canvas, menu;

window.addEventListener('DOMContentLoaded', initCore);

function initCore() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  menu = document.getElementById('modeMenu');

  // resize listener
  resize();
  window.onresize = resize;

  // hook dropdown
  menu.addEventListener('change', () => {
    switchMode(menu.value);
  });

  // create controller overlay
  Controller.init();
  switchMode(menu.value); // load default
}

async function startMic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    await audioCtx.resume();
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioCtx.createMediaStreamSource(stream);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  source.connect(analyser);
  return true;
}

function switchMode(mode) {
  switch (mode) {
    case 'bars': currentMode = Bars; break;
    case 'wave': currentMode = Wave; break;
    case 'circle': currentMode = Circle; break;
  }
  Controller.setTarget(currentMode);
}

function resize() {
  if (!canvas) return;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

startMic().then(loop);

function loop() {
  requestAnimationFrame(loop);
  if (!analyser || !currentMode) return;
  analyser.getByteFrequencyData(dataArray);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  currentMode.draw(ctx, dataArray, Controller.settings);
}
// core logic placeholder
