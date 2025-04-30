'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAllPersonaResponses() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('persona_responses')
    .select('*')
  
  if (error) {
    throw new Error(`Error fetching persona responses: ${error.message}`)
  }
  
  return data
}
