import WordArtRenderer from "../WordArtRenderer";
import { exportWordArtCss, exportWordArtLayerStyleJson, type WordArtConfig, type WordArtPreset } from "../../wordart";
import WordArtInspector from "./WordArtInspector";
import type { WordArtConfigUpdate, WordArtFontOption } from "./WordArtInspectorControls";

type WordArtMasterEditorProps = {
  preset: WordArtPreset;
  text: string;
  setText: (value: string) => void;
  config: WordArtConfig;
  update: WordArtConfigUpdate;
  fonts: WordArtFontOption[];
  selectedFontId: string;
  setSelectedFontId: (value: string) => void;
  fontFamily: string;
  loading: boolean;
};

export default function WordArtMasterEditor({ preset, text, setText, config, update, fonts, selectedFontId, setSelectedFontId, fontFamily, loading }: WordArtMasterEditorProps) {
  const copyCss = () => navigator.clipboard.writeText(exportWordArtCss({ preset, config, fontFamily }));
  const copyJson = () => navigator.clipboard.writeText(exportWordArtLayerStyleJson(config));

  return <main className="word-art-page word-art-workbench">
    <div className="word-art-header">
      <a className="word-art-mode-link" href="./word-art?mode=presets">Back to presets</a>
    </div>
    <div className="word-art-body">
      <section className="word-art-canvas" aria-label="Live preview">
        <div className="word-art-canvas-shell">
          <WordArtRenderer preset={preset} text={text} fontFamily={fontFamily} config={config} plain />
        </div>
      </section>

      <WordArtInspector preset={preset} config={config} update={update} text={text} setText={setText} fonts={fonts} selectedFontId={selectedFontId} setSelectedFontId={setSelectedFontId} loading={loading} copyCss={copyCss} copyJson={copyJson} />
    </div>

    <footer className="word-art-footer">Credit <a href="https://codepen.io/kathykato" target="_blank" rel="noreferrer">Kathykato</a> for Word Art Effect</footer>
  </main>;
}
