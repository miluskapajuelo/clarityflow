export function Footer() {
  return (
    <footer className="border-t border-slate-100 mt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between text-sm text-ink-subtle">
        <span>© {new Date().getFullYear()} ClarityFlow</span>
        <span className="hidden sm:inline">
          Turn messy thoughts into clear next steps.
        </span>
      </div>
    </footer>
  );
}
