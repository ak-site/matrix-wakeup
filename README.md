![Picture Description](images/demo.svg)

# Matrix Wakeup Library

**[Demo](https://ak-site.github.io/matrix-wakeup/)**

A library for creating interactive animation in the style of the cult film **"The Matrix"** with a text assembly effect.

- **Matrix Rain** - realistic animation of falling symbols
- **Dynamic Assembly** - smooth appearance of a phrase from random characters
- **Responsive Design** - full support for all devices (mobile → 4K)
- **High Performance** - optimized code with FPS limiting
- **Full Customization** - adjustable colors, symbols, speed
- **Flexible API** - control animation through simple methods
- **Zero Dependencies** - pure JavaScript only

## Installation

### Via npm
```bash
npm install matrix-wakeup
```

### Or simply download the file
matrix-wakeup.min.js

### CDN
https://cdn.jsdelivr.net/gh/ak-site/matrix-wakeup/matrix-wakeup.min.js

## Quick Start

### Basic launch:
```javascript
const matrix = new MatrixWakeup();
matrix.init();
```

### With custom phrase:
```javascript
const matrix = new MatrixWakeup({
    assembly: {
        targetPhrase: "THE MATRIX HAS YOU"
    }
});
matrix.init();
```

## API

- `init()` — Initialize the library
- `setPhrase(phrase)` — Change the displayed phrase
- `start()` — Start animation
- `stop()` — Stop animation
- `destroy()` — Complete destruction
- `enableMatrix()` — Enable matrix rain
- `disableMatrix()` — Disable matrix rain
- `enableAssembly()` — Enable phrase assembly
- `disableAssembly()` — Disable phrase assembly

## License

MIT License

Copyright (c) 2026 Andrey Kalinin

This license allows you to freely use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this software, provided that the copyright notice is retained.

Mandatory condition: When using this library, you must retain the author's information in the source code.
