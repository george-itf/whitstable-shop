-- whitstable.shop Community Engagement Schema
-- Run this in Supabase SQL editor to set up all tables

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- =====================================================
-- CORE TABLES (Shops, Profiles, Events)
-- =====================================================

-- User profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  bio text,
  avatar_url text,
  is_public boolean default true,
  is_local boolean default false, -- verified local resident
  joined_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Shops directory
create table if not exists public.shops (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  category text not null,
  subcategory text,

  -- Location
  address text,
  street text,
  postcode text,
  latitude decimal(10,8),
  longitude decimal(11,8),

  -- Contact
  phone text,
  email text,
  website text,
  instagram text,
  facebook text,

  -- Media
  image_url text,
  gallery_urls text[],

  -- Hours (JSON for each day)
  opening_hours jsonb,

  -- Status
  is_active boolean default true,
  is_verified boolean default false,
  is_featured boolean default false,

  -- Stats
  save_count int default 0,
  review_count int default 0,
  average_rating decimal(2,1) default 0,
  view_count int default 0,

  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Events
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  description text,

  -- Dates
  start_date date not null,
  end_date date,
  start_time time,
  end_time time,
  is_recurring boolean default false,
  recurrence_rule text,

  -- Location
  location text,
  venue text,
  shop_id uuid references public.shops(id),

  -- Details
  price text,
  booking_url text,
  image_url text,
  category text,

  -- Status
  is_active boolean default true,
  is_featured boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete cascade,

  rating int not null check (rating >= 1 and rating <= 5),
  content text,

  -- Metadata
  is_verified_purchase boolean default false,
  is_featured boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Saved shops
create table if not exists public.saved_shops (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, shop_id)
);

-- Visited shops
create table if not exists public.visited_shops (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete cascade,
  visited_at timestamptz default now(),
  unique(user_id, shop_id)
);

-- =====================================================
-- 1. PHOTO COMPETITION
-- =====================================================

-- Competition months with prizes
create table if not exists public.photo_competitions (
  id uuid default uuid_generate_v4() primary key,
  month date not null unique,
  title text not null,
  theme text,

  -- Prize
  prize_description text not null,
  prize_shop_id uuid references public.shops(id),
  prize_value text,

  -- Dates
  submissions_open timestamptz not null,
  submissions_close timestamptz not null,
  voting_open timestamptz not null,
  voting_close timestamptz not null,

  -- Winners (set after voting closes)
  winner_id uuid,
  runner_up_id uuid,

  status text default 'upcoming' check (status in ('upcoming', 'submissions', 'voting', 'judging', 'complete')),

  created_at timestamptz default now()
);

-- Photo competition entries
create table if not exists public.photo_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,

  -- Photo
  image_url text not null,
  title text not null,
  description text,
  location text,
  shop_id uuid references public.shops(id),

  -- Competition
  competition_month date not null,

  -- Status
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'winner', 'runner_up')),

  -- Voting
  vote_count int default 0,

  -- Metadata
  camera_info text,
  created_at timestamptz default now()
);

-- Add foreign key constraints after photo_entries exists
alter table public.photo_competitions
  add constraint fk_winner foreign key (winner_id) references public.photo_entries(id),
  add constraint fk_runner_up foreign key (runner_up_id) references public.photo_entries(id);

-- Photo votes (one per user per photo)
create table if not exists public.photo_votes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  photo_id uuid references public.photo_entries(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, photo_id)
);

-- =====================================================
-- 2. COMMUNITY REPORTS
-- =====================================================

-- Community reports
create table if not exists public.reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),

  -- What it's about
  report_type text not null check (report_type in (
    'shop_closed',
    'wrong_hours',
    'wrong_info',
    'new_shop',
    'event_suggestion',
    'local_tip',
    'issue',
    'other'
  )),

  -- Context
  shop_id uuid references public.shops(id),
  title text not null,
  description text not null,

  -- Optional proof
  image_url text,

  -- Status
  status text default 'pending' check (status in ('pending', 'reviewing', 'resolved', 'rejected')),
  admin_notes text,
  resolved_at timestamptz,

  -- Gamification
  was_helpful boolean,

  created_at timestamptz default now()
);

-- Track user contributions for gamification
create table if not exists public.user_contributions (
  user_id uuid references public.profiles(id) primary key,
  reports_submitted int default 0,
  reports_helpful int default 0,
  reviews_written int default 0,
  photos_submitted int default 0,
  photos_approved int default 0,
  photos_won int default 0,
  questions_answered int default 0,
  answers_accepted int default 0,
  contribution_score int default 0,
  badge text default 'newcomer' check (badge in ('newcomer', 'contributor', 'regular', 'local_expert', 'whitstable_legend')),
  updated_at timestamptz default now()
);

-- =====================================================
-- 3. CHARITY & FUNDRAISING HUB
-- =====================================================

-- Local charities/causes
create table if not exists public.charities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  website text,

  -- Fundraising
  donation_url text,
  current_campaign text,
  target_amount decimal(10,2),
  raised_amount decimal(10,2) default 0,

  -- Status
  is_active boolean default true,
  is_featured boolean default false,

  created_at timestamptz default now()
);

-- Fundraising events
create table if not exists public.charity_events (
  id uuid default uuid_generate_v4() primary key,
  charity_id uuid references public.charities(id),

  title text not null,
  description text,
  date date not null,
  time_start time,
  time_end time,
  location text,

  -- Participation
  signup_url text,
  max_participants int,
  current_participants int default 0,

  -- Type
  event_type text check (event_type in ('cleanup', 'fundraiser', 'volunteer', 'awareness', 'other')),

  is_active boolean default true,
  created_at timestamptz default now()
);

-- Shop charity partnerships
create table if not exists public.shop_charity_links (
  id uuid default uuid_generate_v4() primary key,
  shop_id uuid references public.shops(id) on delete cascade,
  charity_id uuid references public.charities(id) on delete cascade,

  partnership_type text,
  description text,

  is_active boolean default true,
  created_at timestamptz default now(),

  unique(shop_id, charity_id)
);

-- =====================================================
-- 4. WEEKLY DIGEST & NOTIFICATIONS
-- =====================================================

-- User notification preferences
create table if not exists public.notification_preferences (
  user_id uuid references public.profiles(id) primary key,

  -- Email preferences
  weekly_digest boolean default true,
  new_reviews_on_saved boolean default true,
  competition_reminders boolean default true,
  event_reminders boolean default true,

  -- Push preferences
  push_enabled boolean default false,

  updated_at timestamptz default now()
);

-- Notification log
create table if not exists public.notification_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  notification_type text not null,
  subject text,
  sent_at timestamptz default now()
);

-- Weekly digest content (pre-generated)
create table if not exists public.weekly_digest (
  id uuid default uuid_generate_v4() primary key,
  week_start date not null unique,

  -- Content (JSON blobs)
  new_shops jsonb,
  trending_shops jsonb,
  new_reviews_count int,
  photo_competition_status text,
  upcoming_events jsonb,
  featured_content jsonb,

  generated_at timestamptz default now()
);

-- =====================================================
-- 5. SHOP LEADERBOARD & GAMIFICATION
-- =====================================================

-- Shop weekly stats
create table if not exists public.shop_weekly_stats (
  id uuid default uuid_generate_v4() primary key,
  shop_id uuid references public.shops(id) on delete cascade,
  week_start date not null,

  views int default 0,
  saves int default 0,
  reviews int default 0,
  photo_tags int default 0,
  direction_clicks int default 0,
  call_clicks int default 0,

  -- Calculated
  engagement_score int default 0,
  rank int,
  rank_change int,

  created_at timestamptz default now(),
  unique(shop_id, week_start)
);

-- Shop achievements/badges
create table if not exists public.shop_badges (
  id uuid default uuid_generate_v4() primary key,
  shop_id uuid references public.shops(id) on delete cascade,
  badge_type text not null,
  awarded_at timestamptz default now(),

  unique(shop_id, badge_type)
);

-- =====================================================
-- 6. LOCAL DEALS & OFFERS
-- =====================================================

create table if not exists public.offers (
  id uuid default uuid_generate_v4() primary key,
  shop_id uuid references public.shops(id) on delete cascade,

  title text not null,
  description text,

  -- Validity
  valid_from date not null,
  valid_until date,
  is_ongoing boolean default false,

  -- Terms
  terms text,

  -- Type
  offer_type text check (offer_type in ('discount', 'freebie', 'bundle', 'loyalty', 'event', 'other')),

  -- Status
  is_active boolean default true,

  -- Tracking
  view_count int default 0,

  created_at timestamptz default now()
);

-- =====================================================
-- 7. ASK A LOCAL
-- =====================================================

create table if not exists public.questions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),

  question text not null,
  context text,

  -- Status
  status text default 'open' check (status in ('open', 'answered', 'closed')),

  -- Counts
  answer_count int default 0,
  view_count int default 0,

  created_at timestamptz default now()
);

create table if not exists public.answers (
  id uuid default uuid_generate_v4() primary key,
  question_id uuid references public.questions(id) on delete cascade,
  user_id uuid references public.profiles(id),

  answer text not null,

  -- Voting
  upvotes int default 0,
  is_accepted boolean default false,

  created_at timestamptz default now()
);

create table if not exists public.answer_votes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  answer_id uuid references public.answers(id) on delete cascade,
  vote int check (vote in (1, -1)),
  unique(user_id, answer_id)
);

-- =====================================================
-- 8. SEASONAL CAMPAIGNS
-- =====================================================

create table if not exists public.campaigns (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  title text not null,
  description text,

  -- Dates
  start_date date not null,
  end_date date not null,

  -- Content
  hero_image_url text,
  content jsonb,

  -- Type
  campaign_type text check (campaign_type in ('awards', 'guide', 'competition', 'seasonal')),

  -- Status
  is_active boolean default true,

  created_at timestamptz default now()
);

-- Campaign votes (for awards)
create table if not exists public.campaign_votes (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  category text not null,
  shop_id uuid references public.shops(id) on delete cascade,
  created_at timestamptz default now(),
  unique(campaign_id, user_id, category)
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (is_public = true);
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Shops
alter table public.shops enable row level security;
create policy "Shops are viewable by everyone" on public.shops for select using (is_active = true);

-- Events
alter table public.events enable row level security;
create policy "Events are viewable by everyone" on public.events for select using (is_active = true);

-- Reviews
alter table public.reviews enable row level security;
create policy "Reviews are viewable by everyone" on public.reviews for select using (true);
create policy "Users can insert own reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews" on public.reviews for update using (auth.uid() = user_id);
create policy "Users can delete own reviews" on public.reviews for delete using (auth.uid() = user_id);

-- Saved shops
alter table public.saved_shops enable row level security;
create policy "Users can view own saved shops" on public.saved_shops for select using (auth.uid() = user_id);
create policy "Users can save shops" on public.saved_shops for insert with check (auth.uid() = user_id);
create policy "Users can unsave shops" on public.saved_shops for delete using (auth.uid() = user_id);

-- Visited shops
alter table public.visited_shops enable row level security;
create policy "Users can view own visited shops" on public.visited_shops for select using (auth.uid() = user_id);
create policy "Users can mark shops visited" on public.visited_shops for insert with check (auth.uid() = user_id);
create policy "Users can remove visited marks" on public.visited_shops for delete using (auth.uid() = user_id);

-- Photo entries
alter table public.photo_entries enable row level security;
create policy "Approved photos are public" on public.photo_entries for select using (status != 'pending' and status != 'rejected');
create policy "Users can view own pending photos" on public.photo_entries for select using (auth.uid() = user_id);
create policy "Users can submit photos" on public.photo_entries for insert with check (auth.uid() = user_id);
create policy "Users can delete own photos" on public.photo_entries for delete using (auth.uid() = user_id);

-- Photo votes
alter table public.photo_votes enable row level security;
create policy "Vote counts are public" on public.photo_votes for select using (true);
create policy "Users can vote" on public.photo_votes for insert with check (auth.uid() = user_id);
create policy "Users can remove own vote" on public.photo_votes for delete using (auth.uid() = user_id);

-- Photo competitions
alter table public.photo_competitions enable row level security;
create policy "Competitions are public" on public.photo_competitions for select using (true);

-- Reports
alter table public.reports enable row level security;
create policy "Users can submit reports" on public.reports for insert with check (auth.uid() = user_id);
create policy "Users can view own reports" on public.reports for select using (auth.uid() = user_id);

-- User contributions
alter table public.user_contributions enable row level security;
create policy "Contributions are public" on public.user_contributions for select using (true);
create policy "System can update contributions" on public.user_contributions for all using (true);

-- Charities
alter table public.charities enable row level security;
create policy "Charities are public" on public.charities for select using (is_active = true);

-- Charity events
alter table public.charity_events enable row level security;
create policy "Charity events are public" on public.charity_events for select using (is_active = true);

-- Shop charity links
alter table public.shop_charity_links enable row level security;
create policy "Shop charity links are public" on public.shop_charity_links for select using (is_active = true);

-- Notification preferences
alter table public.notification_preferences enable row level security;
create policy "Users can view own preferences" on public.notification_preferences for select using (auth.uid() = user_id);
create policy "Users can update own preferences" on public.notification_preferences for update using (auth.uid() = user_id);
create policy "Users can insert own preferences" on public.notification_preferences for insert with check (auth.uid() = user_id);

-- Shop weekly stats
alter table public.shop_weekly_stats enable row level security;
create policy "Stats are public" on public.shop_weekly_stats for select using (true);

-- Shop badges
alter table public.shop_badges enable row level security;
create policy "Badges are public" on public.shop_badges for select using (true);

-- Offers
alter table public.offers enable row level security;
create policy "Active offers are public" on public.offers for select using (is_active = true);

-- Questions
alter table public.questions enable row level security;
create policy "Questions are public" on public.questions for select using (true);
create policy "Users can ask questions" on public.questions for insert with check (auth.uid() = user_id);
create policy "Users can update own questions" on public.questions for update using (auth.uid() = user_id);

-- Answers
alter table public.answers enable row level security;
create policy "Answers are public" on public.answers for select using (true);
create policy "Users can answer questions" on public.answers for insert with check (auth.uid() = user_id);
create policy "Users can update own answers" on public.answers for update using (auth.uid() = user_id);

-- Answer votes
alter table public.answer_votes enable row level security;
create policy "Votes are public" on public.answer_votes for select using (true);
create policy "Users can vote on answers" on public.answer_votes for insert with check (auth.uid() = user_id);
create policy "Users can change own votes" on public.answer_votes for update using (auth.uid() = user_id);
create policy "Users can remove own votes" on public.answer_votes for delete using (auth.uid() = user_id);

-- Campaigns
alter table public.campaigns enable row level security;
create policy "Active campaigns are public" on public.campaigns for select using (is_active = true);

-- Campaign votes
alter table public.campaign_votes enable row level security;
create policy "Users can vote in campaigns" on public.campaign_votes for insert with check (auth.uid() = user_id);
create policy "Users can view own votes" on public.campaign_votes for select using (auth.uid() = user_id);

-- Weekly digest
alter table public.weekly_digest enable row level security;
create policy "Digests are public" on public.weekly_digest for select using (true);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update vote count on photo when vote is added/removed
create or replace function update_photo_vote_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.photo_entries
    set vote_count = vote_count + 1
    where id = NEW.photo_id;
  elsif TG_OP = 'DELETE' then
    update public.photo_entries
    set vote_count = vote_count - 1
    where id = OLD.photo_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_photo_vote
after insert or delete on public.photo_votes
for each row execute function update_photo_vote_count();

-- Update answer vote count
create or replace function update_answer_vote_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.answers
    set upvotes = upvotes + NEW.vote
    where id = NEW.answer_id;
  elsif TG_OP = 'DELETE' then
    update public.answers
    set upvotes = upvotes - OLD.vote
    where id = OLD.answer_id;
  elsif TG_OP = 'UPDATE' then
    update public.answers
    set upvotes = upvotes - OLD.vote + NEW.vote
    where id = NEW.answer_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_answer_vote
after insert or update or delete on public.answer_votes
for each row execute function update_answer_vote_count();

-- Update answer count on question
create or replace function update_question_answer_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.questions
    set answer_count = answer_count + 1,
        status = case when status = 'open' then 'answered' else status end
    where id = NEW.question_id;
  elsif TG_OP = 'DELETE' then
    update public.questions
    set answer_count = answer_count - 1
    where id = OLD.question_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_answer
after insert or delete on public.answers
for each row execute function update_question_answer_count();

-- Update user contributions
create or replace function update_user_contributions()
returns trigger as $$
begin
  -- Ensure user_contributions row exists
  insert into public.user_contributions (user_id)
  values (coalesce(NEW.user_id, OLD.user_id))
  on conflict (user_id) do nothing;

  -- Update based on table and operation
  if TG_TABLE_NAME = 'reports' then
    if TG_OP = 'INSERT' then
      update public.user_contributions
      set reports_submitted = reports_submitted + 1,
          contribution_score = contribution_score + 5
      where user_id = NEW.user_id;
    end if;
  elsif TG_TABLE_NAME = 'reviews' then
    if TG_OP = 'INSERT' then
      update public.user_contributions
      set reviews_written = reviews_written + 1,
          contribution_score = contribution_score + 10
      where user_id = NEW.user_id;
    end if;
  elsif TG_TABLE_NAME = 'photo_entries' then
    if TG_OP = 'INSERT' then
      update public.user_contributions
      set photos_submitted = photos_submitted + 1,
          contribution_score = contribution_score + 5
      where user_id = NEW.user_id;
    end if;
  elsif TG_TABLE_NAME = 'answers' then
    if TG_OP = 'INSERT' then
      update public.user_contributions
      set questions_answered = questions_answered + 1,
          contribution_score = contribution_score + 10
      where user_id = NEW.user_id;
    end if;
  end if;

  return null;
end;
$$ language plpgsql security definer;

create trigger on_report_contribution
after insert on public.reports
for each row execute function update_user_contributions();

create trigger on_review_contribution
after insert on public.reviews
for each row execute function update_user_contributions();

create trigger on_photo_contribution
after insert on public.photo_entries
for each row execute function update_user_contributions();

create trigger on_answer_contribution
after insert on public.answers
for each row execute function update_user_contributions();

-- Update badge based on contribution score
create or replace function update_user_badge()
returns trigger as $$
begin
  NEW.badge = case
    when NEW.contribution_score >= 500 and NEW.photos_won > 0 then 'whitstable_legend'
    when NEW.contribution_score >= 250 then 'local_expert'
    when NEW.contribution_score >= 100 or NEW.photos_approved >= 5 then 'regular'
    when NEW.reports_helpful >= 3 or NEW.contribution_score >= 30 then 'contributor'
    else 'newcomer'
  end;
  return NEW;
end;
$$ language plpgsql;

create trigger on_contribution_update
before update on public.user_contributions
for each row execute function update_user_badge();

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (NEW.id, NEW.email, split_part(NEW.email, '@', 1));

  insert into public.user_contributions (user_id)
  values (NEW.id);

  insert into public.notification_preferences (user_id)
  values (NEW.id);

  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- Calculate engagement score
create or replace function calculate_engagement_score(
  p_views int,
  p_saves int,
  p_reviews int,
  p_photo_tags int,
  p_direction_clicks int,
  p_call_clicks int
) returns int as $$
begin
  return (
    p_views * 1 +
    p_saves * 10 +
    p_reviews * 25 +
    p_photo_tags * 15 +
    p_direction_clicks * 5 +
    p_call_clicks * 5
  );
end;
$$ language plpgsql;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

create index if not exists idx_shops_category on public.shops(category);
create index if not exists idx_shops_slug on public.shops(slug);
create index if not exists idx_events_start_date on public.events(start_date);
create index if not exists idx_reviews_shop on public.reviews(shop_id);
create index if not exists idx_reviews_user on public.reviews(user_id);
create index if not exists idx_photo_entries_month on public.photo_entries(competition_month);
create index if not exists idx_photo_entries_status on public.photo_entries(status);
create index if not exists idx_photo_votes_photo on public.photo_votes(photo_id);
create index if not exists idx_reports_status on public.reports(status);
create index if not exists idx_offers_shop on public.offers(shop_id);
create index if not exists idx_offers_active on public.offers(is_active, valid_until);
create index if not exists idx_questions_status on public.questions(status);
create index if not exists idx_answers_question on public.answers(question_id);
create index if not exists idx_shop_weekly_stats_week on public.shop_weekly_stats(week_start);
