"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { contactSchema } from "@/lib/validations";
import { siteConfig } from "@/config/site";

const NEED_OPTIONS = [
  "New Website Development",
  "Website Revamp",
  "E-commerce Development",
  "Website Maintenance",
];

const fieldClass =
  "mt-1.5 min-h-11 w-full rounded-xl border border-border bg-surface px-3 py-3 text-base outline-none transition hover:border-primary/30 focus:border-transparent focus:ring-2 focus:ring-accent sm:text-sm";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = new FormData(e.currentTarget);
    const raw = {
      name: String(form.get("name") ?? ""),
      businessType: String(form.get("businessType") ?? "Business"),
      city: String(form.get("city") ?? "Bangalore"),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      need: String(form.get("need") ?? ""),
      message: String(form.get("message") ?? ""),
      company: String(form.get("company") ?? ""),
    };

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      setStatus("error");
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong. Please WhatsApp us instead.");
    }
  }

  if (compact) {
    return (
      <form onSubmit={onSubmit} className="space-y-3">
        <Field label="Your name" name="name" required />
        <Field label="Phone / WhatsApp" name="phone" required />
        <Field
          label="Email (optional)"
          name="email"
          type="email"
          placeholder="you@business.com"
        />
        <label className="block text-sm font-medium text-text">
          What do you need?
          <select
            name="need"
            required
            defaultValue=""
            className={fieldClass}
          >
            <option value="" disabled>
              Select a service
            </option>
            {NEED_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
        <input type="hidden" name="businessType" value="Business" />
        <input type="hidden" name="city" value="Bangalore" />
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <Button type="submit" disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Sending..." : "Book my free call"}
        </Button>
        {status === "success" ? (
          <p className="text-sm font-medium text-primary">
            Thanks — we&apos;ll call you soon.
          </p>
        ) : null}
        {error ? <p className="text-sm font-medium text-coral">{error}</p> : null}
        <p className="text-xs text-muted">
          No spam. Your details are safe. Call {siteConfig.phone}
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" required />
        <Field
          label="Business type"
          name="businessType"
          placeholder="Restaurant, hotel, clinic..."
          required
        />
        <Field label="City" name="city" required />
        <Field label="Phone / WhatsApp" name="phone" required />
        <Field
          label="Email (optional)"
          name="email"
          type="email"
          placeholder="you@business.com"
        />
      </div>
      <label className="block text-sm font-medium text-text">
        What do you need?
        <select
          name="need"
          required
          defaultValue=""
          className={fieldClass}
        >
          <option value="" disabled>
            Select a service
          </option>
          {NEED_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-text">
        Message
        <textarea
          name="message"
          rows={4}
          className={fieldClass}
        />
      </label>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Sending..." : "Book my free call"}
      </Button>
      {status === "success" ? (
        <p className="text-sm font-medium text-primary">
          Thanks — we received your enquiry and will reply soon.
        </p>
      ) : null}
      {error ? <p className="text-sm font-medium text-coral">{error}</p> : null}
    </form>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium text-text">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={fieldClass}
      />
    </label>
  );
}
