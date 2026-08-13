import { WORD_ART_PRESETS, type WordArtPreset, type WordArtPresetStyle } from "./types";

export { WORD_ART_PRESETS };
export type { WordArtPreset, WordArtPresetStyle };

export const WORD_ART_PRESET_STYLES: Record<WordArtPreset, WordArtPresetStyle> = {
  one: { fill: "#ffffff", outline: "#000000", shadow: "#000000", transform: "scale(1.05, 1.25)", fontWeight: 900 },
  two: { fill: "#000000", outline: "#000000", shadow: "#000000", transform: "scaleY(1.65) rotate(-3deg) skewY(-10deg)", fontWeight: 900 },
  three: { fill: "#ffffff", outline: "#000000", shadow: "#999999", transform: "scaleY(1.65)", fontStyle: "italic" },
  four: { fill: "#336699", outline: "transparent", shadow: "#c1c1c1", fontFamily: "Times New Roman, serif" },
  five: { fill: "#d8d8d8", outline: "#3333cc", shadow: "#9999ff", transform: "scaleY(1.25)", fontWeight: 900 },
  six: { fill: "#ffffff", outline: "transparent", shadow: "#717171", texture: "linear-gradient(#adadad, #fff)", transform: "scaleX(0.85) translateZ(0)", fontWeight: 900, letterSpacing: ".25rem" },
  seven: { fill: "#0066cc", outline: "#99ccff", shadow: "#990000", transform: "scaleY(1.25)", fontFamily: "Impact, sans-serif" },
  eight: { fill: "#ff9a32", outline: "transparent", shadow: "#cdcdcd", texture: "radial-gradient(ellipse at center, #fff812, #ff9a32)", transform: "scaleY(1.25)", fontFamily: "Impact, sans-serif" },
  nine: { fill: "#cb00cc", outline: "#d2a2fe", shadow: "#adadff", texture: "linear-gradient(#6900cc, #cb00cc)", transform: "scale(0.9, 1.65) rotate(-3deg) skewY(-3deg) translateZ(0)", fontFamily: "Impact, sans-serif", fontWeight: 700 },
  ten: { fill: "#1a4b28", outline: "#008000", shadow: "#d2e5dc", transform: "scale(0.85, 1.25)", fontFamily: "Times New Roman, serif" },
  eleven: { fill: "#0b2be0", outline: "#eaeaea", shadow: "#cdcdcd", texture: "linear-gradient(to left, #a104ad, #0b2be0, #329941, #f7f658, #f16412, #e92153, #aa04a7)" },
  twelve: { fill: "#1b999c", outline: "transparent", shadow: "#cdcdcd", texture: "linear-gradient(#999cfc, #1b999c)", fontFamily: "Times New Roman, serif" },
  thirteen: { fill: "#896640", outline: "#1b0d00", shadow: "#1b0d00" },
  fourteen: { fill: "#ff9999", outline: "#002245", shadow: "#0050a0", texture: "linear-gradient(#fffecb, #ff9999)" },
  fifteen: { fill: "#fecb00", outline: "#b2b2b2", shadow: "#ab8d56", texture: "linear-gradient(#551700, #fecb00)" },
  sixteen: { fill: "#33ccff", outline: "#000099", shadow: "#000099" },
  seventeen: { fill: "#ffff00", outline: "#000000", shadow: "#999999", texture: "repeating-linear-gradient(180deg, #808080 0 3px, #ffff00 3px 6px)" },
  eighteen: { fill: "#ffffff", outline: "#4a4a4a", shadow: "#4a4a4a", texture: "linear-gradient(#b6b6b6 0%, #5f5f5f 20%, #fff 64%, #373737 66%, #d2d2d2)" },
  nineteen: { fill: "#0f3a1a", outline: "#005600", shadow: "#000800" },
  twenty: { fill: "#ffffff", outline: "transparent", shadow: "#72745b", texture: "linear-gradient(to left, #747474, #fff, #747474)" },
  twentyone: { fill: "#fe4201", outline: "#813300", shadow: "#c14d00", texture: "linear-gradient(to bottom left, #fee601, #fee601 15%, #fe4201)" },
  twentytwo: { fill: "#80302d", outline: "#000000", shadow: "#a1a1a1", texture: "linear-gradient(#ccdfec 0%, #7a97bc 20%, #8aacc6 30%, #fff 50%, #80302d 52%, #e7cfc9)" },
};

export const getWordArtPresetLabel = (preset: WordArtPreset) =>
  `WordArt ${String(WORD_ART_PRESETS.indexOf(preset) + 1).padStart(2, "0")}`;

export const isWordArtPreset = (value: string): value is WordArtPreset =>
  WORD_ART_PRESETS.includes(value as WordArtPreset);
