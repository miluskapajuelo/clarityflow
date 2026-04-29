# ClarityFlow

> Turn messy thoughts into clear decisions and next steps.

A polished MVP web app that converts unstructured notes, brainstorms, or meeting thoughts into a clean, actionable view: **Summary · Decisions · Action Items · Risks · Priorities**.

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS**
- No auth, no DB, no payments — pure client-side MVP

## Getting started

```bash
cd clarityflow
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```
clarityflow/
├── app/
│   ├── layout.tsx           # Root layout (nav + footer)
│   ├── page.tsx             # Landing page (Hero + HowItWorks + CTA)
│   ├── globals.css          # Tailwind + custom styles
│   └── workspace/
│       └── page.tsx         # /workspace route
├── components/
│   ├── Button.tsx
│   ├── Textarea.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── ModeSelector.tsx
│   ├── WorkspaceForm.tsx
│   ├── ResultCard.tsx
│   ├── ResultsPanel.tsx
│   └── CopyButton.tsx
├── lib/
│   ├── types.ts             # ClarityMode, ClarityOutput, ModeOption
│   └── generateClarity.ts   # Mock generator (swap for AI later)
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## How clarity is generated (MVP)

`lib/generateClarity.ts` exposes:

```ts
generateClarityOutput(input: string, mode: "professional" | "student" | "simple"): ClarityOutput
generateClarityOutputAsync(input, mode, { simulatedLatencyMs }): Promise<ClarityOutput>
```

Returning:

```ts
{
  summary: string;
  decisions: string[];
  actionItems: string[];
  risks: string[];
  priorities: string[];
}
```

The MVP version uses local heuristics (keyword/signal matching, sentence splitting, mode-aware formatting) so the app works fully offline with **zero API keys**.

## Wiring up real AI later

The `generateClarityOutputAsync` signature is the integration point. To plug in OpenAI/Anthropic/etc:

1. Create `app/api/clarity/route.ts` (a Next.js route handler).
2. Call your LLM there with a prompt that asks for a JSON object matching `ClarityOutput`.
3. Replace the body of `generateClarityOutputAsync` to `fetch("/api/clarity", ...)`.

No callers need to change — the type contract stays the same.

## Features in this MVP

- ✅ Three modes: Professional / Student / Simple (mode-aware output)
- ✅ Fully responsive (mobile-friendly)
- ✅ Accessible: semantic landmarks, focus-visible rings, radiogroup roles
- ✅ Premium SaaS look — soft canvas, gradient accents, rounded cards, subtle shadows

## License

MIT — for demo / MVP purposes.
