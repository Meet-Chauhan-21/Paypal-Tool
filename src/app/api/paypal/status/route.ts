import { verifyPayPalSandbox } from "@/lib/paypal";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await verifyPayPalSandbox();
    return Response.json(status);
  } catch (error: any) {
    return Response.json(
      {
        configured: false,
        connected: false,
        environment: "sandbox",
        clientIdMasked: null,
        message: error.message || "Failed to check PayPal status",
      },
      { status: 500 },
    );
  }
}
