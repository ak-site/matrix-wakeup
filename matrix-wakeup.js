/*!
 * Matrix Wakeup Library v1.0.0
 * @license MIT
 * @author Andrey Kalinin
 * @repo https://github.com/ak-site/matrix-wakeup
 */

(function (global) {
  "use strict";

  // ============================================================
  // DEFAULT CONFIGURATION
  // ============================================================

  const DEFAULT_CONFIG = {
    matrix: {
      enabled: true,
      targetFps: 30,
      symbolSet: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "@",
        "#",
        "$",
        "%",
        "&",
        "*",
        "+",
        "=",
        "<",
        ">",
        "?",
        "!",
        ":",
        "ア",
        "イ",
        "ウ",
        "エ",
        "オ",
        "α",
        "β",
        "γ",
        "δ",
        "→",
        "←",
        "↑",
      ],
      colors: {
        primary: "#1e70c0",
        secondary: "#2e9eff",
        accent: "#3effdc",
        white: "#ffffff",
      },
      backgroundColor: "#050508",
      fadeAlpha: 0.1,
    },
    assembly: {
      enabled: true,
      targetPhrase: "WAKE UP, NEO",
      symbolSet: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "@",
        "#",
        "$",
        "%",
        "&",
        "*",
        "+",
        "=",
        "<",
        ">",
        "?",
        "!",
        ":",
        "ア",
        "イ",
        "ウ",
        "エ",
        "オ",
        "α",
        "β",
        "γ",
        "δ",
        "→",
        "←",
        "↑",
      ],
      colors: {
        primary: "#1e70c0",
        secondary: "#2e9eff",
        accent: "#3effdc",
        white: "#ffffff",
      },
      cycleDurations: {
        collecting: 1800,
        showing: 2500,
        dissipating: 1500,
      },
      fonts: ["'Fira Code'", "'Courier New'", "monospace"],
    },
    global: {
      debug: false,
      autoStart: true,
    },
  };

  // ============================================================
  // UTILITIES
  // ============================================================

  class MatrixUtils {
    constructor() {
      this.seed = Date.now() % 2147483647;
    }

    fastRandom() {
      this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
      return this.seed / 0x7fffffff;
    }

    static deepMerge(target, source) {
      const result = { ...target };
      for (const key in source) {
        if (
          source[key] &&
          typeof source[key] === "object" &&
          !Array.isArray(source[key])
        ) {
          result[key] = this.deepMerge(target[key] || {}, source[key]);
        } else if (source[key] !== undefined) {
          result[key] = source[key];
        }
      }
      return result;
    }

    static getBreakpoint(width) {
      if (width >= 1400) return "ultrawide";
      if (width >= 1200) return "large";
      if (width >= 992) return "desktop";
      if (width >= 768) return "tablet";
      if (width >= 576) return "mobile-large";
      return "mobile";
    }

    static getFontSizeByBreakpoint(width, type = "matrix") {
      const breakpoint = this.getBreakpoint(width);

      const settings = {
        matrix: {
          mobile: { size: Math.max(20, Math.floor(width / 25)), max: 35 },
          "mobile-large": {
            size: Math.max(22, Math.floor(width / 28)),
            max: 38,
          },
          tablet: { size: Math.max(18, Math.floor(width / 40)), max: 42 },
          desktop: { size: Math.max(16, Math.floor(width / 60)), max: 48 },
          large: { size: Math.max(16, Math.floor(width / 70)), max: 52 },
          ultrawide: { size: Math.max(18, Math.floor(width / 80)), max: 60 },
        },
        assembly: {
          mobile: {
            size: Math.max(24, Math.floor(width / 12)),
            max: 38,
            offset: -25,
          },
          "mobile-large": {
            size: Math.max(26, Math.floor(width / 13)),
            max: 42,
            offset: -25,
          },
          tablet: {
            size: Math.max(28, Math.floor(width / 14)),
            max: 48,
            offset: -20,
          },
          desktop: {
            size: Math.max(32, Math.floor(width / 15)),
            max: 56,
            offset: 0,
          },
          large: {
            size: Math.max(36, Math.floor(width / 16)),
            max: 64,
            offset: 0,
          },
          ultrawide: {
            size: Math.max(40, Math.floor(width / 18)),
            max: 80,
            offset: 0,
          },
        },
      };

      const config = settings[type][breakpoint];
      let size = config.size;

      // Ограничиваем максимальный размер
      if (size > config.max) size = config.max;

      // Минимальный размер
      if (type === "matrix" && size < 16) size = 16;
      if (type === "assembly" && size < 20) size = 20;

      return {
        size: size,
        offset: config.offset || 0,
      };
    }

    static getShadowBlurByBreakpoint(width) {
      const breakpoint = this.getBreakpoint(width);

      const shadows = {
        mobile: { light: 2, medium: 4, heavy: 8 },
        "mobile-large": { light: 2, medium: 5, heavy: 9 },
        tablet: { light: 3, medium: 6, heavy: 10 },
        desktop: { light: 3, medium: 8, heavy: 12 },
        large: { light: 4, medium: 10, heavy: 14 },
        ultrawide: { light: 5, medium: 12, heavy: 16 },
      };

      return shadows[breakpoint];
    }
  }

  // ============================================================
  // MATRIX RAIN
  // ============================================================

  class MatrixRain {
    constructor(canvas, config, rng) {
      this.canvas = canvas;
      this.config = config;
      this.rng = rng;
      this.ctx = canvas.getContext("2d");
      this.isRunning = false;
      this.animationId = null;
      this.lastTimestamp = 0;
      this.isTabVisible = true;

      this.fontSize = 20;
      this.columns = 0;
      this.drops = [];
      this.speeds = [];

      this.colorRandomCache = 0;
      this.colorRandomCounter = 0;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener("resize", () => this.resize());
      document.addEventListener("visibilitychange", () => {
        this.isTabVisible = !document.hidden;
      });
    }

    resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === 0 || h === 0) return;

      this.canvas.width = w;
      this.canvas.height = h;

      const fontSizeConfig = MatrixUtils.getFontSizeByBreakpoint(w, "matrix");
      this.fontSize = fontSizeConfig.size;

      this.columns = Math.max(8, Math.floor(this.canvas.width / this.fontSize));

      if (this.drops.length !== this.columns) {
        this.drops = new Array(this.columns);
        this.speeds = new Array(this.columns);
      }

      for (let i = 0; i < this.columns; i++) {
        this.drops[i] =
          -this.rng.fastRandom() * (this.canvas.height / this.fontSize) - 5;
        const breakpoint = MatrixUtils.getBreakpoint(w);
        const speedMultiplier =
          breakpoint === "mobile" || breakpoint === "mobile-large" ? 1.3 : 1.0;
        this.speeds[i] = (1.0 + this.rng.fastRandom() * 0.05) * speedMultiplier;
      }

      this.ctx.fillStyle = this.config.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getRandomSymbol() {
      const { symbolSet } = this.config;
      return symbolSet[Math.floor(this.rng.fastRandom() * symbolSet.length)];
    }

    getSymbolColor(isSpecial = false) {
      const colors = this.config.colors;
      if (isSpecial) return colors.white;

      if (this.colorRandomCounter++ >= 10) {
        this.colorRandomCounter = 0;
        this.colorRandomCache = this.rng.fastRandom();
      }

      const rand =
        this.colorRandomCounter === 0
          ? this.colorRandomCache
          : this.rng.fastRandom();

      if (rand < 0.1) return colors.accent;
      if (rand < 0.3) return colors.secondary;
      return colors.primary;
    }

    draw(currentTime) {
      if (!this.isRunning) return;

      if (!this.isTabVisible) {
        this.animationId = requestAnimationFrame((t) => this.draw(t));
        return;
      }

      const frameInterval = 1000 / this.config.targetFps;
      if (currentTime - this.lastTimestamp < frameInterval) {
        this.animationId = requestAnimationFrame((t) => this.draw(t));
        return;
      }
      this.lastTimestamp = currentTime;

      try {
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.config.fadeAlpha})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = `${this.fontSize}px monospace`;
        this.ctx.textBaseline = "top";
        this.ctx.shadowBlur = 0;

        const stepX = this.canvas.width / this.columns;
        const maxHeight = this.canvas.height;
        const fontSizeVal = this.fontSize;

        for (let col = 0; col < this.columns; col++) {
          let yPos = this.drops[col] * fontSizeVal;

          if (yPos > maxHeight + fontSizeVal * 2) {
            this.drops[col] = Math.floor(this.rng.fastRandom() * -12) - 4;
            yPos = this.drops[col] * fontSizeVal;
          }

          const symbol = this.getRandomSymbol();
          const color = this.getSymbolColor(false);

          this.ctx.fillStyle = color;
          const xPos = Math.floor(col * stepX);
          this.ctx.fillText(symbol, xPos, yPos);

          let step = this.speeds[col];
          const maxSpeed =
            MatrixUtils.getBreakpoint(window.innerWidth) === "mobile"
              ? 2.2
              : 1.8;
          if (step > maxSpeed) step = maxSpeed;
          this.drops[col] += step;

          if (this.drops[col] * fontSizeVal > maxHeight + fontSizeVal * 3) {
            this.drops[col] = -5;
          }
        }
      } catch (e) {
        console.error("Draw error:", e);
      }

      this.animationId = requestAnimationFrame((t) => this.draw(t));
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.lastTimestamp = performance.now();
      this.animationId = requestAnimationFrame((t) => this.draw(t));
    }

    stop() {
      this.isRunning = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }

    destroy() {
      this.stop();
      window.removeEventListener("resize", () => this.resize());
    }
  }

  // ============================================================
  // ASSEMBLY ANIMATION
  // ============================================================

  class AssemblyAnimation {
    constructor(canvas, config, rng) {
      this.canvas = canvas;
      this.config = config;
      this.rng = rng;
      this.ctx = canvas.getContext("2d");
      this.isRunning = false;
      this.animationId = null;

      this.targetPhrase = config.targetPhrase;
      this.targetChars = config.targetPhrase.split("");
      this.symbolPositions = [];
      this.collectedSymbols = [];

      this.state = "idle";
      this.currentCollectProgress = 0;
      this.collectStartTime = 0;
      this.dissipateStartTime = 0;
      this.timers = new Set();
      this.lastRandomUpdate = 0;
      this.assemblyFontSize = 0;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener("resize", () => this.resize());
    }

    safeSetTimeout(fn, delay) {
      const id = setTimeout(() => {
        this.timers.delete(id);
        fn();
      }, delay);
      this.timers.add(id);
      return id;
    }

    clearAllTimeouts() {
      for (const id of this.timers) clearTimeout(id);
      this.timers.clear();
    }

    getRandomSymbol() {
      const { symbolSet } = this.config;
      return symbolSet[Math.floor(this.rng.fastRandom() * symbolSet.length)];
    }

    resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === 0 || h === 0) return;

      this.canvas.width = w;
      this.canvas.height = h;

      const fontSizeConfig = MatrixUtils.getFontSizeByBreakpoint(w, "assembly");
      this.assemblyFontSize = fontSizeConfig.size;

      const verticalOffset = fontSizeConfig.offset;

      const availableWidth = w - (w < 768 ? 20 : 40);
      let fontSize = this.assemblyFontSize;
      const totalWidth = this.targetChars.length * fontSize;

      if (totalWidth > availableWidth) {
        fontSize = Math.max(
          14,
          Math.floor(availableWidth / this.targetChars.length),
        );
        this.assemblyFontSize = fontSize;
      }

      const totalWidthFinal = this.targetChars.length * this.assemblyFontSize;
      const startX = (this.canvas.width - totalWidthFinal) / 2;
      const centerY = this.canvas.height / 2;

      this.symbolPositions = this.targetChars.map((_, i) => ({
        x: startX + i * this.assemblyFontSize,
        y: centerY + verticalOffset,
      }));
    }

    startCollectingCycle() {
      if (!this.isRunning) return;

      this.clearAllTimeouts();
      this.state = "collecting";
      this.currentCollectProgress = 0;
      this.collectStartTime = performance.now();
      this.collectedSymbols = new Array(this.targetChars.length).fill("");

      this.timerId = this.safeSetTimeout(() => {
        this.finishCollecting();
      }, this.config.cycleDurations.collecting);
    }

    finishCollecting() {
      if (this.state !== "collecting" || !this.isRunning) return;

      this.state = "showing";
      this.collectedSymbols = [...this.targetChars];

      this.timerId = this.safeSetTimeout(() => {
        this.startDissipating();
      }, this.config.cycleDurations.showing);
    }

    startDissipating() {
      if (this.state !== "showing" || !this.isRunning) return;

      this.state = "dissipating";
      this.dissipateStartTime = performance.now();

      this.timerId = this.safeSetTimeout(() => {
        this.finishDissipating();
      }, this.config.cycleDurations.dissipating);
    }

    finishDissipating() {
      if (this.state !== "dissipating" || !this.isRunning) return;

      this.state = "idle";
      this.collectedSymbols = new Array(this.targetChars.length).fill("");
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.timerId = this.safeSetTimeout(() => {
        if (this.isRunning) {
          this.startCollectingCycle();
        }
      }, 2000);
    }

    updateProgress(now) {
      if (this.state === "collecting") {
        const elapsed = now - this.collectStartTime;
        this.currentCollectProgress = Math.min(
          1,
          elapsed / this.config.cycleDurations.collecting,
        );
        const collectedCount = Math.floor(
          this.currentCollectProgress * this.targetChars.length,
        );
        const shouldRandomUpdate = now - this.lastRandomUpdate > 50;
        if (shouldRandomUpdate) this.lastRandomUpdate = now;

        for (let i = 0; i < this.targetChars.length; i++) {
          if (i < collectedCount) {
            this.collectedSymbols[i] = this.targetChars[i];
          } else if (shouldRandomUpdate && this.rng.fastRandom() < 0.25) {
            this.collectedSymbols[i] = this.getRandomSymbol();
          } else if (!shouldRandomUpdate && this.collectedSymbols[i] !== "") {
            // Оставляем
          } else {
            this.collectedSymbols[i] = "";
          }
        }
      } else if (this.state === "dissipating") {
        const elapsed = now - this.dissipateStartTime;
        const dissipateProgress = Math.min(
          1,
          elapsed / this.config.cycleDurations.dissipating,
        );
        const replacedCount = Math.floor(
          dissipateProgress * this.targetChars.length,
        );

        for (let i = 0; i < this.targetChars.length; i++) {
          if (i < replacedCount) {
            this.collectedSymbols[i] =
              this.rng.fastRandom() < 0.3 ? this.getRandomSymbol() : "";
          } else {
            this.collectedSymbols[i] = this.targetChars[i];
          }
        }
      } else if (this.state === "showing") {
        for (let i = 0; i < this.targetChars.length; i++) {
          this.collectedSymbols[i] = this.targetChars[i];
        }
      } else if (this.state === "idle") {
        for (let i = 0; i < this.collectedSymbols.length; i++) {
          this.collectedSymbols[i] = "";
        }
      }
    }

    draw() {
      if (!this.isRunning) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.state === "idle") return;

      const fontSizeVal = this.assemblyFontSize;
      const positions = this.symbolPositions;
      const symbols = this.collectedSymbols;
      const colors = this.config.colors;
      const shadows = MatrixUtils.getShadowBlurByBreakpoint(window.innerWidth);

      for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        const symbol = symbols[i];

        if (symbol && symbol !== "") {
          let color, shadowBlur, shadowColor;

          const isCorrect =
            this.state === "showing" ||
            (this.state === "collecting" && symbols[i] === this.targetChars[i]);

          if (isCorrect && this.state === "showing") {
            color = colors.accent;
            shadowBlur = shadows.heavy;
            shadowColor = colors.accent;
          } else if (isCorrect) {
            const intensity = 0.8 + this.rng.fastRandom() * 0.2;
            color = `rgba(62, 255, 220, ${intensity})`;
            shadowBlur = shadows.medium;
            shadowColor = colors.accent;
          } else {
            const flicker = 0.5 + this.rng.fastRandom() * 0.5;
            color = `rgba(46, 158, 255, ${flicker})`;
            shadowBlur = shadows.light;
            shadowColor = colors.secondary;
          }

          this.ctx.font = `${fontSizeVal}px ${this.config.fonts.join(", ")}`;
          this.ctx.textBaseline = "middle";
          this.ctx.textAlign = "left";
          this.ctx.shadowBlur = shadowBlur;
          this.ctx.shadowColor = shadowColor;
          this.ctx.fillStyle = color;
          this.ctx.fillText(symbol, pos.x, pos.y);
        }
      }
      this.ctx.shadowBlur = 0;
    }

    animate(currentTime) {
      if (!this.isRunning) return;
      this.updateProgress(currentTime);
      this.draw();
      this.animationId = requestAnimationFrame((t) => this.animate(t));
    }

    setPhrase(phrase) {
      if (!phrase || typeof phrase !== "string") return;

      this.targetPhrase = phrase;
      this.targetChars = phrase.split("");
      this.resize();
      this.clearAllTimeouts();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.collectedSymbols = new Array(this.targetChars.length).fill("");
      this.state = "idle";

      if (this.isRunning) {
        setTimeout(() => this.startCollectingCycle(), 100);
      }
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.state = "idle";
      this.animationId = requestAnimationFrame((t) => this.animate(t));

      setTimeout(() => {
        if (this.isRunning) this.startCollectingCycle();
      }, 500);
    }

    stop() {
      this.isRunning = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.clearAllTimeouts();
    }

    destroy() {
      this.stop();
      window.removeEventListener("resize", () => this.resize());
    }
  }

  // ============================================================
  // MAIN CLASS
  // ============================================================

  class MatrixWakeup {
    constructor(config = {}) {
      this.config = MatrixUtils.deepMerge(DEFAULT_CONFIG, config);
      this.rng = new MatrixUtils();
      this.matrixRain = null;
      this.assemblyAnimation = null;
      this.isInitialized = false;

      if (this.config.global.autoStart) {
        this.init();
      }
    }

    init(container = document.body) {
      if (this.isInitialized) return this;

      this.matrixCanvas = this.createCanvas("matrix-canvas");
      this.assemblyCanvas = this.createCanvas("assembly-canvas");

      container.appendChild(this.matrixCanvas);
      container.appendChild(this.assemblyCanvas);

      if (this.config.matrix.enabled) {
        this.matrixRain = new MatrixRain(
          this.matrixCanvas,
          this.config.matrix,
          this.rng,
        );
        this.matrixRain.start();
      }

      if (this.config.assembly.enabled) {
        this.assemblyAnimation = new AssemblyAnimation(
          this.assemblyCanvas,
          this.config.assembly,
          this.rng,
        );
        this.assemblyAnimation.start();
      }

      this.isInitialized = true;
      return this;
    }

    createCanvas(className) {
      const canvas = document.createElement("canvas");
      canvas.className = className;
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = className === "assembly-canvas" ? "2" : "1";
      return canvas;
    }

    setPhrase(phrase) {
      if (this.assemblyAnimation) this.assemblyAnimation.setPhrase(phrase);
      return this;
    }

    start() {
      if (this.matrixRain) this.matrixRain.start();
      if (this.assemblyAnimation) this.assemblyAnimation.start();
      return this;
    }

    stop() {
      if (this.matrixRain) this.matrixRain.stop();
      if (this.assemblyAnimation) this.assemblyAnimation.stop();
      return this;
    }

    destroy() {
      if (this.matrixRain) this.matrixRain.destroy();
      if (this.assemblyAnimation) this.assemblyAnimation.destroy();
      if (this.matrixCanvas) this.matrixCanvas.remove();
      if (this.assemblyCanvas) this.assemblyCanvas.remove();
      this.isInitialized = false;
      return this;
    }
  }

  // ============================================================
  // EXPORT
  // ============================================================

  if (typeof module !== "undefined" && module.exports) {
    module.exports = MatrixWakeup;
  } else if (typeof define === "function" && define.amd) {
    define([], () => MatrixWakeup);
  } else {
    global.MatrixWakeup = MatrixWakeup;
  }
})(typeof window !== "undefined" ? window : this);
