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

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.site_settings to anon, authenticated, service_role;
