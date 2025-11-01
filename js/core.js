// Fractal Harmonics – Core Integration Layer
// Hooks controller overlay into Benchmark 1 visualizer
// and syncs with the existing mic + analyser pipeline

import { Controller } from './controller.js';
import * as Bars from './modes/bars.js';
import * as Wave from './modes/wave.js';
import * as Circle from './modes/circle.js';

let currentMode = Bars;
let ctx, analyser, dataArray, menu;

// Wait until the benchmark’s visualizer is active
window.addEventListener('load', () => {
  console.log("🎛 Fractal Harmonics Controller initializing...");

  // Get shared objects created by Benchmark 1
  ctx = document.getElementById('canvas').getContext('2d');
  menu = document.getElementById('modeMenu');
  analyser = window.analyser || null;
  dataArray = window.dataArray || null;

  if (!ctx) {
    console.error("❌ Canvas context not found. Make sure Benchmark 1 is loaded.");
    return;
  }

  // Create the controller overlay UI
  Controller.init();
  Controller.setTarget(currentMode);

  // Handle dropdown changes
  menu.addEventListener('change', () => {
    switch (menu.value) {
      case 'bars': currentMode = Bars; break;
      case 'wave': currentMode = Wave; break;
      case 'circle': currentMode = Circle; break;
      default: currentMode = Bars; break;
    }
    Controller.setTarget(currentMode);
  });

  // Start animation loop that draws using controller settings
  loop();
});

// Continuous animation loop
function loop() {
  requestAnimationFrame(loop);
  if (!ctx || !analyser || !dataArray) return;

  // get frequency data from benchmark analyser
  analyser.getByteFrequencyData(dataArray);

  // clear overlay fade
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // draw active mode
  currentMode.draw(ctx, dataArray, Controller.settings);
}
