import type { ClarityMode, ClarityOutput } from "./types";

/**
 * Mock clarity generator.
 *
 * Produces a structured ClarityOutput from raw, messy text input.
 * This is intentionally local + deterministic-ish so the MVP works
 * without an API key. Replace `generateClarityOutput` with a server
 * action (or API route) that calls an LLM later — the function
 * signature is stable so callers won't need to change.
 *
 * Future: see `lib/ai/clarityProvider.ts` (not implemented yet) for
 * the boundary where the OpenAI/Anthropic call should live.
 */

// --- Helpers ---------------------------------------------------------------

const ACTION_VERBS = [
  "schedule",
  "send",
  "follow up",
  "review",
  "draft",
  "share",
  "decide",
  "ship",
  "ask",
  "confirm",
  "book",
  "write",
  "call",
  "email",
  "research",
  "plan",
  "outline",
  "finish",
  "complete",
  "submit",
  "study",
  "read",
  "memorize",
  "practice",
];

const RISK_SIGNALS = [
  "blocker",
  "blocked",
  "risk",
  "concern",
  "worried",
  "unsure",
  "unclear",
  "tight",
  "deadline",
  "delay",
  "depends",
  "dependency",
  "conflict",
  "issue",
  "problem",
  "bug",
  "missing",
  "overbudget",
];

const DECISION_SIGNALS = [
  "decided",
  "going with",
  "we'll",
  "we will",
  "let's",
  "let us",
  "agreed",
  "chosen",
  "picked",
  "go with",
  "stick with",
  "drop",
  "keep",
  "move forward",
];

const PRIORITY_SIGNALS = [
  "urgent",
  "asap",
  "today",
  "tomorrow",
  "this week",
  "by friday",
  "by monday",
  "important",
  "critical",
  "high priority",
  "must",
  "p0",
  "p1",
];

// Light "stopwords" so we can pick standout phrases for the summary
const STOPWORDS = new Set([
  "the","a","an","and","or","but","of","to","in","on","for","with","is","are",
  "was","were","be","been","being","i","we","you","they","he","she","it","this",
  "that","these","those","my","our","your","their","at","by","as","from","so",
  "if","then","than","too","also","just","very","really","kind","sort","like",
  "into","about","over","under","up","down","not","no","yes","do","does","did",
  "have","has","had","will","would","could","should","may","might","must","can",
  "make","made","get","got","go","going","come","came",
]);

function splitSentences(text: string): string[] {
  return text
    // normalize bullets / dashes / pipes into sentence breaks
    .replace(/[••·]+/g, ".")
    .replace(/\s[-–—]\s/g, ". ")
    .split(/(?<=[.!?])\s+|\n+/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function hasAny(haystack: string, needles: string[]): boolean {
  const h = haystack.toLowerCase();
  return needles.some((n) => h.includes(n));
}

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function trimSentence(s: string, maxLen = 160): string {
  const cleaned = s.replace(/\s+/g, " ").trim().replace(/[.!?,;:]+$/g, "");
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen - 1).trimEnd() + "…";
}

function capitalize(s: string): string {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}

// Pick top "topic" words by frequency for the summary
function topKeywords(text: string, k = 5): string[] {
  const counts = new Map<string, number>();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));

  for (const w of words) {
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([w]) => w);
}

// --- Mode-aware formatting -------------------------------------------------

function formatActionItem(s: string, mode: ClarityMode): string {
  const trimmed = trimSentence(s);
  const lower = trimmed.toLowerCase();
  const startsWithVerb = ACTION_VERBS.some((v) => lower.startsWith(v));
  const base = startsWithVerb ? trimmed : `Follow up on ${trimmed}`;

  switch (mode) {
    case "student":
      return capitalize(base.replace(/^Follow up on/i, "Review"));
    case "simple":
      return capitalize(base);
    case "professional":
    default:
      return capitalize(base);
  }
}

function formatRisk(s: string): string {
  const trimmed = trimSentence(s);
  return capitalize(trimmed);
}

function formatDecision(s: string): string {
  const trimmed = trimSentence(s);
  return capitalize(trimmed);
}

function buildSummary(
  text: string,
  sentences: string[],
  mode: ClarityMode,
): string {
  const keywords = topKeywords(text, 5);
  const head = sentences[0] ? trimSentence(sentences[0], 140) : "";
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const focus =
    keywords.length > 0
      ? keywords.slice(0, 3).join(", ")
      : "your notes";

  switch (mode) {
    case "student":
      return [
        head ? `Main idea: ${head}.` : "",
        `Key topics to remember: ${focus}.`,
        `Total length: ${wordCount} words across ${sentences.length} thoughts.`,
      ]
        .filter(Boolean)
        .join(" ");
    case "simple":
      return [
        head ? `In short: ${head}.` : "",
        `Main things mentioned: ${focus}.`,
      ]
        .filter(Boolean)
        .join(" ");
    case "professional":
    default:
      return [
        head ? `${head}.` : "",
        `Primary themes: ${focus}.`,
        `Scope: ${wordCount} words, ${sentences.length} discrete points.`,
      ]
        .filter(Boolean)
        .join(" ");
  }
}

// --- Categorization --------------------------------------------------------

function categorize(sentences: string[], mode: ClarityMode) {
  const decisions: string[] = [];
  const actionItems: string[] = [];
  const risks: string[] = [];
  const priorities: string[] = [];

  for (const raw of sentences) {
    const s = raw.trim();
    if (!s) continue;
    const lower = s.toLowerCase();

    let bucketed = false;

    if (hasAny(lower, RISK_SIGNALS)) {
      risks.push(formatRisk(s));
      bucketed = true;
    }

    if (hasAny(lower, DECISION_SIGNALS)) {
      decisions.push(formatDecision(s));
      bucketed = true;
    }

    if (hasAny(lower, PRIORITY_SIGNALS)) {
      priorities.push(formatRisk(s));
      bucketed = true;
    }

    // Action items: imperative-sounding or contains an action verb
    const startsWithVerb = ACTION_VERBS.some((v) => lower.startsWith(v));
    const containsActionable =
      ACTION_VERBS.some((v) => lower.includes(` ${v} `)) ||
      /\bneed(s)? to\b/.test(lower) ||
      /\bshould\b/.test(lower) ||
      /\btodo\b/.test(lower) ||
      /\bto[- ]do\b/.test(lower);

    if (startsWithVerb || containsActionable) {
      actionItems.push(formatActionItem(s, mode));
      bucketed = true;
    }

    // If a sentence didn't match anything but is meaningful, leave it for summary.
    if (!bucketed) {
      // no-op
    }
  }

  return {
    decisions: dedupe(decisions).slice(0, 6),
    actionItems: dedupe(actionItems).slice(0, 8),
    risks: dedupe(risks).slice(0, 6),
    priorities: dedupe(priorities).slice(0, 5),
  };
}

// Make sure each category has at least one helpful entry, even on light input
function ensureMinimums(
  output: Omit<ClarityOutput, "summary">,
  sentences: string[],
  mode: ClarityMode,
): Omit<ClarityOutput, "summary"> {
  const fallbackSentence =
    sentences.find((s) => s.length > 10) ?? sentences[0] ?? "";

  const result = { ...output };

  if (result.actionItems.length === 0 && fallbackSentence) {
    result.actionItems = [
      formatActionItem(`Review the notes about ${trimSentence(fallbackSentence, 80)}`, mode),
    ];
  }
  if (result.decisions.length === 0) {
    result.decisions = [
      mode === "student"
        ? "No firm decisions yet — flag this for your next study session."
        : "No clear decisions detected — confirm next steps with the team.",
    ];
  }
  if (result.risks.length === 0) {
    result.risks = [
      "No explicit risks noted. Re-read for unspoken assumptions or deadlines.",
    ];
  }
  if (result.priorities.length === 0 && result.actionItems.length > 0) {
    result.priorities = [`Top focus: ${result.actionItems[0]}`];
  } else if (result.priorities.length === 0) {
    result.priorities = ["Pick the single most important thing and start there."];
  }

  return result;
}

// --- Public API ------------------------------------------------------------

export function generateClarityOutput(
  input: string,
  mode: ClarityMode,
): ClarityOutput {
  const text = (input ?? "").trim();

  if (!text) {
    return {
      summary: "Nothing to summarize yet — paste your notes to get started.",
      decisions: [],
      actionItems: [],
      risks: [],
      priorities: [],
    };
  }

  const sentences = splitSentences(text);
  const summary = buildSummary(text, sentences, mode);
  const buckets = ensureMinimums(categorize(sentences, mode), sentences, mode);

  return {
    summary,
    decisions: buckets.decisions,
    actionItems: buckets.actionItems,
    risks: buckets.risks,
    priorities: buckets.priorities,
  };
}

export class DemoLimitError extends Error {
  constructor() {
    super("Demo limit reached");
    this.name = "DemoLimitError";
  }
}

export async function generateClarityOutputAsync(
  input: string,
  mode: ClarityMode,
): Promise<ClarityOutput> {
  const response = await fetch("/api/clarity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, mode }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if ((err as { demoLimit?: boolean }).demoLimit) {
      throw new DemoLimitError();
    }
    throw new Error(
      (err as { error?: string }).error ?? "Failed to process notes.",
    );
  }

  return response.json() as Promise<ClarityOutput>;
}
