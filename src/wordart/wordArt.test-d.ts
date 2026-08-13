import type { ComponentProps } from "react";
import WordArtRenderer from "../components/WordArtRenderer";
import type { FontEntry } from "../types";
import {
  type ArcCanvasLayout,
  type GlyphInkBounds,
  calculateGlyphInkBounds,
  createArcCanvasLayout,
  createWordArtConfig,
  createWordArtStyle,
  renderHarfBuzzArc,
} from ".";
import type { shapeWordArtText } from "./harfbuzz";
import type {
  WordArtConfig,
  WordArtPreset,
  WordArtRenderInput,
  WordArtStyleModel,
} from "./types";

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;
type Expect<T extends true> = T;

type WordArtRendererProps = ComponentProps<typeof WordArtRenderer>;

type _RendererPropsStayStable = Expect<
  Equal<
    WordArtRendererProps,
    {
      preset: WordArtPreset;
      text: string;
      fontFamily?: string;
      fontEntry?: FontEntry;
      config: WordArtConfig;
      plain?: boolean;
    }
  >
>;

type _ConfigFactoryReturnsFullConfig = Expect<
  Equal<ReturnType<typeof createWordArtConfig>, WordArtConfig>
>;

type _StyleFactoryAcceptsRenderInput = Expect<
  Equal<Parameters<typeof createWordArtStyle>[0], WordArtRenderInput>
>;

type _StyleFactoryReturnsStyleModel = Expect<
  Equal<ReturnType<typeof createWordArtStyle>, WordArtStyleModel>
>;

type _ArcRendererArgsStayReproducible = Expect<
  Equal<
    Parameters<typeof renderHarfBuzzArc>,
    [
      canvas: HTMLCanvasElement,
      text: string,
      fontEntry: FontEntry,
      config: WordArtConfig,
    ]
  >
>;

type _ArcLayoutArgsStayCanvasFree = Expect<
  Equal<
    Parameters<typeof createArcCanvasLayout>,
    [
      shaped: Awaited<ReturnType<typeof shapeWordArtText>>,
      config: WordArtConfig,
      fontSize: number,
    ]
  >
>;

type _ArcLayoutReturnsLayout = Expect<
  Equal<ReturnType<typeof createArcCanvasLayout>, ArcCanvasLayout>
>;

type _InkBoundsStayOptionalForEmptyGlyphs = Expect<
  Equal<ReturnType<typeof calculateGlyphInkBounds>, GlyphInkBounds | null>
>;
