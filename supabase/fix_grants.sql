-- Grant API roles access to Nexora tables (required on locked-down projects)
-- Safe to re-run.

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on table public.testimonials to anon, authenticated, service_role;
grant select, insert, update, delete on table public.site_settings to anon, authenticated, service_role;

do $$
begin
  grant select, insert, update, delete on table public.page_views_daily to anon, authenticated, service_role;
exception
  when undefined_table then
    null;
end $$;

grant usage, select on all sequences in schema public to anon, authenticated, service_role;

alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public read published testimonials" on public.testimonials;
create policy "Public read published testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "Authenticated manage testimonials" on public.testimonials;
create policy "Authenticated manage testimonials"
  on public.testimonials for all
  to authenticated
  using (true)
  with check (true);

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

do $$
begin
  alter table public.page_views_daily enable row level security;
  drop policy if exists "Auth read analytics" on public.page_views_daily;
  create policy "Auth read analytics"
    on public.page_views_daily for select
    to authenticated
    using (true);
exception
  when undefined_table then
    null;
end $$;
