import os
import json
import csv
import uuid
import difflib
from datetime import datetime
from typing import Dict, List, Tuple
from openai import OpenAI
from dotenv import load_dotenv
from supabase import create_client, Client

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

# Supabase connection parameters from environment variables
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

class Agent:
    def __init__(self, persona_data: Dict, role: str):
        # Extract persona from the new format
        self.persona = persona_data["persona"]
        self.articles_read = persona_data.get("articles_read", [])
        self.role = role
        self.session_id = str(uuid.uuid4())
        
        # Convert initial_vaccine_stance to numeric if it's not already
        initial_stance = self.persona["beliefs_attitudes"]["initial_vaccine_stance"]
        if isinstance(initial_stance, str):
            # Map string stances to numeric values
            stance_map = {
                "Strongly supportive": 4,
                "Supportive but data-focused": 3.5,
                "Hesitant": 2.5,
                "Skeptical but open": 2,
                "Strongly opposed": 1
            }
            self.current_rating = stance_map.get(initial_stance, 2.5)
        else:
            self.current_rating = float(initial_stance)
            
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

            # Add previously read articles context
            articles_context = ""
            if self.articles_read:
                articles_context = "\nArticles already in persona's knowledge base:\n"
                for i, article_info in enumerate(self.articles_read[:2], 1):  # Limit to first 2 articles
                    articles_context += f"\nArticle {i}: {article_info['article']}\n"

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
{articles_context}
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
1. Understand the User Persona: Focus on {self.persona["persona_name"]}'s perspective on vaccines, concerns, trusted sources, and core values.
2. Analyze the Existing Response: The current article hasn't resonated well with the user.
3. Extract Key Points from the Article: Keep factual information but present it differently.
4. Reformulate the Response: Rewrite the article to better appeal to this user, considering their specific trust levels, concerns, and values.
5. Ensure Consistency and Coherence: The article should still be factual but framed to better align with their worldview and information preferences.

Return TWO distinct sections as follows:

CHANGES_SUMMARY: [A brief 2-3 sentence summary of what specific changes you are making to the article and why]

ARTICLE: [The full improved article text]

The goal is to increase the user's vaccine acceptance rating above their current level of {self.current_rating}/4."""

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
    def __init__(self, persona_data: Dict, max_iterations: int = 10, target_rating: float = 0.8, use_db: bool = True):
        self.user_agent = Agent(persona_data, "user")
        self.editor_agent = Agent(persona_data, "editor")
        self.max_iterations = max_iterations
        self.target_rating = target_rating
        self.use_db = use_db
        self.current_article = """Recent studies have shown that COVID-19 vaccines continue to provide strong protection against severe illness and hospitalization. The latest data from health authorities indicates that vaccinated individuals are significantly less likely to experience severe symptoms or require hospitalization compared to unvaccinated individuals. This protection is particularly important for older adults and those with underlying health conditions."""
        
        # Set up Supabase connection if enabled
        self.supabase = None
        if self.use_db:
            if supabase_url and supabase_key:
                try:
                    self.supabase = create_client(supabase_url, supabase_key)
                    print("Successfully connected to Supabase")
                except Exception as e:
                    print(f"Supabase connection error: {e}")
                    print("Falling back to CSV output")
                    self.use_db = False
            else:
                print("Supabase URL or key missing, falling back to CSV output")
                self.use_db = False
        
        # Initialize CSV as fallback or if DB is disabled
        if not self.use_db:
            self.output_file = f"simulation_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            self._initialize_csv()

    def _initialize_csv(self):
        with open(self.output_file, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                'session_id', 'iteration', 'persona_id', 'persona_name', 'current_rating',
                'normalized_current_rating', 'reaction', 'article'
            ])

    def _log_to_supabase(self, iteration: int, reaction: str, rating: float, article: str, recommended_rating: float = None):
        """Log iteration results to Supabase"""
        if not self.supabase:
            return
        
        try:
            # Calculate normalized ratings (1-4 scale to 0-1 scale)
            normalized_rating = (rating - 1) / 3
            normalized_recommended = (recommended_rating - 1) / 3 if recommended_rating else None
            
            # Create data object
            data = {
                "persona_id": self.user_agent.persona.get("persona_id", 0),
                "persona_name": self.user_agent.persona["persona_name"],
                "iteration": iteration,
                "current_rating": rating,
                "normalized_current_rating": normalized_rating,
                "recommened_rating": recommended_rating,
                "normalized_recommened_rating": normalized_recommended,
                "reaction": reaction,
                "article": article
            }
            
            # Insert into Supabase
            result = self.supabase.table("persona_responses").insert(data).execute()
            
            # Check for errors
            if hasattr(result, 'error') and result.error:
                raise Exception(result.error)
                
        except Exception as e:
            print(f"Supabase error when logging: {e}")
            # If Supabase fails, log to CSV as backup
            if not hasattr(self, 'output_file'):
                self.output_file = f"backup_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
                self._initialize_csv()
            self._log_to_csv(iteration, reaction, rating, article)

    def _log_to_csv(self, iteration: int, reaction: str, rating: float, article: str):
        """Log iteration results to CSV file"""
        normalized_rating = (rating - 1) / 3  # Convert 1-4 scale to 0-1 scale
        
        with open(self.output_file, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                self.user_agent.session_id,
                iteration,
                self.user_agent.persona.get("persona_id", "unknown"),
                self.user_agent.persona["persona_name"],
                rating,
                normalized_rating,
                reaction,
                article
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
            
            # Log the iteration
            if self.use_db:
                self._log_to_supabase(iteration, reaction, rating, self.current_article)
            else:
                self._log_to_csv(iteration, reaction, rating, self.current_article)
            
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
            
            # Add to editor's memory
            self.editor_agent.add_to_memory(self.current_article, reaction, rating)
            
            print(f"\nEditor's Changes Summary:")
            print(f"{editor_changes}")
            print(f"\nUpdated Article:")
            print(f"{edited_article[:200]}...") # Print the first 200 chars of the article
            
            iteration += 1
            
        return self.user_agent.history

def load_personas(file_path='repo/personas.json'):
    """Load personas from JSON file"""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading personas from {file_path}: {e}")
        # Try alternate path
        try:
            with open('personas.json', 'r') as f:
                return json.load(f)
        except Exception as e2:
            print(f"Error loading personas from alternate path: {e2}")
            return []

def main():
    # Load personas from file
    personas = load_personas()
    
    if not personas:
        print("No personas found. Using default persona.")
        # Example persona (fallback)
        persona_data = {
            "persona": {
                "persona_name": "Brian",
                "persona_id": 999,
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
        }
        personas_to_run = [persona_data]
    else:
        # Use all personas from the file
        personas_to_run = personas
    
    # Check for Supabase parameters and determine whether to use DB
    use_db = all([os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY")])
    
    print(f"Running simulations for {len(personas_to_run)} personas")
    
    results = []
    # Run simulation for each persona
    for i, persona_data in enumerate(personas_to_run):
        print(f"\nSimulating persona {i+1}/{len(personas_to_run)}: {persona_data['persona']['persona_name']}")
        
        # Run simulation
        sim = Simulation(persona_data, use_db=use_db)
        history = sim.run()
        results.append({
            'persona_name': persona_data['persona']['persona_name'],
            'persona_id': persona_data['persona'].get('persona_id', f"unknown_{i}"),
            'final_rating': sim.user_agent.current_rating,
            'history': history
        })
        
        # Output individual result
        if hasattr(sim, 'output_file'):
            print(f"Simulation completed. Results saved to {sim.output_file}")
        else:
            print("Simulation completed. Results saved to Supabase.")
        
        print(f"Final rating: {sim.user_agent.current_rating}/4")
    
    # Output summary
    print("\n=== SIMULATION SUMMARY ===")
    for result in results:
        print(f"Persona: {result['persona_name']} (ID: {result['persona_id']}) - Final Rating: {result['final_rating']}/4")

if __name__ == "__main__":
    main() 