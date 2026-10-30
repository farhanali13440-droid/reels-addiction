-- Reels Addiction Reset: leads + Easypaisa payment screenshots.
-- Already applied to this project's Lovable Cloud database; kept here for reference.
create table if not exists public.reels_reset_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  whatsapp text not null,
  city text,
  daily_screen_time text,
  order_bump boolean not null default false,
  total_amount integer not null default 0,
  payment_method text not null default 'pending',
  sender_name text,
  transaction_id text,
  payment_screenshot_path text,
  lead_status text not null default 'Opted In - Checkout Not Completed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists reels_reset_leads_email_idx on public.reels_reset_leads (email);
create index if not exists reels_reset_leads_created_idx on public.reels_reset_leads (created_at desc);
-- RLS on with no policies: only the server (service role) reads/writes.
alter table public.reels_reset_leads enable row level security;

insert into storage.buckets (id, name, public)
values ('payment-screenshots', 'payment-screenshots', false)
on conflict (id) do nothing;
