// Sprint 24 — Payment gateway adapter (Moyasar).
//
// Saudi PCI-DSS certified provider with Mada, Visa, Mastercard,
// Apple Pay, STC Pay support out of the box. Sandbox mode returns
// fake intent ids so the checkout flow completes locally.

import type { SubscriptionPaymentMethod } from "@/lib/mock/types";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface PaymentIntentRequest {
  amount: number; // SAR (whole units)
  description: string;
  method: SubscriptionPaymentMethod;
  // External reference — we use SubscriptionTransaction.id.
  reference: string;
  callbackUrl: string;
}

export interface PaymentIntentResponse {
  ok: boolean;
  id: string;
  redirectUrl?: string;
  status: PaymentStatus;
  provider: "moyasar" | "sandbox";
  error?: string;
}

const MOYASAR_METHODS: Record<SubscriptionPaymentMethod, string> = {
  mada: "creditcard",
  visa: "creditcard",
  mastercard: "creditcard",
  applePay: "applepay",
  stcPay: "stcpay",
  bankTransfer: "banktransfer",
};

export function isPaymentsLive(): boolean {
  return !!process.env.MOYASAR_API_KEY;
}

export async function createPaymentIntent(
  req: PaymentIntentRequest,
): Promise<PaymentIntentResponse> {
  if (!isPaymentsLive()) {
    return {
      ok: true,
      id: `sandbox-${Date.now().toString(36)}`,
      // Sandbox: skip the gateway hop, callback gets called by the
      // checkout submit handler.
      status: "paid",
      provider: "sandbox",
    };
  }

  try {
    const res = await fetch("https://api.moyasar.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.MOYASAR_API_KEY + ":").toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: String(req.amount * 100), // halalas
        currency: "SAR",
        description: req.description,
        source: JSON.stringify({ type: MOYASAR_METHODS[req.method] }),
        callback_url: req.callbackUrl,
        metadata: JSON.stringify({ reference: req.reference }),
      }).toString(),
    });

    const data = (await res.json()) as {
      id?: string;
      status?: PaymentStatus | "initiated";
      source?: { transaction_url?: string };
      message?: string;
    };

    if (!res.ok || !data.id) {
      return {
        ok: false,
        id: "",
        status: "failed",
        error: data.message ?? `Moyasar returned ${res.status}`,
        provider: "moyasar",
      };
    }
    const status: PaymentStatus =
      data.status === "paid"
        ? "paid"
        : data.status === "failed"
          ? "failed"
          : "pending";
    return {
      ok: true,
      id: data.id,
      redirectUrl: data.source?.transaction_url,
      status,
      provider: "moyasar",
    };
  } catch (err) {
    return {
      ok: false,
      id: "",
      status: "failed",
      error: (err as Error).message,
      provider: "moyasar",
    };
  }
}

export async function fetchPaymentStatus(
  id: string,
): Promise<{ status: PaymentStatus; raw?: object }> {
  if (!isPaymentsLive() || id.startsWith("sandbox-")) {
    return { status: "paid" };
  }
  const res = await fetch(`https://api.moyasar.com/v1/payments/${id}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.MOYASAR_API_KEY + ":").toString("base64")}`,
    },
  });
  const data = (await res.json()) as { status?: PaymentStatus };
  return { status: data.status ?? "pending", raw: data };
}
