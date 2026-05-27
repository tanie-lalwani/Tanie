import { botKnowledge, type BotKnowledgeEntry } from "../data/botKnowledge"

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash"
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()
}

function scoreEntry(query: string, entry: BotKnowledgeEntry) {
  const normalizedQuery = normalizeText(query)
  let score = 0

  for (const keyword of entry.keywords) {
    if (normalizedQuery.includes(keyword)) {
      score += Math.max(2, keyword.split(/\s+/).length)
    }
  }

  for (const token of normalizedQuery.split(" ")) {
    if (token.length > 2 && entry.content.toLowerCase().includes(token)) {
      score += 1
    }
  }

  return score
}

export function getRelevantBotKnowledge(query: string, limit = 3) {
  return [...botKnowledge]
    .map((entry) => ({ entry, score: scoreEntry(query, entry) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ entry }) => entry)
}

export function buildBotContext(query: string) {
  const matches = getRelevantBotKnowledge(query)

  if (matches.length === 0) {
    return botKnowledge.map((entry) => `- ${entry.title}: ${entry.content}`).join("\n")
  }

  return matches.map((entry) => `- ${entry.title}: ${entry.content}`).join("\n")
}

export function buildFallbackReply(query: string) {
  const matches = getRelevantBotKnowledge(query)

  if (matches.length === 0) {
    return "I can answer from Tanie's portfolio data. Ask about skills, projects, experience, or contact info."
  }

  if (matches.length === 1) {
    return matches[0].content
  }

  return matches.map((entry) => entry.content).join(" ")
}

export async function getBotReply(query: string) {
  const context = buildBotContext(query)

  if (!GEMINI_API_KEY) {
    return buildFallbackReply(query)
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: [
                  "You are a concise assistant for Tanie Lalwani's portfolio and QnA page.",
                  "Answer only using the provided portfolio context.",
                  "If the question is not covered, say you do not have that detail yet.",
                  "Keep responses short, natural, and friendly.",
                ].join(" "),
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Question: ${query}\n\nPortfolio context:\n${context}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 220,
          },
        }),
      }
    )

    if (!response.ok) {
      return buildFallbackReply(query)
    }

    const data = (await response.json()) as GeminiResponse
    const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim()

    return reply || buildFallbackReply(query)
  } catch {
    return buildFallbackReply(query)
  }
}
