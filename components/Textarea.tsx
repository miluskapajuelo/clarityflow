"use client";

import * as React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string | null;
  containerClassName?: string;
}

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, hint, error, containerClassName, className, id, ...rest },
    ref,
  ) {
    const internalId = React.useId();
    const inputId = id ?? internalId;

    return (
      <div className={cx("flex flex-col gap-2", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-ink-soft"
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cx(
            "w-full resize-y rounded-2xl bg-white px-4 py-3.5",
            "border transition-colors duration-150",
            "placeholder:text-ink-subtle/80 text-ink",
            "shadow-card",
            error
              ? "border-rose-300 focus:border-rose-400"
              : "border-slate-200 focus:border-accent",
            "focus:outline-none",
            "min-h-[180px]",
            className,
          )}
          {...rest}
        />
        <div className="flex items-center justify-between text-xs">
          <span className={error ? "text-rose-600" : "text-ink-subtle"}>
            {error ?? hint ?? ""}
          </span>
        </div>
      </div>
    );
  },
);
