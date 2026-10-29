/** Small "opens elsewhere" arrow. An SVG, because the ↗ character shows as an emoji on some phones. */
export function OutArrow() {
  return (
    <svg className="out-arrow" viewBox="0 0 10 10" width="9" height="9" aria-hidden="true">
      <path d="M2 8 8 2M3.5 2H8v4.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
