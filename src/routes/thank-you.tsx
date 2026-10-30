import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Footer } from "@/components/site/ui-bits";
import { OFFER, SUPPORT_WHATSAPP, formatPKR } from "@/lib/offer";

export const Route = createFileRoute("/thank-you")({
  validateSearch: (search: Record<string, unknown>) => ({
    total:
      typeof search["total"] === "number"
        ? (search["total"] as number)
        : Number(search["total"]) || undefined,
  }),
  head: () => ({
    meta: [{ title: `Order received — ${OFFER.name}` }, { name: "robots", content: "noindex" }],
  }),
  component: ThankYou,
});

function ThankYou() {
  const { total } = Route.useSearch();
  const waNumber = `92${SUPPORT_WHATSAPP.replace(/^0/, "")}`;

  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      <main className="mx-auto max-w-2xl px-4 py-14">
        <div className="rounded-3xl border border-border bg-white p-6 text-center sm:p-10">
          <CheckCircle2 className="mx-auto h-14 w-14 text-mint" />
          <h1 className="mt-4 font-display text-3xl leading-tight">
            Payment received — you're in!
          </h1>
          <p className="mt-3 text-ink/70">
            We're checking your screenshot{total ? ` for ${formatPKR(total)}` : ""}. As soon as it's
            confirmed, your <strong className="text-ink">{OFFER.name}</strong> is sent to your
            WhatsApp and email — usually within a few hours.
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Hi, I just paid for the Reels Addiction Reset.")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-mint px-5 py-3 font-bold text-white transition hover:opacity-90"
          >
            <MessageCircle className="h-5 w-5" /> Questions? Message us on WhatsApp
          </a>
        </div>

        <div className="mt-8 rounded-3xl bg-ink p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">
            Here's what happens next
          </p>
          <ol className="mt-4 space-y-3 text-[15px] leading-relaxed text-white/85">
            <li>
              <strong className="text-white">Tonight:</strong> do the Reset in 15 minutes.
            </li>
            <li>
              <strong className="text-white">Tomorrow:</strong> check your screen time — you'll see
              the drop.
            </li>
            <li>
              <strong className="text-white">Then the real question:</strong> what do you do with
              the 2–3 hours you just got back? That's where most people slide back into old habits.
            </li>
          </ol>
          <p className="mt-5 text-sm text-white/60">
            Keep an eye on your WhatsApp — I'll share how to turn those freed-up hours into habits
            that actually stick.
          </p>
        </div>

        <p className="mt-8 text-center text-sm">
          <Link to="/" className="text-ink/60 underline">
            Back to home
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
