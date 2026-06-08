"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { IdentityBadge } from "@/components/ui/identity-badge";
import { RiskClassBadge } from "@/components/ui/risk-class-badge";
import { DataRow, DataRows } from "@/components/ui/data-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecycledBadge } from "@/components/ui/recycled-badge";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { addMonthsIso } from "@/lib/mock/installment-contracts";
import { findInvestor } from "@/lib/mock/investors";
import { formatDate } from "@/lib/format";
import type { Installment, InstallmentContract } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

const DEFAULT_START = new Date().toISOString().slice(0, 10);

function buildScheduleSimple(
  contractId: string,
  startDate: string,
  count: number,
  monthly: number,
): Installment[] {
  const out: Installment[] = [];
  for (let i = 1; i <= count; i += 1) {
    out.push({
      id: `${contractId}-i${i}`,
      contractId,
      index: i,
      dueDate: addMonthsIso(startDate, i),
      amount: monthly,
      paidAmount: 0,
      status: "scheduled",
      payments: [],
    });
  }
  return out;
}

export default function NewInstallmentContractPage() {
  const router = useRouter();
  const { dict, dir, locale } = useI18n();
  const { customers, investmentContracts, addInstallmentContract } = useStore();
  const c = dict.installmentContracts.create;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const [step, setStep] = useState(0);
  const [customerId, setCustomerId] = useState("");
  const [productType, setProductType] = useState("");
  const [cashPrice, setCashPrice] = useState("");
  const [installmentPrice, setInstallmentPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [installmentsCount, setInstallmentsCount] = useState<string>("12");
  const [investorIdSel, setInvestorIdSel] = useState("");
  const [invContractId, setInvContractId] = useState("");
  const [amountToUtilize, setAmountToUtilize] = useState("");
  const [saving, setSaving] = useState(false);

  const customer = customers.find((cu) => cu.id === customerId);
  const customerContractsByInvestor = investmentContracts.filter(
    (ic) => ic.investorId === investorIdSel && ic.status === "active",
  );
  const chosenInvContract = investmentContracts.find((ic) => ic.id === invContractId);

  const num = (s: string) => Number(s.replace(/[^\d.]/g, "") || 0);

  const cashPriceNum = num(cashPrice);
  const installmentPriceNum = num(installmentPrice);
  const downPaymentNum = num(downPayment);
  const installmentsCountNum = num(installmentsCount);
  const financingAmount = Math.max(0, installmentPriceNum - downPaymentNum);
  const monthlyInstallment = installmentsCountNum > 0 ? financingAmount / installmentsCountNum : 0;
  const profitMargin = Math.max(0, installmentPriceNum - cashPriceNum);
  const profitMarginPct = cashPriceNum > 0 ? profitMargin / cashPriceNum : 0;
  const endDate =
    installmentsCountNum > 0 ? addMonthsIso(DEFAULT_START, installmentsCountNum) : "";

  // Auto-set utilize amount when investment contract changes
  if (chosenInvContract && amountToUtilize === "") {
    setAmountToUtilize(String(financingAmount || 0));
  }

  const utilizeNum = num(amountToUtilize);
  const availableInChosen = chosenInvContract
    ? chosenInvContract.amount - chosenInvContract.utilized
    : 0;
  const remainingAfter = chosenInvContract ? availableInChosen - utilizeNum : 0;
  const sufficient = chosenInvContract ? utilizeNum > 0 && utilizeNum <= availableInChosen : false;

  // Investors sorted by total available financing (sum of remaining across
  // their active contracts) — recycled capital floats to the top naturally.
  const investors = useMemo(() => {
    const totals = new Map<string, number>();
    for (const ic of investmentContracts) {
      if (ic.status !== "active") continue;
      const available = ic.amount - ic.utilized;
      totals.set(ic.investorId, (totals.get(ic.investorId) ?? 0) + available);
    }
    return [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id, available]) => ({ id, available }));
  }, [investmentContracts]);

  // Active investment contracts for the selected investor, sorted by
  // available financing desc so the most useful capital appears first.
  const sortedInvestorContracts = useMemo(() => {
    return [...customerContractsByInvestor].sort(
      (a, b) => b.amount - b.utilized - (a.amount - a.utilized),
    );
  }, [customerContractsByInvestor]);

  const canNext = (() => {
    switch (step) {
      case 0:
        return Boolean(customerId);
      case 1:
        return (
          productType.trim().length > 0 &&
          cashPriceNum > 0 &&
          installmentPriceNum > 0 &&
          installmentsCountNum > 0 &&
          installmentPriceNum >= downPaymentNum
        );
      case 2:
        return sufficient;
      default:
        return true;
    }
  })();

  const steps = [
    { key: "customer", label: c.steps.customer },
    { key: "product", label: c.steps.product },
    { key: "funding", label: c.steps.funding },
    { key: "review", label: c.steps.review },
  ];

  const handleSave = () => {
    if (!customer || !chosenInvContract) return;
    setSaving(true);
    const stamp = Date.now().toString(36).toUpperCase().slice(-5);
    const id = `ins-user-${stamp}`;
    const number = `INS-${new Date().getFullYear()}-U${stamp.slice(-3)}`;
    const startDate = DEFAULT_START;
    const schedule = buildScheduleSimple(id, startDate, installmentsCountNum, monthlyInstallment);
    const contract: InstallmentContract = {
      id,
      number,
      customerId: customer.id,
      productType,
      cashPrice: cashPriceNum,
      installmentPrice: installmentPriceNum,
      downPayment: downPaymentNum,
      installmentsCount: installmentsCountNum,
      financingAmount,
      monthlyInstallment,
      profitMargin,
      profitMarginPct,
      remainingBalance: schedule.reduce((sum, s) => sum + (s.amount - s.paidAmount), 0),
      investmentContractId: chosenInvContract.id,
      capitalUtilized: utilizeNum,
      startDate,
      endDate,
      status: "active",
      // Sprint 11 — fresh contract starts with no recovery yet.
      officeRecoveredSoFar: 0,
      investorRecoveredSoFar: 0,
      schedule,
      timeline: [{ ts: startDate, text: `إنشاء عقد التقسيط ${number} — ${productType}` }],
    };
    addInstallmentContract(contract);
    setTimeout(() => router.push(`/contracts/${id}`), 200);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{c.pageTitle}</h1>
      </header>

      <Stepper steps={steps} current={step} />

      <Card>
        {/* Step 1: customer */}
        {step === 0 ? (
          <>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{c.step1.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="customer-select">{c.step1.selectCustomer}</Label>
                <select
                  id="customer-select"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">{c.step1.searchPlaceholder}</option>
                  {customers.map((cu) => (
                    <option key={cu.id} value={cu.id}>
                      {cu.name} — {cu.city}
                    </option>
                  ))}
                </select>
              </div>

              {customer ? (
                <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{customer.name}</p>
                    <IdentityBadge kind={customer.identity.kind} />
                    <RiskClassBadge risk={customer.riskClass} />
                  </div>
                  <div className="grid gap-2 text-xs sm:grid-cols-3">
                    <div>
                      <p className="text-muted-foreground">{dict.customers.profile.employer}</p>
                      <p className="font-medium">{customer.employer}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{dict.customers.profile.salary}</p>
                      <p className="num font-medium">
                        <Currency value={customer.monthlySalary} compact />
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{dict.customers.create.city}</p>
                      <p className="font-medium">{customer.city}</p>
                    </div>
                  </div>
                  {customer.riskClass === "high" ? (
                    <div className="rounded-lg border border-danger-soft bg-danger-soft/50 px-3 py-2 text-xs text-danger-foreground">
                      {c.step1.riskNote}
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{c.step1.noneSelected}</p>
              )}
            </CardContent>
          </>
        ) : null}

        {/* Step 2: product + pricing with smart calc */}
        {step === 1 ? (
          <>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{c.step2.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="product">{c.step2.productType}</Label>
                <Input
                  id="product"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="iPhone 15 Pro / مكيف سامسونج / ..."
                />
                <p className="text-xs text-muted-foreground">{c.step2.productTypeHint}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cash">{c.step2.cashPrice}</Label>
                <Input
                  id="cash"
                  value={cashPrice}
                  onChange={(e) => setCashPrice(e.target.value.replace(/[^\d,]/g, ""))}
                  inputMode="numeric"
                  className="num"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installment">{c.step2.installmentPrice}</Label>
                <Input
                  id="installment"
                  value={installmentPrice}
                  onChange={(e) => setInstallmentPrice(e.target.value.replace(/[^\d,]/g, ""))}
                  inputMode="numeric"
                  className="num"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="down">{c.step2.downPayment}</Label>
                <Input
                  id="down"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value.replace(/[^\d,]/g, ""))}
                  inputMode="numeric"
                  className="num"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="count">{c.step2.installmentsCount}</Label>
                <Input
                  id="count"
                  value={installmentsCount}
                  onChange={(e) => setInstallmentsCount(e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  className="num"
                />
              </div>

              <div className="space-y-3 rounded-xl border border-primary-soft bg-primary-soft/30 p-4 sm:col-span-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold">{c.step2.previewTitle}</p>
                  <p className="text-xs text-muted-foreground">{c.step2.previewHint}</p>
                </div>
                <DataRows>
                  <DataRow
                    label={dict.installmentContracts.details.financingAmount}
                    value={<Currency value={financingAmount} />}
                  />
                  <DataRow
                    label={dict.installmentContracts.details.monthlyInstallment}
                    value={<Currency value={monthlyInstallment} />}
                  />
                  <DataRow
                    label={dict.installmentContracts.details.profitMargin}
                    value={<Currency value={profitMargin} />}
                  />
                  <DataRow
                    label={dict.installmentContracts.details.profitMarginPct}
                    value={
                      <span className="num font-semibold text-primary">
                        {(profitMarginPct * 100).toFixed(1)}%
                      </span>
                    }
                  />
                  <DataRow
                    label={dict.installmentContracts.details.endDate}
                    value={endDate ? formatDate(endDate, locale) : "—"}
                  />
                </DataRows>
              </div>
            </CardContent>
          </>
        ) : null}

        {/* Step 3: funding link */}
        {step === 2 ? (
          <>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{c.step3.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="investor-select">{c.step3.selectInvestor}</Label>
                <select
                  id="investor-select"
                  value={investorIdSel}
                  onChange={(e) => {
                    setInvestorIdSel(e.target.value);
                    setInvContractId("");
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">—</option>
                  {investors.map(({ id, available }) => {
                    const inv = findInvestor(id);
                    const name = inv?.name ?? id;
                    const fmtAvailable = available.toLocaleString("ar-SA-u-nu-latn");
                    return (
                      <option key={id} value={id}>
                        {name} — {dict.recycling.investorPicker.availableLabel}: {fmtAvailable} ر.س
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-contract-select">{c.step3.selectContract}</Label>
                <select
                  id="inv-contract-select"
                  value={invContractId}
                  onChange={(e) => {
                    setInvContractId(e.target.value);
                    setAmountToUtilize(String(financingAmount));
                  }}
                  disabled={!investorIdSel}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
                >
                  <option value="">—</option>
                  {sortedInvestorContracts.map((ic) => {
                    const prefix = ic.sourceContractId ? "🔄 " : "";
                    return (
                      <option key={ic.id} value={ic.id}>
                        {prefix}
                        {ic.number} — {dict.recycling.investorPicker.availableLabel}: {(ic.amount - ic.utilized).toLocaleString("ar-SA-u-nu-latn")} ر.س
                      </option>
                    );
                  })}
                </select>
              </div>

              {chosenInvContract ? (
                <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4 sm:col-span-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{c.step3.chosenSummary}</p>
                    {chosenInvContract.sourceContractId ? <RecycledBadge /> : null}
                  </div>
                  <DataRows>
                    <DataRow
                      label={dict.investments.columns.amount}
                      value={<Currency value={chosenInvContract.amount} />}
                    />
                    <DataRow
                      label={dict.investments.columns.utilized}
                      value={<Currency value={chosenInvContract.utilized} />}
                    />
                    <DataRow
                      label={dict.investments.columns.remaining}
                      value={<Currency value={availableInChosen} />}
                    />
                    <DataRow
                      label={dict.investments.details.operationPct}
                      value={<span className="num">{chosenInvContract.operationPct}%</span>}
                    />
                  </DataRows>
                </div>
              ) : null}

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="utilize">{c.step3.amountToUtilize}</Label>
                <Input
                  id="utilize"
                  value={amountToUtilize}
                  onChange={(e) => setAmountToUtilize(e.target.value.replace(/[^\d.,]/g, ""))}
                  inputMode="numeric"
                  className="num"
                  disabled={!chosenInvContract}
                />
                {chosenInvContract ? (
                  <div className="space-y-1.5 pt-1 text-xs">
                    <p className="flex items-baseline justify-between gap-2">
                      <span className="text-muted-foreground">{c.step3.remainingAfter}</span>
                      <span className="num font-semibold">
                        <Currency value={Math.max(0, remainingAfter)} />
                      </span>
                    </p>
                    <p className={cn("font-medium", sufficient ? "text-success" : "text-danger")}>
                      {sufficient ? c.step3.sufficient : c.step3.notSufficient}
                    </p>
                  </div>
                ) : null}
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
              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                  {c.step4.customerBlock}
                </h3>
                {customer ? (
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3">
                    <p className="font-semibold">{customer.name}</p>
                    <IdentityBadge kind={customer.identity.kind} />
                    <RiskClassBadge risk={customer.riskClass} />
                  </div>
                ) : null}
              </section>

              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                  {c.step4.productBlock}
                </h3>
                <DataRows>
                  <DataRow label={c.step2.productType} value={productType || "—"} />
                  <DataRow label={c.step2.cashPrice} value={<Currency value={cashPriceNum} />} />
                  <DataRow
                    label={c.step2.installmentPrice}
                    value={<Currency value={installmentPriceNum} />}
                  />
                  <DataRow label={c.step2.downPayment} value={<Currency value={downPaymentNum} />} />
                  <DataRow
                    label={c.step2.installmentsCount}
                    value={
                      <span className="num">
                        {installmentsCountNum} {dict.installmentContracts.details.months}
                      </span>
                    }
                  />
                  <DataRow
                    label={dict.installmentContracts.details.monthlyInstallment}
                    value={<Currency value={monthlyInstallment} />}
                  />
                  <DataRow
                    label={dict.installmentContracts.details.profitMargin}
                    value={
                      <span>
                        <Currency value={profitMargin} />
                        <span className="text-muted-foreground">
                          {" "}
                          · {(profitMarginPct * 100).toFixed(1)}%
                        </span>
                      </span>
                    }
                  />
                </DataRows>
              </section>

              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                  {c.step4.fundingBlock}
                </h3>
                <DataRows>
                  <DataRow
                    label={dict.installmentContracts.details.fromInvestment}
                    value={chosenInvContract?.number ?? "—"}
                  />
                  <DataRow
                    label={dict.installmentContracts.details.capitalUtilized}
                    value={<Currency value={utilizeNum} />}
                  />
                  <DataRow
                    label={c.step3.remainingAfter}
                    value={<Currency value={Math.max(0, remainingAfter)} />}
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
            onClick={() => (step === 0 ? router.push("/contracts") : setStep(step - 1))}
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
            <Button type="button" disabled={saving} onClick={handleSave} className="gap-1.5">
              {saving ? dict.common.saving : dict.common.save}
              {!saving ? <Check className="size-4" /> : null}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
