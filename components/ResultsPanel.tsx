"use client";

import * as React from "react";
import type { ClarityOutput } from "@/lib/types";
import { ResultCard } from "./ResultCard";
import { CopyButton } from "./CopyButton";

interface ResultsPanelProps {
  state: "idle" | "loading" | "ready" | "error" | "demo-limit";
  result: ClarityOutput | null;
  errorMessage?: string | null;
}

export function ResultsPanel({ state, result, errorMessage }: ResultsPanelProps) {
  if (state === "idle") {
    return <EmptyState />;
  }

  if (state === "loading") {
    return <LoadingState />;
  }

  if (state === "demo-limit") {
    return <DemoLimitBanner />;
  }

  if (state === "error") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-rose-700 text-sm">
        {errorMessage ?? "Something went wrong. Please try again."}
      </div>
    );
  }

  if (!result) return null;

  function fullPlainText() {
    if (!result) return "";
    const lines: string[] = [];
    lines.push("SUMMARY", result.summary, "");
    if (result.decisions.length) {
      lines.push("DECISIONS");
      result.decisions.forEach((d) => lines.push(`• ${d}`));
      lines.push("");
    }
    if (result.actionItems.length) {
      lines.push("ACTION ITEMS");
      result.actionItems.forEach((a) => lines.push(`• ${a}`));
      lines.push("");
    }
    if (result.risks.length) {
      lines.push("RISKS");
      result.risks.forEach((r) => lines.push(`• ${r}`));
      lines.push("");
    }
    if (result.priorities.length) {
      lines.push("PRIORITIES");
      result.priorities.forEach((p) => lines.push(`• ${p}`));
    }
    return lines.join("\n").trim();
  }

  return (
    <div className="space-y-5 animate-fadeUp">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-ink-muted uppercase tracking-wider">
          Your clarity
        </h2>
        <CopyButton getText={fullPlainText} label="Copy all" />
      </div>

      <ResultCard
        title="Summary"
        tone="summary"
        content={result.summary}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ResultCard
          title="Decisions"
          tone="decisions"
          content={result.decisions}
          emptyHint="No firm decisions detected."
        />
        <ResultCard
          title="Action Items"
          tone="actions"
          content={result.actionItems}
          emptyHint="No actionable items found."
        />
        <ResultCard
          title="Risks"
          tone="risks"
          content={result.risks}
          emptyHint="No risks called out."
        />
        <ResultCard
          title="Priorities"
          tone="priorities"
          content={result.priorities}
          emptyHint="Nothing flagged as urgent."
        />
      </div>
    </div>
  );
}

function DemoLimitBanner() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-8 text-center">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-amber-900">Demo limit reached</h3>
      <p className="mt-2 text-sm text-amber-700 max-w-xs mx-auto">
        You&apos;ve used your 2 free AI analyses. Full access is coming soon.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/40 p-10 text-center">
      <div
        aria-hidden
        className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-100 via-violet-100 to-pink-100 flex items-center justify-center text-accent"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink">
        Your structured output will appear here
      </h3>
      <p className="mt-2 text-sm text-ink-muted max-w-sm mx-auto">
        Paste your messy notes on the left, choose a mode, then click{" "}
        <span className="font-medium text-ink">Make it clear</span>.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-ink-muted uppercase tracking-wider">
          Thinking…
        </h2>
        <span className="text-xs text-ink-subtle">Organizing your thoughts</span>
      </div>

      <SkeletonCard lines={3} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
      </div>
    </div>
  );
}

function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-card p-5 sm:p-6">
      <div className="h-6 w-28 skeleton" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3.5 skeleton"
            style={{ width: `${65 + ((i * 13) % 30)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
