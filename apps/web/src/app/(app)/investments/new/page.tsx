"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { IdentityBadge } from "@/components/ui/identity-badge";
import { Stepper } from "@/components/ui/stepper";
import { DataRow, DataRows } from "@/components/ui/data-row";
import { InvestorAvatar } from "@/components/investor-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_INVESTORS } from "@/lib/mock/investors";
import { useContractStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";
import type { InvestmentContract } from "@/lib/mock/types";

const DURATIONS = [12, 18, 24, 30, 36] as const;

function addMonths(iso: string, months: number): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function nextContractId(): { id: string; number: string } {
  const stamp = Date.now().toString(36).slice(-6).toUpperCase();
  const year = new Date().getFullYear();
  return { id: `c-user-${stamp}`, number: `INV-${year}-U${stamp.slice(-3)}` };
}

export default function NewInvestmentContractPage() {
  const router = useRouter();
  const { dict, dir, locale } = useI18n();
  const { addContract } = useContractStore();
  const c = dict.investments.create;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const [step, setStep] = useState(0);
  const [investorId, setInvestorId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [durationMonths, setDurationMonths] = useState<number>(24);
  const [operationPct, setOperationPct] = useState<string>("15");
  const [profitNotes, setProfitNotes] = useState<string>("");
  const [goodsMarginNotes, setGoodsMarginNotes] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const investor = useMemo(
    () => MOCK_INVESTORS.find((i) => i.id === investorId),
    [investorId],
  );

  const isInternal = investor?.type === "internal";
  const effectiveOpsPct = isInternal ? 0 : Number(operationPct || 0);
  const endDate = useMemo(
    () => addMonths(startDate, durationMonths),
    [startDate, durationMonths],
  );
  const amountNum = Number(amount.replace(/[^\d]/g, "") || 0);

  const steps = [
    { key: "investor", label: c.steps.investor },
    { key: "terms", label: c.steps.terms },
    { key: "notes", label: c.steps.notes },
    { key: "review", label: c.steps.review },
  ];

  const canNext = (() => {
    switch (step) {
      case 0:
        return Boolean(investorId);
      case 1:
        return amountNum > 0 && Boolean(startDate);
      case 2:
        return true; // notes optional
      default:
        return true;
    }
  })();

  const handleSave = () => {
    if (!investor) return;
    setSaving(true);
    const { id, number } = nextContractId();
    const today = new Date().toISOString().slice(0, 10);
    const contract: InvestmentContract = {
      id,
      number,
      investorId: investor.id,
      amount: amountNum,
      startDate,
      endDate,
      durationMonths,
      operationPct: effectiveOpsPct,
      utilized: 0,
      remaining: amountNum,
      status: "pendingSetup",
      profitNotes: profitNotes || "—",
      goodsMarginNotes: goodsMarginNotes || "—",
      documentName: documentName || undefined,
      timeline: [{ ts: today, text: "إعداد عقد جديد للمستثمر" }],
      linkedInstallmentContractIds: [],
    };
    addContract(contract);
    setTimeout(() => router.push(`/investments/${id}`), 200);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{c.pageTitle}</h1>
      </header>

      <Stepper steps={steps} current={step} />

      <Card>
        {/* Step 1: select investor */}
        {step === 0 ? (
          <>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{c.step1.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="investor-select">{c.step1.selectInvestor}</Label>
                <select
                  id="investor-select"
                  value={investorId}
                  onChange={(e) => setInvestorId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">{c.step1.searchPlaceholder}</option>
                  {MOCK_INVESTORS.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} — {dict.investorType[inv.type]}
                    </option>
                  ))}
                </select>
              </div>

              {investor ? (
                <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-4">
                  <div className="flex items-start gap-3">
                    <InvestorAvatar name={investor.name} kind={investor.identity.kind} size="md" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-semibold">{investor.name}</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusPill tone={investor.type === "internal" ? "primary" : "gold"}>
                          {dict.investorType[investor.type]}
                        </StatusPill>
                        <IdentityBadge kind={investor.identity.kind} />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm sm:grid-cols-3">
                    <div className="space-y-0.5">
                      <p className="label">{dict.investors.columns.totalCapital}</p>
                      <p className="num font-medium">
                        <Currency value={investor.totalCapital} compact />
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="label">{dict.investors.columns.utilized}</p>
                      <p className="num font-medium">
                        <Currency value={investor.utilizedCapital} compact />
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="label">{dict.investors.columns.unutilized}</p>
                      <p className="num font-medium">
                        <Currency value={investor.unutilizedCapital} compact />
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{c.step1.noneSelected}</p>
              )}
            </CardContent>
          </>
        ) : null}

        {/* Step 2: terms */}
        {step === 1 ? (
          <>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{c.step2.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="amount">{c.step2.amount}</Label>
                <Input
                  id="amount"
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d,]/g, ""))}
                  placeholder="1,500,000"
                  className="num"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">{c.step2.startDate}</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="num"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">{c.step2.duration}</Label>
                <select
                  id="duration"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {DURATIONS.map((m) => (
                    <option key={m} value={m}>
                      {m} {c.step2.durationMonths}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>{c.step2.endDate}</Label>
                <div className="num flex h-10 items-center rounded-md border border-dashed border-border bg-muted/40 px-3 text-sm text-muted-foreground">
                  {endDate || c.step2.endDateAuto}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ops-pct">{c.step2.operationPct}</Label>
                <Input
                  id="ops-pct"
                  type="number"
                  min="0"
                  max="50"
                  value={isInternal ? 0 : operationPct}
                  onChange={(e) => setOperationPct(e.target.value)}
                  disabled={isInternal}
                  className="num"
                />
                {isInternal ? (
                  <p className="text-xs text-muted-foreground">
                    {c.step2.operationPctInternalNote}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </>
        ) : null}

        {/* Step 3: notes & documents */}
        {step === 2 ? (
          <>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{c.step3.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profit-notes">{c.step3.profitNotes}</Label>
                <textarea
                  id="profit-notes"
                  value={profitNotes}
                  onChange={(e) => setProfitNotes(e.target.value)}
                  rows={3}
                  placeholder={c.step3.profitNotesPlaceholder}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goods-notes">{c.step3.goodsMarginNotes}</Label>
                <textarea
                  id="goods-notes"
                  value={goodsMarginNotes}
                  onChange={(e) => setGoodsMarginNotes(e.target.value)}
                  rows={3}
                  placeholder={c.step3.goodsMarginNotesPlaceholder}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>{c.step3.attachment}</Label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setDocumentName(e.target.files?.[0]?.name ?? "")
                      }
                    />
                    {c.step3.chooseFile}
                  </label>
                  <span className="num text-xs text-muted-foreground">
                    {documentName || c.step3.noFile}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{c.step3.attachmentHint}</p>
              </div>
            </CardContent>
          </>
        ) : null}

        {/* Step 4: review */}
        {step === 3 ? (
          <>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{c.step4.title}</CardTitle>
              <p className="text-xs text-muted-foreground">{c.step4.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              {investor ? (
                <section className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                    {c.step4.investorBlock}
                  </h3>
                  <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <InvestorAvatar
                      name={investor.name}
                      kind={investor.identity.kind}
                      size="md"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-semibold">{investor.name}</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusPill tone={investor.type === "internal" ? "primary" : "gold"}>
                          {dict.investorType[investor.type]}
                        </StatusPill>
                        <IdentityBadge kind={investor.identity.kind} />
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}

              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                  {c.step4.contractBlock}
                </h3>
                <DataRows>
                  <DataRow
                    label={c.step2.amount}
                    value={<Currency value={amountNum} />}
                  />
                  <DataRow
                    label={c.step2.startDate}
                    value={startDate ? formatDate(startDate, locale) : "—"}
                  />
                  <DataRow
                    label={c.step2.endDate}
                    value={endDate ? formatDate(endDate, locale) : "—"}
                  />
                  <DataRow
                    label={c.step2.duration}
                    value={`${durationMonths} ${dict.investments.details.months}`}
                  />
                  <DataRow
                    label={c.step2.operationPct}
                    value={<span className="num">{effectiveOpsPct}%</span>}
                  />
                </DataRows>
              </section>

              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                  {c.step4.notesBlock}
                </h3>
                <DataRows>
                  <DataRow
                    label={c.step3.profitNotes}
                    value={
                      <span className="text-end">
                        {profitNotes || (
                          <span className="text-muted-foreground">{dict.common.none}</span>
                        )}
                      </span>
                    }
                  />
                  <DataRow
                    label={c.step3.goodsMarginNotes}
                    value={
                      <span className="text-end">
                        {goodsMarginNotes || (
                          <span className="text-muted-foreground">{dict.common.none}</span>
                        )}
                      </span>
                    }
                  />
                  <DataRow
                    label={c.step3.attachment}
                    value={
                      <span className="num text-xs">
                        {documentName || (
                          <span className="text-muted-foreground">{c.step3.noFile}</span>
                        )}
                      </span>
                    }
                  />
                </DataRows>
              </section>
            </CardContent>
          </>
        ) : null}

        {/* Footer nav */}
        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-3">
          <Button
            variant="ghost"
            type="button"
            onClick={() => (step === 0 ? router.push("/investments") : setStep(step - 1))}
            className="gap-1"
          >
            <BackArrow className="size-4" />
            {step === 0 ? dict.common.cancel : dict.common.back}
          </Button>
          {step < 3 ? (
            <Button
              type="button"
              disabled={!canNext}
              onClick={() => setStep(step + 1)}
              className="gap-1"
            >
              {dict.common.next}
              <Arrow className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="gap-1.5"
            >
              {saving ? dict.common.saving : dict.common.save}
              {!saving ? <Check className="size-4" /> : null}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
