import { useEffect, useState } from "react";
import { AlertTriangle, Check, Copy, Download, Info } from "lucide-react";
import { fontUrl } from "../lib/fonts";
import type { FontEntry } from "../types";

function FontCard({
  font,
  text,
  size,
  lineHeight,
  onDetail,
}: {
  font: FontEntry;
  text: string;
  size: number;
  lineHeight: number;
  onDetail: (font: FontEntry) => void;
}) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "350px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  useEffect(() => {
    if (!ready) return;
    const id = `face-${font.id.replace(/[^a-z0-9]/gi, "-")}`;
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@font-face{font-family:"Preview-${font.id.replace(/[^a-z0-9]/gi, "-")}";src:local("${font.localName.replaceAll('"', '\\"')}"),url("${fontUrl(font)}") format("${font.file.format}");font-display:swap;font-weight:${/bold/i.test(font.fontStyle) ? 700 : /light/i.test(font.fontStyle) ? 300 : 400};}`;
    document.head.appendChild(style);
  }, [ready, font]);

  const family = `Preview-${font.id.replace(/[^a-z0-9]/gi, "-")}`;
  const css = `@font-face {\n  font-family: "${font.cssFamily}";\n  src: url("${fontUrl(font)}") format("${font.file.format}");\n  font-display: swap;\n}`;
  const copy = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className="font-card" ref={setElement}>
      <header>
        <div>
          <h2>{font.name}</h2>
          <p>
            {font.author.name} · {font.fontStyle}
          </p>
        </div>
        <div className="card-actions">
          <button
            onClick={copy}
            aria-label={`Copy CSS for ${font.name}`}
            title="Copy CSS"
          >
            {copied ? <Check size={17} /> : <Copy size={17} />}
          </button>
          <a
            href={fontUrl(font)}
            download={font.file.name}
            aria-label={`Download ${font.name}`}
            title="Download"
          >
            <Download size={17} />
          </a>
          <button
            onClick={() => onDetail(font)}
            aria-label={`View details for ${font.name}`}
            title="Details"
          >
            <Info size={17} />
          </button>
        </div>
      </header>
      <p
        className={ready ? "font-preview" : "font-preview loading"}
        style={
          ready
            ? {
                fontFamily: `"${family}", sans-serif`,
                fontSize: size,
                lineHeight,
              }
            : { fontSize: size, lineHeight }
        }
      >
        {text}
      </p>
      <div className="card-meta">
        <span>{font.style}</span>
        {font.license.status.startsWith("verified") && (
          <span className="verified">
            <Check size={11} /> Verified license
          </span>
        )}
        {font.riskFlags.length > 0 && (
          <span className="warning">
            <AlertTriangle size={11} /> Review required
          </span>
        )}
      </div>
    </article>
  );
}

export default FontCard;
