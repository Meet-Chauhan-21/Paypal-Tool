/**
 * PayPal REST API / Sandbox Integration Service
 * Supports OAuth2 Authentication, Order Creation, Authorization, Capture, and Sandbox Verification.
 */

export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment: "sandbox" | "production";
  baseUrl: string;
}

export interface PayPalTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
}

export interface CreateOrderParams {
  amount: number;
  currency?: string;
  referenceId?: string;
  description?: string;
  intent?: "AUTHORIZE" | "CAPTURE";
  merchantName?: string;
  items?: {
    name: string;
    unitAmount: number;
    quantity: number;
    description?: string;
    category?: string;
  }[];
}

export interface PayPalOrderResult {
  id: string;
  status: string;
  intent: string;
  approvalUrl?: string;
  amount: number;
  currency: string;
  raw?: any;
}

export function getPayPalConfig(): PayPalConfig {
  const environment = (process.env.PAYPAL_ENVIRONMENT || "sandbox").toLowerCase() as "sandbox" | "production";
  const baseUrl =
    process.env.PAYPAL_API_BASE_URL ||
    (environment === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com");

  return {
    clientId: process.env.PAYPAL_CLIENT_ID || "",
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
    environment,
    baseUrl,
  };
}

export function isPayPalConfigured(): boolean {
  const { clientId, clientSecret } = getPayPalConfig();
  if (!clientId || !clientSecret) return false;
  const placeholderPatterns = ["your_paypal", "example", "placeholder", "xxx"];
  const isPlaceholder = placeholderPatterns.some(
    (p) => clientId.toLowerCase().includes(p) || clientSecret.toLowerCase().includes(p),
  );
  return !isPlaceholder && clientId.trim().length > 10;
}

// In-memory cache for PayPal access token
let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  const { clientId, clientSecret, baseUrl } = getPayPalConfig();

  if (!clientId || !clientSecret) {
    throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET environment variables.");
  }

  // Return cached token if valid (with 60-second safety window)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal OAuth failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as PayPalTokenResponse;
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

export async function verifyPayPalSandbox(): Promise<{
  configured: boolean;
  connected: boolean;
  environment: string;
  clientIdMasked: string | null;
  message: string;
}> {
  const config = getPayPalConfig();
  const configured = isPayPalConfigured();

  if (!configured) {
    return {
      configured: false,
      connected: false,
      environment: config.environment,
      clientIdMasked: null,
      message: "PayPal sandbox credentials not configured in environment (.env.local). Running in simulated sandbox mode.",
    };
  }

  try {
    const token = await getPayPalAccessToken();
    const masked = config.clientId.length > 8
      ? `${config.clientId.slice(0, 4)}...${config.clientId.slice(-4)}`
      : "Configured";

    return {
      configured: true,
      connected: !!token,
      environment: config.environment,
      clientIdMasked: masked,
      message: "Connected to PayPal Sandbox API successfully.",
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      environment: config.environment,
      clientIdMasked: config.clientId ? `${config.clientId.slice(0, 4)}...` : null,
      message: `PayPal Sandbox connection error: ${err.message}`,
    };
  }
}

export async function createPayPalOrder(params: CreateOrderParams): Promise<PayPalOrderResult> {
  const { amount, currency = "USD", referenceId, description, intent = "AUTHORIZE" } = params;
  const config = getPayPalConfig();

  // If credentials are configured, call PayPal Sandbox REST API
  if (isPayPalConfigured()) {
    const token = await getPayPalAccessToken();
    const payload = {
      intent,
      purchase_units: [
        {
          reference_id: referenceId ?? `PP-${Date.now()}`,
          description: description ?? "ProcurePilot AI Commercial Transaction",
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: "ProcurePilot",
        landing_page: "NO_PREFERENCE",
        user_action: "CONTINUE",
      },
    };

    const res = await fetch(`${config.baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`PayPal Order Creation failed (${res.status}): ${errorText}`);
    }

    const order = await res.json();
    const approvalLink = order.links?.find((l: any) => l.rel === "approve")?.href;

    return {
      id: order.id,
      status: order.status,
      intent: order.intent,
      approvalUrl: approvalLink,
      amount,
      currency,
      raw: order,
    };
  }

  // Fallback: Simulated PayPal Sandbox order for offline/demo development
  const simulatedId = `PAYPAL-SANDBOX-${Math.floor(100000 + Math.random() * 900000)}`;
  return {
    id: simulatedId,
    status: intent === "AUTHORIZE" ? "CREATED" : "COMPLETED",
    intent,
    approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${simulatedId}`,
    amount,
    currency,
    raw: { simulated: true, environment: "sandbox" },
  };
}

export async function authorizePayPalOrder(orderId: string): Promise<any> {
  const config = getPayPalConfig();

  if (isPayPalConfigured()) {
    const token = await getPayPalAccessToken();
    const res = await fetch(`${config.baseUrl}/v2/checkout/orders/${orderId}/authorize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`PayPal Authorize failed (${res.status}): ${errorText}`);
    }

    return await res.json();
  }

  // Simulated sandbox response
  return {
    id: `AUTH-${Math.floor(10000 + Math.random() * 90000)}`,
    status: "COMPLETED",
    simulated: true,
  };
}

export async function capturePayPalOrder(orderId: string): Promise<any> {
  const config = getPayPalConfig();

  if (isPayPalConfigured()) {
    const token = await getPayPalAccessToken();
    const res = await fetch(`${config.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`PayPal Capture failed (${res.status}): ${errorText}`);
    }

    return await res.json();
  }

  // Simulated sandbox response
  return {
    id: `CAP-${Math.floor(10000 + Math.random() * 90000)}`,
    status: "COMPLETED",
    simulated: true,
  };
}
