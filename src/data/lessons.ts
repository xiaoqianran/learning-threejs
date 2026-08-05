export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export type DemoKind =
  | "hello-cube"
  | "scene-setup"
  | "geometry"
  | "materials"
  | "lights"
  | "transform"
  | "texture"
  | "orbit"
  | "animation"
  | "raycast"
  | "shadows"
  | "particles"
  | "loaders"
  | "scene-graph"
  | "postfx"
  | "project"
  | "fog"
  | "helpers"
  | "instancing"
  | "dispose"
  | "colorspace"
  | "performance"
  | "r3f"
  | "capstone";

export type LessonBlock =
  | { type: "text"; title?: string; body: string }
  | { type: "code"; title?: string; lang?: string; code: string }
  | { type: "tip"; body: string }
  | { type: "demo"; kind: DemoKind; title: string; hint?: string }
  | { type: "quiz"; questions: QuizQuestion[] };

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  level: "入门" | "进阶" | "实战";
  track: "基础" | "进阶" | "实战" | "工程进阶";
  minutes: number;
  blocks: LessonBlock[];
};

export const LESSONS: Lesson[] = [
  {
    slug: "intro",
    title: "Three.js 是什么",
    summary: "认识 WebGL 封装、场景图思维，以及它解决的问题。",
    level: "入门",
    track: "基础",
    minutes: 6,
    blocks: [
      {
        type: "text",
        title: "一句话理解 Three.js",
        body: "Three.js 是一个跨浏览器的 3D 库，帮你用更友好的 API 驱动 WebGL / WebGPU。核心是：场景（Scene）+ 相机（Camera）+ 渲染器（Renderer）+ 物体（Mesh）。",
      },
      {
        type: "code",
        title: "最小的 Three.js 应用",
        lang: "ts",
        code: `import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(w, h)
document.body.appendChild(renderer.domElement)

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial(),
)
scene.add(mesh)
camera.position.z = 3

function tick() {
  requestAnimationFrame(tick)
  mesh.rotation.y += 0.01
  renderer.render(scene, camera)
}
tick()`,
      },
      {
        type: "demo",
        kind: "hello-cube",
        title: "动手：旋转立方体",
        hint: "这就是最经典的「Hello Cube」。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "i1",
            question: "Three.js 的最小渲染三件套是？",
            options: [
              "HTML / CSS / JS",
              "Scene / Camera / Renderer",
              "Vue / React / Angular",
              "Canvas2D / SVG / CSS3D",
            ],
            answer: 1,
            explain: "场景、相机、渲染器是渲染循环的核心。",
          },
          {
            id: "i2",
            question: "Mesh 通常由什么组成？",
            options: [
              "仅材质",
              "几何体 Geometry + 材质 Material",
              "仅纹理",
              "仅灯光",
            ],
            answer: 1,
            explain: "几何定义形状，材质定义外观。",
          },
        ],
      },
    ],
  },
  {
    slug: "scene-camera-renderer",
    title: "场景 · 相机 · 渲染器",
    summary: "透视/正交相机、像素比、背景色与渲染循环。",
    level: "入门",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "透视相机参数",
        body: "PerspectiveCamera(fov, aspect, near, far)。fov 是视野角度，aspect 通常是 canvas 宽/高，near/far 裁剪面之外的物体不会渲染。",
      },
      {
        type: "code",
        title: "相机与像素比",
        lang: "ts",
        code: `const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
camera.position.set(2, 2, 4)
camera.lookAt(0, 0, 0)

renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(w, h)
renderer.setClearColor(0x0a0c10)`,
      },
      {
        type: "demo",
        kind: "scene-setup",
        title: "动手：调整 FOV 与相机位置",
        hint: "拖动滑块，观察透视变化。",
      },
      {
        type: "tip",
        body: "移动端务必限制 setPixelRatio，否则 GPU 压力过大。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "s1",
            question: "near / far 的作用？",
            options: ["控制亮度", "裁剪可见深度范围", "控制雾", "设置抗锯齿"],
            answer: 1,
            explain: "在 near 与 far 之间的深度才会被绘制。",
          },
          {
            id: "s2",
            question: "aspect 一般取？",
            options: ["固定 16/9", "canvas 宽 / 高", "始终 1", "FOV / 100"],
            answer: 1,
            explain: "与画布比例一致才不会拉伸。",
          },
        ],
      },
    ],
  },
  {
    slug: "geometries",
    title: "几何体 Geometry",
    summary: "Box / Sphere / Plane / Torus，以及 BufferGeometry 概念。",
    level: "入门",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "内置几何体",
        body: "Three.js 提供大量内置几何：BoxGeometry、SphereGeometry、CylinderGeometry、TorusGeometry、PlaneGeometry 等。它们本质上都是 BufferGeometry 的顶点数据封装。",
      },
      {
        type: "code",
        title: "切换几何",
        lang: "ts",
        code: `const box = new THREE.BoxGeometry(1, 1, 1)
const sphere = new THREE.SphereGeometry(0.7, 32, 32)
const torus = new THREE.TorusGeometry(0.55, 0.2, 16, 48)
mesh.geometry = torus`,
      },
      {
        type: "demo",
        kind: "geometry",
        title: "动手：切换几何体",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "g1",
            question: "几何体主要描述？",
            options: ["颜色", "顶点与面（形状）", "灯光", "音频"],
            answer: 1,
            explain: "Geometry 管形状，Material 管外观。",
          },
          {
            id: "g2",
            question: "SphereGeometry 第二、三个参数常是？",
            options: ["颜色与透明度", "widthSegments / heightSegments", "near / far", "x / y"],
            answer: 1,
            explain: "分段数越高越圆滑，代价是更多三角形。",
          },
        ],
      },
    ],
  },
  {
    slug: "materials",
    title: "材质 Material",
    summary: "Basic / Lambert / Phong / Standard，理解光照响应差异。",
    level: "入门",
    track: "基础",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "常用材质",
        body: "MeshBasicMaterial 不受光；MeshLambertMaterial 漫反射；MeshPhongMaterial 有高光；MeshStandardMaterial 基于物理（PBR），配合 metalness / roughness 是现代默认选择。",
      },
      {
        type: "code",
        title: "PBR 材质",
        lang: "ts",
        code: `const mat = new THREE.MeshStandardMaterial({
  color: 0x049ef4,
  metalness: 0.4,
  roughness: 0.35,
})`,
      },
      {
        type: "demo",
        kind: "materials",
        title: "动手：对比材质与金属度",
      },
      {
        type: "tip",
        body: "Standard 需要灯光才能看清，Basic 不需要。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "m1",
            question: "不受光照影响的是？",
            options: [
              "MeshStandardMaterial",
              "MeshBasicMaterial",
              "MeshPhongMaterial",
              "MeshPhysicalMaterial",
            ],
            answer: 1,
            explain: "Basic 直接显示颜色/贴图。",
          },
          {
            id: "m2",
            question: "PBR 里 metalness 接近 1 表示？",
            options: ["更粗糙", "更像金属", "更透明", "更大体积"],
            answer: 1,
            explain: "金属度越高，越接近金属反射。",
          },
        ],
      },
    ],
  },
  {
    slug: "lights",
    title: "灯光 Lights",
    summary: "环境光、平行光、点光、聚光，以及辅助对象。",
    level: "入门",
    track: "基础",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "灯光类型",
        body: "AmbientLight 均匀提亮；DirectionalLight 像太阳；PointLight 像灯泡；SpotLight 像手电筒。真实感场景通常是「环境 + 主光 + 补光」。",
      },
      {
        type: "code",
        title: "经典三点光",
        lang: "ts",
        code: `scene.add(new THREE.AmbientLight(0xffffff, 0.35))
const key = new THREE.DirectionalLight(0xffffff, 1.2)
key.position.set(3, 5, 2)
scene.add(key)
const fill = new THREE.PointLight(0x88aaff, 0.6)
fill.position.set(-3, 1, 2)
scene.add(fill)`,
      },
      {
        type: "demo",
        kind: "lights",
        title: "动手：开关灯光与强度",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "l1",
            question: "DirectionalLight 特点？",
            options: [
              "从一点向四周衰减",
              "平行光线，类似太阳",
              "只能照亮贴图",
              "自动生成阴影无需开启",
            ],
            answer: 1,
            explain: "方向光光线平行，强度不随距离衰减。",
          },
          {
            id: "l2",
            question: "只有环境光时物体看起来？",
            options: ["有强烈高光", "几乎无明暗立体感", "自动产生阴影", "会消失"],
            answer: 1,
            explain: "环境光均匀，缺少方向性明暗。",
          },
        ],
      },
    ],
  },
  {
    slug: "transforms",
    title: "变换：位置 · 旋转 · 缩放",
    summary: "position / rotation / scale / lookAt 与本地坐标系。",
    level: "入门",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "Object3D 变换",
        body: "所有可加入场景的对象都继承 Object3D，具备 position、rotation（欧拉角）、quaternion、scale。旋转顺序默认 XYZ，复杂动画更推荐四元数。",
      },
      {
        type: "code",
        title: "变换示例",
        lang: "ts",
        code: `mesh.position.set(1, 0.5, 0)
mesh.rotation.y = Math.PI / 4
mesh.scale.set(1.2, 1, 1)
mesh.lookAt(0, 0, 0)`,
      },
      {
        type: "demo",
        kind: "transform",
        title: "动手：拖动变换参数",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "t1",
            question: "Math.PI 弧度等于？",
            options: ["90°", "180°", "45°", "360°"],
            answer: 1,
            explain: "π 弧度 = 180°。",
          },
          {
            id: "t2",
            question: "lookAt 的作用？",
            options: ["缩放物体", "让对象朝向目标点", "改材质", "删除子节点"],
            answer: 1,
            explain: "常用于相机与角色朝向。",
          },
        ],
      },
    ],
  },
  {
    slug: "textures",
    title: "纹理与贴图",
    summary: "TextureLoader、color map、wrap、repeat 与色彩空间。",
    level: "进阶",
    track: "进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "贴图基础",
        body: "用 TextureLoader 加载图片赋给 material.map。注意 colorSpace：颜色贴图用 SRGBColorSpace。可用 wrapS/wrapT 与 repeat 控制平铺。",
      },
      {
        type: "code",
        title: "加载贴图",
        lang: "ts",
        code: `const loader = new THREE.TextureLoader()
const map = loader.load('/wood.jpg')
map.colorSpace = THREE.SRGBColorSpace
map.wrapS = map.wrapT = THREE.RepeatWrapping
map.repeat.set(2, 2)
material.map = map`,
      },
      {
        type: "demo",
        kind: "texture",
        title: "动手：程序纹理与重复",
        hint: "这里用 Canvas 生成棋盘格纹理，免去外网图片。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "tx1",
            question: "颜色贴图推荐 colorSpace？",
            options: ["LinearSRGBColorSpace", "SRGBColorSpace", "NoColorSpace", "HSV"],
            answer: 1,
            explain: "颜色贴图用 sRGB，数据贴图通常用线性。",
          },
          {
            id: "tx2",
            question: "repeat.set(2,2) 效果？",
            options: ["放大两倍", "在 U/V 方向各平铺 2 次", "提高分辨率", "开启 mipmap"],
            answer: 1,
            explain: "需配合 RepeatWrapping。",
          },
        ],
      },
    ],
  },
  {
    slug: "controls",
    title: "轨道控制器 OrbitControls",
    summary: "拖拽旋转、缩放、平移，以及 damping 惯性。",
    level: "进阶",
    track: "进阶",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "addons 导入",
        body: "OrbitControls 来自 three/addons/controls/OrbitControls.js。在动画循环里调用 controls.update()，开启 enableDamping 会更顺滑。",
      },
      {
        type: "code",
        title: "接入控制器",
        lang: "ts",
        code: `import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 0.5, 0)

function tick() {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}`,
      },
      {
        type: "demo",
        kind: "orbit",
        title: "动手：拖拽场景",
        hint: "鼠标拖拽旋转，滚轮缩放。触屏可单指旋转、双指缩放。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "c1",
            question: "enableDamping 需要？",
            options: [
              "什么都不做",
              "每帧调用 controls.update()",
              "只用 setTimeout",
              "关闭渲染器",
            ],
            answer: 1,
            explain: "阻尼依赖每帧更新。",
          },
          {
            id: "c2",
            question: "OrbitControls 绑定在？",
            options: ["仅 Scene", "Camera + DOM 元素", "仅 Material", "仅 Light"],
            answer: 1,
            explain: "监听画布事件并驱动相机。",
          },
        ],
      },
    ],
  },
  {
    slug: "animation",
    title: "动画循环与 Clock",
    summary: "requestAnimationFrame、delta 时间、匀速旋转。",
    level: "进阶",
    track: "进阶",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "用 delta 做帧率无关动画",
        body: "不要写 rotation.y += 0.01（帧率不同速度不同）。用 Clock.getDelta() 乘以角速度。",
      },
      {
        type: "code",
        title: "Clock 用法",
        lang: "ts",
        code: `const clock = new THREE.Clock()
function tick() {
  const dt = clock.getDelta()
  mesh.rotation.y += dt * 1.2 // rad/s
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}`,
      },
      {
        type: "demo",
        kind: "animation",
        title: "动手：调节转速",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "a1",
            question: "getDelta() 返回？",
            options: ["总运行秒数", "距上一帧秒数", "帧率", "固定 16ms"],
            answer: 1,
            explain: "两帧间隔，单位秒。",
          },
          {
            id: "a2",
            question: "为何用 delta？",
            options: ["更省电", "不同刷新率下速度一致", "必须开阴影", "替代相机"],
            answer: 1,
            explain: "动画与显示器刷新率解耦。",
          },
        ],
      },
    ],
  },
  {
    slug: "raycasting",
    title: "射线拾取 Raycaster",
    summary: "鼠标点击选中 3D 物体，实现交互。",
    level: "进阶",
    track: "进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "从屏幕到 3D",
        body: "把鼠标坐标归一化到 [-1,1]，用 Raycaster.setFromCamera 发射射线，intersectObjects 返回交点列表。",
      },
      {
        type: "code",
        title: "点击检测",
        lang: "ts",
        code: `const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

function onClick(e: PointerEvent) {
  const rect = canvas.getBoundingClientRect()
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  const hits = raycaster.intersectObjects(meshes)
  if (hits[0]) highlight(hits[0].object)
}`,
      },
      {
        type: "demo",
        kind: "raycast",
        title: "动手：点击立方体",
        hint: "点击场景中的方块，它会高亮。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "r1",
            question: "pointer.y 为何要取负？",
            options: [
              "习惯",
              "屏幕 Y 向下、NDC Y 向上",
              "Three 强制",
              "与灯光有关",
            ],
            answer: 1,
            explain: "坐标系方向不同。",
          },
          {
            id: "r2",
            question: "intersectObjects 返回？",
            options: ["布尔", "按距离排序的交点数组", "材质列表", "相机矩阵"],
            answer: 1,
            explain: "最近交点通常是 [0]。",
          },
        ],
      },
    ],
  },
  {
    slug: "shadows",
    title: "阴影 Shadows",
    summary: "开启阴影、灯光阴影相机、接收与投射。",
    level: "进阶",
    track: "进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "阴影清单",
        body: "1) renderer.shadowMap.enabled = true\n2) light.castShadow = true\n3) mesh.castShadow / receiveShadow\n4) 调整 shadow.mapSize 与相机 frustum",
      },
      {
        type: "code",
        title: "开启阴影",
        lang: "ts",
        code: `renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

dirLight.castShadow = true
dirLight.shadow.mapSize.set(1024, 1024)

mesh.castShadow = true
ground.receiveShadow = true`,
      },
      {
        type: "demo",
        kind: "shadows",
        title: "动手：观察软阴影",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sh1",
            question: "阴影默认？",
            options: ["全部开启", "关闭，需手动启用", "仅手机开启", "仅 Basic 材质"],
            answer: 1,
            explain: "出于性能考虑默认关闭。",
          },
          {
            id: "sh2",
            question: "mapSize 越大？",
            options: ["阴影越糊", "阴影越清晰但更耗 GPU", "无关", "禁用阴影"],
            answer: 1,
            explain: "分辨率与性能权衡。",
          },
        ],
      },
    ],
  },
  {
    slug: "particles",
    title: "粒子系统 Points",
    summary: "BufferGeometry + PointsMaterial 做星空与特效。",
    level: "进阶",
    track: "进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "Points 简介",
        body: "用大量点表示粒子，比每个粒子一个 Mesh 高效得多。通过 attributes.position 写入顶点，用 PointsMaterial 控制大小与颜色。",
      },
      {
        type: "code",
        title: "星空粒子",
        lang: "ts",
        code: `const count = 2000
const positions = new Float32Array(count * 3)
for (let i = 0; i < count; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 20
  positions[i * 3 + 1] = (Math.random() - 0.5) * 20
  positions[i * 3 + 2] = (Math.random() - 0.5) * 20
}
const geo = new THREE.BufferGeometry()
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const points = new THREE.Points(
  geo,
  new THREE.PointsMaterial({ size: 0.05, color: 0x88ccff }),
)
scene.add(points)`,
      },
      {
        type: "demo",
        kind: "particles",
        title: "动手：粒子星空",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "p1",
            question: "粒子常用对象是？",
            options: ["Mesh", "Points", "Sprite only", "Bone"],
            answer: 1,
            explain: "Points 专为点云/粒子。",
          },
          {
            id: "p2",
            question: "position 数组长度通常是？",
            options: ["粒子数", "粒子数 × 3 (xyz)", "固定 100", "面数"],
            answer: 1,
            explain: "每个粒子 3 个浮点。",
          },
        ],
      },
    ],
  },
  {
    slug: "loaders",
    title: "模型加载 GLTF",
    summary: "GLTFLoader、异步加载与资源释放概念。",
    level: "进阶",
    track: "进阶",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "GLTF 是行业标准",
        body: "glTF / GLB 是 Web 3D 的首选格式。使用 GLTFLoader 异步加载，把 scene 加入你的场景。本课用程序化「伪模型」演示加载状态机。",
      },
      {
        type: "code",
        title: "加载 GLB",
        lang: "ts",
        code: `import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const loader = new GLTFLoader()
loader.load('/model.glb', (gltf) => {
  scene.add(gltf.scene)
}, undefined, (err) => console.error(err))`,
      },
      {
        type: "demo",
        kind: "loaders",
        title: "动手：模拟模型加载",
      },
      {
        type: "tip",
        body: "卸载场景时记得 dispose geometry / material / texture，避免 GPU 泄漏。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "ld1",
            question: "Web 上推荐的模型格式？",
            options: ["PSD", "glTF / GLB", "DOCX", "MP3"],
            answer: 1,
            explain: "体积小、支持 PBR 与动画。",
          },
          {
            id: "ld2",
            question: "load 第三个参数通常是？",
            options: ["进度回调", "相机", "灯光", "fog"],
            answer: 0,
            explain: "onProgress 可做加载条。",
          },
        ],
      },
    ],
  },
  {
    slug: "scene-graph",
    title: "场景图与父子关系",
    summary: "Group、本地/世界坐标、层级变换。",
    level: "实战",
    track: "实战",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "父子变换",
        body: "把子物体 add 到 Group 上，父节点旋转时子节点跟随。这是做太阳系、机械臂、角色骨骼的基础。",
      },
      {
        type: "code",
        title: "Group 层级",
        lang: "ts",
        code: `const pivot = new THREE.Group()
const planet = new THREE.Mesh(geo, mat)
planet.position.x = 2
pivot.add(planet)
scene.add(pivot)
// 旋转 pivot → 行星公转
pivot.rotation.y += dt`,
      },
      {
        type: "demo",
        kind: "scene-graph",
        title: "动手：行星公转",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sg1",
            question: "子物体 position 是？",
            options: ["永远世界坐标", "相对父节点的本地坐标", "屏幕像素", "UV"],
            answer: 1,
            explain: "本地坐标受父变换影响。",
          },
          {
            id: "sg2",
            question: "Group 的主要用途？",
            options: ["替代材质", "组织层级与整体变换", "提高 FOV", "压缩贴图"],
            answer: 1,
            explain: "场景图组织的核心容器。",
          },
        ],
      },
    ],
  },
  {
    slug: "postprocessing",
    title: "后期处理入门",
    summary: "EffectComposer 思路：RenderPass + 效果通道。",
    level: "实战",
    track: "实战",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "后期管线",
        body: "把 renderer.render 换成 composer.render，在中间插入 Bloom、FXAA、SSAO 等 Pass。本课用「简易辉光」模拟后期思路（屏幕外亮度叠加）。",
      },
      {
        type: "code",
        title: "Composer 骨架",
        lang: "ts",
        code: `import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.6, 0.4, 0.85))
// tick: composer.render()`,
      },
      {
        type: "demo",
        kind: "postfx",
        title: "动手：辉光强度",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "fx1",
            question: "EffectComposer 作用？",
            options: [
              "只改相机",
              "多通道后处理渲染管线",
              "加载模型",
              "替代 OrbitControls",
            ],
            answer: 1,
            explain: "把渲染结果再经效果链处理。",
          },
          {
            id: "fx2",
            question: "Bloom 主要增强？",
            options: ["阴影边缘", "高亮区域的发光感", "几何细节", "音频"],
            answer: 1,
            explain: "让亮部「溢出」发光。",
          },
        ],
      },
    ],
  },
  {
    slug: "project",
    title: "实战：迷你展厅",
    summary: "综合场景、灯光、阴影、控制器与拾取，完成作品闭环。",
    level: "实战",
    track: "实战",
    minutes: 15,
    blocks: [
      {
        type: "text",
        title: "作品清单",
        body: "一个合格的 Three.js 小作品通常包含：\n1. 清晰的场景构图与相机\n2. 至少一种 PBR 材质 + 灯光\n3. 阴影或环境氛围\n4. OrbitControls 或自定义交互\n5. 拾取 / UI 反馈\n6. 资源 dispose 与 resize 处理",
      },
      {
        type: "code",
        title: "Resize 模板",
        lang: "ts",
        code: `function onResize() {
  const w = el.clientWidth
  const h = el.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h, false)
}
window.addEventListener('resize', onResize)`,
      },
      {
        type: "demo",
        kind: "project",
        title: "动手：迷你展厅",
        hint: "拖拽环视，点击展品高亮并查看信息。",
      },
      {
        type: "tip",
        body: "做完后可以导出到独立 Vite 项目，或继续学 React Three Fiber。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pj1",
            question: "窗口尺寸变化时要更新？",
            options: [
              "仅 fog",
              "camera.aspect + updateProjectionMatrix + setSize",
              "仅颜色",
              "删除场景",
            ],
            answer: 1,
            explain: "否则画面拉伸或裁切错误。",
          },
          {
            id: "pj2",
            question: "离开页面时建议？",
            options: [
              "什么都不做",
              "cancelAnimationFrame 并 dispose 资源",
              "强制刷新",
              "关闭浏览器",
            ],
            answer: 1,
            explain: "防止内存/GPU 泄漏。",
          },
        ],
      },
    ],
  },
  // —— v2 工程进阶 ——
  {
    slug: "fog",
    title: "雾效与氛围 Fog",
    summary: "Fog / FogExp2 营造景深与体积感。",
    level: "进阶",
    track: "工程进阶",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "为什么要雾",
        body: "雾能把远景「化开」，既省性能（远物细节不重要），又增加电影感。背景色最好与 fog 颜色一致。",
      },
      {
        type: "code",
        title: "线性雾",
        lang: "ts",
        code: `scene.background = new THREE.Color(0x0a0c10)
scene.fog = new THREE.Fog(0x0a0c10, 4, 18)
// 或指数雾：new THREE.FogExp2(0x0a0c10, 0.08)`,
      },
      {
        type: "demo",
        kind: "fog",
        title: "动手：调节雾浓度",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "f1",
            question: "Fog 的 near/far 表示？",
            options: ["灯光范围", "雾开始/完全覆盖的距离", "贴图 UV", "阴影分辨率"],
            answer: 1,
            explain: "线性雾在 near 开始，far 处完全被雾盖住。",
          },
          {
            id: "f2",
            question: "背景色与 fog 颜色不一致会？",
            options: ["更快", "边缘出现色带/割裂感", "自动修复", "禁用阴影"],
            answer: 1,
            explain: "通常让 background ≈ fog.color。",
          },
        ],
      },
    ],
  },
  {
    slug: "helpers",
    title: "调试助手 Helpers",
    summary: "Axes / Grid / LightHelper，以及相机辅助。",
    level: "进阶",
    track: "工程进阶",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "开发期可视化",
        body: "AxesHelper、GridHelper、DirectionalLightHelper、CameraHelper 能快速暴露坐标系与灯光方向问题。上线前记得移除。",
      },
      {
        type: "code",
        title: "常用 helper",
        lang: "ts",
        code: `scene.add(new THREE.AxesHelper(2))
scene.add(new THREE.GridHelper(10, 20))
const h = new THREE.DirectionalLightHelper(dirLight, 0.5)
scene.add(h)`,
      },
      {
        type: "demo",
        kind: "helpers",
        title: "动手：开关辅助线",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "h1",
            question: "AxesHelper 红绿蓝轴通常对应？",
            options: ["RGB 灯光", "X / Y / Z", "UV / W", "FOV"],
            answer: 1,
            explain: "X 红、Y 绿、Z 蓝。",
          },
          {
            id: "h2",
            question: "生产环境 helper？",
            options: ["必须保留", "开发用，上线移除", "替代材质", "自动优化"],
            answer: 1,
            explain: "避免多余 draw call 与视觉干扰。",
          },
        ],
      },
    ],
  },
  {
    slug: "instancing",
    title: "实例化 InstancedMesh",
    summary: "用一次绘制渲染成千上万相同物体。",
    level: "进阶",
    track: "工程进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "为何需要实例化",
        body: "每个 Mesh 都有绘制开销。InstancedMesh 共享几何与材质，只变每个实例的矩阵/颜色，适合森林、人群、粒子块。",
      },
      {
        type: "code",
        title: "InstancedMesh 骨架",
        lang: "ts",
        code: `const mesh = new THREE.InstancedMesh(geo, mat, count)
const dummy = new THREE.Object3D()
for (let i = 0; i < count; i++) {
  dummy.position.set(...)
  dummy.updateMatrix()
  mesh.setMatrixAt(i, dummy.matrix)
}
mesh.instanceMatrix.needsUpdate = true
scene.add(mesh)`,
      },
      {
        type: "demo",
        kind: "instancing",
        title: "动手：千个方块实例",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "in1",
            question: "InstancedMesh 优势？",
            options: ["自动物理", "大幅减少 draw call", "更高分辨率贴图", "无需灯光"],
            answer: 1,
            explain: "一批实例一次绘制。",
          },
          {
            id: "in2",
            question: "改矩阵后需要？",
            options: ["重启浏览器", "instanceMatrix.needsUpdate = true", "删掉场景", "换相机"],
            answer: 1,
            explain: "通知 GPU 上传新矩阵。",
          },
        ],
      },
    ],
  },
  {
    slug: "dispose",
    title: "资源释放与泄漏",
    summary: "geometry / material / texture dispose，取消 rAF。",
    level: "进阶",
    track: "工程进阶",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "GPU 不会自动 GC",
        body: "JS 对象被回收 ≠ GPU 缓冲释放。路由切换、反复创建场景时必须 dispose，并 cancelAnimationFrame。",
      },
      {
        type: "code",
        title: "清理模板",
        lang: "ts",
        code: `function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const m = child as THREE.Mesh
    m.geometry?.dispose()
    const mat = m.material
    if (!mat) return
    for (const x of Array.isArray(mat) ? mat : [mat]) {
      // dispose maps...
      x.dispose()
    }
  })
}
cancelAnimationFrame(raf)
renderer.dispose()`,
      },
      {
        type: "demo",
        kind: "dispose",
        title: "动手：创建 / 销毁场景",
        hint: "反复点「重建」模拟路由切换；观察不会卡死。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "d1",
            question: "只把 mesh 从 scene 移除够吗？",
            options: ["够了", "不够，还需 dispose GPU 资源", "自动完成", "只删相机"],
            answer: 1,
            explain: "移除 ≠ 释放 GPU 内存。",
          },
          {
            id: "d2",
            question: "离开页时还要？",
            options: ["忽略", "cancelAnimationFrame + renderer.dispose", "强制 reload", "清空 localStorage"],
            answer: 1,
            explain: "停掉循环并释放渲染器。",
          },
        ],
      },
    ],
  },
  {
    slug: "color-space",
    title: "色彩管理",
    summary: "outputColorSpace、贴图 colorSpace、tone mapping。",
    level: "进阶",
    track: "工程进阶",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "为什么颜色发灰/过曝",
        body: "r152+ 默认线性工作流。颜色贴图用 SRGBColorSpace；渲染输出 renderer.outputColorSpace = SRGBColorSpace；可用 toneMapping 控制高光。",
      },
      {
        type: "code",
        title: "现代色彩设置",
        lang: "ts",
        code: `renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0
map.colorSpace = THREE.SRGBColorSpace`,
      },
      {
        type: "demo",
        kind: "colorspace",
        title: "动手：曝光与色调映射",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "cs1",
            question: "颜色贴图应设？",
            options: ["Linear", "SRGBColorSpace", "HSV", "不设置永远对"],
            answer: 1,
            explain: "颜色数据是 sRGB 编码。",
          },
          {
            id: "cs2",
            question: "toneMapping 作用？",
            options: ["改几何", "把 HDR 映射到可显示范围", "加载模型", "开阴影"],
            answer: 1,
            explain: "控制亮度曲线与观感。",
          },
        ],
      },
    ],
  },
  {
    slug: "performance",
    title: "性能优化清单",
    summary: "draw call、像素比、阴影、共享材质、剔除。",
    level: "实战",
    track: "工程进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "优先优化项",
        body: "1. 限制 pixelRatio ≤ 2\n2. 合并/实例化相同物体\n3. 阴影 mapSize 适中\n4. 共享 geometry/material\n5. 视锥外自动剔除（默认）\n6. 少用实时后处理",
      },
      {
        type: "code",
        title: "快速配置",
        lang: "ts",
        code: `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.shadowMap.enabled = true
// 阴影 512~1024 通常够用
// 同材质多物体 → InstancedMesh 或 merge`,
      },
      {
        type: "demo",
        kind: "performance",
        title: "动手：像素比与物体数量",
        hint: "拉高数量/像素比，感受帧时间压力（本 demo 显示估算负载）。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pf1",
            question: "移动端 pixelRatio 建议？",
            options: ["无限", "通常 cap 到 1.5~2", "必须 4", "设为 0"],
            answer: 1,
            explain: "像素翻倍填充率压力巨大。",
          },
          {
            id: "pf2",
            question: "相同树木 500 棵优先？",
            options: ["500 个 Mesh", "InstancedMesh", "500 个 Scene", "关掉相机"],
            answer: 1,
            explain: "实例化是标准解法。",
          },
        ],
      },
    ],
  },
  {
    slug: "r3f-map",
    title: "对照：React Three Fiber",
    summary: "命令式 Three → 声明式 R3F 的心智映射。",
    level: "实战",
    track: "工程进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "为何还要学原生 Three",
        body: "R3F 是 Three 的 React 渲染器。不会 Three 就只会「抄组件」；会 Three 才能读懂源码、写自定义 shader、排障。",
      },
      {
        type: "code",
        title: "对照写法",
        lang: "tsx",
        code: `// 原生
const mesh = new THREE.Mesh(geo, mat)
scene.add(mesh)
mesh.rotation.y += dt

// R3F
<mesh rotation-y={y}>
  <boxGeometry />
  <meshStandardMaterial color="#049ef4" />
</mesh>`,
      },
      {
        type: "demo",
        kind: "r3f",
        title: "动手：同一场景的「声明式」对照",
        hint: "左侧概念是 R3F 组件树，右侧仍是原生 Three 渲染（本站不强制装 R3F）。",
      },
      {
        type: "tip",
        body: "学完本站后，再装 @react-three/fiber + drei，会非常顺。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "rf1",
            question: "R3F 本质是？",
            options: ["新 3D 引擎", "Three.js 的 React 渲染器", "CSS 3D", "Blender 插件"],
            answer: 1,
            explain: "底层还是 three。",
          },
          {
            id: "rf2",
            question: "原生 Three 的 scene.add 对应 R3F？",
            options: ["useState", "JSX 树嵌套 / Canvas 子节点", "redux", "iframe"],
            answer: 1,
            explain: "父子关系用组件树表达。",
          },
        ],
      },
    ],
  },
  {
    slug: "pitfalls",
    title: "常见坑速查",
    summary: "黑屏、拉伸、不更新、灯光全黑、路径 base。",
    level: "实战",
    track: "工程进阶",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "黑屏 checklist",
        body: "1. 相机是否在物体内部/背后\n2. 有没有灯（Standard 材质）\n3. 有没有 render 循环\n4. canvas 尺寸是否为 0\n5. near/far 是否裁掉\n6. 材质颜色是否纯黑",
      },
      {
        type: "code",
        title: "GitHub Pages base",
        lang: "ts",
        code: `// vite.config.ts
base: '/learning-threejs/'
// 资源与路由都要带 base，否则 Pages 上 404`,
      },
      {
        type: "demo",
        kind: "helpers",
        title: "用 helper 定位坐标系问题",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pt1",
            question: "Standard 材质全黑常见原因？",
            options: ["没加灯光", "相机太远一定黑", "必须用 Basic", "Fog 强制"],
            answer: 0,
            explain: "PBR 材质依赖光照。",
          },
          {
            id: "pt2",
            question: "画面被拉扁？",
            options: ["换浏览器", "更新 camera.aspect + setSize", "删 fog", "关抗锯齿"],
            answer: 1,
            explain: "aspect 与画布不一致。",
          },
        ],
      },
    ],
  },
  {
    slug: "capstone",
    title: "毕业作品清单",
    summary: "可展示的 Three.js 作品验收标准。",
    level: "实战",
    track: "工程进阶",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "验收清单",
        body: "[ ] 有明确主题（展厅 / 产品 / 小游戏）\n[ ] 相机与构图舒服\n[ ] 至少 PBR + 灯光 + 阴影或氛围\n[ ] 一种交互（拾取 / 控制 / 动画）\n[ ] resize 正常\n[ ] 离开页 dispose\n[ ] README 写清操作方式\n[ ] 部署（Pages / Vercel）",
      },
      {
        type: "demo",
        kind: "capstone",
        title: "动手：作品预检场景",
        hint: "综合灯光、阴影、雾、拾取——当作作品骨架。",
      },
      {
        type: "tip",
        body: "作品 > 证书。把场景工坊调参结果抄进自己的仓库更有说服力。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "cp1",
            question: "作品最少应证明你会？",
            options: [
              "只会截图",
              "场景搭建 + 灯光材质 + 交互 + 工程清理",
              "只会改颜色",
              "只会用 CDN 示例",
            ],
            answer: 1,
            explain: "覆盖渲染管线与工程素养。",
          },
          {
            id: "cp2",
            question: "部署后资源 404 优先查？",
            options: ["天气", "base 路径与资源引用", "CPU 型号", "npm 版本 alone"],
            answer: 1,
            explain: "Pages 子路径最容易踩坑。",
          },
        ],
      },
    ],
  },
];

export const TRACKS = ["基础", "进阶", "实战", "工程进阶"] as const;

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonIndex(slug: string): number {
  return LESSONS.findIndex((l) => l.slug === slug);
}

export function getAdjacent(slug: string): {
  prev?: Lesson;
  next?: Lesson;
} {
  const i = getLessonIndex(slug);
  if (i < 0) return {};
  return {
    prev: i > 0 ? LESSONS[i - 1] : undefined,
    next: i < LESSONS.length - 1 ? LESSONS[i + 1] : undefined,
  };
}

export function getLessonsByTrack(track: Lesson["track"]) {
  return LESSONS.filter((l) => l.track === track);
}

export function getAllQuizQuestions(): Array<
  QuizQuestion & { lessonSlug: string; lessonTitle: string }
> {
  const out: Array<QuizQuestion & { lessonSlug: string; lessonTitle: string }> =
    [];
  for (const lesson of LESSONS) {
    for (const block of lesson.blocks) {
      if (block.type === "quiz") {
        for (const q of block.questions) {
          out.push({
            ...q,
            lessonSlug: lesson.slug,
            lessonTitle: lesson.title,
          });
        }
      }
    }
  }
  return out;
}

/** 速查表条目 */
export const CHEATSHEET: { title: string; items: { k: string; v: string }[] }[] = [
  {
    title: "最小闭环",
    items: [
      { k: "Scene", v: "容器，装一切" },
      { k: "Camera", v: "从哪看" },
      { k: "Renderer", v: "画到 canvas" },
      { k: "Mesh", v: "Geometry + Material" },
    ],
  },
  {
    title: "材质速记",
    items: [
      { k: "Basic", v: "不受光" },
      { k: "Lambert", v: "漫反射" },
      { k: "Phong", v: "高光" },
      { k: "Standard", v: "PBR 默认" },
    ],
  },
  {
    title: "灯光",
    items: [
      { k: "Ambient", v: "整体提亮" },
      { k: "Directional", v: "太阳/平行光" },
      { k: "Point", v: "灯泡" },
      { k: "Spot", v: "手电筒" },
    ],
  },
  {
    title: "工程必做",
    items: [
      { k: "pixelRatio", v: "Math.min(dpr, 2)" },
      { k: "resize", v: "aspect + setSize" },
      { k: "dispose", v: "geo/mat/tex + cancel rAF" },
      { k: "colorSpace", v: "输出 sRGB，颜色贴图 sRGB" },
    ],
  },
];
