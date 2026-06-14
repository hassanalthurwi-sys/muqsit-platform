// Sprint 17 — Subscription plan assistant.
//
// Endpoint: POST /api/chat
// Body: { locale: "ar"|"en", messages: [{ role, content }] }
//
// Uses Anthropic's Claude Haiku 4.5 when ANTHROPIC_API_KEY is present.
// Falls back to a keyword-based responder so the prototype still feels
// useful in environments without the key. The fallback is shipped on
// purpose: every screen of this prototype must be reviewable end-to-end
// without external services.

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL = "claude-haiku-4-5-20251001";

const SYSTEM_PROMPT_AR = `أنت مساعد متخصص في باقات اشتراك منصة "مُقسِّط" — منصة سعودية لإدارة مكاتب التقسيط.

عن المنصة:
- يستخدمها أصحاب المكاتب لإدارة عقود التقسيط، عملاء التقسيط، المستثمرين، والتحصيل.
- معظم المستخدمين أصحاب مكاتب — ليسوا تقنيين. كلِّمهم بلغة سعودية بسيطة جدًا، قصيرة ومباشرة.

الباقتان:
1) الباقة الأساسية (١٨٠٠ ر.س / ٦ أشهر، ٣٠٠٠ / سنة، ٥٠٠٠ / سنتان):
   - كل أساسيات إدارة العقود والأقساط والمستثمرين، بدون المزايا الذكية أدناه.

2) الباقة الاحترافية (٣٦٠٠ / ٦ أشهر، ٦٠٠٠ / سنة، ١٠٠٠٠ / سنتان):
   - كل ما في الأساسية + المزايا الذكية الأربع:

المزايا الذكية الأربع:
أ) المساعد الذكي على الواتساب:
   - يتواصل مع العملاء ٢٤/٧، يذكّرهم بالأقساط.
   - يستلم إثباتات السداد منهم ويحوّلها لموظف المكتب مع تقييم لصحتها.
   - يردّ على استفسارات العملاء عن عقود التقسيط (بعد التحقق من هويتهم).
   - يردّ على المستثمرين ويحيلهم لبوابة المستثمر لحساسية بياناتهم.

ب) OCR (التعرف الضوئي):
   - يقرأ إيصالات تحويل العملاء البنكية ويستخرج المبلغ والاسم والتاريخ ورقم العملية.
   - يقرأ الهوية الوطنية والإقامة وأي إثبات شخصي ويعبّي بيانات العميل / المستثمر تلقائيًا.
   - يساعد في نقل البيانات القديمة (إكسل، PDF، صور) عند الانتقال للنظام.

ج) رسائل الواتساب للعملاء (تفصيلية):
   - رسائل كاملة فيها رموز، روابط، صور، تفاصيل القسط ورقم الحساب البنكي للمكتب.
   - تذكير قبل القسط، اعتماد دفعة، انتهاء عقد، تأخر قسط — كلها تلقائية أو بقالب جاهز.

د) رسائل SMS للعملاء (مختصرة):
   - سطر واحد قصير للعملاء غير المفعّلين على الواتساب.
   - تكلفة أقل ووصول لأي جوال.

وسائل الدفع المتاحة: مدى، Visa، Mastercard، Apple Pay، STC Pay، حوالة بنكية.

قواعد للرد:
- لا تخترع مزايا غير موجودة في النص أعلاه.
- لو سُئلت عن سعر أو وقت غير مذكور، قل "سل مدير المنصة" أو حوّل للمكتب.
- لا تتجاوز ٣ فقرات قصيرة. استخدم سطورًا قصيرة، شارح بمثال إذا قدرت.
- ركّز دائمًا على فائدة الميزة لصاحب المكتب، ليس على المصطلح التقني.
- إذا سُئلت "هل أحتاج هذه الميزة؟"، اسأل صاحب المكتب عن حالته (عدد عملائه، طريقة تواصله الحالية) قبل ما توصي بقرار.`;

const SYSTEM_PROMPT_EN = `You're a friendly assistant for "Muqsit" — a Saudi platform that helps installment offices manage their contracts, customers, investors, and collections.

Most users are office owners, not technical. Be brief, plain, and example-driven.

Plans:
1) Basic (SAR 1,800 / 6m, 3,000 / 1y, 5,000 / 2y): core CRM only.
2) Pro (SAR 3,600 / 6m, 6,000 / 1y, 10,000 / 2y): everything in Basic plus the four smart features.

Smart features (Pro only):
- WhatsApp AI assistant: 24/7 reminders, receives payment proofs and routes them to a staff member with a validity assessment, answers customer contract questions after ID verification, redirects investors to the investor portal.
- OCR: reads bank transfer receipts, IDs / iqamas (auto-fills customer & investor profiles), helps with old-data migration.
- WhatsApp messages: detailed customer notifications with the bank account, emojis, links, attachments.
- SMS messages: one-line short notifications for customers not on WhatsApp.

Payment methods: Mada, Visa, Mastercard, Apple Pay, STC Pay, bank transfer.

Rules:
- Don't invent features.
- Stay under 3 short paragraphs. Use examples.
- Talk about the value to the office owner, not the buzzword.`;

interface ChatRequest {
  locale: "ar" | "en";
  messages: { role: "user" | "assistant"; content: string }[];
}

// Keyword-based fallback when no API key is available. Returns rich,
// realistic answers so the prototype still reviews well end-to-end.
function fallbackReply(req: ChatRequest): string {
  const lastUser = [...req.messages].reverse().find((m) => m.role === "user");
  const q = (lastUser?.content ?? "").toLowerCase();
  const ar = req.locale === "ar";

  const matches = (re: RegExp) => re.test(q);

  if (matches(/الفرق|farq|difference|basic.*pro|أساسي.*احتراف/i)) {
    return ar
      ? "الفرق ببساطة: الأساسية فيها أساسيات إدارة العقود فقط. الاحترافية تضيف لك ٤ مزايا توفّر عليك ساعات يوميًا:\n\n• المساعد الذكي يكلّم عملاءك على الواتساب بدلًا عنك.\n• OCR يقرأ الإيصالات والهويات تلقائيًا.\n• رسائل واتساب وSMS تذكّر عملاءك بأقساطهم تلقائيًا.\n\nلو عدد عملائك ٢٠+ والواتساب يأخذ منك وقتًا كثيرًا، الاحترافية توفّر عليك أكثر من كلفتها."
      : "Basic gives you the core CRM. Pro adds 4 smart features that save you hours daily:\n\n• WhatsApp AI assistant chats with your customers for you.\n• OCR reads receipts and IDs automatically.\n• WhatsApp & SMS reminders go out on their own.\n\nIf you have 20+ customers and WhatsApp eats your day, Pro pays for itself.";
  }

  if (matches(/المساعد الذكي|ذكي|ai|assistant|whatsapp.*ai/i)) {
    return ar
      ? "المساعد الذكي يشتغل بدلًا عنك على الواتساب:\n\n• يذكّر عملاءك بأقساطهم في الموعد.\n• إذا ردّوا 'حوّلت'، يطلب صورة الإيصال ويرسلها لموظفك مع تقييم: 'إيصال صحيح ٩٥٪'.\n• يجاوب على أسئلة العميل عن عقده بعد التحقق من هويته.\n• المستثمرون يحوّلهم لبوابة المستثمر مباشرة.\n\nيعني تنام والمكتب يشتغل."
      : "The smart assistant works for you on WhatsApp:\n\n• Reminds customers about installments on time.\n• If they reply 'paid', it asks for the receipt photo and forwards it to your staff with a validity score.\n• Answers customer contract questions after ID verification.\n• Routes investors to the investor portal.\n\nYou sleep, the office keeps working.";
  }

  if (matches(/ocr|تعرف|قراءة|إيصال|هوية|إقامة/i)) {
    return ar
      ? "OCR يخدمك في ٣ حالات:\n\n١. صورة إيصال تحويل من العميل → يقرأ المبلغ، اسم المرسل، رقم العملية، التاريخ.\n٢. صورة هوية وطنية أو إقامة → يعبّي بيانات العميل أو المستثمر في ملفه.\n٣. ملفاتك القديمة (إكسل، PDF، صور) → ينقلها للنظام بسرعة.\n\nبدلًا من ٤ دقائق إدخال يدوي، خلّيه يعطيك البيانات في ١٠ ثواني."
      : "OCR helps in 3 daily situations:\n\n1. Customer transfer receipt photo → extracts amount, sender, reference, date.\n2. National ID or iqama photo → fills the customer / investor profile.\n3. Your old files (Excel, PDF, photos) → migrates them into the system fast.\n\nInstead of 4 minutes of typing, you get the data in 10 seconds.";
  }

  if (matches(/sms|الفرق.*رسائل|رسائل.*واتساب|واتساب.*sms|whatsapp.*sms/i)) {
    return ar
      ? "كلاهما تذكير، الفرق في الشكل والوصول:\n\n• الواتساب: رسالة كاملة فيها المبلغ، التاريخ، رقم حسابك البنكي، رموز، روابط. مناسبة للعملاء المفعّلين على الواتساب (الأغلبية).\n• SMS: سطر واحد قصير ينفع للعملاء غير المفعّلين على الواتساب أو الكبار في السن. تكلفته أرخص.\n\nالأفضل تجمع الاثنين عشان تضمن وصول التذكير."
      : "Both are reminders — the difference is form and reach:\n\n• WhatsApp: detailed message with the amount, date, your bank account, emojis, links. Best for customers on WhatsApp (most of them).\n• SMS: a single short line. Useful for customers not on WhatsApp or older folks. Cheaper.\n\nBest to enable both so reminders always land.";
  }

  if (matches(/سعر|كم|كلفة|cost|price|how much/i)) {
    return ar
      ? "الأسعار بالريال السعودي:\n\n• الأساسية: ١,٨٠٠ (٦ أشهر) · ٣,٠٠٠ (سنة) · ٥,٠٠٠ (سنتان).\n• الاحترافية: ٣,٦٠٠ (٦ أشهر) · ٦,٠٠٠ (سنة) · ١٠,٠٠٠ (سنتان).\n\nالاشتراك السنتيني يوفّر عليك ١٧٪. تقدر تدفع بمدى، Visa، Mastercard، Apple Pay، STC Pay، أو حوالة بنكية."
      : "Prices in SAR:\n\n• Basic: 1,800 (6m) · 3,000 (1y) · 5,000 (2y).\n• Pro: 3,600 (6m) · 6,000 (1y) · 10,000 (2y).\n\nThe 2-year plan saves you 17%. Pay with Mada, Visa, Mastercard, Apple Pay, STC Pay, or bank transfer.";
  }

  if (matches(/أحتاج|need|recommend|أوصي|اختار|choose/i)) {
    return ar
      ? "عشان أوصيك صح، خبّرني:\n\n• كم تقريبًا عدد عملاء التقسيط عندك؟\n• كم وقت تستهلك يوميًا في رسائل الواتساب مع عملاءك؟\n• هل تستلم إيصالات تحويل بنكي يدويًا الآن؟\n\nبناءً على إجابتك أعطيك توصية واضحة."
      : "To recommend the right plan, tell me:\n\n• Roughly how many installment customers do you have?\n• How much daily time do WhatsApp messages with customers eat from you?\n• Are you handling bank transfer receipts manually right now?\n\nI'll give you a clear recommendation based on your answer.";
  }

  // Default
  return ar
    ? "اسألني عن:\n• الفرق بين الباقتين\n• المساعد الذكي على الواتساب\n• OCR (قراءة الإيصالات والهويات)\n• الفرق بين رسائل الواتساب وSMS\n• الأسعار ووسائل الدفع"
    : "Ask me about:\n• Basic vs Pro\n• The WhatsApp smart assistant\n• OCR (receipts & IDs)\n• WhatsApp vs SMS messages\n• Prices and payment methods";
}

export async function POST(req: Request) {
  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const locale = body.locale === "en" ? "en" : "ar";
  const messages = Array.isArray(body.messages) ? body.messages : [];

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({
      reply: fallbackReply({ locale, messages }),
      fallback: true,
    });
  }

  try {
    const client = new Anthropic({ apiKey: key });
    const result = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system: locale === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_AR,
      messages: messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content })),
    });
    const reply = result.content
      .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return NextResponse.json({ reply: reply || fallbackReply({ locale, messages }) });
  } catch (err) {
    console.error("/api/chat anthropic error:", err);
    return NextResponse.json({
      reply: fallbackReply({ locale, messages }),
      fallback: true,
    });
  }
}
