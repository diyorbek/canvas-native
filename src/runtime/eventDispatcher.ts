// Module-level listener registry for canvas input events.
// Runs on the JS worker thread — no cross-thread concerns.

import type {
  CanvasEvent,
  CanvasEventMap,
  CanvasEventType,
} from '../api/types.ts';

type AnyListener = (e: CanvasEvent) => void;
const registry = new Map<CanvasEventType, AnyListener[]>();

export function addCanvasEventListener<K extends CanvasEventType>(
  type: K,
  listener: (e: CanvasEventMap[K]) => void,
): void {
  let arr = registry.get(type);
  if (!arr) {
    arr = [];
    registry.set(type, arr);
  }
  arr.push(listener as AnyListener);
}

export function removeCanvasEventListener<K extends CanvasEventType>(
  type: K,
  listener: (e: CanvasEventMap[K]) => void,
): void {
  const arr = registry.get(type);
  if (!arr) return;
  const idx = arr.indexOf(listener as AnyListener);
  if (idx !== -1) arr.splice(idx, 1);
}

export function dispatchCanvasEvent(event: CanvasEvent): void {
  const arr = registry.get(event.type);
  if (!arr || arr.length === 0) return;
  // Snapshot to avoid issues if a listener modifies the array
  for (const fn of arr.slice()) fn(event);
}
