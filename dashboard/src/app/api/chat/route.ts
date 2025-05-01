import { streamText, tool } from 'ai';
import { azure } from '@/lib/azure/azure-openai';
import { createGoogleDoc } from './tools/google-docs';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = streamText({
    model: azure('gpt-4o-mini'),
    system: 'You are a helpful assistant.',
    messages,
    tools: {
      createGoogleDoc: tool({
        description: 'Create a new Google Doc',
        parameters: z.object({
          title: z.string().describe('The title of the document to create'),
        }),
        execute: async ({ title }) => {
          const url = await createGoogleDoc(title);
          return {
            url,
            type: 'text/plain',
          };
        },
      }),
    },
    maxSteps: 2,
  });

  return result.toDataStreamResponse();
}