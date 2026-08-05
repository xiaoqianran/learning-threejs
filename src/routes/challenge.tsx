import { createFileRoute, Link } from "@tanstack/react-router";
import { getDailyChallenge, getLesson } from "@/data/lessons";
import { useProgress, todayKey } from "@/store/progress";
import { Button } from "@/components/ui/button";
import { Check, Flame, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/challenge")({
  component: ChallengePage,
});

function ChallengePage() {
  const challenge = useMemo(() => getDailyChallenge(), []);
  const lesson = getLesson(challenge.lessonSlug);
  const completedChallenges = useProgress((s) => s.completedChallenges);
  const markChallenge = useProgress((s) => s.markChallenge);
  const checkInToday = useProgress((s) => s.checkInToday);
  const streak = useProgress((s) => s.streak);

  const dayKey = `${todayKey()}:${challenge.id}`;
  const done = completedChallenges.includes(dayKey);
  const [checks, setChecks] = useState<boolean[]>(() =>
    challenge.checklist.map(() => false),
  );
  const allChecked = checks.every(Boolean);

  function toggle(i: number) {
    setChecks((prev) => prev.map((v, j) => (j === i ? !v : v)));
  }

  function complete() {
    if (!allChecked) return;
    markChallenge(dayKey);
    checkInToday();
  }

  return (
    <div className="mx-auto max-w-2xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Target className="h-3.5 w-3.5" />
          v5 · 每日挑战
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          {challenge.title}
        </h1>
        <p className="mt-1 text-sm text-muted">{challenge.brief}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-muted">
          <Flame className="h-3.5 w-3.5 text-primary" />
          连续打卡 {streak} 天 · 按日期轮换题目
        </p>
      </header>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-sm font-medium text-muted">验收清单</h2>
        <ul className="mt-3 space-y-2">
          {challenge.checklist.map((item, i) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => toggle(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                  checks[i]
                    ? "border-primary/40 bg-primary-soft text-fg"
                    : "border-border bg-surface-2 text-muted hover:text-fg",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    checks[i]
                      ? "bg-primary text-primary-fg"
                      : "bg-surface-3 text-subtle",
                  )}
                >
                  {checks[i] ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                {item}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          {lesson ? (
            <Link
              to="/lesson/$slug"
              params={{ slug: lesson.slug }}
              className="no-underline"
            >
              <Button variant="secondary">打开相关课程 · {lesson.title}</Button>
            </Link>
          ) : null}
          <Button onClick={complete} disabled={!allChecked || done}>
            {done ? "今日已完成" : "标记完成并打卡"}
          </Button>
        </div>
        {done ? (
          <p className="mt-3 text-sm text-primary">
            漂亮——保持节奏，明天还有新题。
          </p>
        ) : null}
      </section>

      <p className="mt-6 text-xs text-subtle">
        挑战与课程绑定，用于日更练习；完整体系仍以大纲 / 学习路径为准。
      </p>
    </div>
  );
}
