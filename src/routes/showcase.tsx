import { createFileRoute, Link } from "@tanstack/react-router";
import { LESSONS } from "@/data/lessons";
import { InteractiveDemo } from "@/components/demos/InteractiveDemos";
import type { DemoKind } from "@/data/lessons";
import { LayoutGrid } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/showcase")({
  component: ShowcasePage,
});

const SHOWCASE: { kind: DemoKind; title: string; lesson?: string }[] = [
  { kind: "project", title: "迷你展厅", lesson: "project" },
  { kind: "gallery", title: "作品走廊", lesson: "gallery" },
  { kind: "shader", title: "Shader 波纹", lesson: "shaders" },
  { kind: "envmap", title: "金属反射", lesson: "env-map" },
  { kind: "particles", title: "粒子星空", lesson: "particles" },
  { kind: "drag", title: "拖拽交互", lesson: "drag-interact" },
  { kind: "day-night", title: "昼夜循环", lesson: "day-night" },
  { kind: "trails", title: "运动拖尾", lesson: "motion-trails" },
  { kind: "snap-grid", title: "网格吸附", lesson: "snap-grid" },
  { kind: "capstone", title: "毕业预检", lesson: "capstone" },
];

function ShowcasePage() {
  const [active, setActive] = useState(0);
  const item = SHOWCASE[active]!;
  const lesson = item.lesson
    ? LESSONS.find((l) => l.slug === item.lesson)
    : undefined;

  return (
    <div className="mx-auto max-w-4xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <LayoutGrid className="h-3.5 w-3.5" />
          v4 · 作品秀
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          精选 Demo 墙
        </h1>
        <p className="mt-1 text-sm text-muted">
          快速预览最有表现力的交互场景，点右侧可回对应课程
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {SHOWCASE.map((s, i) => (
          <button
            key={s.kind + s.title}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              active === i
                ? "bg-primary text-primary-fg"
                : "bg-surface-3 text-muted hover:text-fg",
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <InteractiveDemo kind={item.kind} title={item.title} />
      </div>

      {lesson ? (
        <p className="mt-4 text-sm text-muted">
          对应课程：{" "}
          <Link
            to="/lesson/$slug"
            params={{ slug: lesson.slug }}
            className="text-primary no-underline hover:underline"
          >
            {lesson.title}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
