# وثيقة التصميم التقني — منصة مُقسِّط

**Technical Design Document (TDD)**

| البند | القيمة |
|---|---|
| الإصدار | v1.0 |
| التاريخ | 2026-06-14 |
| الحالة | معتمَدة بعد Sprint 17 |
| الوثيقة المقابلة | Muqsit_BRS_v1.0.md (المتطلبات) |

> **سياسة هذه الوثيقة:** تترجم BRS إلى تصميم تقني قابل للتنفيذ. تغطي الحالي (v1.0 — البروتوتايب) وخطة الانتقال إلى الإنتاج (Phase 2).

---

## ١. مقدمة

### ١.١ الغرض
ترتكز هذه الوثيقة على ٤ أسئلة:
1. **ما المعمارية الحالية للبروتوتايب؟** (شُحن في Sprints 1–17)
2. **ما القرارات التقنية المتَّخذة ولماذا؟**
3. **كيف ينتقل البروتوتايب إلى الإنتاج؟**
4. **ما القرارات المؤجَّلة للمرحلة الثانية؟**

### ١.٢ ما هو ليس في هذه الوثيقة
- شرح الأعمال أو قواعد العمل — راجع BRS.
- تفاصيل واجهة المستخدم — راجع docs/review/sprint*/README.md و .pdf.

### ١.٣ مبادئ التصميم
1. **prototype أولًا، إنتاج لاحقًا** — كل ميزة موثَّقة بنموذج جاهز للترحيل، لا بكود Production-ready.
2. **TypeScript صارم على كل الواجهات** — النموذج التعريفي هو المصدر الوحيد.
3. **Server-light** — كل المنطق العملي على الـclient في v1.0، يُنقل إلى الـserver في v2.
4. **بنية موحَّدة عبر الـRoutes** — كل ميزة في `app/`، كل مكوّن في `components/`، كل بيانات في `lib/mock/`.
5. **i18n من اليوم الأول** — لا توجد نصوص عربية أو إنجليزية محشورة في الكود.

---

## ٢. المعمارية العامة

### ٢.١ نظرة عامة (v1.0 — البروتوتايب)
```
┌──────────────────────────────────────────────────┐
│           Next.js 15 App (apps/web)              │
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │      App Router (route groups)          │    │
│  │   (app) (auth) (admin) (portal)         │    │
│  └────────────────┬────────────────────────┘    │
│                   │                              │
│  ┌────────────────┴────────────────────────┐    │
│  │     React Components + Hooks            │    │
│  │     I18n Provider · Auth Provider       │    │
│  │     Store Provider · Theme Provider     │    │
│  └────────────────┬────────────────────────┘    │
│                   │                              │
│  ┌────────────────┴────────────────────────┐    │
│  │  In-Memory Mock Layer (lib/mock/)       │    │
│  │  + localStorage persistence              │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │     API Routes (app/api/)                │    │
│  │     /api/chat → Anthropic SDK            │    │
│  └─────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

### ٢.٢ نظرة عامة (v2.0 — الإنتاج المخطط)
```
┌─────────────────┐     ┌────────────────┐     ┌──────────────┐
│   Next.js Web   │────▶│  API (Next.js  │────▶│  PostgreSQL  │
│  (Vercel/AWS)   │     │   server)       │     │   + Prisma   │
└─────────────────┘     └────────────────┘     └──────────────┘
        │                       │                       │
        │                       ├──▶ Anthropic API (LLM)
        │                       ├──▶ WhatsApp Business API
        │                       ├──▶ SMS Gateway (Unifonic)
        │                       ├──▶ OCR Service
        │                       ├──▶ Payment Gateway (Moyasar)
        │                       └──▶ S3 (File storage)
        │
        └──▶ Mobile Apps (Phase 2)
```

### ٢.٣ القرارات المعمارية الكبرى
| القرار | السبب |
|---|---|
| **Next.js 15 App Router** | RSC + SSR + API routes في إطار واحد، ودعم RTL/i18n سهل |
| **Tailwind CSS + tokens** | يحفظ نظام التصميم السعودي البنكي بدون CSS-in-JS |
| **localStorage في v1.0** | يسمح بمراجعة كل تدفق بدون backend — قرار صريح |
| **Anthropic SDK مع fallback** | كود Production-ready، يعمل في sandbox بدون مفتاح |
| **TypeScript types في `lib/mock/types.ts`** | المصدر الوحيد للنموذج البياني — ينتقل لـPrisma لاحقًا |
| **i18n عبر dictionary مركزي** | نمط `dict.foo.bar` مع TypeScript schema يمنع أي نص محشور |

---

## ٣. حزمة التقنية (Tech Stack)

### ٣.١ الجبهة (Frontend)
| الطبقة | التقنية | الإصدار | لماذا |
|---|---|---|---|
| Framework | Next.js | 15.x | App Router، RSC، RTL، API routes |
| UI Library | React | 19.x | Concurrent rendering |
| Styling | Tailwind CSS | 4.x | Tokens + RTL plugin |
| Components | Radix UI (primitives) | 1.x | Accessibility |
| Icons | lucide-react | 0.x | متّسق ومتاح |
| State (in-memory) | React Context + hooks | — | بساطة |
| State (persisted) | localStorage | — | v1.0 فقط |
| Types | TypeScript | 5.x | صارم |
| Themes | next-themes | 0.4 | Light/Dark |

### ٣.٢ الـAPI (v1.0)
| الطبقة | التقنية | لماذا |
|---|---|---|
| Routes | Next.js Route Handlers (`app/api/*/route.ts`) | بدون خادم منفصل |
| LLM | `@anthropic-ai/sdk` | محادثة المساعد |
| Validation | TypeScript types | يستعاض عنه بـZod في v2 |

### ٣.٣ الإنتاج المخطَّط (v2.0)
| الطبقة | التقنية المقترحة | البديل |
|---|---|---|
| Database | PostgreSQL + Prisma | Supabase |
| Auth | Auth.js (NextAuth) | Clerk |
| OTP/SMS | Unifonic API | Twilio |
| File storage | S3 / Azure Blob | Cloudinary |
| OCR | Anthropic Claude Vision أو Google Cloud Vision | AWS Textract |
| Payment | Moyasar أو HyperPay أو Tap | — |
| WhatsApp | WhatsApp Business API (via Meta Cloud API) | — |
| Hosting | Vercel | AWS Amplify |
| CI/CD | GitHub Actions | — |
| Monitoring | Sentry + Vercel Analytics | Datadog |

---

## ٤. هيكل المستودع (Monorepo)

### ٤.١ البنية
```
muqsit-platform/
├── apps/
│   └── web/                          # تطبيق Next.js الرئيسي
│       ├── src/
│       │   ├── app/                  # App Router
│       │   │   ├── (app)/            # شاشات المكتب
│       │   │   ├── (auth)/           # تسجيل، دخول، دعوة
│       │   │   ├── (admin)/          # شاشات مدير المنصة
│       │   │   ├── (portal)/         # بوابات المستثمر/العميل
│       │   │   └── api/              # Route handlers
│       │   ├── components/
│       │   │   ├── ui/               # primitives (Button, Card…)
│       │   │   ├── admin/            # خاصة بـ/admin
│       │   │   ├── subscription/     # خاصة بـ/subscription
│       │   │   └── providers/        # I18n, Auth, Store…
│       │   └── lib/
│       │       ├── mock/             # طبقة البيانات الحالية
│       │       ├── i18n/             # dictionaries.ts
│       │       └── utils.ts
│       └── package.json
├── packages/
│   └── shared-types/                 # types قابلة للمشاركة
├── docs/
│   ├── Muqsit_BRD_v1.0.docx
│   ├── Muqsit_BRS_v1.0.md            # المتطلبات
│   ├── Muqsit_TDD_v1.0.md            # هذه الوثيقة
│   └── review/                       # PDFs ولقطات السبرنتات
├── CLAUDE.md                          # تعليمات لـClaude Code
├── pnpm-lock.yaml
└── package.json
```

### ٤.٢ القرارات
- **Monorepo بـpnpm workspaces**: مستقبلًا سيُضاف `apps/mobile` و`apps/api`.
- **`packages/shared-types`**: يحوي types يستخدمها أكثر من تطبيق (web + mobile + api).

---

## ٥. التوجيه (Routing) والتنقل

### ٥.١ Route Groups
| الـGroup | المسارات | المستخدم |
|---|---|---|
| `(app)` | `/dashboard`, `/investors`, `/customers`, `/contracts`, `/installment-contracts`, `/collections`, `/financial/*`, `/permissions`, `/approvals`, `/audit`, `/notifications`, `/settings`, `/employees`, `/migration`, `/operations`, `/whatsapp/*`, `/subscription`, `/subscription/checkout` | مدير/موظف المكتب |
| `(auth)` | `/login`, `/register`, `/register/verify`, `/welcome`, `/invite/[token]`, `/select-tenant` | غير مسجَّلين أو مدعوّون |
| `(admin)` | `/admin/dashboard`, `/admin/offices/*`, `/admin/employees/*`, `/admin/plans/*`, `/admin/settings`, `/admin/audit` | مدير المنصة |
| `(portal)` | `/portal/investor/*`, `/portal/customer/*` | المستثمر/العميل |
| API | `/api/chat` | كل المستخدمين |

### ٥.٢ مبدأ التنقل
- **شريط جانبي للمكتب** (`<Sidebar />`): العمليات، الإدارة، المالية، الأرشيف، البوابات، النظام.
- **شريط جانبي للأدمن** (`<AdminSidebar />`): لوحة المنصة، المكاتب، الباقات، موظفو النظام، إعدادات المنصة، سجل العمليات.
- **شريط علوي مشترك** (`<TopBar />`): التبديل بين العربية/الإنجليزية، Light/Dark، Notifications bell.
- **بوابات** (`<PortalShell />`): شريط أبسط بـ٣–٤ روابط فقط.

### ٥.٣ الـmiddleware (مستقبلي v2)
في الإنتاج، يحرس middleware دخول الـroutes حسب الدور:
```
/admin/* → systemAdmin OR systemEmployee with viewOffices permission
/employees/* → officeManager OR officeEmployee with managePermissions
/portal/investor/* → investor only
/portal/customer/* → customer only
```

---

## ٦. إدارة الحالة (State Management)

### ٦.١ المستويات (v1.0)
| المستوى | التطبيق |
|---|---|
| **محلي للمكوّن** | `useState` |
| **عابر بين عدّة مكوّنات** | React Context |
| **محفوظ بين الجلسات** | localStorage |

### ٦.٢ الـProviders الرئيسية
| الـProvider | الـContext | المسؤولية |
|---|---|---|
| `<I18nProvider>` | `dict, locale, dir, setLocale` | يقرأ `muqsit_locale` من localStorage |
| `<AuthProvider>` | `user, office, tenant, isAuthenticated, login, logout, registerOffice, daysLeftInTrial` | يقرأ `muqsit_auth`, `muqsit_session`, `muqsit_tenant` |
| `<ContractStoreProvider>` | `employees, roles, customers, contracts, installmentContracts, …` | الـmock store الكامل |
| `<ThemeProvider>` (next-themes) | الـtheme | Light/Dark |
| `<NotificationsProvider>` | الإشعارات + جرس | — |

### ٦.٣ مفاتيح localStorage
| المفتاح | المحتوى |
|---|---|
| `muqsit_auth` | "true" \| absent |
| `muqsit_session` | JSON: `{ user, office? }` |
| `muqsit_tenant` | JSON: `{ id, name }` |
| `muqsit_locale` | "ar" \| "en" |
| `theme` | "light" \| "dark" \| "system" |
| `muqsit_store_*` | الـmock data المعدَّلة (بحسب الكيان) |

### ٦.٤ خطة الانتقال إلى v2
- localStorage → جلسات server-side عبر Auth.js.
- Mock store → استدعاءات API + React Query للـcaching.
- التغيير لا يلمس الـcomponents — فقط الـproviders.

---

## ٧. طبقة البيانات

### ٧.١ النموذج البياني (v1.0)
كل الكيانات معرَّفة في `apps/web/src/lib/mock/types.ts` كـTypeScript interfaces/types. أمثلة:

```typescript
export interface Investor {
  id: string;
  name: string;
  type: "internal" | "external";
  identity: LegalIdentity;
  currentBalance: number;
  realizedProfit: number;
  totalCapital: number;
  // ...
}
```

### ٧.٢ ملفات الـMock
| الملف | المحتوى |
|---|---|
| `lib/mock/types.ts` | كل الـtypes |
| `lib/mock/store.tsx` | الـContextStore الرئيسي (employees, roles, customers…) |
| `lib/mock/investors.ts` | البذرة المستثمرين |
| `lib/mock/customers.ts` | البذرة العملاء |
| `lib/mock/contracts.ts` | البذرة عقود الاستثمار |
| `lib/mock/installment-contracts.ts` | البذرة عقود التقسيط |
| `lib/mock/payments.ts` | البذرة الأقساط والدفعات |
| `lib/mock/payment-proofs.ts` | البذرة إثباتات الدفع |
| `lib/mock/receipts.ts` | البذرة سندات القبض |
| `lib/mock/approvals.ts` | البذرة طلبات الموافقة |
| `lib/mock/audit.ts` | البذرة سجل العمليات |
| `lib/mock/notifications.ts` | البذرة الإشعارات |
| `lib/mock/employees.ts` | البذرة موظفو المكتب + Roles |
| `lib/mock/office-settings.ts` | البذرة إعدادات المكتب |
| `lib/mock/whatsapp.ts` | البذرة محادثات الواتساب |
| `lib/mock/migration-samples.ts` | البذرة رحلة الانتقال |
| `lib/mock/cash-ledger.ts` | البذرة دفتر النقدية |
| `lib/mock/purchases.ts` | البذرة المشتريات |
| `lib/mock/profit.ts` | البذرة توزيعات الأرباح |
| `lib/mock/recycling.ts` | البذرة إعادة التشغيل |
| `lib/mock/admin-data.ts` | البذرة المكاتب + موظفو المنصة + إعدادات المنصة + سجل المنصة + قوالب أدوار النظام |
| `lib/mock/plans.ts` | البذرة الباقات |
| `lib/mock/feature-content.ts` | المحتوى التسويقي للمزايا |

### ٧.٣ المخطط البياني المستهدف (v2 — Prisma)
الانتقال يتم بترجمة كل interface إلى نموذج Prisma. مثال:

```prisma
model Investor {
  id              String   @id @default(cuid())
  name            String
  type            InvestorType
  identityType    String
  nationalId      String?
  gccId           String?
  // ...
  currentBalance  Decimal  @db.Decimal(18, 2)
  realizedProfit  Decimal  @db.Decimal(18, 2)
  totalCapital    Decimal  @db.Decimal(18, 2)
  // ...
  officeId        String
  office          OfficeAccount @relation(fields: [officeId], references: [id])
  investmentContracts InvestmentContract[]
}

enum InvestorType {
  internal
  external
}
```

### ٧.٤ سياسة Multi-tenant
- كل كيان مستثمر/عميل/عقد/سند يحمل `officeId`.
- في الـAPI: كل query يُضاف لها `where: { officeId: session.officeId }`.
- في الـRLS (PostgreSQL Row-Level Security) — يُضاف لاحقًا للأمان المزدوج.

---

## ٨. الـi18n

### ٨.١ المصدر الوحيد
- `apps/web/src/lib/i18n/dictionaries.ts` يحتوي:
  - `DictionarySchema` (TypeScript interface).
  - `arDictionary` و`enDictionary` (يطابقان الـschema).
- التحقق أثناء البناء: `tsc` يكشف أي نص ناقص.

### ٨.٢ النمط في الكود
```tsx
const { dict, locale, dir } = useI18n();
return <h1>{dict.officeEmployees.title}</h1>;
```

### ٨.٣ معالجة الأرقام والتواريخ
- الأرقام المالية: `value.toLocaleString(locale === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US')`.
- التواريخ: مثل الأرقام، أو هجرية بـ`ar-SA-u-ca-islamic`.
- العناصر الرقمية تُحاط بـ`<span className="num" dir="ltr">` لضبط الاتجاه.

### ٨.٤ معالجة الـRTL
- Tailwind 4 يدعم `dir="rtl"` تلقائيًا في الـlogical properties (`start`, `end`, `pe-`, `ps-`…).
- الأيقونات الاتجاهية (`ArrowLeft/ArrowRight`): يُختار العنصر بناءً على `dir`:
  ```tsx
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  ```

---

## ٩. المصادقة والترخيص

### ٩.١ النموذج الحالي (v1.0)
- لا backend → المصادقة محاكاة عبر localStorage.
- `<AuthProvider>` يقرأ ثلاثة مفاتيح ويوفّر الـcontext.
- نموذج تسجيل: يكتب البيانات إلى localStorage ويوجّه إلى `/dashboard`.

### ٩.٢ النموذج المخطَّط (v2)
- Auth.js (NextAuth) مع مزوّد OTP عبر Unifonic.
- جلسة JWT مع `userId`, `role`, `officeId`.
- middleware يحرس الـroutes (انظر §٥.٣).
- API routes تتحقق من الجلسة قبل أي إجراء حسّاس.

### ٩.٣ نموذج الترخيص (Authorization)
- **مستوى أول — الدور** (`role`):
  - `systemAdmin`: كل شيء على مستوى المنصة + جميع المكاتب.
  - `systemEmployee`: مصفوفة `SystemPermissionAction × PermissionState`.
  - `officeManager`: كل شيء داخل مكتبه.
  - `officeEmployee`: مصفوفة `PermissionAction × PermissionState`.
  - `investor`/`customer`: بوابة فقط.
- **مستوى ثانٍ — المصفوفة**: لكل إجراء، الحالة `allow|requireApproval|deny`.
- **مستوى ثالث — Bypass approvals**: خانة على الموظف (Sprint 4).

### ٩.٤ التطبيق على الـUI
- كل زر/إجراء يمرّ على `usePermission(action)` يعيد الحالة.
- الـUI يعرض:
  - `allow`: زر عادي.
  - `requireApproval`: زر بشارة «يحتاج موافقة» — يفتح modal طلب الموافقة.
  - `deny`: الزر مخفي.

### ٩.٥ التطبيق على الـAPI (v2)
```typescript
export async function POST(req: Request) {
  const session = await getSession();
  const state = checkPermission(session, "createInstallmentContract");
  if (state === "deny") return forbidden();
  if (state === "requireApproval") return createApprovalRequest(...);
  // proceed
}
```

---

## ١٠. نموذج الاشتراك

### ١٠.١ النموذج
- `SubscriptionPlan` (BRS §٥.٢٣).
- `OfficeAccount.planId/planDuration/planStartedAt/planEndsAt`.
- الـSnapshot عند الاشتراك: يُحفظ سعر اللحظة مع المعاملة (في v2 على جدول `SubscriptionTransaction`).

### ١٠.٢ الجدول المخطَّط (v2)
```prisma
model SubscriptionTransaction {
  id                 String   @id @default(cuid())
  officeId           String
  planId             String
  planSnapshot       Json     // كامل الباقة لحظة الدفع
  duration           Int
  price              Decimal  @db.Decimal(18, 2)
  paymentMethod      String
  status             TxStatus // pending, paid, failed, refunded
  gatewayReference   String?  // من Moyasar/HyperPay
  startedAt          DateTime?
  endsAt             DateTime?
  createdAt          DateTime @default(now())
}
```

### ١٠.٣ تجديد الاشتراك
- في v2: cron job يكشف `planEndsAt - 7 days` ويرسل تنبيهًا.
- 0 يوم → ينتقل إلى `expired` (إلا إذا فعّل التجديد التلقائي).

---

## ١١. المساعد الذكي (LLM Chat)

### ١١.١ الـArchitecture
```
ChatWidget (client component)
   ↓ fetch POST /api/chat
   ↓ { locale, messages[] }
   ↓
/api/chat (server route)
   ↓ if ANTHROPIC_API_KEY:
   ↓   call Anthropic SDK (claude-haiku-4-5-20251001)
   ↓ else:
   ↓   fallbackReply (intent-matched)
   ↓
   ↓ { reply, fallback? }
   ↓
ChatWidget renders
```

### ١١.٢ الـSystem Prompt
- محفوظ في `apps/web/src/app/api/chat/route.ts` (AR + EN).
- يحوي:
  - الباقتان + الأسعار.
  - شرح كل ميزة.
  - نطاق المساعد الذكي على الواتساب.
  - وسائل الدفع.
  - قواعد الردّ (٣ فقرات، عربي بسيط، لا اختراع).

### ١١.٣ الـFallback
- intent matching بـregex على أسئلة شائعة (الفرق، المساعد، OCR، SMS vs WhatsApp، السعر، التوصية).
- كل intent يردّ ردًّا غنيًا بالعربي.
- يُعَدّ جزءًا من المنتج، ليس مجرد placeholder — نضمن أن البروتوتايب يراجَع كاملًا بدون مفتاح.

### ١١.٤ خطة v2
- استمرار في الـAPI route نفسه (لا يتغيّر).
- إضافة streaming responses عبر Server-Sent Events.
- إضافة Rate limiting لكل مكتب.
- إضافة سياق المكتب الفعلي (عدد العملاء، الباقة الحالية) إلى الـsystem prompt للتوصيات الذكية.

---

## ١٢. الـCode Conventions

### ١٢.١ تنظيم الـComponents
- **Server components افتراضيًا**؛ تُحوَّل إلى client فقط عند الحاجة (state, useEffect).
- **`"use client";` في أعلى الملف** للـclient components.
- **Naming**: PascalCase للملفات (`PlanEditor.tsx`) أو kebab-case (`plan-editor.tsx`) — متّبع نمط Next.js.
- **Co-location**: المكوّنات الخاصة بـroute داخل مجلده. المشتركة في `components/`.

### ١٢.٢ TypeScript
- `strict: true` في `tsconfig.json`.
- لا `any`.
- `Record<K, V>` للـmaps.
- Discriminated unions للحالات (مثل `LegalIdentity`).

### ١٢.٣ Tailwind
- استخدام Logical properties (`start`/`end`) للـRTL.
- الألوان من الـtokens فقط (`bg-primary`, `text-success`…).
- لا inline styles.

### ١٢.٤ Imports
- Absolute paths بـ`@/` (لـ`apps/web/src/`).
- ترتيب: مكتبات → داخلية → relative.

---

## ١٣. الأداء

### ١٣.١ Bundle Size (الحالي)
- First Load JS shared: ~103 KB (بحسب آخر build).
- صفحات تفصيلية: 4-9 KB إضافية.
- معظم الصفحات `Static` (○) أو `Dynamic` (ƒ) عند الحاجة.

### ١٣.٢ Optimization Patterns
- `next/dynamic` للـcomponents الثقيلة (chat widget, charts).
- `next/image` للصور.
- `Suspense` للـlazy boundaries (مثل `useSearchParams` في الـcheckout).

### ١٣.٣ خطة v2
- React Query للـcaching على العميل.
- Edge runtime لـAPI routes البسيطة.
- ISR (Incremental Static Regeneration) لصفحات المحتوى التسويقي.

---

## ١٤. الاختبارات

### ١٤.١ الحالي (v1.0)
- `tsc --noEmit` على كل commit.
- `next lint` على كل commit.
- `next build` للتأكد من البناء.
- لقطات بصرية على كل سبرنت (٦–١٠ لكل سبرنت).

### ١٤.٢ المخطَّط (v2)
| النوع | الأداة | التغطية |
|---|---|---|
| Unit tests | Vitest | منطق الـbusiness في `lib/` |
| Component tests | React Testing Library | المكوّنات الحساسة |
| E2E | Playwright | رحلات حرجة (تسجيل، اشتراك، دورة التحصيل) |
| API tests | Vitest + supertest-like | كل route handler |

---

## ١٥. الأمان

### ١٥.١ الحالي (v1.0)
- بيانات على localStorage — للعرض فقط.
- لا توجد بيانات حقيقية في الـrepo.

### ١٥.٢ المخطَّط (v2)
| المجال | التطبيق |
|---|---|
| **Auth** | Auth.js + OTP + (اختياري) كلمة مرور بـbcrypt |
| **Authorization** | middleware + check في كل API route |
| **Multi-tenancy** | every query scoped by officeId (+ RLS optional) |
| **Encryption at rest** | PostgreSQL transparent encryption + الـsensitive fields (الآيبان، رقم الهوية) بـapp-level encryption |
| **HTTPS** | في كل الـenvironments |
| **CSP** | strict + nonce على الـscripts |
| **Rate limiting** | على /api/chat، على /api/auth |
| **Audit** | كل عملية حساسة → AuditEntry على الـDB |
| **Secrets** | في Vercel Env + لا commit |
| **Dependency scanning** | Dependabot + Snyk |
| **Penetration test** | قبل أول إنتاج |

---

## ١٦. النشر (Deployment)

### ١٦.١ البيئات (Environments)
| البيئة | الغرض | المضيف |
|---|---|---|
| Local | تطوير | localhost:3000 |
| Preview | كل PR | Vercel preview |
| Staging | اختبار قبل الإنتاج | Vercel staging URL |
| Production | الإنتاج | Vercel + custom domain |

### ١٦.٢ متغيرات البيئة
```
# Public
NEXT_PUBLIC_APP_URL=https://muqsit.sa

# Server
DATABASE_URL=postgresql://...
AUTH_SECRET=...
ANTHROPIC_API_KEY=sk-ant-...
UNIFONIC_API_KEY=...
MOYASAR_API_KEY=...
WHATSAPP_PHONE_ID=...
WHATSAPP_TOKEN=...
S3_BUCKET=...
S3_REGION=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
SENTRY_DSN=...
```

### ١٦.٣ CI/CD (مخطَّط)
- GitHub Actions.
- على كل push:
  1. `pnpm install --frozen-lockfile`
  2. `tsc --noEmit`
  3. `next lint`
  4. `vitest run`
  5. `next build`
- على main: deploy تلقائي إلى Staging.
- Manual trigger لـProduction.

### ١٦.٤ Database Migrations
- Prisma Migrate.
- كل migration مراجَعة قبل الـmerge.
- في Production: `prisma migrate deploy` كخطوة في الـpipeline.

---

## ١٧. الانتقال من v1.0 إلى v2.0

### ١٧.١ نهج الترحيل
**الخطوة ١:** إضافة طبقة API على نفس الـrepo بدون لمس الـUI:
- `app/api/investors/route.ts`، `app/api/customers/route.ts`، …
- تعيد الـmock data أولًا (نفس الـshape).

**الخطوة ٢:** تركيب قاعدة بيانات + Prisma:
- ترجمة `lib/mock/types.ts` إلى `schema.prisma`.
- script لـseeding من ملفات mock.

**الخطوة ٣:** ربط الـAPI routes بـPrisma:
- استبدال `MOCK_*` بـ`prisma.*.findMany()`.

**الخطوة ٤:** ربط الـUI بـAPI:
- React Query في الـproviders.
- استبدال الـContextStore بـquery hooks.

**الخطوة ٥:** Auth حقيقي:
- Auth.js + OTP.
- استبدال localStorage بـsession.

**الخطوة ٦:** الـintegrations:
- WhatsApp Business API.
- SMS gateway.
- OCR service.
- Payment gateway.

### ١٧.٢ التتبّع
كل خطوة لها sprint محدد:

| Sprint | المحتوى |
|---|---|
| 18 | API layer (mock-backed) |
| 19 | PostgreSQL + Prisma |
| 20 | Auth.js + real auth |
| 21 | WhatsApp Business API integration |
| 22 | SMS gateway (Unifonic) |
| 23 | OCR service (Claude Vision) |
| 24 | Payment gateway (Moyasar) |
| 25 | ZATCA e-invoicing |
| 26 | Reports module (deferred from Phase 2) |

---

## ١٨. القرارات التقنية المؤجَّلة (Phase 2)

### ١٨.١ ما لم يُحسَم بعد
| القرار | الاحتمالات | التأجيل لـ |
|---|---|---|
| **PostgreSQL Self-hosted أم Managed (Neon/Supabase/RDS)** | Vercel Postgres / Supabase / RDS | Sprint 19 |
| **WhatsApp via Meta مباشرة أم BSP (مثل MessageBird)** | Meta Cloud API / MessageBird / 360dialog | Sprint 21 |
| **OCR للهويات بـClaude Vision أم خدمة متخصصة** | Claude Vision / Tabby / Tarmeez | Sprint 23 |
| **Payment Gateway** | Moyasar / HyperPay / Tap / Geidea | Sprint 24 |
| **Auth UX** | OTP only / OTP + password / social login | Sprint 20 |
| **Mobile apps technology** | React Native (Expo) / Flutter / Native | Phase 2 — بعد إثبات الويب |

### ١٨.٢ ما حُسم سلفًا
- ✅ Next.js 15 App Router للـweb.
- ✅ TypeScript بالتزام صارم.
- ✅ Tailwind 4 + Radix UI.
- ✅ Anthropic Claude للـLLM.
- ✅ pnpm workspaces.
- ✅ Vercel للـhosting الأولي.

---

## ١٩. ما لا تشمله هذه الوثيقة

- تفاصيل خوارزميات Profit Distribution (في الكود + BRS §٥.٩).
- محتوى الـsystem prompt الكامل للشات (في الكود).
- مخططات DB التفصيلية (تُكتب في Sprint 19).
- مخططات API التفصيلية (تُكتب في Sprint 18).

---

## ٢٠. تتبّع التغييرات

| الإصدار | التاريخ | التغيير |
|---|---|---|
| **TDD v1.0** | **2026-06-14** | الإصدار الأول. يغطي البنية الحالية + خطة الانتقال إلى الإنتاج. |

---

*نهاية وثيقة TDD v1.0*
