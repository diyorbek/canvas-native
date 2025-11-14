import { createWindow, IRenderingContext2D } from "./canvas-native.ts";

createWindow(800, 500, "Canvas Native Demo", (ctx: IRenderingContext2D) => {
  // Set line width
  ctx.lineWidth = 5;

  ctx.strokeStyle = "#000";

  // Wall
  ctx.strokeRect(75, 140, 150, 110);

  // Door
  ctx.fillRect(130, 190, 40, 60);

  // // Roof
  ctx.beginPath();
  ctx.moveTo(50, 140);
  ctx.lineTo(150, 60);
  ctx.lineTo(250, 140);
  ctx.closePath();
  ctx.stroke();
});
