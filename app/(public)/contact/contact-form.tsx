"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/misc";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch("/api/contact", {
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
        <p className="font-display text-xl text-ink">Thank you for reaching out.</p>
        <p className="max-w-sm text-sm text-slate">
          We&apos;ve received your enquiry and a member of our team will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot — hidden from real users, catches basic bots */}
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
          <Label htmlFor="areaOfLaw">Area of Legal Assistance</Label>
          <Input id="areaOfLaw" {...register("areaOfLaw")} placeholder="e.g. Corporate Law" />
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" {...register("subject")} />
      </div>

      <div>
        <Label htmlFor="message" required>Message</Label>
        <Textarea id="message" rows={5} {...register("message")} />
        <FieldError message={errors.message?.message} />
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}
