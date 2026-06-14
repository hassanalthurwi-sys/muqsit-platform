// Sprint 17 — Rich marketing content for each premium feature, used on
// the office's /subscription page. Kept separate from MOCK_PLANS so the
// platform admin can edit pricing / availability without losing the
// carefully-written copy.

import type { SubscriptionFeature } from "./types";

export interface FeatureScenarioStep {
  who: "ai" | "customer" | "employee" | "system";
  text: string;
}

export interface FeatureContent {
  // Plain-Arabic title — non-technical office managers should grasp it
  // immediately.
  plainTitle: string;
  // One-sentence "what's in it for you" statement.
  valueLine: string;
  // Short narrative — 2-4 sentences — describing a real scenario.
  scenario: string;
  // Optional dialogue / before-after example.
  example?: {
    label: string;
    steps: FeatureScenarioStep[];
  };
  // Concrete numbers / wow stats for the value proposition.
  stats?: { number: string; label: string }[];
}

export const FEATURE_CONTENT: Record<SubscriptionFeature, FeatureContent> = {
  aiAssistant: {
    plainTitle: "مساعدك الذكي على الواتساب",
    valueLine:
      "يكلِّم عملاءك بدلًا عنك ٢٤/٧ — يذكِّرهم بالأقساط، يستلم إثباتات الدفع، ويردّ على استفساراتهم عن عقودهم.",
    scenario:
      "تخيّل ٤٧ عميلًا قسطهم يحلّ هذا الأسبوع. المساعد يرسل لكل واحد تذكيرًا، يستلم إثباتات السداد، يتأكد من صحتها مبدئيًا، ثم يحيلها لموظفك مع تقييم: 'إيصال صحيح، يطابق مبلغ القسط ١٠٠٪'. كل ذلك بدون أن تشتغل أنت أو موظفوك. يردّ كذلك على استفسارات العملاء عن عقودهم بعد التحقق من هويتهم، ويحيل المستثمرين إلى بوابة المستثمر لحساسية بياناتهم.",
    example: {
      label: "محادثة فعلية مع عميل",
      steps: [
        { who: "ai", text: "أهلًا أبا محمد، هذي تذكيرة بقسطك القادم بتاريخ ١٥/٧، بمبلغ ٢,٥٠٠ ر.س." },
        { who: "customer", text: "تم التحويل توّي" },
        { who: "ai", text: "ممتاز! أرسل لي صورة الإيصال من فضلك." },
        { who: "customer", text: "(صورة إيصال تحويل بنكي)" },
        {
          who: "ai",
          text: "شكرًا. أرسلتها للموظف للاعتماد النهائي. التقييم المبدئي: ✅ المبلغ ٢,٥٠٠ ر.س مطابق، رقم العملية موجود، التاريخ يوم أمس.",
        },
        {
          who: "employee",
          text: "(يفتح الإيصال في النظام، يرى البيانات معبَّأة + تقييم المساعد، يضغط 'اعتماد')",
        },
      ],
    },
    stats: [
      { number: "٢٤/٧", label: "يعمل بدون توقف" },
      { number: "٠٠ ث", label: "زمن الرد على العميل" },
      { number: "٩٠٪+", label: "أسئلة العملاء يجاوبها بدون موظف" },
    ],
  },

  ocr: {
    plainTitle: "قراءة الإيصالات والوثائق تلقائيًا",
    valueLine:
      "أرسل لك العميل صورة إيصال أو هوية؟ النظام يقرأها ويعبّي البيانات لك في ثانيتين بدلًا من ٤ دقائق إدخال يدوي.",
    scenario:
      "يستخدم في ثلاث حالات يومية: (١) إيصالات تحويل العملاء — يستخرج المبلغ، اسم المرسل، التاريخ، رقم العملية، اسم البنك. (٢) مسح الهوية الوطنية / الإقامة / إثباتات هوية المستثمرين والعملاء — يعبّي بيانات الملف تلقائيًا. (٣) نقل بياناتك القديمة من إكسل أو PDF أو حتى صور دفاتر قديمة عند الانتقال للنظام.",
    example: {
      label: "قبل وبعد",
      steps: [
        {
          who: "system",
          text: "قبل: موظفك يستلم صورة إيصال، يفتح كل صورة على حدة، يكتب المبلغ، الاسم، التاريخ، الرقم المرجعي يدويًا. متوسط الوقت: ٤ دقائق للإيصال الواحد.",
        },
        {
          who: "system",
          text: "بعد: العميل يرسل الإيصال، النظام يستخرج كل البيانات تلقائيًا، الموظف يراجع ويعتمد. متوسط الوقت: ١٠ ثوانٍ.",
        },
      ],
    },
    stats: [
      { number: "× ٢٤", label: "أسرع من الإدخال اليدوي" },
      { number: "٣ أنواع", label: "إيصالات، هويات، نقل بيانات قديمة" },
      { number: "كل البنوك", label: "السعودية المعتمدة" },
    ],
  },

  whatsappMessages: {
    plainTitle: "رسائل واتساب تفصيلية لعملائك",
    valueLine:
      "بدلًا من ترسل من جوالك الشخصي، النظام يرسل من رقم المكتب رسالة كاملة فيها كل التفاصيل، رقم الحساب، وروابط الدفع.",
    scenario:
      "إشعارات تلقائية للعملاء على الواتساب: تذكير قبل القسط بثلاثة أيام، اعتماد دفعة، انتهاء عقد، تأخر قسط. بقوالب جاهزة قابلة للتعديل من إعدادات المكتب. وسائط: نصوص، رموز، صور إيصالات، روابط بوابة العميل.",
    example: {
      label: "رسالة تذكير القسط (واتساب)",
      steps: [
        {
          who: "ai",
          text: "أهلًا أبا أحمد 👋\n\nهذي تذكيرة بقسطك القادم:\n\n📅 التاريخ: ١٥ يوليو ٢٠٢٦\n💰 المبلغ: ٢,٥٠٠ ر.س\n📎 رقم العقد: INS-2024-047\n\n🏦 حوّل على حساب المكتب:\nالراجحي · SA12 3456 7890 1234 5678 90\n\nإذا حوّلت، أرسل لنا صورة الإيصال هنا وراح نعتمده مباشرة.\n\nمكتب مُقسط للتمويل · 📞 ‎+966 55 234 5678",
        },
      ],
    },
    stats: [
      { number: "كاملة", label: "تفاصيل، رموز، روابط" },
      { number: "تلقائية", label: "أو يدوية بقالب جاهز" },
      { number: "من رقم المكتب", label: "مظهر احترافي" },
    ],
  },

  smsMessages: {
    plainTitle: "رسائل SMS مختصرة",
    valueLine:
      "للعملاء غير الموجودين على الواتساب — رسالة قصيرة فيها أهم معلومة، تصلهم على أي جوال.",
    scenario:
      "تذكيرات قصيرة تصل لأي جوال سعودي حتى لو ما كان على الواتساب. عادة سطر واحد فيه المبلغ والتاريخ والرقم الذي يحوّل عليه. الكلفة أقل والوصول أوسع.",
    example: {
      label: "رسالة تذكير القسط (SMS)",
      steps: [
        {
          who: "ai",
          text: "مُقسِّط: قسطك بتاريخ ١٥/٧، ٢,٥٠٠ ر.س. حوّل لـ SA12 3456 7890. ت: ‎+966552345678",
        },
      ],
    },
    stats: [
      { number: "١٦٠ حرف", label: "مختصرة وحاسمة" },
      { number: "أي جوال", label: "بدون واتساب" },
      { number: "تكلفة أقل", label: "بكثير من الواتساب" },
    ],
  },
};
