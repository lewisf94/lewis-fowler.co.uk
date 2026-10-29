import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import type { ModelDisplay } from "../content/types";

/** Runtime tuning for the viewer. Ported unchanged from the previous site. */
const VIEWER = {
  /** Auto-rotate angular velocity, rad/frame. */
  spinSpeed: 0.005,
  /** Lens radius in CSS px (scaled by devicePixelRatio for the shader). */
  lensRadius: 84,
  /** Width of the anti-aliased lens edge, CSS px. */
  lensEdge: 1.25,
  /** How fast the lens follows the cursor (0 to 1 per frame). */
  followLerp: 0.3,
  activateSpeed: 0.16,
  deactivateSpeed: 0.18,
} as const;

const TEXT = {
  loading: "Loading 3D model…",
  tapToLoad: "Tap to load 3D model",
  controlsOff: "3D controls: off",
  controlsOn: "3D controls: on",
};

interface Spotlight {
  center: THREE.Vector2;
  manualPx: THREE.Vector2;
  active: { value: number };
  cursorMode: boolean;
  radiusPx: { value: number };
  edgePx: { value: number };
  ring: HTMLDivElement;
}

type SpotlightMaterial = THREE.Material & { _spotlightInjected?: boolean };

export interface ModelViewerProps {
  path: string;
  /** Second model shown through a cursor "spotlight" in the shell. */
  revealPath?: string | null;
  /** Project-page mode: camera controls and the study scale. */
  withControls?: boolean;
  autoRotate?: boolean;
  display?: ModelDisplay;
  className?: string;
}

interface NetworkInformationLike {
  saveData?: boolean;
}

export function ModelViewer({
  path,
  revealPath = null,
  withControls = false,
  autoRotate = true,
  display = {},
  className = "",
}: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ setControls: (on: boolean) => void } | null>(null);
  const [loading, setLoading] = useState(true);
  // On touch devices camera controls are opt-in: TrackballControls sets
  // touch-action:none on the canvas, which would trap page scrolling.
  const [coarse] = useState(() => window.matchMedia("(pointer: coarse)").matches);
  const [controlsOn, setControlsOn] = useState(false);
  // Respect Data Saver: require a tap before fetching models.
  const [gated, setGated] = useState(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    return !!conn?.saveData;
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!path || !mount || gated) return;

    let disposed = false;
    let animId: number | null = null;
    let resizeObs: ResizeObserver | null = null;
    let started = false;
    let visible = false;
    let tickFn: (() => void) | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let controls: TrackballControls | null = null;
    let model: THREE.Group | null = null;
    let spotlight: Spotlight | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let onCanvasMove: ((e: MouseEvent) => void) | null = null;
    let onCanvasLeave: (() => void) | null = null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loadProgress: Record<string, number> = {};

    const startLoop = () => {
      if (!disposed && !animId && tickFn) animId = requestAnimationFrame(tickFn);
    };
    const stopLoop = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const reportProgress = (p: string, xhr: ProgressEvent) => {
      if (!xhr.total) return;
      loadProgress[p] = xhr.loaded / xhr.total;
      const sum = Object.values(loadProgress).reduce((a, b) => a + b, 0);
      const pct = Math.round((sum / (revealPath ? 2 : 1)) * 100);
      mount.dataset.loading = `${TEXT.loading} ${Math.min(pct, 99)}%`;
    };

    const init = () => {
      const w = mount.clientWidth || 400;
      const h = mount.clientHeight || 180;
      const CARD_SCALE = display.cardScale ?? 2.0;
      const STUDY_SCALE = display.studyScale ?? 1.8;
      const CARD_Y = display.cardY ?? 0;
      const STUDY_Y = display.studyY ?? 0;
      const CAMERA_Z = display.cameraZ ?? 3.2;
      const ROT_CENTER_Y = display.rotCenterY ?? 0;

      const sc = new THREE.Scene();
      scene = sc;
      const cam = new THREE.PerspectiveCamera(40, w / h, 0.1, 1000);
      cam.position.set(0, 0.4, CAMERA_Z);

      const r = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer = r;
      r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      r.setSize(w, h);
      r.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(r.domElement);
      const cv = r.domElement;
      canvas = cv;

      sc.add(new THREE.AmbientLight(0xffffff, 1.6));
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(4, 6, 5);
      sc.add(key);
      const fill = new THREE.DirectionalLight(0xffffff, 1.1);
      fill.position.set(-5, 3, 4);
      sc.add(fill);
      const back = new THREE.DirectionalLight(0xffffff, 0.9);
      back.position.set(0, -2, -5);
      sc.add(back);

      const makeControls = () => {
        if (controls) return;
        const c = new TrackballControls(cam, cv);
        c.rotateSpeed = 4.0;
        c.zoomSpeed = 1.2;
        c.panSpeed = 0.8;
        c.noPan = true;
        c.staticMoving = false;
        c.dynamicDampingFactor = 0.15;
        c.minDistance = 1.5;
        c.maxDistance = 8;
        controls = c;
      };
      const dropControls = () => {
        if (!controls) return;
        controls.dispose();
        controls = null;
        cv.style.touchAction = ""; // restore page scrolling over the canvas
      };
      apiRef.current = { setControls: (on) => (on ? makeControls() : dropControls()) };
      // Desktop: controls at once. Touch: wait for the opt-in toggle.
      if (withControls && !coarse) makeControls();

      const matSat = (mat: THREE.Material | undefined) => {
        const color = (mat as THREE.MeshStandardMaterial | undefined)?.color;
        if (!color) return -1;
        const max = Math.max(color.r, color.g, color.b);
        const min = Math.min(color.r, color.g, color.b);
        return max > 0.01 ? (max - min) / max : 0;
      };

      // CAD exports often give duplicate parts different (grey) materials.
      // Meshes with the same geometry signature share the most saturated one.
      const applyMaterialPairing = (root: THREE.Object3D) => {
        const groups = new Map<string, THREE.Mesh[]>();
        root.traverse((c) => {
          if (!(c as THREE.Mesh).isMesh) return;
          const mesh = c as THREE.Mesh;
          const vCount = mesh.geometry.attributes.position?.count ?? 0;
          if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
          const sz = new THREE.Vector3();
          mesh.geometry.boundingBox!.getSize(sz);
          const sig = `${vCount}|${Math.abs(sz.x).toFixed(2)}|${Math.abs(sz.y).toFixed(2)}|${Math.abs(sz.z).toFixed(2)}`;
          const list = groups.get(sig) ?? [];
          list.push(mesh);
          groups.set(sig, list);
        });
        groups.forEach((group) => {
          if (group.length < 2) return;
          let best: THREE.Material | null = null;
          let bestSat = -1;
          group.forEach((mesh) => {
            const m = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
            const s = matSat(m);
            if (s > bestSat) {
              bestSat = s;
              best = m;
            }
          });
          if (best && bestSat > 0.1) group.forEach((mesh) => (mesh.material = best!));
        });
      };

      const deg = Math.PI / 180;
      const orientAndPair = (m: THREE.Object3D) => {
        const baseQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
        const offQ = new THREE.Quaternion().setFromEuler(
          new THREE.Euler((display.orientX ?? 0) * deg, (display.orientY ?? 0) * deg, (display.orientZ ?? 0) * deg),
        );
        m.quaternion.multiplyQuaternions(baseQ, offQ);
        applyMaterialPairing(m);
      };

      // Scale and centre only; Y offsets go on the wrapper in finishWithGroup.
      const fitInsideUnit = (root: THREE.Object3D, targetSize: number) => {
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const scale = targetSize / (Math.max(size.x, size.y, size.z) || 1);
        root.scale.setScalar(scale);
        root.position.sub(center.multiplyScalar(scale));
        root.position.y -= ROT_CENTER_Y;
      };

      // The wrapper's origin sits at the bbox centre, so it spins about the centre.
      const finishWithGroup = (child: THREE.Object3D) => {
        const wrapper = new THREE.Group();
        wrapper.add(child);
        wrapper.position.y = withControls ? STUDY_Y : CARD_Y;
        sc.add(wrapper);
        model = wrapper;
        setLoading(false);
      };

      const injectSpotlight = (mat: SpotlightMaterial, sp: Spotlight) => {
        if (!mat || mat._spotlightInjected) return;
        mat._spotlightInjected = true;
        mat.transparent = true;
        const prev = mat.onBeforeCompile.bind(mat);
        mat.onBeforeCompile = (shader, rnd) => {
          prev(shader, rnd);
          shader.uniforms.uCenter = { value: sp.center };
          shader.uniforms.uActive = sp.active;
          shader.uniforms.uRadiusPx = sp.radiusPx;
          shader.uniforms.uEdgePx = sp.edgePx;
          shader.fragmentShader = shader.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
              uniform vec2 uCenter;
              uniform float uActive;
              uniform float uRadiusPx;
              uniform float uEdgePx;`,
            )
            .replace(
              "#include <dithering_fragment>",
              `#include <dithering_fragment>
              if (uActive > 0.001) {
                // A sharp-edged lens: the shell is cut away inside the circle.
                float rad = uRadiusPx * uActive;
                float d = distance(gl_FragCoord.xy, uCenter);
                gl_FragColor.a *= smoothstep(rad - uEdgePx, rad, d);
              }`,
            );
        };
        mat.needsUpdate = true;
      };

      const loadOne = (p: string) =>
        new Promise<THREE.Group>((resolve, reject) => {
          const loader = new GLTFLoader();
          loader.setMeshoptDecoder(MeshoptDecoder);
          loader.load(p, (gltf) => resolve(gltf.scene), (xhr) => reportProgress(p, xhr), reject);
        });

      const onFail = (err: unknown) => {
        console.warn("GLB load failed:", err);
        setLoading(false);
      };

      if (revealPath) {
        Promise.all([loadOne(path), loadOne(revealPath)])
          .then(([shell, inner]) => {
            if (disposed) return;
            orientAndPair(shell);
            orientAndPair(inner);
            const group = new THREE.Group();
            group.add(inner);
            group.add(shell);
            fitInsideUnit(group, withControls ? STUDY_SCALE : CARD_SCALE);

            const cx = cv.width * 0.5;
            const cy = cv.height * 0.5;
            // Thin outline drawn in HTML over the canvas, so it stays crisp.
            const ring = document.createElement("div");
            ring.className = "viewer-lens";
            ring.setAttribute("aria-hidden", "true");
            mount.appendChild(ring);
            const sp: Spotlight = {
              center: new THREE.Vector2(cx, cy),
              manualPx: new THREE.Vector2(cx, cy),
              active: { value: 0 },
              cursorMode: false,
              radiusPx: { value: VIEWER.lensRadius * r.getPixelRatio() },
              edgePx: { value: VIEWER.lensEdge * r.getPixelRatio() },
              ring,
            };
            spotlight = sp;
            shell.traverse((c) => {
              if (!(c as THREE.Mesh).isMesh) return;
              const m = (c as THREE.Mesh).material;
              (Array.isArray(m) ? m : [m]).forEach((mm) => injectSpotlight(mm, sp));
            });

            onCanvasMove = (e) => {
              const rect = cv.getBoundingClientRect();
              const pr = r.getPixelRatio();
              sp.manualPx.set((e.clientX - rect.left) * pr, (rect.height - (e.clientY - rect.top)) * pr);
              // Jump to the cursor on entry, so the lens does not slide in from the centre.
              if (!sp.cursorMode && sp.active.value < 0.02) sp.center.copy(sp.manualPx);
              sp.cursorMode = true;
            };
            onCanvasLeave = () => {
              sp.cursorMode = false;
            };
            cv.addEventListener("mousemove", onCanvasMove);
            cv.addEventListener("mouseleave", onCanvasLeave);
            finishWithGroup(group);
          })
          .catch(onFail);
      } else {
        loadOne(path)
          .then((m) => {
            if (disposed) return;
            orientAndPair(m);
            fitInsideUnit(m, withControls ? STUDY_SCALE : CARD_SCALE);
            finishWithGroup(m);
          })
          .catch(onFail);
      }

      resizeObs = new ResizeObserver(() => {
        const rw = mount.clientWidth;
        const rh = mount.clientHeight;
        r.setSize(rw, rh);
        cam.aspect = rw / rh;
        cam.updateProjectionMatrix();
        if (spotlight) {
          spotlight.radiusPx.value = VIEWER.lensRadius * r.getPixelRatio();
          spotlight.edgePx.value = VIEWER.lensEdge * r.getPixelRatio();
        }
      });
      resizeObs.observe(mount);

      const spinQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), VIEWER.spinSpeed);

      tickFn = () => {
        if (disposed) return;
        // Idle spin: card auto-rotate, or a touch project page with controls off.
        const idleSpin = autoRotate || (withControls && coarse && !controls);
        if (model && idleSpin && !reduceMotion) model.quaternion.premultiply(spinQ);
        if (spotlight) {
          const sp = spotlight;
          if (sp.cursorMode) {
            sp.center.lerp(sp.manualPx, VIEWER.followLerp);
            sp.active.value += (1 - sp.active.value) * VIEWER.activateSpeed;
          } else {
            sp.active.value += (0 - sp.active.value) * VIEWER.deactivateSpeed;
          }
          const pr = r.getPixelRatio();
          const rad = VIEWER.lensRadius * sp.active.value;
          const x = sp.center.x / pr;
          const y = cv.clientHeight - sp.center.y / pr;
          sp.ring.style.opacity = sp.active.value > 0.02 ? String(sp.active.value) : "0";
          sp.ring.style.width = sp.ring.style.height = `${rad * 2}px`;
          sp.ring.style.transform = `translate(${x - rad}px, ${y - rad}px)`;
        }
        controls?.update();
        r.render(sc, cam);
        animId = visible && tickFn ? requestAnimationFrame(tickFn) : null;
      };
      startLoop();
    };

    // Start only near the viewport; pause rendering while off-screen.
    // A tighter prefetch margin on touch devices saves mobile data.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible && !started) {
          started = true;
          init();
        } else if (started) {
          if (visible) startLoop();
          else stopLoop();
        }
      },
      { rootMargin: coarse ? "120px 0px" : "360px 0px" },
    );
    io.observe(mount);

    return () => {
      disposed = true;
      apiRef.current = null;
      io.disconnect();
      stopLoop();
      resizeObs?.disconnect();
      (controls as TrackballControls | null)?.dispose();
      if (canvas && onCanvasMove) canvas.removeEventListener("mousemove", onCanvasMove);
      if (canvas && onCanvasLeave) canvas.removeEventListener("mouseleave", onCanvasLeave);
      spotlight?.ring.remove();
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
      scene?.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        if (mesh.material) {
          (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => m.dispose());
        }
      });
    };
    // display is a stable object from the content files, so it is not a dependency.
  }, [path, revealPath, withControls, autoRotate, gated, coarse]);

  const toggleTouchControls = () => {
    const next = !controlsOn;
    setControlsOn(next);
    apiRef.current?.setControls(next);
  };

  const viewerH = withControls ? display.studyViewerH : display.cardViewerH;
  const classes = ["model-viewer", className, loading && !gated ? "is-loading" : ""].filter(Boolean).join(" ");
  return (
    <>
      <div ref={mountRef} data-loading={TEXT.loading} className={classes} style={viewerH ? { height: viewerH } : undefined} />
      {gated && (
        <button
          type="button"
          className="viewer-load-btn"
          onClick={(e) => {
            e.stopPropagation();
            setGated(false);
          }}
        >
          {TEXT.tapToLoad}
        </button>
      )}
      {withControls && coarse && !gated && (
        <button type="button" className={`viewer-toggle${controlsOn ? " is-on" : ""}`} onClick={toggleTouchControls}>
          {controlsOn ? TEXT.controlsOn : TEXT.controlsOff}
        </button>
      )}
    </>
  );
}
