// POST /api/whatsapp/send
//   { to, body } → text message
//   { to, templateName, languageCode, components? } → template

import { fail, ok, requireFields } from "@/lib/api/respond";
import { sendWhatsApp } from "@/lib/integrations/whatsapp";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const err = requireFields(body, ["to"]);
  if (err) return fail("UNPROCESSABLE", err);

  const result =
    typeof body.templateName === "string"
      ? await sendWhatsApp({
          kind: "template",
          to: body.to as string,
          templateName: body.templateName,
          languageCode: (body.languageCode as string) ?? "ar_SA",
          components: body.components as never,
        })
      : await sendWhatsApp({
          kind: "text",
          to: body.to as string,
          body: (body.body as string) ?? "",
          previewUrl: body.previewUrl as boolean | undefined,
        });

  if (!result.ok) return fail("INTERNAL", result.error ?? "send failed");
  return ok(result);
}
