import { createWindow } from "./canvas-native.ts";
import { RenderingContext2D } from "./src/context2d.ts";

const width = 800;
const height = 500;

createWindow(width, height, "Canvas Native Demo", (ctx: RenderingContext2D) => {
  // drawHouseDemo(ctx, width, height);
  // drawRects(ctx, width, height);
  ctx.fillStyle = "#f00";
  ctx.fillRect(50, 50, 150, 100);

  ctx.strokeStyle = "#00f";
  ctx.lineWidth = 5;
  ctx.strokeRect(250, 50, 150, 100);

  // clearRect punches a hole
  ctx.clearRect(80, 80, 90, 40);
  // drawPaths(ctx, width, height);
  // drawArcs(ctx, width, height);
  // drawCurves(ctx, width, height);
  // drawText(ctx, width, height);
  // drawStyles(ctx, width, height);
  // drawTransforms(ctx, width, height);
  // drawImages(ctx, width, height);
  // drawAlpha(ctx, width, height);
});
