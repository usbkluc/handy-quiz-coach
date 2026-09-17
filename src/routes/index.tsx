import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { topics, questions } from "@/data/biologia7";
import {
  currentUser,
  getProgress,
  login,
  logout,
  register,
  resetMistakes,
  type Progress,
} from "@/lib/store";
import { Practice } from "@/components/Practice";
import { Reading } from "@/components/Reading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Biológia 7 – Stavovce | Učenie a precvičovanie" },
      {
        name: "description",
        content:
          "Jednoduchá učebná appka na biológiu 7 – stavovce: čítanie s časovačom, otázky, kreslenie a opakovanie chýb.",
      },
      { property: "og:title", content: "Biológia 7 – Stavovce" },
      {
        property: "og:description",
        content: "Čítaj, precvičuj a opakuj si chyby z témy stavovce.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type View =
  | { name: "menu" }
  | { name: "read"; topic: string; minutes: number }
  | { name: "practice"; topic: string };

function App() {
  const [nick, setNick] = useState<string | null>(null);
  const [view, setView] = useState<View>({ name: "menu" });
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => setNick(currentUser()), []);
  useEffect(() => {
    if (nick) setProgress(getProgress(nick));
  }, [nick, view]);

  if (!nick) return <Auth onDone={(n) => setNick(n)} />;

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-5">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Biológia 7 – Stavovce</h1>
            <p className="text-sm text-muted-foreground">Ahoj, {nick} 👋</p>
          </div>
          <button
            onClick={() => {
              logout();
              setNick(null);
              setView({ name: "menu" });
            }}
            className="rounded-xl border border-border px-3 py-2 text-sm hover:bg-accent"
          >
            Odhlásiť sa
          </button>
        </header>

        {view.name === "menu" && (
          <Menu
            progress={progress}
            onRead={(topic, minutes) => setView({ name: "read", topic, minutes })}
            onPractice={(topic) => setView({ name: "practice", topic })}
            onClearMistakes={() => {
              resetMistakes(nick);
              setProgress(getProgress(nick));
            }}
          />
        )}

        {view.name === "read" && (
          <Reading
            topicId={view.topic}
            minutes={view.minutes}
            onDone={() => setView({ name: "practice", topic: view.topic })}
            onExit={() => setView({ name: "menu" })}
          />
        )}

        {view.name === "practice" && (
          <Practice
            nick={nick}
            topicId={view.topic}
            onExit={() => setView({ name: "menu" })}
          />
        )}
      </div>
    </div>
  );
}

function Auth({ onDone }: { onDone: (nick: string) => void }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  const go = (mode: "login" | "register") => {
    const res = mode === "login" ? login(name) : register(name);
    if (!res.ok) return setErr(res.error ?? "Chyba");
    onDone(name.trim());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-sm">
        <h1 className="text-2xl font-bold">Biológia 7</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stačí meno – žiadne heslo.
        </p>
        <input
          value={name}
          autoFocus
          onChange={(e) => {
            setName(e.target.value);
            setErr("");
          }}
          placeholder="Tvoj nick"
          className="mt-5 w-full rounded-xl border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
        />
        {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => go("login")}
            className="flex-1 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            Prihlásiť sa
          </button>
          <button
            onClick={() => go("register")}
            className="flex-1 rounded-xl border border-border px-4 py-3 font-medium hover:bg-accent"
          >
            Registrovať
          </button>
        </div>
      </div>
    </div>
  );
}

function Menu({
  progress,
  onRead,
  onPractice,
  onClearMistakes,
}: {
  progress: Progress | null;
  onRead: (topic: string, minutes: number) => void;
  onPractice: (topic: string) => void;
  onClearMistakes: () => void;
}) {
  const [topic, setTopic] = useState<string>("mix");
  const [minutes, setMinutes] = useState(3);
  const mistakes = progress ? Object.keys(progress.mistakes).length : 0;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">1. Vyber si učivo</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip active={topic === "mix"} onClick={() => setTopic("mix")}>
            Mix – všetko
          </Chip>
          {topics.map((t) => (
            <Chip key={t.id} active={topic === t.id} onClick={() => setTopic(t.id)}>
              {t.title}
            </Chip>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">2. Čítanie s časovačom</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[1, 3, 5, 10].map((m) => (
            <Chip key={m} active={minutes === m} onClick={() => setMinutes(m)}>
              {m} min
            </Chip>
          ))}
        </div>
        <button
          onClick={() => onRead(topic, minutes)}
          className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground hover:opacity-90"
        >
          Čítať {minutes} min
        </button>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">3. Precvičovanie</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Otázky: napíš odpoveď, vyber možnosť alebo nakresli. Uznáva sa od 70 % zhody.
        </p>
        <button
          onClick={() => onPractice(topic)}
          className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground hover:opacity-90"
        >
          Precvičovať
        </button>
        <button
          onClick={() => onPractice("chyby")}
          disabled={mistakes === 0}
          className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-medium hover:bg-accent disabled:opacity-40"
        >
          Opakovať moje chyby ({mistakes})
        </button>
        {mistakes > 0 && (
          <button
            onClick={onClearMistakes}
            className="mt-2 w-full text-sm text-muted-foreground underline"
          >
            Vymazať uložené chyby
          </button>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">Štatistika a stiahnutie</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Odpovedané: {progress?.answered ?? 0} · Správne: {progress?.correct ?? 0}
        </p>
        <button
          onClick={downloadNotes}
          className="mt-3 w-full rounded-xl border border-border px-4 py-3 font-medium hover:bg-accent"
        >
          Stiahnuť poznámky (.txt)
        </button>
      </section>
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

function downloadNotes() {
  const lines: string[] = ["BIOLÓGIA 7 – STAVOVCE", ""];
  for (const t of topics) {
    lines.push(`## ${t.title}`);
    for (const r of t.reading) lines.push(`- ${r}`);
    const qs = questions.filter((q) => q.topic === t.id);
    if (qs.length) {
      lines.push("Otázky:");
      for (const q of qs) {
        const ans =
          q.kind === "text" ? q.answer : q.kind === "choice" ? q.options[q.correct] : q.note;
        lines.push(`  ? ${q.prompt} → ${ans}`);
      }
    }
    lines.push("");
  }
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "biologia7-stavovce.txt";
  a.click();
  URL.revokeObjectURL(url);
}
