import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { Field, StepBadge, TrustRow, inputClass } from "./ui-bits";
import { OFFER, formatPKR, readLeadLocally, saveLeadLocally } from "@/lib/offer";

type Errors = Partial<Record<"full_name" | "email" | "whatsapp" | "form", string>>;

export function OptInForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  // Prefill for returning visitors (client only, avoids SSR mismatch).
  useEffect(() => {
    const saved = readLeadLocally();
    if (!saved) return;
    setFullName(saved.full_name);
    setEmail(saved.email);
    setWhatsapp(saved.whatsapp);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (fullName.trim().length < 2) next.full_name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Please enter a valid email";
    if (whatsapp.replace(/\D/g, "").length < 10)
      next.whatsapp = "Please enter a valid WhatsApp number";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const { saveOptIn } = await import("@/lib/leads.functions");
      const res = await saveOptIn({ data: { full_name: fullName, email, whatsapp } });
      saveLeadLocally({
        id: res.id,
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        whatsapp: whatsapp.trim(),
      });
      await navigate({ to: "/checkout", search: { lead: res.id } });
    } catch (err) {
      console.error(err);
      setErrors({ form: "Something went wrong saving your details. Please try again." });
      setBusy(false);
    }
  }

  return (
    <form
      id={id}
      onSubmit={onSubmit}
      noValidate
      className="w-full scroll-mt-6 rounded-3xl border border-border bg-white p-5 shadow-[0_20px_60px_-25px_rgba(20,20,40,0.35)] sm:p-7"
    >
      <StepBadge step={1} />
      <h3 className="font-display text-xl leading-tight text-ink sm:text-2xl">
        Where should we send your Reset?
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your details, then pay {formatPKR(OFFER.price)} on the next step.
      </p>

      <div className="mt-5 space-y-4">
        <Field label="Full name" error={errors.full_name}>
          <input
            className={inputClass}
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Ali Khan"
          />
        </Field>
        <Field label="WhatsApp number" error={errors.whatsapp} hint="Your Reset is delivered here">
          <input
            className={inputClass}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="03XX XXXXXXX"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            className={inputClass}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
      </div>

      {errors.form && <p className="mt-4 text-sm font-medium text-destructive">{errors.form}</p>}

      <button
        type="submit"
        disabled={busy}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-base font-extrabold uppercase tracking-wide text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:opacity-70"
      >
        {busy ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Yes! Give me my Reset <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
      <TrustRow className="mt-4" />
    </form>
  );
}

export function scrollToForm() {
  document.getElementById("get-reset")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
