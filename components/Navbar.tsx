import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur bg-canvas/70 border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span
            aria-hidden
            className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 shadow-card transition-transform group-hover:scale-105"
          />
          <span className="font-semibold tracking-tight text-ink">
            ClarityFlow
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-ink-muted">
          <Link
            href="/#how-it-works"
            className="hover:text-ink transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/workspace"
            className="hover:text-ink transition-colors"
          >
            Workspace
          </Link>
        </nav>

        <Link
          href="/workspace"
          className="inline-flex items-center gap-1.5 rounded-full bg-ink text-white text-sm h-9 px-4 font-medium hover:bg-ink-soft transition-colors"
        >
          Start organizing
          <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}
