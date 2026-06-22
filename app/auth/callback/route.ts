import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const homeUrl = new URL("/", request.url);
  const loginUrl = new URL("/login", request.url);

  if (error) {
    loginUrl.searchParams.set("error", errorDescription || error);

    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    loginUrl.searchParams.set("error", "Google did not return an auth code.");

    return NextResponse.redirect(loginUrl);
  }

  const cookieStore = await cookies();
  const response = NextResponse.redirect(homeUrl);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    loginUrl.searchParams.set("error", exchangeError.message);

    return NextResponse.redirect(loginUrl);
  }

  return response;
}
