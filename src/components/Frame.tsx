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

/** Small mono section number, such as "[ 01 / 04 ]". */
export function SectionLabel({ index, total }: { index: number; total: number }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <p className="section-label">
      <span className="section-index">
        [ <b>{pad(index)}</b> / {pad(total)} ]
      </span>
    </p>
  );
}
