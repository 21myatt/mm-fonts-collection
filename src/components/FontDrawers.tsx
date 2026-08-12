import { useEffect, useState } from "react";
import { AlertTriangle, Check, Copy, Download, ExternalLink, X } from "lucide-react";
import { CDN_CSS_URL, fontUrl, formatBytes } from "../lib/fonts";
import type { FontEntry } from "../types";

export function UsageDrawer({ onClose }: { onClose: () => void }) {
  const linkSnippet = `<link rel="stylesheet" href="${CDN_CSS_URL}">`;
  const cssSnippet = `body {\n  font-family: "MyanmarAngoun-KhmerType", sans-serif;\n}`;

  useEscapeClose(onClose);

  return (
    <div
      className="drawer-layer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="usage-title"
    >
      <button
        className="drawer-backdrop"
        onClick={onClose}
        aria-label="Close usage guide"
      />
      <aside className="detail-drawer usage-drawer">
        <header>
          <div>
            <p className="eyebrow">Developer guide</p>
            <h2 id="usage-title">Use the font CDN</h2>
          </div>
          <button onClick={onClose} aria-label="Close usage guide">
            <X />
          </button>
        </header>
        <p className="usage-intro">
          Two steps are all you need. This URL is pinned to{" "}
          <strong>v1.0.1</strong>, so your site will not change unexpectedly.
        </p>
        <CodeStep number="1" title="Add the stylesheet" code={linkSnippet} />
        <CodeStep number="2" title="Choose a font family" code={cssSnippet} />
        <div className="usage-tip">
          <strong>Tip</strong>
          <p>
            Use the copy button on any font card to get that font&apos;s
            individual <code>@font-face</code> rule.
          </p>
        </div>
        <div className="drawer-links">
          <a
            href="https://github.com/21myatt/mm-fonts-cdn"
            target="_blank"
            rel="noreferrer"
          >
            Browse CDN source <ExternalLink size={14} />
          </a>
        </div>
      </aside>
    </div>
  );
}

export function DetailDrawer({
  font,
  onClose,
}: {
  font: FontEntry;
  onClose: () => void;
}) {
  useEscapeClose(onClose);

  return (
    <div
      className="drawer-layer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      <button
        className="drawer-backdrop"
        onClick={onClose}
        aria-label="Close details"
      />
      <aside className="detail-drawer">
        <header>
          <div>
            <p className="eyebrow">Font details</p>
            <h2 id="detail-title">{font.name}</h2>
          </div>
          <button onClick={onClose} aria-label="Close details">
            <X />
          </button>
        </header>
        <dl>
          <div>
            <dt>Source / creator</dt>
            <dd>{font.author.name}</dd>
          </div>
          <div>
            <dt>Style</dt>
            <dd>
              {font.style} · {font.fontStyle}
            </dd>
          </div>
          <div>
            <dt>File</dt>
            <dd>
              {font.file.name} · {formatBytes(font.file.bytes)}
            </dd>
          </div>
          <div>
            <dt>License</dt>
            <dd>
              <span
                className={
                  font.license.status.startsWith("verified")
                    ? "status-good"
                    : "status-neutral"
                }
              >
                {font.license.id ?? font.license.status}
              </span>
              <small>{font.license.note}</small>
            </dd>
          </div>
          <div>
            <dt>Encoding</dt>
            <dd>{font.encoding}</dd>
          </div>
          <div>
            <dt>SHA-256</dt>
            <dd>
              <code>{font.file.sha256}</code>
            </dd>
          </div>
        </dl>
        {font.riskFlags.length > 0 && (
          <div className="risk-notice">
            <AlertTriangle size={18} />
            <div>
              <strong>Review required</strong>
              <p>{font.riskFlags.join(", ")}</p>
            </div>
          </div>
        )}
        <div className="drawer-links">
          {font.author.sourceUrl && (
            <a href={font.author.sourceUrl} target="_blank" rel="noreferrer">
              Open source <ExternalLink size={14} />
            </a>
          )}
          {font.license.url && (
            <a href={font.license.url} target="_blank" rel="noreferrer">
              License information <ExternalLink size={14} />
            </a>
          )}
          <a href={fontUrl(font)} download={font.file.name}>
            Download font <Download size={14} />
          </a>
        </div>
      </aside>
    </div>
  );
}

function CodeStep({
  number,
  title,
  code,
}: {
  number: string;
  title: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="code-step">
      <div className="code-step-heading">
        <span>{number}</span>
        <h3>{title}</h3>
      </div>
      <div className="code-block">
        <pre>
          <code>{code}</code>
        </pre>
        <button onClick={copy} aria-label={`Copy ${title}`} title="Copy code">
          {copied ? (
            <>
              <Check size={14} /> Copied
            </>
          ) : (
            <>
              <Copy size={14} /> Copy
            </>
          )}
        </button>
      </div>
    </section>
  );
}

function useEscapeClose(onClose: () => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
}
