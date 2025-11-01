const overlay = document.createElement('div');
overlay.id = 'controllerOverlay';
overlay.innerHTML = `
  <h3>🎛 Visual Control</h3>
  <div class="sliderGroup">
    <label>Hue</label><input type="range" min="0" max="360" value="0" id="ctrl-hue">
  </div>
  <div class="sliderGroup">
    <label>Saturation</label><input type="range" min="0" max="100" value="100" id="ctrl-sat">
  </div>
  <div class="sliderGroup">
    <label>Brightness</label><input type="range" min="0" max="100" value="100" id="ctrl-bright">
  </div>
  <div class="sliderGroup">
    <label>Scale</label><input type="range" min="0.1" max="3" step="0.1" value="1" id="ctrl-scale">
  </div>
  <div class="sliderGroup">
    <label>Base Color</label><input type="color" id="ctrl-color" value="#00ff00">
  </div>
`;
document.body.appendChild(overlay);

['hue','sat','bright','scale','color'].forEach(id=>{
  document.getElementById(`ctrl-${id}`).addEventListener('input',e=>{
    Controller.updateSetting(id,e.target.value);
  });
});
