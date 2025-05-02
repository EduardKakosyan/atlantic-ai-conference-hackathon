import { streamText, tool } from 'ai';
import { createGoogleDoc } from './tools/google-docs';
import { z } from 'zod';
import { createAzure } from '@ai-sdk/azure';

const azure_resource_name = process.env.AZURE_RESOURCE_NAME || "";
const azure_api_key = process.env.AZURE_API_KEY || "";
const azure_api_version = process.env.AZURE_API_VERSION || "";

if (!azure_resource_name || !azure_api_key || !azure_api_version) {
  throw new Error('AZURE_RESOURCE_NAME and AZURE_API_KEY and AZURE_API_VERSION must be set');
}

const azure = createAzure({
  resourceName: azure_resource_name,
  apiKey: azure_api_key,
  apiVersion: azure_api_version,
});

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