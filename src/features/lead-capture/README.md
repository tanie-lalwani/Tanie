# Lead Capture Feature Module (Boilerplate)

A complete, production-grade Lead Capturing and Tracking suite designed for Next.js 14+ / 15+ App Router applications.

## Included Capabilities
1. **Background Lead Capturing**: Debounced typing listeners capturing visitor intent before they even submit the form.
2. **Cookie & LocalStorage Persistence**: Synchronizes `lead_id`, `name`, `email`, and `company` across sessions for instant autofill.
3. **Formspree / Webhook Fallback**: Multi-channel lead dispatch with honeypot spam protection.
4. **Server Storage**: Supabase + Local JSON fallback store with search and pipeline status (`new`, `typing`, `in_progress`, `unlocked`, `won`).

## Copy-Paste Usage in Any Project
```tsx
import { ContactForm, saveLeadProfile, getSavedLeadProfile } from "@/features/lead-capture";

export default function ContactPage() {
  return <ContactForm />;
}
```
