import { useEffect, useState } from "react";
import { topics } from "@/data/biologia7";

type Props = {
  topicId: string | "mix";
  minutes: number;
  onDone: () => void;
  onExit: () => void;
};

export function Reading({ topicId, minutes, onDone, onExit }: Props) {
  const list = topicId === "mix" ? topics : topics.filter((t) => t.id === topicId);
  const [left, setLeft] = useState(minutes * 60);

  useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="space-y-4">
      <div className="sticky top-0 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
        <span className="text-2xl font-bold tabular-nums">
          {mm}:{ss}
        </span>
        <div className="flex gap-2">
          <button onClick={onExit} className="rounded-lg border border-border px-3 py-2 text-sm">
            Späť
          </button>
          <button
            onClick={onDone}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          >
            Ísť precvičovať
          </button>
        </div>
      </div>

      {left === 0 && (
        <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm">
          Čas vypršal – poď si to precvičiť!
        </p>
      )}

      {list.map((t) => (
        <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-lg font-semibold text-primary">{t.title}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground/90">
            {t.reading.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
