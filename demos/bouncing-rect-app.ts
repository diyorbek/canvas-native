import { createWindow } from '../canvas-native.ts';

const width = 600;
const height = 400;

const { mainLoop } = await createWindow(
  width,
  height,
  'Canvas Native Demo',
  './bouncing-rect-worker.ts',
);

mainLoop();
