import { useState } from "react";
import WordArtRenderer from "../components/WordArtRenderer";
import { useWordArtEditor } from "../hooks/useWordArtEditor";
import { useWordArtFonts } from "../hooks/useWordArtFonts";
import { createWordArtConfig, exportWordArtCss, exportWordArtJson, isWordArtPreset, WORD_ART_PRESETS, getWordArtPresetLabel, type WordArtPreset } from "../wordart";

const gradientPresets: WordArtPreset[] = ["six", "eight", "nine", "eleven", "twelve", "fourteen", "fifteen", "seventeen", "eighteen", "twenty", "twentyone", "twentytwo"];

const initialPreset = (): WordArtPreset => {
  const preset = new URLSearchParams(window.location.search).get("preset");
  return preset && isWordArtPreset(preset) ? preset : "one";
};

function WordArtPage() {
  const mode = new URLSearchParams(window.location.search).get("mode");
  const [preset, setPreset] = useState<WordArtPreset>(() => initialPreset());
  const [mobileTab, setMobileTab] = useState<"text" | "style" | "more">("text");
  const [text, setText] = useState("မင်္ဂလာပါ ခင်ဗျ");
  const { config, update } = useWordArtEditor(preset);
  const { fonts, selectedFontId, setSelectedFontId, fontFamily, loading } = useWordArtFonts();
  const control = (key: keyof typeof config) => (value: string | number | boolean) => update(key, value as never);
  const copyCss = () => navigator.clipboard.writeText(exportWordArtCss({ preset, config, fontFamily }));
  const copyJson = () => navigator.clipboard.writeText(exportWordArtJson(config));
  if (mode === "presets") return <WordArtPresetMode text={text} setText={setText} preset={preset} setPreset={setPreset} fonts={fonts} selectedFontId={selectedFontId} setSelectedFontId={setSelectedFontId} fontFamily={fontFamily} loading={loading} />;

  return <main className="word-art-page word-art-workbench">
    <div className="word-art-header">
      <a className="word-art-mode-link" href="./word-art?mode=presets">Back to presets</a>
    </div>
    <div className="word-art-body">
      <section className="word-art-canvas" aria-label="Live preview">
        <div className="word-art-canvas-shell">
          <WordArtRenderer preset={preset} text={text} fontFamily={fontFamily} config={config} />
        </div>
      </section>

      <aside className="word-art-sidebar" aria-label="WordArt controls">
        <div className="word-art-tabs" role="tablist" aria-label="WordArt control groups">
          <button type="button" className={mobileTab === "text" ? "active" : ""} onClick={() => setMobileTab("text")}>Text</button>
          <button type="button" className={mobileTab === "style" ? "active" : ""} onClick={() => setMobileTab("style")}>Style</button>
          <button type="button" className={mobileTab === "more" ? "active" : ""} onClick={() => setMobileTab("more")}>More</button>
        </div>
        <div className="word-art-sidebar-inner">
          <section className={`word-art-panel word-art-panel-text ${mobileTab === "text" ? "active" : ""}`}>
            <h2>Text</h2>
            <label className="word-art-select-control">Content
              <textarea value={text} maxLength={30} onChange={(event) => setText(event.target.value)} aria-label="WordArt text" />
            </label>
            <label className="word-art-select-control">Burmese font
              <select value={selectedFontId} onChange={(event) => setSelectedFontId(event.target.value)} aria-label="Burmese font" disabled={loading || !fonts.length}>
                {!fonts.length && <option>{loading ? "Loading Burmese fonts..." : "No Burmese fonts available"}</option>}
                {fonts.map((font) => <option key={font.id} value={font.id}>{font.name}</option>)}
              </select>
            </label>
            <label className="word-art-select-control">Font style
              <select value={config.fontStyle} onChange={(event) => update("fontStyle", event.target.value as "normal" | "italic")}>
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
              </select>
            </label>
            <RangeControl label="Font size" value={config.fontSize} min={0} max={240} onChange={control("fontSize")} />
            <RangeControl label="Font weight" value={config.fontWeight} min={0} max={900} onChange={control("fontWeight")} />
            <RangeControl label="Letter spacing" value={config.letterSpacing} min={-20} max={40} onChange={control("letterSpacing")} />
          </section>

          <section className={`word-art-panel word-art-panel-style ${mobileTab === "style" ? "active" : ""}`}>
            <h2>Material</h2>
            <div className="word-art-swatch-row">
            <ColorControl label="Text color" value={config.fill} onChange={control("fill")} />
            <ColorControl label="Outline" value={config.outline} onChange={control("outline")} />
            <ColorControl label="Shadow" value={config.shadow} onChange={control("shadow")} />
            </div>
            {(preset === "two") && <RangeControl label="Rotation" value={config.rotation} min={-180} max={180} onChange={control("rotation")} />}
            {(preset === "three" || preset === "four") && <><RangeControl label="Shadow X" value={config.shadowX} min={-20} max={20} onChange={control("shadowX")} /><RangeControl label="Shadow Y" value={config.shadowY} min={-20} max={20} onChange={control("shadowY")} /></>}
            {gradientPresets.includes(preset) && <>
              <label className="word-art-toggle"><input type="checkbox" checked={config.gradientEnabled} onChange={(event) => update("gradientEnabled", event.target.checked)} /> Gradient / texture</label>
              {config.gradientEnabled && <>
                <label className="word-art-toggle"><input type="checkbox" checked={config.gradientCustom} onChange={(event) => update("gradientCustom", event.target.checked)} /> Edit gradient colors</label>
                {config.gradientCustom && <>
                <ColorControl label="Gradient start" value={config.gradientStart} onChange={control("gradientStart")} />
                <ColorControl label="Gradient middle" value={config.gradientMiddle} onChange={control("gradientMiddle")} />
                <ColorControl label="Gradient end" value={config.gradientEnd} onChange={control("gradientEnd")} />
                <RangeControl label="Gradient angle" value={config.gradientAngle} min={0} max={360} onChange={control("gradientAngle")} />
                </>}
              </>}
            </>}
          </section>

          <details open className={`word-art-advanced word-art-panel-more ${mobileTab === "more" ? "active" : ""}`}>
            <summary>Advanced</summary>
            <div>
              <RangeControl label="Scale X" value={config.scaleX * 100} min={25} max={200} onChange={(value) => update("scaleX", value / 100)} />
              <RangeControl label="Scale Y" value={config.scaleY * 100} min={25} max={200} onChange={(value) => update("scaleY", value / 100)} />
              <RangeControl label="Skew X" value={config.skewX} min={-45} max={45} onChange={control("skewX")} />
              <RangeControl label="Skew Y" value={config.skewY} min={-45} max={45} onChange={control("skewY")} />
              <RangeControl label="Perspective" value={config.perspective} min={0} max={1000} onChange={control("perspective")} />
              <RangeControl label="Translate X" value={config.translateX} min={-200} max={200} onChange={control("translateX")} />
              <RangeControl label="Translate Y" value={config.translateY} min={-200} max={200} onChange={control("translateY")} />
              <RangeControl label="Rotate X" value={config.rotateX} min={-180} max={180} onChange={control("rotateX")} />
              <RangeControl label="Rotate Y" value={config.rotateY} min={-180} max={180} onChange={control("rotateY")} />
              <RangeControl label="Rotate Z" value={config.rotateZ} min={-180} max={180} onChange={control("rotateZ")} />
              <RangeControl label="Shadow depth" value={config.shadowDepth} min={0} max={30} onChange={control("shadowDepth")} />
              <RangeControl label="Shadow opacity" value={config.shadowOpacity * 100} min={0} max={100} onChange={(value) => update("shadowOpacity", value / 100)} />
              <RangeControl label="Texture size" value={config.textureSize} min={25} max={300} onChange={control("textureSize")} />
        <RangeControl label="Texture angle" value={config.textureAngle} min={0} max={100} onChange={control("textureAngle")} />
        <RangeControl label="Layer depth" value={config.layerDepth} min={0} max={30} onChange={control("layerDepth")} />
        <RangeControl label="Layer angle" value={config.layerAngle} min={-180} max={180} onChange={control("layerAngle")} />
        <RangeControl label="Bevel softness" value={config.bevel} min={0} max={12} onChange={control("bevel")} />
              <label className="word-art-toggle"><input type="checkbox" checked={config.arcEnabled} onChange={(event) => update("arcEnabled", event.target.checked)} /> Arc text</label>
              {config.arcEnabled && <>
                <RangeControl label="Arc radius" value={config.arcRadius} min={80} max={600} onChange={control("arcRadius")} />
                <RangeControl label="Arc angle" value={config.arcAngle} min={-180} max={180} onChange={control("arcAngle")} />
              </>}
            </div>
          </details>
          <section className="word-art-panel word-art-inspector-export">
            <h2>Export</h2>
            <div className="word-art-export-actions">
              <button type="button" onClick={copyCss}>Copy CSS</button>
              <button type="button" onClick={copyJson}>Copy JSON</button>
              <button type="button" onClick={() => location.assign(`./word-art?preset=${preset}`)}>Reset</button>
            </div>
          </section>
        </div>
      </aside>
    </div>

    <footer className="word-art-footer">Credit <a href="https://codepen.io/kathykato" target="_blank" rel="noreferrer">Kathykato</a> for Word Art Effect</footer>
  </main>;
}

function WordArtPresetMode({ text, setText, preset, setPreset, fonts, selectedFontId, setSelectedFontId, fontFamily, loading }: {
  text: string;
  setText: (value: string) => void;
  preset: WordArtPreset;
  setPreset: (value: WordArtPreset) => void;
  fonts: ReturnType<typeof useWordArtFonts>["fonts"];
  selectedFontId: string;
  setSelectedFontId: (value: string) => void;
  fontFamily: string;
  loading: boolean;
}) {
  const selectedConfig = createWordArtConfig(preset);
  const copyCss = () => navigator.clipboard.writeText(exportWordArtCss({ preset, config: selectedConfig, fontFamily }));
  const copyJson = () => navigator.clipboard.writeText(exportWordArtJson(selectedConfig));
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

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="word-art-color-control">{label}<span><input type="color" value={value === "transparent" ? "#000000" : value} onChange={(event) => onChange(event.target.value)} /><code>{value}</code></span></label>; }
function RangeControl({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) { return <label className="word-art-range-control"><span>{label} <strong>{value}{label === "Rotation" ? "°" : "px"}</strong></span><input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>; }
export default WordArtPage;
