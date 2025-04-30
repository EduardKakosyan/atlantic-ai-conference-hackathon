# Vaccine Acceptance Simulation

This project implements an agent-based simulation using OpenAI's GPT-4 to model how targeted information influences an individual's stance on vaccine acceptance. The simulation involves two agents:

1. A user agent with a specific persona (demographics, personality traits, and initial beliefs)
2. An editor agent that attempts to improve articles to increase the user's vaccine acceptance

## Setup

1. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the project root with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Usage

Run the simulation:
```bash
python simulation.py
```

The simulation will:
- Create a unique session ID for each run
- Run for up to 10 iterations or until the target vaccine acceptance rating (0.8) is reached
- Save results to a CSV file with timestamp in the filename
- Print progress and final results to the console

## Output

The simulation generates a CSV file with the following columns:
- session_id: Unique identifier for the simulation run
- iteration: Current iteration number
- persona_name: Name of the persona being simulated
- current_rating: Current vaccine acceptance rating (1-4)
- reaction: User agent's reaction to the article
- article: The article text at this iteration

## Customization

You can modify the simulation parameters in `simulation.py`:
- Change the max_iterations (default: 10)
- Adjust the target_rating (default: 0.8)
- Modify the initial article
- Create new personas by modifying the persona dictionary in the main() function 