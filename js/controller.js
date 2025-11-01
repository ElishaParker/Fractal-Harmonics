window.Controller = {
  target: null, // currently active mode
  settings: {
    hue: 0,
    saturation: 100,
    brightness: 100,
    sensitivity: 1.0,
    rotation: 0.01,
    scale: 1.0
  },
  setTarget(modeObj){
    this.target = modeObj;
  },
  updateSetting(name,value){
    this.settings[name] = value;
    if(this.target && typeof this.target.updateSetting === 'function'){
      this.target.updateSetting(name,value);
    }
  }
};
