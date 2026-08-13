import { createWordArtStyle } from "./style";
import type { WordArtConfig, WordArtRenderInput } from "./types";

export const exportWordArtJson = (config: WordArtConfig) =>
  JSON.stringify(config, null, 2);

export const parseWordArtJson = (json: string) =>
  JSON.parse(json) as WordArtConfig;

export function exportWordArtCss(input: WordArtRenderInput) {
  const { textStyle, advancedStyle } = createWordArtStyle(input);
  const style = { ...textStyle, ...advancedStyle };
  return `.wordart .preview {\n${Object.entries(style)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `  ${key.startsWith("--") ? key : key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}: ${value};`)
    .join("\n")}\n}`;
}
