import { botKnowledgeEntries, type BotKnowledgeEntry } from "../data/botKnowledge"

type GeminiResponse = {
  reply?: string
}

const STOP_WORDS = new Set(["a", "an", "and", "are", "as", "at", "be", "do", "does", "for", "has", "have", "her", "i", "is", "it", "me", "of", "on", "or", "she", "that", "the", "this", "to", "what", "who", "why", "with", "you"])

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()
}

function normalizeToken(value: string) {
  return value.endsWith("s") && value.length > 4 ? value.slice(0, -1) : value
}

function isContactQuery(query: string) {
  return /\b(contact|email|mail|reach|hire|linkedin|github|instagram|x|twitter|social|google|gdev)\b/i.test(query)
}

function isGreetingQuery(query: string) {
  return /^(hi|hey|hello|yo|sup|hiya|heyy|hey lol|lol hi)\b/i.test(query.trim())
}

function isServiceQuery(query: string) {
  return /\b(do|does|can|could|would)\b.+\b(do|make|build|create|design|develop|offer|handle)\b/i.test(query)
}

function isSupportedServiceQuery(query: string) {
  return /\b(frontend|front end|website|web|react|typescript|portfolio|landing|app|ui|ux|3d|three|interactive|performance|checkout|responsive)\b/i.test(query)
}

function buildContactReply() {
  return "Use the contact form or email tanielalwani@gmail.com. Links: GitHub github.com/tanie-lalwani, LinkedIn linkedin.com/in/tanie-lalwani/, Instagram instagram.com/tanie.mp3, X x.com/tanielalwani, Google Developers me.developers.google.com/u/tanielalwani."
}

function scoreEntry(query: string, entry: BotKnowledgeEntry) {
  const normalizedQuery = normalizeText(query)
  const queryTokens = new Set(
    normalizedQuery
      .split(" ")
      .map(normalizeToken)
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
  )
  const normalizedContent = normalizeText(entry.content)
  let score = 0

  for (const keyword of entry.keywords) {
    const normalizedKeyword = normalizeText(keyword)
    const keywordTokens = normalizedKeyword.split(" ").map(normalizeToken)

    if (normalizedQuery.includes(normalizedKeyword) || keywordTokens.some((token) => queryTokens.has(token))) {
      score += Math.max(2, keyword.split(/\s+/).length)
    }
  }

  for (const token of queryTokens) {
    if (normalizedContent.includes(token)) {
      score += 1
    }
  }

  return score
}

export function getRelevantBotKnowledge(query: string, limit = 3) {
  const matches = [...botKnowledgeEntries]
    .map((entry) => ({ entry, score: scoreEntry(query, entry) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ entry }) => entry)

  return matches
}

export function buildBotContext(query: string) {
  const matches = getRelevantBotKnowledge(query)

  if (matches.length === 0) {
    return botKnowledgeEntries.map((entry) => `- ${entry.title}: ${entry.content}`).join("\n")
  }

  return matches.map((entry) => `- ${entry.title}: ${entry.content}`).join("\n")
}

export function buildFallbackReply(query: string) {
  if (isContactQuery(query)) return buildContactReply()
  if (isGreetingQuery(query)) return "Hey, I'm Tanie's portfolio bot. Ask me about her work, projects, skills, or contact info."
  if (isServiceQuery(query)) {
    return isSupportedServiceQuery(query)
      ? "Yes, Tanie works on frontend websites, React/TypeScript apps, portfolio sites, landing pages, UI/UX frontend work, 3D web experiences, and performance improvements."
      : "No, that is outside Tanie's work. She focuses on frontend websites, React/TypeScript apps, portfolios, landing pages, and interactive web experiences."
  }

  const matches = getRelevantBotKnowledge(query)

  return matches[0]?.content ?? "I can answer questions about Tanie, her frontend work, projects, skills, and contact info."
}

export async function getBotReply(query: string) {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      return buildFallbackReply(query)
    }

    const data = (await response.json()) as GeminiResponse
    const reply = data.reply?.trim()

    if (reply && /do not have that detail|don't have that detail|not covered/i.test(reply)) {
      return buildFallbackReply(query)
    }

    return reply || buildFallbackReply(query)
  } catch {
    return buildFallbackReply(query)
  }
}
