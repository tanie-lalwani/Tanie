import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const PORT = Number(process.env.PORT || 8787)
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const MODE = process.env.MODE || process.env.NODE_ENV || "development"
const STOP_WORDS = new Set(["a", "an", "and", "are", "as", "at", "be", "do", "does", "for", "has", "have", "her", "i", "is", "it", "me", "of", "on", "or", "she", "that", "the", "this", "to", "what", "who", "why", "with", "you"])

function parseEnvFile(content) {
    for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith("#")) continue

        const equalsIndex = trimmed.indexOf("=")
        if (equalsIndex === -1) continue

        const key = trimmed.slice(0, equalsIndex).trim()
        let value = trimmed.slice(equalsIndex + 1).trim()

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1)
        }

        if (!process.env[key]) {
            process.env[key] = value
        }
    }
}

async function loadEnv() {
    for (const name of [".env", ".env.local", `.env.${MODE}`, `.env.${MODE}.local`]) {
        try {
            const content = await readFile(path.join(ROOT_DIR, name), "utf8")
            parseEnvFile(content)
        } catch {
            // Ignore missing env files.
        }
    }
}

function getEnvValue(...keys) {
    for (const key of keys) {
        const value = process.env[key]?.trim()
        if (value) return value
    }

    return ""
}

function normalizeText(value) {
    return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()
}

function normalizeToken(value) {
    return value.endsWith("s") && value.length > 4 ? value.slice(0, -1) : value
}

function isContactQuery(query) {
    return /\b(contact|email|mail|reach|hire|linkedin|github|instagram|social)\b/i.test(query)
}

function isGreetingQuery(query) {
    return /^(hi|hey|hello|yo|sup|hiya|heyy|hey lol|lol hi)\b/i.test(query.trim())
}

function isServiceQuery(query) {
    return /\b(do|does|can|could|would)\b.+\b(do|make|build|create|design|develop|offer|handle)\b/i.test(query)
}

function isSupportedServiceQuery(query) {
    return /\b(frontend|front end|website|web|react|typescript|portfolio|landing|app|ui|ux|3d|three|interactive|performance|checkout|responsive)\b/i.test(query)
}

function buildContactReply() {
    return "Use the contact form or email contact@tanie.me. Links: GitHub github.com/tanie-lalwani, LinkedIn linkedin.com/in/tanie-lalwani/, Instagram instagram.com/tanie.mp3."
}

function findRelevantKnowledge(query, knowledge, limit = 6) {
    return knowledge
        .map((entry) => ({ entry, score: scoreEntry(query, entry) }))
        .filter(({ score }) => score > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, limit)
        .map(({ entry }) => entry)
}

function scoreEntry(query, entry) {
    const normalizedQuery = normalizeText(query)
    const queryTokens = new Set(
        normalizedQuery
            .split(" ")
            .map(normalizeToken)
            .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
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

async function loadKnowledge() {
    const content = await readFile(path.join(ROOT_DIR, "src/data/botKnowledge.json"), "utf8")
    return JSON.parse(content)
}

function buildFallbackReply(query, knowledge) {
    if (isContactQuery(query)) return buildContactReply()
    if (isGreetingQuery(query)) return "Hey, I'm Tanie's portfolio bot. Ask me about her work, projects, skills, or contact info."
    if (isServiceQuery(query)) {
        return isSupportedServiceQuery(query)
            ? "Yes, Tanie works on frontend websites, React/TypeScript apps, portfolio sites, landing pages, UI/UX frontend work, 3D web experiences, and performance improvements."
            : "No, that is outside Tanie's work. She focuses on frontend websites, React/TypeScript apps, portfolios, landing pages, and interactive web experiences."
    }

    const matches = findRelevantKnowledge(query, knowledge, 3)

    return matches[0]?.content || "I can answer questions about Tanie, her frontend work, projects, skills, and contact info."
}

async function replyWithGemini(query, knowledge) {
    const geminiApiKey = getEnvValue(
        "GEMINI_API_KEY",
        "GOOGLE_GEMINI_API_KEY",
        "GOOGLE_GENERATIVE_AI_API_KEY",
        "GOOGLE_API_KEY",
        "VITE_GEMINI_API_KEY",
    )
    const geminiModel = getEnvValue("GEMINI_MODEL", "VITE_GEMINI_MODEL") || "gemini-2.5-flash"

    if (!geminiApiKey) {
        return buildFallbackReply(query, knowledge)
    }

    const contextEntries = findRelevantKnowledge(query, knowledge)
    const fullProfile = knowledge.map((entry) => `- ${entry.title}: ${entry.content}`).join("\n")
    const context = contextEntries.length > 0
        ? contextEntries.map((entry) => `- ${entry.title}: ${entry.content}`).join("\n")
        : "No direct keyword match. Use the full profile facts below and answer naturally."

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
                                "You are a concise assistant for Tanie Lalwani's portfolio and QnA page.",
                                "Answer basic greetings, small talk, and casual replies naturally.",
                                "Answer portfolio, interview, skill, project, hiring, and contact questions using the provided facts.",
                                "If the user asks whether Tanie does a service, answer yes only for frontend websites, React/TypeScript apps, portfolio sites, landing pages, UI/UX frontend work, 3D web experiences, performance work, or interactive web experiences.",
                                "For any other service, answer no and briefly mention she focuses on frontend websites and interactive web experiences.",
                                "Do not answer unrelated service questions with a project description.",
                                "For contact questions, include contact@tanie.me and the contact form.",
                                "Keep responses short, direct, and conversational.",
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
    )

    if (!response.ok) {
        const errorBody = await response.text()
        console.error(`Gemini request failed: ${response.status} ${errorBody.slice(0, 500)}`)
        return buildFallbackReply(query, knowledge)
    }

    const data = await response.json()
    const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim()

    if (!reply || /do not have that detail|don't have that detail|not covered/i.test(reply)) {
        return buildFallbackReply(query, knowledge)
    }

    return reply
}

async function main() {
    await loadEnv()
    const knowledge = await loadKnowledge()

    const server = createServer(async (request, response) => {
        if (request.method === "OPTIONS") {
            response.writeHead(204, {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            })
            response.end()
            return
        }

        if (request.method !== "POST" || request.url !== "/api/gemini") {
            response.writeHead(404, { "Content-Type": "application/json" })
            response.end(JSON.stringify({ error: "Not found" }))
            return
        }

        let body = ""
        for await (const chunk of request) {
            body += chunk
        }

        let query = ""
        try {
            query = JSON.parse(body).query || ""
        } catch {
            query = ""
        }

        if (!query.trim()) {
            response.writeHead(400, { "Content-Type": "application/json" })
            response.end(JSON.stringify({ reply: "Ask a question to get a response." }))
            return
        }

        try {
            const reply = await replyWithGemini(query, knowledge)
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            })
            response.end(JSON.stringify({ reply }))
        } catch {
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            })
            response.end(JSON.stringify({ reply: buildFallbackReply(query, knowledge) }))
        }
    })

    server.listen(PORT, () => {
        console.log(`Gemini proxy listening on http://localhost:${PORT}`)
    })
}

void main()
