import type { WordArtConfig, WordArtPreset } from "./types";

export const gradientWordArtPresets: WordArtPreset[] = ["six", "eight", "nine", "eleven", "twelve", "fourteen", "fifteen", "seventeen", "eighteen", "twenty", "twentyone", "twentytwo"];

export type WordArtInspectorContext = { preset: WordArtPreset; config: WordArtConfig };
export type WordArtInspectorControl =
  | { type: "textarea"; label: string }
  | { type: "font"; label: string }
  | { type: "select"; key: keyof WordArtConfig; label: string; options: { label: string; value: string }[] }
  | { type: "range"; key: keyof WordArtConfig; label: string; min: number; max: number; step?: number; scale?: number; suffix?: string }
  | { type: "color"; key: keyof WordArtConfig; label: string }
  | { type: "toggle"; key: keyof WordArtConfig; label: string }
  | { type: "row"; controls: (Extract<WordArtInspectorControl, { type: "color" }> & { visible?: (context: WordArtInspectorContext) => boolean })[] }
  | { type: "actions" };

export type VisibleWordArtInspectorControl = WordArtInspectorControl & { visible?: (context: WordArtInspectorContext) => boolean };

export const wordArtInspectorGroups: { title: string; open?: boolean; visible?: (context: WordArtInspectorContext) => boolean; controls: VisibleWordArtInspectorControl[] }[] = [
  { title: "Text", open: true, controls: [
    { type: "textarea", label: "Content" },
  ] },
  { title: "Typography", open: true, controls: [
    { type: "font", label: "Burmese font" },
    { type: "select", key: "fontStyle", label: "Font style", options: [{ label: "Normal", value: "normal" }, { label: "Italic", value: "italic" }] },
    { type: "range", key: "fontSize", label: "Font size", min: 0, max: 240, suffix: "px" },
    { type: "range", key: "fontWeight", label: "Font weight", min: 0, max: 900, suffix: "" },
    { type: "range", key: "letterSpacing", label: "Letter spacing", min: -20, max: 40, suffix: "px" },
  ] },
  { title: "Fill", open: true, controls: [
    { type: "toggle", key: "fillEnabled", label: "Fill" },
    { type: "color", key: "fill", label: "Color", visible: ({ config }) => config.fillEnabled },
    { type: "range", key: "fillOpacity", label: "Opacity", min: 0, max: 100, scale: 100, suffix: "%", visible: ({ config }) => config.fillEnabled },
  ] },
  { title: "Stroke", open: true, controls: [
    { type: "toggle", key: "outlineEnabled", label: "Stroke" },
    { type: "color", key: "outline", label: "Color", visible: ({ config }) => config.outlineEnabled },
    { type: "range", key: "outlineWidth", label: "Weight", min: 0, max: 24, step: 0.1, suffix: "px", visible: ({ config }) => config.outlineEnabled },
    { type: "range", key: "outlineOpacity", label: "Opacity", min: 0, max: 100, scale: 100, suffix: "%", visible: ({ config }) => config.outlineEnabled },
  ] },
  { title: "Drop Shadow", controls: [
    { type: "toggle", key: "shadowEnabled", label: "Drop Shadow" },
    { type: "color", key: "shadow", label: "Color", visible: ({ config }) => config.shadowEnabled },
    { type: "range", key: "shadowX", label: "Shadow X", min: -20, max: 20, suffix: "px", visible: ({ config }) => config.shadowEnabled },
    { type: "range", key: "shadowY", label: "Shadow Y", min: -20, max: 20, suffix: "px", visible: ({ config }) => config.shadowEnabled },
    { type: "range", key: "shadowDepth", label: "Blur", min: 0, max: 30, suffix: "px", visible: ({ config }) => config.shadowEnabled },
    { type: "range", key: "shadowOpacity", label: "Opacity", min: 0, max: 100, scale: 100, suffix: "%", visible: ({ config }) => config.shadowEnabled },
  ] },
  { title: "Transform", controls: [
    { type: "range", key: "scaleX", label: "Scale X", min: 25, max: 200, scale: 100, suffix: "%" },
    { type: "range", key: "scaleY", label: "Scale Y", min: 25, max: 200, scale: 100, suffix: "%" },
    { type: "range", key: "skewX", label: "Skew X", min: -45, max: 45, suffix: "deg" },
    { type: "range", key: "skewY", label: "Skew Y", min: -45, max: 45, suffix: "deg" },
    { type: "range", key: "translateX", label: "Translate X", min: -200, max: 200, suffix: "px" },
    { type: "range", key: "translateY", label: "Translate Y", min: -200, max: 200, suffix: "px" },
    { type: "range", key: "rotateX", label: "Rotate X", min: -180, max: 180, suffix: "deg" },
    { type: "range", key: "rotateY", label: "Rotate Y", min: -180, max: 180, suffix: "deg" },
    { type: "range", key: "rotateZ", label: "Rotate Z", min: -180, max: 180, suffix: "deg" },
    { type: "range", key: "perspective", label: "Perspective", min: 0, max: 1000, suffix: "px" },
  ] },
  { title: "Depth", controls: [
    { type: "toggle", key: "depthEnabled", label: "Depth" },
    { type: "color", key: "depthColor", label: "Color", visible: ({ config }) => config.depthEnabled },
    { type: "range", key: "layerDepth", label: "Size", min: 0, max: 100, suffix: "px", visible: ({ config }) => config.depthEnabled },
    { type: "range", key: "layerAngle", label: "Angle", min: -180, max: 180, suffix: "deg", visible: ({ config }) => config.depthEnabled },
    { type: "range", key: "bevel", label: "Softness", min: 0, max: 12, suffix: "px", visible: ({ config }) => config.depthEnabled },
  ] },
  { title: "Gradient", visible: ({ preset }) => gradientWordArtPresets.includes(preset), controls: [
    { type: "toggle", key: "gradientEnabled", label: "Gradient / texture" },
    { type: "toggle", key: "gradientCustom", label: "Edit gradient colors", visible: ({ config }) => config.gradientEnabled },
    { type: "color", key: "gradientStart", label: "Gradient start", visible: ({ config }) => config.gradientEnabled && config.gradientCustom },
    { type: "color", key: "gradientMiddle", label: "Gradient middle", visible: ({ config }) => config.gradientEnabled && config.gradientCustom },
    { type: "color", key: "gradientEnd", label: "Gradient end", visible: ({ config }) => config.gradientEnabled && config.gradientCustom },
    { type: "range", key: "gradientAngle", label: "Gradient angle", min: 0, max: 360, suffix: "deg", visible: ({ config }) => config.gradientEnabled && config.gradientCustom },
    { type: "range", key: "textureSize", label: "Texture size", min: 25, max: 300, suffix: "%" },
    { type: "range", key: "textureAngle", label: "Texture angle", min: 0, max: 100, suffix: "%" },
  ] },
  { title: "Arc", controls: [
    { type: "toggle", key: "arcEnabled", label: "Arc text" },
    { type: "range", key: "arcRadius", label: "Arc radius", min: 80, max: 600, suffix: "px", visible: ({ config }) => config.arcEnabled },
    { type: "range", key: "arcAngle", label: "Arc angle", min: -180, max: 180, suffix: "deg", visible: ({ config }) => config.arcEnabled },
  ] },
  { title: "Export", open: true, controls: [{ type: "actions" }] },
];
