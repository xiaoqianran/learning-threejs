import { createFileRoute, Link } from "@tanstack/react-router";
import { CHEATSHEET, LESSONS } from "@/data/lessons";
import { BookMarked, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cheatsheet")({
  component: CheatsheetPage,
});

function CheatsheetPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <BookMarked className="h-3.5 w-3.5" />
          v2 · 速查
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          Three.js 速查表
        </h1>
        <p className="mt-1 text-sm text-muted">
          面试前 / 写项目时快速翻阅。详细讲解请回课程。
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {CHEATSHEET.map((section) => (
          <section
            key={section.title}
            className="rounded-xl border border-border bg-surface p-4 shadow-soft"
          >
            <h2 className="font-display text-sm font-semibold text-primary">
              {section.title}
            </h2>
            <dl className="mt-3 space-y-2">
              {section.items.map((item) => (
                <div
                  key={item.k}
                  className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 last:border-0 last:pb-0"
                >
                  <dt className="shrink-0 font-mono text-xs text-fg">{item.k}</dt>
                  <dd className="text-right text-xs text-muted">{item.v}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-border bg-surface-2 p-4">
        <h2 className="font-display text-base font-semibold text-fg">
          推荐学习顺序
        </h2>
        <ol className="mt-3 space-y-1.5">
          {LESSONS.slice(0, 8).map((l, i) => (
            <li key={l.slug}>
              <Link
                to="/lesson/$slug"
                params={{ slug: l.slug }}
                className="inline-flex items-center gap-2 text-sm text-muted no-underline hover:text-primary"
              >
                <span className="font-mono text-xs text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {l.title}
                <ArrowRight className="h-3 w-3 opacity-50" />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
