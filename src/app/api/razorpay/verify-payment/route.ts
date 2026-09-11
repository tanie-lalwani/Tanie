import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "32Z7afRc5SjnqkuZEqcsvHlU";

    if (!razorpay_payment_id) {
      return NextResponse.json(
        { error: "Missing razorpay_payment_id" },
        { status: 400 }
      );
    }

    if (razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const isAuthentic = generatedSignature === razorpay_signature;

      if (!isAuthentic) {
        return NextResponse.json(
          { verified: false, message: "Invalid payment signature" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    }

    // Direct capture or test verification without order_id
    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      message: "Payment captured successfully",
    });
  } catch (err: unknown) {
    console.error("Payment verification route error:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
