// Sprint 21 — WhatsApp Business Cloud API adapter.
//
// Production: dispatches via Meta Cloud API
//   POST https://graph.facebook.com/v22.0/{phone-id}/messages
// Sandbox: logs the payload and returns a synthetic message id so
// the rest of the pipeline (delivery state, retries) keeps working
// without external service.

export interface WhatsAppTextMessage {
  kind: "text";
  to: string; // E.164, e.g. "+966552345678"
  body: string;
  previewUrl?: boolean;
}

export interface WhatsAppTemplateMessage {
  kind: "template";
  to: string;
  templateName: string;
  languageCode: string; // "ar_SA" | "en_US" …
  components?: Array<{
    type: "body" | "header" | "button";
    parameters: Array<{ type: "text"; text: string }>;
  }>;
}

export type WhatsAppMessage = WhatsAppTextMessage | WhatsAppTemplateMessage;

export interface WhatsAppSendResult {
  ok: boolean;
  messageId?: string;
  error?: string;
  provider: "meta-cloud" | "sandbox";
}

export interface WhatsAppEnv {
  phoneNumberId?: string;
  accessToken?: string;
  graphVersion?: string;
}

export function readWhatsAppEnv(): WhatsAppEnv {
  return {
    phoneNumberId: process.env.WHATSAPP_PHONE_ID,
    accessToken: process.env.WHATSAPP_TOKEN,
    graphVersion: process.env.WHATSAPP_GRAPH_VERSION ?? "v22.0",
  };
}

export function isWhatsAppLive(): boolean {
  const env = readWhatsAppEnv();
  return !!(env.phoneNumberId && env.accessToken);
}

function buildPayload(msg: WhatsAppMessage): object {
  const to = msg.to.replace(/^\+/, "");
  if (msg.kind === "text") {
    return {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: msg.body, preview_url: msg.previewUrl ?? false },
    };
  }
  return {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: msg.templateName,
      language: { code: msg.languageCode },
      components: msg.components ?? [],
    },
  };
}

export async function sendWhatsApp(
  msg: WhatsAppMessage,
): Promise<WhatsAppSendResult> {
  const env = readWhatsAppEnv();

  if (!isWhatsAppLive()) {
    const id = `sandbox-${Date.now()}`;
    console.log(`[WhatsApp:sandbox] → ${msg.to}`, JSON.stringify(msg));
    return { ok: true, messageId: id, provider: "sandbox" };
  }

  const url = `https://graph.facebook.com/${env.graphVersion}/${env.phoneNumberId}/messages`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildPayload(msg)),
    });
    const data = (await res.json()) as {
      messages?: { id: string }[];
      error?: { message: string };
    };
    if (!res.ok || !data.messages?.length) {
      return {
        ok: false,
        error: data.error?.message ?? `Meta returned ${res.status}`,
        provider: "meta-cloud",
      };
    }
    return { ok: true, messageId: data.messages[0].id, provider: "meta-cloud" };
  } catch (err) {
    return {
      ok: false,
      error: (err as Error).message,
      provider: "meta-cloud",
    };
  }
}

// ── Templates we'll register with Meta in production ───────────

export function installmentReminderText(opts: {
  customerFirstName: string;
  dueDateLabel: string;
  amountLabel: string;
  iban: string;
  contractNumber: string;
  officePhone: string;
  officeName: string;
}): string {
  return [
    `أهلاً ${opts.customerFirstName} 👋`,
    "",
    "هذي تذكيرة بقسطك القادم:",
    `📅 التاريخ: ${opts.dueDateLabel}`,
    `💰 المبلغ: ${opts.amountLabel}`,
    `📎 رقم العقد: ${opts.contractNumber}`,
    "",
    `🏦 حوّل على حساب المكتب:`,
    opts.iban,
    "",
    "إذا حوّلت، أرسل لنا صورة الإيصال هنا.",
    "",
    `${opts.officeName} · 📞 ${opts.officePhone}`,
  ].join("\n");
}
