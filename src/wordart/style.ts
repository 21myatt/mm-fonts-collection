import { WORD_ART_PRESET_STYLES } from "./presets";
import { createWordArtLayerStyle } from "./layerStyle";
import type { WordArtRenderInput, WordArtStyleModel } from "./types";

const withAlpha = (color: string, opacity: number) => opacity >= 1 ? color : `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`;

export function createWordArtStyle({ preset, config, fontFamily }: WordArtRenderInput): WordArtStyleModel {
  const layerStyle = createWordArtLayerStyle(config);
  const texture = WORD_ART_PRESET_STYLES[preset].texture;
  const customGradient = `linear-gradient(${layerStyle.gradientOverlay.angle}deg, ${layerStyle.gradientOverlay.start}, ${layerStyle.gradientOverlay.middle} 50%, ${layerStyle.gradientOverlay.end})`;
  const gradient = texture && layerStyle.gradientOverlay.enabled
    ? preset === "six"
      ? `linear-gradient(${layerStyle.gradientOverlay.angle}deg, ${layerStyle.gradientOverlay.start}, ${layerStyle.gradientOverlay.end})`
      : preset === "eight"
        ? `radial-gradient(ellipse at center, ${layerStyle.gradientOverlay.start}, ${layerStyle.gradientOverlay.end})`
        : layerStyle.gradientOverlay.custom ? customGradient : texture
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
      ...(layerStyle.stroke.enabled ? { WebkitTextStrokeWidth: `${layerStyle.stroke.width}px`, WebkitTextStrokeColor: withAlpha(layerStyle.stroke.color, layerStyle.stroke.opacity) } : { WebkitTextStrokeWidth: 0, WebkitTextStrokeColor: "transparent" }),
      ...(textShadow ? { textShadow } : {}),
      ...(gradient ? { "--live-wordart-gradient": gradient, backgroundSize: `${layerStyle.gradientOverlay.textureSize}% ${layerStyle.gradientOverlay.textureSize}%`, backgroundPosition: `${layerStyle.gradientOverlay.texturePosition}% 50%`, WebkitBackgroundClip: "text", backgroundClip: "text", backgroundColor: "transparent", WebkitTextFillColor: "transparent" } : {}),
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
