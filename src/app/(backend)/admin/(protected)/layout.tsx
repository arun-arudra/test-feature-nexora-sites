import { AdminShell } from "@/components/admin/AdminShell";
import { cmsPath } from "@/lib/cms/admin-path";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** Auth gate + shared admin chrome for all /admin protected routes. */
export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConfigured } = getSupabaseEnv();
  let email: string | null = null;

  if (isConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) redirect(cmsPath("login"));

      const { data: aal } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
        redirect(`${cmsPath("login")}?next=${encodeURIComponent(cmsPath())}`);
      }
      email = user.email ?? null;
    } catch {
      redirect(cmsPath("login"));
    }
  }

  return <AdminShell email={email}>{children}</AdminShell>;
}
