import { findWordArtArcPreset, WORD_ART_ARC_PRESETS, type VisibleWordArtInspectorControl, type WordArtConfig, type WordArtPreset } from "../../wordart";

export type WordArtFontOption = { id: string; name: string };
export type WordArtConfigUpdate = <K extends keyof WordArtConfig>(key: K, value: WordArtConfig[K]) => void;

export type WordArtInspectorControlProps = {
  preset: WordArtPreset;
  config: WordArtConfig;
  update: WordArtConfigUpdate;
  text: string;
  setText: (value: string) => void;
  fonts: WordArtFontOption[];
  selectedFontId: string;
  setSelectedFontId: (value: string) => void;
  loading: boolean;
  copyCss: () => void;
  copyJson: () => void;
};

export function renderInspectorControl(control: VisibleWordArtInspectorControl, index: number, props: WordArtInspectorControlProps) {
  if (control.type === "textarea") {
    return <label key={control.type} className="word-art-select-control">{control.label}
      <textarea value={props.text} maxLength={30} onChange={(event) => props.setText(event.target.value)} aria-label="WordArt text" />
    </label>;
  }
  if (control.type === "font") {
    return <label key={control.type} className="word-art-select-control">{control.label}
      <select value={props.selectedFontId} onChange={(event) => props.setSelectedFontId(event.target.value)} aria-label="Burmese font" disabled={props.loading || !props.fonts.length}>
        {!props.fonts.length && <option>{props.loading ? "Loading Burmese fonts..." : "No Burmese fonts available"}</option>}
        {props.fonts.map((font) => <option key={font.id} value={font.id}>{font.name}</option>)}
      </select>
    </label>;
  }
  if (control.type === "arcPreset") {
    const selectedPreset = findWordArtArcPreset(props.config)?.id ?? "custom";
    return <label key={control.type} className="word-art-select-control">{control.label}
      <select value={selectedPreset} onChange={(event) => {
        const preset = WORD_ART_ARC_PRESETS.find((item) => item.id === event.target.value);
        if (!preset) return;
        for (const [key, value] of Object.entries(preset.patch)) {
          props.update(key as keyof WordArtConfig, value as never);
        }
      }}>
        {selectedPreset === "custom" && <option value="custom">Custom</option>}
        {WORD_ART_ARC_PRESETS.map((preset) => <option key={preset.id} value={preset.id}>{preset.label}</option>)}
      </select>
    </label>;
  }
  if (control.type === "select") {
    return <label key={String(control.key)} className="word-art-select-control">{control.label}
      <select value={String(props.config[control.key])} onChange={(event) => props.update(control.key, event.target.value as never)}>
        {control.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>;
  }
  if (control.type === "range") {
    const scale = control.scale ?? 1;
    const value = Number(props.config[control.key]) * scale;
    return <RangeControl key={String(control.key)} label={control.label} value={value} min={control.min} max={control.max} step={control.step} suffix={control.suffix} onChange={(next) => props.update(control.key, (next / scale) as never)} />;
  }
  if (control.type === "color") {
    return <ColorControl key={String(control.key)} label={control.label} value={String(props.config[control.key])} onChange={(next) => props.update(control.key, next as never)} />;
  }
  if (control.type === "toggle") {
    return <label key={String(control.key)} className="word-art-toggle"><input type="checkbox" checked={Boolean(props.config[control.key])} onChange={(event) => props.update(control.key, event.target.checked as never)} /> {control.label}</label>;
  }
  if (control.type === "row") {
    return <div key={`${control.type}-${index}`} className="word-art-swatch-row">{control.controls.filter((item) => !item.visible || item.visible({ preset: props.preset, config: props.config })).map((item) => renderInspectorControl(item, index, props))}</div>;
  }
  return <div key="actions" className="word-art-export-actions">
    <button type="button" onClick={props.copyCss}>Copy CSS</button>
    <button type="button" onClick={props.copyJson}>Copy JSON</button>
    <button type="button" onClick={() => location.assign(`./word-art?preset=${props.preset}`)}>Reset</button>
  </div>;
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="word-art-color-control">{label}<span><input type="color" value={value === "transparent" ? "#000000" : value} onChange={(event) => onChange(event.target.value)} /><code>{value}</code></span></label>; }

function RangeControl({ label, value, min, max, step = 1, suffix = "px", onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (value: number) => void }) {
  const update = (next: number) => {
    if (!Number.isFinite(next)) return;
    onChange(Math.min(max, Math.max(min, next)));
  };
  return <label className="word-art-range-control">
    <span>{label} <strong>{value}{suffix}</strong></span>
    <div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => update(event.currentTarget.valueAsNumber)} />
      <input type="number" min={min} max={max} step={step} value={value} onChange={(event) => update(event.currentTarget.valueAsNumber)} />
    </div>
  </label>;
}
