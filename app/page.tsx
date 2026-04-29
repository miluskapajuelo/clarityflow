import Link from "next/link";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Button } from "@/components/Button";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />

      {/* Final CTA strip */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-24">
        <div className="rounded-2xl bg-gradient-to-br from-ink to-ink-soft text-white p-10 sm:p-14 shadow-cardHover overflow-hidden relative">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl"
          />

          <div className="relative max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Ready to clear the clutter?
            </h2>
            <p className="mt-4 text-white/75 text-base sm:text-lg leading-relaxed">
              Bring your messiest notes. We&apos;ll turn them into a clean,
              actionable plan in seconds.
            </p>
            <div className="mt-8">
              <Link href="/workspace">
                <Button size="lg" variant="secondary" rightIcon={<span aria-hidden>→</span>}>
                  Open the workspace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
