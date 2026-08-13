import type { ReactNode } from "react";
import { wordArtInspectorGroups, type WordArtConfig, type WordArtPreset } from "../../wordart";
import { renderInspectorControl, type WordArtConfigUpdate, type WordArtFontOption } from "./WordArtInspectorControls";

type WordArtInspectorProps = {
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

export default function WordArtInspector(props: WordArtInspectorProps) {
  return <aside className="word-art-sidebar" aria-label="WordArt controls">
    <div className="word-art-sidebar-inner">
      {wordArtInspectorGroups.filter((group) => !group.visible || group.visible({ preset: props.preset, config: props.config })).map((group) => (
        <WordArtGroup key={group.title} title={group.title} open={group.open} className={group.title === "Export" ? "word-art-inspector-export" : ""}>
          <div>
            {group.controls
              .filter((item) => !item.visible || item.visible({ preset: props.preset, config: props.config }))
              .map((item, index) => renderInspectorControl(item, index, props))}
          </div>
        </WordArtGroup>
      ))}
    </div>
  </aside>;
}

function WordArtGroup({ title, open, className = "", children }: { title: string; open?: boolean; className?: string; children: ReactNode }) {
  return <details open={open} className={`word-art-group ${className}`}>
    <summary>{title}</summary>
    {children}
  </details>;
}
