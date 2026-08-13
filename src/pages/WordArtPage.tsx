import { useState } from "react";
import WordArtMasterEditor from "../components/wordart/WordArtMasterEditor";
import WordArtPresetMode from "../components/wordart/WordArtPresetMode";
import { useWordArtEditor } from "../hooks/useWordArtEditor";
import { useWordArtFonts } from "../hooks/useWordArtFonts";
import { isWordArtPreset, type WordArtPreset } from "../wordart";

const initialPreset = (): WordArtPreset => {
  const preset = new URLSearchParams(window.location.search).get("preset");
  return preset && isWordArtPreset(preset) ? preset : "one";
};

function WordArtPage() {
  const mode = new URLSearchParams(window.location.search).get("mode");
  const [preset, setPreset] = useState<WordArtPreset>(() => initialPreset());
  const [text, setText] = useState("မင်္ဂလာပါ ခင်ဗျ");
  const { config, update } = useWordArtEditor(preset, mode === "presets");
  const { fonts, selectedFontId, setSelectedFontId, fontFamily, loading } = useWordArtFonts();

  if (mode === "presets") {
    return <WordArtPresetMode text={text} setText={setText} preset={preset} setPreset={setPreset} fonts={fonts} selectedFontId={selectedFontId} setSelectedFontId={setSelectedFontId} fontFamily={fontFamily} loading={loading} />;
  }

  return <WordArtMasterEditor preset={preset} text={text} setText={setText} config={config} update={update} fonts={fonts} selectedFontId={selectedFontId} setSelectedFontId={setSelectedFontId} fontFamily={fontFamily} loading={loading} />;
}

export default WordArtPage;
