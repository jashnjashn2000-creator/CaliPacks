import { useId } from "react";
import { SITE_TAGLINE } from "@/lib/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

const sizes = {
  sm: { box: 48, text: "text-[1.4rem]", tagline: "text-[7px]", gap: "gap-2.5", orbit: "28px" },
  md: { box: 68, text: "text-[1.95rem]", tagline: "text-[9px]", gap: "gap-3", orbit: "40px" },
  lg: { box: 82, text: "text-[2.35rem]", tagline: "text-[11px]", gap: "gap-3.5", orbit: "48px" },
};

function LogoMark({ id, size }: { id: string; size: number }) {
  const rim = `sc-rim-${id}`;
  const smoke = `sc-smoke-${id}`;
  const glass = `sc-glass-${id}`;
  const shine = `sc-shine-${id}`;
  const glow = `sc-glow-${id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="logo-mark relative z-10"
      aria-hidden
    >
      <defs>
        <linearGradient id={rim} x1="8%" y1="0%" x2="92%" y2="100%">
          <stop offset="0%" stopColor="#daf1de" />
          <stop offset="38%" stopColor="#8eb69b" />
          <stop offset="72%" stopColor="#235347" />
          <stop offset="100%" stopColor="#0b2b26" />
        </linearGradient>
        <linearGradient id={smoke} x1="20%" y1="10%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#f3faf5" />
          <stop offset="28%" stopColor="#c5e2cd" />
          <stop offset="62%" stopColor="#8eb69b" />
          <stop offset="100%" stopColor="#235347" />
        </linearGradient>
        <radialGradient id={glass} cx="38%" cy="32%" r="62%">
          <stop offset="0%" stopColor="#163832" />
          <stop offset="55%" stopColor="#0b2b26" />
          <stop offset="100%" stopColor="#051f20" />
        </radialGradient>
        <radialGradient id={shine} cx="32%" cy="24%" r="42%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={glow} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <polygon
        className="logo-rim"
        points="50,6 88,28 88,72 50,94 12,72 12,28"
        fill={`url(#${glass})`}
        stroke={`url(#${rim})`}
        strokeWidth="4.2"
        strokeLinejoin="round"
      />
      <polygon
        points="50,14 80,32 80,68 50,86 20,68 20,32"
        fill="none"
        stroke="#c5e2cd"
        strokeWidth="1.15"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill={`url(#${shine})`} />

      <g filter={`url(#${glow})`}>
        <path
          className="logo-smoke-flow"
          d="M64 27c-8.5-8-24-9.5-30 1.5-5 9 6.5 13.5 16 16.5 11 3.5 18 10 14.5 19.5-4 10.5-20 13-28 4"
          fill="none"
          stroke={`url(#${smoke})`}
          strokeWidth="7.2"
          strokeLinecap="round"
          pathLength="1"
        />
        <path
          className="logo-smoke-flow logo-smoke-flow-delay"
          d="M69 36c5.5 8 4 24-10 31-12 6-24 1-26-9"
          fill="none"
          stroke={`url(#${smoke})`}
          strokeWidth="6.6"
          strokeLinecap="round"
          pathLength="1"
        />
      </g>
      <path
        className="logo-wisp"
        d="M66 24c6-6 5-13-2-12"
        fill="none"
        stroke="#daf1de"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        className="logo-wisp logo-wisp-delay"
        d="M30 72c-5-3-9 2-5 6"
        fill="none"
        stroke="#8eb69b"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  variant = "default",
  size = "md",
  showTagline = true,
  className,
}: LogoProps) {
  const s = sizes[size];
  const isLight = variant === "light";
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className={cn("logo-lockup flex items-center", s.gap, className)}
      style={{ ["--logo-orbit" as string]: s.orbit }}
    >
      <div className="logo-mark-wrap relative flex-shrink-0">
        <LogoMark id={uid} size={s.box} />
        <span className="logo-sheen" aria-hidden />
      </div>

      <div className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "font-logo font-black tracking-[-0.045em]",
            s.text,
            isLight ? "text-white" : "text-ink"
          )}
        >
          Smoke
          <span className="logo-word-cali bg-gradient-to-r from-[#daf1de] via-gold to-[#8eb69b] bg-clip-text text-transparent">
            Cali
          </span>
        </span>
        {showTagline && (
          <span
            className={cn(
              "logo-tagline mt-1.5 font-semibold uppercase tracking-[0.28em]",
              s.tagline,
              isLight ? "text-white/55" : "text-graphite/60"
            )}
          >
            {SITE_TAGLINE}
          </span>
        )}
      </div>
    </div>
  );
}
