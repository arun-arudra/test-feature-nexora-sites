import { NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/email/send-contact";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    if (parsed.data.company) {
      return NextResponse.json({ ok: true });
    }

    const data = parsed.data;

    console.info("[contact-enquiry]", {
      name: data.name,
      email: data.email || null,
      businessType: data.businessType,
      city: data.city,
      phone: data.phone,
      need: data.need,
      message: data.message,
      at: new Date().toISOString(),
    });

    const mail = await sendContactEmails(data);

    if (mail.error && !mail.adminSent && !mail.skipped) {
      return NextResponse.json(
        { error: "Unable to send enquiry email. Please WhatsApp us." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      email: {
        admin: mail.adminSent,
        user: mail.userSent,
        skipped: mail.skipped,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process enquiry" },
      { status: 500 },
    );
  }
}
