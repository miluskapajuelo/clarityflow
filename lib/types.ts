export type ClarityMode = "professional" | "student" | "simple";

export interface ClarityOutput {
  summary: string;
  decisions: string[];
  actionItems: string[];
  risks: string[];
  priorities: string[];
}

export interface ModeOption {
  id: ClarityMode;
  label: string;
  description: string;
  emoji?: string;
}

export const MODE_OPTIONS: ModeOption[] = [
  {
    id: "professional",
    label: "Professional",
    description: "Clear, concise, business-ready language.",
  },
  {
    id: "student",
    label: "Student",
    description: "Study-friendly with key takeaways.",
  },
  {
    id: "simple",
    label: "Simple",
    description: "Plain language, easy to scan.",
  },
];
