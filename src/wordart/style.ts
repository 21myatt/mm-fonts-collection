import { WORD_ART_PRESET_STYLES } from "./presets";
import type { WordArtRenderInput, WordArtStyleModel } from "./types";

export function createWordArtStyle({ preset, config, fontFamily }: WordArtRenderInput): WordArtStyleModel {
  const texture = WORD_ART_PRESET_STYLES[preset].texture;
  const customGradient = `linear-gradient(${config.gradientAngle}deg, ${config.gradientStart}, ${config.gradientMiddle} 50%, ${config.gradientEnd})`;
  const gradient = texture && config.gradientEnabled
    ? preset === "six"
      ? `linear-gradient(${config.gradientAngle}deg, ${config.gradientStart}, ${config.gradientEnd})`
      : preset === "eight"
        ? `radial-gradient(ellipse at center, ${config.gradientStart}, ${config.gradientEnd})`
        : config.gradientCustom ? customGradient : texture
    : undefined;
  const layerShadow = config.layerDepth > 0
    ? Array.from({ length: Math.max(1, Math.round(config.layerDepth)) }, (_, index) => {
      const distance = index + 1;
      const radians = config.layerAngle * Math.PI / 180;
      return `${Math.cos(radians) * distance}px ${Math.sin(radians) * distance}px ${config.bevel}px var(--wordart-shadow-control)`;
    }).join(", ")
    : undefined;
  const advancedTransform = `translate(${config.translateX}px, ${config.translateY}px) ${config.perspective ? `perspective(${config.perspective}px)` : ""} scale(${config.scaleX}, ${config.scaleY}) skew(${config.skewX}deg, ${config.skewY}deg) rotateX(${config.rotateX}deg) rotateY(${config.rotateY}deg) rotateZ(${config.rotateZ}deg)`;
  const hasAdvancedTransform = Boolean(config.translateX || config.translateY || config.perspective || config.scaleX !== 1 || config.scaleY !== 1 || config.skewX || config.skewY || config.rotateX || config.rotateY || config.rotateZ);
  return {
    gradient,
    hasAdvancedTransform,
    sectionStyle: hasAdvancedTransform ? { transform: advancedTransform } : undefined,
    textStyle: {
      fontFamily: fontFamily ? `"${fontFamily}", sans-serif` : undefined,
      ...(preset === "one" ? { WebkitTextStrokeColor: config.outline } : {}),
      ...(preset === "two" ? { color: config.fill, WebkitTextFillColor: config.fill, transform: `rotate(${config.rotation}deg) skewY(-10deg)` } : {}),
      ...(preset === "three" || preset === "four" ? { color: config.fill, WebkitTextFillColor: config.fill, WebkitTextStrokeColor: config.outline, textShadow: `${config.shadowX}px ${config.shadowY}px ${config.shadowDepth}px ${config.shadow}`, opacity: config.shadowOpacity } : {}),
      ...(preset !== "one" && preset !== "two" && preset !== "three" && preset !== "four" ? { color: config.fill, WebkitTextFillColor: gradient ? "transparent" : config.fill, WebkitTextStrokeColor: config.outline, "--wordart-shadow-control": config.shadow } : {}),
      ...(gradient ? { "--live-wordart-gradient": gradient, backgroundSize: `${config.textureSize}% ${config.textureSize}%`, backgroundPosition: `${config.textureAngle}% 50%`, WebkitBackgroundClip: "text", backgroundClip: "text", backgroundColor: "transparent", WebkitTextFillColor: "transparent" } : {}),
      ...(layerShadow ? { "--wordart-layer-shadow": layerShadow } : {}),
    },
    advancedStyle: {
      ...(hasAdvancedTransform ? { transform: advancedTransform } : {}),
      ...(config.fontSize ? { fontSize: `${config.fontSize}px` } : {}),
      ...(config.fontWeight ? { fontWeight: config.fontWeight } : {}),
      ...(config.fontStyle !== "normal" ? { fontStyle: config.fontStyle } : {}),
      ...(config.letterSpacing ? { letterSpacing: `${config.letterSpacing}px` } : {}),
    },
  };
}
