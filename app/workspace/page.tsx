import { WorkspaceForm } from "@/components/WorkspaceForm";

export const metadata = {
  title: "Workspace — ClarityFlow",
  description:
    "Paste your messy notes and get a clean Summary, Decisions, Action Items, Risks, and Priorities.",
};

export default function WorkspacePage() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-16">
      <WorkspaceForm />
    </section>
  );
}
