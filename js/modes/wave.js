export function drawWave(ctx, dataArray, canvas, hue, saturation, brightness, scale, color) {
  ctx.beginPath();
  ctx.lineWidth = 2 * scale;
  ctx.strokeStyle = color || `hsl(${hue}, ${saturation}%, ${brightness}%)`;
  const slice = canvas.width / dataArray.length;

  for (let i = 0; i < dataArray.length; i++) {
    const y = (dataArray[i] / 128) * (canvas.height / 2);
    i === 0 ? ctx.moveTo(0, y) : ctx.lineTo(i * slice, y);
  }
  ctx.stroke();
}
