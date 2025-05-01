import { createAzure } from '@ai-sdk/azure';

const azure_resource_name = process.env.AZURE_RESOURCE_NAME;
const azure_api_key = process.env.AZURE_API_KEY;
const azure_api_version = process.env.AZURE_API_VERSION;

if (!azure_resource_name || !azure_api_key || !azure_api_version) {
  throw new Error('AZURE_RESOURCE_NAME and AZURE_API_KEY and AZURE_API_VERSION must be set');
}

export const azure = createAzure({
  resourceName: azure_resource_name,
  apiKey: azure_api_key,
  apiVersion: azure_api_version,
});