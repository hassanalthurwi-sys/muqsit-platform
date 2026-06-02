"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import type {
  Customer,
  CustomerIdentity,
  CustomerIdentityKind,
  CustomerRiskClass,
} from "@/lib/mock/types";

const KINDS: CustomerIdentityKind[] = ["saudiIndividual", "gccIndividual", "foreignIndividual"];
const RISKS: CustomerRiskClass[] = ["low", "medium", "high"];

export default function NewCustomerPage() {
  const router = useRouter();
  const { dict } = useI18n();
  const { addCustomer } = useStore();
  const c = dict.customers.create;

  const [kind, setKind] = useState<CustomerIdentityKind>("saudiIndividual");
  const [idNumber, setIdNumber] = useState("");
  const [country, setCountry] = useState("");
  const [nationality, setNationality] = useState("السعودية");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [employer, setEmployer] = useState("");
  const [salary, setSalary] = useState("");
  const [obligations, setObligations] = useState("");
  const [risk, setRisk] = useState<CustomerRiskClass>("low");
  const [notes, setNotes] = useState("");

  const canSubmit =
    name && idNumber && mobile && city && address && employer && salary && dob;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const identity: CustomerIdentity =
      kind === "saudiIndividual"
        ? { kind, nationalId: idNumber }
        : kind === "gccIndividual"
          ? { kind, gccId: idNumber, country }
          : { kind, passport: idNumber, nationality };

    const today = new Date().toISOString().slice(0, 10);
    const customer: Customer = {
      id: `cus-user-${Date.now().toString(36)}`,
      name,
      identity,
      mobile,
      nationality,
      dateOfBirth: dob,
      employer,
      monthlySalary: Number(salary.replace(/[^\d]/g, "") || 0),
      obligations: obligations ? Number(obligations.replace(/[^\d]/g, "")) : undefined,
      city,
      address,
      riskClass: risk,
      notes,
      createdAt: today,
    };
    addCustomer(customer);
    setTimeout(() => router.push(`/customers/${customer.id}`), 200);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{c.pageTitle}</h1>
      </header>

      {/* Identity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{c.identitySection}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">{c.fullName}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kind">{c.identityKindLabel}</Label>
            <select
              id="kind"
              value={kind}
              onChange={(e) => setKind(e.target.value as CustomerIdentityKind)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {dict.identityKind[k]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="idnum">{c.identityNumber}</Label>
            <Input id="idnum" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="num" required />
          </div>
          {kind === "gccIndividual" ? (
            <div className="space-y-2">
              <Label htmlFor="country">{dict.identityFieldLabel.country}</Label>
              <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="nationality">{c.nationality}</Label>
            <Input id="nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">{c.dob}</Label>
            <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="num" required />
          </div>
        </CardContent>
      </Card>

      {/* Contact + address */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{c.contactSection}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mobile">{c.mobile}</Label>
            <Input
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+966 5x xxx xxxx"
              dir="ltr"
              className="num"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">{c.city}</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">{c.address}</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Employment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{c.employmentSection}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="employer">{c.employer}</Label>
            <Input id="employer" value={employer} onChange={(e) => setEmployer(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">{c.salary}</Label>
            <Input
              id="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value.replace(/[^\d,]/g, ""))}
              inputMode="numeric"
              className="num"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="obligations">
              {c.obligations}{" "}
              <span className="text-xs text-muted-foreground">({dict.common.optional})</span>
            </Label>
            <Input
              id="obligations"
              value={obligations}
              onChange={(e) => setObligations(e.target.value.replace(/[^\d,]/g, ""))}
              inputMode="numeric"
              className="num"
            />
          </div>
        </CardContent>
      </Card>

      {/* Classification + notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{c.classificationSection}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="risk">{c.risk}</Label>
            <select
              id="risk"
              value={risk}
              onChange={(e) => setRisk(e.target.value as CustomerRiskClass)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {RISKS.map((r) => (
                <option key={r} value={r}>
                  {dict.riskClass[r]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">{c.notes}</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={() => router.push("/customers")}>
          {dict.common.cancel}
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          {dict.common.save}
        </Button>
      </div>
    </form>
  );
}
