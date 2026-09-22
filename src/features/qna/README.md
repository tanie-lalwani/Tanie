# AI Assistant & QnA Bot Feature Module (Boilerplate)

Full-featured Conversational AI assistant with local knowledge base resolution and live search.

## Included Capabilities
1. **Interactive Chat Terminal / Widget**: Conversational UI with quick-prompt chips, copy to clipboard, and instant query resolution.
2. **Deterministic Knowledge Engine (`botKnowledge`)**: Keyword and semantic intent matching over custom business FAQs, deliverables, and developer portfolio background.
3. **Generative Streaming Integration (`botAssistant`)**: Prepared for OpenAI / Gemini streaming API connections.

## Copy-Paste Usage in Any Project
```tsx
import { QnAView, askBotAssistant } from "@/features/qna";

export default function QnAPage() {
  return <QnAView />;
}
```
