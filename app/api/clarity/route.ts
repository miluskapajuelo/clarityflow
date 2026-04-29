import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import type { ClarityMode, ClarityOutput } from "@/lib/types";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompts";

const client = new OpenAI();

const DEMO_LIMIT = 2;
// In-memory counter per IP. Resets on server restart — intentional for demo mode.
const usageMap = new Map<string, number>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    decisions: { type: "array", items: { type: "string" } },
    actionItems: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
    priorities: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "decisions", "actionItems", "risks", "priorities"],
  additionalProperties: false,
};

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const used = usageMap.get(ip) ?? 0;

    if (used >= DEMO_LIMIT) {
      return NextResponse.json(
        { error: "Demo limit reached", demoLimit: true },
        { status: 429 },
      );
    }

    const { input, mode } = (await request.json()) as {
      input: string;
      mode: ClarityMode;
    };

    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    usageMap.set(ip, used + 1);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserMessage(input, mode) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "clarity_output",
          strict: true,
          schema: OUTPUT_SCHEMA,
        },
      },
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      throw new Error("No response from model");
    }

    const output = JSON.parse(text) as ClarityOutput;
    return NextResponse.json(output);
  } catch (error) {
    console.error("[/api/clarity]", error);
    return NextResponse.json(
      { error: "Failed to process your notes. Please try again." },
      { status: 500 },
    );
  }
}
