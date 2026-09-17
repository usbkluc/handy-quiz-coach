export type Point = { x: number; y: number };

export type Question =
  | {
      id: string;
      topic: string;
      kind: "text";
      prompt: string;
      answer: string;
      alt?: string[];
    }
  | {
      id: string;
      topic: string;
      kind: "choice";
      prompt: string;
      options: string[];
      correct: number;
    }
  | {
      id: string;
      topic: string;
      kind: "draw";
      prompt: string;
      shape: Point[][];
      note: string;
    };

export type Topic = {
  id: string;
  title: string;
  reading: string[];
};

export const topics: Topic[] = [
  {
    id: "povrch",
    title: "Povrch tela",
    reading: [
      "Koža slúži na ochranu tela.",
      "Vrstvy: pokožka, tuk (podkožné väzivo), zamša.",
      "Zo zamše vyrastá srsť, perie a kopytá.",
    ],
  },
  {
    id: "ryby",
    title: "Ryby",
    reading: [
      "Telo rýb kryjú šupiny pokryté slizom.",
      "Sliz znižuje trenie vo vode a chráni pred chorobami.",
      "Podľa letokruhov na šupine kapra určíme vek ryby.",
    ],
  },
  {
    id: "obojzivelniky",
    title: "Obojživelníky",
    reading: [
      "Majú slizkú kožu bez šupín.",
      "Koža môže vylučovať jed na obranu.",
      "Vlhká koža im pomáha aj pri dýchaní.",
    ],
  },
  {
    id: "plazy",
    title: "Plazy",
    reading: [
      "Kožu kryjú šupiny alebo štítky.",
      "Zvliekajú sa – v celku (hady) alebo po častiach (jaštery).",
    ],
  },
  {
    id: "vtaky",
    title: "Vtáky",
    reading: [
      "Časti pera: zástavica, kostrnka, brko, perútky.",
      "Zástavicu držia pohromade háčiky.",
      "Pŕchnutie = vymieňanie peria, väčšinou cez leto.",
      "Hrebeň na hrudnej kosti drží silné lietacie svaly.",
      "Behák je dlhá kosť nohy, slúži na odraz.",
    ],
  },
  {
    id: "cicavce",
    title: "Cicavce",
    reading: [
      "Telo kryje srsť: pesíky a jemná podsada (podsrsť).",
      "Pĺznutie = strácanie srsti pri výmene.",
    ],
  },
  {
    id: "oporna",
    title: "Oporná sústava",
    reading: [
      "Kostru tvorí: lebka, chrbtica, rebrá a končatiny.",
      "Chrbtica je os tela, rebrá chránia srdce a pľúca.",
    ],
  },
  {
    id: "kopytniky",
    title: "Kopytníky",
    reading: [
      "Párnokopytník stúpa na 2 kopytá (ratice), má zakrpatené prsty.",
      "Nepárnokopytník (kôň, zebra) stúpa na 1 prostredný prst s kopytom.",
    ],
  },
  {
    id: "svaly",
    title: "Pohybová sústava – svaly",
    reading: [
      "1. Priečne pruhované svaly: sú na kostre, ovládame ich vôľou, rýchlo sa unavia.",
      "2. Hladké svaly: vo vnútorných orgánoch, nevieme ich ovládať vôľou, unavia sa pomaly.",
      "3. Svalovina srdca: 2v1 – vyzerá ako priečne pruhovaný, funguje ako hladký sval.",
    ],
  },
];

const circle: Point[] = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 47) * Math.PI * 2;
  return { x: 0.5 + 0.34 * Math.cos(a), y: 0.5 + 0.34 * Math.sin(a) };
});

const spindle = (flip: number): Point[] =>
  Array.from({ length: 40 }, (_, i) => {
    const t = i / 39;
    return { x: 0.1 + 0.8 * t, y: 0.5 + flip * 0.22 * Math.sin(Math.PI * t) };
  });

export const questions: Question[] = [
  {
    id: "q1",
    topic: "povrch",
    kind: "text",
    prompt: "Na čo slúži koža?",
    answer: "ochrana",
    alt: ["ochrana tela", "chráni telo"],
  },
  {
    id: "q2",
    topic: "povrch",
    kind: "choice",
    prompt: "Z ktorej vrstvy kože vyrastá srsť, perie a kopytá?",
    options: ["Pokožka", "Tuk", "Zamša"],
    correct: 2,
  },
  {
    id: "q3",
    topic: "ryby",
    kind: "text",
    prompt: "Čo kryje telo rýb?",
    answer: "šupiny so slizom",
    alt: ["supiny", "šupiny"],
  },
  {
    id: "q4",
    topic: "ryby",
    kind: "text",
    prompt: "Čo určíme podľa letokruhov na šupine kapra?",
    answer: "vek",
    alt: ["vek ryby"],
  },
  {
    id: "q5",
    topic: "ryby",
    kind: "draw",
    prompt: "Nakresli tvar šupiny s letokruhom (kruh).",
    shape: [circle],
    note: "Stačí približný kruh.",
  },
  {
    id: "q6",
    topic: "obojzivelniky",
    kind: "choice",
    prompt: "Aká je koža obojživelníkov?",
    options: ["Slizká bez šupín", "So šupinami", "S perím"],
    correct: 0,
  },
  {
    id: "q7",
    topic: "obojzivelniky",
    kind: "text",
    prompt: "Čo môže koža obojživelníkov vylučovať?",
    answer: "jed",
  },
  {
    id: "q8",
    topic: "plazy",
    kind: "text",
    prompt: "Ako sa nazývajú veľké šupiny plazov?",
    answer: "štítky",
    alt: ["stitky"],
  },
  {
    id: "q9",
    topic: "plazy",
    kind: "choice",
    prompt: "Ako sa plazy zvliekajú?",
    options: ["Iba po častiach", "V celku alebo po častiach", "Nezvliekajú sa"],
    correct: 1,
  },
  {
    id: "q10",
    topic: "vtaky",
    kind: "text",
    prompt: "Ako sa volá plochá časť pera po stranách brka?",
    answer: "zástavica",
    alt: ["zastavica"],
  },
  {
    id: "q11",
    topic: "vtaky",
    kind: "text",
    prompt: "Čo drží perútky pera pohromade?",
    answer: "háčiky",
    alt: ["haciky", "hacky"],
  },
  {
    id: "q12",
    topic: "vtaky",
    kind: "text",
    prompt: "Ako sa volá výmena peria u vtákov?",
    answer: "pŕchnutie",
    alt: ["prchnutie"],
  },
  {
    id: "q13",
    topic: "vtaky",
    kind: "choice",
    prompt: "Na čo slúži hrebeň na hrudnej kosti?",
    options: [
      "Drží silné lietacie svaly",
      "Chráni mozog",
      "Pomáha pri trávení",
    ],
    correct: 0,
  },
  {
    id: "q14",
    topic: "vtaky",
    kind: "text",
    prompt: "Ako sa volá dlhá kosť nohy vtáka určená na odraz?",
    answer: "behák",
    alt: ["behak"],
  },
  {
    id: "q15",
    topic: "cicavce",
    kind: "text",
    prompt: "Ako sa volá jemná spodná vrstva srsti?",
    answer: "podsada",
    alt: ["podsrsť", "podsrst"],
  },
  {
    id: "q16",
    topic: "cicavce",
    kind: "text",
    prompt: "Ako sa volá strácanie srsti?",
    answer: "pĺznutie",
    alt: ["plznutie"],
  },
  {
    id: "q17",
    topic: "oporna",
    kind: "choice",
    prompt: "Čo NEpatrí do opornej sústavy?",
    options: ["Lebka", "Rebrá", "Pľúca", "Chrbtica"],
    correct: 2,
  },
  {
    id: "q18",
    topic: "oporna",
    kind: "draw",
    prompt: "Nakresli chrbticu – zvislú čiaru v strede.",
    shape: [
      [
        { x: 0.5, y: 0.1 },
        { x: 0.5, y: 0.9 },
      ],
    ],
    note: "Stačí približne zvislá čiara.",
  },
  {
    id: "q19",
    topic: "kopytniky",
    kind: "text",
    prompt: "Na koľko prstov (kopýt) stúpa párnokopytník?",
    answer: "2",
    alt: ["dva", "na dve kopytá", "2 kopytá"],
  },
  {
    id: "q20",
    topic: "kopytniky",
    kind: "choice",
    prompt: "Kôň a zebra sú:",
    options: ["Párnokopytníky", "Nepárnokopytníky"],
    correct: 1,
  },
  {
    id: "q21",
    topic: "svaly",
    kind: "choice",
    prompt: "Ktoré svaly ovládame vôľou?",
    options: ["Hladké", "Priečne pruhované", "Svalovina srdca"],
    correct: 1,
  },
  {
    id: "q22",
    topic: "svaly",
    kind: "text",
    prompt: "Kde sa nachádzajú hladké svaly?",
    answer: "vo vnútorných orgánoch",
    alt: ["vnutorne organy", "vnútorné orgány", "v organoch"],
  },
  {
    id: "q23",
    topic: "svaly",
    kind: "text",
    prompt: "Ktorý sval vyzerá ako priečne pruhovaný, ale funguje ako hladký?",
    answer: "svalovina srdca",
    alt: ["srdcovy sval", "srdce"],
  },
  {
    id: "q24",
    topic: "svaly",
    kind: "draw",
    prompt: "Nakresli tvar bunky hladkého svalu (vretenovitý tvar).",
    shape: [spindle(1), spindle(-1)],
    note: "Dve oblúkové čiary, ktoré sa na koncoch stretnú.",
  },
];

export const topicById = (id: string) => topics.find((t) => t.id === id);
