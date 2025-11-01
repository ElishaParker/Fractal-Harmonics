export function draw(ctx, dataArray, settings) {
  const barW=(ctx.canvas.width/dataArray.length)*1.5;
  let x=0;
  for(let i=0;i<dataArray.length;i++){
    const h=dataArray[i]*settings.scale;
    const hue=((i/dataArray.length)*360+parseFloat(settings.hue))%360;
    ctx.fillStyle=`hsl(${hue},${settings.saturation}%,${settings.brightness}%)`;
    ctx.fillRect(x,ctx.canvas.height-h,barW,h);
    x+=barW+1;
  }
}
export function updateSetting(){} // placeholder
// bars visual effect placeholder
