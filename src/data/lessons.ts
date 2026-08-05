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
  | "project";

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
  track: "基础" | "进阶" | "实战";
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
];

export const TRACKS = ["基础", "进阶", "实战"] as const;

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
