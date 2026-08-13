import { type CSSProperties } from "react";
import {
  createWordArtStyle,
  type WordArtConfig,
  type WordArtPreset,
} from "../wordart";
import type { FontEntry } from "../types";
import WordArtArcCanvas from "./wordart/WordArtArcCanvas";

export default function WordArtRenderer({
  preset,
  text,
  fontFamily,
  fontEntry,
  config,
  plain = false,
}: {
  preset: WordArtPreset;
  text: string;
  fontFamily?: string;
  fontEntry?: FontEntry;
  config: WordArtConfig;
  plain?: boolean;
}) {
  const { textStyle, advancedStyle, sectionStyle, gradient } =
    createWordArtStyle({ preset, config, fontFamily });
  const sectionClassName = plain ? "word-art-plain" : `style-${preset}`;
  const previewClassName = [
    "preview",
    gradient ? "live-gradient" : "",
    config.outlineEnabled && config.outlinePaint === "gradient"
      ? "live-stroke-gradient"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (config.arcEnabled) {
    return (
      <div
        className="word-art-preview-stage word-art-arc-stage"
        style={
          {
            ["--wordart-arc-radius" as string]: `${config.arcRadius}px`,
            ["--wordart-arc-angle" as string]: `${config.arcAngle}deg`,
          } as CSSProperties
        }
      >
        <section
          className={sectionClassName}
          style={sectionStyle as CSSProperties | undefined}
        >
          <WordArtArcCanvas text={text} fontEntry={fontEntry} config={config} />
        </section>
      </div>
    );
  }

  return (
    <div className="word-art-preview-stage">
      <section
        className={sectionClassName}
        style={sectionStyle as CSSProperties | undefined}
      >
        <div className="wordart">
          <h1
            className={previewClassName}
            data-content={text}
            style={{ ...textStyle, ...advancedStyle } as CSSProperties}
          >
            {text}
          </h1>
        </div>
      </section>
    </div>
  );
}
