// POST /api/ocr/receipt  { imageBase64 }

import { fail, ok, requireFields } from "@/lib/api/respond";
import { readReceipt } from "@/lib/integrations/ocr";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let body: { imageBase64?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const err = requireFields(body as Record<string, unknown>, ["imageBase64"]);
  if (err) return fail("UNPROCESSABLE", err);

  const result = await readReceipt(body.imageBase64!);
  return ok(result);
}
