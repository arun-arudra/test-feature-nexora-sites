import {
  escapeHtml,
  renderEmailLogoHtml,
  toTelHref,
} from "@/lib/email/logo";
import { siteConfig } from "@/config/site";
import type { ContactInput } from "@/lib/validations";

const phoneIcon = `<span style="display:inline-block;vertical-align:middle;margin-right:6px;line-height:0;" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4600bb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z"/></svg></span>`;

function shell(opts: {
  preheader: string;
  title: string;
  bodyHtml: string;
}): string {
  const logo = renderEmailLogoHtml();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#171717;border:1px solid #3e3e3e;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:22px 24px;background:linear-gradient(180deg,#1a1028 0%,#171717 100%);border-bottom:1px solid #3e3e3e;">
              ${logo}
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px 8px;">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#6b33c9;">${escapeHtml(siteConfig.brandName)}</p>
              <h1 style="margin:0;font-size:22px;line-height:1.3;font-weight:700;color:#ffffff;">${escapeHtml(opts.title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 24px 28px;">
              ${opts.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 22px;border-top:1px solid #3e3e3e;background:#111111;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#949494;">
                ${escapeHtml(siteConfig.brandName)} · ${escapeHtml(siteConfig.location)}<br/>
                <a href="${escapeHtml(siteConfig.phoneHref)}" style="color:#6b33c9;text-decoration:none;">${escapeHtml(siteConfig.phone)}</a>
                &nbsp;·&nbsp;
                <a href="mailto:${escapeHtml(siteConfig.email)}" style="color:#6b33c9;text-decoration:none;">${escapeHtml(siteConfig.email)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function detailRow(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;width:34%;vertical-align:top;font-size:12px;color:#949494;text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;vertical-align:top;font-size:15px;color:#ffffff;">${valueHtml}</td>
  </tr>`;
}

/** Admin inbox — enquiry details + click-to-call phone */
export function buildAdminEnquiryEmail(data: ContactInput): {
  subject: string;
  html: string;
  text: string;
} {
  const tel = toTelHref(data.phone);
  const phoneHtml = `<a href="${escapeHtml(tel)}" style="color:#ffffff;text-decoration:none;font-weight:600;">${phoneIcon}${escapeHtml(data.phone)}</a>
    <div style="margin-top:6px;"><a href="${escapeHtml(tel)}" style="display:inline-block;padding:8px 12px;border-radius:8px;background:#4600bb;color:#ffffff;font-size:12px;text-decoration:none;">Call now</a></div>`;

  const emailHtml = data.email
    ? `<a href="mailto:${escapeHtml(data.email)}" style="color:#6b33c9;text-decoration:none;">${escapeHtml(data.email)}</a>`
    : `<span style="color:#949494;">Not provided</span>`;

  const body = `
    <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#cfcfcf;">
      New website enquiry from the site form. Reply to this email to respond directly to the customer${data.email ? "" : " (no customer email on this lead)"}.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${[
      detailRow("Name", escapeHtml(data.name)),
      detailRow("Phone", phoneHtml),
      detailRow("Email", emailHtml),
      detailRow("Business", escapeHtml(data.businessType)),
      detailRow("City", escapeHtml(data.city)),
      detailRow("Need", escapeHtml(data.need)),
      detailRow(
        "Message",
        escapeHtml(data.message?.trim() || "—"),
      ),
    ].join("")}</table>
  `;

  const text = [
    `New enquiry — ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email || "—"}`,
    `Business: ${data.businessType}`,
    `City: ${data.city}`,
    `Need: ${data.need}`,
    `Message: ${data.message?.trim() || "—"}`,
  ].join("\n");

  return {
    subject: `New enquiry: ${data.name} · ${data.need}`,
    html: shell({
      preheader: `${data.name} · ${data.phone} · ${data.need}`,
      title: "New contact enquiry",
      bodyHtml: body,
    }),
    text,
  };
}

/** Customer confirmation — only sent when email is provided */
export function buildUserConfirmationEmail(data: ContactInput): {
  subject: string;
  html: string;
  text: string;
} {
  const body = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#cfcfcf;">
      Hi ${escapeHtml(data.name)},
    </p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#cfcfcf;">
      Thanks for contacting ${escapeHtml(siteConfig.brandName)}. We received your enquiry and will get back to you shortly — usually within a few hours on business days.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#0f0f0f;border:1px solid #3e3e3e;border-radius:10px;">
      <tr><td style="padding:16px 18px;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b33c9;">Your details</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#ffffff;">
          <strong>Need:</strong> ${escapeHtml(data.need)}<br/>
          <strong>Phone:</strong> ${escapeHtml(data.phone)}<br/>
          <strong>City:</strong> ${escapeHtml(data.city)}
        </p>
      </td></tr>
    </table>
    <p style="margin:0;font-size:14px;line-height:1.55;color:#949494;">
      Prefer WhatsApp? Message us at
      <a href="${escapeHtml(siteConfig.phoneHref)}" style="color:#6b33c9;text-decoration:none;">${escapeHtml(siteConfig.phone)}</a>.
    </p>
  `;

  const text = [
    `Hi ${data.name},`,
    ``,
    `Thanks for contacting ${siteConfig.brandName}. We received your enquiry and will reply soon.`,
    `Need: ${data.need}`,
    `Phone: ${data.phone}`,
    `City: ${data.city}`,
  ].join("\n");

  return {
    subject: `We received your enquiry — ${siteConfig.brandName}`,
    html: shell({
      preheader: "Thanks — we got your enquiry and will reply soon.",
      title: "We’ve got your enquiry",
      bodyHtml: body,
    }),
    text,
  };
}
