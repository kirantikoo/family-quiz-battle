"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authError, setAuthError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const error =
      params.get("error_description") ||
      params.get("error") ||
      "";

    if (error) {
      setAuthError(decodeURIComponent(error.replace(/\+/g, " ")));
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  async function signInWithGoogle() {
    setAuthError("");
    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      setGoogleLoading(false);
    }
  }

  async function signUp() {
    setAuthError("");

    if (!email || !password) {
      setAuthError("Please enter email and password.");
      return;
    }

    setEmailLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setEmailLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    setAuthError("Account created. Please check your email, then login.");
  }

  async function login() {
    setAuthError("");

    if (!email || !password) {
      setAuthError("Please enter email and password.");
      return;
    }

    setEmailLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setEmailLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-svh overflow-hidden bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] px-4 py-6 text-white sm:px-5 sm:py-8">
      <section className="mx-auto flex min-h-[calc(100svh-3rem)] max-w-md flex-col justify-center">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Family Quiz Battle"
            width={140}
            height={140}
            priority
            className="mx-auto h-24 w-24 drop-shadow-2xl sm:h-[140px] sm:w-[140px]"
          />

          <h1 className="mt-5 text-3xl font-black leading-tight sm:mt-6 sm:text-4xl">
            Family Quiz Battle
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
            Login to save your progress online.
          </p>
        </div>

        <div className="mt-7 rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:mt-10 sm:rounded-[32px] sm:p-6">
          {authError && (
            <div className="mb-4 rounded-2xl border border-red-300/30 bg-red-500/20 px-4 py-3 text-sm font-bold text-red-100">
              {authError}
            </div>
          )}

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={googleLoading || emailLoading}
            className="min-h-14 w-full rounded-2xl bg-white px-5 py-4 font-black text-[#070A22] shadow-xl transition hover:bg-cyan-50 disabled:cursor-wait disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            {googleLoading ? "Opening Google..." : "Continue with Google"}
          </button>

          <div className="my-5 text-center text-sm text-white/50">or</div>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            autoComplete="email"
            className="min-h-14 w-full rounded-2xl bg-white/10 px-5 py-4 font-bold text-white outline-none placeholder:text-white/50 focus:ring-2 focus:ring-cyan-300"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            className="mt-4 min-h-14 w-full rounded-2xl bg-white/10 px-5 py-4 font-bold text-white outline-none placeholder:text-white/50 focus:ring-2 focus:ring-cyan-300"
          />

          <button
            type="button"
            onClick={login}
            disabled={emailLoading || googleLoading}
            className="mt-5 min-h-14 w-full rounded-2xl bg-purple-600 px-5 py-4 font-black shadow-xl transition hover:bg-purple-500 disabled:cursor-wait disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            {emailLoading ? "Please wait..." : "Login"}
          </button>

          <button
            type="button"
            onClick={signUp}
            disabled={emailLoading || googleLoading}
            className="mt-3 min-h-14 w-full rounded-2xl bg-white/10 px-5 py-4 font-black transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            Create Account
          </button>

          <Link
            href="/"
            className="mt-4 block rounded-2xl py-3 text-center font-bold text-white/70 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            Play as Guest
          </Link>
        </div>
      </section>
    </main>
  );
}