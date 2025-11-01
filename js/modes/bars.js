export function drawBars(ctx, dataArray, canvas, hue, saturation, brightness, scale, color) {
  const barW = (canvas.width / dataArray.length) * 1.5;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const h = dataArray[i] * scale;
    // if user picked a solid color, use it — else use HSL cycle
    ctx.fillStyle = color || `hsl(${(i / dataArray.length) * 360 + hue}, ${saturation}%, ${brightness}%)`;
    ctx.fillRect(x, canvas.height - h, barW, h);
    x += barW + 1;
  }
}
