export function draw(ctx,dataArray,settings){
  ctx.beginPath();
  ctx.lineWidth=2;
  ctx.strokeStyle=`hsl(${settings.hue},${settings.saturation}%,${settings.brightness}%)`;
  const slice=ctx.canvas.width/dataArray.length;
  for(let i=0;i<dataArray.length;i++){
    const y=(dataArray[i]/128)*ctx.canvas.height/2;
    i===0?ctx.moveTo(0,y):ctx.lineTo(i*slice,y);
  }
  ctx.stroke();
}
export function updateSetting(){}
// waveform visual effect placeholder
