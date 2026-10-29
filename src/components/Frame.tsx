import type { ReactNode } from "react";

/** A hairline box with small "+" registration marks at two corners. */
export function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`frame ${className}`}>
      <span className="frame-mark tl" aria-hidden="true" />
      <span className="frame-mark br" aria-hidden="true" />
      {children}
    </div>
  );
}

/** Small mono section label, such as "[ 01 / 04 ] · Work". */
export function SectionLabel({ index, total, children }: { index: number; total: number; children: ReactNode }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <p className="section-label">
      <span className="section-index">
        [ <b>{pad(index)}</b> / {pad(total)} ]
      </span>
      <span aria-hidden="true">·</span> {children}
    </p>
  );
}
