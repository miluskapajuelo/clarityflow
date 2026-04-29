import Link from "next/link";
import { Button } from "./Button";

export function Hero() {
  return (
    <section className="hero-bg">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-medium text-ink-muted shadow-card">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Now in MVP — free to use
        </span>

        <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] text-ink">
          Turn messy thoughts into{" "}
          <span className="text-gradient">clear next steps</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-ink-muted leading-relaxed">
          Paste your meeting notes, brainstorms, or scattered ideas — get a
          clean Summary, Decisions, Action Items, Risks, and Priorities in
          seconds.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/workspace">
            <Button size="lg" rightIcon={<span aria-hidden>→</span>}>
              Start organizing
            </Button>
          </Link>
          <Link href="/#how-it-works">
            <Button size="lg" variant="secondary">
              See how it works
            </Button>
          </Link>
        </div>

        <p className="mt-5 text-xs text-ink-subtle">
          No signup. No setup. Works in your browser.
        </p>

        {/* Hero preview card */}
        <div className="mt-14 sm:mt-20 mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white shadow-cardHover border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50/60">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="ml-3 text-xs text-ink-subtle">
                clarityflow / workspace
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100 text-left">
                <p className="text-xs uppercase tracking-wider text-ink-subtle font-medium">
                  Your messy notes
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Planning the next phase of a project, but a few things are still unclear. The general direction is defined,
                  but we need to finalize timelines and confirm priorities. I should follow up with the team to get updates
                  on pending tasks and make sure everyone is aligned. There’s also some concern about delays if key decisions
                  aren’t made soon. Need to organize what’s most important and decide what to focus on first.
                </p>
              </div>
              <div className="p-6 text-left bg-gradient-to-br from-white to-indigo-50/40">
                <p className="text-xs uppercase tracking-wider text-accent font-semibold">
                  Clarity
                </p>
                <ul className="mt-3 space-y-2.5 text-sm">
                  <li className="flex gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-ink">
                      <span className="font-medium">Decision:</span> Drop dark
                      mode for v1.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-500">→</span>
                    <span className="text-ink">
                      <span className="font-medium">Action:</span> Follow up
                      with Sara on pricing tiers by Friday.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500">!</span>
                    <span className="text-ink">
                      <span className="font-medium">Risk:</span> API team
                      blocked on auth.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-rose-500">★</span>
                    <span className="text-ink">
                      <span className="font-medium">Priority:</span> Confirm
                      budget with finance.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
