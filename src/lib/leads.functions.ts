/* eslint-disable @typescript-eslint/no-explicit-any -- untyped Supabase client (no generated types yet) */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TABLE = "reels_reset_leads";
const BUCKET = "payment-screenshots";

// Kept in sync with LEAD_STATUS / prices in src/lib/offer.ts
const STATUS_OPTED_IN = "Opted In - Checkout Not Completed";
const STATUS_PENDING = "Pending Payment Verification";
const MAIN_PRICE = 999;
const BUMP_PRICE = 299;

const optInSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(255),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Please enter a valid WhatsApp number")
    .max(20)
    .regex(/^[+0-9\s-]+$/, "Numbers only"),
});

/** Step 1 (sales page): capture name, email, WhatsApp. */
export const saveOptIn = createServerFn({ method: "POST" })
  .inputValidator((data) => optInSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;

    const { data: existing, error: selErr } = await db
      .from(TABLE)
      .select("id, lead_status")
      .eq("email", data.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (selErr) throw selErr;

    // Same person coming back: refresh their details, never downgrade a submitted payment.
    if (existing?.id) {
      const { error } = await db
        .from(TABLE)
        .update({
          full_name: data.full_name,
          whatsapp: data.whatsapp,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (error) throw error;
      return { id: existing.id as string };
    }

    const { data: row, error } = await db
      .from(TABLE)
      .insert({ ...data, lead_status: STATUS_OPTED_IN })
      .select("id")
      .single();
    if (error) throw error;
    return { id: row.id as string };
  });

const paymentSchema = z.object({
  lead_id: z.string().uuid(),
  order_bump: z.boolean(),
  sender_name: z.string().trim().min(2, "Enter the name on the account you paid from").max(120),
  transaction_id: z.string().trim().max(60).optional().default(""),
  screenshot_base64: z.string().min(100).max(7_000_000),
  screenshot_type: z.enum(["image/jpeg", "image/png", "image/webp"]),
});

/** Step 2 (checkout): store the payment screenshot and mark the lead pending verification. */
export const submitPayment = createServerFn({ method: "POST" })
  .inputValidator((data) => paymentSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;

    const { data: lead, error: leadErr } = await db
      .from(TABLE)
      .select("id")
      .eq("id", data.lead_id)
      .maybeSingle();
    if (leadErr) throw leadErr;
    if (!lead)
      throw new Error("We couldn't find your details. Please go back and fill in step 1 again.");

    const ext =
      data.screenshot_type === "image/png"
        ? "png"
        : data.screenshot_type === "image/webp"
          ? "webp"
          : "jpg";
    const path = `reels-reset/${data.lead_id}/${Date.now()}.${ext}`;
    const bytes = Uint8Array.from(atob(data.screenshot_base64), (c) => c.charCodeAt(0));

    const { error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: data.screenshot_type, upsert: false });
    if (upErr) throw upErr;

    const total = MAIN_PRICE + (data.order_bump ? BUMP_PRICE : 0);
    const { error } = await db
      .from(TABLE)
      .update({
        order_bump: data.order_bump,
        total_amount: total,
        payment_method: "Easypaisa",
        sender_name: data.sender_name,
        transaction_id: data.transaction_id || null,
        payment_screenshot_path: path,
        lead_status: STATUS_PENDING,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.lead_id);
    if (error) throw error;

    return { ok: true, total };
  });

/** Admin: list every lead with a viewable screenshot link. */
export const listLeads = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ passcode: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("@/lib/admin.server");
    await assertAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error } = await (supabaseAdmin as any)
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) throw error;

    const leads = await Promise.all(
      (rows ?? []).map(async (r: any) => {
        let screenshot_url: string | null = null;
        if (r.payment_screenshot_path) {
          const { data: signed } = await supabaseAdmin.storage
            .from(BUCKET)
            .createSignedUrl(r.payment_screenshot_path, 60 * 60);
          screenshot_url = signed?.signedUrl ?? null;
        }
        return { ...r, screenshot_url } as AdminLead;
      }),
    );
    return { leads };
  });

/** Admin: set a lead's status after checking the screenshot. */
export const setLeadStatus = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        passcode: z.string(),
        id: z.string().uuid(),
        status: z.enum([STATUS_OPTED_IN, STATUS_PENDING, "Paid - Verified", "Payment Rejected"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("@/lib/admin.server");
    await assertAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from(TABLE)
      .update({ lead_status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export type AdminLead = {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  order_bump: boolean;
  total_amount: number;
  payment_method: string;
  sender_name: string | null;
  transaction_id: string | null;
  payment_screenshot_path: string | null;
  screenshot_url: string | null;
  lead_status: string;
  created_at: string;
  updated_at: string;
};
