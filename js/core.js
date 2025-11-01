import { drawBars } from "./modes/bars.js";
import { drawWave } from "./modes/wave.js";
import { drawCircle } from "./modes/circle.js";
import { initController, getControllerValues } from "./controller.js";

const btn = document.getElementById("startBtn");
const menu = document.getElementById("modeMenu");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let audioCtx, analyser, dataArray, mode = "bars";

menu.onchange = () => (mode = menu.value);

btn.onclick = async () => {
  try {
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

    btn.style.display = "none";
    menu.classList.add("visible");

    initController(); // initializes overlay controls
    resize();
    window.onresize = resize;
    draw();
  } catch (e) {
    alert("🎤 Microphone permission denied or unavailable.");
    console.error("Audio Error:", e);
  }
};

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function draw() {
  requestAnimationFrame(draw);
  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const { hue, saturation, brightness, scale } = getControllerValues();

  switch (mode) {
    case "bars":
      drawBars(ctx, dataArray, canvas, hue, saturation, brightness, scale);
      break;
    case "wave":
      drawWave(ctx, dataArray, canvas, hue, saturation, brightness, scale);
      break;
    case "circle":
      drawCircle(ctx, dataArray, canvas, hue, saturation, brightness, scale);
      break;
  }
}
