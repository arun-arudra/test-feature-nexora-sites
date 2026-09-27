import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import {
  getCmsAdminBase,
  isCmsAdminPath,
  isCmsLoginPath,
} from "@/lib/cms/admin-path";

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", path);

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const { url, anonKey, isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({
          request: { headers: requestHeaders },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminArea = isCmsAdminPath(path);
  const isLogin = isCmsLoginPath(path);

  if (isAdminArea && !isLogin && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `${getCmsAdminBase()}/login`;
    redirectUrl.searchParams.set("next", path);
    const redirect = NextResponse.redirect(redirectUrl);
    redirect.headers.set("x-pathname", path);
    return redirect;
  }

  if (isLogin && user) {
    const { data: aal } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel === "aal2" || aal?.nextLevel !== "aal2") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = getCmsAdminBase();
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
