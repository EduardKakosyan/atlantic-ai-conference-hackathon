'use server';

import { createStreamableValue } from 'ai/rsc';
import { CoreMessage, streamText } from 'ai';
import { createAzure } from '@ai-sdk/azure';

const azure_resource_name = process.env.AZURE_RESOURCE_NAME!;
const azure_api_key = process.env.AZURE_API_KEY!;
const azure_api_version = process.env.AZURE_API_VERSION!;

const azure = createAzure({
  resourceName: azure_resource_name,
  apiKey: azure_api_key,
  apiVersion: azure_api_version,
});

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Streaming Chat 
export async function continueTextConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: azure('gpt-4o-mini'),
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
