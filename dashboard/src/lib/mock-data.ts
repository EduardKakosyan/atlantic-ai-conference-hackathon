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
  // Brian
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
  },
  
  // Sarah
  {
    "id": "d995c7b9-4b98-4ad4-816b-067fb7c842fc",
    "persona_id": 2,
    "persona_name": "Sarah",
    "iteration": 1,
    "current_rating": 3.2,
    "normalized_current_rating": 0.733333,
    "recommened_rating": 3.5,
    "normalized_recommened_rating": 0.833333,
    "reaction": "Positive",
    "reason": "As a medical professional, Sarah appreciates evidence-based information about vaccines. She finds the article credible and aligns with her understanding of vaccine efficacy. However, she feels the article could include more detailed scientific data to strengthen its messaging.",
    "editor_changes": "We'll enhance the scientific content and include more specific data points to appeal to Sarah's medical background.",
    "article": "COVID-19 vaccines have demonstrated efficacy in reducing hospitalizations according to recent clinical trials. Initial studies indicate a significant reduction in severe outcomes among vaccinated populations.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "725b775e-d450-4a92-b046-b0e44e56a81f",
    "persona_id": 2,
    "persona_name": "Sarah",
    "iteration": 2,
    "current_rating": 3.5,
    "normalized_current_rating": 0.833333,
    "recommened_rating": 3.8,
    "normalized_recommened_rating": 0.933333,
    "reaction": "Positive",
    "reason": "Sarah is pleased with the additional scientific details but would appreciate even more specific data about efficacy rates and confidence intervals. As someone who communicates with patients daily, she wants information that can help address specific concerns raised by vaccine-hesitant individuals.",
    "editor_changes": "We've added more specific efficacy data and begun addressing common concerns that Sarah might encounter when discussing vaccines with patients.",
    "article": "Phase 3 clinical trials showed COVID-19 vaccines reduced symptomatic disease by approximately 94-95% in initial studies. Subsequent real-world data has confirmed strong protection against severe outcomes, with effectiveness against hospitalization remaining around 85-90% across most age groups. Safety monitoring has identified rare adverse events at rates significantly lower than complications from COVID-19 infection.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "669cb40a-fce9-4b46-8bd2-5abeb8da9bfe",
    "persona_id": 2,
    "persona_name": "Sarah",
    "iteration": 3,
    "current_rating": 3.8,
    "normalized_current_rating": 0.933333,
    "recommened_rating": 4.0,
    "normalized_recommened_rating": 1.000000,
    "reaction": "Positive",
    "reason": "Sarah is very satisfied with the revised content that includes specific efficacy data and addresses potential concerns with scientific evidence. As a healthcare provider, she finds this information valuable for communicating with her patients about vaccine benefits.",
    "editor_changes": "We've incorporated more specific clinical trial data and efficacy statistics to provide the level of detail Sarah appreciates as a medical professional.",
    "article": "Phase 3 clinical trials involving over 40,000 participants showed COVID-19 vaccines reduced the risk of symptomatic infection by 94-95%. Recent meta-analyses confirm these findings, with vaccinated individuals showing 87% lower risk of hospitalization across all age groups. These results remain consistent across multiple variants, though with some reduced efficacy against newer strains.",
    "is_fake": false,
    "is_real": true
  },
  
  // Michael
  {
    "id": "9e793227-518c-4e45-831b-61f3538873bd",
    "persona_id": 3,
    "persona_name": "Michael",
    "iteration": 1,
    "current_rating": 2.0,
    "normalized_current_rating": 0.333333,
    "recommened_rating": 2.0,
    "normalized_recommened_rating": 0.333333,
    "reaction": "Negative",
    "reason": "Michael feels overwhelmed by conflicting information about COVID-19 vaccines. The article seems reasonable but doesn't address his primary concerns about how quickly vaccines were developed and fears about technology he doesn't understand.",
    "editor_changes": "We'll address concerns about the speed of vaccine development and provide clear explanations of mRNA technology in simple terms.",
    "article": "COVID-19 vaccines underwent standard testing procedures despite faster development timelines. The quicker timeline was possible due to technological advances and unprecedented global cooperation, not by skipping safety steps.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "d8f0db2c-beb7-48dd-a3b3-1dfeebd5c76a",
    "persona_id": 3,
    "persona_name": "Michael",
    "iteration": 2,
    "current_rating": 2.5,
    "normalized_current_rating": 0.500000,
    "recommened_rating": 2.4,
    "normalized_recommened_rating": 0.466667,
    "reaction": "Negative",
    "reason": "Michael appreciated the explanation about the development timeline but still has concerns about potential unknown long-term effects. He feels torn between fears of COVID-19 and uncertainty about the vaccine technology.",
    "editor_changes": "We'll address concerns about long-term monitoring and explain why scientists are confident about long-term safety based on historical vaccine development knowledge.",
    "article": "While COVID-19 vaccines were developed faster than previous vaccines, they rely on decades of prior research. The mRNA technology used in some vaccines has been studied since the 1990s. Additionally, vaccine side effects typically emerge within days or weeks, not years. Extensive monitoring systems continue tracking vaccinated populations to ensure safety.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "26f9a31e-48c5-402e-865a-9940572808e4",
    "persona_id": 3,
    "persona_name": "Michael",
    "iteration": 3,
    "current_rating": 2.8,
    "normalized_current_rating": 0.600000,
    "recommened_rating": 2.9,
    "normalized_recommened_rating": 0.633333,
    "reaction": "Positive",
    "reason": "Michael feels reassured by the explanation about the technology's history and the information about side effects typically appearing quickly. He still has some hesitation but is becoming more comfortable with the idea of vaccination.",
    "editor_changes": "We'll continue building on Michael's growing comfort by providing simple analogies to explain vaccine technology and addressing remaining practical concerns he might have.",
    "article": "The mRNA in COVID-19 vaccines works like a temporary instruction manual that teaches your immune system to recognize the virus without causing infection. This technology has been refined through years of research before the pandemic. Most vaccine side effects occur within 6 weeks, which is why clinical trials waited at least this long before concluding initial safety studies.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "5b8c1252-e19d-4bb2-9792-9b7c71c740d7",
    "persona_id": 3,
    "persona_name": "Michael",
    "iteration": 4,
    "current_rating": 3.0,
    "normalized_current_rating": 0.666667,
    "recommened_rating": 3.2,
    "normalized_recommened_rating": 0.733333,
    "reaction": "Positive",
    "reason": "Michael appreciates the clear analogies that help him understand how the vaccines work. The information about the timing of side effects makes logical sense to him and addresses one of his major concerns about unknown future effects.",
    "editor_changes": "We'll maintain the clear explanations while adding some practical information about the benefits of vaccination that might resonate with Michael's daily concerns.",
    "article": "COVID-19 vaccines teach your immune system to recognize the virus without causing disease, similar to how a fire drill prepares people for a real emergency without using actual fire. Safety monitoring continues after vaccine approval, with billions of doses administered worldwide providing robust data on safety. The protection offered helps reduce risk of severe illness and may reduce risk of long-term complications from COVID-19 infection.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "7e7f08bd-8364-4d1e-a3b0-7199b3a58b07",
    "persona_id": 3,
    "persona_name": "Michael",
    "iteration": 5,
    "current_rating": 3.3,
    "normalized_current_rating": 0.766667,
    "recommened_rating": 3.5,
    "normalized_recommened_rating": 0.833333,
    "reaction": "Positive",
    "reason": "Michael feels much more comfortable with the idea of vaccination now. The fire drill analogy made the technology easier to understand, and he appreciates the information about ongoing safety monitoring. The mention of reducing long-term COVID complications is particularly compelling to him.",
    "editor_changes": "For this final iteration, we'll emphasize the global safety data and address any lingering concerns about how to weigh personal benefits against perceived risks.",
    "article": "With billions of COVID-19 vaccine doses administered worldwide, safety monitoring continues to show that serious adverse events are rare. For most individuals, the risk of complications from COVID-19 infection is significantly higher than risks from vaccination. The protection vaccines offer against severe illness helps people avoid hospitalization and reduces the chance of developing persistent symptoms after infection.",
    "is_fake": false,
    "is_real": true
  },
  
  // Linda
  {
    "id": "afbd48cd-b2c9-4527-9181-ba15f17939ec",
    "persona_id": 4,
    "persona_name": "Linda",
    "iteration": 1,
    "current_rating": 1.5,
    "normalized_current_rating": 0.166667,
    "recommened_rating": 1.0,
    "normalized_recommened_rating": 0.000000,
    "reaction": "Negative",
    "reason": "Linda is deeply distrustful of the article because it contradicts information she's seen in alternative media sources that she trusts. She believes that vaccines may cause more harm than good and that natural immunity is being purposely downplayed. The mainstream source of the information makes her automatically skeptical.",
    "editor_changes": "While maintaining scientific accuracy, we'll acknowledge concerns about natural immunity and frame information in ways that don't directly challenge Linda's existing beliefs.",
    "article": "Some immunity develops after natural COVID-19 infection, though studies show that protection levels vary between individuals. Researchers continue studying both natural and vaccine-induced immunity to understand protection duration and effectiveness.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "5053f667-ffd5-4535-b4a9-cd45a19a83ec",
    "persona_id": 4,
    "persona_name": "Linda",
    "iteration": 2,
    "current_rating": 1.6,
    "normalized_current_rating": 0.200000,
    "recommened_rating": 1.2,
    "normalized_recommened_rating": 0.066667,
    "reaction": "Negative",
    "reason": "Linda slightly appreciates the acknowledgment of natural immunity but still distrusts the overall message. She believes the article is still pushing vaccines while downplaying their risks. She's particularly concerned about ingredients and possible long-term fertility effects that she's read about online.",
    "editor_changes": "We'll address specific concerns about vaccine ingredients and reproductive health while emphasizing individual health decisions rather than universal recommendations.",
    "article": "When considering immunity options, some people look into both post-infection and vaccine-induced protection. COVID-19 vaccine ingredients are publicly listed and leave the body within days or weeks. Reproductive health specialists have not found evidence of fertility impacts in vaccinated populations, though research continues on all aspects of COVID-19.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "4b3ee3c3-6bde-4c24-9471-b9a09f77a3ae",
    "persona_id": 4,
    "persona_name": "Linda",
    "iteration": 3,
    "current_rating": 1.8,
    "normalized_current_rating": 0.266667,
    "recommened_rating": 1.5,
    "normalized_recommened_rating": 0.166667,
    "reaction": "Negative",
    "reason": "Linda remains skeptical but is slightly more receptive to considering the information. She appreciates that the article is less pushy and acknowledges her concerns, but still believes there are risks being hidden from the public. She questions why natural remedies and alternative treatments aren't being discussed.",
    "editor_changes": "We'll maintain factual accuracy while discussing a broader range of health approaches that might resonate with Linda's interest in alternative health perspectives.",
    "article": "Many people take various approaches to supporting their immune health during the pandemic. Some focus on nutrition, supplements, and lifestyle factors alongside considering vaccination options. Research continues on multiple protective strategies, with different approaches potentially offering complementary benefits for overall health resilience.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "7d68afe9-9f1d-4e57-9a4d-c35c1b6f25a1",
    "persona_id": 4,
    "persona_name": "Linda",
    "iteration": 4,
    "current_rating": 2.0,
    "normalized_current_rating": 0.333333,
    "recommened_rating": 1.8,
    "normalized_recommened_rating": 0.266667,
    "reaction": "Negative",
    "reason": "Linda is appreciative that the article now acknowledges a more holistic approach to health, which aligns better with her worldview. She remains wary of vaccination but is less defensive when presented with information that doesn't seem to have an agenda. She still has significant reservations about vaccines specifically.",
    "editor_changes": "We'll continue providing balanced information that respects personal choice while gently addressing common misconceptions without directly challenging Linda's beliefs.",
    "article": "Personal health decisions involve weighing various factors based on individual circumstances and values. Some people incorporate multiple strategies to support their health, from nutrition and lifestyle practices to preventive measures. While different approaches exist, comparing relative risks of various choices with trusted healthcare providers can help with personal decision-making.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "4ca3f7ad-22e7-40ae-ae17-b0fa32ae4fc0",
    "persona_id": 4,
    "persona_name": "Linda",
    "iteration": 5,
    "current_rating": 2.2,
    "normalized_current_rating": 0.400000,
    "recommened_rating": 2.0,
    "normalized_recommened_rating": 0.333333,
    "reaction": "Negative",
    "reason": "Linda finds the most recent article less threatening to her worldview, though she still maintains significant reservations about vaccines themselves. She appreciates the emphasis on personal choice and the acknowledgment that there are multiple approaches to health. While she remains skeptical of mainstream medical recommendations, she feels her perspective is being respected.",
    "editor_changes": "In this final approach, we'll maintain the emphasis on informed personal choice while providing factual information about relative risks that Linda can consider without feeling pressured.",
    "article": "Health decisions often involve weighing potential benefits against potential risks based on individual situations. Some people consult multiple sources of information and consider their unique health history when making choices. Transparent discussions about both COVID-19 infection risks and prevention method considerations can help people navigate health decisions in ways that align with their personal values.",
    "is_fake": false,
    "is_real": true
  },
  
  // David
  {
    "id": "2a83d304-04e5-471c-8bd1-3289b4f2dd46",
    "persona_id": 5,
    "persona_name": "David",
    "iteration": 1,
    "current_rating": 2.5,
    "normalized_current_rating": 0.500000,
    "recommened_rating": 2.0,
    "normalized_recommened_rating": 0.333333,
    "reaction": "Negative",
    "reason": "David appreciates the scientific approach of the article but is concerned about potential conflicts of interest in vaccine development and distribution. As someone who values transparency and fairness, he wants more information about how vaccines have been tested across diverse populations and whether profit motives might influence public health recommendations.",
    "editor_changes": "We'll address concerns about transparency in testing and development while providing more context about the research process.",
    "article": "COVID-19 vaccines underwent clinical trials with diverse participant groups to ensure safety and efficacy across different populations. The accelerated development process maintained standard safety protocols while removing administrative delays. Trial results were reviewed by independent scientific committees before authorization.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "e5e25c64-3a6e-4ada-a51c-9e00ec689093",
    "persona_id": 5,
    "persona_name": "David",
    "iteration": 2,
    "current_rating": 2.8,
    "normalized_current_rating": 0.600000,
    "recommened_rating": 2.5,
    "normalized_recommened_rating": 0.500000,
    "reaction": "Positive",
    "reason": "David appreciates the additional information about the review process and diversity in clinical trials. He still has some concerns about corporate influence on health policy but finds the information more balanced and transparent. This approach respects his desire for fairness and ethical considerations.",
    "editor_changes": "We'll continue addressing issues of equity and transparency while providing more specific information about oversight mechanisms.",
    "article": "Independent advisory committees review vaccine safety data before and after approval, providing an additional layer of oversight beyond manufacturer testing. These committees include experts without financial ties to vaccine manufacturers. Clinical trials included participants from diverse racial, ethnic, and age groups to ensure safety and efficacy across populations.",
    "is_fake": false,
    "is_real": true
  },
  {
    "id": "8f60bbf4-f3cc-4c1a-bda1-217af5d6a15c",
    "persona_id": 5,
    "persona_name": "David",
    "iteration": 3,
    "current_rating": 3.2,
    "normalized_current_rating": 0.733333,
    "recommened_rating": 3.0,
    "normalized_recommened_rating": 0.666667,
    "reaction": "Positive",
    "reason": "David finds this information substantively addressing his concerns about independent oversight and diverse testing. The specific details about committee composition and trial demographics demonstrate the transparency he values. While he maintains a healthy skepticism about large systems, he appreciates evidence of ethical safeguards.",
    "editor_changes": "For this final version, we'll address global equity concerns while maintaining the focus on transparency and ethical oversight.",
    "article": "Vaccine safety monitoring continues through multiple independent systems that track outcomes across diverse populations. These systems can detect even very rare side effects once vaccines are widely used. While challenges remain in ensuring global vaccine equity, the scientific evaluation process includes rigorous reviews by independent experts focused on safety data rather than commercial interests.",
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