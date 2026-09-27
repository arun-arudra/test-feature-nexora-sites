import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  businessType: z.string().trim().min(2, "Tell us your business type").max(80),
  city: z.string().trim().min(2, "Enter your city").max(80),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .max(15)
    .regex(/^[0-9+\-\s]+$/, "Enter a valid phone number"),
  /** Optional — when present, user gets a confirmation email; admin Reply-To uses it */
  email: z
    .string()
    .trim()
    .max(120)
    .optional()
    .refine(
      (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      "Enter a valid email",
    ),
  need: z.string().trim().min(2, "Tell us what you need").max(120),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  company: z.string().max(0).optional(), // honeypot
});

export type ContactInput = z.infer<typeof contactSchema>;
