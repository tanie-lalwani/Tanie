import { NextResponse } from "next/server";
import { botKnowledgeEntries, type BotKnowledgeEntry } from "@/data/botKnowledge";

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "do", "does", "for", "has", "have",
  "her", "i", "is", "it", "me", "of", "on", "or", "she", "that", "the", "this",
  "to", "what", "who", "why", "with", "you"
]);

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeToken(value: string) {
  return value.endsWith("s") && value.length > 4 ? value.slice(0, -1) : value;
}

function isContactQuery(query: string) {
  return /\b(contact|email|mail|reach|hire|linkedin|github|instagram|x|twitter|social|google|gdev)\b/i.test(query);
}

function isGreetingQuery(query: string) {
  return /^(hi|hey|hello|yo|sup|hiya|heyy|hey lol|lol hi)\b/i.test(query.trim());
}

function isServiceQuery(query: string) {
  return /\b(do|does|can|could|would)\b.+\b(do|make|build|create|design|develop|offer|handle)\b/i.test(query);
}

function isSupportedServiceQuery(query: string) {
  return /\b(frontend|front end|website|web|react|typescript|portfolio|landing|app|ui|ux|3d|three|interactive|performance|checkout|responsive)\b/i.test(query);
}

function buildContactReply() {
  return "Use the contact form or email tanielalwani@gmail.com. Links: GitHub github.com/tanie-lalwani, LinkedIn linkedin.com/in/tanie-lalwani/, Instagram instagram.com/tanie.mp3, X x.com/tanielalwani, Google Developers me.developers.google.com/u/tanielalwani.";
}

function scoreEntry(query: string, entry: BotKnowledgeEntry) {
  const normalizedQuery = normalizeText(query);
  const queryTokens = new Set(
    normalizedQuery
      .split(" ")
      .map(normalizeToken)
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
  );
  const normalizedContent = normalizeText(entry.content);
  let score = 0;

  for (const keyword of entry.keywords) {
    const normalizedKeyword = normalizeText(keyword);
    const keywordTokens = normalizedKeyword.split(" ").map(normalizeToken);

    if (normalizedQuery.includes(normalizedKeyword) || keywordTokens.some((token) => queryTokens.has(token))) {
      score += Math.max(2, keyword.split(/\s+/).length);
    }
  }

  for (const token of queryTokens) {
    if (normalizedContent.includes(token)) {
      score += 1;
    }
  }

  return score;
}

function findRelevantKnowledge(query: string, limit = 6): BotKnowledgeEntry[] {
  return botKnowledgeEntries
    .map((entry) => ({ entry, score: scoreEntry(query, entry) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ entry }) => entry);
}

function buildFallbackReply(query: string) {
  if (isContactQuery(query)) return buildContactReply();
  if (isGreetingQuery(query)) return "Hey, I'm Tanie's portfolio bot. Ask me about her work, projects, skills, or contact info.";
  if (isServiceQuery(query)) {
    return isSupportedServiceQuery(query)
      ? "Yes, Tanie works on frontend websites, React/TypeScript apps, portfolio sites, landing pages, UI/UX frontend work, 3D web experiences, and performance improvements."
      : "No, that is outside Tanie's work. She focuses on frontend websites, React/TypeScript apps, portfolios, landing pages, and interactive web experiences.";
  }

  const matches = findRelevantKnowledge(query, 3);
  return matches[0]?.content || "I can answer questions about Tanie, her frontend work, projects, skills, and contact info.";
}

async function replyWithGemini(query: string): Promise<string> {
  const geminiApiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    "";
  const geminiModel = process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

  if (!geminiApiKey) {
    return buildFallbackReply(query);
  }

  const contextEntries = findRelevantKnowledge(query);
  const fullProfile = botKnowledgeEntries.map((entry) => `- ${entry.title}: ${entry.content}`).join("\n");
  const context =
    contextEntries.length > 0
      ? contextEntries.map((entry) => `- ${entry.title}: ${entry.content}`).join("\n")
      : "No direct keyword match. Use the full profile facts below and answer naturally.";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: [
                "You are a helpful, conversational assistant for this portfolio site.",
                "Answer general knowledge questions normally and directly when they are not about Tanie or the website.",
                "When a question is about Tanie, her work, the portfolio, or the site structure, prioritize the provided facts and site map.",
                "Use the site map to answer where things live on the site, which route to use, or what a section contains.",
                "Answer greetings, small talk, interview questions, portfolio questions, and contact questions naturally.",
                "If the user asks whether Tanie does a service, answer yes only for frontend websites, React/TypeScript apps, portfolio sites, landing pages, UI/UX frontend work, 3D web experiences, performance work, or interactive web experiences.",
                "For any other service, answer no and briefly mention she focuses on frontend websites and interactive web experiences.",
                "For contact questions, include tanielalwani@gmail.com and the contact form.",
                "Keep responses short, direct, and conversational unless the user asks for detail.",
              ].join(" "),
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Question: ${query}\n\nMost relevant context:\n${context}\n\nFull portfolio facts:\n${fullProfile}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.15,
          maxOutputTokens: 220,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Gemini request failed: ${response.status} ${errorBody.slice(0, 500)}`);
    return buildFallbackReply(query);
  }

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("").trim();

  if (!reply || /do not have that detail|don't have that detail|not covered/i.test(reply)) {
    return buildFallbackReply(query);
  }

  return reply;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = (body?.query || "").trim();

    if (!query) {
      return NextResponse.json({ reply: "Ask a question to get a response." }, { status: 400 });
    }

    try {
      const reply = await replyWithGemini(query);
      return NextResponse.json({ reply });
    } catch (err) {
      console.error("Gemini API error:", err);
      return NextResponse.json({ reply: buildFallbackReply(query) });
    }
  } catch {
    return NextResponse.json({ reply: "Ask a question to get a response." }, { status: 400 });
  }
}
