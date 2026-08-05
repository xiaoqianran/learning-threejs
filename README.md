# learning-threejs

Three.js 中文交互式教程 — 讲解 / 3D Demo / 测验。

参考 [learning-vue3](https://github.com/xiaoqianran/learning-vue3) 的产品结构，把 Vue 学习路径换成 **Three.js / WebGL**。

## 功能

- **16 节课程**：基础 → 进阶 → 实战（Hello Cube 到迷你展厅）
- **真 3D 交互 Demo**：几何、材质、灯光、阴影、粒子、射线拾取、OrbitControls…
- **场景工坊**：实时调参（几何 / 材质 / 灯光）
- **代码沙盒**：在浏览器里写 Three.js 并立即运行
- **测验 · 练习场 · 错题本 · 打卡 · 结业证明**（进度本地保存）

## 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:8080

## 脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发服务器 `0.0.0.0:8080` |
| `npm run build` | 生产构建（Vercel） |
| `npm run build:pages` | GitHub Pages 静态构建 |
| `npm run typecheck` | TypeScript 检查 |

## 技术栈

React 19 · TanStack Start / Router · Tailwind v4 · Three.js · Zustand

## License

MIT
