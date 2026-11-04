import { useEffect, useRef, useState } from "react";
import type { CaseImage } from "../content/caseStudyTypes";

const url = (src: string) => (/^https?:/.test(src) || src.startsWith("/") ? src : `/${src}`);

/**
 * A responsive grid of captioned images. Tap an image to see it full size.
 * An image that fails to load is hidden, so a missing file never shows as broken.
 */
export function Gallery({ images }: { images: CaseImage[] }) {
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<number | null>(null);
  const shown = images.filter((img) => !failed.has(img.src));
  if (shown.length === 0) return null;

  return (
    <>
      <div className={`gallery ${shown.length === 1 ? "single" : ""} ${shown.every((i) => i.phone) ? "phones" : ""}`}>
        {shown.map((img, i) => (
          <figure key={img.src} className="gallery-item">
            <button
              type="button"
              className={`gallery-thumb ${img.diagram ? "on-white" : ""} ${img.phone ? "phone" : ""}`}
              onClick={() => setOpen(i)}
              aria-label={`View full size: ${img.alt}`}
            >
              <img
                src={url(img.src)}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                onError={() => setFailed((s) => new Set(s).add(img.src))}
              />
            </button>
            <figcaption>{img.caption}</figcaption>
          </figure>
        ))}
      </div>
      {open !== null && <Lightbox images={shown} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}

function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: CaseImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const img = images[index];
  const many = images.length > 1;
  const go = (step: number) => onIndex((index + step + images.length) % images.length);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={img.alt}
      onClose={onClose}
      onClick={(e) => {
        // A tap on the dark area outside the image closes the viewer.
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (!many) return;
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="lightbox-bar mono">
        <span className="dim">{many ? `${index + 1} / ${images.length}` : ""}</span>
        <span className="lightbox-actions">
          {many && (
            <>
              <button type="button" className="link-btn mono" onClick={() => go(-1)}>
                ← Previous
              </button>
              <button type="button" className="link-btn mono" onClick={() => go(1)}>
                Next →
              </button>
            </>
          )}
          <button type="button" className="link-btn mono" onClick={onClose} autoFocus>
            Close
          </button>
        </span>
      </div>
      <div className={`lightbox-image ${img.diagram ? "on-white" : ""} ${img.phone ? "phone" : ""}`}>
        <img src={url(img.src)} alt={img.alt} />
      </div>
      <p className="lightbox-caption">{img.caption}</p>
    </dialog>
  );
}
