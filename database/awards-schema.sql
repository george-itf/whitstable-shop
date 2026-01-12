-- whitstable.shop Awards & Recognition Schema
-- Run this in Supabase SQL editor

-- =====================================================
-- NOMINATIONS TABLE
-- =====================================================

create table if not exists public.nominations (
  id uuid default uuid_generate_v4() primary key,

  -- Nominator info
  nominator_name text not null,
  nominator_email text,
  user_id uuid references public.profiles(id),

  -- Nominee info
  nominee_name text not null,
  nominee_business text, -- optional, for hospitality stars

  -- Category: 'hospitality_star' or 'community_hero'
  category text not null check (category in ('hospitality_star', 'community_hero')),

  -- Nomination details
  reason text not null,

  -- Month for the award (YYYY-MM format)
  award_month text not null,

  -- Status: pending, approved, rejected, winner
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'winner')),

  -- Timestamps
  created_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id)
);

-- =====================================================
-- WINNERS TABLE
-- =====================================================

create table if not exists public.award_winners (
  id uuid default uuid_generate_v4() primary key,

  -- Winner info
  winner_name text not null,
  winner_business text, -- optional
  winner_image_url text,

  -- Category: 'hospitality_star' or 'community_hero'
  category text not null check (category in ('hospitality_star', 'community_hero')),

  -- Award details
  award_month text not null, -- YYYY-MM format
  reason text not null, -- Why they won
  admin_note text, -- Optional note from George

  -- Link to original nomination (if applicable)
  nomination_id uuid references public.nominations(id),

  -- Rank (1st, 2nd, 3rd for multiple winners per category)
  rank integer default 1 check (rank >= 1 and rank <= 3),

  -- Timestamps
  announced_at timestamptz default now(),
  created_by uuid references public.profiles(id),

  -- Unique constraint: one rank per category per month
  unique(category, award_month, rank)
);

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists idx_nominations_month on public.nominations(award_month);
create index if not exists idx_nominations_status on public.nominations(status);
create index if not exists idx_nominations_category on public.nominations(category);
create index if not exists idx_winners_month on public.award_winners(award_month);
create index if not exists idx_winners_category on public.award_winners(category);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.nominations enable row level security;
alter table public.award_winners enable row level security;

-- Anyone can submit nominations
create policy "Anyone can create nominations"
  on public.nominations for insert
  with check (true);

-- Users can see their own nominations
create policy "Users can view own nominations"
  on public.nominations for select
  using (
    user_id = auth.uid()
    or nominator_email = (select email from auth.users where id = auth.uid())
  );

-- Admins can see all nominations
create policy "Admins can view all nominations"
  on public.nominations for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update nominations
create policy "Admins can update nominations"
  on public.nominations for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Anyone can view winners
create policy "Anyone can view winners"
  on public.award_winners for select
  using (true);

-- Only admins can manage winners
create policy "Admins can manage winners"
  on public.award_winners for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
