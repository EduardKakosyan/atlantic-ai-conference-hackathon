-- Migration: Create persona_responses table
-- Description: Creates a table to store persona responses with validation and RLS policies
-- Date: 2024-10-16

-- create the table
create table if not exists public.persona_responses (
  id uuid primary key default gen_random_uuid(),
  persona_id int not null,
  persona_name text not null,
  iteration int not null check (iteration >= 1 and iteration <= 10), 
  current_rating numeric(3,1) check (current_rating >= 1 and current_rating <= 4),
  normalized_current_rating numeric(7,6) check (normalized_current_rating >= 0 and normalized_current_rating <= 1),
  recommened_rating numeric(3,1) check (recommened_rating >= 1 and recommened_rating <= 4),
  normalized_recommened_rating numeric(7,6) check (normalized_recommened_rating >= 0 and normalized_recommened_rating <= 1),
  reaction text check (reaction in ('Positive', 'Negative')),
  reason text,
  editor_changes text,
  article text,
  is_fake boolean not null,
  is_real boolean not null
);

-- enable row level security
alter table public.persona_responses enable row level security;

-- comments
comment on table public.persona_responses is 'Table to store persona responses';
comment on column public.persona_responses.id is 'Primary key for the persona response (self generated uuid)';
comment on column public.persona_responses.persona_id is 'Foreign key to the persona';
comment on column public.persona_responses.persona_name is 'Name of the persona';
comment on column public.persona_responses.iteration is 'Number of iteration (1 to 10)';
comment on column public.persona_responses.current_rating is 'Rating from 1 to 4 (can include decimals like 3.5)';
comment on column public.persona_responses.normalized_current_rating is 'Normalized rating from 0 to 1 (includes decimal values up to 6 decimal places)';
comment on column public.persona_responses.recommened_rating is 'Recommended rating from 1 to 4 (can include decimals like 3.5)';
comment on column public.persona_responses.normalized_recommened_rating is 'Normalized recommended rating from 0 to 1 (includes decimal values up to 6 decimal places)';
comment on column public.persona_responses.reaction is 'Reaction to the article, either "Positive" or "Negative"';
comment on column public.persona_responses.reason is 'Reason for the reaction';
comment on column public.persona_responses.editor_changes is 'Changes made by the editor';
comment on column public.persona_responses.article is 'Text to store article content';
comment on column public.persona_responses.is_fake is 'Flag indicating if the response is fake';
comment on column public.persona_responses.is_real is 'Flag indicating if the response is real';

-- create policies

-- policy for anon users to select
create policy "Allow anonymous users to read persona responses"
  on public.persona_responses
  for select
  to anon
  using (true);

-- policy for authenticated users to select
create policy "Allow authenticated users to read persona responses"
  on public.persona_responses
  for select
  to authenticated
  using (true);

-- policy for authenticated users to insert
create policy "Allow authenticated users to insert persona responses"
  on public.persona_responses
  for insert
  to authenticated
  with check (true);

-- policy for authenticated users to update
create policy "Allow authenticated users to update persona responses"
  on public.persona_responses
  for update
  to authenticated
  using (true)
  with check (true);

-- policy for authenticated users to delete
create policy "Allow authenticated users to delete persona responses"
  on public.persona_responses
  for delete
  to authenticated
  using (true); 