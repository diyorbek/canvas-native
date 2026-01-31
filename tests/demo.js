/**
 * @import { RenderingContext2D } from '../src/context2d.ts';
 */

/**
 * Clears the canvas and resets any transformations.
 * Draws a light border for context.
 *
 * @param {RenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 */
function clearCanvas(ctx, W, H) {
  // Reset any transformations (like translate, rotate)
  // ctx.setTransform(1, 0, 0, 1, 0, 0);
  // Clear the entire canvas
  ctx.clearRect(0, 0, W, H);
  // Draw a simple border to show the canvas boundary
  // ctx.strokeStyle = "#cbd";
  // ctx.lineWidth = 1;
  // ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
}

// --- Drawing Functions (Tests) ---

// Test 1: fillRect, strokeRect, clearRect
/**
 *
 * @param {RenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 */
export function drawRects(ctx, W, H) {
  clearCanvas(ctx, W, H);
  ctx.fillStyle = "#f00";
  ctx.fillRect(50, 50, 150, 100);

  ctx.strokeStyle = "#00f";
  ctx.lineWidth = 5;
  ctx.strokeRect(250, 50, 150, 100);

  // clearRect punches a hole
  ctx.clearRect(80, 80, 90, 40);
}

// Test 2: beginPath, moveTo, lineTo, closePath, stroke, fill
/**
 *
 * @param {RenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 */
export function drawPaths(ctx, W, H) {
  clearCanvas(ctx, W, H);
  ctx.beginPath();
  ctx.moveTo(50, 300); // Start point
  ctx.lineTo(150, 350);
  ctx.lineTo(250, 300);
  ctx.closePath(); // Connects back to start (50, 300)

  // ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
  ctx.fillStyle = "#0f0";
  ctx.fill();

  // ctx.strokeStyle = "darkgreen";
  ctx.strokeStyle = "#500";
  ctx.lineWidth = 3;
  ctx.stroke();
}

// Test 3: arc, arcTo
/**
 *
 * @param {RenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 */
export function drawArcs(ctx, W, H) {
  clearCanvas(ctx, W, H);
  // Full circle
  ctx.beginPath();
  // arc(x, y, radius, startAngle, endAngle, counterClockwise)
  ctx.arc(300, 300, 70, 0, Math.PI * 2);
  ctx.fillStyle = "#ff0";
  ctx.fill();

  // Half circle (pac-man)
  ctx.beginPath();
  ctx.moveTo(400, 300); // Move to center
  ctx.arc(400, 300, 70, 0.25 * Math.PI, 1.75 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "#ff0";
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Just an arc line
  ctx.beginPath();
  ctx.arc(600, 300, 70, 0, Math.PI, true); // counter-clockwise
  ctx.strokeStyle = "#f0f";
  ctx.lineWidth = 5;
  ctx.stroke();
}

// Test 4: quadraticCurveTo, bezierCurveTo
/**
 *
 * @param {RenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 */
export function drawCurves(ctx, W, H) {
  clearCanvas(ctx, W, H);
  // Quadratic curve (1 control point)
  ctx.beginPath();
  ctx.moveTo(50, 200);
  // quadraticCurveTo(cp1x, cp1y, x, y)
  ctx.quadraticCurveTo(150, 50, 250, 200);
  ctx.strokeStyle = "#f00";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Bezier curve (2 control points)
  ctx.beginPath();
  ctx.moveTo(350, 200);
  // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
  ctx.bezierCurveTo(400, 50, 500, 350, 550, 200);
  ctx.strokeStyle = "#00f";
  ctx.lineWidth = 4;
  ctx.stroke();
}

// Test 5: fillText, strokeText, font, textAlign, textBaseline
/**
 *
 * @param {RenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 */
export function drawText(ctx, W, H) {
  clearCanvas(ctx, W, H);
  ctx.font = "48px Arial";
  ctx.fillStyle = "#0ff";
  ctx.fillText("Hello Canvas!", 50, 100);

  // ctx.font = '30px "Times New Roman"';
  // ctx.strokeStyle = "#aaf";
  // ctx.textAlign = "center";
  // ctx.textBaseline = "middle";
  // ctx.strokeText("Centered & Stroked", W / 2, H / 2);
}

// Test 6: lineWidth, lineCap, lineJoin
/**
 *
 * @param {RenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 */
export function drawStyles(ctx, W, H) {
  clearCanvas(ctx, W, H);
  ctx.lineWidth = 20;

  // lineCap
  ctx.beginPath();
  ctx.lineCap = "butt"; // Default
  ctx.moveTo(500, 50);
  ctx.lineTo(700, 50);
  ctx.strokeStyle = "#f00";
  ctx.stroke();

  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.moveTo(500, 100);
  ctx.lineTo(700, 100);
  ctx.strokeStyle = "#0f0";
  ctx.stroke();

  ctx.beginPath();
  ctx.lineCap = "square";
  ctx.moveTo(500, 150);
  ctx.lineTo(700, 150);
  ctx.strokeStyle = "#00f";
  ctx.stroke();

  // lineJoin
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.lineJoin = "miter"; // Default
  ctx.moveTo(500, 300);
  ctx.lineTo(550, 250);
  ctx.lineTo(600, 300);
  ctx.strokeStyle = "#0ef";
  ctx.stroke();

  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.moveTo(550, 300);
  ctx.lineTo(600, 250);
  ctx.lineTo(650, 300);
  ctx.strokeStyle = "#f00";
  ctx.stroke();
}

// Test 7: translate, rotate, scale, save, restore
/**
 *
 * @param {RenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 */
export function drawTransforms(ctx, W, H) {
  clearCanvas(ctx, W, H);

  // --- Save/Restore/Translate/Rotate ---
  ctx.save(); // Save the clean state (origin 0,0)

  // Move origin to the center of the canvas
  ctx.translate(W / 2, H / 2);
  // Rotate the entire context
  ctx.rotate((Math.PI / 180) * 20); // 20 degrees

  // Draw rect centered on new, rotated origin
  ctx.fillStyle = "#aaa";
  ctx.fillRect(-50, -50, 100, 100);

  ctx.restore(); // Restore to the saved clean state

  // This rect is not rotated or translated
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 50, 50);

  // --- Scale ---
  ctx.save();
  ctx.scale(2, 0.5); // 2x width, 0.5x height
  ctx.fillStyle = "#aaf";
  // This rect will be drawn at (100, 400) but will
  // appear 200 wide and 50 tall.
  ctx.fillRect(50, 400, 100, 100);
  ctx.restore();
}

// Test 8: drawImage
/**
 *
 * @param {RenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 */
export function drawImages(ctx, W, H, img) {
  clearCanvas(ctx, W, H);

  // Simple draw
  // ctx.drawImage(img, 0, 0);
  // ctx.drawImage(img, 50, 50, 200, 400);

  // Scaled draw
  ctx.drawImage(img, 300, 50, 100, 75); // 100x75

  // Sliced and scaled draw
  // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  // Draw the top-left 100x75 part of the image
  // at 150, 300, but scaled to 200x150
  // ctx.drawImage(img, 0, 0, 100, 75, 150, 300, 200, 150);
}

// Test 9: globalAlpha, globalCompositeOperation
/**
 *
 * @param {RenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 */
export function drawAlpha(ctx, W, H) {
  clearCanvas(ctx, W, H);
  // globalAlpha
  ctx.fillStyle = "#FD0"; // Yellow
  ctx.fillRect(100, 100, 100, 100);

  ctx.globalAlpha = 0.5; // Set 50% transparency

  ctx.fillStyle = "#09F"; // Blue
  ctx.fillRect(150, 150, 100, 100);

  ctx.globalAlpha = 1.0; // Reset alpha

  // globalCompositeOperation
  // 'destination-over' draws new shapes *behind* existing ones
  // ctx.globalCompositeOperation = "destination-over";
  // ctx.fillStyle = "#0f0";
  // ctx.fillRect(120, 120, 100, 100);

  // Reset composite operation to default
  ctx.globalCompositeOperation = "source-over";
}

/**
 *
 * @param {RenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 */
export function drawHouseDemo(ctx, W, H) {
  // Set line width
  ctx.lineWidth = 10;

  ctx.strokeStyle = "#000";

  // Wall
  ctx.strokeRect(475, 240, 150, 110);

  // Door
  ctx.fillRect(530, 290, 40, 60);

  // // Roof
  ctx.beginPath();
  ctx.moveTo(450, 240);
  ctx.lineTo(550, 160);
  ctx.lineTo(650, 240);
  ctx.closePath();
  ctx.stroke();
}
