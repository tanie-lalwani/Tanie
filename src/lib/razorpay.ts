export interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayPaymentErrorResponse {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id?: string;
    payment_id?: string;
  };
}

export interface RazorpayCheckoutParams {
  amount: number; // in smallest unit, e.g. paise (INR 100 = 10000 paise) or cents (USD)
  currency: "INR" | "USD";
  name?: string;
  description?: string;
  orderId?: string;
  prefill?: RazorpayPrefill;
  notes?: Record<string, string>;
  onSuccess: (response: RazorpayPaymentSuccessResponse) => void;
  onFailure?: (error: RazorpayPaymentErrorResponse | Error) => void;
  onDismiss?: () => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay?: any;
  }
}

/**
 * Dynamically loads the Razorpay standard checkout script.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay Checkout script");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Returns the public Razorpay Key ID from env or fallback live key.
 */
export function getRazorpayKeyId(): string {
  return (
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    "rzp_test_Tf9cErSV3SS3UT"
  );
}

/**
 * Initiates the standard Razorpay checkout modal.
 */
export async function openRazorpayCheckout({
  amount,
  currency = "INR",
  name = "Tanie Lalwani | Creative Engineering",
  description = "Website Architecture & Sprint Retainer",
  orderId,
  prefill = {},
  notes = {},
  onSuccess,
  onFailure,
  onDismiss,
}: RazorpayCheckoutParams): Promise<boolean> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    if (onFailure) {
      onFailure(new Error("Unable to load Razorpay payment gateway SDK."));
    }
    return false;
  }

  const key = getRazorpayKeyId();

  const options = {
    key,
    amount: Math.round(amount),
    currency,
    name,
    description,
    image: "https://tanie.me/og.webp",
    order_id: orderId || undefined,
    prefill: {
      name: prefill.name || "",
      email: prefill.email || "",
      contact: prefill.contact || "",
    },
    notes: {
      ...notes,
      platform: "Tanie Lalwani Studio",
    },
    theme: {
      color: "#0284c7",
      backdrop_color: "rgba(2, 6, 23, 0.85)",
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss();
      },
      escape: true,
      animation: true,
    },
    handler: (response: RazorpayPaymentSuccessResponse) => {
      onSuccess(response);
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response: { error: RazorpayPaymentErrorResponse }) => {
      console.warn("Razorpay payment failed:", response.error);
      if (onFailure) onFailure(response.error);
    });
    rzp.open();
    return true;
  } catch (err: unknown) {
    console.error("Error opening Razorpay:", err);
    if (onFailure) onFailure(err as Error);
    return false;
  }
}
