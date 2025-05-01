import os
import json
import csv
import uuid
import difflib
from datetime import datetime
from typing import Dict, List, Tuple
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Debug: Print the current working directory and check if .env exists
print(f"Current working directory: {os.getcwd()}")
print(f".env file exists: {os.path.exists('.env')}")

# Get API key and validate
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError(
        "OPENAI_API_KEY not found in environment variables. "
        "Please make sure you have a .env file with OPENAI_API_KEY=your_key_here "
        "in the same directory as this script."
    )

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

class Agent:
    def __init__(self, persona: Dict, role: str):
        self.persona = persona
        self.role = role
        self.session_id = str(uuid.uuid4())
        self.current_rating = persona["beliefs_attitudes"]["initial_vaccine_stance"]
        self.history = []
        self.memory = []  # Store previous interactions

    def get_prompt(self, article: str = None) -> str:
        if self.role == "user":
            # Create memory context
            memory_context = ""
            if self.memory:
                memory_context = "\nPrevious interactions:\n"
                for i, (prev_article, prev_reaction, prev_rating) in enumerate(self.memory[-3:], 1):
                    memory_context += f"\nInteraction {i}:\nArticle: {prev_article}\nReaction: {prev_reaction}\nRating: {prev_rating}\n"

            return f"""Take on the persona provided in the JSON object and react to a new news article related to COVID-19. This involves reading and analyzing the article, then formulating a response based on the persona's traits and prior beliefs, especially regarding vaccinations.

You will receive:
1. A JSON object detailing a persona.
2. A set of articles already in the persona's knowledge base. 
3. A new article for analysis.

Your task is to:
- Read the provided news article carefully.
- Based on the persona's details, react either positively or negatively to the article.
- Update the persona's vaccination acceptance score accordingly.
- Provide a detailed reasoning for your reaction (5-10 sentences within 1 paragraph), considering the persona's educational background, personality traits, socioeconomic status, marital status, prior beliefs/experiences, and vaccination acceptance score.

Current Session ID: {self.session_id}
Current Rating: {self.current_rating}/4

Your persona details:
{json.dumps(self.persona, indent=2)}
{memory_context}

Please read the following article and provide your reaction:

Article:
{article}

Format your response EXACTLY as follows:
REACTION: [Positive/Negative]
RATING: [number between 1 and 4]
REASONING: [5-10 sentences explaining your reaction based on your persona]"""

        else:  # editor
            # Create memory context for editor
            memory_context = ""
            if self.memory:
                memory_context = "\nPrevious article versions and user reactions:\n"
                for i, (prev_article, prev_reaction, prev_rating) in enumerate(self.memory[-3:], 1):
                    memory_context += f"\nVersion {i}:\nArticle: {prev_article}\nUser Reaction: {prev_reaction}\nRating: {prev_rating}\n"

            return f"""Improve the article by reacting to a user's response to an article by incorporating details from the user persona and the article to create an enhanced version that achieves a higher score.

Current Session ID: {self.session_id}
Current User Rating: {self.current_rating}/4

User Persona:
{json.dumps(self.persona, indent=2)}
{memory_context}

Previous article:
{article}

Your task is to:
1. Understand the User Persona: Focus on Brian's skepticism about vaccines, his concerns about long-term effects, his trust in alternative sources, and his value of personal liberty.
2. Analyze the Existing Response: The current article hasn't resonated with him - he finds it too aligned with mainstream narratives he distrusts.
3. Extract Key Points from the Article: Keep factual information but present it differently.
4. Reformulate the Response: Rewrite the article to better appeal to someone skeptical of authorities, emphasizing individual choice, addressing concerns about long-term effects, and using language that respects his independence.
5. Ensure Consistency and Coherence: The article should still be factual but framed to better align with his worldview and information preferences.

Return TWO distinct sections as follows:

CHANGES_SUMMARY: [A brief 2-3 sentence summary of what specific changes you are making to the article and why]

ARTICLE: [The full improved article text]

The goal is to increase his vaccine acceptance rating above his current level of {self.current_rating}/4."""

    def process_response(self, response: str) -> Tuple[str, float, str]:
        if self.role == "user":
            try:
                # Extract reaction
                reaction = response.split("REACTION:")[1].split("RATING:")[0].strip()
                
                # Extract rating and handle different formats
                rating_str = response.split("RATING:")[1].split("REASONING:")[0].strip()
                # Handle cases like "4/4" or "4"
                rating = float(rating_str.split("/")[0])
                
                # Extract reasoning
                reasoning = response.split("REASONING:")[1].strip()
                
                # Validate rating is within bounds
                if not 1 <= rating <= 4:
                    print(f"Warning: Rating {rating} out of bounds, clamping to valid range")
                    rating = max(1, min(4, rating))
                
                return reaction, rating, reasoning
            except Exception as e:
                print(f"Error processing response: {e}")
                print(f"Raw response: {response}")
                # Return default values in case of error
                return "Error processing response", self.current_rating, "Error in response format"
        else:
            try:
                # Extract article and changes summary
                changes_summary = response.split("CHANGES_SUMMARY:")[1].split("ARTICLE:")[0].strip()
                article = response.split("ARTICLE:")[1].strip()
                return article, None, changes_summary
            except Exception as e:
                print(f"Error processing editor response: {e}")
                print(f"Raw response: {response}")
                # Return the raw response as article if parsing fails
                return response.strip(), None, "Error extracting changes summary"

    def add_to_memory(self, article: str, reaction: str = None, rating: float = None):
        self.memory.append((article, reaction, rating))

def generate_diff_summary(old_text: str, new_text: str) -> str:
    """Generate a summary of differences between two texts."""
    diff = difflib.ndiff(old_text.splitlines(), new_text.splitlines())
    changes = []
    
    for line in diff:
        if line.startswith('- '):
            changes.append(f"Removed: {line[2:]}")
        elif line.startswith('+ '):
            changes.append(f"Added: {line[2:]}")
    
    return "\n".join(changes[:5]) + ("\n..." if len(changes) > 5 else "")

class Simulation:
    def __init__(self, persona: Dict, max_iterations: int = 10, target_rating: float = 0.8):
        self.user_agent = Agent(persona, "user")
        self.editor_agent = Agent(persona, "editor")
        self.max_iterations = max_iterations
        self.target_rating = target_rating
        self.current_article = """Recent studies have shown that COVID-19 vaccines continue to provide strong protection against severe illness and hospitalization. The latest data from health authorities indicates that vaccinated individuals are significantly less likely to experience severe symptoms or require hospitalization compared to unvaccinated individuals. This protection is particularly important for older adults and those with underlying health conditions."""
        self.output_file = f"simulation_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        self._initialize_csv()

    def _initialize_csv(self):
        with open(self.output_file, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                'session_id', 'iteration', 'persona_name', 'current_rating',
                'reaction', 'reasoning', 'article', 'editor_changes'
            ])

    def _log_iteration(self, iteration: int, reaction: str, rating: float, reasoning: str, editor_changes: str = ""):
        with open(self.output_file, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                self.user_agent.session_id,
                iteration,
                self.user_agent.persona['persona_name'],
                rating,
                reaction,
                reasoning,
                self.current_article,
                editor_changes
            ])

    def run(self):
        iteration = 0
        while iteration < self.max_iterations:
            print(f"\n{'='*50}")
            print(f"Iteration {iteration + 1}/{self.max_iterations}")
            print(f"Current rating: {self.user_agent.current_rating}")
            print(f"{'='*50}\n")
            
            # User agent reads and reacts to article
            user_prompt = self.user_agent.get_prompt(self.current_article)
            user_response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": user_prompt}]
            ).choices[0].message.content
            
            reaction, rating, reasoning = self.user_agent.process_response(user_response)
            self.user_agent.current_rating = rating
            self.user_agent.history.append((reaction, rating, reasoning))
            
            # Add to memory
            self.user_agent.add_to_memory(self.current_article, reaction, rating)
            
            # Log the iteration (without editor changes yet)
            self._log_iteration(iteration, reaction, rating, reasoning)
            
            print(f"User reaction: {reaction}")
            print(f"New rating: {rating}")
            print(f"Reasoning: {reasoning}")
            
            # Normalize rating to 0-1 scale for comparison with target_rating
            normalized_rating = (rating - 1) / 3  # Convert 1-4 scale to 0-1 scale
            
            # Check if target rating is reached
            if normalized_rating >= self.target_rating:
                print(f"Target rating {self.target_rating} (normalized from 1-4 scale) reached at iteration {iteration}")
                break
            
            # Editor agent edits the article
            editor_prompt = self.editor_agent.get_prompt(self.current_article)
            editor_response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": editor_prompt}]
            ).choices[0].message.content
            
            old_article = self.current_article
            edited_article, _, editor_changes = self.editor_agent.process_response(editor_response)
            self.current_article = edited_article
            
            # Generate and display diff summary
            diff_summary = generate_diff_summary(old_article, edited_article)
            
            # Update the CSV log with editor changes
            with open(self.output_file, 'r', newline='') as f:
                rows = list(csv.reader(f))
            
            if len(rows) > 1:  # Check if we have more than just the header row
                rows[-1][-1] = editor_changes  # Update the last row's editor_changes column
                
                with open(self.output_file, 'w', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerows(rows)
            
            # Add to editor's memory
            self.editor_agent.add_to_memory(self.current_article, reaction, rating)
            
            print(f"\nEditor's Changes Summary:")
            print(f"{editor_changes}")
            print(f"\nUpdated Article:")
            print(f"{edited_article[:200]}...") # Print the first 200 chars of the article
            
            iteration += 1
        
        return self.user_agent.history

def main():
    # Example persona
    persona = {
    "persona_name": "Brian",
    "description": "Middle-Aged, Skeptical, Hesitant",
    "demographics": {
      "age": 45,
      "gender": "Male",
      "location": "Dartmouth, NS",
      "occupation": "Electrician",
      "education": "Trade Certificate/College Diploma",
      "grounding_notes": "Represents the large 15-64 working-age demographic; Trade certification is a common educational path."
    },
    "personality": {
      "conceptual_archetype": "Moderate Openness, Lower Agreeableness, Higher skepticism/value on independence.",
      "notes": ""
    },
    "beliefs_attitudes": {
      "initial_vaccine_stance": 2,
      "stance_description": "Probably No",
      "grounding_notes_stance": "Represents a segment of the population hesitant about boosters or further vaccination.",
      "trust_levels": {
        "federal_provincial_government": "Low",
        "pharmaceutical_companies": "Low",
        "mainstream_media_news": "Low",
        "online_social_circles_alternative_news": "Moderate",
        "immediate_healthcare_providers": "Moderate (for specific issues)",
        "broader_public_health_system": "Low"
      },
      "grounding_notes_trust": "Lower trust in government and media is common, especially among those relying on non-traditional sources; Distrust of pharma is a cited reason for hesitancy.",
      "specific_concerns_narratives": [
        "Concerned about unknown long-term side effects of mRNA vaccines.",
        "Feels the risks of COVID-19 for healthy middle-aged people are often overstated.",
        "Worries about potential side effects interfering with work.",
        "Questions the necessity and effectiveness of repeated boosters."
      ],
      "key_motivator": "Avoiding perceived vaccine risks outweighs perceived disease risk."
    },
    "information_sources": [
      "Social media feeds",
      "YouTube channels",
      "Online forums",
      "Word-of-mouth",
      "Alternative news sites",
      "Mainstream news headlines (occasional glance)"
    ],
    "relevant_values": [
      "Individual liberty/autonomy",
      "Self-reliance",
      "Skepticism of authority (government and corporate)",
      "Personal risk assessment over collective mandates"
    ],
    "narrative": "Brian is an electrician living in Dartmouth. He got the initial two COVID shots mainly because of travel and social pressures but has skipped subsequent boosters. He spends time online reading forums and watching videos that question the official narrative on vaccine safety and effectiveness, finding mainstream news untrustworthy. He's concerned about potential long-term health impacts that might not be known yet and feels healthy enough to handle COVID if he gets it. He dislikes feeling pressured by public health officials and prefers to make his own choices based on his research and gut feeling."

    }
    
    # Run simulation
    sim = Simulation(persona)
    history = sim.run()
    
    print(f"\nSimulation completed. Results saved to {sim.output_file}")
    print("Final history:", history)

if __name__ == "__main__":
    main() 