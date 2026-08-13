import type { WordArtConfig, WordArtLayerStyle } from "./types";

export function createWordArtLayerStyle(config: WordArtConfig): WordArtLayerStyle {
  return {
    text: {
      fontSize: config.fontSize,
      fontWeight: config.fontWeight,
      fontStyle: config.fontStyle,
      letterSpacing: config.letterSpacing,
    },
    fill: { enabled: config.fillEnabled, color: config.fill, opacity: config.fillOpacity },
    stroke: {
      enabled: config.outlineEnabled,
      color: config.outline,
      width: config.outlineWidth,
      opacity: config.outlineOpacity,
    },
    shadow: {
      enabled: config.shadowEnabled,
      color: config.shadow,
      x: config.shadowX,
      y: config.shadowY,
      blur: config.shadowDepth,
      opacity: config.shadowOpacity,
    },
    gradientOverlay: {
      enabled: config.gradientEnabled,
      custom: config.gradientCustom,
      start: config.gradientStart,
      middle: config.gradientMiddle,
      end: config.gradientEnd,
      angle: config.gradientAngle,
      textureSize: config.textureSize,
      texturePosition: config.textureAngle,
    },
    transform: {
      rotation: config.rotation,
      scaleX: config.scaleX,
      scaleY: config.scaleY,
      skewX: config.skewX,
      skewY: config.skewY,
      perspective: config.perspective,
      translateX: config.translateX,
      translateY: config.translateY,
      rotateX: config.rotateX,
      rotateY: config.rotateY,
      rotateZ: config.rotateZ,
    },
    depth: {
      enabled: config.depthEnabled,
      color: config.depthColor,
      layerDepth: config.layerDepth,
      layerAngle: config.layerAngle,
      bevel: config.bevel,
    },
    arc: {
      enabled: config.arcEnabled,
      radius: config.arcRadius,
      angle: config.arcAngle,
    },
  };
}

export function applyWordArtLayerStyle(config: WordArtConfig, layerStyle: Partial<WordArtLayerStyle>): WordArtConfig {
  return {
    ...config,
    ...(layerStyle.text ? {
      fontSize: layerStyle.text.fontSize ?? config.fontSize,
      fontWeight: layerStyle.text.fontWeight ?? config.fontWeight,
      fontStyle: layerStyle.text.fontStyle ?? config.fontStyle,
      letterSpacing: layerStyle.text.letterSpacing ?? config.letterSpacing,
    } : {}),
    ...(layerStyle.fill ? { fillEnabled: layerStyle.fill.enabled ?? config.fillEnabled, fill: layerStyle.fill.color ?? config.fill, fillOpacity: layerStyle.fill.opacity ?? config.fillOpacity } : {}),
    ...(layerStyle.stroke ? { outlineEnabled: layerStyle.stroke.enabled ?? config.outlineEnabled, outline: layerStyle.stroke.color ?? config.outline, outlineWidth: layerStyle.stroke.width ?? config.outlineWidth, outlineOpacity: layerStyle.stroke.opacity ?? config.outlineOpacity } : {}),
    ...(layerStyle.shadow ? {
      shadowEnabled: layerStyle.shadow.enabled ?? config.shadowEnabled,
      shadow: layerStyle.shadow.color ?? config.shadow,
      shadowX: layerStyle.shadow.x ?? config.shadowX,
      shadowY: layerStyle.shadow.y ?? config.shadowY,
      shadowDepth: layerStyle.shadow.blur ?? config.shadowDepth,
      shadowOpacity: layerStyle.shadow.opacity ?? config.shadowOpacity,
    } : {}),
    ...(layerStyle.gradientOverlay ? {
      gradientEnabled: layerStyle.gradientOverlay.enabled ?? config.gradientEnabled,
      gradientCustom: layerStyle.gradientOverlay.custom ?? config.gradientCustom,
      gradientStart: layerStyle.gradientOverlay.start ?? config.gradientStart,
      gradientMiddle: layerStyle.gradientOverlay.middle ?? config.gradientMiddle,
      gradientEnd: layerStyle.gradientOverlay.end ?? config.gradientEnd,
      gradientAngle: layerStyle.gradientOverlay.angle ?? config.gradientAngle,
      textureSize: layerStyle.gradientOverlay.textureSize ?? config.textureSize,
      textureAngle: layerStyle.gradientOverlay.texturePosition ?? config.textureAngle,
    } : {}),
    ...(layerStyle.transform ? {
      rotation: layerStyle.transform.rotation ?? config.rotation,
      scaleX: layerStyle.transform.scaleX ?? config.scaleX,
      scaleY: layerStyle.transform.scaleY ?? config.scaleY,
      skewX: layerStyle.transform.skewX ?? config.skewX,
      skewY: layerStyle.transform.skewY ?? config.skewY,
      perspective: layerStyle.transform.perspective ?? config.perspective,
      translateX: layerStyle.transform.translateX ?? config.translateX,
      translateY: layerStyle.transform.translateY ?? config.translateY,
      rotateX: layerStyle.transform.rotateX ?? config.rotateX,
      rotateY: layerStyle.transform.rotateY ?? config.rotateY,
      rotateZ: layerStyle.transform.rotateZ ?? config.rotateZ,
    } : {}),
    ...(layerStyle.depth ? {
      depthEnabled: layerStyle.depth.enabled ?? config.depthEnabled,
      depthColor: layerStyle.depth.color ?? config.depthColor,
      layerDepth: layerStyle.depth.layerDepth ?? config.layerDepth,
      layerAngle: layerStyle.depth.layerAngle ?? config.layerAngle,
      bevel: layerStyle.depth.bevel ?? config.bevel,
    } : {}),
    ...(layerStyle.arc ? {
      arcEnabled: layerStyle.arc.enabled ?? config.arcEnabled,
      arcRadius: layerStyle.arc.radius ?? config.arcRadius,
      arcAngle: layerStyle.arc.angle ?? config.arcAngle,
    } : {}),
  };
}
