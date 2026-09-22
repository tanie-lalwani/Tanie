import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt, notes } = body;

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Tf9cErSV3SS3UT";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "EC7LGQ3tiPaf3k6ZQEGoVHT4";

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than zero." },
        { status: 400 }
      );
    }

    // Amount in smallest unit (paise/cents)
    const amountInSmallestUnit = Math.round(Number(amount));

    const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: amountInSmallestUnit,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: {
          ...notes,
          platform: "Tanie Lalwani Portfolio & Studio",
          review_account: "wordsofvoice2210@gmail.com",
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.warn("Razorpay order creation returned non-200:", errData);
      return NextResponse.json(
        {
          error: errData?.error?.description || "Failed to create Razorpay order",
          details: errData,
          keyId,
        },
        { status: response.status }
      );
    }

    const orderData = await response.json();
    return NextResponse.json({
      success: true,
      order: orderData,
      keyId,
    });
  } catch (err: unknown) {
    console.error("Order creation route error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
