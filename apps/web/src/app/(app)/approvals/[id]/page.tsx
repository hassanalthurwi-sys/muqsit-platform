"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, FileQuestion, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Currency } from "@/components/ui/currency";
import {
  ApprovalPriorityPill,
  ApprovalStatusPill,
} from "@/components/ui/priority-pill";
import { DataRow, DataRows } from "@/components/ui/data-row";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import type { ApprovalStatus } from "@/lib/mock/types";

export default function ApprovalReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict } = useI18n();
  const { approvals, employees, decideApproval } = useStore();
  const r = dict.approvals.review;
  const approval = useMemo(() => approvals.find((a) => a.id === id), [approvals, id]);
  const [note, setNote] = useState("");

  if (!approval) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        طلب الموافقة غير موجود.
      </div>
    );
  }

  const requester = employees.find((e) => e.id === approval.requestedById);
  const decider = approval.decidedById
    ? employees.find((e) => e.id === approval.decidedById)
    : null;

  const decide = (status: ApprovalStatus) => {
    decideApproval(approval.id, {
      status,
      decidedById: "emp-manager-1",
      decidedAt: new Date().toISOString(),
      decisionNote: note || undefined,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Link href="/approvals" className="text-xs text-muted-foreground hover:text-foreground">
            {r.back}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {dict.permissionAction[approval.type]}
            </h1>
            <ApprovalPriorityPill priority={approval.priority} />
            <ApprovalStatusPill status={approval.status} />
          </div>
          <p className="text-sm text-muted-foreground">{approval.relatedEntity.label}</p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{r.requestedBy}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">{requester?.name ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{requester?.roleName ?? "—"}</p>
            <p className="num text-xs text-muted-foreground">
              {r.requestedAt}: {approval.requestedAt.slice(0, 10)}
            </p>
            {approval.remindersSent > 0 ? (
              <p className="text-xs font-medium text-warning-foreground">
                {r.reminderBadge} × {approval.remindersSent}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{r.actionDetails}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow label={dict.approvals.columns.type} value={dict.permissionAction[approval.type]} />
              <DataRow label={dict.approvals.columns.entity} value={approval.relatedEntity.label} />
              {approval.amount ? (
                <DataRow
                  label={dict.investments.columns.amount}
                  value={<Currency value={approval.amount} />}
                />
              ) : null}
              <DataRow
                label={dict.approvals.columns.priority}
                value={<ApprovalPriorityPill priority={approval.priority} />}
              />
            </DataRows>
          </CardContent>
        </Card>
      </div>

      {approval.flags.length > 0 ? (
        <Card className="border-danger-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-danger-foreground">
              <AlertTriangle className="size-4" />
              {r.flags}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {approval.flags.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-danger" aria-hidden />
                  <span>
                    {f === "duplicateReference"
                      ? "رقم تحويل مكرر — استُخدم سابقاً"
                      : f === "highRiskCustomer"
                        ? "العميل ضمن فئة المخاطر العالية"
                        : f === "amountAboveThreshold"
                          ? "المبلغ أعلى من حد التنبيه"
                          : f}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {approval.reason ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{r.reason}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7">«{approval.reason}»</p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{r.decision}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {approval.status !== "pending" && decider ? (
            <div className="rounded-lg border border-primary-soft bg-primary-soft/40 px-3 py-2 text-xs">
              <p className="font-semibold">{decider.name}</p>
              {approval.decidedAt ? (
                <p className="num text-muted-foreground">{approval.decidedAt.slice(0, 10)}</p>
              ) : null}
              {approval.decisionNote ? (
                <p className="mt-1">«{approval.decisionNote}»</p>
              ) : null}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{r.decisionNote}</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={r.decisionNotePlaceholder}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => decide("approved")} className="gap-1.5">
                  <CheckCircle2 className="size-4" />
                  {r.approve}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => decide("rejected")}
                  className="gap-1.5"
                >
                  <XCircle className="size-4" />
                  {r.reject}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => decide("needsClarification")}
                  className="gap-1.5"
                >
                  <FileQuestion className="size-4" />
                  {r.requestClarification}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
