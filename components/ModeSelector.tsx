"use client";

import * as React from "react";
import { MODE_OPTIONS, type ClarityMode } from "@/lib/types";

interface ModeSelectorProps {
  value: ClarityMode;
  onChange: (mode: ClarityMode) => void;
  disabled?: boolean;
}

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function ModeSelector({ value, onChange, disabled }: ModeSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Clarity mode" className="flex flex-col gap-3">
      <label className="text-sm font-medium text-ink-soft">Clarity mode</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {MODE_OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option.id)}
              className={cx(
                "text-left rounded-xl2 px-4 py-3.5 border transition-all",
                "focus:outline-none",
                selected
                  ? "bg-accent-soft border-accent shadow-card"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                disabled && "opacity-60 cursor-not-allowed",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cx(
                    "text-sm font-semibold",
                    selected ? "text-accent" : "text-ink",
                  )}
                >
                  {option.label}
                </span>
                <span
                  aria-hidden
                  className={cx(
                    "h-4 w-4 rounded-full border-2 transition-all",
                    selected
                      ? "border-accent bg-accent"
                      : "border-slate-300 bg-white",
                  )}
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
