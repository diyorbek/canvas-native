# Canvas Native

A 2D canvas rendering library for Deno that brings the HTML5 Canvas API to native applications. Powered by **NanoVG** for vector graphics, **SDL3** for window management, and **OpenGL** for rendering.

- Familiar API - HTML5 Canvas
- Multi-threaded architecture with command batching
- FFI bindings to native C++ library
- Type-safe API with full TypeScript support

## Installation

Just import the library — the native binary is downloaded automatically on first run and cached locally.

```typescript
import {
  createCanvas,
  requestAnimationFrame,
} from 'jsr:@diyorbek/canvas-native';
```

Supported platforms: macOS (arm64), Linux (x64, arm64), Windows (x64, arm64).

### Native library resolution

`canvas-native` looks for the native library in this order:

1. `CANVAS_NATIVE_LIB` env var (absolute path to your own build)
2. `./build/libcanvasnative.{dylib,so,dll}` in the current working directory (local dev builds)
3. Cache directory — `~/Library/Caches/canvas-native/v<version>/` on macOS, `$XDG_CACHE_HOME/canvas-native/v<version>/` on Linux, `%LOCALAPPDATA%\canvas-native\v<version>\` on Windows
4. Downloaded from [GitHub Releases](https://github.com/diyorbek/canvas-native/releases) (with SHA-256 checksum verification) and cached

### Building from source (for development)

Prerequisites: Deno, CMake 3.24+, a C++23 compiler.

```bash
git clone https://github.com/diyorbek/canvas-native
cd canvas-native
cmake -B build && cmake --build build --target canvasnative
```

The build output at `./build/libcanvasnative.*` is picked up automatically.

## Quick Start

### Single-file API (recommended)

Everything lives in one script — the library handles the window, event loop, and worker setup internally.

```typescript
// demo.ts
import { createCanvas, requestAnimationFrame } from 'jsr:@diyorbek/canvas-native';

const { ctx, width, height } = await createCanvas(400, 300, 'Hello');

function draw(t: number) {
  ctx.clearRect(0, 0, width, height);

  const r = 50 + Math.sin(t / 300) * 30;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
  ctx.fillStyle = 'tomato';
  ctx.fill();

  ctx.fillStyle = 'black';
  ctx.font = '16px sans-serif';
  ctx.fillText('Hello, Canvas Native', 20, 30);

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
```

```bash
deno run -A demo.ts
```

> ⚠️ **Heads-up: your script runs twice.**
>
> Internally, `createCanvas()` re-launches your script as a Web Worker — the main thread runs the native window loop, and the worker runs your drawing code. That means **any code at the top level of your file executes on both threads**, once on each.
>
> In practice this is fine because `await createCanvas()` blocks the main thread forever, so user code _after_ that line only ever runs in the worker. Just follow this convention:
>
> ```typescript
> // ✅ Safe — only imports and createCanvas() before the await
> import {
>   createCanvas,
>   requestAnimationFrame,
> } from 'jsr:@diyorbek/canvas-native';
> const { ctx, width, height } = await createCanvas(800, 500, 'Demo');
>
> // All your setup and drawing code goes here.
> // It only runs in the worker.
> ```
>
> ```typescript
> // ⚠️ Runs twice — avoid
> import { createCanvas } from 'jsr:@diyorbek/canvas-native';
> console.log('starting up'); // prints twice
> await fetch('https://example.com'); // hits the network twice
> const { ctx } = await createCanvas(800, 500, 'Demo');
> ```
>
> If you need full control and want to guarantee single-execution of setup code, use the two-file API below.

### Two-file API (advanced)

Use this when you need finer control over the main/worker split, or want to guarantee that setup code only runs once.

**app.ts** — main thread (creates the window):

```typescript
import { createWindow } from 'jsr:@diyorbek/canvas-native/app';

const { mainLoop } = await createWindow(800, 500, 'My App', './worker.ts');
mainLoop();
```

**worker.ts** — drawing thread:

```typescript
import {
  initCanvas,
  requestAnimationFrame,
} from 'jsr:@diyorbek/canvas-native/worker';

const ctx = await initCanvas();
const W = 800;
const H = 500;

function draw(t: number) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#f00';
  ctx.fillRect(100, 100, 200, 150);
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
```

```bash
deno run -A app.ts
```

## Limitations

- Currently implements a subset of the Canvas 2D API
- Some advanced features are not supported by NanoVG and need custom implementation
- Platform-specific quirks may exist (primarily tested on macOS)

### Contributing

Contributions are welcome! Areas for enhancement:

- Additional Canvas 2D methods
- Performance optimizations
- Platform support improvements
- Documentation and examples
- Bug fixes and error handling

## Roadmap

- [ ] Complete Canvas 2D API coverage
- [x] Improve color string parsing
- [ ] Input handling (keyboard, mouse events)
- [x] Animation frame scheduling (`requestAnimationFrame`)
- [ ] Cross-platform testing and optimization

## Acknowledgments

- Built with [NanoVG](https://github.com/memononen/nanovg) by Mikko Mononen
- Window management by [SDL3](https://github.com/libsdl-org/SDL)
- Image loading by [stb_image](https://github.com/nothings/stb)
- Runtime provided by [Deno](https://deno.land)
