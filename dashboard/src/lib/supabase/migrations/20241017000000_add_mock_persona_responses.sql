-- Migration: Add mock data to persona_responses table
-- Description: Creates a function to insert 30 rows of mock COVID-19 responses
-- Date: 2024-10-17

-- Create function to insert mock data
create or replace function public.add_mock_persona_responses()
returns void as $$
declare
  covid_responses text[] := array[
    'COVID-19 is caused by the SARS-CoV-2 virus.',
    'The first cases of COVID-19 were reported in Wuhan, China in December 2019.',
    'Common symptoms include fever, cough, and shortness of breath.',
    'COVID-19 vaccines have been developed to help prevent severe illness.',
    'Social distancing and mask-wearing can help reduce the spread of COVID-19.',
    'The virus primarily spreads through respiratory droplets.',
    'Some people with COVID-19 may be asymptomatic but still contagious.',
    'COVID-19 was declared a pandemic by the WHO in March 2020.',
    'The virus can survive on surfaces for several hours to days.',
    'Older adults and those with underlying health conditions are at higher risk.',
    'Many countries implemented lockdowns to slow the spread of COVID-19.',
    'COVID-19 testing methods include PCR and antigen tests.',
    'Long COVID refers to symptoms that persist weeks or months after infection.',
    'COVID-19 has caused significant economic disruption worldwide.',
    'The delta and omicron variants spread more easily than the original virus.',
    'Handwashing is an important prevention measure against COVID-19.',
    'COVID-19 can affect multiple organ systems in severe cases.',
    'Ventilators may be necessary for patients with severe respiratory symptoms.',
    'Vaccination campaigns began in late 2020 and early 2021.',
    'Some studies suggest COVID-19 may have neurological effects.',
    'Contact tracing has been used to track and prevent virus spread.',
    'Quarantine periods help prevent infected individuals from spreading the virus.',
    'The pandemic has accelerated adoption of remote work and telemedicine.',
    'Multiple waves of infection have occurred in many countries.',
    'COVID-19 death rates vary by region, age group, and time period.',
    'Antibody tests can determine if someone has previously had COVID-19.',
    'Public health measures have evolved as understanding of the virus improved.',
    'Herd immunity is achieved when a large portion of the population becomes immune.',
    'Travel restrictions were implemented to limit cross-border transmission.',
    'COVID-19 has highlighted healthcare disparities in many countries.'
  ];
  i integer;
begin
  -- Insert 30 random mock responses
  for i in 1..30 loop
    insert into public.persona_responses (
      persona_id,
      answer_time,
      response,
      is_real,
      is_fact,
      took_covid_vaccine,
      vaccine_recommendation_rating,
      vaccine_attitude_score
    ) values (
      -- Random persona_id between 1 and 5
      floor(random() * 5 + 1)::int,
      
      -- Random timestamp within the last 30 days
      now() - (random() * interval '30 days'),
      
      -- Random response from our array
      covid_responses[floor(random() * array_length(covid_responses, 1) + 1)],
      
      -- Random boolean for is_real
      (random() > 0.5),
      
      -- Random boolean for is_fact
      (random() > 0.5),
      
      -- Random boolean for took_covid_vaccine
      (random() > 0.3),
      
      -- Random Likert scale rating between 1 and 5
      floor(random() * 5 + 1)::smallint,
      
      -- Random vaccine attitude score (0.00 to 10.00)
      (random() * 10)::numeric(5,2)
    );
  end loop;
end;
$$ language plpgsql;

-- Execute the function to insert the mock data
select public.add_mock_persona_responses();

-- Comment on function
comment on function public.add_mock_persona_responses() is 'Function to generate 30 mock COVID-19 responses for testing';

-- Add an option to drop the function if needed (commented out by default)
-- drop function if exists public.add_mock_persona_responses(); 