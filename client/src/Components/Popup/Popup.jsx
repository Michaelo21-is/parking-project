import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Reusable dialog for the "חניה טק" system.
 * Bottom sheet on phones, centered card from sm: upwards.
 *
 * Sits at z-50 — above the sticky header (z-20) and dropdowns (z-30),
 * below the toasts (z-60) so feedback stays visible over an open dialog.
 */
export default function Popup({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  closeLabel = "סגירה",
}) {
  const panelRef = useRef(null);
  const titleId = useId();
  const subtitleId = useId();

  // Escape closes, Tab stays inside the dialog, focus returns to the trigger.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // The page behind must not scroll while the dialog is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
    >
      <div
        className="absolute inset-0 animate-scrim-in bg-text-primary/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subtitleId : undefined}
        tabIndex={-1}
        className="relative flex max-h-[88dvh] w-full animate-sheet-in flex-col overflow-hidden rounded-t-card border border-border bg-surface shadow-popover outline-none pb-[max(0px,env(safe-area-inset-bottom))] sm:max-h-[85dvh] sm:max-w-lg sm:animate-panel-in sm:rounded-card sm:pb-0"
      >
        {/* Grab handle — the sheet affordance on touch screens */}
        <span
          className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-border-strong sm:hidden"
          aria-hidden="true"
        />

        <div className="flex items-start gap-3 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
          {icon && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-primary-50 text-primary">
              <svg
                className="h-5.5 w-5.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {icon}
              </svg>
            </span>
          )}

          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="text-lg font-bold tracking-tight text-text-primary sm:text-xl"
            >
              {title}
            </h2>
            {subtitle && (
              <p id={subtitleId} className="mt-0.5 text-sm text-text-muted">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-me-1.5 -mt-1 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-control text-text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-text-primary"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

        <div className="border-t border-border bg-canvas px-5 py-4 sm:px-6">
          {footer ?? (
            <button
              type="button"
              onClick={onClose}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-control bg-primary px-4 text-base font-semibold text-on-primary shadow-card transition-all duration-200 hover:bg-primary-700 hover:shadow-card-hover active:scale-[0.99]"
            >
              {closeLabel}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
