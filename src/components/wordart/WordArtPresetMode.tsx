import WordArtRenderer from "../WordArtRenderer";
import { createWordArtConfig, exportWordArtCss, exportWordArtLayerStyleJson, getWordArtPresetLabel, WORD_ART_PRESETS, type WordArtPreset } from "../../wordart";
import type { WordArtFontOption } from "./WordArtInspectorControls";

type WordArtPresetModeProps = {
  text: string;
  setText: (value: string) => void;
  preset: WordArtPreset;
  setPreset: (value: WordArtPreset) => void;
  fonts: WordArtFontOption[];
  selectedFontId: string;
  setSelectedFontId: (value: string) => void;
  fontFamily: string;
  loading: boolean;
};

export default function WordArtPresetMode({ text, setText, preset, setPreset, fonts, selectedFontId, setSelectedFontId, fontFamily, loading }: WordArtPresetModeProps) {
  const selectedConfig = createWordArtConfig(preset);
  const copyCss = () => navigator.clipboard.writeText(exportWordArtCss({ preset, config: selectedConfig, fontFamily }));
  const copyJson = () => navigator.clipboard.writeText(exportWordArtLayerStyleJson(selectedConfig));

  return <main className="word-art-page word-art-presets-page">
    <div className="word-art-header">
      <div>
        <strong>WordArt Presets</strong>
        <span>{getWordArtPresetLabel(preset)} selected</span>
      </div>
      <a className="word-art-mode-link" href={`./word-art?preset=${preset}`}>Open master editor</a>
    </div>
    <div className="word-art-preset-toolbar">
      <label>Text <input value={text} maxLength={30} onChange={(event) => setText(event.target.value)} /></label>
      <label>Font <select value={selectedFontId} onChange={(event) => setSelectedFontId(event.target.value)} disabled={loading || !fonts.length}>
        {!fonts.length && <option>{loading ? "Loading Burmese fonts..." : "No Burmese fonts available"}</option>}
        {fonts.map((font) => <option key={font.id} value={font.id}>{font.name}</option>)}
      </select></label>
    </div>
    <section className="word-art-preset-grid" aria-label="WordArt presets">
      {WORD_ART_PRESETS.map((item) => {
        const selected = item === preset;
        return <button key={item} type="button" className={selected ? "word-art-preset-card selected" : "word-art-preset-card"} onClick={() => setPreset(item)} aria-pressed={selected}>
          <span>{getWordArtPresetLabel(item)}</span>
          <WordArtRenderer preset={item} text={text} fontFamily={fontFamily} config={{ ...createWordArtConfig(item), fontSize: 34 }} />
        </button>;
      })}
    </section>
    <div className="word-art-export-bar">
      <span>{getWordArtPresetLabel(preset)}</span>
      <button type="button" onClick={copyCss}>Copy CSS</button>
      <button type="button" onClick={copyJson}>Copy JSON</button>
    </div>
  </main>;
}
