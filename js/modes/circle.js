export function drawCircle(ctx, dataArray, canvas, hue, saturation, brightness, scale, color) {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = 150 * scale;

  for (let i = 0; i < dataArray.length; i++) {
    const a = (i / dataArray.length) * Math.PI * 2;
    const amp = (dataArray[i] / 255) * 150 * scale;
    const x1 = cx + Math.cos(a) * r;
    const y1 = cy + Math.sin(a) * r;
    const x2 = cx + Math.cos(a) * (r + amp);
    const y2 = cy + Math.sin(a) * (r + amp);

ctx.strokeStyle = (color && color !== "#000000")
  ? color
  : `hsl(${(i / dataArray.length) * 360 + hue}, ${saturation}%, ${brightness}%)`;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
