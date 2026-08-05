import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { DemoKind } from "@/data/lessons";
import { ThreeCanvas, type ThreeApi } from "@/components/ThreeCanvas";
import { cn } from "@/lib/utils";

export function InteractiveDemo({
  kind,
  title,
  hint,
}: {
  kind: DemoKind;
  title: string;
  hint?: string;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            交互 Demo
          </p>
          <h3 className="mt-0.5 font-display text-base font-semibold text-fg">
            {title}
          </h3>
        </div>
        <span className="rounded-full bg-primary-soft px-2.5 py-1 font-mono text-[10px] text-primary">
          live 3D
        </span>
      </div>
      <div className="p-4 sm:p-5">
        {hint ? <p className="mb-4 text-sm text-muted">{hint}</p> : null}
        <DemoBody kind={kind} />
      </div>
    </section>
  );
}

function DemoBody({ kind }: { kind: DemoKind }) {
  switch (kind) {
    case "hello-cube":
      return <HelloCubeDemo />;
    case "scene-setup":
      return <SceneSetupDemo />;
    case "geometry":
      return <GeometryDemo />;
    case "materials":
      return <MaterialsDemo />;
    case "lights":
      return <LightsDemo />;
    case "transform":
      return <TransformDemo />;
    case "texture":
      return <TextureDemo />;
    case "orbit":
      return <OrbitDemo />;
    case "animation":
      return <AnimationDemo />;
    case "raycast":
      return <RaycastDemo />;
    case "shadows":
      return <ShadowsDemo />;
    case "particles":
      return <ParticlesDemo />;
    case "loaders":
      return <LoadersDemo />;
    case "scene-graph":
      return <SceneGraphDemo />;
    case "postfx":
      return <PostFxDemo />;
    case "project":
      return <ProjectDemo />;
    case "fog":
      return <FogDemo />;
    case "helpers":
      return <HelpersDemo />;
    case "instancing":
      return <InstancingDemo />;
    case "dispose":
      return <DisposeDemo />;
    case "colorspace":
      return <ColorSpaceDemo />;
    case "performance":
      return <PerformanceDemo />;
    case "r3f":
      return <R3fDemo />;
    case "capstone":
      return <CapstoneDemo />;
    case "envmap":
      return <EnvMapDemo />;
    case "shader":
      return <ShaderDemo />;
    case "camera-lerp":
      return <CameraLerpDemo />;
    case "first-person":
      return <FirstPersonDemo />;
    case "billboard":
      return <BillboardDemo />;
    case "gallery":
      return <GalleryDemo />;
    case "drag":
      return <DragDemo />;
    case "day-night":
      return <DayNightDemo />;
    case "trails":
      return <TrailsDemo />;
    case "morph":
      return <MorphDemo />;
    case "multiselect":
      return <MultiSelectDemo />;
    case "snap-grid":
      return <SnapGridDemo />;
    default:
      return null;
  }
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted">
      <span className="flex justify-between gap-2">
        <span>{label}</span>
        <span className="font-mono text-fg">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </label>
  );
}

function Controls({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 grid gap-3 rounded-lg border border-border bg-surface-2 p-3 sm:grid-cols-2">
      {children}
    </div>
  );
}

function HelloCubeDemo() {
  return (
    <ThreeCanvas
      onReady={({ scene, camera }) => {
        scene.background = new THREE.Color(0x0a0c10);
        camera.position.set(2, 1.5, 3);
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshNormalMaterial(),
        );
        scene.add(mesh);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      }}
      onFrame={({ scene }, dt) => {
        const mesh = scene.children.find((c) => (c as THREE.Mesh).isMesh) as
          | THREE.Mesh
          | undefined;
        if (mesh) {
          mesh.rotation.x += dt * 0.6;
          mesh.rotation.y += dt * 0.9;
        }
      }}
    />
  );
}

function SceneSetupDemo() {
  const [fov, setFov] = useState(50);
  const [camZ, setCamZ] = useState(4);
  const apiRef = useRef<ThreeApi | null>(null);

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    api.camera.fov = fov;
    api.camera.position.z = camZ;
    api.camera.updateProjectionMatrix();
  }, [fov, camZ]);

  return (
    <>
      <ThreeCanvas
        onReady={(api) => {
          apiRef.current = api;
          api.scene.background = new THREE.Color(0x0a0c10);
          api.camera.position.set(0, 1.2, camZ);
          api.scene.add(new THREE.GridHelper(8, 16, 0x049ef4, 0x2a3344));
          const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0x049ef4 }),
          );
          mesh.position.y = 0.5;
          api.scene.add(mesh);
          api.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
          const d = new THREE.DirectionalLight(0xffffff, 1.2);
          d.position.set(3, 5, 2);
          api.scene.add(d);
        }}
      />
      <Controls>
        <SliderRow label="FOV" value={fov} min={25} max={100} step={1} onChange={setFov} />
        <SliderRow label="相机 Z" value={camZ} min={2} max={10} step={0.1} onChange={setCamZ} />
      </Controls>
    </>
  );
}

function GeometryDemo() {
  const [kind, setKind] = useState<"box" | "sphere" | "torus" | "cone">("box");
  const meshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.geometry.dispose();
    if (kind === "box") mesh.geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    if (kind === "sphere") mesh.geometry = new THREE.SphereGeometry(0.8, 32, 32);
    if (kind === "torus") mesh.geometry = new THREE.TorusGeometry(0.6, 0.25, 16, 48);
    if (kind === "cone") mesh.geometry = new THREE.ConeGeometry(0.7, 1.4, 32);
  }, [kind]);

  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(2.2, 1.6, 3);
          const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 1.2, 1.2),
            new THREE.MeshStandardMaterial({
              color: 0x6e63ff,
              metalness: 0.2,
              roughness: 0.35,
            }),
          );
          meshRef.current = mesh;
          scene.add(mesh);
          scene.add(new THREE.AmbientLight(0xffffff, 0.45));
          const d = new THREE.DirectionalLight(0xffffff, 1.1);
          d.position.set(3, 4, 2);
          scene.add(d);
        }}
        onFrame={() => {
          if (meshRef.current) meshRef.current.rotation.y += 0.01;
        }}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {(["box", "sphere", "torus", "cone"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              kind === k
                ? "bg-primary text-primary-fg"
                : "bg-surface-3 text-muted hover:text-fg",
            )}
          >
            {k}
          </button>
        ))}
      </div>
    </>
  );
}

function MaterialsDemo() {
  const [metalness, setMetalness] = useState(0.4);
  const [roughness, setRoughness] = useState(0.3);
  const matRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    if (!matRef.current) return;
    matRef.current.metalness = metalness;
    matRef.current.roughness = roughness;
  }, [metalness, roughness]);

  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(2.4, 1.4, 2.8);
          const mat = new THREE.MeshStandardMaterial({
            color: 0x049ef4,
            metalness,
            roughness,
          });
          matRef.current = mat;
          scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.9, 48, 48), mat));
          scene.add(new THREE.AmbientLight(0xffffff, 0.25));
          const key = new THREE.DirectionalLight(0xffffff, 1.4);
          key.position.set(4, 3, 2);
          scene.add(key);
          const fill = new THREE.PointLight(0xffaa88, 0.5);
          fill.position.set(-2, 1, 2);
          scene.add(fill);
        }}
        onFrame={({ scene }, dt) => {
          const m = scene.children.find((c) => (c as THREE.Mesh).isMesh) as
            | THREE.Mesh
            | undefined;
          if (m) m.rotation.y += dt * 0.5;
        }}
      />
      <Controls>
        <SliderRow label="metalness" value={metalness} min={0} max={1} onChange={setMetalness} />
        <SliderRow label="roughness" value={roughness} min={0} max={1} onChange={setRoughness} />
      </Controls>
    </>
  );
}

function LightsDemo() {
  const [ambient, setAmbient] = useState(0.25);
  const [dir, setDir] = useState(1.2);
  const lightsRef = useRef<{ a: THREE.AmbientLight; d: THREE.DirectionalLight } | null>(
    null,
  );

  useEffect(() => {
    if (!lightsRef.current) return;
    lightsRef.current.a.intensity = ambient;
    lightsRef.current.d.intensity = dir;
  }, [ambient, dir]);

  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(2.5, 2, 3.5);
          const mesh = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.55, 0.18, 128, 24),
            new THREE.MeshStandardMaterial({
              color: 0xdddddd,
              metalness: 0.6,
              roughness: 0.25,
            }),
          );
          scene.add(mesh);
          const a = new THREE.AmbientLight(0xffffff, ambient);
          const d = new THREE.DirectionalLight(0xffffff, dir);
          d.position.set(3, 4, 2);
          scene.add(a, d);
          lightsRef.current = { a, d };
          scene.add(new THREE.DirectionalLightHelper(d, 0.5));
        }}
        onFrame={({ scene }, dt) => {
          const m = scene.children.find((c) => (c as THREE.Mesh).isMesh) as
            | THREE.Mesh
            | undefined;
          if (m) m.rotation.y += dt * 0.4;
        }}
      />
      <Controls>
        <SliderRow label="Ambient" value={ambient} min={0} max={1.5} onChange={setAmbient} />
        <SliderRow label="Directional" value={dir} min={0} max={3} onChange={setDir} />
      </Controls>
    </>
  );
}

function TransformDemo() {
  const [x, setX] = useState(0);
  const [ry, setRy] = useState(0.5);
  const [s, setS] = useState(1);
  const meshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.position.x = x;
    mesh.rotation.y = ry;
    mesh.scale.setScalar(s);
  }, [x, ry, s]);

  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(3, 2, 4);
          scene.add(new THREE.AxesHelper(1.5));
          scene.add(new THREE.GridHelper(6, 12, 0x049ef4, 0x2a3344));
          const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0x049ef4 }),
          );
          meshRef.current = mesh;
          scene.add(mesh);
          scene.add(new THREE.AmbientLight(0xffffff, 0.5));
          const d = new THREE.DirectionalLight(0xffffff, 1);
          d.position.set(2, 4, 3);
          scene.add(d);
        }}
      />
      <Controls>
        <SliderRow label="position.x" value={x} min={-2} max={2} onChange={setX} />
        <SliderRow label="rotation.y" value={ry} min={0} max={Math.PI * 2} onChange={setRy} />
        <SliderRow label="scale" value={s} min={0.3} max={2} onChange={setS} />
      </Controls>
    </>
  );
}

function makeCheckerTexture(repeat = 2) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cell = size / 8;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? "#049ef4" : "#1a2230";
      ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function TextureDemo() {
  const [repeat, setRepeat] = useState(2);
  const matRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    if (!matRef.current?.map) return;
    matRef.current.map.repeat.set(repeat, repeat);
    matRef.current.map.needsUpdate = true;
  }, [repeat]);

  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(2.2, 1.8, 2.8);
          const map = makeCheckerTexture(repeat);
          const mat = new THREE.MeshStandardMaterial({ map, roughness: 0.5 });
          matRef.current = mat;
          scene.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), mat));
          scene.add(new THREE.AmbientLight(0xffffff, 0.5));
          const d = new THREE.DirectionalLight(0xffffff, 1.1);
          d.position.set(3, 4, 2);
          scene.add(d);
        }}
        onFrame={({ scene }, dt) => {
          const m = scene.children.find((c) => (c as THREE.Mesh).isMesh) as
            | THREE.Mesh
            | undefined;
          if (m) m.rotation.y += dt * 0.35;
        }}
      />
      <Controls>
        <SliderRow label="repeat" value={repeat} min={1} max={8} step={1} onChange={setRepeat} />
      </Controls>
    </>
  );
}

function OrbitDemo() {
  return (
    <ThreeCanvas
      autoRender={false}
      onReady={({ scene, camera, renderer }) => {
        scene.background = new THREE.Color(0x0a0c10);
        camera.position.set(3, 2, 4);
        const mesh = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1, 1),
          new THREE.MeshStandardMaterial({
            color: 0x049ef4,
            flatShading: true,
            metalness: 0.3,
            roughness: 0.4,
          }),
        );
        scene.add(mesh);
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const d = new THREE.DirectionalLight(0xffffff, 1.2);
        d.position.set(4, 5, 2);
        scene.add(d);
        scene.add(new THREE.GridHelper(8, 16, 0x2a3344, 0x1a2230));
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        let raf = 0;
        let dead = false;
        const tick = () => {
          if (dead) return;
          raf = requestAnimationFrame(tick);
          mesh.rotation.y += 0.004;
          controls.update();
          renderer.render(scene, camera);
        };
        tick();
        return () => {
          dead = true;
          cancelAnimationFrame(raf);
          controls.dispose();
        };
      }}
    />
  );
}

function AnimationDemo() {
  const [speed, setSpeed] = useState(1.2);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(2.5, 1.5, 3);
          const mesh = new THREE.Mesh(
            new THREE.TorusGeometry(0.7, 0.25, 16, 48),
            new THREE.MeshStandardMaterial({
              color: 0x6e63ff,
              metalness: 0.5,
              roughness: 0.3,
            }),
          );
          mesh.name = "torus";
          scene.add(mesh);
          scene.add(new THREE.AmbientLight(0xffffff, 0.4));
          const d = new THREE.DirectionalLight(0xffffff, 1.2);
          d.position.set(3, 3, 2);
          scene.add(d);
        }}
        onFrame={({ scene }, dt) => {
          const m = scene.getObjectByName("torus") as THREE.Mesh | undefined;
          if (m) {
            m.rotation.x += dt * speedRef.current;
            m.rotation.y += dt * speedRef.current * 0.7;
          }
        }}
      />
      <Controls>
        <SliderRow label="角速度 rad/s" value={speed} min={0} max={4} onChange={setSpeed} />
      </Controls>
    </>
  );
}

function RaycastDemo() {
  const [picked, setPicked] = useState<string>("点击一个方块");

  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera, canvas }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(4, 3, 5);
          camera.lookAt(0, 0.5, 0);
          scene.add(new THREE.AmbientLight(0xffffff, 0.5));
          const d = new THREE.DirectionalLight(0xffffff, 1);
          d.position.set(3, 5, 2);
          scene.add(d);
          const meshes: THREE.Mesh[] = [];
          const colors = [0x049ef4, 0x6e63ff, 0xe0b06a];
          const names = ["蓝方块", "紫方块", "金方块"];
          for (let i = 0; i < 3; i++) {
            const m = new THREE.Mesh(
              new THREE.BoxGeometry(1, 1, 1),
              new THREE.MeshStandardMaterial({ color: colors[i] }),
            );
            m.position.set((i - 1) * 1.6, 0.5, 0);
            m.name = names[i]!;
            scene.add(m);
            meshes.push(m);
          }
          scene.add(new THREE.GridHelper(8, 16, 0x2a3344, 0x1a2230));
          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();
          const onClick = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObjects(meshes);
            for (const m of meshes) {
              (m.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
            }
            if (hits[0]) {
              const obj = hits[0].object as THREE.Mesh;
              (obj.material as THREE.MeshStandardMaterial).emissive.setHex(0x224466);
              setPicked(`选中：${obj.name}`);
            } else setPicked("未点中物体");
          };
          canvas.addEventListener("pointerdown", onClick);
          return () => canvas.removeEventListener("pointerdown", onClick);
        }}
      />
      <p className="mt-3 font-mono text-sm text-primary">{picked}</p>
    </>
  );
}

function ShadowsDemo() {
  return (
    <ThreeCanvas
      onReady={({ scene, camera, renderer }) => {
        scene.background = new THREE.Color(0x0a0c10);
        camera.position.set(3.5, 3, 4.5);
        camera.lookAt(0, 0.5, 0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(10, 10),
          new THREE.MeshStandardMaterial({ color: 0x1a2230, roughness: 0.9 }),
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);
        const ball = new THREE.Mesh(
          new THREE.SphereGeometry(0.6, 32, 32),
          new THREE.MeshStandardMaterial({
            color: 0x049ef4,
            metalness: 0.2,
            roughness: 0.3,
          }),
        );
        ball.position.set(0, 0.6, 0);
        ball.castShadow = true;
        scene.add(ball);
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 0.8, 0.8),
          new THREE.MeshStandardMaterial({ color: 0x6e63ff }),
        );
        box.position.set(1.4, 0.4, -0.4);
        box.castShadow = true;
        scene.add(box);
        scene.add(new THREE.AmbientLight(0xffffff, 0.25));
        const light = new THREE.DirectionalLight(0xffffff, 1.4);
        light.position.set(4, 6, 2);
        light.castShadow = true;
        light.shadow.mapSize.set(1024, 1024);
        scene.add(light);
      }}
      onFrame={({ scene }) => {
        const ball = scene.children.find(
          (c) =>
            (c as THREE.Mesh).isMesh &&
            (c as THREE.Mesh).geometry.type === "SphereGeometry",
        ) as THREE.Mesh | undefined;
        if (ball) {
          ball.position.y = 0.6 + Math.abs(Math.sin(performance.now() * 0.002)) * 0.8;
        }
      }}
    />
  );
}

function ParticlesDemo() {
  const pointsRef = useRef<THREE.Points | null>(null);
  return (
    <ThreeCanvas
      onReady={({ scene, camera }) => {
        scene.background = new THREE.Color(0x05070c);
        camera.position.set(0, 0, 6);
        const count = 2500;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 12;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const points = new THREE.Points(
          geo,
          new THREE.PointsMaterial({
            size: 0.045,
            color: 0x88ccff,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
          }),
        );
        pointsRef.current = points;
        scene.add(points);
      }}
      onFrame={() => {
        if (pointsRef.current) {
          pointsRef.current.rotation.y += 0.0015;
          pointsRef.current.rotation.x += 0.0004;
        }
      }}
    />
  );
}

function LoadersDemo() {
  const [status, setStatus] = useState("点击加载「模型」");
  const groupRef = useRef<THREE.Group | null>(null);
  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(2.5, 2, 3.5);
          camera.lookAt(0, 0.5, 0);
          const g = new THREE.Group();
          groupRef.current = g;
          scene.add(g);
          scene.add(new THREE.AmbientLight(0xffffff, 0.5));
          const d = new THREE.DirectionalLight(0xffffff, 1.1);
          d.position.set(3, 4, 2);
          scene.add(d);
          scene.add(new THREE.GridHelper(6, 12, 0x2a3344, 0x1a2230));
        }}
        onFrame={() => {
          if (groupRef.current) groupRef.current.rotation.y += 0.008;
        }}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-fg"
          onClick={() => {
            setStatus("加载中…");
            window.setTimeout(() => {
              const g = groupRef.current;
              if (!g) return;
              while (g.children.length) g.remove(g.children[0]!);
              const body = new THREE.Mesh(
                new THREE.BoxGeometry(1, 0.6, 1.4),
                new THREE.MeshStandardMaterial({
                  color: 0x049ef4,
                  metalness: 0.4,
                  roughness: 0.35,
                }),
              );
              body.position.y = 0.5;
              const cabin = new THREE.Mesh(
                new THREE.BoxGeometry(0.7, 0.45, 0.7),
                new THREE.MeshStandardMaterial({
                  color: 0xc8d4e0,
                  metalness: 0.1,
                  roughness: 0.2,
                }),
              );
              cabin.position.set(0, 0.95, -0.15);
              g.add(body, cabin);
              setStatus("已加载程序化「小车」模型（模拟 GLTF）");
            }, 700);
          }}
        >
          模拟 load GLB
        </button>
        <span className="text-sm text-muted">{status}</span>
      </div>
    </>
  );
}

function SceneGraphDemo() {
  return (
    <ThreeCanvas
      onReady={({ scene, camera }) => {
        scene.background = new THREE.Color(0x05070c);
        camera.position.set(0, 4, 7);
        camera.lookAt(0, 0, 0);
        const sun = new THREE.Mesh(
          new THREE.SphereGeometry(0.5, 32, 32),
          new THREE.MeshBasicMaterial({ color: 0xffcc66 }),
        );
        scene.add(sun);
        const earthOrbit = new THREE.Group();
        scene.add(earthOrbit);
        const earth = new THREE.Mesh(
          new THREE.SphereGeometry(0.25, 24, 24),
          new THREE.MeshStandardMaterial({ color: 0x049ef4 }),
        );
        earth.position.x = 2.2;
        earthOrbit.add(earth);
        const moonOrbit = new THREE.Group();
        earth.add(moonOrbit);
        const moon = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xcccccc }),
        );
        moon.position.x = 0.55;
        moonOrbit.add(moon);
        scene.add(new THREE.AmbientLight(0xffffff, 0.35));
        const d = new THREE.DirectionalLight(0xffffff, 1);
        d.position.set(3, 5, 2);
        scene.add(d);
        (scene as THREE.Scene & { userData: object }).userData = {
          earthOrbit,
          moonOrbit,
        };
      }}
      onFrame={({ scene }, dt) => {
        const u = scene.userData as {
          earthOrbit?: THREE.Group;
          moonOrbit?: THREE.Group;
        };
        if (u.earthOrbit) u.earthOrbit.rotation.y += dt * 0.5;
        if (u.moonOrbit) u.moonOrbit.rotation.y += dt * 2.2;
      }}
    />
  );
}

function PostFxDemo() {
  const [bloom, setBloom] = useState(0.6);
  const bloomRef = useRef(bloom);
  bloomRef.current = bloom;
  return (
    <>
      <ThreeCanvas
        autoRender={false}
        onReady={({ scene, camera, renderer }) => {
          scene.background = new THREE.Color(0x05070c);
          camera.position.set(2.5, 1.5, 3);
          const mesh = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.9, 0),
            new THREE.MeshStandardMaterial({
              color: 0x049ef4,
              emissive: 0x049ef4,
              emissiveIntensity: 0.6,
              metalness: 0.5,
              roughness: 0.2,
            }),
          );
          scene.add(mesh);
          scene.add(new THREE.AmbientLight(0xffffff, 0.2));
          const d = new THREE.DirectionalLight(0xffffff, 0.8);
          d.position.set(2, 3, 2);
          scene.add(d);
          const ghost = mesh.clone();
          ghost.material = (mesh.material as THREE.MeshStandardMaterial).clone();
          (ghost.material as THREE.MeshStandardMaterial).transparent = true;
          scene.add(ghost);
          let raf = 0;
          let dead = false;
          const tick = () => {
            if (dead) return;
            raf = requestAnimationFrame(tick);
            mesh.rotation.y += 0.01;
            mesh.rotation.x += 0.006;
            ghost.rotation.copy(mesh.rotation);
            const b = bloomRef.current;
            ghost.scale.setScalar(1 + b * 0.25);
            (ghost.material as THREE.MeshStandardMaterial).opacity = 0.15 + b * 0.4;
            (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
              0.3 + b * 0.9;
            renderer.render(scene, camera);
          };
          tick();
          return () => {
            dead = true;
            cancelAnimationFrame(raf);
          };
        }}
      />
      <Controls>
        <SliderRow label="辉光强度" value={bloom} min={0} max={1.5} onChange={setBloom} />
      </Controls>
    </>
  );
}

function ProjectDemo() {
  const [info, setInfo] = useState("拖拽环视 · 点击展品");
  return (
    <>
      <ThreeCanvas
        autoRender={false}
        onReady={({ scene, camera, renderer, canvas }) => {
          scene.background = new THREE.Color(0x0a0c10);
          scene.fog = new THREE.Fog(0x0a0c10, 8, 22);
          camera.position.set(4, 2.5, 6);
          renderer.shadowMap.enabled = true;
          const floor = new THREE.Mesh(
            new THREE.CircleGeometry(6, 48),
            new THREE.MeshStandardMaterial({ color: 0x161b24, roughness: 0.85 }),
          );
          floor.rotation.x = -Math.PI / 2;
          floor.receiveShadow = true;
          scene.add(floor);
          const exhibits: THREE.Object3D[] = [];
          const items = [
            {
              name: "多面体",
              color: 0x049ef4,
              geo: new THREE.IcosahedronGeometry(0.45, 0),
              x: -1.8,
            },
            {
              name: "圆环",
              color: 0x6e63ff,
              geo: new THREE.TorusKnotGeometry(0.32, 0.1, 100, 16),
              x: 0,
            },
            {
              name: "胶囊",
              color: 0xe0b06a,
              geo: new THREE.CapsuleGeometry(0.28, 0.4, 8, 16),
              x: 1.8,
            },
          ];
          for (const item of items) {
            const pedestal = new THREE.Mesh(
              new THREE.CylinderGeometry(0.45, 0.55, 0.5, 24),
              new THREE.MeshStandardMaterial({ color: 0x222936, roughness: 0.7 }),
            );
            pedestal.position.set(item.x, 0.25, 0);
            pedestal.castShadow = true;
            pedestal.receiveShadow = true;
            scene.add(pedestal);
            const art = new THREE.Mesh(
              item.geo,
              new THREE.MeshStandardMaterial({
                color: item.color,
                metalness: 0.45,
                roughness: 0.28,
              }),
            );
            art.position.set(item.x, 1.0, 0);
            art.castShadow = true;
            art.name = item.name;
            art.userData.label = item.name;
            scene.add(art);
            exhibits.push(art);
          }
          scene.add(new THREE.AmbientLight(0xffffff, 0.3));
          const key = new THREE.DirectionalLight(0xffffff, 1.3);
          key.position.set(4, 8, 3);
          key.castShadow = true;
          key.shadow.mapSize.set(1024, 1024);
          scene.add(key);
          const rim = new THREE.PointLight(0x6688ff, 0.6);
          rim.position.set(-3, 2, -2);
          scene.add(rim);
          const controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.maxPolarAngle = Math.PI * 0.48;
          controls.minDistance = 3;
          controls.maxDistance = 12;
          controls.target.set(0, 0.8, 0);
          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();
          const onClick = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObjects(exhibits);
            for (const o of exhibits) {
              ((o as THREE.Mesh).material as THREE.MeshStandardMaterial).emissive.setHex(
                0x000000,
              );
            }
            if (hits[0]) {
              const obj = hits[0].object as THREE.Mesh;
              (obj.material as THREE.MeshStandardMaterial).emissive.setHex(0x113355);
              setInfo(`展品：${obj.userData.label}`);
            }
          };
          canvas.addEventListener("pointerdown", onClick);
          let raf = 0;
          let dead = false;
          const tick = () => {
            if (dead) return;
            raf = requestAnimationFrame(tick);
            for (const o of exhibits) o.rotation.y += 0.008;
            controls.update();
            renderer.render(scene, camera);
          };
          tick();
          return () => {
            dead = true;
            cancelAnimationFrame(raf);
            canvas.removeEventListener("pointerdown", onClick);
            controls.dispose();
          };
        }}
      />
      <p className="mt-3 font-mono text-sm text-primary">{info}</p>
    </>
  );
}

function FogDemo() {
  const [far, setFar] = useState(12);
  const fogRef = useRef<THREE.Fog | null>(null);
  useEffect(() => {
    if (fogRef.current) fogRef.current.far = far;
  }, [far]);
  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          const bg = 0x0a0c10;
          scene.background = new THREE.Color(bg);
          const fog = new THREE.Fog(bg, 2, far);
          fogRef.current = fog;
          scene.fog = fog;
          camera.position.set(0, 2, 8);
          camera.lookAt(0, 0.5, 0);
          scene.add(new THREE.AmbientLight(0xffffff, 0.4));
          const d = new THREE.DirectionalLight(0xffffff, 1);
          d.position.set(3, 5, 2);
          scene.add(d);
          for (let i = 0; i < 12; i++) {
            const m = new THREE.Mesh(
              new THREE.BoxGeometry(0.8, 0.8, 0.8),
              new THREE.MeshStandardMaterial({ color: 0x049ef4 }),
            );
            m.position.set((i % 4) * 1.5 - 2.25, 0.4, -Math.floor(i / 4) * 2.2);
            scene.add(m);
          }
          scene.add(new THREE.GridHelper(20, 20, 0x2a3344, 0x1a2230));
        }}
      />
      <Controls>
        <SliderRow label="fog.far" value={far} min={4} max={24} step={0.5} onChange={setFar} />
      </Controls>
    </>
  );
}

function HelpersDemo() {
  const [showAxes, setShowAxes] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showLight, setShowLight] = useState(true);
  const refs = useRef<{
    axes?: THREE.AxesHelper;
    grid?: THREE.GridHelper;
    lh?: THREE.DirectionalLightHelper;
  }>({});

  useEffect(() => {
    if (refs.current.axes) refs.current.axes.visible = showAxes;
    if (refs.current.grid) refs.current.grid.visible = showGrid;
    if (refs.current.lh) refs.current.lh.visible = showLight;
  }, [showAxes, showGrid, showLight]);

  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(3, 2.5, 4);
          const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0x049ef4 }),
          );
          scene.add(mesh);
          scene.add(new THREE.AmbientLight(0xffffff, 0.35));
          const d = new THREE.DirectionalLight(0xffffff, 1.1);
          d.position.set(2, 3, 1);
          scene.add(d);
          const axes = new THREE.AxesHelper(2);
          const grid = new THREE.GridHelper(8, 16, 0x049ef4, 0x2a3344);
          const lh = new THREE.DirectionalLightHelper(d, 0.6);
          scene.add(axes, grid, lh);
          refs.current = { axes, grid, lh };
        }}
        onFrame={({ scene }, dt) => {
          const m = scene.children.find((c) => (c as THREE.Mesh).isMesh) as
            | THREE.Mesh
            | undefined;
          if (m) m.rotation.y += dt * 0.4;
        }}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {(
          [
            ["Axes", showAxes, setShowAxes],
            ["Grid", showGrid, setShowGrid],
            ["LightHelper", showLight, setShowLight],
          ] as const
        ).map(([label, on, set]) => (
          <button
            key={label}
            type="button"
            onClick={() => set(!on)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              on ? "bg-primary text-primary-fg" : "bg-surface-3 text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

function InstancingDemo() {
  const [count, setCount] = useState(400);
  const [seed, setSeed] = useState(0);
  return (
    <>
      <ThreeCanvas
        key={`${count}-${seed}`}
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(0, 6, 10);
          camera.lookAt(0, 0, 0);
          const geo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
          const mat = new THREE.MeshStandardMaterial({
            color: 0x049ef4,
            metalness: 0.2,
            roughness: 0.45,
          });
          const mesh = new THREE.InstancedMesh(geo, mat, count);
          const dummy = new THREE.Object3D();
          const color = new THREE.Color();
          for (let i = 0; i < count; i++) {
            const x = (i % 20) - 9.5;
            const z = Math.floor(i / 20) - Math.floor(count / 40);
            dummy.position.set(x * 0.55, Math.sin(i * 0.4) * 0.3, z * 0.55);
            dummy.rotation.y = i * 0.1;
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
            color.setHSL((i / count) * 0.6 + 0.45, 0.7, 0.5);
            mesh.setColorAt(i, color);
          }
          mesh.instanceMatrix.needsUpdate = true;
          if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
          scene.add(mesh);
          scene.add(new THREE.AmbientLight(0xffffff, 0.45));
          const d = new THREE.DirectionalLight(0xffffff, 1.1);
          d.position.set(4, 8, 2);
          scene.add(d);
          (scene as THREE.Scene & { userData: { mesh: THREE.InstancedMesh } }).userData = {
            mesh,
          };
        }}
        onFrame={({ scene }, dt) => {
          const mesh = (scene.userData as { mesh?: THREE.InstancedMesh }).mesh;
          if (mesh) mesh.rotation.y += dt * 0.15;
        }}
      />
      <Controls>
        <SliderRow
          label="实例数"
          value={count}
          min={50}
          max={1200}
          step={50}
          onChange={(v) => {
            setCount(v);
            setSeed((s) => s + 1);
          }}
        />
      </Controls>
    </>
  );
}

function DisposeDemo() {
  const [builds, setBuilds] = useState(1);
  const [log, setLog] = useState("点击重建：销毁旧场景并创建新场景");
  return (
    <>
      <ThreeCanvas
        key={builds}
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(2.5, 1.8, 3.2);
          const hue = (builds * 0.13) % 1;
          const mesh = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.55, 0.18, 100, 16),
            new THREE.MeshStandardMaterial({
              color: new THREE.Color().setHSL(hue, 0.7, 0.55),
              metalness: 0.4,
              roughness: 0.3,
            }),
          );
          scene.add(mesh);
          scene.add(new THREE.AmbientLight(0xffffff, 0.4));
          const d = new THREE.DirectionalLight(0xffffff, 1.2);
          d.position.set(3, 4, 2);
          scene.add(d);
          setLog(`场景 #${builds} 已创建（卸载时 ThreeCanvas 会 dispose）`);
        }}
        onFrame={({ scene }, dt) => {
          const m = scene.children.find((c) => (c as THREE.Mesh).isMesh) as
            | THREE.Mesh
            | undefined;
          if (m) m.rotation.y += dt * 0.8;
        }}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-fg"
          onClick={() => setBuilds((b) => b + 1)}
        >
          销毁并重建
        </button>
        <span className="text-sm text-muted">{log}</span>
      </div>
    </>
  );
}

function ColorSpaceDemo() {
  const [exposure, setExposure] = useState(1);
  const [tone, setTone] = useState(true);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const r = rendererRef.current;
    if (!r) return;
    r.toneMappingExposure = exposure;
    r.toneMapping = tone ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
  }, [exposure, tone]);

  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera, renderer }) => {
          rendererRef.current = renderer;
          renderer.outputColorSpace = THREE.SRGBColorSpace;
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = exposure;
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(2.4, 1.5, 2.8);
          const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.9, 48, 48),
            new THREE.MeshStandardMaterial({
              color: 0xff8844,
              metalness: 0.8,
              roughness: 0.15,
              emissive: 0x331100,
              emissiveIntensity: 0.4,
            }),
          );
          scene.add(mesh);
          scene.add(new THREE.AmbientLight(0xffffff, 0.2));
          const d = new THREE.DirectionalLight(0xffffff, 2.2);
          d.position.set(3, 4, 2);
          scene.add(d);
        }}
        onFrame={({ scene }, dt) => {
          const m = scene.children.find((c) => (c as THREE.Mesh).isMesh) as
            | THREE.Mesh
            | undefined;
          if (m) m.rotation.y += dt * 0.5;
        }}
      />
      <Controls>
        <SliderRow
          label="toneMappingExposure"
          value={exposure}
          min={0.2}
          max={2.5}
          onChange={setExposure}
        />
        <label className="flex items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={tone}
            onChange={(e) => setTone(e.target.checked)}
            className="accent-primary"
          />
          ACESFilmic tone mapping
        </label>
      </Controls>
    </>
  );
}

function PerformanceDemo() {
  const [n, setN] = useState(50);
  const [dprCap, setDprCap] = useState(2);
  const load = Math.round(n * dprCap * dprCap);
  return (
    <>
      <ThreeCanvas
        key={`${n}-${dprCap}`}
        onReady={({ scene, camera, renderer }) => {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(0, 3, 8);
          camera.lookAt(0, 0, 0);
          scene.add(new THREE.AmbientLight(0xffffff, 0.5));
          const d = new THREE.DirectionalLight(0xffffff, 1);
          d.position.set(3, 5, 2);
          scene.add(d);
          const geo = new THREE.IcosahedronGeometry(0.25, 0);
          const mat = new THREE.MeshStandardMaterial({ color: 0x6e63ff });
          for (let i = 0; i < n; i++) {
            const m = new THREE.Mesh(geo, mat);
            m.position.set(
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 3,
              (Math.random() - 0.5) * 6,
            );
            scene.add(m);
          }
        }}
        onFrame={({ scene }, dt) => {
          scene.traverse((o) => {
            if ((o as THREE.Mesh).isMesh) o.rotation.y += dt * 0.5;
          });
        }}
      />
      <Controls>
        <SliderRow label="Mesh 数量" value={n} min={10} max={300} step={10} onChange={setN} />
        <SliderRow
          label="pixelRatio cap"
          value={dprCap}
          min={1}
          max={3}
          step={0.5}
          onChange={setDprCap}
        />
      </Controls>
      <p className="mt-2 font-mono text-xs text-muted">
        估算负载指数 ≈ mesh × dpr² = {load}（仅教学用相对值）
      </p>
    </>
  );
}

function R3fDemo() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div className="rounded-lg border border-border bg-code-bg p-3">
        <p className="mb-2 font-mono text-[10px] uppercase text-subtle">R3F JSX 概念</p>
        <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-code-fg whitespace-pre">{`<Canvas>
  <ambientLight intensity={0.4} />
  <directionalLight position={[3,4,2]} />
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="#049ef4" />
  </mesh>
  <OrbitControls />
</Canvas>`}</pre>
      </div>
      <ThreeCanvas
        autoRender={false}
        onReady={({ scene, camera, renderer }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(2.5, 1.8, 3);
          const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0x049ef4 }),
          );
          scene.add(mesh);
          scene.add(new THREE.AmbientLight(0xffffff, 0.4));
          const d = new THREE.DirectionalLight(0xffffff, 1.2);
          d.position.set(3, 4, 2);
          scene.add(d);
          const controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          let raf = 0;
          let dead = false;
          const tick = () => {
            if (dead) return;
            raf = requestAnimationFrame(tick);
            mesh.rotation.y += 0.01;
            controls.update();
            renderer.render(scene, camera);
          };
          tick();
          return () => {
            dead = true;
            cancelAnimationFrame(raf);
            controls.dispose();
          };
        }}
      />
    </div>
  );
}

function CapstoneDemo() {
  const [info, setInfo] = useState("综合预检：拖拽 · 点击");
  return (
    <>
      <ThreeCanvas
        autoRender={false}
        onReady={({ scene, camera, renderer, canvas }) => {
          const bg = 0x0a0c10;
          scene.background = new THREE.Color(bg);
          scene.fog = new THREE.Fog(bg, 6, 20);
          camera.position.set(5, 3, 6);
          renderer.shadowMap.enabled = true;
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(16, 16),
            new THREE.MeshStandardMaterial({ color: 0x141a22, roughness: 0.9 }),
          );
          ground.rotation.x = -Math.PI / 2;
          ground.receiveShadow = true;
          scene.add(ground);
          const hero = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.7, 0.22, 120, 18),
            new THREE.MeshStandardMaterial({
              color: 0x049ef4,
              metalness: 0.55,
              roughness: 0.25,
            }),
          );
          hero.position.y = 1.1;
          hero.castShadow = true;
          hero.name = "主展体";
          scene.add(hero);
          for (let i = 0; i < 6; i++) {
            const p = new THREE.Mesh(
              new THREE.BoxGeometry(0.4, 0.4, 0.4),
              new THREE.MeshStandardMaterial({ color: 0x6e63ff }),
            );
            const a = (i / 6) * Math.PI * 2;
            p.position.set(Math.cos(a) * 2.4, 0.2, Math.sin(a) * 2.4);
            p.castShadow = true;
            p.name = `卫星块 ${i + 1}`;
            scene.add(p);
          }
          scene.add(new THREE.AmbientLight(0xffffff, 0.28));
          const key = new THREE.DirectionalLight(0xffffff, 1.35);
          key.position.set(5, 8, 3);
          key.castShadow = true;
          key.shadow.mapSize.set(1024, 1024);
          scene.add(key);
          const controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.target.set(0, 0.8, 0);
          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();
          const pickables = scene.children.filter((c) => (c as THREE.Mesh).isMesh);
          const onClick = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObjects(pickables, false);
            if (hits[0]) setInfo(`命中：${hits[0].object.name || "object"}`);
          };
          canvas.addEventListener("pointerdown", onClick);
          let raf = 0;
          let dead = false;
          const tick = () => {
            if (dead) return;
            raf = requestAnimationFrame(tick);
            hero.rotation.y += 0.01;
            controls.update();
            renderer.render(scene, camera);
          };
          tick();
          return () => {
            dead = true;
            cancelAnimationFrame(raf);
            canvas.removeEventListener("pointerdown", onClick);
            controls.dispose();
          };
        }}
      />
      <p className="mt-3 font-mono text-sm text-primary">{info}</p>
    </>
  );
}

function makeGradientCubeTexture() {
  const size = 64;
  const faces: string[] = [];
  const colors = [
    ["#1a3a5c", "#049ef4"],
    ["#2a1a4a", "#6e63ff"],
    ["#1a4a3a", "#40c090"],
    ["#4a2a1a", "#e0b06a"],
    ["#1a1a3a", "#88aaff"],
    ["#0a0c10", "#2a3344"],
  ];
  for (const [a, b] of colors) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, a);
    g.addColorStop(1, b);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    faces.push(c.toDataURL());
  }
  const loader = new THREE.CubeTextureLoader();
  return loader.load(faces);
}

function EnvMapDemo() {
  const [metal, setMetal] = useState(1);
  const [intensity, setIntensity] = useState(1.2);
  const matRef = useRef<THREE.MeshStandardMaterial | null>(null);
  useEffect(() => {
    if (!matRef.current) return;
    matRef.current.metalness = metal;
    matRef.current.envMapIntensity = intensity;
  }, [metal, intensity]);
  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(2.4, 1.4, 2.8);
          const env = makeGradientCubeTexture();
          scene.environment = env;
          const mat = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: metal,
            roughness: 0.12,
            envMap: env,
            envMapIntensity: intensity,
          });
          matRef.current = mat;
          scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.9, 64, 64), mat));
          scene.add(new THREE.AmbientLight(0xffffff, 0.15));
          const d = new THREE.DirectionalLight(0xffffff, 0.6);
          d.position.set(3, 4, 2);
          scene.add(d);
        }}
        onFrame={({ scene }, dt) => {
          const m = scene.children.find((c) => (c as THREE.Mesh).isMesh) as
            | THREE.Mesh
            | undefined;
          if (m) m.rotation.y += dt * 0.35;
        }}
      />
      <Controls>
        <SliderRow label="metalness" value={metal} min={0} max={1} onChange={setMetal} />
        <SliderRow
          label="envMapIntensity"
          value={intensity}
          min={0}
          max={2.5}
          onChange={setIntensity}
        />
      </Controls>
    </>
  );
}

function ShaderDemo() {
  return (
    <ThreeCanvas
      onReady={({ scene, camera }) => {
        scene.background = new THREE.Color(0x05070c);
        camera.position.set(2.2, 1.4, 2.6);
        const uniforms = { uTime: { value: 0 } };
        const mat = new THREE.ShaderMaterial({
          uniforms,
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uTime;
            varying vec2 vUv;
            void main() {
              float w = 0.5 + 0.5 * sin(uTime * 2.0 + vUv.x * 8.0 + vUv.y * 4.0);
              vec3 col = mix(vec3(0.02, 0.2, 0.45), vec3(0.43, 0.39, 1.0), w);
              gl_FragColor = vec4(col, 1.0);
            }
          `,
        });
        const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 3), mat);
        scene.add(mesh);
        (scene as THREE.Scene & { userData: { u: typeof uniforms; mesh: THREE.Mesh } }).userData = {
          u: uniforms,
          mesh,
        };
      }}
      onFrame={({ scene }, dt) => {
        const u = scene.userData as {
          u?: { uTime: { value: number } };
          mesh?: THREE.Mesh;
        };
        if (u.u) u.u.uTime.value += dt;
        if (u.mesh) {
          u.mesh.rotation.y += dt * 0.3;
          u.mesh.rotation.x += dt * 0.15;
        }
      }}
    />
  );
}

function CameraLerpDemo() {
  const targetRef = useRef(new THREE.Vector3(3, 2, 4));
  const lookRef = useRef(new THREE.Vector3(0, 0.5, 0));
  const shots = [
    { pos: [3, 2, 4] as const, look: [0, 0.5, 0] as const, label: "总览" },
    { pos: [1.2, 0.8, 1.5] as const, look: [0, 0.5, 0] as const, label: "特写" },
    { pos: [-2.5, 1.5, 2] as const, look: [0, 0.4, 0] as const, label: "侧位" },
    { pos: [0, 4, 0.2] as const, look: [0, 0, 0] as const, label: "俯视" },
  ];
  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(3, 2, 4);
          const mesh = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.55, 0.18, 100, 16),
            new THREE.MeshStandardMaterial({ color: 0x049ef4, metalness: 0.4, roughness: 0.3 }),
          );
          mesh.position.y = 0.6;
          scene.add(mesh);
          scene.add(new THREE.GridHelper(8, 16, 0x2a3344, 0x1a2230));
          scene.add(new THREE.AmbientLight(0xffffff, 0.4));
          const d = new THREE.DirectionalLight(0xffffff, 1.1);
          d.position.set(3, 5, 2);
          scene.add(d);
          (scene as THREE.Scene & { userData: { mesh: THREE.Mesh } }).userData = { mesh };
        }}
        onFrame={({ scene, camera }, dt) => {
          const k = 1 - Math.exp(-3.5 * dt);
          camera.position.lerp(targetRef.current, k);
          const look = lookRef.current;
          camera.lookAt(look);
          const mesh = (scene.userData as { mesh?: THREE.Mesh }).mesh;
          if (mesh) mesh.rotation.y += dt * 0.4;
        }}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {shots.map((s) => (
          <button
            key={s.label}
            type="button"
            className="rounded-full bg-surface-3 px-3 py-1.5 text-xs font-medium text-muted hover:bg-primary hover:text-primary-fg"
            onClick={() => {
              targetRef.current.set(s.pos[0], s.pos[1], s.pos[2]);
              lookRef.current.set(s.look[0], s.look[1], s.look[2]);
            }}

          >
            {s.label}
          </button>
        ))}
      </div>
    </>
  );
}

function FirstPersonDemo() {
  const [hint, setHint] = useState("点击画布后用 WASD 移动，Q/E 转向");
  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera, canvas }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(0, 1.4, 5);
          camera.rotation.order = "YXZ";
          scene.add(new THREE.AmbientLight(0xffffff, 0.45));
          const d = new THREE.DirectionalLight(0xffffff, 1);
          d.position.set(4, 6, 2);
          scene.add(d);
          const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(30, 30),
            new THREE.MeshStandardMaterial({ color: 0x161b24 }),
          );
          ground.rotation.x = -Math.PI / 2;
          scene.add(ground);
          for (let i = 0; i < 12; i++) {
            const m = new THREE.Mesh(
              new THREE.BoxGeometry(1, 1 + (i % 3), 1),
              new THREE.MeshStandardMaterial({ color: i % 2 ? 0x049ef4 : 0x6e63ff }),
            );
            const a = (i / 12) * Math.PI * 2;
            m.position.set(Math.cos(a) * 5, m.geometry.parameters.height / 2, Math.sin(a) * 5);
            scene.add(m);
          }
          const keys: Record<string, boolean> = {};
          const onKey = (e: KeyboardEvent) => {
            keys[e.code] = e.type === "keydown";
          };
          window.addEventListener("keydown", onKey);
          window.addEventListener("keyup", onKey);
          canvas.tabIndex = 0;
          canvas.addEventListener("pointerdown", () => {
            canvas.focus();
            setHint("W/S 前后 · A/D 平移 · Q/E 转向");
          });
          (scene as THREE.Scene & { userData: { keys: typeof keys; camera: THREE.Camera } }).userData =
            { keys, camera };
          return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("keyup", onKey);
          };
        }}
        onFrame={({ scene, camera }, dt) => {
          const keys = (scene.userData as { keys?: Record<string, boolean> }).keys ?? {};
          const speed = 3.2;
          const turn = 1.6;
          if (keys["KeyQ"]) camera.rotation.y += turn * dt;
          if (keys["KeyE"]) camera.rotation.y -= turn * dt;
          const forward = new THREE.Vector3();
          camera.getWorldDirection(forward);
          forward.y = 0;
          forward.normalize();
          const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).negate();
          if (keys["KeyW"]) camera.position.addScaledVector(forward, speed * dt);
          if (keys["KeyS"]) camera.position.addScaledVector(forward, -speed * dt);
          if (keys["KeyA"]) camera.position.addScaledVector(right, -speed * dt);
          if (keys["KeyD"]) camera.position.addScaledVector(right, speed * dt);
          camera.position.y = 1.4;
        }}
      />
      <p className="mt-3 font-mono text-sm text-primary">{hint}</p>
    </>
  );
}

function BillboardDemo() {
  return (
    <ThreeCanvas
      autoRender={false}
      onReady={({ scene, camera, renderer }) => {
        scene.background = new THREE.Color(0x0a0c10);
        camera.position.set(3, 2, 4);
        const ball = new THREE.Mesh(
          new THREE.SphereGeometry(0.55, 32, 32),
          new THREE.MeshStandardMaterial({ color: 0x049ef4 }),
        );
        ball.position.y = 0.55;
        scene.add(ball);
        const c = document.createElement("canvas");
        c.width = 256;
        c.height = 96;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = "rgba(10,12,16,0.85)";
        ctx.roundRect(0, 0, 256, 96, 16);
        ctx.fill();
        ctx.strokeStyle = "#049ef4";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = "#e8ecf2";
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("HELLO CUBE", 128, 56);
        const map = new THREE.CanvasTexture(c);
        map.colorSpace = THREE.SRGBColorSpace;
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({ map, transparent: true }),
        );
        sprite.scale.set(1.6, 0.6, 1);
        sprite.position.set(0, 1.5, 0);
        scene.add(sprite);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const d = new THREE.DirectionalLight(0xffffff, 1);
        d.position.set(3, 4, 2);
        scene.add(d);
        scene.add(new THREE.GridHelper(6, 12, 0x2a3344, 0x1a2230));
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        let raf = 0;
        let dead = false;
        const tick = () => {
          if (dead) return;
          raf = requestAnimationFrame(tick);
          ball.position.y = 0.55 + Math.sin(performance.now() * 0.002) * 0.15;
          sprite.position.y = ball.position.y + 0.95;
          controls.update();
          renderer.render(scene, camera);
        };
        tick();
        return () => {
          dead = true;
          cancelAnimationFrame(raf);
          controls.dispose();
          map.dispose();
        };
      }}
    />
  );
}

function GalleryDemo() {
  const [info, setInfo] = useState("点击展品推近 · 点空白恢复");
  const camTarget = useRef(new THREE.Vector3(0, 2.2, 7));
  const lookTarget = useRef(new THREE.Vector3(0, 1, 0));
  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera, canvas, renderer }) => {
          const bg = 0x0a0c10;
          scene.background = new THREE.Color(bg);
          scene.fog = new THREE.Fog(bg, 8, 22);
          camera.position.copy(camTarget.current);
          renderer.shadowMap.enabled = true;
          const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(24, 10),
            new THREE.MeshStandardMaterial({ color: 0x141a22, roughness: 0.9 }),
          );
          floor.rotation.x = -Math.PI / 2;
          floor.receiveShadow = true;
          scene.add(floor);
          const exhibits: THREE.Mesh[] = [];
          const specs = [
            { name: "Icosa", color: 0x049ef4, geo: new THREE.IcosahedronGeometry(0.5, 0), x: -3 },
            { name: "Knot", color: 0x6e63ff, geo: new THREE.TorusKnotGeometry(0.35, 0.12, 80, 12), x: 0 },
            { name: "Capsule", color: 0xe0b06a, geo: new THREE.CapsuleGeometry(0.3, 0.45, 6, 12), x: 3 },
          ];
          for (const s of specs) {
            const stand = new THREE.Mesh(
              new THREE.CylinderGeometry(0.5, 0.6, 0.4, 20),
              new THREE.MeshStandardMaterial({ color: 0x222936 }),
            );
            stand.position.set(s.x, 0.2, 0);
            stand.castShadow = true;
            stand.receiveShadow = true;
            scene.add(stand);
            const art = new THREE.Mesh(
              s.geo,
              new THREE.MeshStandardMaterial({ color: s.color, metalness: 0.4, roughness: 0.3 }),
            );
            art.position.set(s.x, 1.1, 0);
            art.castShadow = true;
            art.name = s.name;
            art.userData.home = new THREE.Vector3(s.x, 1.6, 2.2);
            scene.add(art);
            exhibits.push(art);
          }
          scene.add(new THREE.AmbientLight(0xffffff, 0.3));
          const key = new THREE.DirectionalLight(0xffffff, 1.2);
          key.position.set(4, 8, 3);
          key.castShadow = true;
          scene.add(key);
          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();
          const onClick = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObjects(exhibits);
            if (hits[0]) {
              const obj = hits[0].object as THREE.Mesh;
              const home = obj.userData.home as THREE.Vector3;
              camTarget.current.copy(home);
              lookTarget.current.set(obj.position.x, 1.1, 0);
              setInfo(`展品：${obj.name}`);
            } else {
              camTarget.current.set(0, 2.2, 7);
              lookTarget.current.set(0, 1, 0);
              setInfo("总览机位");
            }
          };
          canvas.addEventListener("pointerdown", onClick);
          (scene as THREE.Scene & { userData: { exhibits: THREE.Mesh[] } }).userData = {
            exhibits,
          };
          return () => canvas.removeEventListener("pointerdown", onClick);
        }}
        onFrame={({ scene, camera }, dt) => {
          const k = 1 - Math.exp(-3 * dt);
          camera.position.lerp(camTarget.current, k);
          camera.lookAt(lookTarget.current);
          const exhibits = (scene.userData as { exhibits?: THREE.Mesh[] }).exhibits ?? [];
          for (const e of exhibits) e.rotation.y += dt * 0.5;
        }}
      />
      <p className="mt-3 font-mono text-sm text-primary">{info}</p>
    </>
  );
}

function DragDemo() {
  const [label, setLabel] = useState("按住拖动方块");
  return (
    <>
      <ThreeCanvas
        autoRender={false}
        onReady={({ scene, camera, renderer, canvas }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(4, 5, 6);
          camera.lookAt(0, 0, 0);
          scene.add(new THREE.AmbientLight(0xffffff, 0.5));
          const d = new THREE.DirectionalLight(0xffffff, 1);
          d.position.set(3, 6, 2);
          scene.add(d);
          scene.add(new THREE.GridHelper(10, 20, 0x2a3344, 0x1a2230));
          const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0x049ef4 }),
          );
          mesh.position.y = 0.5;
          scene.add(mesh);
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();
          const hit = new THREE.Vector3();
          let dragging = false;
          const controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          const setPtr = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          };
          const onDown = (e: PointerEvent) => {
            setPtr(e);
            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObject(mesh);
            if (hits[0]) {
              dragging = true;
              controls.enabled = false;
              setLabel("拖动中…");
            }
          };
          const onMove = (e: PointerEvent) => {
            if (!dragging) return;
            setPtr(e);
            raycaster.setFromCamera(pointer, camera);
            if (raycaster.ray.intersectPlane(plane, hit)) {
              mesh.position.x = hit.x;
              mesh.position.z = hit.z;
              mesh.position.y = 0.5;
            }
          };
          const onUp = () => {
            if (dragging) {
              dragging = false;
              controls.enabled = true;
              setLabel(`位置 (${mesh.position.x.toFixed(1)}, ${mesh.position.z.toFixed(1)})`);
            }
          };
          canvas.addEventListener("pointerdown", onDown);
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
          let raf = 0;
          let dead = false;
          const tick = () => {
            if (dead) return;
            raf = requestAnimationFrame(tick);
            controls.update();
            renderer.render(scene, camera);
          };
          tick();
          return () => {
            dead = true;
            cancelAnimationFrame(raf);
            canvas.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            controls.dispose();
          };
        }}
      />
      <p className="mt-3 font-mono text-sm text-primary">{label}</p>
    </>
  );
}

function DayNightDemo() {
  const [t, setT] = useState(0.7);
  const refs = useRef<{
    sun?: THREE.DirectionalLight;
    amb?: THREE.AmbientLight;
    scene?: THREE.Scene;
  }>({});
  useEffect(() => {
    const { sun, amb, scene } = refs.current;
    if (!sun || !amb || !scene) return;
    sun.intensity = THREE.MathUtils.lerp(0.05, 1.35, t);
    sun.color.setHSL(0.12, 0.55, THREE.MathUtils.lerp(0.35, 0.85, t));
    sun.position.set(
      Math.cos(t * Math.PI) * 6,
      Math.sin(t * Math.PI) * 5 + 0.5,
      2,
    );
    amb.intensity = THREE.MathUtils.lerp(0.08, 0.4, t);
    (scene.background as THREE.Color).setHSL(
      0.6,
      0.35,
      THREE.MathUtils.lerp(0.02, 0.32, t),
    );
  }, [t]);
  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color().setHSL(0.6, 0.35, 0.25);
          camera.position.set(4, 3, 6);
          camera.lookAt(0, 0.5, 0);
          const ground = new THREE.Mesh(
            new THREE.CircleGeometry(8, 48),
            new THREE.MeshStandardMaterial({ color: 0x2a3344, roughness: 0.9 }),
          );
          ground.rotation.x = -Math.PI / 2;
          scene.add(ground);
          const house = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 1.2, 1.5),
            new THREE.MeshStandardMaterial({ color: 0x8a9099 }),
          );
          house.position.y = 0.6;
          scene.add(house);
          const amb = new THREE.AmbientLight(0xffffff, 0.3);
          const sun = new THREE.DirectionalLight(0xffe0b0, 1);
          sun.position.set(4, 5, 2);
          scene.add(amb, sun);
          refs.current = { sun, amb, scene };
        }}
      />
      <Controls>
        <SliderRow label="时间 (夜→昼)" value={t} min={0} max={1} onChange={setT} />
      </Controls>
    </>
  );
}

function TrailsDemo() {
  return (
    <ThreeCanvas
      onReady={({ scene, camera }) => {
        scene.background = new THREE.Color(0x05070c);
        camera.position.set(0, 4, 8);
        camera.lookAt(0, 0, 0);
        const ball = new THREE.Mesh(
          new THREE.SphereGeometry(0.25, 24, 24),
          new THREE.MeshStandardMaterial({ color: 0x049ef4, emissive: 0x113355 }),
        );
        scene.add(ball);
        const max = 50;
        const positions: THREE.Vector3[] = [];
        const geo = new THREE.BufferGeometry().setFromPoints(
          Array.from({ length: max }, () => new THREE.Vector3()),
        );
        const line = new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({ color: 0x6e63ff, transparent: true, opacity: 0.85 }),
        );
        scene.add(line);
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const d = new THREE.DirectionalLight(0xffffff, 1);
        d.position.set(2, 4, 3);
        scene.add(d);
        (scene as THREE.Scene & {
          userData: {
            ball: THREE.Mesh;
            positions: THREE.Vector3[];
            line: THREE.Line;
            t: number;
          };
        }).userData = { ball, positions, line, t: 0 };
      }}
      onFrame={({ scene }, dt) => {
        const u = scene.userData as {
          ball?: THREE.Mesh;
          positions?: THREE.Vector3[];
          line?: THREE.Line;
          t?: number;
        };
        if (!u.ball || !u.positions || !u.line) return;
        u.t = (u.t ?? 0) + dt;
        u.ball.position.set(
          Math.cos(u.t * 1.4) * 2.5,
          1 + Math.sin(u.t * 2.2) * 0.8,
          Math.sin(u.t * 1.1) * 2.5,
        );
        u.positions.push(u.ball.position.clone());
        if (u.positions.length > 50) u.positions.shift();
        u.line.geometry.setFromPoints(u.positions);
      }}
    />
  );
}

function MorphDemo() {
  const [blend, setBlend] = useState(0);
  const dataRef = useRef<{
    pos: Float32Array;
    a: Float32Array;
    b: Float32Array;
    geo: THREE.BufferGeometry;
  } | null>(null);

  useEffect(() => {
    const d = dataRef.current;
    if (!d) return;
    for (let i = 0; i < d.pos.length; i++) {
      d.pos[i] = THREE.MathUtils.lerp(d.a[i]!, d.b[i]!, blend);
    }
    d.geo.attributes.position!.needsUpdate = true;
    d.geo.computeVertexNormals();
  }, [blend]);

  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(2.4, 1.6, 2.8);
          const sphere = new THREE.SphereGeometry(0.9, 32, 24);
          const box = new THREE.BoxGeometry(1.4, 1.4, 1.4, 32, 24, 32);
          // match counts by using sphere as base and projecting box via same index count sample
          const base = sphere;
          const pos = (base.attributes.position!.array as Float32Array).slice();
          const a = pos.slice();
          const b = new Float32Array(pos.length);
          // map each sphere vertex toward a cube shell
          for (let i = 0; i < pos.length; i += 3) {
            const x = pos[i]!;
            const y = pos[i + 1]!;
            const z = pos[i + 2]!;
            const ax = Math.abs(x);
            const ay = Math.abs(y);
            const az = Math.abs(z);
            const m = Math.max(ax, ay, az) || 1;
            b[i] = (x / m) * 0.85;
            b[i + 1] = (y / m) * 0.85;
            b[i + 2] = (z / m) * 0.85;
          }
          void box;
          const mat = new THREE.MeshStandardMaterial({
            color: 0x6e63ff,
            metalness: 0.3,
            roughness: 0.35,
            flatShading: true,
          });
          const mesh = new THREE.Mesh(base, mat);
          scene.add(mesh);
          scene.add(new THREE.AmbientLight(0xffffff, 0.4));
          const d = new THREE.DirectionalLight(0xffffff, 1.2);
          d.position.set(3, 4, 2);
          scene.add(d);
          dataRef.current = {
            pos: base.attributes.position!.array as Float32Array,
            a,
            b,
            geo: base,
          };
        }}
        onFrame={({ scene }, dt) => {
          const m = scene.children.find((c) => (c as THREE.Mesh).isMesh) as
            | THREE.Mesh
            | undefined;
          if (m) m.rotation.y += dt * 0.35;
        }}
      />
      <Controls>
        <SliderRow label="morph t (球→方)" value={blend} min={0} max={1} onChange={setBlend} />
      </Controls>
    </>
  );
}

function MultiSelectDemo() {
  const [info, setInfo] = useState("单击单选 · Shift 多选");
  return (
    <>
      <ThreeCanvas
        onReady={({ scene, camera, canvas }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(5, 4, 6);
          camera.lookAt(0, 0.5, 0);
          scene.add(new THREE.AmbientLight(0xffffff, 0.45));
          const d = new THREE.DirectionalLight(0xffffff, 1);
          d.position.set(3, 5, 2);
          scene.add(d);
          scene.add(new THREE.GridHelper(8, 16, 0x2a3344, 0x1a2230));
          const meshes: THREE.Mesh[] = [];
          const colors = [0x049ef4, 0x6e63ff, 0xe0b06a, 0x40c090, 0xff6688];
          for (let i = 0; i < 5; i++) {
            const m = new THREE.Mesh(
              new THREE.BoxGeometry(0.9, 0.9, 0.9),
              new THREE.MeshStandardMaterial({ color: colors[i] }),
            );
            m.position.set((i - 2) * 1.3, 0.45, 0);
            m.name = `块${i + 1}`;
            scene.add(m);
            meshes.push(m);
          }
          const selected = new Set<THREE.Mesh>();
          const refresh = () => {
            for (const m of meshes) {
              (m.material as THREE.MeshStandardMaterial).emissive.setHex(
                selected.has(m) ? 0x224466 : 0x000000,
              );
            }
            setInfo(
              selected.size
                ? `已选 ${[...selected].map((m) => m.name).join("、")}`
                : "未选择",
            );
          };
          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();
          const onDown = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObjects(meshes);
            if (!hits[0]) {
              if (!e.shiftKey) {
                selected.clear();
                refresh();
              }
              return;
            }
            const obj = hits[0].object as THREE.Mesh;
            if (e.shiftKey) {
              if (selected.has(obj)) selected.delete(obj);
              else selected.add(obj);
            } else {
              selected.clear();
              selected.add(obj);
            }
            refresh();
          };
          canvas.addEventListener("pointerdown", onDown);
          return () => canvas.removeEventListener("pointerdown", onDown);
        }}
      />
      <p className="mt-3 font-mono text-sm text-primary">{info}</p>
    </>
  );
}

function SnapGridDemo() {
  const [label, setLabel] = useState("拖到网格点");
  return (
    <>
      <ThreeCanvas
        autoRender={false}
        onReady={({ scene, camera, renderer, canvas }) => {
          scene.background = new THREE.Color(0x0a0c10);
          camera.position.set(5, 6, 7);
          camera.lookAt(0, 0, 0);
          scene.add(new THREE.AmbientLight(0xffffff, 0.5));
          const d = new THREE.DirectionalLight(0xffffff, 1);
          d.position.set(3, 6, 2);
          scene.add(d);
          scene.add(new THREE.GridHelper(10, 20, 0x049ef4, 0x2a3344));
          const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.9, 0.9),
            new THREE.MeshStandardMaterial({ color: 0xe0b06a }),
          );
          mesh.position.set(0, 0.45, 0);
          scene.add(mesh);
          const cell = 1;
          const snap = (v: number) => Math.round(v / cell) * cell;
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();
          const hit = new THREE.Vector3();
          let dragging = false;
          const controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          const setPtr = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          };
          const onDown = (e: PointerEvent) => {
            setPtr(e);
            raycaster.setFromCamera(pointer, camera);
            if (raycaster.intersectObject(mesh)[0]) {
              dragging = true;
              controls.enabled = false;
            }
          };
          const onMove = (e: PointerEvent) => {
            if (!dragging) return;
            setPtr(e);
            raycaster.setFromCamera(pointer, camera);
            if (raycaster.ray.intersectPlane(plane, hit)) {
              mesh.position.x = snap(hit.x);
              mesh.position.z = snap(hit.z);
              mesh.position.y = 0.45;
              setLabel(`snap (${mesh.position.x}, ${mesh.position.z})`);
            }
          };
          const onUp = () => {
            dragging = false;
            controls.enabled = true;
          };
          canvas.addEventListener("pointerdown", onDown);
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
          let raf = 0;
          let dead = false;
          const tick = () => {
            if (dead) return;
            raf = requestAnimationFrame(tick);
            controls.update();
            renderer.render(scene, camera);
          };
          tick();
          return () => {
            dead = true;
            cancelAnimationFrame(raf);
            canvas.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            controls.dispose();
          };
        }}
      />
      <p className="mt-3 font-mono text-sm text-primary">{label}</p>
    </>
  );
}
