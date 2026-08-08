import {
  Award,
  BookMarked,
  BookOpen,
  BookX,
  Code2,
  FlaskConical,
  LayoutDashboard,
  Library,
  Map as MapIcon,
  Route,
  Server,
  Sparkles,
  Swords,
  type LucideIcon,
} from "lucide-react";
import type { Lesson } from "@/data/lessons";
import { LESSONS, TRACKS } from "@/data/lessons";

export const TRACK_META: Record<
  Lesson["track"],
  { order: number; label: string; blurb: string }
> = {
  基础: { order: 1, label: "① 入门", blurb: "场景 · 相机 · 网格 · 光照" },
  进阶: { order: 2, label: "② 进阶", blurb: "材质 · 纹理 · 动画 · 控制" },
  实战: { order: 3, label: "③ 实战", blurb: "小场景 · 交互 · 作品" },
  工程进阶: { order: 4, label: "④ 工程进阶", blurb: "性能 · 加载 · 后处理" },
  创意表现: { order: 5, label: "⑤ 创意表现", blurb: "粒子 · 着色 · 氛围" },
  交互进阶: { order: 6, label: "⑥ 交互进阶", blurb: "拾取 · 手势 · 物理" },
  作品收官: { order: 7, label: "⑦ 作品收官", blurb: "模板 · 导出 · 展示" },
};

export function trackLabel(track: string) {
  return (TRACK_META as Record<string, { label: string }>)[track]?.label ?? track;
}

export function orderedTracks(): Lesson["track"][] {
  return [...TRACKS].sort(
    (a, b) =>
      ((TRACK_META as Record<string, { order: number }>)[a]?.order ?? 99) -
      ((TRACK_META as Record<string, { order: number }>)[b]?.order ?? 99),
  );
}

export function getValidCompleted(completed: string[]): string[] {
  const set = new Set(LESSONS.map((l) => l.slug));
  return completed.filter((s) => set.has(s));
}

export function completedCount(completed: string[]): number {
  return getValidCompleted(completed).length;
}

export function progressPercent(completed: string[]): number {
  if (!LESSONS.length) return 0;
  return Math.round((completedCount(completed) / LESSONS.length) * 100);
}

export function isAllComplete(completed: string[]): boolean {
  return LESSONS.every((l) => completed.includes(l.slug));
}

export function getContinueLesson(completed: string[]): Lesson {
  return (
    LESSONS.find((l) => !completed.includes(l.slug)) ??
    LESSONS[LESSONS.length - 1]!
  );
}

export function getContinueHref(completed: string[]): {
  kind: "lesson" | "certificate";
  slug?: string;
} {
  if (isAllComplete(completed)) return { kind: "certificate" };
  return { kind: "lesson", slug: getContinueLesson(completed).slug };
}

export type NavItem = {
  to:
    | "/"
    | "/docs"
    | "/cheatsheet"
    | "/studio"
    | "/playground"
    | "/lab"
    | "/hub"
    | "/mistakes"
    | "/certificate"
    | "/path"
    | "/challenge"
    | "/showcase"
    | "/versions";
  label: string;
  hint?: string;
  icon: LucideIcon;
};

export const NAV_PRIMARY: NavItem[] = [
  { to: "/docs", label: "文档", hint: "查 · threejs.org 对照", icon: Library },
  { to: "/studio", label: "工坊", hint: "练 · 3D 闯关", icon: Server },
  { to: "/hub", label: "进度", hint: "我 · 学习中心", icon: LayoutDashboard },
];

export const NAV_TOOLS: NavItem[] = [
  { to: "/path", label: "学习路径", hint: "推荐顺序", icon: Route },
  { to: "/challenge", label: "挑战", hint: "限时练习", icon: Swords },
  { to: "/showcase", label: "作品秀", hint: "模板与展示", icon: Sparkles },
  { to: "/playground", label: "Playground", hint: "实时试验", icon: Code2 },
  { to: "/cheatsheet", label: "速查表", hint: "API 扫一眼", icon: BookMarked },
  { to: "/versions", label: "版本", hint: "three 版本说明", icon: MapIcon },
  { to: "/lab", label: "练习场", hint: "刷测验题", icon: FlaskConical },
  { to: "/mistakes", label: "错题本", hint: "错题重练", icon: BookX },
  { to: "/certificate", label: "结业证书", hint: "掌握后解锁", icon: Award },
];

export const NAV_HOME: NavItem = {
  to: "/",
  label: "学 · 首页",
  hint: "路径与大纲",
  icon: BookOpen,
};
