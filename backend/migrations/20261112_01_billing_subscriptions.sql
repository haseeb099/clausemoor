-- Stripe billing state for hosted Chambers / Firm subscriptions.
-- Self-hosted sales stay on invoice / order form and do not use these columns.

alter table public.user_profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_plan_id text,
  add column if not exists subscription_status text,
  add column if not exists subscription_interval text,
  add column if not exists subscription_updated_at timestamptz;

create unique index if not exists user_profiles_stripe_customer_id_uidx
  on public.user_profiles (stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists user_profiles_stripe_subscription_id_uidx
  on public.user_profiles (stripe_subscription_id)
  where stripe_subscription_id is not null;
