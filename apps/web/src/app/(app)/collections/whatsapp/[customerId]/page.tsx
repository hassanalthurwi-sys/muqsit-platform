"use client";

import { use } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppBubble } from "@/components/ui/whatsapp-message";
import { useStore } from "@/lib/mock/store";
import { findThread } from "@/lib/mock/whatsapp";
import { useI18n } from "@/components/providers/i18n-provider";

export default function WhatsAppConversationPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = use(params);
  const { dict } = useI18n();
  const { customers } = useStore();
  const customer = customers.find((c) => c.id === customerId);
  const thread = findThread(customerId);

  if (!customer || !thread) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        لا توجد محادثة لهذا العميل بعد.
      </div>
    );
  }

  const w = dict.collections.whatsapp;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="space-y-2">
        <Link
          href={`/customers/${customer.id}`}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← {customer.name}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{w.title}</h1>
        <p className="text-sm text-muted-foreground">{w.subtitle}</p>
      </header>

      <Card>
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="flex items-center gap-3 text-base font-semibold">
            <span className="flex size-9 items-center justify-center rounded-full bg-success-soft text-success-foreground">
              <Phone className="size-4" />
            </span>
            <span className="flex flex-col">
              <span>{customer.name}</span>
              <span className="num text-xs font-normal text-muted-foreground" dir="ltr">
                {customer.mobile}
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 bg-muted/30 py-5">
          {thread.messages.map((m) => (
            <WhatsAppBubble key={m.id} message={m} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
