import TextPngCanvas from "../components/TextPngCanvas";
import TextPngControls from "../components/TextPngControls";
import { useTextToPng } from "../hooks/useTextToPng";

function TextToPngPage() {
  const {
    canvasRef,
    options,
    setOptions,
    renderOptions,
    download,
    fonts,
    fontError,
    fontLoading,
    selectedFontId,
    setSelectedFontId,
  } = useTextToPng();

  return (
    <main className="text-png-page">
      <header>
        <p className="eyebrow">Text to PNG</p>
        <h1>Text to PNG</h1>
      </header>
      <div className="text-png-layout">
        <TextPngControls
          options={options}
          setOptions={setOptions}
          fonts={fonts}
          fontError={fontError}
          fontLoading={fontLoading}
          selectedFontId={selectedFontId}
          setSelectedFontId={setSelectedFontId}
          onDownload={download}
        />
        <TextPngCanvas canvasRef={canvasRef} options={renderOptions} />
      </div>
    </main>
  );
}

export default TextToPngPage;
