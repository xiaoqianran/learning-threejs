# learning-threejs

Three.js 中文交互式教程 — 讲解 / 3D Demo / 测验 / 工程进阶。

参考 [learning-vue3](https://github.com/xiaoqianran/learning-vue3) 的产品结构。

**在线站点：** https://xiaoqianran.github.io/learning-threejs/

## v2 功能

- **25 节课程**：基础 → 进阶 → 实战 → **工程进阶**
- **真 3D 交互 Demo**：几何、材质、灯光、阴影、粒子、实例化、雾、拾取…
- **场景工坊**：实时调参（几何 / 材质 / 灯光）
- **代码沙盒**：浏览器内写 Three.js 并立即运行
- **速查表**：面试/写项目快速翻阅
- **测验 · 练习场 · 错题本 · 打卡 · 结业证明**（进度本地保存）

## 本地开发

```bash
npm install
npm run dev
```

## 脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建（Vercel） |
| `npm run build:pages` | GitHub Pages 静态构建 |
| `npm run typecheck` | TypeScript 检查 |

## 部署

推送 `main` 后，GitHub Actions 自动部署到 Pages（需在仓库 Settings → Pages 选择 **GitHub Actions** 作为源）。

## 技术栈

React 19 · TanStack Start / Router · Tailwind v4 · Three.js · Zustand

## License

MIT
