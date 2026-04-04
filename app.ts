import { createWindow } from './canvas-native.ts';

const width = 800;
const height = 500;

const { mainLoop } = await createWindow(width, height, 'Canvas Native Demo');

mainLoop();
