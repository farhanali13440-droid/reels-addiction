// Single source of truth for the offer. Edit prices, copy and payment details here.

export const OFFER = {
  name: "The 15-Minute Reels Addiction Reset",
  shortName: "Reels Addiction Reset",
  price: 999,
  currency: "PKR",
  format: "Step-by-step checklist (iPhone + Android)",
} as const;

export const ORDER_BUMP = {
  id: "freed-hours-plan",
  title: "The Freed-Hours Plan",
  yesText: "Yes! I want to fill my freed-up hours with habits that actually change my life",
  price: 299,
  hook: "ONE-TIME ADD-ON · ONLY ON THIS PAGE",
  body: "Getting your screen time down, staying off Reels for a full week, and EVEN becoming the person who studies, trains and builds instead of scrolls will REQUIRE this add-on. The Reset frees up 2–3 hours a day — this plan tells you exactly what to do with them: 7 tiny replacement habits, a 7-day phone-free evening routine, and the 'craving swap' list for the moments you reach for your phone. Normally only included inside my done-with-you coaching.",
} as const;

export const PAYMENT = {
  method: "Easypaisa",
  number: "03135944817",
  title: "Farhan Ali Rasheed",
} as const;

export const SUPPORT_WHATSAPP = PAYMENT.number;

export const LEAD_STATUS = {
  optedIn: "Opted In - Checkout Not Completed",
  pending: "Pending Payment Verification",
  paid: "Paid - Verified",
  rejected: "Payment Rejected",
} as const;

export function formatPKR(amount: number) {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

const STORAGE_KEY = "rar_lead";

export type StoredLead = { id: string; full_name: string; email: string; whatsapp: string };

export function saveLeadLocally(lead: StoredLead) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
  } catch {
    /* storage may be blocked; the lead id also travels in the URL */
  }
}

export function readLeadLocally(): StoredLead | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredLead) : null;
  } catch {
    return null;
  }
}
