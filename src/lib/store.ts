const USERS_KEY = "bio7_users";
const CURRENT_KEY = "bio7_current";

export type Progress = {
  answered: number;
  correct: number;
  mistakes: Record<string, number>;
};

type DB = Record<string, Progress>;

const emptyProgress = (): Progress => ({ answered: 0, correct: 0, mistakes: {} });

function read(): DB {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}") as DB;
  } catch {
    return {};
  }
}

function write(db: DB) {
  localStorage.setItem(USERS_KEY, JSON.stringify(db));
}

export function listUsers(): string[] {
  return Object.keys(read());
}

export function register(nick: string): { ok: boolean; error?: string } {
  const name = nick.trim();
  if (!name) return { ok: false, error: "Zadaj meno." };
  const db = read();
  if (db[name]) return { ok: false, error: "Toto meno už existuje, prihlás sa." };
  db[name] = emptyProgress();
  write(db);
  localStorage.setItem(CURRENT_KEY, name);
  return { ok: true };
}

export function login(nick: string): { ok: boolean; error?: string } {
  const name = nick.trim();
  const db = read();
  if (!db[name]) return { ok: false, error: "Toto meno neexistuje, zaregistruj sa." };
  localStorage.setItem(CURRENT_KEY, name);
  return { ok: true };
}

export function logout() {
  localStorage.removeItem(CURRENT_KEY);
}

export function currentUser(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT_KEY);
}

export function getProgress(nick: string): Progress {
  return read()[nick] ?? emptyProgress();
}

export function recordAnswer(nick: string, questionId: string, correct: boolean) {
  const db = read();
  const p = db[nick] ?? emptyProgress();
  p.answered += 1;
  if (correct) {
    p.correct += 1;
    if (p.mistakes[questionId]) {
      p.mistakes[questionId] -= 1;
      if (p.mistakes[questionId] <= 0) delete p.mistakes[questionId];
    }
  } else {
    p.mistakes[questionId] = (p.mistakes[questionId] ?? 0) + 1;
  }
  db[nick] = p;
  write(db);
}

export function resetMistakes(nick: string) {
  const db = read();
  const p = db[nick] ?? emptyProgress();
  p.mistakes = {};
  db[nick] = p;
  write(db);
}
