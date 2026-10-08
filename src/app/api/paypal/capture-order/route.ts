import { capturePayPalOrder, authorizePayPalOrder } from "@/lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, action = "capture" } = body;

    if (!orderId) {
      return Response.json({ error: "Missing orderId" }, { status: 400 });
    }

    if (action === "authorize") {
      const result = await authorizePayPalOrder(orderId);
      return Response.json({ success: true, action: "authorize", result });
    }

    const result = await capturePayPalOrder(orderId);
    return Response.json({ success: true, action: "capture", result });
  } catch (error: any) {
    console.error("PayPal capture/auth error:", error);
    return Response.json(
      { error: error.message || "Failed to process PayPal order" },
      { status: 500 },
    );
  }
}
