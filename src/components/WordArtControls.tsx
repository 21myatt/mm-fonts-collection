import { WORD_ART_PRESETS, wordArtPresetLabel, type WordArtPreset } from "../lib/wordArtPresets";

export default function WordArtControls({
  text, setText, preset, setPreset, fill, setFill, outline, setOutline, shadow, setShadow,
  depth, setDepth, angle, setAngle, arc, setArc,
}: {
  text: string; setText: (value: string) => void;
  preset: WordArtPreset; setPreset: (value: WordArtPreset) => void;
  fill: string; setFill: (value: string) => void;
  outline: string; setOutline: (value: string) => void;
  shadow: string; setShadow: (value: string) => void;
  depth: number; setDepth: (value: number) => void;
  angle: number; setAngle: (value: number) => void;
  arc: boolean; setArc: (value: boolean) => void;
}) {
  return <aside className="word-art-controls">
    <div className="control-section"><label>Text<textarea value={text} maxLength={80} onChange={(event) => setText(event.target.value)} /></label></div>
    <div className="control-section">
      <label>Reference style<select value={preset} onChange={(event) => setPreset(event.target.value as WordArtPreset)}>{WORD_ART_PRESETS.map((item) => <option key={item} value={item}>{wordArtPresetLabel(item)}</option>)}</select></label>
      <div className="control-grid"><ColorControl label="Fill" value={fill} onChange={setFill} /><ColorControl label="Outline" value={outline} onChange={setOutline} /><ColorControl label="Shadow" value={shadow} onChange={setShadow} /></div>
    </div>
    <div className="control-section">
      <RangeControl label="Depth" value={depth} min={0} max={24} suffix="px" onChange={setDepth} />
      <RangeControl label="Angle" value={angle} min={-18} max={18} suffix="°" onChange={setAngle} />
      <label className="check-control"><input type="checkbox" checked={arc} onChange={(event) => setArc(event.target.checked)} /><span>Enable arc foundation</span></label>
    </div>
  </aside>;
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="color-control">{label}<span><input type="color" value={value} onChange={(event) => onChange(event.target.value)} /><code>{value}</code></span></label>;
}

function RangeControl({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  return <label className="range-control"><span>{label}<strong>{value}{suffix}</strong></span><input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}
