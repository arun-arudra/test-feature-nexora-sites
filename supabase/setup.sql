-- Nexora Sites: testimonials + light analytics
-- Run in Supabase SQL editor (or via supabase db push)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Testimonials (managed from /admin)
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text not null default '',
  company text not null default '',
  product text not null default '',
  tone text not null default 'cream'
    check (tone in ('cream', 'amber', 'teal', 'sage', 'blush', 'ink')),
  avatar_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_published_sort_idx
  on public.testimonials (is_published, sort_order, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

alter table public.testimonials enable row level security;

-- Public can read published rows
drop policy if exists "Public read published testimonials" on public.testimonials;
create policy "Public read published testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (is_published = true);

-- Authenticated admins can manage all (tighten with a roles table later if needed)
drop policy if exists "Authenticated manage testimonials" on public.testimonials;
create policy "Authenticated manage testimonials"
  on public.testimonials for all
  to authenticated
  using (true)
  with check (true);

-- Storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('testimonial-avatars', 'testimonial-avatars', true)
on conflict (id) do nothing;

drop policy if exists "Public read testimonial avatars" on storage.objects;
create policy "Public read testimonial avatars"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'testimonial-avatars');

drop policy if exists "Auth upload testimonial avatars" on storage.objects;
create policy "Auth upload testimonial avatars"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'testimonial-avatars');

drop policy if exists "Auth update testimonial avatars" on storage.objects;
create policy "Auth update testimonial avatars"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'testimonial-avatars');

drop policy if exists "Auth delete testimonial avatars" on storage.objects;
create policy "Auth delete testimonial avatars"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'testimonial-avatars');

-- ---------------------------------------------------------------------------
-- Simple daily page analytics (dashboard)
-- ---------------------------------------------------------------------------
create table if not exists public.page_views_daily (
  day date primary key,
  views int not null default 0,
  unique_visitors int not null default 0
);

alter table public.page_views_daily enable row level security;

drop policy if exists "Auth read analytics" on public.page_views_daily;
create policy "Auth read analytics"
  on public.page_views_daily for select
  to authenticated
  using (true);

-- Upsert helper for edge/API tracking (service role preferred)
create or replace function public.increment_page_view(p_day date default current_date)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.page_views_daily (day, views, unique_visitors)
  values (p_day, 1, 1)
  on conflict (day) do update
    set views = public.page_views_daily.views + 1;
end;
$$;

grant execute on function public.increment_page_view(date) to anon, authenticated;

-- Seed sample testimonials (safe to re-run: only inserts when empty)
insert into public.testimonials (quote, name, role, company, product, tone, sort_order)
select * from (values
  (
    'They rebuilt our slow shop site, fixed product pages, and set up WhatsApp enquiry. Orders picked up within weeks. Very responsive on chat.',
    'Rohit N.', 'E-commerce · Bangalore', 'Local shop', 'E-commerce website', 'cream', 1
  ),
  (
    'Restaurant website with digital menu and table enquiry, done quickly. Walk-ins from Google have gone up. Worth every rupee.',
    'Sneha I.', 'Restaurant · Mysuru', 'Family restaurant', 'Restaurant website', 'amber', 2
  ),
  (
    'Clean clinic site with appointment enquiry and Maps. A few extra revision rounds, but they fixed everything without fuss.',
    'Dr. Anitha R.', 'Healthcare · Hyderabad', 'Clinic', 'Clinic website', 'teal', 3
  ),
  (
    'Homestay site looks premium on mobile. Guests now enquire on WhatsApp instead of only booking on OTAs. Smooth process end to end.',
    'Karthik M.', 'Homestay · Coorg', 'Homestay', 'Booking website', 'sage', 4
  ),
  (
    'Logo, domain, hosting, and the site — all handled by one team. Fixed price from day one. Exactly what a busy salon needs.',
    'Priya S.', 'Beauty · Bangalore', 'Salon', 'Brand + website', 'blush', 5
  ),
  (
    'Cloud kitchen finally has a brand presence beyond Swiggy. Bulk order enquiries started coming in the first month.',
    'Imran K.', 'Cloud Kitchen · Hubli', 'Cloud kitchen', 'Brand website', 'ink', 6
  ),
  (
    'They explained everything in simple terms and launched fast. Our hotel enquiry form and gallery look sharp on phones.',
    'Meena D.', 'Hotel · Vizag', 'Boutique hotel', 'Hotel website', 'amber', 7
  ),
  (
    'AMC care after launch is the real win. Menu updates and festival banners without hunting another vendor.',
    'Arjun P.', 'Cafe · Mangaluru', 'Cafe', 'Website + AMC', 'teal', 8
  )
) as seed(quote, name, role, company, product, tone, sort_order)
where not exists (select 1 from public.testimonials limit 1);
-- Site settings (e.g. how many testimonials to show on the homepage)

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Auth manage site settings" on public.site_settings;
create policy "Auth manage site settings"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

insert into public.site_settings (key, value)
values ('testimonials_visible_count', '8')
on conflict (key) do nothing;

-- API roles need table privileges (some projects revoke default grants)
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.testimonials to anon, authenticated, service_role;
grant select, insert, update, delete on table public.site_settings to anon, authenticated, service_role;
grant select, insert, update, delete on table public.page_views_daily to anon, authenticated, service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;
