"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Recycle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { IdentityBadge } from "@/components/ui/identity-badge";
import { RecycledBadge } from "@/components/ui/recycled-badge";
import { Stepper } from "@/components/ui/stepper";
import { DataRow, DataRows } from "@/components/ui/data-row";
import { InvestorAvatar } from "@/components/investor-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_INVESTORS, findInvestor } from "@/lib/mock/investors";
import { useStore, useContractStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";
import { collectedFor, nextRecycleNumber } from "@/lib/mock/recycling";
import { cn } from "@/lib/utils";
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

function NewInvestmentContractRouter() {
  const search = useSearchParams();
  const recycleFromId = search.get("recycleFromId");
  if (recycleFromId) {
    return <RecycleForm sourceId={recycleFromId} />;
  }
  return <NewInvestmentContractInner />;
}

function NewInvestmentContractInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { dict, dir, locale } = useI18n();
  const { addContract } = useContractStore();
  const { getInvestorBalance } = useStore();
  const c = dict.investments.create;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const prefilledInvestorId = search.get("investorId") ?? "";
  const isFromBalance = search.get("recycle") === "true";

  const [step, setStep] = useState(prefilledInvestorId ? 1 : 0);
  const [investorId, setInvestorId] = useState<string>(prefilledInvestorId);
  const [amount, setAmount] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [durationMonths, setDurationMonths] = useState<number>(24);
  const [operationPct, setOperationPct] = useState<string>("15");
  const [profitNotes, setProfitNotes] = useState<string>("");
  const [recyclingEnabled, setRecyclingEnabled] = useState<boolean>(true);
  const [recyclingThreshold, setRecyclingThreshold] = useState<string>("");
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
    const thresholdNum = Number(recyclingThreshold.replace(/[^\d]/g, "") || 0);
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
      capitalRecyclingEnabled: recyclingEnabled,
      capitalRecyclingMinThreshold:
        recyclingEnabled && thresholdNum > 0 ? thresholdNum : undefined,
      documentName: documentName || undefined,
      timeline: [{ ts: today, text: "إعداد عقد جديد للمستثمر" }],
      linkedInstallmentContractIds: [],
      fromInvestorBalance: isFromBalance || undefined,
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
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="space-y-0.5">
                      <p className="label">{dict.investors.metric.currentBalance}</p>
                      <p className="num font-medium">
                        <Currency value={getInvestorBalance(investor.id)} compact />
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="label">{dict.investors.profile.totalCapitalLabel}</p>
                      <p className="num font-medium text-muted-foreground">
                        <Currency value={investor.totalCapital} compact />
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
              <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-medium">{c.step3.recyclingToggle}</p>
                    <p className="text-xs leading-5 text-muted-foreground">{c.step3.recyclingNote}</p>
                  </div>
                  <div className="inline-flex shrink-0 overflow-hidden rounded-md border border-input bg-background p-0.5">
                    <button
                      type="button"
                      onClick={() => setRecyclingEnabled(true)}
                      aria-pressed={recyclingEnabled}
                      className={cn(
                        "px-3 py-1 text-xs font-medium transition-colors",
                        recyclingEnabled
                          ? "bg-primary text-primary-foreground rounded-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {dict.common.yes}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecyclingEnabled(false)}
                      aria-pressed={!recyclingEnabled}
                      className={cn(
                        "px-3 py-1 text-xs font-medium transition-colors",
                        !recyclingEnabled
                          ? "bg-primary text-primary-foreground rounded-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {dict.common.no}
                    </button>
                  </div>
                </div>
                {recyclingEnabled ? (
                  <div className="space-y-1.5 pt-2">
                    <Label htmlFor="recycling-threshold" className="text-xs">
                      {c.step3.recyclingThreshold}
                    </Label>
                    <Input
                      id="recycling-threshold"
                      type="text"
                      inputMode="numeric"
                      value={recyclingThreshold}
                      onChange={(e) =>
                        setRecyclingThreshold(e.target.value.replace(/[^\d,]/g, ""))
                      }
                      placeholder="50,000"
                      className="num"
                    />
                    <p className="text-xs leading-5 text-muted-foreground">
                      {c.step3.recyclingThresholdHint}
                    </p>
                  </div>
                ) : null}
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
                    label={c.step3.recyclingToggle}
                    value={
                      <span className="inline-flex items-center gap-2">
                        <StatusPill tone={recyclingEnabled ? "success" : "default"}>
                          {recyclingEnabled
                            ? dict.investments.details.recycling.enabled
                            : dict.investments.details.recycling.disabled}
                        </StatusPill>
                        {recyclingEnabled && Number(recyclingThreshold.replace(/[^\d]/g, "")) > 0 ? (
                          <span className="num text-xs text-muted-foreground">
                            ≥ <Currency value={Number(recyclingThreshold.replace(/[^\d]/g, ""))} compact />
                          </span>
                        ) : null}
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

export default function NewInvestmentContractPage() {
  return (
    <Suspense fallback={null}>
      <NewInvestmentContractRouter />
    </Suspense>
  );
}

// ─── Recycle form ───────────────────────────────────────────────────────────
// Triggered by ?recycleFromId=<id>. The source contract is read silently —
// it informs the calculation and gets recorded internally on the new contract,
// but is intentionally NOT surfaced in the UI per product direction.

function RecycleForm({ sourceId }: { sourceId: string }) {
  const router = useRouter();
  const { dict, dir } = useI18n();
  const t = dict.recycling.form;
  const { investmentContracts, installmentContracts, addInvestmentContract } = useStore();
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const source = investmentContracts.find((c) => c.id === sourceId);
  const collected = source ? Math.round(collectedFor(source, installmentContracts)) : 0;
  const investor = source ? findInvestor(source.investorId) : undefined;

  const [pctStr, setPctStr] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const pct = Number(pctStr);
  const validPct = pctStr !== "" && Number.isFinite(pct) && pct >= 0 && pct <= 100;
  const financing = validPct ? Math.round(collected * (1 - pct / 100)) : 0;
  const officeShare = validPct ? Math.round(collected * (pct / 100)) : 0;

  if (!source || !investor) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          {dict.recycling.empty}
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!validPct) return;
    setSaving(true);
    const existingCycles = investmentContracts
      .filter((c) => c.sourceContractId === source.id)
      .map((c) => c.recyclingCycle ?? 0);
    const cycle = Math.max(0, ...existingCycles) + 1;
    const { id, number } = nextRecycleNumber(source.number, cycle);
    const today = new Date().toISOString().slice(0, 10);
    const newContract: InvestmentContract = {
      id,
      number,
      investorId: source.investorId,
      amount: financing,
      startDate: today,
      // Default 12 months — operationally simple. Operator can adjust on the
      // contract detail later if needed.
      endDate: (() => {
        const d = new Date(today);
        d.setMonth(d.getMonth() + 12);
        return d.toISOString().slice(0, 10);
      })(),
      durationMonths: 12,
      operationPct: pct,
      utilized: 0,
      remaining: financing,
      status: "active",
      profitNotes: source.profitNotes,
      capitalRecyclingEnabled: source.capitalRecyclingEnabled,
      capitalRecyclingMinThreshold: source.capitalRecyclingMinThreshold,
      timeline: [{ ts: today, text: dict.recycling.detail.timelineLabel }],
      linkedInstallmentContractIds: [],
      sourceContractId: source.id,
      recyclingCycle: cycle,
      recycledFromCollected: collected,
      recyclingOfficeMargin: officeShare,
    };
    addInvestmentContract(newContract);
    setCreatedId(id);
  };

  if (createdId) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <div className="rounded-2xl border border-success/30 bg-success-soft/30 p-6 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-success text-white">
            <Check className="size-6" aria-hidden />
          </div>
          <p className="text-base font-semibold text-foreground">{t.successTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.successHint}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="flex-1 gap-1.5">
            <Link href={`/investments/${createdId}`}>{t.viewNew}</Link>
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => router.push("/investments")}>
            {dict.common.back}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      <header className="space-y-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <BackArrow className="size-3.5" aria-hidden />
          {dict.common.back}
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.pageTitle}</h1>
          <RecycledBadge size="md" />
        </div>
      </header>

      <Card>
        <CardContent className="space-y-5 p-5">
          {/* Read-only context */}
          <div className="rounded-xl bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-medium text-muted-foreground">{t.contextLabel}</p>
              <span className="text-sm font-semibold">{investor.name}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-medium text-muted-foreground">{t.collectedLabel}</p>
              <p className="num text-2xl font-semibold text-foreground">
                <Currency value={collected} />
              </p>
            </div>
          </div>

          {/* Percentage input */}
          <div className="space-y-2">
            <Label htmlFor="pct">{t.pctLabel}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="pct"
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step={0.5}
                placeholder={t.pctPlaceholder}
                value={pctStr}
                onChange={(e) => setPctStr(e.target.value)}
                className="num text-lg font-semibold"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{t.pctHint}</p>
          </div>

          {/* Live preview */}
          <div className="space-y-2 rounded-xl border border-primary/20 bg-primary-soft/30 p-4">
            <DataRows>
              <DataRow
                label={t.financingLabel}
                value={
                  validPct ? (
                    <span className="num text-base font-bold text-primary">
                      <Currency value={financing} />
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )
                }
              />
              <DataRow
                label={t.officeShareLabel}
                value={
                  validPct ? <Currency value={officeShare} /> : <span className="text-muted-foreground">—</span>
                }
              />
            </DataRows>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push("/investments?ready=1")}
          disabled={saving}
        >
          {t.cancel}
        </Button>
        <Button
          className="flex-1 gap-1.5"
          onClick={handleSave}
          disabled={!validPct || saving}
        >
          <Recycle className="size-4" aria-hidden />
          {t.submit}
        </Button>
      </div>
    </div>
  );
}
