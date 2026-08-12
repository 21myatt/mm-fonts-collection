import type { CSSProperties } from "react";
import { WORD_ART_PRESET_STYLES, type WordArtPreset } from "../lib/wordArtPresets";

export interface WordArtStyleVars extends CSSProperties {
  "--wordart-fill": string;
  "--wordart-outline": string;
  "--wordart-outline-width": string;
  "--wordart-depth": string;
  "--wordart-shadow": string;
  "--wordart-angle": string;
  "--wordart-scale-y": string;
  "--wordart-gradient"?: string;
}

export default function WordArtPreview({
  text,
  preset,
  arc,
  style,
}: {
  text: string;
  preset: WordArtPreset;
  arc: boolean;
  style: WordArtStyleVars;
}) {
  const presetStyle = WORD_ART_PRESET_STYLES[preset];
  return (
    <section className="word-art-stage" aria-label="WordArt preview">
      <div className={arc ? "word-art-preview-wrap arc" : "word-art-preview-wrap"}>
        <section className={`style-${preset}`}>
          <div className="wordart wordart--configurable" style={{ transform: presetStyle.transform }}>
            <h1 className="preview" data-content={text} style={{
              ...style,
              fontFamily: presetStyle.fontFamily,
              fontWeight: presetStyle.fontWeight,
              fontStyle: presetStyle.fontStyle,
              letterSpacing: presetStyle.letterSpacing,
              ...(style["--wordart-gradient"] ? { background: style["--wordart-gradient"], WebkitTextFillColor: "transparent" } : {}),
            }}>{text}</h1>
          </div>
        </section>
      </div>
    </section>
  );
}
