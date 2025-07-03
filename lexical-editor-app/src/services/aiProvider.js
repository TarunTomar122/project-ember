import * as openaiService from './openai';
import * as geminiService from './gemini';
import { $getRoot } from 'lexical';

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
      name: 'gpt-4.1-nano-2025-04-14',
      configured: true
    });
  }
  
  if (geminiService.isConfigured()) {
    providers.push({
      id: AI_PROVIDERS.GEMINI,
      name: 'gemini-2.5-flash-preview-05-20',
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
 * @param {string} fullContext - The full document context
 * @param {string} tone - The tone option for expansion
 * @returns {Promise<Object>} - The expanded text result
 */
export async function expandText(selectedText, fullContext = '', tone = 'same_tone') {
  if (!isCurrentProviderConfigured()) {
    throw new Error(`${currentProvider} is not configured. Please check your API key.`);
  }

  switch (currentProvider) {
    case AI_PROVIDERS.OPENAI:
      return await openaiService.expandText(selectedText, fullContext, tone);
    case AI_PROVIDERS.GEMINI:
      return await geminiService.expandText(selectedText, fullContext, tone);
    default:
      throw new Error(`Unknown provider: ${currentProvider}`);
  }
}

/**
 * Rewrite text using the current provider
 * @param {string} selectedText - The text to rewrite
 * @param {string} fullContext - The full document context
 * @param {string} tone - The tone option for rewriting
 * @returns {Promise<Object>} - The rewritten text result
 */
export async function rewriteText(selectedText, fullContext = '', tone = 'improve_tone') {
  if (!isCurrentProviderConfigured()) {
    throw new Error(`${currentProvider} is not configured. Please check your API key.`);
  }

  switch (currentProvider) {
    case AI_PROVIDERS.OPENAI:
      return await openaiService.rewriteText(selectedText, fullContext, tone);
    case AI_PROVIDERS.GEMINI:
      return await geminiService.rewriteText(selectedText, fullContext, tone);
    default:
      throw new Error(`Unknown provider: ${currentProvider}`);
  }
}

/**
 * Describe/analyze text using the current provider
 * @param {string} selectedText - The text to describe/analyze
 * @param {string} fullContext - The full document context
 * @returns {Promise<Object>} - The analysis result
 */
export async function describeText(selectedText, fullContext = '') {
  if (!isCurrentProviderConfigured()) {
    throw new Error(`${currentProvider} is not configured. Please check your API key.`);
  }

  switch (currentProvider) {
    case AI_PROVIDERS.OPENAI:
      return await openaiService.describeText(selectedText, fullContext);
    case AI_PROVIDERS.GEMINI:
      return await geminiService.describeText(selectedText, fullContext);
    default:
      throw new Error(`Unknown provider: ${currentProvider}`);
  }
}

/**
 * Get tone options for the current provider
 * @returns {Object} - Tone options and labels
 */
export function getToneOptions() {
  switch (currentProvider) {
    case AI_PROVIDERS.OPENAI:
      return {
        options: openaiService.TONE_OPTIONS,
        labels: openaiService.TONE_LABELS
      };
    case AI_PROVIDERS.GEMINI:
      return {
        options: geminiService.TONE_OPTIONS,
        labels: geminiService.TONE_LABELS
      };
    default:
      return {
        options: { SAME_TONE: 'same_tone' },
        labels: { 'same_tone': 'Keep Same Tone' }
      };
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
      return 'gpt-4.1-nano-2025-04-14';
    case AI_PROVIDERS.GEMINI:
      return 'gemini-2.5-flash-preview-05-20';
    default:
      return providerId;
  }
}

/**
 * Extract full document context from the editor
 * @param {Object} editor - The Lexical editor instance
 * @returns {Promise<string>} - The full document text
 */
export async function getFullDocumentContext(editor) {
  return new Promise((resolve) => {
    editor.getEditorState().read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      resolve(textContent);
    });
  });
} 