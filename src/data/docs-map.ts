/** 文档地图：threejs.org ⇄ 本站课 */
export type DocItem = {
  title: string;
  official: string;
  lessonSlug?: string;
  note?: string;
};

export type DocSection = {
  id: string;
  title: string;
  items: DocItem[];
};

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "llms",
    title: "官方 LLM 索引（有！）",
    items: [
      { title: "threejs.org/llms.txt", official: "https://threejs.org/llms.txt", note: "总索引" },
      { title: "docs/llms.txt", official: "https://threejs.org/docs/llms.txt", note: "API 文档索引" },
      { title: "R3F docs llms", official: "https://r3f.docs.pmnd.rs/llms.txt", note: "React Three Fiber" },
    ],
  },
  {
    id: "fundamentals",
    title: "Fundamentals",
    items: [
      { title: "Creating a scene", official: "https://threejs.org/docs/#manual/en/introduction/Creating-a-scene", lessonSlug: "scene-camera-renderer" },
      { title: "Drawing lines", official: "https://threejs.org/docs/#manual/en/introduction/Drawing-lines", lessonSlug: "geometries" },
      { title: "Materials", official: "https://threejs.org/docs/#api/en/materials/Material", lessonSlug: "materials" },
      { title: "Lights", official: "https://threejs.org/docs/#api/en/lights/Light", lessonSlug: "lights" },
      { title: "Object3D transforms", official: "https://threejs.org/docs/#api/en/core/Object3D", lessonSlug: "transforms" },
      { title: "Textures", official: "https://threejs.org/docs/#api/en/textures/Texture", lessonSlug: "textures" },
      { title: "Animation", official: "https://threejs.org/docs/#api/en/animation/AnimationMixer", lessonSlug: "animation" },
      { title: "Raycasting", official: "https://threejs.org/docs/#api/en/core/Raycaster", lessonSlug: "raycasting" },
      { title: "Shadows", official: "https://threejs.org/docs/#api/en/lights/shadows/LightShadow", lessonSlug: "shadows" },
      { title: "Loaders", official: "https://threejs.org/docs/#api/en/loaders/Loader", lessonSlug: "loaders" },
    ],
  },
  {
    id: "advanced",
    title: "Advanced",
    items: [
      { title: "Postprocessing", official: "https://threejs.org/docs/#examples/en/postprocessing/EffectComposer", lessonSlug: "postprocessing" },
      { title: "Instancing", official: "https://threejs.org/docs/#api/en/objects/InstancedMesh", lessonSlug: "instancing" },
      { title: "Fog", official: "https://threejs.org/docs/#api/en/scenes/Fog", lessonSlug: "fog" },
      { title: "Color management", official: "https://threejs.org/docs/#manual/en/introduction/Color-management", lessonSlug: "color-space" },
      { title: "Shaders", official: "https://threejs.org/docs/#api/en/materials/ShaderMaterial", lessonSlug: "shaders" },
      { title: "Environment maps", official: "https://threejs.org/docs/#api/en/scenes/Scene", lessonSlug: "env-map" },
      { title: "Performance", official: "https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects", lessonSlug: "performance" },
      { title: "Dispose", official: "https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects", lessonSlug: "dispose" },
    ],
  },
  {
    id: "ecosystem",
    title: "Ecosystem",
    items: [
      { title: "React Three Fiber", official: "https://r3f.docs.pmnd.rs/", lessonSlug: "r3f-map" },
      { title: "three.js examples", official: "https://threejs.org/examples/", note: "官方示例库" },
    ],
  },
];

export function docsCoverage() {
  const items = DOC_SECTIONS.flatMap((s) => s.items);
  const linked = items.filter((i) => i.lessonSlug).length;
  return { total: items.length, linked, pct: Math.round((linked / items.length) * 100) };
}
