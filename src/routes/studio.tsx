import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
});

type GeoKind = "box" | "sphere" | "torus" | "knot";
type MatKind = "standard" | "basic" | "normal" | "phong";

function StudioPage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const matRef = useRef<THREE.Material | null>(null);
  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    key: THREE.DirectionalLight;
  } | null>(null);

  const [geo, setGeo] = useState<GeoKind>("box");
  const [mat, setMat] = useState<MatKind>("standard");
  const [color, setColor] = useState("#049ef4");
  const [metalness, setMetalness] = useState(0.35);
  const [roughness, setRoughness] = useState(0.35);
  const [ambientI, setAmbientI] = useState(0.35);
  const [keyI, setKeyI] = useState(1.2);
  const [wireframe, setWireframe] = useState(false);

  // Boot scene once
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c10);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(3, 2.2, 4);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    host.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(4, 5, 2);
    scene.add(ambient, key);
    lightsRef.current = { ambient, key };

    scene.add(new THREE.GridHelper(8, 16, 0x2a3344, 0x1a2230));
    scene.add(new THREE.AxesHelper(1.2));

    const material = new THREE.MeshStandardMaterial({
      color: 0x049ef4,
      metalness: 0.35,
      roughness: 0.35,
    });
    matRef.current = material;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), material);
    meshRef.current = mesh;
    scene.add(mesh);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

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

    let raf = 0;
    let dead = false;
    const tick = () => {
      if (dead) return;
      raf = requestAnimationFrame(tick);
      mesh.rotation.y += 0.006;
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement);
      }
      meshRef.current = null;
      matRef.current = null;
      lightsRef.current = null;
    };
  }, []);

  // Geometry switch
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.geometry.dispose();
    if (geo === "box") mesh.geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    if (geo === "sphere") mesh.geometry = new THREE.SphereGeometry(0.85, 48, 48);
    if (geo === "torus") mesh.geometry = new THREE.TorusGeometry(0.65, 0.25, 20, 48);
    if (geo === "knot")
      mesh.geometry = new THREE.TorusKnotGeometry(0.55, 0.18, 128, 24);
  }, [geo]);

  // Material switch / params
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const old = mesh.material as THREE.Material;
    old.dispose();
    let next: THREE.Material;
    const c = new THREE.Color(color);
    if (mat === "basic") {
      next = new THREE.MeshBasicMaterial({ color: c, wireframe });
    } else if (mat === "normal") {
      next = new THREE.MeshNormalMaterial({ wireframe });
    } else if (mat === "phong") {
      next = new THREE.MeshPhongMaterial({
        color: c,
        shininess: 80,
        wireframe,
      });
    } else {
      next = new THREE.MeshStandardMaterial({
        color: c,
        metalness,
        roughness,
        wireframe,
      });
    }
    mesh.material = next;
    matRef.current = next;
  }, [mat, color, metalness, roughness, wireframe]);

  useEffect(() => {
    if (!lightsRef.current) return;
    lightsRef.current.ambient.intensity = ambientI;
    lightsRef.current.key.intensity = keyI;
  }, [ambientI, keyI]);

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <header className="mb-5">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          场景工坊
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          实时调参实验室
        </h1>
        <p className="mt-1 text-sm text-muted">
          切换几何 / 材质 / 灯光，拖拽环视观察效果
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div
          ref={hostRef}
          className="aspect-[16/11] overflow-hidden rounded-xl border border-border bg-[#0a0c10] lg:aspect-auto lg:min-h-[420px]"
        />

        <aside className="space-y-4 rounded-xl border border-border bg-surface p-4">
          <section>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-subtle">
              几何
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(["box", "sphere", "torus", "knot"] as const).map((k) => (
                <Chip key={k} active={geo === k} onClick={() => setGeo(k)}>
                  {k}
                </Chip>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-subtle">
              材质
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(["standard", "phong", "basic", "normal"] as const).map((k) => (
                <Chip key={k} active={mat === k} onClick={() => setMat(k)}>
                  {k}
                </Chip>
              ))}
            </div>
          </section>

          <label className="flex items-center justify-between gap-2 text-sm text-muted">
            颜色
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-14 cursor-pointer rounded border border-border bg-surface-2"
            />
          </label>

          {mat === "standard" ? (
            <>
              <Range
                label="metalness"
                value={metalness}
                min={0}
                max={1}
                onChange={setMetalness}
              />
              <Range
                label="roughness"
                value={roughness}
                min={0}
                max={1}
                onChange={setRoughness}
              />
            </>
          ) : null}

          <Range
            label="Ambient"
            value={ambientI}
            min={0}
            max={2}
            onChange={setAmbientI}
          />
          <Range label="Key light" value={keyI} min={0} max={3} onChange={setKeyI} />

          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={wireframe}
              onChange={(e) => setWireframe(e.target.checked)}
              className="accent-primary"
            />
            线框模式
          </label>
        </aside>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-primary text-primary-fg"
          : "bg-surface-3 text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function Range({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted">
      <span className="flex justify-between">
        <span>{label}</span>
        <span className="font-mono text-fg">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </label>
  );
}
