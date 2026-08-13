export const WORD_ART_PRESETS = [
  "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "twentyone",
  "twentytwo",
] as const;

export type WordArtPreset = (typeof WORD_ART_PRESETS)[number];

export interface WordArtPresetStyle {
  fill: string;
  outline: string;
  shadow: string;
  texture?: string;
  transform?: string;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: string;
  letterSpacing?: string;
}

export interface WordArtConfig {
  fillEnabled: boolean;
  fillOpacity: number;
  outlineEnabled: boolean;
  outlineWidth: number;
  outlineOpacity: number;
  shadowEnabled: boolean;
  depthEnabled: boolean;
  depthColor: string;
  fill: string;
  outline: string;
  shadow: string;
  rotation: number;
  shadowX: number;
  shadowY: number;
  gradientEnabled: boolean;
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number;
  gradientCustom: boolean;
  gradientMiddle: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: "normal" | "italic";
  letterSpacing: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  perspective: number;
  translateX: number;
  translateY: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  shadowDepth: number;
  shadowOpacity: number;
  textureSize: number;
  textureAngle: number;
  arcEnabled: boolean;
  arcRadius: number;
  arcAngle: number;
  layerDepth: number;
  layerAngle: number;
  bevel: number;
}

export interface WordArtLayerStyle {
  text: {
    fontSize: number;
    fontWeight: number;
    fontStyle: "normal" | "italic";
    letterSpacing: number;
  };
  fill: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
  stroke: {
    enabled: boolean;
    color: string;
    width: number;
    opacity: number;
  };
  shadow: {
    enabled: boolean;
    color: string;
    x: number;
    y: number;
    blur: number;
    opacity: number;
  };
  gradientOverlay: {
    enabled: boolean;
    custom: boolean;
    start: string;
    middle: string;
    end: string;
    angle: number;
    textureSize: number;
    texturePosition: number;
  };
  transform: {
    rotation: number;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
    perspective: number;
    translateX: number;
    translateY: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
  };
  depth: {
    enabled: boolean;
    color: string;
    layerDepth: number;
    layerAngle: number;
    bevel: number;
  };
  arc: {
    enabled: boolean;
    radius: number;
    angle: number;
  };
}

export interface WordArtRenderInput {
  preset: WordArtPreset;
  config: WordArtConfig;
  fontFamily?: string;
}

export type WordArtStyle = Record<string, string | number | undefined>;

export interface WordArtStyleModel {
  textStyle: WordArtStyle;
  advancedStyle: WordArtStyle;
  sectionStyle?: WordArtStyle;
  gradient?: string;
  hasAdvancedTransform: boolean;
}
