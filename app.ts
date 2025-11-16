import { createWindow } from "./canvas-native.ts";
import { RenderingContext2D } from "./src/context2d.ts";
import * as demos from "./tests/demo.js";

const width = 800;
const height = 500;

createWindow(width, height, "Canvas Native Demo", (ctx: RenderingContext2D) => {
  demos.drawHouseDemo(ctx, width, height);
  demos.drawRects(ctx, width, height);
  // demos.drawPaths(ctx, width, height);
  // demos.drawArcs(ctx, width, height);
  // demos.drawCurves(ctx, width, height);
  // demos.drawText(ctx, width, height);
  // demos.drawStyles(ctx, width, height);
  // demos.drawTransforms(ctx, width, height);
  // demos.drawImages(ctx, width, height);
  // demos.drawAlpha(ctx, width, height);
});
