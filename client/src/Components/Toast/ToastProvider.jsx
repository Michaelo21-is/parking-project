import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ToastContext } from "./ToastContext";

/* ---------------------------------------------------------------------------
   Global toast system — "חניה טק"

   Usage from any component:
     import { useToast } from "../Components/Toast/ToastContext";
     const { toast } = useToast();
     toast.success("החניון נוסף בהצלחה");
     toast.error("הפעולה נכשלה", { description: "...", action: { label: "נסה שוב", onClick } });

   Layers: header 20 / dropdown 30 / Loading overlay 50 / toasts 60.
   Rendered through a portal on <body> so the sticky blurred headers
   (which create their own stacking contexts) can never clip a toast.
--------------------------------------------------------------------------- */

const MAX_VISIBLE = 3;
const ENTER_MS = 220;
const EXIT_MS = 140; // ~65% of enter — exits should feel quicker than entrances

const DURATION = {
  default: 4000,
  error: 6000,
  withAction: 8000,
};

const VARIANTS = {
  success: {
    // announced before the message so the type is not carried by color alone
    srPrefix: "הצלחה:",
    iconWrap: "bg-success-50 text-success",
    border: "border-success/25",
    bar: "bg-success",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12.75l2.25 2.25 4.5-5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  error: {
    srPrefix: "שגיאה:",
    iconWrap: "bg-danger-50 text-danger",
    border: "border-danger/25",
    bar: "bg-danger",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  info: {
    srPrefix: "לידיעתך:",
    iconWrap: "bg-primary-50 text-primary",
    border: "border-primary/25",
    bar: "bg-primary",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M11.25 11.25h.75v4.5h.75M12 8.25h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
};

function ToastItem({ data, onDismiss }) {
  const { id, variant, title, description, action, duration, leaving } = data;
  const config = VARIANTS[variant] ?? VARIANTS.info;

  const [entered, setEntered] = useState(false);
  const [paused, setPaused] = useState(false);

  const remainingRef = useRef(duration);
  const startedAtRef = useRef(0);
  const barRef = useRef(null);

  // Enter on the frame after mount so the browser has a "from" value to animate.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Auto-dismiss countdown. Pausing banks the time already spent, so a toast
  // the user is still reading never disappears out from under the cursor.
  useEffect(() => {
    if (paused || leaving) {
      return undefined;
    }

    startedAtRef.current = Date.now();
    const timer = setTimeout(() => onDismiss(id), remainingRef.current);

    return () => {
      clearTimeout(timer);
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startedAtRef.current)
      );
    };
  }, [paused, leaving, id, onDismiss]);

  // The progress bar mirrors that same countdown (transform only — no reflow).
  useEffect(() => {
    const bar = barRef.current;

    if (!bar || leaving) {
      return;
    }

    if (paused) {
      const current = getComputedStyle(bar).transform;
      const scale =
        current && current !== "none" ? new DOMMatrixReadOnly(current).a : 1;

      bar.style.transitionDuration = "0ms";
      bar.style.transform = `scaleX(${scale})`;
      return;
    }

    void bar.offsetWidth; // flush the frozen value before restarting the run
    bar.style.transitionDuration = `${remainingRef.current}ms`;
    bar.style.transform = "scaleX(0)";
  }, [paused, leaving]);

  const visible = entered && !leaving;

  return (
    <li
      dir="rtl"
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      style={{ transitionDuration: `${leaving ? EXIT_MS : ENTER_MS}ms` }}
      className={`pointer-events-auto relative w-full overflow-hidden rounded-card border bg-surface shadow-popover transition-all ease-out ${
        config.border
      } ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "-translate-y-3 scale-[0.97] opacity-0"
      }`}
    >
      <div className="flex items-start gap-3 p-3.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-control ${config.iconWrap}`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {config.icon}
          </svg>
        </span>

        <div className="min-w-0 flex-1 pt-1">
          <p className="text-sm font-semibold text-text-primary">
            <span className="sr-only">{config.srPrefix} </span>
            {title}
          </p>

          {description && (
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              {description}
            </p>
          )}

          {action && (
            <button
              type="button"
              onClick={() => {
                action.onClick?.();
                onDismiss(id);
              }}
              className="mt-2.5 inline-flex h-11 cursor-pointer touch-manipulation items-center justify-center rounded-control border border-border bg-surface px-3.5 text-sm font-semibold text-text-primary transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              {action.label}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(id)}
          aria-label="סגירת ההודעה"
          className="-my-1.5 -ms-1.5 -me-1.5 flex h-11 w-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-control text-text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <svg
            className="h-4.5 w-4.5"
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

      <span
        ref={barRef}
        aria-hidden="true"
        style={{ transform: "scaleX(1)" }}
        className={`absolute inset-x-0 bottom-0 h-0.5 origin-right transition-transform ease-linear motion-reduce:hidden ${config.bar}`}
      />
    </li>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const exitTimers = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
    exitTimers.current.delete(id);
  }, []);

  // Two-phase removal: flag it as leaving so the exit transition can play,
  // then drop it from state once the transition is over.
  const dismiss = useCallback(
    (id) => {
      if (exitTimers.current.has(id)) {
        return;
      }

      setToasts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, leaving: true } : item))
      );

      exitTimers.current.set(
        id,
        setTimeout(() => remove(id), EXIT_MS)
      );
    },
    [remove]
  );

  useEffect(() => {
    const timers = exitTimers.current;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const push = useCallback((variant, title, options = {}) => {
    const { description = "", action = null, duration } = options;
    const id = (idRef.current += 1);

    const resolvedDuration =
      duration ??
      (action
        ? DURATION.withAction
        : variant === "error"
        ? DURATION.error
        : DURATION.default);

    setToasts((prev) =>
      [
        {
          id,
          variant,
          title,
          description,
          action,
          duration: resolvedDuration,
          leaving: false,
        },
        ...prev,
      ].slice(0, MAX_VISIBLE)
    );

    return id;
  }, []);

  // Stable identity: pages that call useToast() never re-render when a toast
  // appears or disappears — only this provider does.
  const value = useMemo(
    () => ({
      toast: {
        success: (title, options) => push("success", title, options),
        error: (title, options) => push("error", title, options),
        info: (title, options) => push("info", title, options),
        dismiss,
      },
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {createPortal(
        <ol
          aria-label="הודעות מערכת"
          className="pointer-events-none fixed inset-x-0 top-0 z-[60] mx-auto flex w-full max-w-sm flex-col gap-2.5 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-[max(1.5rem,env(safe-area-inset-top))]"
        >
          {toasts.map((item) => (
            <ToastItem key={item.id} data={item} onDismiss={dismiss} />
          ))}
        </ol>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
