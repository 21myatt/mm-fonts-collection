import { Code2, X } from "lucide-react";

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
        How to use <span aria-hidden="true">-&gt;</span>
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

export default UsageBanner;
