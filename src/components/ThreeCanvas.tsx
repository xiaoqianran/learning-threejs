import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export type ThreeApi = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  canvas: HTMLCanvasElement;
};

type ThreeCanvasProps = {
  className?: string;
  /** Called once after WebGL context is ready. Return cleanup. */
  onReady: (api: ThreeApi) => void | (() => void);
  /** Per-frame hook (after your own logic if you drive from outside). */
  onFrame?: (api: ThreeApi, dt: number) => void;
  /** Disable internal rAF if parent drives rendering. */
  autoRender?: boolean;
};

/**
 * Client-only Three.js host. Handles resize, pixel ratio, dispose.
 */
export function ThreeCanvas({
  className,
  onReady,
  onFrame,
  autoRender = true,
}: ThreeCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    camera.position.set(2.5, 1.8, 3.5);
    camera.lookAt(0, 0.3, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    host.appendChild(renderer.domElement);

    const clock = new THREE.Clock();
    const api: ThreeApi = {
      scene,
      camera,
      renderer,
      clock,
      canvas: renderer.domElement,
    };

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let disposed = false;
    let raf = 0;
    const userCleanup = onReady(api);

    const tick = () => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      onFrame?.(api, dt);
      if (autoRender) {
        renderer.render(scene, camera);
      }
    };
    if (autoRender || onFrame) {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (typeof userCleanup === "function") userCleanup();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material;
        if (mat) {
          const list = Array.isArray(mat) ? mat : [mat];
          for (const m of list) {
            for (const key of Object.keys(m)) {
              const val = (m as unknown as Record<string, unknown>)[key];
              if (val && typeof val === "object" && "minFilter" in (val as object)) {
                (val as THREE.Texture).dispose();
              }
            }
            m.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once per host
  }, []);

  return (
    <div
      ref={hostRef}
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#0a0c10]",
        className,
      )}
    />
  );
}
