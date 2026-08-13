import { WORD_ART_PRESET_STYLES } from "./presets";
import { createWordArtLayerStyle } from "./layerStyle";
import type { WordArtRenderInput, WordArtStyleModel } from "./types";

const withAlpha = (color: string, opacity: number) => opacity >= 1 ? color : `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`;
const createGradient = ({ type, angle, start, middle, end }: { type: "linear" | "radial"; angle: number; start: string; middle: string; end: string }) =>
  type === "radial"
    ? `radial-gradient(ellipse at center, ${start}, ${middle} 50%, ${end})`
    : `linear-gradient(${angle}deg, ${start}, ${middle} 50%, ${end})`;

export function createWordArtStyle({ preset, config, fontFamily }: WordArtRenderInput): WordArtStyleModel {
  const layerStyle = createWordArtLayerStyle(config);
  const texture = WORD_ART_PRESET_STYLES[preset].texture;
  const customGradient = createGradient(layerStyle.gradientOverlay);
  const strokeCustomGradient = createGradient(layerStyle.strokeGradientOverlay);
  const fillGradient = layerStyle.fill.enabled && layerStyle.fill.paint === "gradient";
  const strokeGradient = layerStyle.stroke.enabled && layerStyle.stroke.paint === "gradient";
  const gradient = fillGradient
    ? layerStyle.gradientOverlay.custom || !texture
      ? customGradient
      : preset === "six"
        ? `linear-gradient(${layerStyle.gradientOverlay.angle}deg, ${layerStyle.gradientOverlay.start}, ${layerStyle.gradientOverlay.end})`
        : preset === "eight"
          ? `radial-gradient(ellipse at center, ${layerStyle.gradientOverlay.start}, ${layerStyle.gradientOverlay.end})`
          : texture
    : undefined;
  const layerShadow = layerStyle.depth.enabled && layerStyle.depth.layerDepth > 0
    ? Array.from({ length: Math.max(1, Math.round(layerStyle.depth.layerDepth)) }, (_, index) => {
      const distance = index + 1;
      const radians = layerStyle.depth.layerAngle * Math.PI / 180;
      return `${Math.cos(radians) * distance}px ${Math.sin(radians) * distance}px ${layerStyle.depth.bevel}px ${layerStyle.depth.color}`;
    }).join(", ")
    : undefined;
  const shadow = layerStyle.shadow.enabled ? `${layerStyle.shadow.x}px ${layerStyle.shadow.y}px ${layerStyle.shadow.blur}px ${withAlpha(layerStyle.shadow.color, layerStyle.shadow.opacity)}` : undefined;
  const textShadow = [shadow, layerShadow].filter(Boolean).join(", ") || undefined;
  const transform = layerStyle.transform;
  const advancedTransform = `translate(${transform.translateX}px, ${transform.translateY}px) ${transform.perspective ? `perspective(${transform.perspective}px)` : ""} scale(${transform.scaleX}, ${transform.scaleY}) skew(${transform.skewX}deg, ${transform.skewY}deg) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) rotateZ(${transform.rotateZ}deg)`;
  const hasAdvancedTransform = Boolean(transform.translateX || transform.translateY || transform.perspective || transform.scaleX !== 1 || transform.scaleY !== 1 || transform.skewX || transform.skewY || transform.rotateX || transform.rotateY || transform.rotateZ);
  return {
    gradient,
    hasAdvancedTransform,
    sectionStyle: hasAdvancedTransform ? { transform: advancedTransform } : undefined,
    textStyle: {
      fontFamily: fontFamily ? `"${fontFamily}", sans-serif` : undefined,
      color: layerStyle.fill.enabled ? withAlpha(layerStyle.fill.color, layerStyle.fill.opacity) : "transparent",
      WebkitTextFillColor: gradient ? "transparent" : layerStyle.fill.enabled ? withAlpha(layerStyle.fill.color, layerStyle.fill.opacity) : "transparent",
      ...(layerStyle.stroke.enabled && !strokeGradient ? { WebkitTextStrokeWidth: `${layerStyle.stroke.width}px`, WebkitTextStrokeColor: withAlpha(layerStyle.stroke.color, layerStyle.stroke.opacity) } : { WebkitTextStrokeWidth: 0, WebkitTextStrokeColor: "transparent" }),
      ...(textShadow ? { textShadow } : {}),
      ...(gradient ? { "--live-wordart-gradient": gradient, backgroundSize: `${layerStyle.gradientOverlay.textureSize}% ${layerStyle.gradientOverlay.textureSize}%`, backgroundPosition: `${layerStyle.gradientOverlay.texturePosition}% 50%`, WebkitBackgroundClip: "text", backgroundClip: "text", backgroundColor: "transparent", WebkitTextFillColor: "transparent" } : {}),
      ...(strokeGradient ? { "--live-wordart-stroke-gradient": strokeCustomGradient, "--live-wordart-stroke-width": `${layerStyle.stroke.width}px`, "--live-wordart-stroke-opacity": layerStyle.stroke.opacity } : {}),
    },
    advancedStyle: {
      ...(hasAdvancedTransform ? { transform: advancedTransform } : {}),
      ...(layerStyle.text.fontSize ? { fontSize: `${layerStyle.text.fontSize}px` } : {}),
      ...(layerStyle.text.fontWeight ? { fontWeight: layerStyle.text.fontWeight } : {}),
      ...(layerStyle.text.fontStyle !== "normal" ? { fontStyle: layerStyle.text.fontStyle } : {}),
      ...(layerStyle.text.letterSpacing ? { letterSpacing: `${layerStyle.text.letterSpacing}px` } : {}),
    },
  };
}
