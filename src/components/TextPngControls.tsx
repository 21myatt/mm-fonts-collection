import type { TextRenderOptions } from "../lib/textToPng";
import type { FontEntry } from "../types";

function TextPngControls({
  options,
  setOptions,
  fonts,
  fontError,
  fontLoading,
  selectedFontId,
  setSelectedFontId,
  onDownload,
}: {
  options: TextRenderOptions;
  setOptions: (options: TextRenderOptions) => void;
  fonts: FontEntry[];
  fontError: string;
  fontLoading: boolean;
  selectedFontId: string;
  setSelectedFontId: (fontId: string) => void;
  onDownload: () => void;
}) {
  const update = <Key extends keyof TextRenderOptions>(
    key: Key,
    value: TextRenderOptions[Key],
  ) => setOptions({ ...options, [key]: value });

  return (
    <section className="text-png-controls">
      <label>
        Text
        <textarea
          rows={8}
          value={options.text}
          onChange={(event) => update("text", event.target.value)}
        />
      </label>
      <div className="text-png-fields">
        <label>
          Font
          <select
            value={selectedFontId}
            onChange={(event) => setSelectedFontId(event.target.value)}
            disabled={fontLoading || !fonts.length}
          >
            {fonts.map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Font size
          <input
            type="number"
            min="12"
            max="240"
            value={options.fontSize}
            onChange={(event) => update("fontSize", Number(event.target.value))}
          />
        </label>
        <label>
          Text color
          <input
            type="color"
            value={options.textColor}
            onChange={(event) => update("textColor", event.target.value)}
          />
        </label>
        <label>
          Padding
          <input
            type="number"
            min="0"
            max="200"
            value={options.padding}
            onChange={(event) => update("padding", Number(event.target.value))}
          />
        </label>
      </div>
      {fontError && <p className="text-png-error">{fontError}</p>}
      <button onClick={onDownload}>Download PNG</button>
    </section>
  );
}

export default TextPngControls;
