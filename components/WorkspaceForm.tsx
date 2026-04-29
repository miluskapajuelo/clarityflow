"use client";

import * as React from "react";
import { Button } from "./Button";
import { Textarea } from "./Textarea";
import { ModeSelector } from "./ModeSelector";
import { ResultsPanel } from "./ResultsPanel";
import { generateClarityOutputAsync } from "@/lib/generateClarity";
import type { ClarityMode, ClarityOutput } from "@/lib/types";

type ResultState = "idle" | "loading" | "ready" | "error";

const SAMPLE_NOTE = `Q3 launch retro — design review went OK but copy still feels off.
Decided to drop the dark mode for v1 to ship sooner.
Risk: API team is blocked on auth, depends on the SSO migration.
Need to follow up with Sara about pricing tiers by Friday.
Urgent: confirm Q3 budget with finance before Monday.
Let's also schedule a 30-min sync with marketing next week to align on launch copy.
Worried about onboarding — current funnel drops 40% at step 2.`;

export function WorkspaceForm() {
  const [input, setInput] = React.useState("");
  const [mode, setMode] = React.useState<ClarityMode>("professional");
  const [state, setState] = React.useState<ResultState>("idle");
  const [result, setResult] = React.useState<ClarityOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(
    null,
  );

  const wordCount = React.useMemo(
    () => input.trim().split(/\s+/).filter(Boolean).length,
    [input],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) {
      setValidationError("Please paste some notes first.");
      return;
    }

    setValidationError(null);
    setError(null);
    setState("loading");

    try {
      const out = await generateClarityOutputAsync(trimmed, mode);
      setResult(out);
      setState("ready");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't process your notes. Please try again.",
      );
      setState("error");
    }
  }

  function handleClear() {
    setInput("");
    setResult(null);
    setState("idle");
    setError(null);
    setValidationError(null);
  }

  function handleLoadSample() {
    setInput(SAMPLE_NOTE);
    setValidationError(null);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
      {/* Left: Input */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
            Workspace
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Paste your messy notes, pick a mode, and we&apos;ll structure them
            for you.
          </p>
        </div>

        <Textarea
          label="Your notes"
          placeholder="Paste meeting notes, brainstorms, or a brain-dump. The messier, the better."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (validationError) setValidationError(null);
          }}
          error={validationError}
          hint={
            input
              ? `${wordCount} word${wordCount === 1 ? "" : "s"}`
              : "Tip: don't worry about formatting — just dump your thoughts."
          }
          className="min-h-[260px]"
          disabled={state === "loading"}
        />

        <ModeSelector
          value={mode}
          onChange={setMode}
          disabled={state === "loading"}
        />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit" loading={state === "loading"} size="lg">
            {state === "loading" ? "Working on it…" : "Make it clear"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleLoadSample}
            disabled={state === "loading"}
          >
            Try sample
          </Button>

          {input && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleClear}
              disabled={state === "loading"}
            >
              Clear
            </Button>
          )}
        </div>
      </form>

      {/* Right: Results */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsPanel state={state} result={result} errorMessage={error} />
      </div>
    </div>
  );
}
