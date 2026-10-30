import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, RefreshCw } from "lucide-react";
import type { AdminLead } from "@/lib/leads.functions";
import { LEAD_STATUS, formatPKR } from "@/lib/offer";

export const Route = createFileRoute("/admin/leads1340")({
  head: () => ({
    meta: [{ title: "Leads — Reels Reset" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLeads,
});

const KEY = "rar_admin_pass";
const STATUSES = Object.values(LEAD_STATUS);

function statusColour(s: string) {
  if (s === LEAD_STATUS.paid) return "bg-mint/15 text-mint";
  if (s === LEAD_STATUS.pending) return "bg-amber-100 text-amber-800";
  if (s === LEAD_STATUS.rejected) return "bg-destructive/10 text-destructive";
  return "bg-muted text-ink/60";
}

function AdminLeads() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");

  async function load(p = pass) {
    setLoading(true);
    setError("");
    try {
      const { listLeads } = await import("@/lib/leads.functions");
      const res = await listLeads({ data: { passcode: p } });
      setLeads(res.leads);
      setAuthed(true);
      try {
        sessionStorage.setItem(KEY, p);
      } catch {
        /* ignore */
      }
    } catch (e) {
      setAuthed(false);
      setError(
        e instanceof Error && e.message.includes("passcode")
          ? "Wrong passcode"
          : "Couldn't load leads",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let saved = "";
    try {
      saved = sessionStorage.getItem(KEY) ?? "";
    } catch {
      /* ignore */
    }
    if (saved) {
      setPass(saved);
      void load(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function changeStatus(id: string, status: string) {
    const { setLeadStatus } = await import("@/lib/leads.functions");
    await setLeadStatus({ data: { passcode: pass, id, status: status as never } });
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, lead_status: status } : l)));
  }

  const stats = useMemo(() => {
    const paidLike = leads.filter((l) => l.lead_status === LEAD_STATUS.paid);
    return {
      total: leads.length,
      pending: leads.filter((l) => l.lead_status === LEAD_STATUS.pending).length,
      paid: paidLike.length,
      revenue: paidLike.reduce((s, l) => s + (l.total_amount || 0), 0),
      bumps: leads.filter((l) => l.order_bump && l.lead_status !== LEAD_STATUS.optedIn).length,
    };
  }, [leads]);

  const shown = filter === "all" ? leads : leads.filter((l) => l.lead_status === filter);

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4 font-sans">
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            void load();
          }}
          className="w-full max-w-sm rounded-2xl border border-border bg-white p-6"
        >
          <h1 className="text-lg font-extrabold text-ink">Admin — Reels Reset leads</h1>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Passcode"
            className="mt-4 h-11 w-full rounded-xl border border-border px-3"
          />
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <button className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-ink font-bold text-white">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Open"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-8 font-sans text-ink">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">Reels Reset — leads</h1>
          <button
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            ["Leads", stats.total],
            ["Awaiting check", stats.pending],
            ["Paid (verified)", stats.paid],
            ["Verified revenue", formatPKR(stats.revenue)],
            ["Took order bump", stats.bumps],
          ].map(([k, v]) => (
            <div key={String(k)} className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs text-ink/50">{k}</p>
              <p className="mt-1 text-xl font-extrabold">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${filter === s ? "bg-ink text-white" : "bg-white text-ink/70"}`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-ink/50">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">WhatsApp / Email</th>
                <th className="px-4 py-3">Paid from / TID</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Screenshot</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shown.map((l) => (
                <tr key={l.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-ink/60">
                    {new Date(l.updated_at || l.created_at).toLocaleString("en-PK", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 font-semibold">{l.full_name}</td>
                  <td className="px-4 py-3">
                    <a
                      className="text-brand underline"
                      href={`https://wa.me/92${l.whatsapp.replace(/\D/g, "").replace(/^0|^92/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {l.whatsapp}
                    </a>
                    <div className="text-ink/60">{l.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {l.sender_name ?? "—"}
                    {l.transaction_id && (
                      <div className="text-xs text-ink/50">TID {l.transaction_id}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {l.total_amount ? formatPKR(l.total_amount) : "—"}
                    {l.order_bump && <div className="text-xs text-mint">+ bump</div>}
                  </td>
                  <td className="px-4 py-3">
                    {l.screenshot_url ? (
                      <a href={l.screenshot_url} target="_blank" rel="noreferrer">
                        <img
                          src={l.screenshot_url}
                          alt=""
                          className="h-16 w-12 rounded border border-border object-cover"
                        />
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={l.lead_status}
                      onChange={(e) => void changeStatus(l.id, e.target.value)}
                      className={`rounded-lg px-2 py-1 text-xs font-semibold ${statusColour(l.lead_status)}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {!shown.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-ink/50">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
