import botKnowledge from "./botKnowledge.json"

export type BotKnowledgeEntry = {
  title: string
  content: string
  keywords: string[]
}

export const botKnowledgeEntries = botKnowledge as BotKnowledgeEntry[]
