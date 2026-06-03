"use client";

import { CustomerShell } from "@/components/portal/customer-shell";
import { UploadForm } from "@/components/portal/upload-form";
import { useI18n } from "@/components/providers/i18n-provider";

export default function CustomerUploadPage() {
  const { dict } = useI18n();
  return (
    <CustomerShell>
      <div className="space-y-4">
        <header>
          <h1 className="text-xl font-semibold tracking-tight">{dict.portals.customer.upload.pageTitle}</h1>
        </header>
        <UploadForm />
      </div>
    </CustomerShell>
  );
}
