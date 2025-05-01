import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PersonaData } from "./mock-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMessageTime(date: Date = new Date()): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Converts JSON data from string format to TypeScript constants
 * @param jsonData JSON string containing persona data
 * @returns Array of PersonaData objects with proper typing
 */
export function convertJsonToPersonaData(jsonData: string): PersonaData[] {
  try {
    const parsedData = JSON.parse(jsonData);
    
    return parsedData.map((item: any) => ({
      id: item.id,
      persona_id: Number(item.persona_id),
      persona_name: item.persona_name,
      iteration: Number(item.iteration),
      current_rating: Number(item.current_rating),
      normalized_current_rating: Number(item.normalized_current_rating),
      recommened_rating: Number(item.recommened_rating),
      normalized_recommened_rating: Number(item.normalized_recommened_rating),
      reaction: item.reaction,
      reason: item.reason,
      editor_changes: item.editor_changes,
      article: item.article,
      is_fake: Boolean(item.is_fake),
      is_real: Boolean(item.is_real)
    }));
  } catch (error) {
    console.error("Error parsing JSON data:", error);
    return [];
  }
}
