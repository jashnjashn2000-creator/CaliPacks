"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { SITE_NAME } from "@/lib/site";

const STORAGE_KEY = "smokecali-age-verified";

type GateState = "loading" | "open" | "blocked" | "passed";

function isSearchBot() {
  if (typeof navigator === "undefined") return false;
  return /Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|facebookexternalhit|Twitterbot|LinkedInBot|Applebot|GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|PerplexityBot|Google-InspectionTool|AdsBot-Google|bingpreview|WhatsApp|Pinterestbot/i.test(
    navigator.userAgent
  );
}

export function AgeGate() {
  const [state, setState] = useState<GateState>("loading");

  useEffect(() => {
    // Let search engines index page content without the overlay.
    if (isSearchBot()) {
      setState("passed");
      return;
    }
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") {
        setState("passed");
        return;
      }
    } catch {
      // private mode / blocked storage — still show the gate
    }
    setState("open");
  }, []);

  useEffect(() => {
    if (state === "open" || state === "blocked") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [state]);

  function confirmAdult() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // allow browse for this session even if storage fails
    }
    setState("passed");
  }

  if (state === "loading" || state === "passed") {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-graphite px-6 py-8 text-center shadow-[0_30px_80px_rgba(5,31,32,0.55)] sm:px-8 sm:py-10">
        <div className="mb-6 flex justify-center">
          <Logo size="sm" variant="light" showTagline={false} />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
          Age verification
        </p>
        <h2
          id="age-gate-title"
          className="mt-3 font-serif text-3xl font-normal tracking-tight text-white sm:text-[2.1rem]"
        >
          Confirm you are 18+
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/65">
          You must be at least 18 years old to enter {SITE_NAME}. Please confirm
          that you meet the legal age requirement applicable in your location.
        </p>

        {state === "blocked" ? (
          <div className="mt-8 space-y-4">
            <p className="rounded-xl border border-white/10 bg-ink/50 px-4 py-3 text-sm font-semibold text-cream">
              Sorry — you must be 18 or over to browse this website.
            </p>
            <button
              type="button"
              onClick={() => setState("open")}
              className="text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              Go back
            </button>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={confirmAdult}
              className="w-full rounded-xl bg-gold px-5 py-3.5 text-sm font-bold text-ink transition hover:bg-brand-400"
            >
              I am 18 or older
            </button>
            <button
              type="button"
              onClick={() => setState("blocked")}
              className="w-full rounded-xl border border-white/35 bg-transparent px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              I am under 18
            </button>
          </div>
        )}

        <p className="mt-7 text-xs leading-relaxed text-white/45">
          By entering you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-gold">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-gold">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
