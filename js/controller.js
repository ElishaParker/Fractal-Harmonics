export const Controller = {
  settings: {
    hue: 0,
    saturation: 100,
    brightness: 100,
    scale: 1.0
  },
  target: null,
  init() {
    const overlay = document.createElement('div');
    overlay.id = 'controllerOverlay';
    overlay.innerHTML = `
      <h3>🎛 Visual Controller</h3>
      <div class="sliderGroup"><label>Hue</label>
      <input type="range" min="0" max="360" value="0" id="ctrl-hue"></div>
      <div class="sliderGroup"><label>Saturation</label>
      <input type="range" min="0" max="100" value="100" id="ctrl-sat"></div>
      <div class="sliderGroup"><label>Brightness</label>
      <input type="range" min="0" max="100" value="100" id="ctrl-bright"></div>
      <div class="sliderGroup"><label>Scale</label>
      <input type="range" min="0.1" max="3" step="0.1" value="1" id="ctrl-scale"></div>
      <div class="sliderGroup"><label>Color</label>
      <input type="color" value="#00ff00" id="ctrl-color"></div>
    `;
    document.body.appendChild(overlay);

    // link sliders
    ['hue','sat','bright','scale','color'].forEach(id=>{
      document.getElementById(`ctrl-${id}`).addEventListener('input',e=>{
        this.updateSetting(id,e.target.value);
      });
    });
  },
  updateSetting(name,val){
    this.settings[name]=val;
    if(this.target && typeof this.target.updateSetting==='function'){
      this.target.updateSetting(name,val);
    }
  },
  setTarget(modeObj){
    this.target = modeObj;
  }
};
