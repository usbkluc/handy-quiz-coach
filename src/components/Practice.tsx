import { useMemo, useState } from "react";
import { questions, topicById, type Point, type Question } from "@/data/biologia7";
import { checkDrawing, checkText, missingWords, PASS } from "@/lib/check";
import { getProgress, recordAnswer } from "@/lib/store";
import { DrawPad } from "./DrawPad";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

type Props = {
  nick: string;
  topicId: string | "mix" | "chyby";
  onExit: () => void;
};

export function Practice({ nick, topicId, onExit }: Props) {
  const pool = useMemo(() => {
    if (topicId === "mix") return shuffle(questions);
    if (topicId === "chyby") {
      const m = getProgress(nick).mistakes;
      return shuffle(questions.filter((q) => m[q.id]));
    }
    return shuffle(questions.filter((q) => q.topic === topicId));
  }, [topicId, nick]);

  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [choice, setChoice] = useState<number | null>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [result, setResult] = useState<{ ok: boolean; score: number; missing: string[] } | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });

  if (pool.length === 0) {
    return (
      <Card>
        <p className="text-lg font-medium">Tu nič nie je 🎉</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Nemáš žiadne uložené chyby na opakovanie.
        </p>
        <Btn onClick={onExit}>Späť</Btn>
      </Card>
    );
  }

  if (i >= pool.length) {
    return (
      <Card>
        <p className="text-2xl font-bold">Hotovo!</p>
        <p className="mt-2 text-muted-foreground">
          Správne {score.ok} z {score.total}
        </p>
        <Btn onClick={onExit}>Späť do menu</Btn>
      </Card>
    );
  }

  const q = pool[i]!;

  const evaluate = () => {
    let s = 0;
    if (q.kind === "text") s = checkText(text, [q.answer, ...(q.alt ?? [])]);
    if (q.kind === "choice") s = choice === q.correct ? 1 : 0;
    if (q.kind === "draw") s = checkDrawing(strokes, q.shape);
    const ok = s >= PASS;
    const missing =
      q.kind === "text" && !ok ? missingWords(text, [q.answer, ...(q.alt ?? [])]) : [];
    setResult({ ok, score: s, missing });
    setScore((p) => ({ ok: p.ok + (ok ? 1 : 0), total: p.total + 1 }));
    recordAnswer(nick, q.id, ok);
  };

  const next = () => {
    setResult(null);
    setText("");
    setChoice(null);
    setStrokes([]);
    setI((v) => v + 1);
  };

  return (
    <Card>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {i + 1} / {pool.length} · {topicById(q.topic)?.title}
        </span>
        <button onClick={onExit} className="underline">
          Ukončiť
        </button>
      </div>

      <h2 className="mt-3 text-xl font-semibold">{q.prompt}</h2>

      <div className="mt-4 space-y-3">
        {q.kind === "text" && (
          <textarea
            autoFocus
            value={text}
            disabled={!!result}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !result && text && (e.preventDefault(), evaluate())}
            placeholder="Napíš odpoveď – môže byť aj celá veta, stačí spomenúť dôležité slová…"
            rows={3}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
          />
        )}

        {q.kind === "choice" &&
          q.options.map((o, idx) => (
            <button
              key={o}
              disabled={!!result}
              onClick={() => setChoice(idx)}
              className={`block w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                choice === idx
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-accent"
              }`}
            >
              {o}
            </button>
          ))}

        {q.kind === "draw" && (
          <>
            <p className="text-sm text-muted-foreground">{q.note}</p>
            <DrawPad
              strokes={strokes}
              onChange={setStrokes}
              disabled={!!result}
              showTarget={result ? q.shape : null}
            />
          </>
        )}
      </div>

      {result && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 ${
            result.ok ? "bg-primary/10 text-foreground" : "bg-destructive/10 text-foreground"
          }`}
        >
          <p className="font-semibold">
            {result.ok ? "Správne ✅" : "Zle ❌ – uložené na opakovanie"}
          </p>
          <p className="text-sm text-muted-foreground">
            Zhoda {Math.round(result.score * 100)} % (treba 70 %)
          </p>
          {q.kind === "text" && !result.ok && (
            <>
              {result.missing.length > 0 && (
                <p className="mt-1 text-sm font-medium text-destructive">
                  Chýbalo: {result.missing.join(", ")}
                </p>
              )}
              <p className="mt-1 text-sm">Správne: {q.answer}</p>
            </>
          )}
          {q.kind === "choice" && !result.ok && (
            <p className="mt-1 text-sm">Správne: {q.options[q.correct]}</p>
          )}
        </div>
      )}

      <div className="mt-5">
        {result ? (
          <Btn onClick={next}>Ďalšia</Btn>
        ) : (
          <Btn onClick={evaluate}>Skontrolovať</Btn>
        )}
      </div>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">{children}</div>
  );
}

function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
    >
      {children}
    </button>
  );
}

export type { Question };
