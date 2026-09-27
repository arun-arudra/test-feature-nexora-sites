/**
 * Decorative FAQ illustration — speech bubbles + help cue.
 * Uses current CSS tokens so it works on V1 soft-dark and V2 violet themes.
 */
export function FaqIllustration({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg
        viewBox="0 0 360 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full max-w-[360px]"
      >
        <defs>
          <linearGradient id="faq-glow" x1="40" y1="20" x2="320" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="faq-bubble" x1="60" y1="40" x2="240" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-primary-mid, var(--color-primary))" />
            <stop offset="1" stopColor="var(--color-primary)" />
          </linearGradient>
          <linearGradient id="faq-answer" x1="140" y1="140" x2="320" y2="280" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2a2a2a" />
            <stop offset="1" stopColor="#171717" />
          </linearGradient>
        </defs>

        {/* Soft backdrop orb */}
        <circle
          cx="180"
          cy="160"
          r="128"
          fill="url(#faq-glow)"
          className="motion-safe:animate-[soft-float_10s_ease-in-out_infinite]"
        />
        <circle
          cx="180"
          cy="160"
          r="98"
          stroke="var(--color-border)"
          strokeOpacity="0.55"
          strokeDasharray="4 10"
          className="origin-center motion-safe:animate-[spin_48s_linear_infinite]"
          style={{ transformOrigin: "180px 160px" }}
        />

        {/* Question bubble */}
        <g className="motion-safe:animate-[soft-float_7s_ease-in-out_infinite]">
          <path
            d="M58 52c0-14.36 11.64-26 26-26h128c14.36 0 26 11.64 26 26v72c0 14.36-11.64 26-26 26H118l-28 28v-28H84c-14.36 0-26-11.64-26-26V52Z"
            fill="url(#faq-bubble)"
          />
          <circle cx="120" cy="88" r="6" fill="white" fillOpacity="0.95" />
          <circle cx="148" cy="88" r="6" fill="white" fillOpacity="0.95" />
          <circle cx="176" cy="88" r="6" fill="white" fillOpacity="0.95" />
          <text
            x="248"
            y="78"
            fill="white"
            fontSize="42"
            fontFamily="var(--font-outfit), system-ui, sans-serif"
            fontWeight="500"
            textAnchor="middle"
          >
            ?
          </text>
        </g>

        {/* Answer bubble */}
        <g
          className="motion-safe:animate-[soft-float_9s_ease-in-out_infinite]"
          style={{ animationDelay: "-2.5s" }}
        >
          <path
            d="M122 148c0-12.15 9.85-22 22-22h136c12.15 0 22 9.85 22 22v68c0 12.15-9.85 22-22 22h-78l-24 24v-24h-34c-12.15 0-22-9.85-22-22v-68Z"
            fill="url(#faq-answer)"
            stroke="var(--color-border)"
          />
          <rect x="156" y="168" width="108" height="8" rx="4" fill="var(--color-accent)" fillOpacity="0.85" />
          <rect x="156" y="186" width="88" height="8" rx="4" fill="white" fillOpacity="0.22" />
          <rect x="156" y="204" width="64" height="8" rx="4" fill="white" fillOpacity="0.14" />
          {/* Check mark chip */}
          <circle cx="268" cy="192" r="18" fill="var(--color-primary)" />
          <path
            d="M260 192.5l5.2 5.2 11-12"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Floating help chips */}
        <g
          className="motion-safe:animate-[soft-float_8s_ease-in-out_infinite]"
          style={{ animationDelay: "-1s" }}
        >
          <rect x="28" y="210" width="72" height="36" rx="10" fill="var(--color-surface)" stroke="var(--color-border)" />
          <text
            x="64"
            y="233"
            fill="var(--color-muted)"
            fontSize="12"
            fontFamily="var(--font-outfit), system-ui, sans-serif"
            textAnchor="middle"
          >
            Cost?
          </text>
        </g>
        <g
          className="motion-safe:animate-[soft-float_6.5s_ease-in-out_infinite]"
          style={{ animationDelay: "-3.2s" }}
        >
          <rect x="268" y="48" width="72" height="36" rx="10" fill="var(--color-surface)" stroke="var(--color-border)" />
          <text
            x="304"
            y="71"
            fill="var(--color-muted)"
            fontSize="12"
            fontFamily="var(--font-outfit), system-ui, sans-serif"
            textAnchor="middle"
          >
            Timeline
          </text>
        </g>
      </svg>
    </div>
  );
}
