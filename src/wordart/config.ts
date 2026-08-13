import type { WordArtConfig, WordArtPreset } from "./types";

const defaults: Record<WordArtPreset, Partial<WordArtConfig>> = {
  one: { outline: "#000000" }, two: { fill: "#000000", rotation: -3 },
  three: { fill: "#ffffff", outline: "#000000", shadow: "#999999", shadowX: 3, shadowY: 2 },
  four: { fill: "#336699", outline: "transparent", shadow: "#c1c1c1", shadowX: 2, shadowY: 1 },
  five: { fill: "#d8d8d8", outline: "#3333cc", shadow: "#9999ff" },
  six: { fill: "#ffffff", outline: "transparent", shadow: "#717171", gradientStart: "#adadad", gradientEnd: "#ffffff", gradientAngle: 180, gradientEnabled: true },
  seven: { fill: "#0066cc", outline: "#99ccff", shadow: "#990000" },
  eight: { fill: "#ff9a32", outline: "transparent", shadow: "#cdcdcd", gradientStart: "#fff812", gradientEnd: "#ff9a32", gradientAngle: 0, gradientEnabled: true },
  nine: { fill: "#cb00cc", outline: "#d2a2fe", shadow: "#adadff", gradientEnabled: true }, ten: { fill: "#1a4b28", outline: "#008000", shadow: "#d2e5dc" },
  eleven: { fill: "#0b2be0", outline: "#eaeaea", shadow: "#cdcdcd", gradientEnabled: true }, twelve: { fill: "#1b999c", outline: "transparent", shadow: "#cdcdcd", gradientEnabled: true },
  thirteen: { fill: "#896640", outline: "#1b0d00", shadow: "#1b0d00" }, fourteen: { fill: "#ff9999", outline: "#002245", shadow: "#0050a0", gradientEnabled: true },
  fifteen: { fill: "#fecb00", outline: "#b2b2b2", shadow: "#ab8d56", gradientEnabled: true }, sixteen: { fill: "#33ccff", outline: "#000099", shadow: "#000099" },
  seventeen: { fill: "#ffff00", outline: "#000000", shadow: "#999999", gradientEnabled: true }, eighteen: { fill: "#ffffff", outline: "#4a4a4a", shadow: "#4a4a4a", gradientEnabled: true },
  nineteen: { fill: "#0f3a1a", outline: "#005600", shadow: "#000800" }, twenty: { fill: "#ffffff", outline: "transparent", shadow: "#72745b", gradientEnabled: true },
  twentyone: { fill: "#fe4201", outline: "#813300", shadow: "#c14d00", gradientEnabled: true }, twentytwo: { fill: "#80302d", outline: "#000000", shadow: "#a1a1a1", gradientEnabled: true },
};

export function createWordArtConfig(preset: WordArtPreset): WordArtConfig {
  return { fill: "#ffffff", outline: "#000000", shadow: "#999999", rotation: 0, shadowX: 0, shadowY: 0, gradientEnabled: false, gradientStart: "#ffffff", gradientMiddle: "#ffffff", gradientEnd: "#000000", gradientAngle: 180, gradientCustom: false, fontSize: 0, fontWeight: 0, fontStyle: "normal", letterSpacing: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, perspective: 0, translateX: 0, translateY: 0, rotateX: 0, rotateY: 0, rotateZ: 0, shadowDepth: 1, shadowOpacity: 1, textureSize: 100, textureAngle: 0, arcEnabled: false, arcRadius: 240, arcAngle: 120, layerDepth: 0, layerAngle: 45, bevel: 0, ...defaults[preset] };
}

export const patchWordArtConfig = (config: WordArtConfig, patch: Partial<WordArtConfig>) => ({
  ...config,
  ...patch,
});

export function validateWordArtConfig(config: unknown): WordArtConfig {
  if (!config || typeof config !== "object") return createWordArtConfig("one");
  return patchWordArtConfig(createWordArtConfig("one"), config as Partial<WordArtConfig>);
}
