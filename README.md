# Canvas Native

A 2D canvas rendering library for Deno that brings the HTML5 Canvas API to native applications. Powered by **NanoVG** for vector graphics and **Raylib** for window management and OpenGL integration.

- Familiar API - HTML5 Canvas
- FFI bindings to native C++ libraries
- Type-safe API with full TypeScript support

## Installation

### Prerequisites

- [Deno](https://deno.land) (latest version)
- CMake 3.24 or higher
- C++ compiler (g++, clang, or MSVC)

### Build the Native Library

```bash
# Clone the repository
git clone https://github.com/diyorbek/canvas-native
cd canvas-native

# Create and build using CMake
mkdir build && cd build
cmake ..
make

# The shared library will be created in the build/ directory
```

## Quick Start

### Basic Example

```typescript
import { createWindow } from "./canvas-native.ts";
import { RenderingContext2D } from "./src/context2d.ts";

createWindow(800, 600, "My App", (ctx: RenderingContext2D) => {
  // Clear canvas
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, 800, 600);

  // Draw a rectangle
  ctx.fillStyle = "#f00";
  ctx.fillRect(100, 100, 200, 150);

  // Draw a circle
  ctx.beginPath();
  ctx.arc(400, 300, 50, 0, Math.PI * 2);
  ctx.fillStyle = "#00f";
  ctx.fill();
});
```

### Run the Demo

```bash
deno run -A app.ts
```

This will open a window showcasing various drawing capabilities including rectangles, paths, arcs, curves, etc.

## Building from Source

### macOS/Linux

```bash
mkdir build
cd build
cmake ..
make
```

### Windows (MSVC)

```bash
mkdir build
cd build
cmake .. -G "Visual Studio 17 2022"
cmake --build . --config Release
```

## Limitations

- Currently implements a subset of the Canvas 2D API
- Some advanced features are not supported by NanoVG, and need custom implementation.
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
- [ ] Improve color string parsing
- [ ] Input handling (keyboard, mouse events)
- [ ] Animation frame scheduling (`requestAnimationFrame`)
- [ ] Cross-platform testing and optimization

## Acknowledgments

- Built with [NanoVG](https://github.com/memononen/nanovg) by Mikko Mononen
- Graphics powered by [Raylib](https://www.raylib.com/)
- Runtime provided by [Deno](https://deno.land)
