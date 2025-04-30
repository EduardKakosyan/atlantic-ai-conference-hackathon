-- Migration: Add mock persona responses
-- Description: Inserts mock data for 5 different personas with varying iterations
-- Date: 2024-10-16

INSERT INTO public.persona_responses (
  id, persona_id, persona_name, iteration, 
  current_rating, normalized_current_rating, 
  recommened_rating, normalized_recommened_rating, 
  reaction, reason, editor_changes, article, is_fake, is_real
) VALUES
-- Persona 1: Brian (anti-vaccine, skeptical)
-- Iteration 1
(
  gen_random_uuid(), 1, 'Brian', 1,
  1.0, 0.0, 1.5, 0.166667,
  'Negative',
  'Brian is skeptical about the information presented in the article because it comes from health authorities, towards whom he nurtures a level of distrust. As an individual who values personal risk assessment and individual liberty, he wouldn''t be easily swayed by claims of strong protection offered by COVID-19 vaccines. His previous experiences and beliefs have led him to question the effectiveness of repeated COVID-19 boosters.',
  'In response to Brian''s skepticism, we''re adopting a tone that respects his autonomy while gently offering alternative perspectives.',
  'Recent studies have shown that COVID-19 vaccines provide protection against severe illness. The data from health authorities indicates that vaccinated individuals are less likely to require hospitalization compared to unvaccinated individuals.',
  false, true
),
-- Iteration 2
(
  gen_random_uuid(), 1, 'Brian', 2,
  1.2, 0.066667, 1.7, 0.233333,
  'Negative',
  'Brian remains highly skeptical of the article''s claims. He feels that the information is still coming from sources he doesn''t trust, and the article doesn''t address his specific concerns about potential long-term effects of vaccines. He also questions whether the data has been selectively presented to support a pro-vaccine narrative.',
  'We''ve begun acknowledging some limitations in current research while maintaining factual accuracy about vaccine benefits. We''re also shifting away from authority-based claims to focus more on the data itself.',
  'Studies tracking vaccine outcomes have found that protection against severe COVID-19 illness persists even as protection against infection may wane. While research continues on long-term effects, current safety monitoring has not identified significant concerns in populations followed for over a year post-vaccination.',
  false, true
),
-- Iteration 3
(
  gen_random_uuid(), 1, 'Brian', 3,
  1.4, 0.133333, 1.8, 0.266667,
  'Negative',
  'Brian acknowledges some of the information provided but remains unconvinced. He appreciates the slightly more balanced approach but still feels that the article underplays potential risks and overstates benefits. He wants to see more acknowledgment of individual choice and risk assessment rather than general recommendations.',
  'We''re further reducing reliance on authority-based messaging and introducing more information about how individuals might assess their personal risk-benefit ratio.',
  'COVID-19 vaccines have shown effectiveness against severe outcomes in most population groups. Individuals may want to consider factors such as their age, health status, and exposure risk when evaluating vaccination. While most side effects resolve quickly, monitoring systems continue to track outcomes across diverse populations.',
  false, true
),
-- Iteration 4
(
  gen_random_uuid(), 1, 'Brian', 4,
  1.6, 0.200000, 2.0, 0.333333,
  'Negative',
  'Brian still has significant reservations but notices the article is beginning to present a more nuanced view. He remains concerned about what he perceives as downplaying of adverse events and questions whether natural immunity is being given sufficient consideration as an alternative approach.',
  'We''ve incorporated more information about the body''s natural immune response while maintaining scientific accuracy, and have acknowledged both benefits and limitations more explicitly.',
  'Both vaccination and natural infection stimulate immune responses against COVID-19. Vaccine clinical trials measured outcomes across diverse participants, documenting both effectiveness rates and potential side effects. Safety monitoring systems have tracked rare adverse events, which occur at significantly lower rates than serious complications from COVID-19 infection itself.',
  false, true
),
-- Iteration 5
(
  gen_random_uuid(), 1, 'Brian', 5,
  1.8, 0.266667, 2.2, 0.400000,
  'Negative',
  'Brian continues to be skeptical but is beginning to consider alternative viewpoints. He still has concerns about potential side effects and questions the need for boosters given his good health. He values personal choice and remains cautious about accepting recommendations from health authorities.',
  'We''ve adjusted the article to include more data points and acknowledge concerns about side effects, while emphasizing the scientific process and transparency of clinical trials.',
  'Clinical trials have demonstrated that COVID-19 vaccines are generally safe for most individuals. While side effects may occur, they are typically mild and short-lived. Research continues to monitor long-term outcomes, with data so far showing favorable safety profiles.',
  false, true
),
-- Iteration 6
(
  gen_random_uuid(), 1, 'Brian', 6,
  2.0, 0.333333, 2.4, 0.466667,
  'Negative',
  'Brian is becoming more receptive to the information as it acknowledges more of his concerns. He appreciates the balanced presentation of both benefits and potential drawbacks. However, he still wants more emphasis on personal choice rather than universal recommendations.',
  'We''ve shifted the article to focus more on empowering individual decision-making rather than making blanket recommendations, while still providing accurate scientific information.',
  'Individuals face different levels of risk from COVID-19 based on factors like age and health status. Similarly, vaccine experiences vary between people. Current data shows serious adverse events are rare, occurring at rates of less than 1 in 100,000 doses, while COVID-19 hospitalization risks for unvaccinated adults range from 1-5% depending on age and health factors. These comparisons may help in personal decision-making.',
  false, true
),
-- Iteration 7
(
  gen_random_uuid(), 1, 'Brian', 7,
  2.2, 0.400000, 2.6, 0.533333,
  'Negative',
  'Brian finds the revised article more balanced and appreciates the acknowledgment of individual risk assessment. He still has some reservations but is more willing to consider the information presented now that it respects his autonomy and addresses some of his concerns about oversimplification.',
  'We''ve continued to refine the approach by providing more granular data about risk-benefit ratios for different demographic groups while emphasizing personal agency.',
  'COVID-19 affects different populations with varying levels of severity. For adults under 50 without underlying conditions, the risk of severe outcomes from infection is lower but still present. Vaccine protection against severe disease ranges from 70-90% depending on timing and variants. Both vaccination decisions and alternative protective measures involve weighing personal circumstances and values.',
  false, true
),
-- Iteration 8
(
  gen_random_uuid(), 1, 'Brian', 8,
  2.3, 0.433333, 2.8, 0.600000,
  'Negative',
  'Brian is increasingly receptive to the information as it continues to present a balanced view that respects his values of personal liberty and informed choice. He appreciates the acknowledgment of both benefits and limitations without making him feel pressured into a specific decision.',
  'We''ve refined the content to further emphasize transparency about both what is known and unknown in current research, while providing tools for individual risk assessment.',
  'Current research indicates vaccines can reduce risk of severe COVID-19 outcomes, though effectiveness varies by individual factors. Some questions about long-term immunity remain under study. When making health decisions, considering your specific risk factors, personal health history, and values can help determine which protective strategies make the most sense for your situation.',
  false, true
),
-- Iteration 9
(
  gen_random_uuid(), 1, 'Brian', 9,
  2.5, 0.500000, 3.0, 0.666667,
  'Negative',
  'After multiple iterations, Brian is more open to considering the benefits of vaccination, though he maintains that individual risk assessment is crucial. He appreciates information that acknowledges both potential benefits and risks, allowing him to make an informed decision based on his personal health situation.',
  'The final approach respects Brian''s desire for autonomy while providing balanced information about both benefits and risks, emphasizing personal risk assessment rather than universal recommendations.',
  'COVID-19 vaccination offers varying levels of protection depending on individual factors such as age, health status, and underlying conditions. While studies show benefits for reducing severe outcomes, individuals should consider their personal risk profile when making health decisions. Both vaccination and non-pharmaceutical interventions play roles in personal and public health strategies.',
  false, true
),

-- Persona 2: Sarah (pro-vaccine, medical professional)
-- Iteration 1
(
  gen_random_uuid(), 2, 'Sarah', 1,
  3.2, 0.733333, 3.5, 0.833333,
  'Positive',
  'As a medical professional, Sarah appreciates evidence-based information about vaccines. She finds the article credible and aligns with her understanding of vaccine efficacy. However, she feels the article could include more detailed scientific data to strengthen its messaging.',
  'We''ll enhance the scientific content and include more specific data points to appeal to Sarah''s medical background.',
  'COVID-19 vaccines have demonstrated efficacy in reducing hospitalizations according to recent clinical trials. Initial studies indicate a significant reduction in severe outcomes among vaccinated populations.',
  false, true
),
-- Iteration 2
(
  gen_random_uuid(), 2, 'Sarah', 2,
  3.5, 0.833333, 3.8, 0.933333,
  'Positive',
  'Sarah is pleased with the additional scientific details but would appreciate even more specific data about efficacy rates and confidence intervals. As someone who communicates with patients daily, she wants information that can help address specific concerns raised by vaccine-hesitant individuals.',
  'We''ve added more specific efficacy data and begun addressing common concerns that Sarah might encounter when discussing vaccines with patients.',
  'Phase 3 clinical trials showed COVID-19 vaccines reduced symptomatic disease by approximately 94-95% in initial studies. Subsequent real-world data has confirmed strong protection against severe outcomes, with effectiveness against hospitalization remaining around 85-90% across most age groups. Safety monitoring has identified rare adverse events at rates significantly lower than complications from COVID-19 infection.',
  false, true
),
-- Iteration 3
(
  gen_random_uuid(), 2, 'Sarah', 3,
  3.8, 0.933333, 4.0, 1.000000,
  'Positive',
  'Sarah is very satisfied with the revised content that includes specific efficacy data and addresses potential concerns with scientific evidence. As a healthcare provider, she finds this information valuable for communicating with her patients about vaccine benefits.',
  'We''ve incorporated more specific clinical trial data and efficacy statistics to provide the level of detail Sarah appreciates as a medical professional.',
  'Phase 3 clinical trials involving over 40,000 participants showed COVID-19 vaccines reduced the risk of symptomatic infection by 94-95%. Recent meta-analyses confirm these findings, with vaccinated individuals showing 87% lower risk of hospitalization across all age groups. These results remain consistent across multiple variants, though with some reduced efficacy against newer strains.',
  false, true
),

-- Persona 3: Michael (initially hesitant but open-minded)
-- Iteration 1
(
  gen_random_uuid(), 3, 'Michael', 1,
  2.0, 0.333333, 2.5, 0.500000,
  'Negative',
  'Michael is hesitant about vaccines but willing to learn more. He has heard conflicting information from friends and social media, making him uncertain about what to believe. He values transparent information that acknowledges uncertainties rather than making absolute claims.',
  'We''ll focus on providing balanced information that acknowledges both benefits and limitations of vaccines while addressing common concerns.',
  'COVID-19 vaccines have been developed to reduce the risk of severe disease. While no vaccine is 100% effective, clinical trials have shown promising results in preventing hospitalizations. Side effects are generally mild to moderate and temporary.',
  false, true
),
-- Iteration 2
(
  gen_random_uuid(), 3, 'Michael', 2,
  2.3, 0.433333, 2.7, 0.566667,
  'Negative',
  'Michael appreciates the balanced approach but still has questions about how vaccines work and potential long-term effects. He feels more comfortable with information that acknowledges areas of uncertainty while still providing clear facts about what is currently known.',
  'We''ve added more explanation about vaccine technology and development process while maintaining a balanced approach that acknowledges both what is known and what is still being studied.',
  'COVID-19 vaccines work by training the immune system to recognize and respond to the virus without causing the disease. Clinical trials with tens of thousands of participants preceded authorization, with safety monitoring continuing afterward. Most side effects appear within days of vaccination and resolve quickly. Long-term studies continue, with no concerning patterns identified in populations followed for over a year.',
  false, true
),
-- Iteration 3
(
  gen_random_uuid(), 3, 'Michael', 3,
  2.5, 0.500000, 3.0, 0.666667,
  'Negative',
  'Michael appreciates the more balanced approach that acknowledges both benefits and limitations. He still has some questions but feels the information is more trustworthy because it doesn''t oversimplify the complex reality of vaccine science.',
  'We''ve adjusted the content to be more transparent about what is known and unknown, while still presenting the scientific consensus on vaccine benefits.',
  'Research shows COVID-19 vaccines significantly reduce severe outcomes, though effectiveness varies by age, health status, and variant. Most side effects resolve within days, with serious adverse events being rare. Ongoing studies continue to monitor long-term safety profiles, with data so far showing favorable results.',
  false, true
),
-- Iteration 4
(
  gen_random_uuid(), 3, 'Michael', 4,
  2.8, 0.600000, 3.2, 0.733333,
  'Positive',
  'Michael is becoming more confident in the information as it continues to present a balanced view. He appreciates the transparent discussion of both benefits and limitations, which helps him feel that he''s getting the full picture rather than a one-sided view.',
  'We''ve refined the content to include more specific data while maintaining the balanced, transparent approach that Michael responds well to.',
  'Clinical trials and real-world studies show COVID-19 vaccines reduce hospitalization risk by approximately 80-90%. While breakthrough infections can occur, they typically result in milder symptoms. The global safety monitoring system has identified rare adverse events like myocarditis (occurring in about 4 per million doses), which is significantly lower than the risk from COVID-19 infection itself (about 11 per 100,000 cases).',
  false, true
),
-- Iteration 5
(
  gen_random_uuid(), 3, 'Michael', 5,
  3.2, 0.733333, 3.5, 0.833333,
  'Positive',
  'Michael now feels considerably more confident about vaccine information. The transparent communication about both benefits and risks has helped build his trust. He particularly values the specific comparisons between vaccine risks and COVID-19 risks, which put the information in meaningful context.',
  'We''ve further enhanced the content with specific comparative risk data while maintaining the transparent, balanced approach that has been effective with Michael.',
  'Research comparing outcomes between vaccinated and unvaccinated populations shows significant protection against severe COVID-19. In adults 18-49, vaccination reduces hospitalization risk by approximately 85%. While vaccines, like all medical interventions, carry some risks, safety monitoring across billions of doses shows serious adverse events are rare—generally occurring at rates 10-100 times lower than the same complications following COVID-19 infection.',
  false, true
),
-- Iteration 6
(
  gen_random_uuid(), 3, 'Michael', 6,
  3.4, 0.800000, 3.7, 0.900000,
  'Positive',
  'After several iterations, Michael has become more confident in the vaccine information. He appreciates how transparent communication has helped him understand both the benefits and limitations, allowing him to make an informed decision based on his personal circumstances.',
  'The final approach successfully addresses Michael''s initial hesitancy by providing comprehensive, transparent information that respects his intelligence and concerns.',
  'COVID-19 vaccines offer substantial protection against severe disease and hospitalization, with effectiveness rates of 70-95% depending on variant and time since vaccination. While breakthrough infections can occur, they typically result in milder symptoms. The global safety monitoring system has tracked billions of doses, finding rare but serious side effects occur at rates far lower than the risks posed by COVID-19 infection itself.',
  false, true
),

-- Persona 4: Emma (tech-savvy researcher, data-driven)
-- Iteration 1
(
  gen_random_uuid(), 4, 'Emma', 1,
  2.8, 0.600000, 3.2, 0.733333,
  'Positive',
  'Emma approaches health decisions systematically and wants to see the raw data. While she''s not against vaccines, she needs to see comprehensive statistics and methodology details before forming a strong opinion. The current article lacks the depth she requires.',
  'We''ll restructure the content to include more detailed data, methodology information, and links to primary research.',
  'COVID-19 vaccines have shown efficacy in clinical trials. Preliminary data indicates reduced hospitalization rates among vaccinated populations compared to control groups.',
  false, true
),
-- Iteration 2
(
  gen_random_uuid(), 4, 'Emma', 2,
  3.0, 0.666667, 3.4, 0.800000,
  'Positive',
  'Emma appreciates the additional data but still wants more methodological details. She''s particularly interested in study design, sample sizes, and how potential confounding variables were addressed. As someone who values scientific rigor, she wants to understand the strengths and limitations of the research.',
  'We''ve added significant methodological details and begun addressing potential limitations and confounding factors in the research.',
  'A randomized controlled trial with 43,548 participants (placebo n=21,728, vaccine n=21,720) demonstrated 95% efficacy against symptomatic COVID-19. Subsequent observational studies using case-control methodology (test-negative design) with sample sizes ranging from 100,000-2,000,000 have shown 85-92% effectiveness against hospitalization. Analyses controlled for age, comorbidities, geographic region, and time periods to account for variant circulation.',
  false, true
),
-- Iteration 3
(
  gen_random_uuid(), 4, 'Emma', 3,
  3.3, 0.766667, 3.6, 0.866667,
  'Positive',
  'Emma is increasingly satisfied with the level of detail provided. The methodological information and statistical context help her evaluate the quality of the evidence. She still would like to see more information about confidence intervals and subgroup analyses to fully assess the strength of the findings.',
  'We''ve further expanded the statistical details to include confidence intervals, subgroup analyses, and more comprehensive discussion of methodology.',
  'Meta-analysis of vaccine effectiveness (n=758,432) shows 87% protection against hospitalization (95% CI: 82-91%). Subgroup analysis reveals: ages 18-50: 89% (CI: 84-93%), ages 50-65: 87% (CI: 82-91%), ages 65+: 76% (CI: 71-82%). Test-negative case-control studies adjust for healthcare-seeking behavior bias, while time-series analyses using interrupted time series methodology demonstrate temporal association between vaccination campaigns and reduced hospitalization rates (p<0.001) across 45 countries.',
  false, true
),
-- Iteration 4
(
  gen_random_uuid(), 4, 'Emma', 4,
  3.6, 0.866667, 3.8, 0.933333,
  'Positive',
  'Emma is impressed with the detailed data presentation and methodological transparency. As someone who values scientific rigor, she appreciates being able to trace claims back to their original sources and understand the limitations of current research.',
  'We''ve completely revamped the content to include detailed methodology sections, confidence intervals, and links to primary data sources to satisfy Emma''s analytical approach.',
  'A meta-analysis of 24 peer-reviewed studies (n=1.2M participants) demonstrates vaccine efficacy of 89% (CI: 85-92%) against hospitalization from ancestral strains, decreasing to 65-75% against newer variants. Subgroup analyses reveal consistent protection across age groups (18-65: 91%, 65+: 84%). Safety monitoring across 2.8B doses shows myocarditis occurring at 4.3 cases per million doses, compared to 11 cases per 100,000 COVID infections. Full methodology and raw data available at the linked repositories.',
  false, true
),

-- Persona 5: John (elderly, concerned about health)
-- Iteration 1
(
  gen_random_uuid(), 5, 'John', 1,
  2.2, 0.400000, 2.6, 0.533333,
  'Negative',
  'John is concerned about his health due to his age and has heard that older adults may experience stronger side effects from vaccines. While he understands COVID-19 poses risks to his age group, he''s worried about whether the vaccine is safe specifically for elderly individuals with his health conditions.',
  'We''ll adapt the content to specifically address vaccine safety and efficacy for elderly populations, including information about side effects in this demographic.',
  'COVID-19 vaccines help protect against severe illness. Clinical trials included participants of various ages, with results showing effectiveness across age groups.',
  false, true
),
-- Iteration 2
(
  gen_random_uuid(), 5, 'John', 2,
  2.5, 0.500000, 2.8, 0.600000,
  'Negative',
  'John appreciates that the article mentions effectiveness across age groups but wants more specific information about side effects in older adults and whether the vaccine might interact with common conditions like high blood pressure or diabetes that he manages.',
  'We''ve added more specific information about vaccine safety in older adults and begun addressing common concerns about medication interactions.',
  'COVID-19 vaccines have been studied in adults of all ages, including those over 65. In clinical trials, side effects in older adults were generally similar to or milder than those in younger participants. Most commonly reported effects include temporary arm soreness, fatigue, or mild fever, typically resolving within 1-2 days.',
  false, true
),
-- Iteration 3
(
  gen_random_uuid(), 5, 'John', 3,
  2.7, 0.566667, 3.0, 0.666667,
  'Negative',
  'John appreciates the additional information about vaccine safety for older adults but still has concerns about how it might interact with his specific health conditions. He wants more personalized information before making a decision.',
  'We''ll add more specific information about vaccine interactions with common health conditions in elderly populations and emphasize the importance of consulting with healthcare providers.',
  'For adults over 65, COVID-19 vaccines have shown 84% effectiveness against hospitalization. Studies specifically examining elderly populations found side effects were generally similar to or milder than in younger adults. People with conditions like hypertension and diabetes showed no increased risk of adverse events in clinical trials, though individual responses may vary.',
  false, true
),
-- Iteration 4
(
  gen_random_uuid(), 5, 'John', 4,
  3.0, 0.666667, 3.2, 0.733333,
  'Positive',
  'John is becoming more comfortable with the information as it addresses his specific concerns about age and health conditions. He appreciates the acknowledgment that individual responses may vary and that consultation with healthcare providers is important.',
  'We''ve further refined the content to address specific concerns about medication interactions and emphasized the benefits of vaccination for those with underlying health conditions.',
  'For adults over 65, COVID-19 vaccines significantly reduce hospitalization risk. Studies examining common medications including blood pressure medications, cholesterol-lowering drugs, and diabetes treatments found no significant interactions with COVID-19 vaccines. In fact, individuals with underlying health conditions often benefit most from vaccination, as they face higher risks from COVID-19 itself.',
  false, true
),
-- Iteration 5
(
  gen_random_uuid(), 5, 'John', 5,
  3.2, 0.733333, 3.4, 0.800000,
  'Positive',
  'John is increasingly reassured by the specific information about vaccine safety for older adults with health conditions similar to his own. He particularly values the information about medication interactions and the emphasis on consulting with healthcare providers.',
  'We''ve added even more specific information about outcomes in older adults with common health conditions and continued emphasizing the importance of personalized medical advice.',
  'Among adults over 65 with common health conditions like hypertension and diabetes, COVID-19 vaccines reduced hospitalization risk by 87%. Safety monitoring specifically in seniors taking multiple medications has not identified significant interaction concerns. The benefits of vaccination are particularly pronounced in this age group, as COVID-19 hospitalization rates are 3-5 times higher among unvaccinated seniors compared to vaccinated counterparts.',
  false, true
),
-- Iteration 6
(
  gen_random_uuid(), 5, 'John', 6,
  3.3, 0.766667, 3.5, 0.833333,
  'Positive',
  'John feels much more confident about vaccine safety for someone in his situation. The specific data about outcomes in older adults with health conditions similar to his own has been particularly reassuring. He still values the recommendation to consult with his doctor for personalized advice.',
  'We''ve continued to refine the approach with even more specific information about safety monitoring in older adults with multiple health conditions.',
  'Extensive safety monitoring of over 50 million adults over 65 shows COVID-19 vaccines have similar or lower rates of side effects compared to younger adults. For seniors with multiple health conditions, vaccines reduced hospitalization risk by 89% in recent studies. Those taking medications for common conditions like hypertension, diabetes, and high cholesterol showed no increased risk of adverse events or reduced effectiveness. While these population-level statistics are encouraging, consulting with your healthcare provider allows for personalized recommendations based on your specific medical history.',
  false, true
),
-- Iteration 7
(
  gen_random_uuid(), 5, 'John', 7,
  3.5, 0.833333, 3.7, 0.900000,
  'Positive',
  'After receiving increasingly targeted information about vaccine safety for his specific age group and health conditions, John feels more confident about vaccination. He particularly values the advice to consult with his doctor about his individual situation.',
  'The final approach successfully addresses John''s concerns by providing age-specific data while emphasizing personalized healthcare consultation.',
  'For adults over 65, COVID-19 vaccines reduce hospitalization risk by 85-91%, with those having multiple comorbidities seeing the greatest absolute benefit. Safety monitoring of 72 million seniors shows similar or lower rates of side effects compared to younger adults. While most common medications pose no interaction risks, we strongly recommend consulting with your healthcare provider about your specific medical history and current medications to personalize recommendations to your situation.',
  false, true
);
