import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BatteryLow,
  BellOff,
  Check,
  Clock,
  EyeOff,
  Hand,
  Moon,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import { OptInForm, scrollToForm } from "@/components/site/OptInForm";
import { Footer } from "@/components/site/ui-bits";
import { OFFER, formatPKR } from "@/lib/offer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The 15-Minute Reels Addiction Reset — Cut Your Reels Time in Half by Tomorrow" },
      {
        name: "description",
        content:
          "11 phone settings that take 15 minutes and cut your Reels time in half by tomorrow — even if deleting Instagram never worked.",
      },
      { property: "og:title", content: "The 15-Minute Reels Addiction Reset" },
      {
        property: "og:description",
        content: "Cut your Reels time in half by tomorrow with 11 phone settings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SalesPage,
});

function Cta({ label = `Get the Reset for ${formatPKR(OFFER.price)}` }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={scrollToForm}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 text-base font-extrabold uppercase tracking-wide text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark sm:w-auto"
    >
      {label} <ArrowRight className="h-5 w-5" />
    </button>
  );
}

function SalesPage() {
  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      {/* Pre-headline bar */}
      <div className="bg-ink px-4 py-2.5 text-center text-xs font-semibold text-white sm:text-sm">
        For anyone who opens Instagram "for 2 minutes"… and looks up 2 hours later
      </div>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:pt-12">
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
              <Clock className="h-3.5 w-3.5" /> Takes 15 minutes · Works by tomorrow
            </p>
            <h1 className="mt-4 font-display text-[2rem] leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
              Cut Your Reels Time <span className="text-brand">In Half By Tomorrow</span> With 11
              Phone Settings That Take 15 Minutes
            </h1>
            <p className="mt-4 text-lg font-semibold text-ink/80">
              …Even if you've deleted Instagram 5 times and always reinstalled it.
            </p>

            <div className="mt-6 space-y-3 text-[15px] leading-relaxed text-ink/80 sm:text-base">
              <p>
                You pick up your phone to check one message. Forty minutes of Reels later, the
                assignment is still open, it's 2 AM, and you feel worse than before you started.
                You've tried "just using willpower". You've tried deleting the app. It never lasts.
              </p>
              <p>
                <strong className="text-ink">That's because the problem was never you.</strong> Your
                phone is set up to make scrolling effortless. The Reset flips 11 settings so Reels
                take effort to reach — and when something takes effort, you simply do it less. No
                willpower needed.
              </p>
            </div>

            <ul className="mt-6 grid gap-2 text-[15px] font-medium sm:grid-cols-2">
              {[
                "Step-by-step for iPhone & Android",
                "Done in one 15-minute sitting",
                "See the drop in tomorrow's screen time",
                "Keep Instagram for friends & DMs",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-mint" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:sticky lg:top-6">
            <PhoneVisual />
            <div className="mt-6">
              <OptInForm id="get-reset" />
            </div>
          </div>
        </div>
      </section>

      {/* NOT YOUR FAULT */}
      <section className="bg-ink px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">
            The truth nobody tells you
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            You're not lazy. You're up against a phone built to keep you scrolling.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-white/80">
            <p>
              Endless feed. Autoplay. Red notification dots. A colourful icon right where your thumb
              lands. Every one of these is a default setting — and every one of them is designed to
              make the next Reel easier than closing the app.
            </p>
            <p>
              That's why "I'll just control myself" fails by night three. Willpower runs out.
              Defaults don't.
            </p>
            <p className="text-white">
              Which means the fastest way out isn't more discipline. It's{" "}
              <strong>changing the defaults</strong> — so the easy thing becomes not scrolling.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">What you get</p>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            11 settings. 4 moves. 15 minutes. Done tonight.
          </h2>
          <p className="mt-3 text-ink/70">
            A simple checklist with screenshots for iPhone and Android. Open it, follow along, tick
            each box.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: EyeOff,
              title: "Make it invisible",
              body: "Move the apps your thumb opens on autopilot out of sight, so you stop opening them without deciding to.",
            },
            {
              icon: BatteryLow,
              title: "Make it boring",
              body: "Strip out the colour and the pull that makes the feed hard to put down — Reels lose their grip in minutes.",
            },
            {
              icon: Hand,
              title: "Make it take effort",
              body: "Add small speed bumps between you and the feed. Every extra tap gives your brain a chance to say no.",
            },
            {
              icon: BellOff,
              title: "Kill the triggers",
              body: "Silence the pings that drag you back in, without missing messages from people who actually matter.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink/70">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border-2 border-dashed border-brand/40 bg-brand/5 p-6">
          <div className="flex items-start gap-3">
            <Moon className="mt-0.5 h-6 w-6 shrink-0 text-brand" />
            <div>
              <h3 className="text-lg font-extrabold">Bonus: The 2 AM Rule</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-ink/70">
                The one bedtime phone setup that ends late-night scrolling — so you sleep earlier
                and wake up without that foggy, wasted feeling.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Cta />
        </div>
      </section>

      {/* FOR / NOT FOR */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-mint/10 p-6">
            <h3 className="font-display text-xl">This is for you if…</h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              {[
                "Your screen time shows 4+ hours and most of it is Reels, Shorts or TikTok",
                "You open Instagram without even deciding to",
                "You scroll in bed and sleep later than you meant to",
                'Studies, gym or work keep losing to "one more Reel"',
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-mint" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-ink/5 p-6">
            <h3 className="font-display text-xl">This is NOT for you if…</h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              {[
                "You want a 30-day course to watch — this is a 15-minute fix",
                "You're looking for someone to blame other than the defaults",
                "You won't spend 15 minutes following a checklist tonight",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-ink/50" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* OFFER + GUARANTEE */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="overflow-hidden rounded-3xl border border-border bg-white">
          <div className="bg-ink px-6 py-5 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">
              Everything you get today
            </p>
            <h2 className="mt-1 font-display text-2xl">{OFFER.name}</h2>
          </div>
          <ul className="divide-y divide-border">
            {[
              ["The 11-setting Reset checklist (iPhone + Android)", "Core"],
              ["Screenshots for every step — no guessing", "Included"],
              ["Bonus: The 2 AM Rule bedtime setup", "Bonus"],
              ["Delivered to your WhatsApp + email", "Included"],
            ].map(([t, tag]) => (
              <li key={t} className="flex items-center justify-between gap-4 px-6 py-4 text-[15px]">
                <span className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-mint" /> {t}
                </span>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-ink/60">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border bg-cream px-6 py-6 text-center">
            <p className="text-sm text-ink/60">One-time payment · no subscription</p>
            <p className="mt-1 font-display text-4xl text-ink">{formatPKR(OFFER.price)}</p>
            <p className="mt-1 text-sm text-ink/60">
              Less than one pizza — for hours of your life back, every day.
            </p>
            <div className="mt-5">
              <Cta label="Get instant access now" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-4 rounded-2xl border border-mint/30 bg-mint/10 p-6">
          <ShieldCheck className="h-10 w-10 shrink-0 text-mint" />
          <div>
            <h3 className="text-lg font-extrabold">7-day money-back guarantee</h3>
            <p className="mt-1 text-[15px] leading-relaxed text-ink/75">
              Do the Reset tonight. If your screen time hasn't dropped within 7 days, send one
              WhatsApp message and you get your full {formatPKR(OFFER.price)} back. No questions, no
              hassle.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl">Questions</h2>
          <div className="mt-8 space-y-3">
            {[
              [
                "How do I pay?",
                "On the next page you'll see the Easypaisa number. Send the payment from Easypaisa, JazzCash or your bank app, then upload the screenshot. That's it.",
              ],
              [
                "When do I get the Reset?",
                "As soon as your payment is confirmed, the Reset is sent to your WhatsApp and email — usually within a few hours.",
              ],
              [
                "Do I have to delete Instagram?",
                "No. You keep Instagram for friends, DMs and posting. The Reset only takes away the endless, mindless scrolling.",
              ],
              [
                "Will this work on my phone?",
                "Yes. There are separate steps for iPhone and Android, with screenshots for each.",
              ],
              [
                "Will anyone call me or spam me?",
                "No. Your number is only used to send you the Reset and support if you need it.",
              ],
              [
                "What if it doesn't work for me?",
                "You're covered by the 7-day money-back guarantee. One WhatsApp message and you get a full refund.",
              ],
            ].map(([q, a]) => (
              <details
                key={q}
                className="group rounded-2xl border border-border bg-cream/60 p-5 open:bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {q}
                  <span className="text-xl text-brand transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink px-6 py-12 text-center text-white">
          <Smartphone className="mx-auto h-10 w-10 text-brand" />
          <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
            Tonight you can scroll for another 2 hours… or spend 15 minutes making sure tomorrow is
            different.
          </h2>
          <div className="mt-8">
            <Cta />
          </div>
          <p className="mt-6 text-sm text-white/60">
            P.S. Every day you wait is another 3–4 hours gone to Reels. The Reset takes 15 minutes
            and costs less than a pizza — and it's backed by a 7-day money-back guarantee.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PhoneVisual() {
  return (
    <div className="relative mx-auto flex max-w-sm items-end justify-center gap-4">
      <ScreenCard label="Before" time="5h 12m" bar="w-[92%]" tone="bg-brand" />
      <ArrowRight className="mb-16 h-6 w-6 shrink-0 text-ink/40" />
      <ScreenCard label="After the Reset" time="2h 20m" bar="w-[42%]" tone="bg-mint" />
      <p className="absolute -bottom-6 left-0 right-0 text-center text-[11px] text-ink/40">
        Illustration of a daily screen-time report
      </p>
    </div>
  );
}

function ScreenCard({
  label,
  time,
  bar,
  tone,
}: {
  label: string;
  time: string;
  bar: string;
  tone: string;
}) {
  return (
    <div className="w-36 rounded-[1.75rem] border-[6px] border-ink bg-white p-3 shadow-xl">
      <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-ink/15" />
      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/50">{label}</p>
      <p className="mt-1 font-display text-2xl leading-none">{time}</p>
      <p className="text-[10px] text-ink/50">daily average</p>
      <div className="mt-3 h-2 rounded-full bg-ink/10">
        <div className={`h-2 rounded-full ${tone} ${bar}`} />
      </div>
      <div className="mt-3 space-y-1.5">
        {["Instagram", "TikTok", "YouTube"].map((a) => (
          <div key={a} className="flex items-center justify-between text-[10px] text-ink/60">
            <span>{a}</span>
            <span className="h-1.5 w-8 rounded-full bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
