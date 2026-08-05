# learning-threejs

Three.js 中文交互式教程 — 讲解 / 3D Demo / 测验 / 工程 · 创意 · 交互。

**在线：** https://xiaoqianran.github.io/learning-threejs/

## 版本分支（请保留）

| 版本 | Git tag | 分支 | 内容 |
| --- | --- | --- | --- |
| v1 | `v1.0.0` | `v1` | 16 课基础教程 |
| v2 | `v2.0.0` | `v2` | 工程进阶 + 速查表 |
| v3 | `v3.0.0` | `v3` | 创意表现 + 工坊导出 |
| v4 | `v4.0.0` | `main` | 交互进阶 + 作品秀 + 进度导出（最新） |

```bash
git checkout v1   # 或 v1.0.0
git checkout v2
git checkout v3
git checkout main # 最新 v4
```

Pages 始终部署 **main**。

## 功能（v4）

- **37 节课程** · 六条路径（含交互进阶）
- 拖拽 / 昼夜 / 拖尾 / Morph / 多选 / 网格吸附
- **作品秀** 精选 Demo 墙
- 场景工坊导出代码 · 进度 JSON 导入导出
- 代码沙盒 / 速查表 / 版本说明

## 开发

```bash
npm install && npm run dev
```

| 命令 | 说明 |
| --- | --- |
| `npm run build` | Vercel |
| `npm run build:pages` | GitHub Pages |
| `npm run typecheck` | TS |

## License

MIT
