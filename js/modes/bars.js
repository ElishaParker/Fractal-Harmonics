export function drawBars(ctx, dataArray, canvas, hue, saturation, brightness, scale) {
  const barW = (canvas.width / dataArray.length) * 1.5;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const h = dataArray[i] * scale;
    const color = `hsl(${(i / dataArray.length) * 360 + hue}, ${saturation}%, ${brightness}%)`;
    ctx.fillStyle = color;
    ctx.fillRect(x, canvas.height - h, barW, h);
    x += barW + 1;
  }
}
