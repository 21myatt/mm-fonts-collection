import { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import FontCard from "../components/FontCard";
import { DetailDrawer, UsageDrawer } from "../components/FontDrawers";
import Header from "../components/Header";
import PreviewToolbar from "../components/PreviewToolbar";
import Sidebar from "../components/Sidebar";
import { EmptyState, ErrorState, LoadingState } from "../components/States";
import UsageBanner from "../components/UsageBanner";
import { ALL, DEFAULT_TEXT } from "../constants";
import { cdnUrl } from "../lib/fonts";
import type { Catalog, FontEntry } from "../types";

function OpenSourceFontsPage() {
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

export default OpenSourceFontsPage;
