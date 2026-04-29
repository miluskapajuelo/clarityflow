"use client";

import * as React from "react";
import { CopyButton } from "./CopyButton";

type Tone = "summary" | "decisions" | "actions" | "risks" | "priorities";

interface ResultCardProps {
  title: string;
  tone: Tone;
  /** Either a single string (for summary) or an array of bullets. */
  content: string | string[];
  emptyHint?: string;
  className?: string;
}

const TONES: Record<
  Tone,
  { dot: string; pill: string; ring: string; icon: React.ReactNode }
> = {
  summary: {
    dot: "bg-slate-400",
    pill: "bg-slate-50 text-ink-muted border-slate-200",
    ring: "from-slate-50 to-white",
    icon: <Icon path="M4 6h16M4 12h16M4 18h10" />,
  },
  decisions: {
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ring: "from-emerald-50/40 to-white",
    icon: <Icon path="M5 13l4 4L19 7" />,
  },
  actions: {
    dot: "bg-indigo-500",
    pill: "bg-indigo-50 text-indigo-700 border-indigo-200",
    ring: "from-indigo-50/40 to-white",
    icon: <Icon path="M5 12h14M13 5l7 7-7 7" />,
  },
  risks: {
    dot: "bg-amber-500",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    ring: "from-amber-50/40 to-white",
    icon: (
      <Icon path="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    ),
  },
  priorities: {
    dot: "bg-rose-500",
    pill: "bg-rose-50 text-rose-700 border-rose-200",
    ring: "from-rose-50/40 to-white",
    icon: (
      <Icon path="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    ),
  },
};

function Icon({ path }: { path: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={path} />
    </svg>
  );
}

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function ResultCard({
  title,
  tone,
  content,
  emptyHint,
  className,
}: ResultCardProps) {
  const isList = Array.isArray(content);
  const isEmpty = isList ? (content as string[]).length === 0 : !content;

  const t = TONES[tone];

  function getTextForCopy() {
    if (isEmpty) return "";
    if (isList) {
      return (content as string[]).map((c) => `• ${c}`).join("\n");
    }
    return content as string;
  }

  return (
    <article
      className={cx(
        "group relative rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-cardHover transition-shadow overflow-hidden",
        className,
      )}
    >
      <div
        aria-hidden
        className={cx(
          "absolute inset-x-0 top-0 h-20 bg-gradient-to-b pointer-events-none",
          t.ring,
        )}
      />

      <div className="relative p-5 sm:p-6">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={cx(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                t.pill,
              )}
            >
              {t.icon}
              {title}
            </span>
          </div>
          <CopyButton getText={getTextForCopy} />
        </header>

        <div className="mt-4">
          {isEmpty ? (
            <p className="text-sm text-ink-subtle italic">
              {emptyHint ?? "Nothing here yet."}
            </p>
          ) : isList ? (
            <ul className="space-y-2.5">
              {(content as string[]).map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm text-ink leading-relaxed"
                >
                  <span
                    aria-hidden
                    className={cx(
                      "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                      t.dot,
                    )}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink leading-relaxed">
              {content as string}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
