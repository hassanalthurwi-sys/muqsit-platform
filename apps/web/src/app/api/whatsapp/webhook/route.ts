// GET  /api/whatsapp/webhook  — verification handshake
// POST /api/whatsapp/webhook  — incoming messages + status callbacks
//
// Meta calls GET once with hub.challenge + hub.verify_token; we echo
// the challenge if the token matches WHATSAPP_VERIFY_TOKEN. POST
// delivers customer messages — we route them to the AI assistant
// (Sprint 17 chat) for reply, and to the OCR pipeline (Sprint 23)
// for any attached images.

import { ok } from "@/lib/api/respond";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expected = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token && expected && token === expected && challenge) {
    return new Response(challenge, { status: 200, headers: { "content-type": "text/plain" } });
  }
  return new Response("forbidden", { status: 403 });
}

interface WhatsAppInbound {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
          image?: { id: string; mime_type: string };
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
        }>;
      };
    }>;
  }>;
}

export async function POST(req: Request) {
  let body: WhatsAppInbound;
  try {
    body = (await req.json()) as WhatsAppInbound;
  } catch {
    return ok({ received: false });
  }

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value) continue;
      for (const msg of value.messages ?? []) {
        // Route to AI assistant. Production: persist to
        // WhatsAppThread and trigger Claude with customer context.
        console.log(`[WA inbound] from=${msg.from} type=${msg.type}`);
      }
      for (const status of value.statuses ?? []) {
        console.log(`[WA status] id=${status.id} → ${status.status}`);
      }
    }
  }

  return ok({ received: true });
}
