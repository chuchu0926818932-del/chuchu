create table if not exists public.snl_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  favorites text[] not null default '{}',
  plans jsonb not null default '{}'::jsonb,
  active_topic_id text,
  updated_at timestamptz not null default now()
);

alter table public.snl_workspaces enable row level security;

drop policy if exists "Users manage own SNL workspace" on public.snl_workspaces;

create policy "Users manage own SNL workspace"
on public.snl_workspaces
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on table public.snl_workspaces to authenticated;
