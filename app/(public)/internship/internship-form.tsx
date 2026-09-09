"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { internshipApplicationSchema, type InternshipApplicationFormValues } from "@/lib/validations/misc";
import { Input, FieldError } from "@/components/ui/input";
import { CheckCircle2, Send, UploadCloud, X } from "lucide-react";

const MAX_FILES = 2;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function InternshipForm() {
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | undefined>();
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InternshipApplicationFormValues>({ resolver: zodResolver(internshipApplicationSchema) });

  const addFiles = (incoming: FileList | File[]) => {
    const incomingArr = Array.from(incoming);
    const accepted: File[] = [];

    for (const file of incomingArr) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setFileError("Please upload PDF or Word documents only.");
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError("Each file must be under 5MB.");
        continue;
      }
      accepted.push(file);
    }

    setFiles((prev) => {
      const merged = [...prev, ...accepted].slice(0, MAX_FILES);
      if (merged.length > 0) setFileError(undefined);
      return merged;
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: InternshipApplicationFormValues) => {
    if (files.length === 0) {
      setFileError("Please attach your CV and Cover Letter.");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/internships", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setSubmitted(true);
      reset();
      setFiles([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-12 text-center">
        <CheckCircle2 className="text-brass-deep" size={40} />
        <p className="font-display text-xl text-ink">Application received.</p>
        <p className="max-w-sm text-sm text-slate">
          Thank you for applying — our team will review your application and reach out if there's a fit.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-ink">Apply Now</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

        <div>
          <Input
            className="rounded-lg py-3.5"
            placeholder="First Name"
            aria-label="First Name"
            {...register("firstName")}
          />
          <FieldError message={errors.firstName?.message} />
        </div>

        <div>
          <Input
            className="rounded-lg py-3.5"
            placeholder="Last Name"
            aria-label="Last Name"
            {...register("lastName")}
          />
          <FieldError message={errors.lastName?.message} />
        </div>

        <div>
          <Input
            type="email"
            className="rounded-lg py-3.5"
            placeholder="Email"
            aria-label="Email"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Input
            type="tel"
            className="rounded-lg py-3.5"
            placeholder="Phone Number"
            aria-label="Phone Number"
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
            }}
            className={`rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors ${
              dragging ? "border-brass bg-brass/5" : "border-line"
            }`}
          >
            <UploadCloud className="mx-auto mb-3 text-slate" size={28} />
            <p className="font-display text-lg text-ink">Drag &amp; Drop Files Here</p>
            <p className="mt-2 text-sm text-slate">or</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-sm font-medium text-brass-deep hover:underline"
            >
              Browse Files
            </button>

            <div className="mt-4 flex items-center justify-between text-xs text-slate">
              <span>CV &amp; Cover Letter — PDF or Word, up to 5MB each</span>
              <span>{files.length} of {MAX_FILES}</span>
            </div>

            {files.length > 0 && (
              <ul className="mt-4 space-y-2 text-left">
                {files.map((file, i) => (
                  <li
                    key={`${file.name}-${i}`}
                    className="flex items-center justify-between rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="ml-2 text-slate hover:text-red-600"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <FieldError message={fileError} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brass px-6 py-4 text-base font-semibold text-ink transition-colors duration-150 hover:bg-brass-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : "Submit Application"} <Send size={18} />
        </button>
      </form>
    </div>
  );
}
