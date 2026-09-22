# Client Portal & Contract Signing Feature Module (Boilerplate)

A self-service Client Dashboard where clients can track project milestones, sign digital master service agreements (MSA), view saved quotes, and book sprint calls.

## Included Capabilities
1. **Interactive Client Dashboard**: Milestone timeline tracking (Wireframe, Design, Frontend, Backend, QA, Deployment).
2. **HTML5 Canvas Digital Signature Pad (`SignaturePad`)**: Smooth touch and stylus drawing for client contract sign-offs with base64 PNG export.
3. **Portal Services API (`portalServices`)**: Supabase queries for client quotes, invoices, proposals, and consultation bookings.

## Copy-Paste Usage in Any Project
```tsx
import { ClientPortalView, SignaturePad } from "@/features/client-portal";

export default function PortalPage() {
  return <ClientPortalView />;
}
```
