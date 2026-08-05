import { createFileRoute, Link } from "@tanstack/react-router";
import { LESSONS } from "@/data/lessons";
import { useProgress, todayKey } from "@/store/progress";
import { Button } from "@/components/ui/button";
import {
  Award,
  BookMarked,
  BookX,
  Download,
  Flame,
  StickyNote,
  Target,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";

export const Route = createFileRoute("/hub")({
  component: HubPage,
});

function HubPage() {
  const completed = useProgress((s) => s.completed);
  const quizScores = useProgress((s) => s.quizScores);
  const bookmarks = useProgress((s) => s.bookmarks);
  const notes = useProgress((s) => s.notes);
  const wrongBook = useProgress((s) => s.wrongBook);
  const streak = useProgress((s) => s.streak);
  const checkIns = useProgress((s) => s.checkIns);
  const checkInToday = useProgress((s) => s.checkInToday);
  const exportSnapshot = useProgress((s) => s.exportSnapshot);
  const importSnapshot = useProgress((s) => s.importSnapshot);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [noteQuery, setNoteQuery] = useState("");

  const noteEntries = Object.entries(notes)
    .filter(([, v]) => v.trim())
    .filter(([slug, text]) => {
      const q = noteQuery.trim().toLowerCase();
      if (!q) return true;
      const title = LESSONS.find((l) => l.slug === slug)?.title ?? slug;
      return (
        title.toLowerCase().includes(q) ||
        text.toLowerCase().includes(q) ||
        slug.includes(q)
      );
    });
  const avgScore =
    Object.keys(quizScores).length === 0
      ? null
      : Math.round(
          Object.values(quizScores).reduce((a, b) => a + b, 0) /
            Object.keys(quizScores).length,
        );
  const checkedIn = checkIns.includes(todayKey());

  function downloadProgress() {
    const data = exportSnapshot();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learning-threejs-progress-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("已导出进度 JSON");
  }

  async function onImportFile(file: File) {
    try {
      const text = await file.text();
      const json = JSON.parse(text) as unknown;
      const ok = importSnapshot(json);
      setMsg(ok ? "导入成功" : "文件格式不正确");
    } catch {
      setMsg("解析失败，请检查 JSON");
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          v5
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          学习中心
        </h1>
        <p className="mt-1 text-sm text-muted">
          进度、打卡、收藏、笔记与进度备份
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={Target}
          label="完成课程"
          value={`${completed.length}/${LESSONS.length}`}
        />
        <Stat icon={Flame} label="连续打卡" value={`${streak} 天`} />
        <Stat
          icon={BookMarked}
          label="收藏"
          value={String(bookmarks.length)}
        />
        <Stat icon={BookX} label="错题" value={String(wrongBook.length)} />
      </div>

      <section className="mt-6 rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold">每日打卡</h2>
            <p className="mt-0.5 text-sm text-muted">
              {checkedIn
                ? "今天已打卡，保持节奏！"
                : "点一下记录今日学习"}
            </p>
          </div>
          <Button onClick={() => checkInToday()} disabled={checkedIn}>
            {checkedIn ? "已打卡" : "打卡"}
          </Button>
        </div>
        {avgScore !== null ? (
          <p className="mt-3 font-mono text-xs text-muted">
            测验均分 {avgScore}%
          </p>
        ) : null}
      </section>

      <section className="mt-4 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-base font-semibold">进度备份</h2>
        <p className="mt-1 text-sm text-muted">
          导出 JSON 可换浏览器恢复；仅存本机，不上传服务器
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={downloadProgress}>
            <Download className="h-4 w-4" />
            导出进度
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" />
            导入进度
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onImportFile(f);
              e.target.value = "";
            }}
          />
        </div>
        {msg ? <p className="mt-2 text-xs text-primary">{msg}</p> : null}
      </section>

      {bookmarks.length > 0 ? (
        <section className="mt-4 rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-base font-semibold">收藏</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {bookmarks.map((slug) => {
              const l = LESSONS.find((x) => x.slug === slug);
              if (!l) return null;
              return (
                <li key={slug}>
                  <Link
                    to="/lesson/$slug"
                    params={{ slug }}
                    className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-fg no-underline hover:border-primary/40"
                  >
                    {l.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {(Object.entries(notes).filter(([, v]) => v.trim()).length > 0) ? (
        <section className="mt-4 rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold">
            <StickyNote className="h-4 w-4 text-primary" />
            笔记
          </h2>
          <input
            value={noteQuery}
            onChange={(e) => setNoteQuery(e.target.value)}
            placeholder="搜索笔记…"
            className="mb-3 h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm text-fg placeholder:text-subtle"
          />
          {noteEntries.length === 0 ? (
            <p className="text-sm text-muted">没有匹配的笔记</p>
          ) : (
          <ul className="space-y-3">
            {noteEntries.map(([slug, text]) => {
              const l = LESSONS.find((x) => x.slug === slug);
              return (
                <li
                  key={slug}
                  className="rounded-lg border border-border bg-surface-2 p-3"
                >
                  <Link
                    to="/lesson/$slug"
                    params={{ slug }}
                    className="text-sm font-medium text-primary no-underline"
                  >
                    {l?.title ?? slug}
                  </Link>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted">
                    {text}
                  </p>
                </li>
              );
            })}
          </ul>
          )}
        </section>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/certificate" className="no-underline">
          <Button variant="secondary">
            <Award className="h-4 w-4" />
            结业证明
          </Button>
        </Link>
        <Link to="/mistakes" className="no-underline">
          <Button variant="ghost">错题本</Button>
        </Link>
        <Link to="/path" className="no-underline">
          <Button variant="ghost">学习路径</Button>
        </Link>
        <Link to="/challenge" className="no-underline">
          <Button variant="ghost">每日挑战</Button>
        </Link>
        <Link to="/showcase" className="no-underline">
          <Button variant="ghost">作品秀</Button>
        </Link>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-xs text-muted">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
      <p className="mt-2 font-mono text-xl text-fg">{value}</p>
    </div>
  );
}
