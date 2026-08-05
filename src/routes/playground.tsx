import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Code2, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PlaygroundSearch = {
  example?: string;
};

export const Route = createFileRoute("/playground")({
  validateSearch: (search: Record<string, unknown>): PlaygroundSearch => ({
    example:
      typeof search.example === "string" && search.example.length > 0
        ? search.example
        : undefined,
  }),
  component: PlaygroundPage,
});

const PRESETS: { id: string; title: string; code: string }[] = [
  {
    id: "cube",
    title: "旋转立方体",
    code: `// api: scene, camera, renderer, THREE, OrbitControls
// 可 return (dt) => { ... } 作为每帧回调
scene.background = new THREE.Color(0x0a0c10)
camera.position.set(2.5, 1.8, 3)

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial(),
)
scene.add(mesh)
scene.add(new THREE.AmbientLight(0xffffff, 0.6))

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

return (dt) => {
  mesh.rotation.x += dt * 0.6
  mesh.rotation.y += dt * 0.9
  controls.update()
}`,
  },
  {
    id: "sphere-light",
    title: "金属球 + 灯光",
    code: `scene.background = new THREE.Color(0x0a0c10)
camera.position.set(3, 2, 4)

const mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.9, 48, 48),
  new THREE.MeshStandardMaterial({
    color: 0x049ef4,
    metalness: 0.7,
    roughness: 0.2,
  }),
)
scene.add(mesh)
scene.add(new THREE.AmbientLight(0xffffff, 0.25))
const key = new THREE.DirectionalLight(0xffffff, 1.4)
key.position.set(4, 3, 2)
scene.add(key)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

return (dt) => {
  mesh.rotation.y += dt * 0.4
  controls.update()
}`,
  },
  {
    id: "particles",
    title: "粒子星空",
    code: `scene.background = new THREE.Color(0x05070c)
camera.position.set(0, 0, 5)

const count = 2000
const pos = new Float32Array(count * 3)
for (let i = 0; i < count; i++) {
  pos[i*3] = (Math.random()-0.5)*10
  pos[i*3+1] = (Math.random()-0.5)*10
  pos[i*3+2] = (Math.random()-0.5)*10
}
const geo = new THREE.BufferGeometry()
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
const points = new THREE.Points(
  geo,
  new THREE.PointsMaterial({ size: 0.04, color: 0x88ccff }),
)
scene.add(points)

return (dt) => {
  points.rotation.y += dt * 0.08
}`,
  },
  {
    id: "fog",
    title: "雾中方阵",
    code: `const bg = 0x0a0c10
scene.background = new THREE.Color(bg)
scene.fog = new THREE.Fog(bg, 3, 14)
camera.position.set(0, 2.5, 8)
scene.add(new THREE.AmbientLight(0xffffff, 0.4))
const d = new THREE.DirectionalLight(0xffffff, 1)
d.position.set(3, 5, 2)
scene.add(d)
for (let i = 0; i < 16; i++) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x049ef4 }),
  )
  m.position.set((i % 4) * 1.4 - 2.1, 0.35, -Math.floor(i / 4) * 1.6)
  scene.add(m)
}
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
return () => controls.update()`,
  },
  {
    id: "instances",
    title: "InstancedMesh",
    code: `scene.background = new THREE.Color(0x0a0c10)
camera.position.set(0, 5, 9)
const count = 300
const mesh = new THREE.InstancedMesh(
  new THREE.BoxGeometry(0.3, 0.3, 0.3),
  new THREE.MeshStandardMaterial({ color: 0x6e63ff }),
  count,
)
const dummy = new THREE.Object3D()
for (let i = 0; i < count; i++) {
  dummy.position.set((i % 15) - 7, 0, Math.floor(i / 15) - 10)
  dummy.position.y = Math.sin(i * 0.3) * 0.4
  dummy.updateMatrix()
  mesh.setMatrixAt(i, dummy.matrix)
}
scene.add(mesh)
scene.add(new THREE.AmbientLight(0xffffff, 0.5))
const d = new THREE.DirectionalLight(0xffffff, 1)
d.position.set(4, 6, 2)
scene.add(d)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
return (dt) => {
  mesh.rotation.y += dt * 0.2
  controls.update()
}`,
  },
];

function PlaygroundPage() {
  const { example } = Route.useSearch();
  const initial = PRESETS.find((p) => p.id === example) ?? PRESETS[0]!;
  const [activeId, setActiveId] = useState(initial.id);
  const [code, setCode] = useState(initial.code);
  const [error, setError] = useState<string | null>(null);
  const [runKey, setRunKey] = useState(0);

  const preset = useMemo(
    () => PRESETS.find((p) => p.id === activeId) ?? PRESETS[0]!,
    [activeId],
  );

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <header className="mb-5">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Code2 className="h-3.5 w-3.5" />
          代码沙盒
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Three.js Playground
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          在浏览器里直接写 Three.js。可选预设，改代码后点「运行」。返回的函数会每帧调用。
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setActiveId(p.id);
              setCode(p.code);
              setError(null);
              setRunKey((k) => k + 1);
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              activeId === p.id
                ? "bg-primary text-primary-fg"
                : "bg-surface-3 text-muted hover:text-fg",
            )}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-code-bg">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="font-mono text-[10px] uppercase text-subtle">
              setup.js · {preset.title}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setCode(preset.code);
                  setError(null);
                  setRunKey((k) => k + 1);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                重置
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setError(null);
                  setRunKey((k) => k + 1);
                }}
              >
                <Play className="h-3.5 w-3.5" />
                运行
              </Button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="min-h-[320px] flex-1 resize-y bg-transparent p-4 font-mono text-[12px] leading-relaxed text-code-fg outline-none"
          />
          {error ? (
            <p className="border-t border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
              {error}
            </p>
          ) : null}
        </div>

        <Sandbox key={runKey} code={code} onError={setError} />
      </div>
    </div>
  );
}

function Sandbox({
  code,
  onError,
}: {
  code: string;
  onError: (msg: string | null) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    camera.position.set(2, 1.5, 3);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    el.appendChild(renderer.domElement);

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let frame: ((dt: number) => void) | null = null;
    let raf = 0;
    let dead = false;
    const clock = new THREE.Clock();

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(
        "scene",
        "camera",
        "renderer",
        "THREE",
        "OrbitControls",
        `"use strict";\n${code}`,
      );
      const ret = fn(scene, camera, renderer, THREE, OrbitControls) as unknown;
      if (typeof ret === "function") {
        frame = ret as (dt: number) => void;
      }
      onError(null);
    } catch (e) {
      onError(e instanceof Error ? e.message : String(e));
    }

    const tick = () => {
      if (dead) return;
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      try {
        frame?.(dt);
      } catch (e) {
        onError(e instanceof Error ? e.message : String(e));
        dead = true;
        return;
      }
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const m = mesh.material;
        if (m) {
          const list = Array.isArray(m) ? m : [m];
          for (const mat of list) mat.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === el) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [code, onError]);

  return (
    <div
      ref={hostRef}
      className="aspect-[16/11] w-full overflow-hidden rounded-xl border border-border bg-[#0a0c10] lg:aspect-auto lg:min-h-[360px]"
    />
  );
}
