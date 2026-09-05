"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { consultationFormSchema, type ConsultationFormValues } from "@/lib/validations/misc";
import { Input, Textarea, Label, FieldError, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationFormValues>({ resolver: zodResolver(consultationFormSchema) });

  const onSubmit = async (values: ConsultationFormValues) => {
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setSubmitted(true);
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 border border-line bg-surface p-12 text-center">
        <CheckCircle2 className="text-brass" size={40} />
        <p className="font-display text-xl text-ink">Request received.</p>
        <p className="max-w-sm text-sm text-slate">
          Thank you — a member of our team will reach out shortly to schedule your consultation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="fullName" required>Full Name</Label>
          <Input id="fullName" {...register("fullName")} />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input id="email" type="email" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <div>
          <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
          <Select id="preferredContactMethod" {...register("preferredContactMethod")}>
            <option value="">Select…</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="WhatsApp">WhatsApp</option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="areaOfLaw">Area of Law</Label>
        <Input id="areaOfLaw" {...register("areaOfLaw")} placeholder="e.g. Real Estate Law" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="preferredDate">Preferred Date</Label>
          <Input id="preferredDate" type="date" {...register("preferredDate")} />
        </div>
        <div>
          <Label htmlFor="preferredTime">Preferred Time</Label>
          <Input id="preferredTime" {...register("preferredTime")} placeholder="e.g. Afternoon" />
        </div>
      </div>

      <div>
        <Label htmlFor="message" required>Message</Label>
        <Textarea id="message" rows={5} {...register("message")} placeholder="Briefly describe your legal matter." />
        <FieldError message={errors.message?.message} />
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
        {isSubmitting ? "Submitting…" : "Request Consultation"}
      </Button>
    </form>
  );
}
