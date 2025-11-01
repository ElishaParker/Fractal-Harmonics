export function draw(ctx,dataArray,settings){
  const cx=ctx.canvas.width/2,cy=ctx.canvas.height/2,r=150*settings.scale;
  for(let i=0;i<dataArray.length;i++){
    const a=(i/dataArray.length)*Math.PI*2;
    const amp=dataArray[i]/255*150*settings.scale;
    const x1=cx+Math.cos(a)*r,y1=cy+Math.sin(a)*r;
    const x2=cx+Math.cos(a)*(r+amp),y2=cy+Math.sin(a)*(r+amp);
    const hue=(i/dataArray.length*360+parseFloat(settings.hue))%360;
    ctx.strokeStyle=`hsl(${hue},${settings.saturation}%,${settings.brightness}%)`;
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  }
}
export function updateSetting(){}
// circular spectrum visual effect placeholder
