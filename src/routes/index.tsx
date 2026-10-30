import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { OptInModal } from "@/components/site/OptInModal";
import { OFFER, formatPKR } from "@/lib/offer";

// V1: RAS short-form landing page (pre-headline → headline → subheadline → visual → single CTA).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Get 2–3 Hours of Your Day Back From Reels — The 15-Minute Reels Addiction Reset" },
      {
        name: "description",
        content:
          "Change 11 settings on your phone tonight and cut your Reels time in half by tomorrow. iPhone + Android. PKR 999.",
      },
      { property: "og:title", content: "The 15-Minute Reels Addiction Reset" },
      { property: "og:image", content: "/images/product-stack.webp" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "preload", as: "image", href: "/images/product-stack.webp" }],
  }),
  component: LandingV1,
});

const YELLOW = "#ffcc3d";

function LandingV1() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="min-h-screen bg-[#0d0d14] font-sans text-white">
      {/* Top announcement bar */}
      <div className="bg-white px-3 py-1.5 text-center text-[11px] font-extrabold uppercase tracking-wide text-ink sm:text-xs">
        ⚡ Delivered instantly to your WhatsApp · One-time payment of {formatPKR(OFFER.price)}
      </div>

      <main className="mx-auto max-w-[680px] px-4 pb-10 pt-5 text-center">
        {/* Pre-headline */}
        <div
          className="px-3 py-2 text-[13px] font-extrabold leading-snug text-ink sm:text-base"
          style={{ backgroundColor: YELLOW }}
        >
          Cut Your Reels Time In Half By Tomorrow… Or Get Your Money Back — GUARANTEED!
        </div>

        {/* Headline */}
        <h1 className="mt-4 font-condensed text-[2rem] font-bold uppercase leading-[1.08] tracking-tight sm:text-[2.75rem]">
          How To Get <span className="text-brand">2–3 Hours Of Your Day Back</span> From Reels By
          Changing <span className="text-brand">11 Settings</span> On Your Phone Tonight
        </h1>
        <div className="mx-auto mt-3 h-1 w-3/4 rounded bg-brand" />

        {/* Subheadline */}
        <p className="mx-auto mt-4 max-w-[560px] text-[15px] font-semibold leading-relaxed text-white/85 sm:text-lg">
          Takes 15 minutes. Works on iPhone &amp; Android. No willpower, no deleting Instagram… Even
          if you've deleted the app 5 times and always reinstalled it.
        </p>

        {/* Visual */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 block w-full"
          aria-label="Get the Reset"
        >
          <img
            src="/images/product-stack.webp"
            width={1460}
            height={1040}
            alt="The 15-Minute Reels Addiction Reset: Reset Checklist, Screenshot Walkthrough and the 2 AM Rule bonus"
            className="mx-auto w-full max-w-[640px]"
          />
        </button>

        {/* Tagline */}
        <p className="mt-2 text-sm font-extrabold uppercase tracking-wide sm:text-base">
          Stop losing your nights to Reels — start getting your time back tonight
        </p>

        {/* CTA */}
        <CtaButton onClick={() => setOpen(true)} />
        <p className="mt-3 text-sm text-white/80">
          Cut your Reels time in half within 7 days or get your money back
        </p>

        {/* Guarantee */}
        <div className="mx-auto mt-8 flex max-w-[460px] items-center gap-4 text-left">
          <GuaranteeSeal />
          <p className="text-sm leading-snug text-white/85">
            <strong className="text-white">We guarantee your screen time drops in 7 days.</strong>{" "}
            If it doesn't, send one WhatsApp message and get your full {formatPKR(OFFER.price)}{" "}
            back. No questions asked.
          </p>
        </div>

        {/* What's inside (short) */}
        <div className="mx-auto mt-10 max-w-[520px] rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
          <p
            className="text-center text-xs font-extrabold uppercase tracking-widest"
            style={{ color: YELLOW }}
          >
            What you get for {formatPKR(OFFER.price)}
          </p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {[
              ["The Reset Checklist", "all 11 settings, step by step for iPhone + Android"],
              ["Screenshot Walkthrough", "every step shown, so you can't get lost"],
              ["Bonus: The 2 AM Rule", "the bedtime setup that ends late-night scrolling"],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-2">
                <span className="mt-0.5 font-bold" style={{ color: YELLOW }}>
                  ✓
                </span>
                <span>
                  <strong>{t}</strong> <span className="text-white/70">— {d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <CtaButton onClick={() => setOpen(true)} />

        {/* Footer */}
        <footer className="mt-12 space-y-3 text-[11px] leading-relaxed text-white/45">
          <p>
            Reels Addiction Reset · Farhan Ali Rasheed · © {new Date().getFullYear()} All rights
            reserved
          </p>
          <p>
            This site is not part of, or endorsed by, Instagram, Facebook or Meta Platforms, Inc.
            Instagram is a trademark of Meta Platforms, Inc.
          </p>
          <p>
            Screen-time figures shown are an illustration. Results depend on the person and how the
            steps are followed. This is a self-help guide for phone habits, not medical or
            psychological treatment.
          </p>
        </footer>
      </main>

      <OptInModal open={open} onClose={close} />
    </div>
  );
}

function CtaButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto mt-5 block w-full max-w-[600px] px-4 py-3 text-ink shadow-[0_10px_30px_-8px_rgba(255,204,61,0.6)] transition hover:brightness-105 active:scale-[0.99]"
      style={{ backgroundColor: YELLOW }}
    >
      <span className="flex items-center justify-center gap-2 text-base font-extrabold uppercase sm:text-xl">
        <ShoppingCart className="h-5 w-5" /> Yes! I want my time back
      </span>
      <span className="mt-0.5 block text-xs font-bold uppercase tracking-wide text-ink/75 sm:text-sm">
        → Get instant access now for {formatPKR(OFFER.price)}
      </span>
    </button>
  );
}

function GuaranteeSeal() {
  const points = Array.from({ length: 40 }, (_, i) => {
    const a = (Math.PI * i) / 20 - Math.PI / 2;
    const r = i % 2 === 0 ? 48 : 43;
    return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0" aria-hidden="true">
      <polygon points={points} fill={YELLOW} />
      <circle cx="50" cy="50" r="36" fill="#1a1a24" />
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke={YELLOW}
        strokeWidth="1.2"
        strokeDasharray="2 2.5"
      />
      <text
        x="50"
        y="44"
        textAnchor="middle"
        fill={YELLOW}
        fontSize="20"
        fontWeight="800"
        fontFamily="Oswald, sans-serif"
      >
        7-DAY
      </text>
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fill="#fff"
        fontSize="8.5"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        MONEY-BACK
      </text>
      <text
        x="50"
        y="67"
        textAnchor="middle"
        fill="#fff"
        fontSize="8.5"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        GUARANTEE
      </text>
    </svg>
  );
}
