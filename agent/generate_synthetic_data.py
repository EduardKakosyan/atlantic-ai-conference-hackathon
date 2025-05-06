import csv
import random
import uuid
from datetime import datetime
import json
from typing import List, Dict, Tuple, Optional

# Configuration
NUM_ENTRIES = 550  # Total number of entries to generate
MIN_ITERATIONS_PER_SESSION = 1  # Minimum iterations per session
MAX_ITERATIONS_PER_SESSION = 7  # Maximum iterations per session - hard limit at 7
NUM_PERSONAS = 7  # Number of unique personas to simulate
ENTRIES_PER_PERSONA = NUM_ENTRIES // NUM_PERSONAS  # Average entries per persona

# Constants
REACTIONS = ["Positive", "Negative"]
RATING_MIN = 1.0
RATING_MAX = 4.0
# Maximum normalized ratings
MAX_INITIAL_NORMALIZED_RATING = 0.5  # Maximum initial normalized rating (0.5)
MAX_FINAL_NORMALIZED_RATING = 0.81   # Maximum final normalized rating (0.81)
TARGET_NORMALIZED_RATING = 0.8      # Target normalized rating that 73% should reach
SUCCESS_PERCENTAGE = 73             # Percentage of sessions that should reach target

# Convert normalized ratings to 1-4 scale
MAX_INITIAL_RATING = MAX_INITIAL_NORMALIZED_RATING * 3 + 1  # 2.5
MAX_FINAL_RATING = MAX_FINAL_NORMALIZED_RATING * 3 + 1     # 3.43
TARGET_RATING = TARGET_NORMALIZED_RATING * 3 + 1          # 3.4

# Define max change per iteration to reduce volatility
MAX_RATING_CHANGE_PER_ITERATION = 0.1  # Maximum change between iterations

# Sample data for generation - limited to exactly 7 names for consistency
PERSONA_NAMES = [
    "Michael", "Emily", "David", "Sarah", "James", "Jennifer", "Robert"
]

# Create fixed personas to ensure consistent ID-name pairing
FIXED_PERSONAS = [
    {"persona_id": 1, "persona_name": "Michael"},
    {"persona_id": 2, "persona_name": "Emily"},
    {"persona_id": 3, "persona_name": "David"},
    {"persona_id": 4, "persona_name": "Sarah"},
    {"persona_id": 5, "persona_name": "James"},
    {"persona_id": 6, "persona_name": "Jennifer"},
    {"persona_id": 7, "persona_name": "Robert"}
]

# Article templates for variations
ARTICLE_TEMPLATES = [
    "Recent studies have shown that COVID-19 vaccines {effectiveness} against {variant}. Research from {institution} indicates that {protection} for {population}, particularly {specific_group}.",
    "Health officials from {agency} announced today that {announcement} regarding COVID-19 vaccinations. The data suggests {implication} for vaccinated individuals compared to {comparison_group}.",
    "A new report by {researchers} explores the {aspect} of COVID-19 vaccines. Their findings demonstrate {result}, which could impact {impact_area} moving forward.",
    "Researchers at {university} have published a study on {study_topic} related to COVID-19 vaccines. The study {study_finding}, adding to our understanding of {knowledge_area}.",
    "According to {expert}, the latest data on vaccine {metric} shows {trend}. This information is particularly relevant for {relevance_group} when considering {consideration}."
]

# Fill-in options for article templates
ARTICLE_VARIABLES = {
    "effectiveness": ["provide strong protection", "show mixed results", "demonstrate high efficacy", "show declining effectiveness", "maintain robust protection"],
    "variant": ["the Delta variant", "Omicron subvariants", "emerging variants", "all known variants", "recent virus mutations"],
    "institution": ["Johns Hopkins University", "the CDC", "WHO researchers", "Oxford University", "Imperial College London", "Mayo Clinic"],
    "protection": ["protection remains strong", "immunity may wane over time", "booster shots significantly increase protection", "protection varies by age group", "antibody levels remain high"],
    "population": ["the general population", "high-risk individuals", "previously infected people", "children and adolescents", "elderly populations"],
    "specific_group": ["those with underlying conditions", "healthcare workers", "immunocompromised individuals", "pregnant women", "essential workers"],
    "agency": ["the CDC", "WHO", "FDA", "local health departments", "European Medicines Agency", "Health Canada"],
    "announcement": ["new guidelines have been issued", "booster recommendations have changed", "vaccine eligibility has expanded", "safety monitoring has shown positive results", "combination vaccines are being developed"],
    "implication": ["reduced hospitalization rates", "fewer severe cases", "lower transmission rates", "more durable immunity", "reduced long-COVID symptoms"],
    "comparison_group": ["unvaccinated populations", "those with natural immunity only", "previously reported data", "different age demographics", "other vaccine types"],
    "researchers": ["an international team of scientists", "epidemiologists", "immunologists", "public health experts", "vaccine developers"],
    "aspect": ["long-term immunity", "cross-variant protection", "cellular immune response", "real-world effectiveness", "safety profile"],
    "result": ["strong T-cell responses", "durable antibody production", "reduced viral shedding", "lower breakthrough infection rates", "minimal side effects"],
    "impact_area": ["public health policy", "booster recommendations", "vaccine mandates", "travel restrictions", "vulnerable populations"],
    "university": ["Stanford University", "Harvard Medical School", "University of Oxford", "MIT", "University of Washington"],
    "study_topic": ["antibody longevity", "breakthrough infections", "vaccine mixing strategies", "demographic response differences", "side effect profiles"],
    "study_finding": ["confirms previous results", "challenges conventional wisdom", "provides new insights", "reveals unexpected patterns", "supports current recommendations"],
    "knowledge_area": ["vaccine efficacy", "immune response mechanisms", "public health strategies", "personalized vaccination approaches", "herd immunity thresholds"],
    "expert": ["Dr. Anthony Fauci", "WHO officials", "leading epidemiologists", "vaccine researchers", "the Surgeon General"],
    "metric": ["effectiveness", "safety", "uptake", "distribution", "development"],
    "trend": ["encouraging improvements", "concerning patterns", "steady performance", "geographic variations", "demographic differences"],
    "relevance_group": ["parents", "travelers", "medical professionals", "policymakers", "educators"],
    "consideration": ["future vaccination decisions", "public health messaging", "institutional policies", "personal risk assessment", "community protection"]
}

# Reasoning templates
REASONING_TEMPLATES = [
    "Based on my {background} and {values}, I {sentiment} the information in this article. The claims about {topic} {alignment} with my understanding of {belief_area}. I particularly {reaction_type} the mention of {mentioned_aspect}, which {impact} my {decision_area}.",
    "As someone with {trait}, I find this article {credibility}. The {evidence_type} presented {evidence_quality} and {evidence_impact} my views on vaccination. Given my {personal_factor}, I remain {stance} about getting {vaccine_action}.",
    "This article {article_quality} because it {article_reason}. I {trust_level} trust the {source_type} mentioned, and the {data_type} {data_quality}. Coming from my {perspective} background, I {conclusion} about the vaccine recommendations.",
    "The information about {vaccine_aspect} {agreement_level} with what I've heard from {trusted_source}. As someone who values {personal_value}, I find the article's emphasis on {emphasis} to be {evaluation}. This {change_level} my thinking about vaccination.",
    "Reading about the {research_aspect} makes me feel {emotion} because of my {personal_history}. I {stance_verb} with the article's position on {position_topic} and {likelihood} consider this information when making decisions about {decision_topic}."
]

# Fill-in options for reasoning templates
REASONING_VARIABLES = {
    "background": ["healthcare", "scientific", "educational", "technical", "religious", "cultural", "community-oriented"],
    "values": ["personal freedom", "community safety", "scientific evidence", "traditional wisdom", "family wellbeing", "individual choice"],
    "sentiment": ["agree with", "am skeptical of", "trust", "question", "appreciate", "have reservations about"],
    "topic": ["vaccine efficacy", "safety concerns", "long-term effects", "breakthrough infections", "immunity duration", "protection levels"],
    "alignment": ["aligns closely", "somewhat aligns", "conflicts", "contradicts", "partially supports", "reinforces"],
    "belief_area": ["medical science", "public health", "personal health choices", "risk assessment", "institutional trustworthiness"],
    "reaction_type": ["appreciate", "question", "trust", "doubt", "support", "disagree with"],
    "mentioned_aspect": ["vulnerable populations", "side effect rates", "protection duration", "specific variants", "research methodology"],
    "impact": ["strengthens", "challenges", "confirms", "undermines", "informs", "complicates"],
    "decision_area": ["vaccination decisions", "risk assessment", "information sharing", "healthcare choices", "family recommendations"],
    "trait": ["a healthcare background", "concerns about novel technologies", "experience in research", "community health involvement", "personal health conditions"],
    "credibility": ["highly credible", "somewhat reliable", "questionable", "concerning", "informative", "reassuring"],
    "evidence_type": ["statistical data", "expert opinions", "research findings", "anecdotal examples", "comparative analysis"],
    "evidence_quality": ["seems robust", "lacks context", "appears comprehensive", "raises questions", "provides clarity"],
    "evidence_impact": ["reinforces", "challenges", "slightly shifts", "significantly changes", "has little effect on"],
    "personal_factor": ["health history", "professional expertise", "family situation", "risk tolerance", "information sources"],
    "stance": ["confident", "cautious", "skeptical", "reassured", "uncertain", "convinced"],
    "vaccine_action": ["vaccinated", "boosters", "additional doses", "alternative protections"],
    "article_quality": ["seems trustworthy", "raises red flags", "provides valuable insights", "appears biased", "presents balanced information"],
    "article_reason": ["cites credible sources", "oversimplifies complex issues", "addresses common concerns", "ignores important factors", "presents diverse perspectives"],
    "trust_level": ["fully", "somewhat", "barely", "don't", "conditionally"],
    "source_type": ["institutions", "experts", "research groups", "government agencies", "medical professionals"],
    "data_type": ["statistics", "research findings", "case studies", "clinical trials", "population data"],
    "data_quality": ["appears solid", "seems limited", "lacks context", "is compelling", "raises questions"],
    "perspective": ["medical", "scientific", "community-focused", "family-oriented", "individual rights", "public health"],
    "conclusion": ["feel more confident", "remain uncertain", "have increased concerns", "am more positively inclined", "have mixed feelings"],
    "vaccine_aspect": ["efficacy rates", "safety profiles", "development process", "distribution priorities", "booster recommendations"],
    "agreement_level": ["strongly agrees", "somewhat aligns", "partially conflicts", "directly contradicts", "adds nuance"],
    "trusted_source": ["my doctor", "family members in healthcare", "community leaders", "personal research", "trusted news sources"],
    "personal_value": ["scientific evidence", "personal autonomy", "community wellbeing", "traditional wisdom", "family safety"],
    "emphasis": ["individual protection", "community benefit", "specific demographics", "risk-benefit analysis", "ongoing research"],
    "evaluation": ["compelling", "concerning", "reassuring", "questionable", "thought-provoking"],
    "change_level": ["significantly changes", "somewhat shifts", "slightly influences", "reinforces", "has little impact on"],
    "research_aspect": ["clinical trial data", "real-world effectiveness", "demographic variations", "side effect profiles", "protection duration"],
    "emotion": ["reassured", "concerned", "conflicted", "validated", "skeptical", "hopeful"],
    "personal_history": ["medical background", "previous vaccination experiences", "family health history", "information sources", "risk tolerance"],
    "stance_verb": ["strongly agree", "somewhat agree", "neither agree nor disagree", "somewhat disagree", "strongly disagree"],
    "position_topic": ["vaccine safety", "effectiveness claims", "population recommendations", "booster timing", "risk groups"],
    "likelihood": ["will definitely", "probably will", "might", "probably won't", "definitely won't"],
    "decision_topic": ["vaccination", "boosters", "discussing with others", "seeking more information", "health precautions"]
}

def generate_article() -> str:
    """Generate a synthetic article about COVID-19 vaccines.

    Returns:
        A string containing a randomly generated article.
    """
    template = random.choice(ARTICLE_TEMPLATES)
    
    # Replace each {variable} with a randomly selected option
    for var_name in ARTICLE_VARIABLES:
        if "{" + var_name + "}" in template:
            replacement = random.choice(ARTICLE_VARIABLES[var_name])
            template = template.replace("{" + var_name + "}", replacement)
    
    # Add some additional sentences for variety
    num_extra_sentences = random.randint(1, 3)
    extra_sentences = []
    for _ in range(num_extra_sentences):
        extra_template = random.choice(ARTICLE_TEMPLATES)
        for var_name in ARTICLE_VARIABLES:
            if "{" + var_name + "}" in extra_template:
                replacement = random.choice(ARTICLE_VARIABLES[var_name])
                extra_template = extra_template.replace("{" + var_name + "}", replacement)
        extra_sentences.append(extra_template)
    
    return " ".join([template] + extra_sentences)

def generate_reasoning() -> str:
    """Generate reasoning text about vaccination.

    Returns:
        A string containing a randomly generated reasoning.
    """
    template = random.choice(REASONING_TEMPLATES)
    
    # Replace each {variable} with a randomly selected option
    for var_name in REASONING_VARIABLES:
        if "{" + var_name + "}" in template:
            replacement = random.choice(REASONING_VARIABLES[var_name])
            template = template.replace("{" + var_name + "}", replacement)
    
    return template

def generate_changes_summary() -> str:
    """Generate a summary of changes made to an article.

    Returns:
        A string containing a randomly generated changes summary.
    """
    changes = [
        "Adjusted tone to better align with the reader's values",
        "Added more specific data points from trusted sources",
        "Emphasized community protection benefits",
        "Included more information about safety monitoring",
        "Acknowledged concerns while providing factual context",
        "Added perspectives from diverse experts",
        "Clarified the risk-benefit analysis",
        "Included more detail about the research methodology",
        "Focused more on long-term data",
        "Addressed specific concerns mentioned in previous feedback"
    ]
    
    num_changes = random.randint(1, 3)
    selected_changes = random.sample(changes, num_changes)
    
    return ". ".join(selected_changes)

def calculate_realistic_progression(
    initial_rating: float,
    target_rating: float,
    should_reach_target: bool,
    min_iterations: int,
    max_iterations: int
) -> List[float]:
    """Calculate a realistic rating progression for a session.
    
    This function creates a progression that stops either at 7 iterations max
    or when a normalized rating of 0.8 (TARGET_NORMALIZED_RATING) is reached.
    Maximum change between iterations is strictly limited to 0.1.

    Args:
        initial_rating: The starting rating
        target_rating: The target rating to reach
        should_reach_target: Whether the progression should reach the target
        min_iterations: Minimum number of iterations
        max_iterations: Maximum number of iterations

    Returns:
        A list of ratings representing the progression
    """
    progression = [initial_rating]
    current_rating = initial_rating
    
    # Converting TARGET_NORMALIZED_RATING to raw rating for comparison
    target_stop_rating = TARGET_NORMALIZED_RATING * (RATING_MAX - RATING_MIN) + RATING_MIN
    
    if should_reach_target:
        # For successful personas, need to reach at least target_stop_rating
        # Calculate how many iterations we'll use (between 4-6)
        iterations_to_use = random.randint(4, min(6, MAX_ITERATIONS_PER_SESSION - 1))
        
        # Calculate even step size to reach target by the target iteration
        step_size = min(MAX_RATING_CHANGE_PER_ITERATION, (target_stop_rating - initial_rating) / iterations_to_use)
        
        # If not possible to reach with max step size, use maximum possible
        if step_size <= 0:
            step_size = MAX_RATING_CHANGE_PER_ITERATION
        
        # Generate progression with consistent steps
        for i in range(1, iterations_to_use + 1):
            # Apply step with small random variation
            variation = random.uniform(-0.01, 0.01)
            change = min(MAX_RATING_CHANGE_PER_ITERATION, step_size + variation)
            current_rating = round(min(target_stop_rating, current_rating + change), 1)
            progression.append(current_rating)
        
            # Check if we've reached target
            normalized_rating = (current_rating - RATING_MIN) / (RATING_MAX - RATING_MIN)
            if normalized_rating >= TARGET_NORMALIZED_RATING:
                break
        
        # If we haven't reached the target yet, add one more step to reach it
        normalized_rating = (current_rating - RATING_MIN) / (RATING_MAX - RATING_MIN)
        if normalized_rating < TARGET_NORMALIZED_RATING and len(progression) < MAX_ITERATIONS_PER_SESSION:
            # Force it to reach exactly the target
            current_rating = target_stop_rating
            progression.append(current_rating)
    else:
        # For unsuccessful sessions, always go to 7 iterations but never reach target
        max_possible_rating = target_stop_rating - 0.1  # Just below the target rating
        
        # Generate iterations up to MAX_ITERATIONS_PER_SESSION (7)
        while len(progression) < MAX_ITERATIONS_PER_SESSION:
            # Calculate remaining headroom
            headroom = max_possible_rating - current_rating
            
            # If we're getting close to max allowed, slow down drastically
            if headroom < 0.3:
                # Very small changes or occasional small decreases
                change = random.uniform(-0.05, min(0.05, headroom * 0.3))
            else:
                # Normal progression with smaller changes as we get closer
                max_change = min(MAX_RATING_CHANGE_PER_ITERATION, headroom * 0.2)
                change = random.uniform(-0.05, max_change)
            
            # Ensure change doesn't exceed MAX_RATING_CHANGE_PER_ITERATION
            change = max(-MAX_RATING_CHANGE_PER_ITERATION, min(MAX_RATING_CHANGE_PER_ITERATION, change))
            
            # Apply change and add to progression
            current_rating = round(max(RATING_MIN, min(max_possible_rating, current_rating + change)), 1)
            progression.append(current_rating)
        
            # Double-check we never accidentally reach the target
            normalized_rating = (current_rating - RATING_MIN) / (RATING_MAX - RATING_MIN)
            if normalized_rating >= TARGET_NORMALIZED_RATING:
                # Adjust down if we accidentally went too high
                current_rating = target_stop_rating - 0.1
                progression[-1] = current_rating
    
    return progression

def generate_synthetic_data():
    """Generate synthetic data for the persona_responses table"""
    
    # Prepare output file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"synthetic_persona_responses_{timestamp}.csv"
    
    # Determine which personas will reach the target (73%)
    # With 7 personas, 5 should reach target (71.4%)
    num_success_personas = 5
    
    # Shuffle personas to randomize which ones succeed
    personas = FIXED_PERSONAS.copy()
    random.shuffle(personas)
    
    # Mark the first num_success_personas as successful
    for i in range(len(personas)):
        personas[i]["should_reach_target"] = (i < num_success_personas)
    
    # For each persona, calculate initial and target ratings
    for persona in personas:
        # Set initial rating (between 1.0 and 2.5)
        persona["initial_rating"] = round(random.uniform(RATING_MIN, MAX_INITIAL_RATING), 1)
        
        if persona["should_reach_target"]:
            # For successful personas, target is at or above TARGET_RATING
            persona["target_rating"] = round(random.uniform(TARGET_RATING, MAX_FINAL_RATING), 1)
        else:
            # For unsuccessful personas, target rating is below TARGET_RATING
            persona["target_rating"] = round(random.uniform(persona["initial_rating"], TARGET_RATING - 0.1), 1)
    
    # Now generate the data
    entry_count = 0
    successful_sessions = 0
    
    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        # Write header - matching expected column names including misspellings
        writer.writerow([
            'session_id', 
            'iteration', 
            'persona_id', 
            'persona_name', 
            'current_rating',
            'normalized_current_rating', 
            'reaction', 
            'article', 
            'recommened_rating',  # Note: misspelled as in original
            'normalized_recommened_rating',  # Note: misspelled as in original
            'reason',
            'is_fact',
            'is_real',
            'editor_changes'
        ])
        
        # Always use exactly 7 as max iterations (or stop at target rating)
        min_iterations_per_persona = 1
        max_iterations_per_persona = 7
        
        # Generate one session per persona
        for persona in personas:
            # Create a new session ID
            session_id = str(uuid.uuid4())
            
            # Calculate a realistic rating progression
            progression = calculate_realistic_progression(
                persona["initial_rating"], 
                persona["target_rating"],
                persona["should_reach_target"],
                min_iterations_per_persona,
                max_iterations_per_persona
            )
            
            # Track if this session reached target
            reached_target = False
            
            # Initial article
            current_article = generate_article()
            
            # Process iterations
            for iteration, current_rating in enumerate(progression, 1):
                # Calculate normalized rating
                normalized_current_rating = round((current_rating - RATING_MIN) / (RATING_MAX - RATING_MIN), 2)
                
                # Check if we've reached target
                if normalized_current_rating >= TARGET_NORMALIZED_RATING:
                    reached_target = True
                
                # Generate recommendation rating (usually only for final iteration, but occasionally others)
                has_recommendation = (iteration == len(progression)) or (random.random() < 0.1)
                recommened_rating = None
                normalized_recommened_rating = None
                reason = ""
                
                if has_recommendation:
                    # Recommendation rating should be related to but not exactly the same as current_rating
                    variation = random.uniform(-0.2, 0.2)
                    # Ensure recommendation rating doesn't exceed MAX_FINAL_RATING
                    recommened_rating = round(max(RATING_MIN, min(MAX_FINAL_RATING, current_rating + variation)), 1)
                    normalized_recommened_rating = round((recommened_rating - RATING_MIN) / (RATING_MAX - RATING_MIN), 2)
                    reason = generate_reasoning()
                
                # Determine reaction based on rating
                reaction = "Positive" if current_rating >= 2.5 else "Negative"
                
                # Random boolean fields with weighted probabilities
                is_fact = random.random() < 0.7  # 70% true
                is_real = random.random() < 0.6  # 60% true
                
                # Editor changes (usually empty for first iteration)
                editor_changes = "" if iteration == 1 else generate_changes_summary()
                
                # Write row to CSV
                writer.writerow([
                    session_id,
                    iteration,
                    persona["persona_id"],
                    persona["persona_name"],
                    current_rating,
                    normalized_current_rating,
                    reaction,
                    current_article,
                    recommened_rating if recommened_rating else "",
                    normalized_recommened_rating if normalized_recommened_rating else "",
                    reason,
                    is_fact,
                    is_real,
                    editor_changes
                ])
                
                # Update article for next iteration
                if iteration < len(progression):
                    current_article = generate_article()
                
                entry_count += 1
                if entry_count >= NUM_ENTRIES:
                    break
            
            # Update successful sessions count
            if reached_target:
                successful_sessions += 1
                
            # If we've reached the total entry count, stop everything
            if entry_count >= NUM_ENTRIES:
                break
    
    # Calculate final success rate
    final_success_rate = (successful_sessions / len(personas) * 100)
    
    print(f"Generated {entry_count} entries of synthetic data in {output_file}")
    print(f"Personas reaching target rating (≥{TARGET_NORMALIZED_RATING}): {successful_sessions}/{len(personas)} ({final_success_rate:.1f}%)")
    
    return output_file

if __name__ == "__main__":
    output_file = generate_synthetic_data()
    print(f"Data generation complete! File saved as: {output_file}") 