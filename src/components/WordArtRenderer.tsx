import { useEffect, useRef, type CSSProperties } from "react";
import { createWordArtStyle, WORD_ART_PRESET_STYLES, type WordArtConfig, type WordArtPreset } from "../wordart";

const fallbackArcFontSize = () => Math.max(34, Math.min(window.innerWidth, window.innerHeight) * 0.09);
const colorWithAlpha = (color: string, alpha: number) => {
  const hex = color.match(/^#([0-9a-f]{6})$/i)?.[1];
  if (!hex) return color;
  const value = Number.parseInt(hex, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
};

export default function WordArtRenderer({ preset, text, fontFamily, config, plain = false }: { preset: WordArtPreset; text: string; fontFamily?: string; config: WordArtConfig; plain?: boolean }) {
  const { textStyle, advancedStyle, sectionStyle, gradient } = createWordArtStyle({ preset, config, fontFamily });
  const sectionClassName = plain ? "word-art-plain" : `style-${preset}`;
  if (config.arcEnabled) {
    return <div className="word-art-preview-stage word-art-arc-stage" style={{ ["--wordart-arc-radius" as string]: `${config.arcRadius}px`, ["--wordart-arc-angle" as string]: `${config.arcAngle}deg` } as CSSProperties}>
      <section className={sectionClassName} style={sectionStyle as CSSProperties | undefined}>
        <WordArtArcCanvas preset={preset} text={text} fontFamily={fontFamily} config={config} gradient={gradient} />
      </section>
    </div>;
  }
  return <div className="word-art-preview-stage"><section className={sectionClassName} style={sectionStyle as CSSProperties | undefined}><div className="wordart"><h1 className={gradient ? "preview live-gradient" : "preview"} data-content={text} style={{ ...textStyle, ...advancedStyle } as CSSProperties}>{text}</h1></div></section></div>;
}

function WordArtArcCanvas({ preset, text, fontFamily, config, gradient }: { preset: WordArtPreset; text: string; fontFamily?: string; config: WordArtConfig; gradient?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const fontSize = config.fontSize || fallbackArcFontSize();
    const fontWeight = config.fontWeight || WORD_ART_PRESET_STYLES[preset].fontWeight || 900;
    const family = fontFamily ? `"${fontFamily}", sans-serif` : "sans-serif";
    const font = `${config.fontStyle} ${fontWeight} ${fontSize}px ${family}`;
    const padding = Math.ceil(fontSize * 1.25);
    const measureCanvas = document.createElement("canvas");
    const measureContext = measureCanvas.getContext("2d");
    if (!measureContext) return;

    measureContext.font = font;
    measureContext.letterSpacing = `${config.letterSpacing}px`;
    const metrics = measureContext.measureText(text || " ");
    const textWidth = Math.max(1, Math.ceil(metrics.width));
    const ascent = metrics.actualBoundingBoxAscent || fontSize;
    const descent = metrics.actualBoundingBoxDescent || fontSize * 0.35;
    const sourceWidth = textWidth + padding * 2;
    const sourceHeight = Math.ceil(ascent + descent + padding * 2);
    measureCanvas.width = sourceWidth * dpr;
    measureCanvas.height = sourceHeight * dpr;
    measureContext.scale(dpr, dpr);
    measureContext.clearRect(0, 0, sourceWidth, sourceHeight);
    measureContext.font = font;
    measureContext.letterSpacing = `${config.letterSpacing}px`;
    measureContext.textBaseline = "alphabetic";
    measureContext.lineJoin = "round";
    measureContext.lineCap = "round";
    measureContext.shadowColor = config.shadowEnabled ? colorWithAlpha(config.shadow, config.shadowOpacity) : "transparent";
    measureContext.shadowBlur = config.shadowEnabled ? config.shadowDepth : 0;
    measureContext.shadowOffsetX = config.shadowEnabled ? config.shadowX : 0;
    measureContext.shadowOffsetY = config.shadowEnabled ? config.shadowY : 0;

    const baseline = padding + ascent;
    const fill = gradient && gradient.startsWith("linear-gradient")
      ? measureContext.createLinearGradient(padding, 0, padding + textWidth, 0)
      : null;
    if (fill) {
      fill.addColorStop(0, config.gradientStart);
      if (config.gradientCustom) fill.addColorStop(0.5, config.gradientMiddle);
      fill.addColorStop(1, config.gradientEnd);
    }
    if (config.outlineEnabled && config.outline !== "transparent" && config.outlineWidth > 0 && config.outlineOpacity > 0) {
      measureContext.globalAlpha = config.outlineOpacity;
      measureContext.strokeStyle = config.outline;
      measureContext.lineWidth = config.outlineWidth;
      measureContext.strokeText(text, padding, baseline);
    }
    if (config.fillEnabled && config.fillOpacity > 0) {
      measureContext.globalAlpha = config.fillOpacity;
      measureContext.fillStyle = fill || config.fill;
      measureContext.fillText(text, padding, baseline);
    }
    measureContext.globalAlpha = 1;

    const bend = config.arcAngle / 180;
    const radiusFactor = Math.max(0.45, Math.min(1.25, 260 / Math.max(config.arcRadius, 1)));
    const bendDepth = Math.abs(bend) * fontSize * 1.55 * radiusFactor;
    const rotateDepth = bend * 20 * radiusFactor;
    const outputWidth = sourceWidth + padding * 2;
    const outputHeight = Math.ceil(sourceHeight + bendDepth * 2 + padding * 2);
    canvas.width = outputWidth * dpr;
    canvas.height = outputHeight * dpr;
    canvas.style.width = `${outputWidth}px`;
    canvas.style.height = `${outputHeight}px`;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(dpr, dpr);
    context.clearRect(0, 0, outputWidth, outputHeight);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    const centerY = outputHeight / 2;
    for (let x = 0; x < sourceWidth; x += 1) {
      const normalized = (x / Math.max(1, sourceWidth - 1)) * 2 - 1;
      const y = -bendDepth * (1 - normalized * normalized) * Math.sign(config.arcAngle || 1);
      const rotation = rotateDepth * normalized * Math.PI / 180;
      context.save();
      context.translate(x + padding, centerY + y);
      context.rotate(rotation);
      context.drawImage(measureCanvas, x * dpr, 0, dpr, sourceHeight * dpr, -0.65, -sourceHeight / 2, 1.3, sourceHeight);
      context.restore();
    }
  }, [config, fontFamily, gradient, preset, text]);

  return <canvas ref={canvasRef} className="word-art-arc-canvas" aria-label={text} />;
}
