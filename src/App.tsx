import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Grid2X2,
  Info,
  List,
  Menu,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import type { Catalog, FontEntry } from "./types";

const DEFAULT_TEXT =
  "သီဟိုဠ်မှ ဉာဏ်ကြီးရှင်သည် အာယုဝဍ္ဎနဆေးညွှန်းစာကို ဇလွန်ဈေးဘေး ဗာဒံပင်ထက် အဓိဋ္ဌာန်လျက် ဂဃနဏဖတ်ခဲ့သည်။";
const ALL = "all";
const CDN_BASE =
  "https://cdn.jsdelivr.net/gh/21myatt/mm-fonts-cdn@v1.0.1/dist/1.0.1";
const CDN_CSS_URL = `${CDN_BASE}/mmfonts.css`;

const cdnUrl = (path: string) =>
  `${CDN_BASE}/${path.split("/").map(encodeURIComponent).join("/")}`;
const fontUrl = (font: FontEntry) => cdnUrl(font.file.path);
const formatBytes = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [style, setStyle] = useState(ALL);
  const [author, setAuthor] = useState(ALL);
  const [showRisky, setShowRisky] = useState(false);
  const [previewText, setPreviewText] = useState(DEFAULT_TEXT);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.65);
  const [grid, setGrid] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detail, setDetail] = useState<FontEntry | null>(null);
  const [usageOpen, setUsageOpen] = useState(false);
  const [usageBanner, setUsageBanner] = useState(
    () => localStorage.getItem("hide-cdn-help") !== "true",
  );

  useEffect(() => {
    fetch(cdnUrl("catalog.json"))
      .then((response) => {
        if (!response.ok)
          throw new Error(`Catalog request failed (${response.status})`);
        return response.json() as Promise<Catalog>;
      })
      .then(setCatalog)
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const visibleBase = useMemo(
    () =>
      catalog?.fonts.filter(
        (font) => showRisky || font.riskFlags.length === 0,
      ) ?? [],
    [catalog, showRisky],
  );
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return visibleBase.filter(
      (font) =>
        (style === ALL || font.style === style) &&
        (author === ALL || font.author.key === author) &&
        (!needle ||
          `${font.name} ${font.author.name} ${font.style}`
            .toLowerCase()
            .includes(needle)),
    );
  }, [visibleBase, style, author, search]);

  const countBy = (predicate: (font: FontEntry) => boolean) =>
    visibleBase.filter(predicate).length;
  const reset = () => {
    setSearch("");
    setStyle(ALL);
    setAuthor(ALL);
    setShowRisky(false);
    setPreviewText(DEFAULT_TEXT);
    setFontSize(18);
    setLineHeight(1.65);
    setGrid(false);
  };

  if (error) return <ErrorState message={error} />;
  if (!catalog) return <LoadingState />;

  const activeFilters = [
    style !== ALL ? style : "",
    author !== ALL
      ? (catalog.authors.find((item) => item.key === author)?.title ?? author)
      : "",
  ].filter(Boolean);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#font-results">
        Skip to font results
      </a>
      <Header
        search={search}
        setSearch={setSearch}
        onFilters={() => setFiltersOpen(true)}
      />
      <div className="app-body">
        <Sidebar
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          catalog={catalog}
          fonts={visibleBase}
          style={style}
          setStyle={setStyle}
          author={author}
          setAuthor={setAuthor}
          showRisky={showRisky}
          setShowRisky={setShowRisky}
          countBy={countBy}
          reset={reset}
        />
        <main className="main-content" id="font-results">
          <PreviewToolbar
            text={previewText}
            setText={setPreviewText}
            fontSize={fontSize}
            setFontSize={setFontSize}
            lineHeight={lineHeight}
            setLineHeight={setLineHeight}
            grid={grid}
            setGrid={setGrid}
          />
          {usageBanner && (
            <UsageBanner
              onOpen={() => setUsageOpen(true)}
              onDismiss={() => {
                localStorage.setItem("hide-cdn-help", "true");
                setUsageBanner(false);
              }}
            />
          )}
          <section className="results-heading" aria-live="polite">
            <div>
              <p className="eyebrow">Font library</p>
              <h1>{search ? `Results for “${search}”` : "All Fonts"}</h1>
              {activeFilters.length > 0 && (
                <div className="filter-chips">
                  {activeFilters.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
            </div>
            <strong>
              {filtered.length} <span>fonts</span>
            </strong>
          </section>
          {filtered.length ? (
            <div className={grid ? "font-grid" : "font-list"}>
              {filtered.map((font) => (
                <FontCard
                  key={font.id}
                  font={font}
                  text={previewText || DEFAULT_TEXT}
                  size={fontSize}
                  lineHeight={lineHeight}
                  onDetail={setDetail}
                />
              ))}
            </div>
          ) : (
            <EmptyState onReset={reset} />
          )}
          <footer>
            <p>Build for You</p>
            <p>
              Based on the collection curated by{" "}
              <a href="https://github.com/saturngod">
                <strong>SaturnGod</strong>
              </a>
              , with additional sources credited per font.
            </p>
            <a href={cdnUrl("CREDITS.md")} target="_blank" rel="noreferrer">
              View complete credits <ExternalLink size={13} />
            </a>
          </footer>
        </main>
      </div>
      {detail && <DetailDrawer font={detail} onClose={() => setDetail(null)} />}
      {usageOpen && <UsageDrawer onClose={() => setUsageOpen(false)} />}
    </div>
  );
}

function Header({
  search,
  setSearch,
  onFilters,
}: {
  search: string;
  setSearch: (value: string) => void;
  onFilters: () => void;
}) {
  return (
    <header className="topbar">
      <div className="brand">
        <span>
          <strong>Myanmar Unicode</strong>
          <small>Font preview</small>
        </span>
      </div>
      <label className="search-box">
        <Search size={17} />
        <span className="sr-only">Search fonts</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search fonts or creators…"
        />
        {search && (
          <button onClick={() => setSearch("")} aria-label="Clear search">
            <X size={15} />
          </button>
        )}
      </label>
      <div className="header-actions">
        <button
          className="mobile-filter"
          onClick={onFilters}
          aria-label="Open filters"
        >
          <Menu size={20} />
        </button>
        <a
          href="https://github.com/21myatt/mm-fonts-collection"
          target="_blank"
          rel="noreferrer"
          aria-label="Open mm-fonts-collection on GitHub"
          title="GitHub"
        >
          <GitHubMark />
        </a>
        <a
          href={cdnUrl("CREDITS.md")}
          target="_blank"
          rel="noreferrer"
          aria-label="View font credits"
          title="Credits"
        >
          <Users size={19} />
        </a>
      </div>
    </header>
  );
}

function GitHubMark() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18A10.98 10.98 0 0 1 12 6.15c.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.82 1.19 3.08 0 4.42-2.71 5.38-5.29 5.67.42.36.79 1.07.79 2.16v3.24c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  catalog: Catalog;
  fonts: FontEntry[];
  style: string;
  setStyle: (value: string) => void;
  author: string;
  setAuthor: (value: string) => void;
  showRisky: boolean;
  setShowRisky: (value: boolean) => void;
  countBy: (predicate: (font: FontEntry) => boolean) => number;
  reset: () => void;
}

function Sidebar(props: SidebarProps) {
  const choose = (setter: (value: string) => void, value: string) => {
    setter(value);
    props.onClose();
  };
  return (
    <>
      <div
        className={`sidebar-backdrop ${props.open ? "visible" : ""}`}
        onClick={props.onClose}
      />
      <aside
        className={`sidebar ${props.open ? "open" : ""}`}
        aria-label="Font filters"
      >
        <div className="sidebar-mobile-title">
          <strong>Filters</strong>
          <button onClick={props.onClose} aria-label="Close filters">
            <X size={19} />
          </button>
        </div>
        <FilterGroup title="Style category">
          <FilterButton
            label="All Fonts"
            count={props.fonts.length}
            active={props.style === ALL}
            onClick={() => choose(props.setStyle, ALL)}
          />
          {props.catalog.styles.map((item) => (
            <FilterButton
              key={item}
              label={item}
              count={props.countBy((font) => font.style === item)}
              active={props.style === item}
              onClick={() => choose(props.setStyle, item)}
            />
          ))}
        </FilterGroup>
        <FilterGroup title="Source">
          <FilterButton
            label="All Sources"
            count={props.fonts.length}
            active={props.author === ALL}
            onClick={() => choose(props.setAuthor, ALL)}
          />
          {props.catalog.authors.map((item) => {
            const count = props.countBy((font) => font.author.key === item.key);
            return count ? (
              <FilterButton
                key={item.key}
                label={item.title}
                count={count}
                active={props.author === item.key}
                onClick={() => choose(props.setAuthor, item.key)}
              />
            ) : null;
          })}
        </FilterGroup>
        <label className="risk-toggle">
          <span>
            <AlertTriangle size={15} /> Include legacy/vendor-risk fonts
          </span>
          <input
            type="checkbox"
            checked={props.showRisky}
            onChange={(event) => props.setShowRisky(event.target.checked)}
          />
        </label>
        <button className="reset-button" onClick={props.reset}>
          <RotateCcw size={15} /> Reset to default
        </button>
      </aside>
    </>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="filter-group">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={active ? "filter-button active" : "filter-button"}
      onClick={onClick}
    >
      <span>{label}</span>
      <b>{count}</b>
    </button>
  );
}

interface PreviewProps {
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
}: PreviewProps) {
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

function UsageBanner({
  onOpen,
  onDismiss,
}: {
  onOpen: () => void;
  onDismiss: () => void;
}) {
  return (
    <section className="usage-banner" aria-label="CDN usage help">
      <div className="usage-banner-icon">
        <Code2 size={18} />
      </div>
      <div>
        <strong>Use these fonts on your website</strong>
        <p>Add one CDN stylesheet, then choose any font family.</p>
      </div>
      <button className="usage-open" onClick={onOpen}>
        How to use <span aria-hidden="true">→</span>
      </button>
      <button
        className="usage-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss CDN usage help"
      >
        <X size={16} />
      </button>
    </section>
  );
}

function UsageDrawer({ onClose }: { onClose: () => void }) {
  const linkSnippet = `<link rel="stylesheet" href="${CDN_CSS_URL}">`;
  const cssSnippet = `body {\n  font-family: "MyanmarAngoun-KhmerType", sans-serif;\n}`;
  useEffect(() => {
    const handler = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
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
            Use the copy button on any font card to get that font’s individual{" "}
            <code>@font-face</code> rule.
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

function DetailDrawer({
  font,
  onClose,
}: {
  font: FontEntry;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
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

function LoadingState() {
  return (
    <div className="state-page">
      <div className="loading-mark">မ</div>
      <h1>Loading font catalog</h1>
      <p>Connecting to the Myanmar Fonts CDN…</p>
    </div>
  );
}
function ErrorState({ message }: { message: string }) {
  return (
    <div className="state-page">
      <AlertTriangle size={32} />
      <h1>Couldn’t load the catalog</h1>
      <p>{message}</p>
      <button onClick={() => location.reload()}>Try again</button>
    </div>
  );
}
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="empty-state">
      <Search size={28} />
      <h2>No fonts match</h2>
      <p>Try a different search or clear the active filters.</p>
      <button onClick={onReset}>Reset filters</button>
    </div>
  );
}

export default App;
