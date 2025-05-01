'use client';

// Import types only
export interface PersonaData {
  id: string;
  persona_id: number;
  persona_name: string;
  iteration: number;
  current_rating: number;
  normalized_current_rating: number;
  recommened_rating: number;
  normalized_recommened_rating: number;
  reaction: string;
  reason: string;
  editor_changes: string;
  article: string;
  is_fake: boolean;
  is_real: boolean;
}

// Mock data (typed for development)
// In a real app, this would come from an API or database
const mockData: PersonaData[] = [
  {
    "id": "3efac521-a8ce-45f6-966a-42165b4166fc",
    "persona_id": 1,
    "persona_name": "Brian",
    "iteration": 1,
    "current_rating": 1.0,
    "normalized_current_rating": 0.000000,
    "recommened_rating": 1.5,
    "normalized_recommened_rating": 0.166667,
    "reaction": "Negative",
    "reason": "Brian is skeptical about the information presented in the article because it comes from health authorities, towards whom he nurtures a level of distrust. As an individual who values personal risk assessment and individual liberty, he wouldn't be easily swayed by claims of strong protection offered by COVID-19 vaccines. His previous experiences and beliefs have led him to question the effectiveness of repeated COVID-19 boosters.",
    "editor_changes": "In response to Brian's skepticism, we're adopting a tone that respects his autonomy while gently offering alternative perspectives.",
    "article": "Recent studies have shown that COVID-19 vaccines provide protection against severe illness. The data from health authorities indicates that vaccinated individuals are less likely to require hospitalization compared to unvaccinated individuals.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "0159901b-9713-45df-8e9b-aeeb67cd961a",
    "persona_id": 1,
    "persona_name": "Brian",
    "iteration": 2,
    "current_rating": 1.2,
    "normalized_current_rating": 0.066667,
    "recommened_rating": 1.7,
    "normalized_recommened_rating": 0.233333,
    "reaction": "Negative",
    "reason": "Brian remains highly skeptical of the article's claims. He feels that the information is still coming from sources he doesn't trust, and the article doesn't address his specific concerns about potential long-term effects of vaccines. He also questions whether the data has been selectively presented to support a pro-vaccine narrative.",
    "editor_changes": "We've begun acknowledging some limitations in current research while maintaining factual accuracy about vaccine benefits. We're also shifting away from authority-based claims to focus more on the data itself.",
    "article": "Studies tracking vaccine outcomes have found that protection against severe COVID-19 illness persists even as protection against infection may wane. While research continues on long-term effects, current safety monitoring has not identified significant concerns in populations followed for over a year post-vaccination.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "52cefeff-5cf2-483c-b8cb-436510e13eb0",
    "persona_id": 1,
    "persona_name": "Brian",
    "iteration": 3,
    "current_rating": 1.4,
    "normalized_current_rating": 0.133333,
    "recommened_rating": 1.8,
    "normalized_recommened_rating": 0.266667,
    "reaction": "Negative",
    "reason": "Brian acknowledges some of the information provided but remains unconvinced. He appreciates the slightly more balanced approach but still feels that the article underplays potential risks and overstates benefits. He wants to see more acknowledgment of individual choice and risk assessment rather than general recommendations.",
    "editor_changes": "We're further reducing reliance on authority-based messaging and introducing more information about how individuals might assess their personal risk-benefit ratio.",
    "article": "COVID-19 vaccines have shown effectiveness against severe outcomes in most population groups. Individuals may want to consider factors such as their age, health status, and exposure risk when evaluating vaccination. While most side effects resolve quickly, monitoring systems continue to track outcomes across diverse populations.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "dc9e751e-2240-4044-9c2e-17dfeb40ae55",
    "persona_id": 1,
    "persona_name": "Brian",
    "iteration": 4,
    "current_rating": 1.6,
    "normalized_current_rating": 0.200000,
    "recommened_rating": 2.0,
    "normalized_recommened_rating": 0.333333,
    "reaction": "Negative",
    "reason": "Brian still has significant reservations but notices the article is beginning to present a more nuanced view. He remains concerned about what he perceives as downplaying of adverse events and questions whether natural immunity is being given sufficient consideration as an alternative approach.",
    "editor_changes": "We've incorporated more information about the body's natural immune response while maintaining scientific accuracy, and have acknowledged both benefits and limitations more explicitly.",
    "article": "Both vaccination and natural infection stimulate immune responses against COVID-19. Vaccine clinical trials measured outcomes across diverse participants, documenting both effectiveness rates and potential side effects. Safety monitoring systems have tracked rare adverse events, which occur at significantly lower rates than serious complications from COVID-19 infection itself.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "dd0cdd0e-0f60-4e30-9c79-1880ac8032de",
    "persona_id": 1,
    "persona_name": "Brian",
    "iteration": 5,
    "current_rating": 1.8,
    "normalized_current_rating": 0.266667,
    "recommened_rating": 2.2,
    "normalized_recommened_rating": 0.400000,
    "reaction": "Negative",
    "reason": "Brian continues to be skeptical but is beginning to consider alternative viewpoints. He still has concerns about potential side effects and questions the need for boosters given his good health. He values personal choice and remains cautious about accepting recommendations from health authorities.",
    "editor_changes": "We've adjusted the article to include more data points and acknowledge concerns about side effects, while emphasizing the scientific process and transparency of clinical trials.",
    "article": "Clinical trials have demonstrated that COVID-19 vaccines are generally safe for most individuals. While side effects may occur, they are typically mild and short-lived. Research continues to monitor long-term outcomes, with data so far showing favorable safety profiles.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "a421ff8e-ee15-480c-b80e-dc65461596a6",
    "persona_id": 1,
    "persona_name": "Brian",
    "iteration": 6,
    "current_rating": 2.0,
    "normalized_current_rating": 0.333333,
    "recommened_rating": 2.4,
    "normalized_recommened_rating": 0.466667,
    "reaction": "Negative",
    "reason": "Brian is becoming more receptive to the information as it acknowledges more of his concerns. He appreciates the balanced presentation of both benefits and potential drawbacks. However, he still wants more emphasis on personal choice rather than universal recommendations.",
    "editor_changes": "We've shifted the article to focus more on empowering individual decision-making rather than making blanket recommendations, while still providing accurate scientific information.",
    "article": "Individuals face different levels of risk from COVID-19 based on factors like age and health status. Similarly, vaccine experiences vary between people. Current data shows serious adverse events are rare, occurring at rates of less than 1 in 100,000 doses, while COVID-19 hospitalization risks for unvaccinated adults range from 1-5% depending on age and health factors. These comparisons may help in personal decision-making.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "90c5d592-b8ef-4831-92c5-4a0b9b08bb38",
    "persona_id": 1,
    "persona_name": "Brian",
    "iteration": 7,
    "current_rating": 2.2,
    "normalized_current_rating": 0.400000,
    "recommened_rating": 2.6,
    "normalized_recommened_rating": 0.533333,
    "reaction": "Negative",
    "reason": "Brian finds the revised article more balanced and appreciates the acknowledgment of individual risk assessment. He still has some reservations but is more willing to consider the information presented now that it respects his autonomy and addresses some of his concerns about oversimplification.",
    "editor_changes": "We've continued to refine the approach by providing more granular data about risk-benefit ratios for different demographic groups while emphasizing personal agency.",
    "article": "COVID-19 affects different populations with varying levels of severity. For adults under 50 without underlying conditions, the risk of severe outcomes from infection is lower but still present. Vaccine protection against severe disease ranges from 70-90% depending on timing and variants. Both vaccination decisions and alternative protective measures involve weighing personal circumstances and values.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "888c664f-6d88-443d-af7b-3975cf978b12",
    "persona_id": 1,
    "persona_name": "Brian",
    "iteration": 8,
    "current_rating": 2.3,
    "normalized_current_rating": 0.433333,
    "recommened_rating": 2.8,
    "normalized_recommened_rating": 0.600000,
    "reaction": "Negative",
    "reason": "Brian is increasingly receptive to the information as it continues to present a balanced view that respects his values of personal liberty and informed choice. He appreciates the acknowledgment of both benefits and limitations without making him feel pressured into a specific decision.",
    "editor_changes": "We've refined the content to further emphasize transparency about both what is known and unknown in current research, while providing tools for individual risk assessment.",
    "article": "Current research indicates vaccines can reduce risk of severe COVID-19 outcomes, though effectiveness varies by individual factors. Some questions about long-term immunity remain under study. When making health decisions, considering your specific risk factors, personal health history, and values can help determine which protective strategies make the most sense for your situation.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "d97d1fec-2f5f-412c-8b6d-b1ae990ca34c",
    "persona_id": 1,
    "persona_name": "Brian",
    "iteration": 9,
    "current_rating": 2.5,
    "normalized_current_rating": 0.500000,
    "recommened_rating": 3.0,
    "normalized_recommened_rating": 0.666667,
    "reaction": "Negative",
    "reason": "After multiple iterations, Brian is more open to considering the benefits of vaccination, though he maintains that individual risk assessment is crucial. He appreciates information that acknowledges both potential benefits and risks, allowing him to make an informed decision based on his personal health situation.",
    "editor_changes": "The final approach respects Brian's desire for autonomy while providing balanced information about both benefits and risks, emphasizing personal risk assessment rather than universal recommendations.",
    "article": "COVID-19 vaccination offers varying levels of protection depending on individual factors such as age, health status, and underlying conditions. While studies show benefits for reducing severe outcomes, individuals should consider their personal risk profile when making health decisions. Both vaccination and non-pharmaceutical interventions play roles in personal and public health strategies.",
    "is_fake": false,
    "is_real": true
  }
];

export const getPersonaData = (personaName: string): PersonaData[] => {
  return mockData.filter((item: PersonaData) => item.persona_name === personaName);
};

export const getAvailablePersonas = (): string[] => {
  const personas = new Set<string>();
  mockData.forEach((item: PersonaData) => {
    personas.add(item.persona_name);
  });
  return Array.from(personas);
};

export default mockData; 