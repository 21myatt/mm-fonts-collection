import { useState } from "react";
import {
  WORD_ART_PRESETS,
  wordArtPresetLabel,
  type WordArtPreset,
} from "../lib/wordArtPresets";
import { useWordArtFonts, wordArtFontFamily } from "../hooks/useWordArtFonts";

function WordArtPage() {
  const [preset, setPreset] = useState<WordArtPreset>("one");
  const [text, setText] = useState("မင်္ဂလာပါ ခင်ဗျ");
  const { fonts, selectedFontId, setSelectedFontId, fontFamily, loading } =
    useWordArtFonts();

  return (
    <main className="word-art-page">
      <section className={`style-${preset}`}>
        <div className="wordart">
          <h1
            className="preview"
            data-content={text}
            style={{ fontFamily: wordArtFontFamily(fontFamily) }}
          >
            {text}
          </h1>
        </div>
      </section>
      <section className="word-art-controls">
        <div className="container">
          <select
            value={preset}
            onChange={(event) => setPreset(event.target.value as WordArtPreset)}
            aria-label="WordArt style"
          >
            {WORD_ART_PRESETS.map((item) => (
              <option key={item} value={item}>
                {wordArtPresetLabel(item)}
              </option>
            ))}
          </select>
          <select
            value={selectedFontId}
            onChange={(event) => setSelectedFontId(event.target.value)}
            aria-label="Burmese font"
            disabled={loading || !fonts.length}
          >
            {!fonts.length && (
              <option>
                {loading
                  ? "Loading Burmese fonts…"
                  : "No Burmese fonts available"}
              </option>
            )}
            {fonts.map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </select>
          <textarea
            value={text}
            maxLength={30}
            onChange={(event) => setText(event.target.value)}
            aria-label="WordArt text"
          />
        </div>
      </section>
      <footer className="word-art-footer">
        Credit{" "}
        <a href="https://codepen.io/kathykato" target="_blank" rel="noreferrer">
          Kathykato
        </a>{" "}
        for Word Art Effect
      </footer>
    </main>
  );
}

export default WordArtPage;
