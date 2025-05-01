import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Get Supabase credentials
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

print(f"SUPABASE_URL exists: {supabase_url is not None}")
print(f"SUPABASE_KEY exists: {supabase_key is not None}")

if not supabase_url or not supabase_key:
    print("Missing Supabase credentials. Please check your .env file")
    exit(1)

# Initialize Supabase client
try:
    supabase = create_client(supabase_url, supabase_key)
    print("Successfully created Supabase client")
except Exception as e:
    print(f"Failed to create Supabase client: {e}")
    exit(1)

# Test with data matching the correct schema
table_name = "persona_responses_duplicate"
try:
    print(f"\nTesting insert with correct schema fields")
    
    # Create test data matching exactly the schema constraints
    test_data = {
        "persona_id": 999,
        "persona_name": "Test Persona",
        "iteration": 1,  # Must be 1-10
        "current_rating": 2.5,
        "normalized_current_rating": 0.5,
        "recommened_rating": 3.0,  # Note misspelled column name
        "normalized_recommened_rating": 0.67,  # Note misspelled column name
        "reaction": "Positive",  # Must be 'Positive' or 'Negative'
        "reason": "Test reasoning",
        "article": "Test article content",
        "is_fact": True,  # Required
        "is_real": True   # Required
    }
    
    print(f"Attempting insert with schema-compliant data")
    result = supabase.table(table_name).insert(test_data).execute()
    print("Success! Insert accepted.")
    print(f"Returned data ID: {result.data[0]['id'] if result.data else 'No data'}")
    
except Exception as e:
    print(f"Error with schema-compliant insert: {e}")

# Test the specific fields needed for our simulation
print("\nTesting a simplified set matching our simulation needs:")
try:
    simple_data = {
        "persona_id": 999,
        "persona_name": "Test Persona",
        "iteration": 1,
        "current_rating": 2.5,
        "normalized_current_rating": 0.5,
        "reaction": "Positive",
        "is_fact": True,
        "is_real": True
    }
    
    print(f"Attempting simplified insert")
    result = supabase.table(table_name).insert(simple_data).execute()
    print("Success! Simplified insert accepted.")
    
except Exception as e:
    print(f"Error with simplified insert: {e}") 