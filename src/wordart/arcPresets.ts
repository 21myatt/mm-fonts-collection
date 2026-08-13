import type { WordArtConfig } from "./types";

export type WordArtArcPreset = {
  id: string;
  label: string;
  patch: Partial<WordArtConfig>;
};

export const WORD_ART_ARC_PRESETS = [
  { id: "none", label: "None", patch: { arcEnabled: false } },
  {
    id: "arc",
    label: "Arc",
    patch: {
      arcEnabled: true,
      arcOrientation: "horizontal",
      arcAngle: 45,
      arcHorizontalDistortion: 0,
      arcVerticalDistortion: 0,
    },
  },
  {
    id: "arc-lower",
    label: "Arc Lower",
    patch: {
      arcEnabled: true,
      arcOrientation: "horizontal",
      arcAngle: 30,
      arcHorizontalDistortion: 0,
      arcVerticalDistortion: 0,
    },
  },
  {
    id: "arc-upper",
    label: "Arc Upper",
    patch: {
      arcEnabled: true,
      arcOrientation: "horizontal",
      arcAngle: 100,
      arcHorizontalDistortion: 0,
      arcVerticalDistortion: 0,
    },
  },
  {
    id: "arch",
    label: "Arch",
    patch: {
      arcEnabled: true,
      arcOrientation: "horizontal",
      arcAngle: 80,
      arcHorizontalDistortion: 0,
      arcVerticalDistortion: 0,
    },
  },
  {
    id: "bulge",
    label: "Bulge",
    patch: {
      arcEnabled: true,
      arcOrientation: "horizontal",
      arcAngle: 35,
      arcHorizontalDistortion: 0,
      arcVerticalDistortion: 35,
    },
  },
  {
    id: "squeeze",
    label: "Squeeze",
    patch: {
      arcEnabled: true,
      arcOrientation: "horizontal",
      arcAngle: 20,
      arcHorizontalDistortion: 0,
      arcVerticalDistortion: -35,
    },
  },
  {
    id: "flag",
    label: "Flag",
    patch: {
      arcEnabled: true,
      arcOrientation: "vertical",
      arcAngle: 45,
      arcHorizontalDistortion: 25,
      arcVerticalDistortion: 0,
    },
  },
  {
    id: "wave",
    label: "Wave",
    patch: {
      arcEnabled: true,
      arcOrientation: "vertical",
      arcAngle: -45,
      arcHorizontalDistortion: -25,
      arcVerticalDistortion: 0,
    },
  },
] as const satisfies readonly WordArtArcPreset[];

export const findWordArtArcPreset = (config: WordArtConfig) =>
  WORD_ART_ARC_PRESETS.find((preset) =>
    Object.entries(preset.patch).every(
      ([key, value]) => config[key as keyof WordArtConfig] === value,
    ),
  );
