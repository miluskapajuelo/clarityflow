interface Step {
  n: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    n: "01",
    title: "Paste your messy notes",
    body: "Drop in raw meeting notes, brainstorms, or half-formed ideas. No formatting needed.",
  },
  {
    n: "02",
    title: "Choose your clarity mode",
    body: "Pick Professional, Student, or Simple to match your context and tone.",
  },
  {
    n: "03",
    title: "Get structured next steps",
    body: "Instantly see Summary, Decisions, Action Items, Risks, and Priorities — ready to act on.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28"
    >
      <div className="text-center">
        <p className="text-sm font-medium text-accent uppercase tracking-wider">
          How it works
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
          From mess to clarity in three steps
        </h2>
        <p className="mt-4 text-ink-muted max-w-xl mx-auto">
          ClarityFlow reads your raw notes and structures them into the things
          that actually matter.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((step, i) => (
          <div
            key={step.n}
            className="group relative rounded-2xl bg-white border border-slate-200 p-7 shadow-card hover:shadow-cardHover transition-shadow"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent font-semibold text-sm">
                {step.n}
              </span>
              <h3 className="font-semibold text-ink">{step.title}</h3>
            </div>
            <p className="mt-4 text-sm text-ink-muted leading-relaxed">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
