import { useState } from "react";
import WordArtRenderer from "../components/WordArtRenderer";
import { useWordArtEditor } from "../hooks/useWordArtEditor";
import { useWordArtFonts } from "../hooks/useWordArtFonts";
import { WORD_ART_PRESETS, wordArtPresetLabel, type WordArtPreset } from "../lib/wordArtPresets";

function WordArtPage() {
  const [preset, setPreset] = useState<WordArtPreset>("one");
  const [text, setText] = useState("မင်္ဂလာပါ ခင်ဗျ");
  const { config, update } = useWordArtEditor(preset);
  const { fonts, selectedFontId, setSelectedFontId, fontFamily, loading } = useWordArtFonts();
  const control = (key: keyof typeof config) => (value: string | number | boolean) => update(key, value as never);
  const showMaterial = preset !== "one";
  return <main className="word-art-page word-art-workbench">
    <div className="word-art-body">
      <aside className="word-art-sidebar" aria-label="WordArt controls">
        <div className="word-art-sidebar-inner">
          <section className="word-art-panel">
            <label className="word-art-select-control">Preset
              <select value={preset} onChange={(event) => setPreset(event.target.value as WordArtPreset)} aria-label="WordArt style">
                {WORD_ART_PRESETS.map((item) => <option key={item} value={item}>{wordArtPresetLabel(item)}</option>)}
              </select>
            </label>
            <label className="word-art-select-control">Font style
              <select value={config.fontStyle} onChange={(event) => update("fontStyle", event.target.value as "normal" | "italic")}>
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
              </select>
            </label>
            <label className="word-art-select-control">Burmese font
              <select value={selectedFontId} onChange={(event) => setSelectedFontId(event.target.value)} aria-label="Burmese font" disabled={loading || !fonts.length}>
                {!fonts.length && <option>{loading ? "Loading Burmese fonts…" : "No Burmese fonts available"}</option>}
                {fonts.map((font) => <option key={font.id} value={font.id}>{font.name}</option>)}
              </select>
            </label>
            <label className="word-art-select-control">Text
              <textarea value={text} maxLength={30} onChange={(event) => setText(event.target.value)} aria-label="WordArt text" />
            </label>
          </section>

          <section className="word-art-panel">
            {showMaterial && <>
              <ColorControl label="Text color" value={config.fill} onChange={control("fill")} />
              <ColorControl label="Outline" value={config.outline} onChange={control("outline")} />
              <ColorControl label="Shadow" value={config.shadow} onChange={control("shadow")} />
            </>}
            {(preset === "two") && <RangeControl label="Rotation" value={config.rotation} min={-180} max={180} onChange={control("rotation")} />}
            {(preset === "three" || preset === "four") && <><RangeControl label="Shadow X" value={config.shadowX} min={-20} max={20} onChange={control("shadowX")} /><RangeControl label="Shadow Y" value={config.shadowY} min={-20} max={20} onChange={control("shadowY")} /></>}
            {(["six", "eight", "nine", "eleven", "twelve", "fourteen", "fifteen", "seventeen", "eighteen", "twenty", "twentyone", "twentytwo"] as WordArtPreset[]).includes(preset) && <>
              <label className="word-art-toggle"><input type="checkbox" checked={config.gradientEnabled} onChange={(event) => update("gradientEnabled", event.target.checked)} /> Gradient / texture</label>
              {config.gradientEnabled && (preset === "six" || preset === "eight") && <>
                <ColorControl label="Gradient start" value={config.gradientStart} onChange={control("gradientStart")} />
                <ColorControl label="Gradient end" value={config.gradientEnd} onChange={control("gradientEnd")} />
                <RangeControl label="Gradient angle" value={config.gradientAngle} min={0} max={360} onChange={control("gradientAngle")} />
              </>}
            </>}
          </section>

          <details className="word-art-advanced">
            <summary>Advanced</summary>
            <div>
              <RangeControl label="Font size" value={config.fontSize} min={0} max={240} onChange={control("fontSize")} />
              <RangeControl label="Font weight" value={config.fontWeight} min={0} max={900} onChange={control("fontWeight")} />
              <RangeControl label="Letter spacing" value={config.letterSpacing} min={-20} max={40} onChange={control("letterSpacing")} />
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
              <label className="word-art-toggle"><input type="checkbox" checked={config.arcEnabled} onChange={(event) => update("arcEnabled", event.target.checked)} /> Arc text</label>
              {config.arcEnabled && <>
                <RangeControl label="Arc radius" value={config.arcRadius} min={80} max={600} onChange={control("arcRadius")} />
                <RangeControl label="Arc angle" value={config.arcAngle} min={-180} max={180} onChange={control("arcAngle")} />
              </>}
              <button type="button" className="word-art-export" onClick={() => navigator.clipboard.writeText(`.wordart { font-family: ${fontFamily || "sans-serif"}; color: ${config.fill}; -webkit-text-stroke-color: ${config.outline}; text-shadow: ${config.shadowX}px ${config.shadowY}px ${config.shadowDepth}px ${config.shadow}; }`)}>Copy CSS</button>
            </div>
          </details>
        </div>
      </aside>

      <section className="word-art-canvas" aria-label="Live preview">
        <div className="word-art-canvas-shell">
          <div className="word-art-canvas-label">Live preview</div>
          <WordArtRenderer preset={preset} text={text} fontFamily={fontFamily} config={config} />
        </div>
      </section>
    </div>

    <footer className="word-art-footer">Credit <a href="https://codepen.io/kathykato" target="_blank" rel="noreferrer">Kathykato</a> for Word Art Effect</footer>
  </main>;
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="word-art-color-control">{label}<span><input type="color" value={value === "transparent" ? "#000000" : value} onChange={(event) => onChange(event.target.value)} /><code>{value}</code></span></label>; }
function RangeControl({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) { return <label className="word-art-range-control"><span>{label} <strong>{value}{label === "Rotation" ? "°" : "px"}</strong></span><input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>; }
export default WordArtPage;
