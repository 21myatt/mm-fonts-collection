import type { CSSProperties } from "react";
import { WORD_ART_PRESET_STYLES, type WordArtPreset } from "../lib/wordArtPresets";
import type { WordArtEditorConfig } from "../lib/wordArtConfig";

export default function WordArtRenderer({ preset, text, fontFamily, config }: { preset: WordArtPreset; text: string; fontFamily?: string; config: WordArtEditorConfig }) {
  const texture = WORD_ART_PRESET_STYLES[preset].texture;
  const texturePreset = Boolean(texture);
  const gradient = texturePreset && config.gradientEnabled
    ? preset === "six"
      ? `linear-gradient(${config.gradientAngle}deg, ${config.gradientStart}, ${config.gradientEnd})`
      : preset === "eight"
        ? `radial-gradient(ellipse at center, ${config.gradientStart}, ${config.gradientEnd})`
        : texture
    : undefined;
  const style = {
    fontFamily: fontFamily ? `"${fontFamily}", sans-serif` : undefined,
    ...(preset === "one" ? { WebkitTextStrokeColor: config.outline } : {}),
    ...(preset === "two" ? { color: config.fill, WebkitTextFillColor: config.fill, transform: `rotate(${config.rotation}deg) skewY(-10deg)` } : {}),
    ...(preset === "three" || preset === "four" ? { color: config.fill, WebkitTextFillColor: config.fill, WebkitTextStrokeColor: config.outline, textShadow: `${config.shadowX}px ${config.shadowY}px ${config.shadowDepth}px ${config.shadow}` , opacity: config.shadowOpacity } : {}),
    ...(preset !== "one" && preset !== "two" && preset !== "three" && preset !== "four" ? { color: config.fill, WebkitTextFillColor: gradient ? "transparent" : config.fill, WebkitTextStrokeColor: config.outline, ...( { "--wordart-shadow-control": config.shadow } as CSSProperties) } : {}),
    ...(gradient ? ({ "--live-wordart-gradient": gradient, backgroundSize: `${config.textureSize}% ${config.textureSize}%`, backgroundPosition: `${config.textureAngle}% 50%`, WebkitBackgroundClip: "text", backgroundClip: "text", backgroundColor: "transparent", WebkitTextFillColor: "transparent" } as CSSProperties) : {}),
  } as CSSProperties;
  const advancedTransform = `translate(${config.translateX}px, ${config.translateY}px) ${config.perspective ? `perspective(${config.perspective}px)` : ""} scale(${config.scaleX}, ${config.scaleY}) skew(${config.skewX}deg, ${config.skewY}deg) rotateX(${config.rotateX}deg) rotateY(${config.rotateY}deg) rotateZ(${config.rotateZ}deg)`;
  const hasAdvancedTransform = config.translateX || config.translateY || config.perspective || config.scaleX !== 1 || config.scaleY !== 1 || config.skewX || config.skewY || config.rotateX || config.rotateY || config.rotateZ;
  const advancedStyle = { ...(hasAdvancedTransform ? { transform: advancedTransform } : {}), ...(config.fontSize ? { fontSize: `${config.fontSize}px` } : {}), ...(config.fontWeight ? { fontWeight: config.fontWeight } : {}), ...(config.fontStyle !== "normal" ? { fontStyle: config.fontStyle } : {}), ...(config.letterSpacing ? { letterSpacing: `${config.letterSpacing}px` } : {}) } as CSSProperties;
  if (config.arcEnabled) {
    const clusters = typeof Intl !== "undefined" && "Segmenter" in Intl
      ? Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), (item) => item.segment)
      : Array.from(text);
    return <div className="word-art-preview-stage word-art-arc-stage" style={{ ["--wordart-arc-radius" as string]: `${config.arcRadius}px`, ["--wordart-arc-angle" as string]: `${config.arcAngle}deg` } as CSSProperties}>
      <span className="word-art-arc-source" aria-label={text}>{text}</span>
      <div className={`word-art-arc word-art-arc-style-${preset}`} aria-hidden="true">{clusters.map((cluster, index) => <span key={`${cluster}-${index}`} style={{ ["--wordart-arc-index" as string]: index, ["--wordart-arc-count" as string]: clusters.length, ...style, ...advancedStyle } as CSSProperties}>{cluster}</span>)}</div>
    </div>;
  }
  return <div className="word-art-preview-stage"><section className={`style-${preset}`} style={hasAdvancedTransform ? { transform: advancedTransform } : undefined}><div className="wordart"><h1 className={gradient ? "preview live-gradient" : "preview"} data-content={text} style={{ ...style, ...advancedStyle }}>{text}</h1></div></section></div>;
}
