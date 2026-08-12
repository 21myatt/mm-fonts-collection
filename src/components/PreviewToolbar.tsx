import { useState } from "react";
import { ChevronDown, Grid2X2, List } from "lucide-react";

interface PreviewToolbarProps {
  text: string;
  setText: (value: string) => void;
  fontSize: number;
  setFontSize: (value: number) => void;
  lineHeight: number;
  setLineHeight: (value: number) => void;
  grid: boolean;
  setGrid: (value: boolean) => void;
}

function PreviewToolbar({
  text,
  setText,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  grid,
  setGrid,
}: PreviewToolbarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="preview-toolbar">
      <div className="preview-primary">
        <div>
          <p className="eyebrow">Preview text</p>
          <textarea
            rows={expanded ? 4 : 1}
            value={text}
            onChange={(event) => setText(event.target.value)}
            aria-label="Preview text"
          />
        </div>
        <button
          className="expand-button"
          onClick={() => setExpanded(!expanded)}
          aria-label={
            expanded ? "Collapse preview settings" : "Expand preview settings"
          }
        >
          <ChevronDown size={18} className={expanded ? "rotated" : ""} />
        </button>
      </div>
      <div
        className={expanded ? "preview-controls expanded" : "preview-controls"}
      >
        <label>
          Size <strong>{fontSize}px</strong>
          <input
            type="range"
            min="12"
            max="48"
            value={fontSize}
            onChange={(event) => setFontSize(Number(event.target.value))}
          />
        </label>
        <label>
          Line height <strong>{lineHeight.toFixed(1)}</strong>
          <input
            type="range"
            min="1"
            max="2.5"
            step="0.1"
            value={lineHeight}
            onChange={(event) => setLineHeight(Number(event.target.value))}
          />
        </label>
        <div className="view-toggle" aria-label="View mode">
          <button
            className={!grid ? "active" : ""}
            onClick={() => setGrid(false)}
            aria-label="List view"
          >
            <List size={17} />
          </button>
          <button
            className={grid ? "active" : ""}
            onClick={() => setGrid(true)}
            aria-label="Grid view"
          >
            <Grid2X2 size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default PreviewToolbar;
