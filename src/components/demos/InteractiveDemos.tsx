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
        const light = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(light);
        return () => {};
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
          const grid = new THREE.GridHelper(8, 16, 0x049ef4, 0x2a3344);
          api.scene.add(grid);
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
          const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.9, 48, 48), mat);
          scene.add(mesh);
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
            new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.6, roughness: 0.25 }),
          );
          scene.add(mesh);
          const a = new THREE.AmbientLight(0xffffff, ambient);
          const d = new THREE.DirectionalLight(0xffffff, dir);
          d.position.set(3, 4, 2);
          scene.add(a, d);
          lightsRef.current = { a, d };
          const helper = new THREE.DirectionalLightHelper(d, 0.5);
          scene.add(helper);
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
          const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), mat);
          scene.add(mesh);
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
        controls.target.set(0, 0, 0);

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
            new THREE.MeshStandardMaterial({ color: 0x6e63ff, metalness: 0.5, roughness: 0.3 }),
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
            m.userData.baseColor = colors[i];
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
            } else {
              setPicked("未点中物体");
            }
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
          new THREE.MeshStandardMaterial({ color: 0x049ef4, metalness: 0.2, roughness: 0.3 }),
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
      onFrame={({ scene }, dt) => {
        const ball = scene.children.find(
          (c) => (c as THREE.Mesh).isMesh && (c as THREE.Mesh).geometry.type === "SphereGeometry",
        ) as THREE.Mesh | undefined;
        if (ball) {
          ball.position.y = 0.6 + Math.abs(Math.sin(performance.now() * 0.002)) * 0.8;
          void dt;
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
              while (g.children.length) {
                const c = g.children[0]!;
                g.remove(c);
              }
              const body = new THREE.Mesh(
                new THREE.BoxGeometry(1, 0.6, 1.4),
                new THREE.MeshStandardMaterial({ color: 0x049ef4, metalness: 0.4, roughness: 0.35 }),
              );
              body.position.y = 0.5;
              const cabin = new THREE.Mesh(
                new THREE.BoxGeometry(0.7, 0.45, 0.7),
                new THREE.MeshStandardMaterial({ color: 0xc8d4e0, metalness: 0.1, roughness: 0.2 }),
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

        const orbits = { earthOrbit, moonOrbit };
        (scene as THREE.Scene & { userData: typeof orbits }).userData = orbits;
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

          // Lightweight "bloom-like" pass: render bright additive ghost
          const ghost = mesh.clone();
          ghost.material = (mesh.material as THREE.MeshStandardMaterial).clone();
          (ghost.material as THREE.MeshStandardMaterial).transparent = true;
          (ghost.material as THREE.MeshStandardMaterial).opacity = 0.35;
          (ghost.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2;
          ghost.scale.setScalar(1.08);
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
            (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + b * 0.9;
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

          // Floor
          const floor = new THREE.Mesh(
            new THREE.CircleGeometry(6, 48),
            new THREE.MeshStandardMaterial({ color: 0x161b24, roughness: 0.85 }),
          );
          floor.rotation.x = -Math.PI / 2;
          floor.receiveShadow = true;
          scene.add(floor);

          // Pedestals + exhibits
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

          renderer.shadowMap.enabled = true;
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
