import { useEffect, useRef, type CSSProperties } from "react";
import {
  createWordArtStyle,
  type WordArtConfig,
  type WordArtPreset,
} from "../wordart";
import { shapeWordArtText, type ShapedGlyph } from "../wordart/harfbuzz";
import type { FontEntry } from "../types";

const fallbackArcFontSize = () =>
  Math.max(34, Math.min(window.innerWidth, window.innerHeight) * 0.09);
const maxStableArcRadians = Math.PI * 0.92;
const colorWithAlpha = (color: string, alpha: number) => {
  const hex = color.match(/^#([0-9a-f]{6})$/i)?.[1];
  if (!hex) return color;
  const value = Number.parseInt(hex, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
};

export default function WordArtRenderer({
  preset,
  text,
  fontFamily,
  fontEntry,
  config,
  plain = false,
}: {
  preset: WordArtPreset;
  text: string;
  fontFamily?: string;
  fontEntry?: FontEntry;
  config: WordArtConfig;
  plain?: boolean;
}) {
  const { textStyle, advancedStyle, sectionStyle, gradient } =
    createWordArtStyle({ preset, config, fontFamily });
  const sectionClassName = plain ? "word-art-plain" : `style-${preset}`;
  const previewClassName = [
    "preview",
    gradient ? "live-gradient" : "",
    config.outlineEnabled && config.outlinePaint === "gradient"
      ? "live-stroke-gradient"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  if (config.arcEnabled) {
    return (
      <div
        className="word-art-preview-stage word-art-arc-stage"
        style={
          {
            ["--wordart-arc-radius" as string]: `${config.arcRadius}px`,
            ["--wordart-arc-angle" as string]: `${config.arcAngle}deg`,
          } as CSSProperties
        }
      >
        <section
          className={sectionClassName}
          style={sectionStyle as CSSProperties | undefined}
        >
          <WordArtArcCanvas
            preset={preset}
            text={text}
            fontFamily={fontFamily}
            fontEntry={fontEntry}
            config={config}
            gradient={gradient}
          />
        </section>
      </div>
    );
  }
  return (
    <div className="word-art-preview-stage">
      <section
        className={sectionClassName}
        style={sectionStyle as CSSProperties | undefined}
      >
        <div className="wordart">
          <h1
            className={previewClassName}
            data-content={text}
            style={{ ...textStyle, ...advancedStyle } as CSSProperties}
          >
            {text}
          </h1>
        </div>
      </section>
    </div>
  );
}

function WordArtArcCanvas({
  text,
  fontEntry,
  config,
}: {
  preset: WordArtPreset;
  text: string;
  fontFamily?: string;
  fontEntry?: FontEntry;
  config: WordArtConfig;
  gradient?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!fontEntry) return;
    renderHarfBuzzArc(canvas, text, fontEntry, config);
  }, [config, fontEntry, text]);

  return (
    <canvas ref={canvasRef} className="word-art-arc-canvas" aria-label={text} />
  );
}

async function renderHarfBuzzArc(
  canvas: HTMLCanvasElement,
  text: string,
  fontEntry: FontEntry,
  config: WordArtConfig,
) {
  const dpr = window.devicePixelRatio || 1;
  const fontSize = config.fontSize || fallbackArcFontSize();
  const shaped = await shapeWordArtText(text, fontEntry, fontSize);
  const padding = Math.ceil(
    fontSize * 0.45 +
      config.outlineWidth * 3 +
      Math.abs(config.shadowX) +
      Math.abs(config.shadowY) +
      config.shadowDepth,
  );
  const sourceWidth = Math.ceil(shaped.width + padding * 2);
  const sourceHeight = Math.ceil(
    shaped.ascender + shaped.descender + padding * 2,
  );
  const bend = Math.max(-100, Math.min(100, config.arcAngle)) / 100;
  const bendDepth =
    Math.abs(bend) *
    (config.arcOrientation === "vertical" ? sourceHeight : sourceWidth) *
    0.85;
  const distortionPad =
    ((Math.abs(config.arcHorizontalDistortion) +
      Math.abs(config.arcVerticalDistortion)) /
      100) *
    sourceHeight *
    0.95;
  const outputWidth = Math.ceil(
    sourceWidth +
      (config.arcOrientation === "vertical" ? bendDepth * 2 : 0) +
      padding * 2 +
      distortionPad,
  );
  const outputHeight = Math.ceil(
    sourceHeight +
      (config.arcOrientation === "horizontal" ? bendDepth * 2 : 0) +
      padding * 2 +
      distortionPad,
  );
  const mesh = createArcWarpMesh(
    sourceWidth,
    sourceHeight,
    outputWidth,
    outputHeight,
    padding,
    config,
  );
  canvas.width = outputWidth * dpr;
  canvas.height = outputHeight * dpr;
  canvas.style.width = `${outputWidth}px`;
  canvas.style.height = `${outputHeight}px`;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, outputWidth, outputHeight);
  context.lineJoin = "round";
  context.lineCap = "round";
  context.shadowColor = config.shadowEnabled
    ? colorWithAlpha(config.shadow, config.shadowOpacity)
    : "transparent";
  context.shadowBlur = config.shadowEnabled ? config.shadowDepth : 0;
  context.shadowOffsetX = config.shadowEnabled ? config.shadowX : 0;
  context.shadowOffsetY = config.shadowEnabled ? config.shadowY : 0;
  const fill =
    makeCanvasPaint(
      context,
      config.fillPaint,
      config.gradientType,
      outputWidth,
      outputHeight,
      config.gradientStart,
      config.gradientMiddle,
      config.gradientEnd,
      config.gradientAngle,
    ) || config.fill;
  const stroke =
    makeCanvasPaint(
      context,
      config.outlinePaint,
      config.outlineGradientType,
      outputWidth,
      outputHeight,
      config.outlineGradientStart,
      config.outlineGradientMiddle,
      config.outlineGradientEnd,
      config.outlineGradientAngle,
    ) || config.outline;
  const baseline = padding + shaped.ascender;
  const flatPath = buildFlatTextPath(shaped.glyphs, padding, baseline);
  const path = buildWarpedPathFromFlatTextPath(flatPath, mesh);
  if (
    config.outlineEnabled &&
    config.outlineWidth > 0 &&
    config.outlineOpacity > 0
  ) {
    context.globalAlpha = config.outlineOpacity;
    context.strokeStyle = stroke;
    context.lineWidth = config.outlineWidth;
    context.stroke(path);
  }
  if (config.fillEnabled && config.fillOpacity > 0) {
    context.globalAlpha = config.fillOpacity;
    context.fillStyle = fill;
    context.fill(path);
  }
  context.globalAlpha = 1;
}

type FlatPathCommand = { type: string; values: number[] };

type ArcWarpMesh = {
  cols: number;
  rows: number;
  sourceWidth: number;
  sourceHeight: number;
  points: { x: number; y: number }[][];
};

function buildWarpedPathFromFlatTextPath(
  commands: FlatPathCommand[],
  mesh: ArcWarpMesh,
) {
  const path = new Path2D();
  const warp = (x: number, y: number) => interpolateArcMesh(x, y, mesh);
  for (const command of commands) {
    if (command.type === "M") {
      const p = warp(command.values[0], command.values[1]);
      path.moveTo(p.x, p.y);
    } else if (command.type === "L") {
      const p = warp(command.values[0], command.values[1]);
      path.lineTo(p.x, p.y);
    } else if (command.type === "Q") {
      const c = warp(command.values[0], command.values[1]);
      const p = warp(command.values[2], command.values[3]);
      path.quadraticCurveTo(c.x, c.y, p.x, p.y);
    } else if (command.type === "C") {
      const c1 = warp(command.values[0], command.values[1]);
      const c2 = warp(command.values[2], command.values[3]);
      const p = warp(command.values[4], command.values[5]);
      path.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p.x, p.y);
    } else if (command.type === "Z") {
      path.closePath();
    }
  }
  return path;
}

function buildFlatTextPath(
  glyphs: ShapedGlyph[],
  startX: number,
  baseline: number,
): FlatPathCommand[] {
  const commands: FlatPathCommand[] = [];
  let cursor = startX;
  for (const glyph of glyphs) {
    appendFlatGlyphCommands(
      commands,
      glyph.pathCommands,
      cursor + glyph.xOffset,
      baseline + glyph.yOffset,
    );
    cursor += glyph.xAdvance;
  }
  return commands;
}

function appendFlatGlyphCommands(
  output: FlatPathCommand[],
  commands: { type: string; values: number[] }[],
  glyphX: number,
  glyphY: number,
) {
  for (const command of commands) {
    if (command.type === "M") {
      output.push({
        type: "M",
        values: [glyphX + command.values[0], glyphY - command.values[1]],
      });
    } else if (command.type === "L") {
      output.push({
        type: "L",
        values: [glyphX + command.values[0], glyphY - command.values[1]],
      });
    } else if (command.type === "Q") {
      output.push({
        type: "Q",
        values: [
          glyphX + command.values[0],
          glyphY - command.values[1],
          glyphX + command.values[2],
          glyphY - command.values[3],
        ],
      });
    } else if (command.type === "C") {
      output.push({
        type: "C",
        values: [
          glyphX + command.values[0],
          glyphY - command.values[1],
          glyphX + command.values[2],
          glyphY - command.values[3],
          glyphX + command.values[4],
          glyphY - command.values[5],
        ],
      });
    } else if (command.type === "Z") {
      output.push({ type: "Z", values: [] });
    }
  }
}

function createArcWarpMesh(
  sourceWidth: number,
  sourceHeight: number,
  outputWidth: number,
  outputHeight: number,
  padding: number,
  config: WordArtConfig,
): ArcWarpMesh {
  const cols = 72;
  const rows = 72;
  const points: { x: number; y: number }[][] = [];
  for (let row = 0; row <= rows; row += 1) {
    const line: { x: number; y: number }[] = [];
    for (let col = 0; col <= cols; col += 1) {
      line.push(
        warpArcGridPoint(
          (col / cols) * sourceWidth,
          (row / rows) * sourceHeight,
          sourceWidth,
          sourceHeight,
          outputWidth,
          outputHeight,
          padding,
          config,
        ),
      );
    }
    points.push(line);
  }
  return { cols, rows, sourceWidth, sourceHeight, points };
}

function interpolateArcMesh(x: number, y: number, mesh: ArcWarpMesh) {
  const sx =
    (Math.max(0, Math.min(mesh.sourceWidth, x)) /
      Math.max(1, mesh.sourceWidth)) *
    mesh.cols;
  const sy =
    (Math.max(0, Math.min(mesh.sourceHeight, y)) /
      Math.max(1, mesh.sourceHeight)) *
    mesh.rows;
  const col = Math.min(mesh.cols - 1, Math.floor(sx));
  const row = Math.min(mesh.rows - 1, Math.floor(sy));
  const tx = sx - col;
  const ty = sy - row;
  const p00 = mesh.points[row][col];
  const p10 = mesh.points[row][col + 1];
  const p01 = mesh.points[row + 1][col];
  const p11 = mesh.points[row + 1][col + 1];
  const top = {
    x: p00.x + (p10.x - p00.x) * tx,
    y: p00.y + (p10.y - p00.y) * tx,
  };
  const bottom = {
    x: p01.x + (p11.x - p01.x) * tx,
    y: p01.y + (p11.y - p01.y) * tx,
  };
  return {
    x: top.x + (bottom.x - top.x) * ty,
    y: top.y + (bottom.y - top.y) * ty,
  };
}

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const cubicPoint = (
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number,
) => {
  const mt = 1 - t;
  return {
    x:
      mt * mt * mt * p0.x +
      3 * mt * mt * t * p1.x +
      3 * mt * t * t * p2.x +
      t * t * t * p3.x,
    y:
      mt * mt * mt * p0.y +
      3 * mt * mt * t * p1.y +
      3 * mt * t * t * p2.y +
      t * t * t * p3.y,
  };
};

/*
function warpArcGridPoint(x: number, y: number, sourceWidth: number, sourceHeight: number, outputWidth: number, outputHeight: number, padding: number, config: WordArtConfig) {
  const bend = Math.max(-100, Math.min(100, config.arcAngle)) / 100;
  const hDistort = Math.max(-1, Math.min(1, config.arcHorizontalDistortion / 100));
  const vDistort = Math.max(-1, Math.min(1, config.arcVerticalDistortion / 100));
  const innerWidth = Math.max(1, sourceWidth - padding * 2);
  const innerHeight = Math.max(1, sourceHeight - padding * 2);
  const u = Math.max(-1, Math.min(1, ((x - padding) / innerWidth) * 2 - 1));
  const v = Math.max(-1, Math.min(1, ((y - padding) / innerHeight) * 2 - 1));
  const flatX = x + (outputWidth - sourceWidth) / 2;
  const flatY = y + (outputHeight - sourceHeight) / 2;
  let px = flatX;
  let py = flatY;

  if (bend !== 0 && config.arcOrientation === "horizontal") {
    const sign = Math.sign(bend);
    const thetaMax = Math.max(0.001, Math.min(maxStableArcRadians, Math.abs(bend) * Math.PI));
    const theta = u * thetaMax / 2;
    const radius = innerWidth / (2 * Math.sin(thetaMax / 2));
    const centerX = outputWidth / 2;
    const arcBaseY = outputHeight / 2 + sign * radius * Math.cos(thetaMax / 2);
    const radialOffset = (y - sourceHeight / 2) * 0.92 * -sign;
    px = centerX + (radius + radialOffset) * Math.sin(theta);
    py = arcBaseY - sign * (radius + radialOffset) * Math.cos(theta);
  } else if (bend !== 0) {
    const sign = Math.sign(bend);
    const strength = Math.abs(bend);
    const thetaMax = Math.max(0.001, Math.min(maxStableArcRadians, strength * Math.PI));
    const theta = v * thetaMax / 2;
    const radius = innerHeight / (2 * Math.sin(thetaMax / 2) || 1);
    const arcOffset = radius * (Math.cos(theta) - Math.cos(thetaMax / 2));
    px = flatX + sign * arcOffset;
    py = flatY;
    px = Math.max(padding, Math.min(outputWidth - padding, px));
  }

  const centerX = outputWidth / 2;
  const centerY = outputHeight / 2;
  if (hDistort !== 0) {
    const edgeFactor = hDistort > 0 ? (1 - u) / 2 : (1 + u) / 2;
    const pull = Math.abs(hDistort) * edgeFactor * 0.96;
    const vanishX = centerX - Math.sign(hDistort) * innerWidth * 0.56;
    const vanishY = centerY;
    px += (vanishX - px) * pull;
    py += (vanishY - py) * pull;
  }
  if (vDistort !== 0) {
    const edgeFactor = vDistort > 0 ? (1 - v) / 2 : (1 + v) / 2;
    const pull = Math.abs(vDistort) * edgeFactor * 0.78;
    const vanishX = centerX;
    const vanishY = centerY - Math.sign(vDistort) * innerHeight * 0.82;
    px += (vanishX - px) * pull;
    py += (vanishY - py) * pull;
  }
  return { x: px, y: py };
}
*/

function warpArcGridPoint(
  x: number,
  y: number,
  sourceWidth: number,
  sourceHeight: number,
  outputWidth: number,
  outputHeight: number,
  padding: number,
  config: WordArtConfig,
) {
  const bend = Math.max(-100, Math.min(100, config.arcAngle)) / 100;
  const hDistort = Math.max(
    -1,
    Math.min(1, config.arcHorizontalDistortion / 100),
  );
  const vDistort = Math.max(
    -1,
    Math.min(1, config.arcVerticalDistortion / 100),
  );
  const innerWidth = Math.max(1, sourceWidth - padding * 2);
  const innerHeight = Math.max(1, sourceHeight - padding * 2);
  const u01 = Math.max(0, Math.min(1, (x - padding) / innerWidth));
  const v01 = Math.max(0, Math.min(1, (y - padding) / innerHeight));
  const u = u01 * 2 - 1;
  const v = v01 * 2 - 1;
  const left = (outputWidth - sourceWidth) / 2 + padding;
  const top = (outputHeight - sourceHeight) / 2 + padding;
  const right = left + innerWidth;
  const bottom = top + innerHeight;
  const sign = Math.sign(bend || 1);
  const strength = Math.abs(bend);
  let px = x + (outputWidth - sourceWidth) / 2;
  let py = y + (outputHeight - sourceHeight) / 2;

  if (bend !== 0 && config.arcOrientation === "horizontal") {
    const thetaMax = Math.max(
      0.001,
      Math.min(maxStableArcRadians, strength * Math.PI),
    );
    const theta = (u * thetaMax) / 2;
    const radius = innerWidth / (2 * Math.sin(thetaMax / 2));
    const centerX = outputWidth / 2;
    const arcBaseY = outputHeight / 2 + sign * radius * Math.cos(thetaMax / 2);
    const radialOffset = (y - sourceHeight / 2) * 0.92 * -sign;
    px = centerX + (radius + radialOffset) * Math.sin(theta);
    py = arcBaseY - sign * (radius + radialOffset) * Math.cos(theta);
  } else if (bend !== 0) {
    const thetaMax = Math.max(
      0.001,
      Math.min(maxStableArcRadians, strength * Math.PI),
    );
    const theta = (v * thetaMax) / 2;
    const radius = innerHeight / (2 * Math.sin(thetaMax / 2));
    const centerX = outputWidth / 2;
    const centerY = outputHeight / 2;
    const centerlineX = centerX + sign * radius * (Math.cos(theta) - Math.cos(thetaMax / 2));
    const centerlineY = centerY + radius * Math.sin(theta);
    px = centerlineX + (x - sourceWidth / 2);
    py = centerlineY;
  }

  if (hDistort !== 0) {
    const taper = 1 + hDistort * v * 0.28;
    const centerX = outputWidth / 2;
    px = centerX + (px - centerX) * Math.max(0.1, taper);
  }
  if (vDistort !== 0) {
    const taper = 1 + vDistort * u * 0.28;
    const centerY = outputHeight / 2;
    py = centerY + (py - centerY) * Math.max(0.1, taper);
  }
  return {
    x: Math.max(padding, Math.min(outputWidth - padding, px)),
    y: Math.max(padding, Math.min(outputHeight - padding, py)),
  };
}

function makeCanvasPaint(
  context: CanvasRenderingContext2D,
  paint: "solid" | "gradient",
  type: "linear" | "radial",
  width: number,
  height: number,
  start: string,
  middle: string,
  end: string,
  angle: number,
) {
  if (paint !== "gradient") return null;
  const gradient =
    type === "radial"
      ? context.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          Math.max(width, height) / 2,
        )
      : context.createLinearGradient(
          0,
          0,
          Math.cos((angle * Math.PI) / 180) * width,
          Math.sin((angle * Math.PI) / 180) * height,
        );
  gradient.addColorStop(0, start);
  gradient.addColorStop(0.5, middle);
  gradient.addColorStop(1, end);
  return gradient;
}
