import { convertJsonToPersonaData } from '@/lib/utils';
import jsonData from '../../mock/mock-data.json';

// Import types only
export interface PersonaData {
  id: string;
  session_id: string;
  persona_id: number;
  persona_name: string;
  iteration: number;
  current_rating: number;
  normalized_current_rating: number;
  recommened_rating: number | null;
  normalized_recommened_rating: number | null;
  reaction: string;
  reason: string | null;
  editor_changes: string | null;
  article: string | null;
  is_fact: boolean;
  is_real: boolean;
}

const personaData: PersonaData[] = convertJsonToPersonaData(jsonData);

export const getPersonaData = (personaName: string): PersonaData[] => {
  return personaData.filter((item: PersonaData) => item.persona_name === personaName);
};

export const getAvailablePersonas = (): string[] => {
  const personas = new Set<string>();
  personaData.forEach((item: PersonaData) => {
    personas.add(item.persona_name);
  });
  return Array.from(personas);
};

export default personaData; 