import { Menu, Search, Users, X } from "lucide-react";
import { cdnUrl } from "../lib/fonts";
import { useRouter } from "../router";

interface HeaderProps {
  search: string;
  setSearch: (value: string) => void;
  onFilters: () => void;
}

function Header({ search, setSearch, onFilters }: HeaderProps) {
  const { navigate } = useRouter();

  return (
    <header className="topbar">
      <button className="brand" onClick={() => navigate("/")}>
        <span>
          <strong>Burmese Text Engine</strong>
          <small>Open source fonts</small>
        </span>
      </button>
      <label className="search-box">
        <Search size={17} />
        <span className="sr-only">Search fonts</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search fonts or creators..."
        />
        {search && (
          <button onClick={() => setSearch("")} aria-label="Clear search">
            <X size={15} />
          </button>
        )}
      </label>
      <div className="header-actions">
        <button
          className="section-link"
          onClick={() => navigate("/open-source-fonts")}
        >
          Fonts
        </button>
        <button
          className="mobile-filter"
          onClick={onFilters}
          aria-label="Open filters"
        >
          <Menu size={20} />
        </button>
        <a
          href="https://github.com/21myatt/open-source-fonts"
          target="_blank"
          rel="noreferrer"
          aria-label="Open open-source-fonts on GitHub"
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

export default Header;
