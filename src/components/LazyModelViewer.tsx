import { lazy, Suspense } from "react";
import type { ModelViewerProps } from "./ModelViewer";

// three.js is most of the page weight, so it loads in its own file after the text.
const Viewer = lazy(() => import("./ModelViewer").then((m) => ({ default: m.ModelViewer })));

export function LazyModelViewer(props: ModelViewerProps) {
  return (
    <Suspense fallback={<div className={`model-viewer is-loading ${props.className ?? ""}`} data-loading="Loading 3D model…" />}>
      <Viewer {...props} />
    </Suspense>
  );
}
