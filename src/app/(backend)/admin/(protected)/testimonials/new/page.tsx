import Link from "next/link";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { cmsPath } from "@/lib/cms/admin-path";

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href={cmsPath("testimonials")} className="text-sm text-muted hover:text-primary">
          ← Back to testimonials
        </Link>
        <h2 className="mt-2 font-heading text-2xl font-bold">Add testimonial</h2>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <TestimonialForm />
      </div>
    </div>
  );
}
