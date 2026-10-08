import { createPayPalOrder } from "@/lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      return Response.json({ error: "Invalid amount provided" }, { status: 400 });
    }

    const order = await createPayPalOrder({
      amount,
      currency: body.currency || "USD",
      referenceId: body.referenceId,
      description: body.description || "ProcurePilot AI Autonomous Procurement",
      intent: body.intent || "AUTHORIZE",
      merchantName: body.merchantName,
    });

    return Response.json(order);
  } catch (error: any) {
    console.error("PayPal create order error:", error);
    return Response.json(
      { error: error.message || "Failed to create PayPal sandbox order" },
      { status: 500 },
    );
  }
}
