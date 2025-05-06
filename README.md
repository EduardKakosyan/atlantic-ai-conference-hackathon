# Atlantic AI Summit 2025 Code Challenge

**Position:** 1st Place  
**Team:** _[HealthByte]_  
- **Member 1:** Huy Huynh, huy.huynh@dal.ca, [GitHub](https://github.com/GHuyHuynh) 
- **Member 2:** Hao Tang, hao.tang@dal.ca, [GitHub](https://github.com/haotangphuoc) 
- **Member 3:** Tobi Onibudo, tobi.onibudo@dal.ca, [GitHub](https://github.com/TobiOnibudo)
- **Member 4:** Eduard Kakosyan, kakosyaneduard@dal.ca
---

## Overview

On May 2, our team participated in the **AI in Healthcare Challenge** at the Atlantic AI Summit 2025. Twenty university student teams from across Atlantic Canada gathered to address one of public health's greatest challenges: understanding how healthcare information—including misinformation—shapes medical decision-making. Over the course of just 60 hours, we designed and implemented a novel, AI-driven solution to simulate and influence public reactions to healthcare content.

## The Challenge

Participants were tasked with creating an ethical, scalable approach to generate behavioral insights and counter misinformation in public health messaging. Teams used Large Language Model (LLM)-based agents to model how individuals with diverse backgrounds respond to both real and fabricated healthcare articles.

## Our Solution

We developed a two-agent, reinforcement-style workflow:

1. **Persona Agent**  
   - Loads persona profiles from a JSON object, each profile capturing demographics, beliefs, and prior attitudes.
   - Reads one of five base articles, then reacts with:
     - An **Acceptance Rate** (numeric score)  
     - A **Sentiment Reaction** (positive or negative)  
     - A **Reasoning Summary**  
   - Powered by the reasoning-capable **o4-mini** model.

2. **Editor Agent**  
   - Receives the persona agent's reaction and score.  
   - Edits the original article to improve its persuasiveness for that persona.  
   - Outputs a revised article that the persona agent evaluates in the next iteration.

3. **Reinforcement Loop**  
   - Repeats the read–react–edit cycle until either a target rating is reached or a maximum of 15 iterations completes.  
   - Each iteration refines the article, boosting its impact on public sentiment.

This pipeline helps Nova Scotia writers, reporters, and healthcare communicators optimize messaging for different audiences and combat misinformation effectively.

## Dashboard

To visualize our results and interact with simulated personas, we built a companion dashboard:

🔗 https://healthbyte-dashboard.vercel.app/  

Features include:
- Real-time persona rating trajectories  
- Comparison of baseline vs. edited articles  
- Interactive persona queries

## Acknowledgments

- Atlantic AI Summit 2025 organizing committee and mentors  
- Industry and government judges
---

_Thank you for exploring our project!_
