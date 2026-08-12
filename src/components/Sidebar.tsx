import { AlertTriangle, RotateCcw, X } from "lucide-react";
import { ALL } from "../constants";
import type { Catalog, FontEntry } from "../types";

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

export default Sidebar;
