-- Migration: Create persona_responses table
-- Description: Creates a table to store persona responses with validation and RLS policies
-- Date: 2024-10-16

-- create the table
create table if not exists public.persona_responses (
  id uuid primary key default gen_random_uuid(),
  persona_id int not null,
  answer_time timestamp with time zone default now(),
  response text not null,
  is_real boolean not null,
  is_fact boolean not null,
  took_covid_vaccine boolean,
  vaccine_recommendation_rating smallint check (vaccine_recommendation_rating between 1 and 5),
  vaccine_attitude_score numeric(5,2)
);

-- enable row level security
alter table public.persona_responses enable row level security;

-- comments
comment on table public.persona_responses is 'Table to store persona responses';
comment on column public.persona_responses.id is 'Primary key for the persona response';
comment on column public.persona_responses.persona_id is 'Foreign key to the persona';
comment on column public.persona_responses.answer_time is 'Timestamp when the answer was recorded';
comment on column public.persona_responses.response is 'The text response content';
comment on column public.persona_responses.is_real is 'Flag indicating if the response is real';
comment on column public.persona_responses.is_fact is 'Flag indicating if the response contains factual information';
comment on column public.persona_responses.took_covid_vaccine is 'Binary decision (Yes/No) on whether the persona took the COVID-19 vaccine';
comment on column public.persona_responses.vaccine_recommendation_rating is 'Likert scale rating (1-5) on how likely the persona is to recommend the vaccine to others';
comment on column public.persona_responses.vaccine_attitude_score is 'Ranked or probabilistic attitude score regarding vaccine sentiment';

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