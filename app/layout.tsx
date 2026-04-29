import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "ClarityFlow — Turn messy thoughts into clear next steps",
  description:
    "Paste your messy notes, brainstorms, or meeting thoughts and get clean summaries, decisions, action items, risks, and priorities — instantly.",
  metadataBase: new URL("https://clarityflow.local"),
  openGraph: {
    title: "ClarityFlow",
    description:
      "Turn messy thoughts into clear decisions and next steps.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans text-ink antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
