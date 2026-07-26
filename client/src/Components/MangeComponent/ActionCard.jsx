import { Link } from "react-router-dom";
export default function ActionCard({ to, title, desc, icon, danger, note, onClick, cta = "מעבר לדף" }) {
  // An action is either navigation (Link) or a handler (button) — never both.
  const isAction = typeof onClick === "function";

  // <button> may not contain heading/paragraph elements, so the button
  // variant renders the same text as block-level spans instead.
  const TitleTag = isAction ? "span" : "h2";
  const DescTag = isAction ? "span" : "p";

  const className = `group flex cursor-pointer flex-col gap-4 rounded-card border bg-surface p-5 text-start shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-4 active:translate-y-0 sm:p-6 ${
    danger
      ? "border-danger/30 hover:border-danger focus-visible:border-danger focus-visible:ring-danger/25"
      : "border-border hover:border-primary/40 focus-visible:border-primary focus-visible:ring-primary/25"
  }`;

  const content = (
    <>
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-control transition-colors duration-200 ${
          danger
            ? "bg-danger-50 text-danger group-hover:bg-danger group-hover:text-white"
            : "bg-primary-50 text-primary group-hover:bg-primary group-hover:text-white"
        }`}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          {icon}
        </svg>
      </span>

      <span className="flex flex-1 flex-col gap-1.5">
        <TitleTag
          className={`block text-lg font-semibold tracking-tight transition-colors duration-200 ${
            danger
              ? "text-text-primary group-hover:text-danger"
              : "text-text-primary group-hover:text-primary"
          }`}
        >
          {title}
        </TitleTag>
        <DescTag className="block text-sm leading-relaxed text-text-muted">
          {desc}
        </DescTag>

        {note && (
          <span className="mt-1 inline-flex items-center gap-1.5 self-start rounded-full bg-danger-50 px-2.5 py-1 text-xs font-semibold text-danger">
            <svg
              className="h-3.5 w-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            {note}
          </span>
        )}
      </span>

      <span
        className={`mt-auto inline-flex h-11 items-center justify-center gap-1.5 rounded-control px-4 text-sm font-semibold transition-colors duration-200 ${
          danger
            ? "bg-danger-50 text-danger group-hover:bg-danger group-hover:text-white"
            : "bg-surface-muted text-text-secondary group-hover:bg-primary group-hover:text-white"
        }`}
      >
        {cta}
        <svg
          className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </span>
    </>
  );

  if (isAction) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link to={to} className={className}>
      {content}
    </Link>
  );
}
