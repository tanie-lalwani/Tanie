# Razorpay Payment Gateway Feature Module (Boilerplate)

Production-grade checkout and payment gateway wrapper for Indian & International payments (Cards, UPI, Netbanking, Wallets).

## Included Capabilities
1. **Dynamic Script Loader**: Lazily injects `checkout.razorpay.com/v1/checkout.js` on demand.
2. **Order Verification & Signature Verification**: Server and client handler with callback hooks for success and dismiss events.
3. **Multi-Currency Support**: Handles both INR (paise) and USD (cents).

## Copy-Paste Usage in Any Project
```tsx
import { openRazorpayCheckout } from "@/features/payments";

await openRazorpayCheckout({
  orderId: "order_xyz",
  amount: 2500000, // in paise
  currency: "INR",
  name: "My Business",
  description: "Website Development Sprint Deposit",
  onSuccess: (payment) => console.log("Payment success:", payment),
  onDismiss: () => console.log("Payment modal dismissed")
});
```
