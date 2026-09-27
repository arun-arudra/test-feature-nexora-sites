import { Resend } from "resend";
import { getContactEmailEnv } from "@/lib/email/env";
import {
  buildAdminEnquiryEmail,
  buildUserConfirmationEmail,
} from "@/lib/email/templates/contact";
import type { ContactInput } from "@/lib/validations";

export type ContactMailResult = {
  adminSent: boolean;
  userSent: boolean;
  skipped: boolean;
  error?: string;
};

export async function sendContactEmails(
  data: ContactInput,
): Promise<ContactMailResult> {
  const env = getContactEmailEnv();

  if (!env.isConfigured) {
    console.warn(
      "[contact-email] RESEND_API_KEY or CONTACT_TO_EMAIL missing — logged only",
    );
    return { adminSent: false, userSent: false, skipped: true };
  }

  const resend = new Resend(env.apiKey);
  const admin = buildAdminEnquiryEmail(data);

  try {
    const adminRes = await resend.emails.send({
      from: env.from,
      to: [env.to],
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
      ...(data.email
        ? {
            replyTo: data.email,
          }
        : {}),
    });

    if (adminRes.error) {
      console.error("[contact-email] admin send failed", adminRes.error);
      return {
        adminSent: false,
        userSent: false,
        skipped: false,
        error: adminRes.error.message,
      };
    }

    let userSent = false;
    if (data.email) {
      const user = buildUserConfirmationEmail(data);
      const userRes = await resend.emails.send({
        from: env.from,
        to: [data.email],
        subject: user.subject,
        html: user.html,
        text: user.text,
        replyTo: env.to,
      });
      if (userRes.error) {
        console.error("[contact-email] user send failed", userRes.error);
      } else {
        userSent = true;
      }
    }

    return { adminSent: true, userSent, skipped: false };
  } catch (err) {
    console.error("[contact-email] unexpected", err);
    return {
      adminSent: false,
      userSent: false,
      skipped: false,
      error: err instanceof Error ? err.message : "send failed",
    };
  }
}
