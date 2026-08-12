import { AlertTriangle, Search } from "lucide-react";

export function LoadingState() {
  return (
    <div className="state-page">
      <div className="loading-mark">မ</div>
      <h1>Loading font catalog</h1>
      <p>Connecting to the Myanmar Fonts CDN...</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="state-page">
      <AlertTriangle size={32} />
      <h1>Couldn&apos;t load the catalog</h1>
      <p>{message}</p>
      <button onClick={() => location.reload()}>Try again</button>
    </div>
  );
}

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="empty-state">
      <Search size={28} />
      <h2>No fonts match</h2>
      <p>Try a different search or clear the active filters.</p>
      <button onClick={onReset}>Reset filters</button>
    </div>
  );
}
