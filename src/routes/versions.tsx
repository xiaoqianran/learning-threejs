import { createFileRoute, Link } from "@tanstack/react-router";
import { VERSIONS, LESSONS } from "@/data/lessons";
import { GitBranch, Tag } from "lucide-react";

export const Route = createFileRoute("/versions")({
  component: VersionsPage,
});

function VersionsPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          版本线
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          v1 / v2 / v3 分支说明
        </h1>
        <p className="mt-1 text-sm text-muted">
          线上 Pages 始终部署 <code className="font-mono text-primary">main</code>
          （最新）。历史版本用 git 分支与 tag 冻结。
        </p>
      </header>

      <div className="space-y-3">
        {VERSIONS.map((v, i) => (
          <section
            key={v.id}
            className="rounded-xl border border-border bg-surface p-5 shadow-soft"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary-soft px-2.5 py-0.5 font-mono text-xs text-primary">
                {v.id}
              </span>
              {i === VERSIONS.length - 1 ? (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-fg">
                  当前 main
                </span>
              ) : null}
            </div>
            <h2 className="mt-2 font-display text-lg font-semibold text-fg">
              {v.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{v.summary}</p>
            <dl className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
              <div className="inline-flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono">{v.tag}</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono">{v.branch}</span>
              </div>
            </dl>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-border bg-surface-2 p-4">
        <h2 className="font-display text-base font-semibold">本地检出历史版</h2>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-code-bg p-3 font-mono text-[12px] text-code-fg whitespace-pre">{`# 冻结的 v1
git checkout v1
# 或
git checkout v1.0.0

# 回到最新
git checkout main`}</pre>
        <p className="mt-3 text-sm text-muted">
          当前课程总数：{LESSONS.length} ·{" "}
          <Link to="/" className="text-primary no-underline hover:underline">
            返回大纲
          </Link>
        </p>
      </section>
    </div>
  );
}
