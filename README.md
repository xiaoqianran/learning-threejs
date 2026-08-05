# learning-threejs

Three.js 中文交互式教程 — 讲解 / 3D Demo / 测验 / 工程进阶 / 创意表现。

参考 [learning-vue3](https://github.com/xiaoqianran/learning-vue3)。

**在线：** https://xiaoqianran.github.io/learning-threejs/

## 版本分支（请保留）

| 版本 | Git tag | 分支 | 内容 |
| --- | --- | --- | --- |
| v1 | `v1.0.0` | `v1` | 16 课基础教程 |
| v2 | `v2.0.0` | `v2` | 工程进阶 + 速查表（25 课） |
| v3 | `v3.0.0` | `main` | 创意表现 + 工坊导出（最新） |

```bash
git checkout v1        # 或 v1.0.0
git checkout v2        # 或 v2.0.0
git checkout main      # 最新 v3
```

Pages 始终部署 **main**。

## 功能（v3）

- **31 节课程** 五条路径：基础 / 进阶 / 实战 / 工程进阶 / **创意表现**
- 真 3D Demo：EnvMap、Shader、运镜、第一人称、Sprite、作品走廊…
- 场景工坊：**一键导出代码**
- 代码沙盒 / 速查表 / 版本说明页
- 测验 · 练习场 · 错题本 · 打卡 · 结业

## 开发

```bash
npm install
npm run dev
```

| 命令 | 说明 |
| --- | --- |
| `npm run build` | Vercel 生产构建 |
| `npm run build:pages` | GitHub Pages 静态构建 |
| `npm run typecheck` | TS 检查 |

## License

MIT
