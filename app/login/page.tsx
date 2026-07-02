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

    let errorTimer: number | undefined;

    if (error) {
      errorTimer = window.setTimeout(() => {
        setAuthError(decodeURIComponent(error.replace(/\+/g, " ")));
      }, 0);
      window.history.replaceState({}, "", "/login");
    }

    return () => {
      if (errorTimer) {
        window.clearTimeout(errorTimer);
      }
    };
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
    <main className="min-h-svh overflow-hidden bg-[radial-gradient(circle_at_top,#F5F3FF_0%,#EEF2FF_40%,#F8FAFC_100%)] px-4 py-6 text-slate-900 transition dark:bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] dark:text-white sm:px-5 sm:py-8">
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

          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-white/70 sm:text-base">
            Login to save your progress online.
          </p>
        </div>

        <div className="mt-7 rounded-[30px] border border-slate-200/70 bg-white/85 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20 sm:mt-10 sm:rounded-[32px] sm:p-6">
          {authError && (
            <div className="mb-4 rounded-2xl border border-red-300/50 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-300/30 dark:bg-red-500/20 dark:text-red-100">
              {authError}
            </div>
          )}

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={googleLoading || emailLoading}
            className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-black text-slate-900 shadow-xl shadow-slate-900/10 transition hover:bg-cyan-50 disabled:cursor-wait disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:bg-white dark:text-slate-950"
          >
            {googleLoading ? "Opening Google..." : "Continue with Google"}
          </button>

          <div className="my-5 text-center text-sm font-bold text-slate-500 dark:text-white/50">or</div>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            autoComplete="email"
            className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            className="mt-4 min-h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40"
          />

          <button
            type="button"
            onClick={login}
            disabled={emailLoading || googleLoading}
            className="mt-5 min-h-14 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-4 font-black text-white shadow-xl transition hover:from-violet-500 hover:to-fuchsia-500 disabled:cursor-wait disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            {emailLoading ? "Please wait..." : "Login"}
          </button>

          <button
            type="button"
            onClick={signUp}
            disabled={emailLoading || googleLoading}
            className="mt-3 min-h-14 w-full rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 font-black text-slate-800 transition hover:bg-white disabled:cursor-wait disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            Create Account
          </button>

          <Link
            href="/"
            className="mt-4 block rounded-2xl py-3 text-center font-bold text-violet-700 transition hover:text-violet-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:text-violet-200 dark:hover:text-white"
          >
            Play as Guest
          </Link>
        </div>
      </section>
    </main>
  );
}
