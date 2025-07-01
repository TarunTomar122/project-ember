import * as openaiService from './openai';
import * as geminiService from './gemini';

// Available AI providers
export const AI_PROVIDERS = {
  OPENAI: 'openai',
  GEMINI: 'gemini'
};

// Default provider
let currentProvider = AI_PROVIDERS.GEMINI;

/**
 * Get the current AI provider
 * @returns {string} - Current provider name
 */
export function getCurrentProvider() {
  return currentProvider;
}

/**
 * Set the current AI provider
 * @param {string} provider - Provider name (openai or gemini)
 */
export function setProvider(provider) {
  if (Object.values(AI_PROVIDERS).includes(provider)) {
    currentProvider = provider;
  } else {
    throw new Error(`Invalid provider: ${provider}`);
  }
}

/**
 * Get available providers that are configured
 * @returns {Array} - Array of configured provider objects
 */
export function getAvailableProviders() {
  const providers = [];
  
  if (openaiService.isConfigured()) {
    providers.push({
      id: AI_PROVIDERS.OPENAI,
      name: 'OpenAI GPT-3.5',
      configured: true
    });
  }
  
  if (geminiService.isConfigured()) {
    providers.push({
      id: AI_PROVIDERS.GEMINI,
      name: 'Google Gemini 2.5 Flash',
      configured: true
    });
  }
  
  return providers;
}

/**
 * Check if current provider is configured
 * @returns {boolean} - Whether the current provider is configured
 */
export function isCurrentProviderConfigured() {
  switch (currentProvider) {
    case AI_PROVIDERS.OPENAI:
      return openaiService.isConfigured();
    case AI_PROVIDERS.GEMINI:
      return geminiService.isConfigured();
    default:
      return false;
  }
}

/**
 * Expand text using the current provider
 * @param {string} selectedText - The text to expand
 * @returns {Promise<string>} - The expanded text
 */
export async function expandText(selectedText) {
  if (!isCurrentProviderConfigured()) {
    throw new Error(`${currentProvider} is not configured. Please check your API key.`);
  }

  switch (currentProvider) {
    case AI_PROVIDERS.OPENAI:
      return await openaiService.expandText(selectedText);
    case AI_PROVIDERS.GEMINI:
      return await geminiService.expandText(selectedText);
    default:
      throw new Error(`Unknown provider: ${currentProvider}`);
  }
}

/**
 * Get the display name for a provider
 * @param {string} providerId - Provider ID
 * @returns {string} - Display name
 */
export function getProviderDisplayName(providerId) {
  switch (providerId) {
    case AI_PROVIDERS.OPENAI:
      return 'OpenAI GPT-3.5';
    case AI_PROVIDERS.GEMINI:
      return 'Google Gemini 2.5 Flash';
    default:
      return providerId;
  }
} 