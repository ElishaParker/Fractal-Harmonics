let hueSlider, satSlider, brightSlider, scaleSlider, colorPicker;

export function initController() {
  const panel = document.createElement("div");
  panel.id = "controllerPanel";
  panel.innerHTML = `
    <h3>🎛️ Visual Controller</h3>
    <label>Hue</label>
    <input type="range" id="hueSlider" min="0" max="360" value="0">
    <label>Saturation</label>
    <input type="range" id="satSlider" min="0" max="100" value="100">
    <label>Brightness</label>
    <input type="range" id="brightSlider" min="0" max="100" value="50">
    <label>Scale</label>
    <input type="range" id="scaleSlider" min="0.1" max="3" step="0.1" value="1">
    <label>Color</label>
    <input type="color" id="colorPicker" value="#00ff00">
  `;
  document.body.appendChild(panel);

  hueSlider = document.getElementById("hueSlider");
  satSlider = document.getElementById("satSlider");
  brightSlider = document.getElementById("brightSlider");
  scaleSlider = document.getElementById("scaleSlider");
  colorPicker = document.getElementById("colorPicker");
}

export function getControllerValues() {
  return {
    hue: parseInt(hueSlider?.value || 0),
    saturation: parseInt(satSlider?.value || 100),
    brightness: parseInt(brightSlider?.value || 50),
    scale: parseFloat(scaleSlider?.value || 1),
    color: colorPicker?.value || "#00ff00"
  };
}
