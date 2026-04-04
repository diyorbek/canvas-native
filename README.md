# Canvas Native

A 2D canvas rendering library for Deno that brings the HTML5 Canvas API to native applications. Powered by **NanoVG** for vector graphics, **SDL3** for window management, and **OpenGL** for rendering.

- Familiar API - HTML5 Canvas
- Multi-threaded architecture with command batching
- FFI bindings to native C++ library
- Type-safe API with full TypeScript support

## Installation

### Prerequisites

- [Deno](https://deno.land) (latest version)
- CMake 3.24 or higher
- C++ compiler with C++23 support (clang or g++)

### Build the Native Library

```bash
# Clone the repository
git clone https://github.com/diyorbek/canvas-native
cd canvas-native

# Create and build using CMake
mkdir build && cd build
cmake ..
make
```

## Quick Start

**app.ts**:

```typescript
import { createWindow } from './canvas-native.ts';

const { mainLoop } = await createWindow(800, 600, 'My App');
mainLoop();
```

**worker.ts**:

```typescript
import { requestAnimationFrame } from './src/frameLoop.ts';
import { RenderingContext2D } from './src/renderingContext2d.ts';

const ctx = new RenderingContext2D();

ctx.fillStyle = '#f00';
ctx.fillRect(100, 100, 200, 150);

ctx.beginPath();
ctx.arc(400, 300, 50, 0, Math.PI * 2);
ctx.fillStyle = '#00f';
ctx.fill();

function draw() {
  ctx.clearRect(0, 0, 800, 600);
  // drawing logic here
  requestAnimationFrame(draw);
}
draw();
```

### Run the Demo

```bash
deno run -A app.ts
```

## Building from Source

### macOS/Linux

```bash
mkdir build && cd build
cmake ..
make
```

### Windows (MSVC)

```bash
mkdir build && cd build
cmake .. -G "Visual Studio 17 2022"
cmake --build . --config Release
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
