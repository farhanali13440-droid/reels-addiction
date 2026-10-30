import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Copy, ImagePlus, Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { Field, Footer, StepBadge, TrustRow, inputClass } from "@/components/site/ui-bits";
import { OptInForm } from "@/components/site/OptInForm";
import {
  OFFER,
  ORDER_BUMP,
  PAYMENT,
  formatPKR,
  readLeadLocally,
  type StoredLead,
} from "@/lib/offer";

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>) => ({
    lead: typeof search["lead"] === "string" ? (search["lead"] as string) : undefined,
  }),
  head: () => ({
    meta: [{ title: `Checkout — ${OFFER.name}` }, { name: "robots", content: "noindex" }],
  }),
  component: CheckoutPage,
});

const MAX_UPLOAD_MB = 10;

function CheckoutPage() {
  const { lead: leadFromUrl } = Route.useSearch();
  const navigate = useNavigate();
  const [lead, setLead] = useState<StoredLead | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const local = readLeadLocally();
    if (leadFromUrl) {
      setLead(
        local && local.id === leadFromUrl
          ? local
          : { id: leadFromUrl, full_name: "", email: "", whatsapp: "" },
      );
    } else {
      setLead(local);
    }
    setReady(true);
  }, [leadFromUrl]);

  const [bump, setBump] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [txId, setTxId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"sender" | "file" | "form", string>>>({});
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lead?.full_name && !senderName) setSenderName(lead.full_name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.full_name]);

  const total = OFFER.price + (bump ? ORDER_BUMP.price : 0);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(PAYMENT.number);
    } catch {
      const el = document.createElement("textarea");
      el.value = PAYMENT.number;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function pickFile(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, file: "Please upload an image (screenshot) of your payment" }));
      return;
    }
    if (f.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setErrors((e) => ({ ...e, file: `Image is too large (max ${MAX_UPLOAD_MB} MB)` }));
      return;
    }
    setErrors(({ file: _drop, ...rest }) => rest);
    setFile(f);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!lead) return;
    const next: Partial<Record<"sender" | "file" | "form", string>> = {};
    if (senderName.trim().length < 2) next.sender = "Enter the name on the account you paid from";
    if (!file) next.file = "Upload your payment screenshot to complete your order";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const { base64, type } = await compressImage(file!);
      const { submitPayment } = await import("@/lib/leads.functions");
      await submitPayment({
        data: {
          lead_id: lead.id,
          order_bump: bump,
          sender_name: senderName,
          transaction_id: txId,
          screenshot_base64: base64,
          screenshot_type: type,
        },
      });
      await navigate({ to: "/thank-you", search: { total }, replace: true });
    } catch (err) {
      console.error(err);
      const msg =
        err instanceof Error && err.message.includes("couldn't find")
          ? err.message
          : "Upload failed. Please check your internet and try again, or send the screenshot on WhatsApp.";
      setErrors({ form: msg });
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      <header className="border-b border-border bg-white px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="font-display text-base">
            Reels Addiction Reset
          </Link>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-mint">
            <ShieldCheck className="h-4 w-4" /> Secure checkout
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {!ready ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-ink/40" />
          </div>
        ) : !lead ? (
          <div className="mx-auto max-w-md">
            <p className="mb-4 text-center text-sm text-ink/70">
              First, tell us where to send your Reset.
            </p>
            <OptInForm id="get-reset" />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <form onSubmit={onSubmit} noValidate className="space-y-6">
              <div className="rounded-3xl border border-border bg-white p-5 sm:p-7">
                <StepBadge step={2} />
                <h1 className="font-display text-2xl leading-tight">Complete your order</h1>
                <p className="mt-1 text-sm text-ink/70">
                  {lead.full_name ? `${lead.full_name.split(" ")[0]}, you're` : "You're"} one step
                  away. Send <strong className="text-ink">{formatPKR(total)}</strong> and upload the
                  screenshot below.
                </p>

                {/* Order bump */}
                <label
                  className={`mt-5 block cursor-pointer rounded-2xl border-2 border-dashed p-4 transition ${bump ? "border-mint bg-mint/10" : "border-brand/50 bg-brand/5"}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={bump}
                      onChange={(e) => setBump(e.target.checked)}
                      className="mt-1 h-5 w-5 shrink-0 accent-[var(--mint)]"
                    />
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wider text-brand">
                        {ORDER_BUMP.hook}
                      </p>
                      <p className="mt-1 font-extrabold leading-snug">{ORDER_BUMP.yesText}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink/75">
                        <strong>{ORDER_BUMP.title}:</strong> {ORDER_BUMP.body}
                      </p>
                      <p className="mt-2 text-sm font-bold">
                        Add to order for just {formatPKR(ORDER_BUMP.price)}
                      </p>
                    </div>
                  </div>
                </label>

                {/* Payment details */}
                <div className="mt-6 rounded-2xl bg-ink p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand">
                    1. Send payment via {PAYMENT.method}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-3">
                    <div>
                      <p className="text-xs text-white/60">Account number</p>
                      <p className="font-display text-2xl tracking-wider">{PAYMENT.number}</p>
                    </div>
                    <button
                      type="button"
                      onClick={copyNumber}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white transition hover:bg-brand-dark"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-white/10 px-4 py-3">
                      <p className="text-xs text-white/60">Account title</p>
                      <p className="font-semibold">{PAYMENT.title}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 px-4 py-3">
                      <p className="text-xs text-white/60">Amount to send</p>
                      <p className="font-semibold">{formatPKR(total)}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-white/60">
                    You can pay from Easypaisa, JazzCash or any bank app (send to Easypaisa
                    account).
                  </p>
                </div>

                {/* Confirmation */}
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-brand">
                  2. Confirm your payment
                </p>
                <div className="mt-3 space-y-4">
                  <Field label="Name on the account you paid from" error={errors.sender}>
                    <input
                      className={inputClass}
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Ali Khan"
                    />
                  </Field>
                  <Field label="Transaction ID (optional)" hint="Found on your payment receipt">
                    <input
                      className={inputClass}
                      value={txId}
                      onChange={(e) => setTxId(e.target.value)}
                      placeholder="e.g. 0123456789"
                    />
                  </Field>

                  <div>
                    <span className="mb-1.5 block text-sm font-semibold">Payment screenshot</span>
                    <input
                      ref={fileInput}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => pickFile(e.target.files?.[0])}
                    />
                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-sm transition ${errors.file ? "border-destructive bg-destructive/5" : "border-border bg-cream hover:border-brand"}`}
                    >
                      {preview ? (
                        <>
                          <img
                            src={preview}
                            alt="Payment screenshot preview"
                            className="max-h-48 rounded-lg object-contain"
                          />
                          <span className="font-semibold text-brand">Tap to change screenshot</span>
                        </>
                      ) : (
                        <>
                          <ImagePlus className="h-8 w-8 text-ink/40" />
                          <span className="font-semibold">
                            Tap to upload your payment screenshot
                          </span>
                          <span className="text-xs text-ink/50">
                            JPG or PNG, up to {MAX_UPLOAD_MB} MB
                          </span>
                        </>
                      )}
                    </button>
                    {errors.file && (
                      <span className="mt-1 block text-xs font-medium text-destructive">
                        {errors.file}
                      </span>
                    )}
                  </div>
                </div>

                {errors.form && (
                  <p className="mt-4 text-sm font-medium text-destructive">{errors.form}</p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-base font-extrabold uppercase tracking-wide text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:opacity-70"
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Uploading…
                    </>
                  ) : (
                    <>Complete my order · {formatPKR(total)}</>
                  )}
                </button>
                <TrustRow className="mt-4" />
              </div>
            </form>

            {/* Summary */}
            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <div className="rounded-3xl border border-border bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
                  Order summary
                </p>
                <div className="mt-4 flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold leading-snug">{OFFER.name}</p>
                    <p className="mt-0.5 text-sm text-ink/60">
                      11 phone settings that cut your Reels time in half by tomorrow. iPhone +
                      Android.
                    </p>
                  </div>
                  <p className="font-bold">{formatPKR(OFFER.price)}</p>
                </div>
                {bump && (
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                    <span>{ORDER_BUMP.title}</span>
                    <span className="font-bold">{formatPKR(ORDER_BUMP.price)}</span>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-bold">Total</span>
                  <span className="font-display text-2xl">{formatPKR(total)}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-mint/30 bg-mint/10 p-5 text-sm">
                <ShieldCheck className="h-6 w-6 shrink-0 text-mint" />
                <p className="leading-relaxed text-ink/75">
                  <strong className="text-ink">7-day money-back guarantee.</strong> If your screen
                  time hasn't dropped within 7 days, one WhatsApp message gets you a full refund.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-sm text-ink/70">
                <p className="font-bold text-ink">What happens next?</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>We check your payment screenshot</li>
                  <li>Your Reset arrives on WhatsApp + email</li>
                  <li>Do it tonight in 15 minutes</li>
                </ol>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

/** Shrink big phone screenshots before upload so it works on slow mobile data. */
async function compressImage(
  file: File,
): Promise<{ base64: string; type: "image/jpeg" | "image/png" | "image/webp" }> {
  try {
    const bitmap = await createImageBitmap(file);
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
    return { base64: dataUrl.split(",")[1] ?? "", type: "image/jpeg" };
  } catch {
    // Fallback: send the original file as-is.
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    const type = (["image/png", "image/webp"].includes(file.type) ? file.type : "image/jpeg") as
      "image/jpeg" | "image/png" | "image/webp";
    return { base64: dataUrl.split(",")[1] ?? "", type };
  }
}
