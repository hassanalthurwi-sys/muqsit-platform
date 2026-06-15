// Sprint 22 — SMS gateway adapter (Unifonic).
//
// Saudi licensed provider. Production: POST to Unifonic Messaging API.
// Sandbox: log the payload.

export interface SmsMessage {
  to: string;
  body: string;
  // Sender label registered with Unifonic — defaults to "Muqsit".
  senderName?: string;
}

export interface SmsSendResult {
  ok: boolean;
  messageId?: string;
  cost?: number;
  error?: string;
  provider: "unifonic" | "sandbox";
}

const MAX_SMS_LEN = 160; // single-segment

export function isSmsLive(): boolean {
  return !!(process.env.UNIFONIC_APP_SID && process.env.UNIFONIC_SENDER);
}

export async function sendSms(msg: SmsMessage): Promise<SmsSendResult> {
  if (!isSmsLive()) {
    console.log(
      `[SMS:sandbox] → ${msg.to} (${msg.body.length}c): ${msg.body}`,
    );
    return {
      ok: true,
      messageId: `sandbox-${Date.now()}`,
      provider: "sandbox",
    };
  }

  // Length warning — Unifonic charges per 160-char segment.
  if (msg.body.length > MAX_SMS_LEN) {
    console.warn(
      `[SMS] body is ${msg.body.length}c — will be billed as multi-segment`,
    );
  }

  try {
    const params = new URLSearchParams();
    params.set("AppSid", process.env.UNIFONIC_APP_SID!);
    params.set("Recipient", msg.to.replace(/^\+/, ""));
    params.set("Body", msg.body);
    params.set("SenderID", msg.senderName ?? process.env.UNIFONIC_SENDER!);
    params.set("StatusCallback", process.env.UNIFONIC_CALLBACK_URL ?? "");

    const res = await fetch("https://el.cloud.unifonic.com/rest/SMS/messages", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = (await res.json()) as {
      success?: string;
      data?: { MessageID?: string; Cost?: number };
      errorCode?: string;
      message?: string;
    };

    if (data.success !== "true") {
      return {
        ok: false,
        error: data.message ?? data.errorCode ?? "Unifonic error",
        provider: "unifonic",
      };
    }
    return {
      ok: true,
      messageId: data.data?.MessageID,
      cost: data.data?.Cost,
      provider: "unifonic",
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message, provider: "unifonic" };
  }
}

// ── Short SMS templates ────────────────────────────────────────

export function installmentReminderSms(opts: {
  dueDateLabel: string;
  amountLabel: string;
  iban: string;
}): string {
  // 160-char target.
  return `مُقسِّط: قسطك ${opts.dueDateLabel}، ${opts.amountLabel}. حوّل لـ ${opts.iban}.`;
}

export function otpSms(code: string, expiresInMin = 5): string {
  return `مُقسِّط: رمز التحقق ${code}. صالح لمدة ${expiresInMin} دقائق. لا تشاركه مع أحد.`;
}
