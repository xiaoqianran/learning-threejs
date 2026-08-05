import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LEARNING_PATHS,
  LESSONS,
  pathProgress,
  getLesson,
} from "@/data/lessons";
import { useProgress } from "@/store/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, Route as RouteIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/path")({
  component: PathPage,
});

function PathPage() {
  const completed = useProgress((s) => s.completed);

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <RouteIcon className="h-3.5 w-3.5" />
          v5 · 学习路径
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          按目标选路线
        </h1>
        <p className="mt-1 text-sm text-muted">
          不必按全部 40 课顺序硬啃——选一条路径冲刺
        </p>
      </header>

      <div className="space-y-4">
        {LEARNING_PATHS.map((path) => {
          const prog = pathProgress(path.slugs, completed);
          const nextSlug =
            path.slugs.find((s) => !completed.includes(s)) ?? path.slugs[0]!;
          const nextLesson = getLesson(nextSlug);
          return (
            <section
              key={path.id}
              className="rounded-xl border border-border bg-surface p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold text-fg">
                    {path.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{path.audience}</p>
                  <p className="mt-1 font-mono text-xs text-subtle">
                    约 {path.minutes} 分钟 · {path.slugs.length} 课
                  </p>
                </div>
                {nextLesson ? (
                  <Link
                    to="/lesson/$slug"
                    params={{ slug: nextLesson.slug }}
                    className="no-underline"
                  >
                    <Button size="sm">
                      {prog.done === prog.total ? "复习首课" : "继续"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : null}
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-300"
                  style={{ width: `${prog.pct}%` }}
                />
              </div>
              <p className="mt-1 font-mono text-xs text-muted">
                {prog.done}/{prog.total} · {prog.pct}%
              </p>

              <ol className="mt-4 flex flex-col gap-1.5">
                {path.slugs.map((slug, i) => {
                  const lesson = LESSONS.find((l) => l.slug === slug);
                  if (!lesson) return null;
                  const done = completed.includes(slug);
                  return (
                    <li key={slug}>
                      <Link
                        to="/lesson/$slug"
                        params={{ slug }}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm no-underline transition-colors hover:bg-surface-2",
                          done ? "text-muted" : "text-fg",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px]",
                            done
                              ? "bg-primary text-primary-fg"
                              : "bg-surface-3 text-muted",
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className="min-w-0 truncate">{lesson.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
